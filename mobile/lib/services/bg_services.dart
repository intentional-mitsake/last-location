import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:workmanager/workmanager.dart';
import 'dart:io';


//function to be called by workmanager in background
@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    switch (task) {
      case "fetchLocationTask":
       try{
        Position position = await Geolocator.getCurrentPosition(
          locationSettings: const LocationSettings(
            accuracy: LocationAccuracy.high,
          )
        );
        print("Background Location: Lat: ${position.latitude}, Long: ${position.longitude}");
       }
       catch(e){
          print("Error getting background location: $e");
        }
        break;
    default:
        print("Unknown task: $task");
        break;
    }
    return Future.value(true);
  });
}

