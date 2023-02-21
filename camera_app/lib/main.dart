import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:slowtok_camera/cameras.dart';
import 'package:slowtok_camera/models.dart';
import 'package:slowtok_camera/screens/select_stream.dart';
import 'package:slowtok_camera/screens/sign_in.dart';
import 'package:slowtok_camera/screens/stream.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Storage().init();

  initCameras();
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: _screenForState(ref),
    );
  }

  Widget _screenForState(WidgetRef ref) {
    final auth = ref.watch(authProvider);
    final stream = ref.watch(streamProvider);

    if (auth.isEmpty) {
      return const SignInScreen();
    }
    if (stream != null) {
      return StreamScreen(stream);
    }
    return const SelectStreamScreen();
  }
}
