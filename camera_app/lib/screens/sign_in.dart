import 'package:flutter/material.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:slowtok_camera/api.dart';
import 'package:slowtok_camera/models.dart';

GoogleSignIn _googleSignIn = GoogleSignIn(
  clientId:
      '804478743579-a5999sgljs52e98i57p1i7u2v889nt8b.apps.googleusercontent.com',
  // iOS
  // clientId:
  //     '804478743579-n82in625jm1h2484jsba2bfqegt94c1p.apps.googleusercontent.com',
  scopes: [
    'email',
  ],
);

class SignInScreen extends ConsumerWidget {
  const SignInScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            TextButton(
              style: ButtonStyle(
                backgroundColor: MaterialStateProperty.all(Colors.lightBlue),
                elevation: MaterialStateProperty.all(8),
              ),
              onPressed: () async {
                try {
                  var x = await _googleSignIn.signIn();
                  var googleAuth = await x?.authentication;

                  if (googleAuth != null && googleAuth.idToken != null) {
                    var token = await fetchToken(googleAuth.idToken!);
                    ref.read(authProvider.notifier).state = token;
                  }
                } catch (e) {
                  print(e);
                }
              },
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  'Sign in with Google',
                  style: TextStyle(
                    fontSize: 24,
                    color: Colors.blue.shade900,
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
