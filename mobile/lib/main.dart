import 'package:flutter/material.dart';
import 'pages/map_page.dart';

void main(){
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