import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:slowtok_camera/api.dart';
import 'package:camera/camera.dart';

class Storage {
  late SharedPreferences prefs;

  Future<void> init() async {
    prefs = await SharedPreferences.getInstance();
  }

  String? get token => prefs.getString('token');

  set token(String? value) {
    prefs.setString('token', value!);
  }

  static final Storage _instance = Storage._internal();
  factory Storage() {
    return _instance;
  }
  Storage._internal();
}

final authProvider = StateProvider<String>((ref) {
  ref.listenSelf((_, next) async {
    Storage().token = next;
  });

  return Storage().token ?? '';
});

final streamsProvider = FutureProvider<List<Stream>>((ref) {
  final token = ref.watch(authProvider);
  if (token.isEmpty) {
    return Future.value([]);
  }
  return fetchStreams(token: token);
});

final streamProvider = StateProvider<Stream?>((ref) => null);

final durationProvider =
    StateProvider<Duration>((ref) => const Duration(minutes: 1));

final cameraControllerProvider =
    StateProvider<CameraController?>((ref) => null);
