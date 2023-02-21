import 'package:flutter/material.dart';
import 'package:hooks_riverpod/hooks_riverpod.dart';
import 'package:slowtok_camera/models.dart';

class SelectStreamScreen extends ConsumerWidget {
  const SelectStreamScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Select Stream'),
        actions: [
          IconButton(
              icon: const Icon(Icons.logout),
              onPressed: () {
                ref.read(authProvider.notifier).state = '';
              }),
        ],
      ),
      body: _body(ref),
    );
  }

  Widget _body(WidgetRef ref) {
    return ref.watch(streamsProvider).when(
          data: (streams) => ListView(
            children: streams
                .map(
                  (stream) => ListTile(
                    leading: stream.latestUrl != null
                        ? Image(
                            image: NetworkImage(stream.latestUrl!),
                            width: 40,
                            height: 40,
                            fit: BoxFit.cover,
                          )
                        : const SizedBox(width: 40, height: 40),
                    title: Text(stream.title),
                    subtitle: Text(stream.latestTime != null
                        ? '${stream.latestTime}'
                        : ''),
                    onTap: () {
                      ref.read(streamProvider.notifier).state = stream;
                    },
                  ),
                )
                .toList(),
          ),
          error: (_, __) => Container(),
          loading: () => const Center(
            child: CircularProgressIndicator(),
          ),
        );
  }
}
