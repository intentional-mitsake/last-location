import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'pages/map_page.dart';
import 'package:workmanager/workmanager.dart';
import 'services/bg_services.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Workmanager().initialize(
    callbackDispatcher,
    );

  await Workmanager().registerOneOffTask(
    "1", 
    "fetchLocationTask",
  );

  runApp(lstLoc());
}

class lstLoc extends StatelessWidget {
  const lstLoc({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Map(),
    );
  }
}