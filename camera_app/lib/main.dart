import 'dart:async';
import 'dart:typed_data';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:screen_brightness/screen_brightness.dart';

late List<CameraDescription> _cameras;
// ignore: constant_identifier_names
const INTERVAL_DURATION = Duration(seconds: 30);

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  _cameras = await availableCameras();
  runApp(MyApp());
}

void useInterval(VoidCallback callback, Duration delay) {
  final savedCallback = useRef(callback);
  savedCallback.value = callback;

  useEffect(() {
    final timer = Timer.periodic(delay, (_) => savedCallback.value());
    return timer.cancel;
  }, [delay]);
}

class MyApp extends HookWidget {
  CameraController? controller;
  MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    ValueNotifier<bool> hasAccess = useState(false);
    ValueNotifier<bool> capturing = useState(false);
    ValueNotifier<Uint8List?> lastImage = useState(null);
    ValueNotifier<int> imagesTaken = useState(0);

    useEffect(() {
      ScreenBrightness().setScreenBrightness(0);
      controller = CameraController(_cameras[0], ResolutionPreset.medium);
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

    useValueChanged<Uint8List?, Uint8List?>(lastImage.value, (_, __) {
      if (lastImage.value != null) {
        uploadImage(lastImage.value!);
      }
      return null;
    });

    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Scaffold(
        appBar: AppBar(title: const Text('Camera')),
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
                child: Image.memory(lastImage.value!),
              )
          ],
        ),
      ),
    );
  }

  Future<Uint8List?> takePicture() async {
    XFile? file = await controller?.takePicture();
    return file != null ? await file.readAsBytes() : null;
  }

  void uploadImage(Uint8List image) {}
}
