import 'dart:async';
import 'dart:io';
import 'dart:typed_data';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:slowtok_camera/api.dart';
import 'package:slowtok_camera/cameras.dart';
import 'package:slowtok_camera/models.dart';
import 'package:image/image.dart' as img;

// ignore: constant_identifier_names
const INTERVAL_DURATION = Duration(minutes: 5);

void useInterval(VoidCallback callback, Duration delay) {
  final savedCallback = useRef(callback);
  savedCallback.value = callback;

  useEffect(() {
    final timer = Timer.periodic(delay, (_) => savedCallback.value());
    return timer.cancel;
  }, [delay]);
}

// ignore: must_be_immutable
class StreamScreen extends HookConsumerWidget {
  final Stream stream;
  CameraController? controller;
  StreamScreen(this.stream, {super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ValueNotifier<bool> hasAccess = useState(false);
    ValueNotifier<bool> capturing = useState(false);
    ValueNotifier<XFile?> lastImage = useState(null);
    ValueNotifier<int> imagesTaken = useState(0);

    useEffect(() {
      controller = CameraController(cameras[0], ResolutionPreset.medium);
      controller!.initialize().then((_) {
        hasAccess.value = true;
        controller?.pausePreview();
      });
      return () {
        controller?.dispose();
      };
    }, []);

    useInterval(() async {
      if (!hasAccess.value || controller == null) return;

      try {
        if (controller!.value.isPreviewPaused) {
          await controller!.resumePreview();
          // give the camera some time to focus
          await Future.delayed(const Duration(seconds: 2));
          capturing.value = true;
        }
        await Future.delayed(const Duration(seconds: 5));
        if (controller?.value != null && !controller!.value.isPreviewPaused) {
          controller?.pausePreview();
          capturing.value = false;
        }
      } catch (_) {}
    }, INTERVAL_DURATION);

    useValueChanged<bool, bool>(capturing.value, (_, __) {
      if (capturing.value) {
        takePicture().then((image) {
          lastImage.value = image;
          imagesTaken.value++;
        }).catchError((_) {});
      }
      return null;
    });

    useValueChanged<XFile?, XFile?>(lastImage.value, (_, __) {
      if (lastImage.value != null) {
        uploadImage(ref, lastImage.value!);
      }
      return null;
    });

    return Scaffold(
      appBar: AppBar(
        title: Text(stream.title),
        actions: [
          IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                ref.read(streamProvider.notifier).state = null;
              }),
        ],
      ),
      body: Column(
        children: [
          AspectRatio(
            aspectRatio: 1.5,
            child: capturing.value
                ? CameraPreview(controller!)
                : Container(
                    color: Colors.black,
                  ),
          ),
          Text('Images taken: ${imagesTaken.value}'),
          if (lastImage.value != null)
            AspectRatio(
              aspectRatio: 1,
              child: Image.file(
                File(lastImage.value!.path),
                fit: BoxFit.cover,
              ),
            )
        ],
      ),
    );
  }

  Future<XFile?> takePicture() async {
    XFile? file = await controller?.takePicture();
    if (file == null) return null;
    Uint8List bytes = await file.readAsBytes();
    img.Image capturedImage = img.decodeImage(bytes)!;
    img.Image orientedImage = img.bakeOrientation(capturedImage);

    await img.encodeJpgFile(file.path, orientedImage, quality: 100);
    return file;
  }

  Future uploadImage(WidgetRef ref, XFile image) async {
    String uploadUrl = await getUploadUrl(
      streamId: stream.id,
      token: ref.read(authProvider),
    );
    await uploadImageToUrl(uploadUrl, image);
  }
}
