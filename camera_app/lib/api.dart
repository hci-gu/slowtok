import 'package:camera/camera.dart';
import 'package:dio/dio.dart';

const apiBase = 'https://api.slowtok.com';
final dio = Dio(
  BaseOptions(baseUrl: apiBase, headers: {
    'Content-Type': 'application/json',
  }),
);

Future<String> fetchToken(String idToken) async {
  try {
    final response = await dio.post('/token', data: {'tokenId': idToken});
    var result = response.data;
    return result['token'];
  } catch (_) {}
  return '';
}

class Stream {
  final String id;
  final String title;
  final String description;
  final String? latestUrl;
  final String? latestTime;

  Stream({
    required this.id,
    required this.title,
    required this.description,
    this.latestUrl,
    this.latestTime,
  });

  factory Stream.fromJson(Map<String, dynamic> json) {
    return Stream(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      latestUrl: json['latest'] != null ? json['latest']['url'] : null,
      latestTime: json['latest'] != null ? json['latest']['time'] : null,
    );
  }
}

Future<List<Stream>> fetchStreams({token}) async {
  var response = await dio.get(
    '/streams',
    options: Options(
      headers: {'Authorization': 'Bearer $token'},
    ),
  );
  var array = response.data;
  return array.map<Stream>((obj) => Stream.fromJson(obj)).toList();
}

Future<String> getUploadUrl({token, streamId}) async {
  var response = await dio.post(
    '/uploadUrl',
    data: {
      "fileType": "image/jpeg",
      "streamId": streamId,
    },
    options: Options(
      headers: {'Authorization': 'Bearer $token'},
    ),
  );
  var obj = response.data;
  return obj['uploadUrl'];
}

Future uploadImageToUrl(String url, XFile image) async {
  var response = await dio.put(
    url,
    data: image.openRead(),
    options: Options(
      headers: {
        Headers.contentLengthHeader: await image.length(),
      },
    ),
  );
  return response.data;
}
