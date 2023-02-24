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
  // CameraController? controller;
  StreamScreen(this.stream, {super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    ValueNotifier<bool> showViewFinder = useState(true);
    ValueNotifier<bool> capturing = useState(false);
    ValueNotifier<XFile?> lastImage = useState(null);
    ValueNotifier<int> imagesTaken = useState(0);
    CameraController? controller = ref.watch(cameraControllerProvider);

    // useEffect(() {
    //   controller = CameraController(cameras[1], ResolutionPreset.medium);
    //   controller!.initialize().then((_) {
    //     hasAccess.value = true;
    //   });
    //   return () {
    //     controller?.dispose();
    //   };
    // }, []);

    useInterval(() async {
      if (controller == null) return;

      try {
        if (controller.value.isPreviewPaused) {
          await controller.resumePreview();
          // give the camera some time to focus
          await Future.delayed(const Duration(seconds: 2));
        }
        capturing.value = true;
        await Future.delayed(const Duration(seconds: 5));
        // ignore: unnecessary_null_comparison
        if (controller != null &&
            !controller.value.isPreviewPaused &&
            !showViewFinder.value) {
          controller.pausePreview();
        }
        capturing.value = false;
      } catch (_) {}
    }, ref.watch(durationProvider));

    useValueChanged<bool, bool>(capturing.value, (_, __) {
      if (capturing.value) {
        takePicture(controller).then((image) {
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

    useValueChanged<bool, bool>(showViewFinder.value, (oldValue, activate) {
      if (controller == null) return;

      if (showViewFinder.value && controller!.value.isPreviewPaused) {
        controller?.resumePreview();
      } else if (!controller!.value.isPreviewPaused) {
        controller?.pausePreview();
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
          _cameraChoice(ref, showViewFinder.value),
          GestureDetector(
            child: SizedBox(
              height: 200,
              child: controller != null &&
                      (capturing.value || showViewFinder.value)
                  ? CameraPreview(controller)
                  : Container(
                      color: Colors.white,
                      child: const Center(
                        child: Text('Click to show viewfinder'),
                      ),
                    ),
            ),
            onTap: () {
              showViewFinder.value = !showViewFinder.value;
            },
          ),
          Text('Images taken: ${imagesTaken.value}'),
          if (lastImage.value != null)
            AspectRatio(
              aspectRatio: 1,
              child: Image.file(
                File(lastImage.value!.path),
                fit: BoxFit.cover,
              ),
            ),
        ],
      ),
    );
  }

  Widget _cameraChoice(WidgetRef ref, bool showViewFinder) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        for (var camera in cameras)
          TextButton(
            onPressed: () async {
              try {
                await onNewCameraSelected(ref, camera);
                // if (showViewFinder) {
                //   ref.read(cameraControllerProvider)?.resumePreview();
                // }
              } catch (e) {
                print(e);
              }
            },
            child: Text(camera.lensDirection.toString()),
          ),
      ],
    );
  }

  Future<XFile?> takePicture(CameraController? controller) async {
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

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    // if (controller == null || !controller!.value.isInitialized) {
    //   return;
    // }
    // if (state == AppLifecycleState.inactive) {
    //   controller?.dispose();
    // } else if (state == AppLifecycleState.resumed) {
    //   if (controller != null) {
    //     onNewCameraSelected(controller!.description);
    //   }
    // }
  }

  Future<void> onNewCameraSelected(
      WidgetRef ref, CameraDescription cameraDescription) async {
    await ref.read(cameraControllerProvider)?.dispose();
    // if (controller != null) {
    //   await controller!.dispose();
    // }
    var controller = CameraController(
      cameraDescription,
      ResolutionPreset.medium,
    );

    try {
      await controller.initialize();
    } on CameraException catch (_) {}

    ref.read(cameraControllerProvider.notifier).state = controller;
  }
}
