import 'package:flutter/material.dart';

void main(){
  runApp(lstLoc());
}

class lstLoc extends StatelessWidget {
  const lstLoc({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Last Location'),
        ),
        body: Center(
          child: Text('Last Location of Users'),
        ),
      ),
    );
  }
}