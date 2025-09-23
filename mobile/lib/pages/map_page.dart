import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';

class Map extends StatefulWidget {
  const Map({super.key});

  @override
  State<Map> createState() => _MapState();
}

class _MapState extends State<Map> {

  LatLng? currentPos = null;
  LatLng defaultPos = LatLng(6.5244, 3.3792);//in case we dont get location
 
 @override
 void initState() {
   super.initState();
   locationUpdates();//call the function to start listening to location updates at start
 }


  @override
  Widget build(BuildContext context) {


    return Scaffold(
      body: currentPos == null 
      ? const Center(child: Text('Loading...'),)
      : GoogleMap(
        initialCameraPosition: CameraPosition(
          target: currentPos ?? defaultPos, //if currentPos is null use defaultPos
          zoom: 15,
           ),
        markers: {
          Marker(
            markerId: MarkerId('currentLocation'), 
            position: currentPos ?? defaultPos,
            infoWindow: InfoWindow(title: 'Your Location')
          )
        },
          ),
    );
  }

  Future<void> locationUpdates() async {
    bool serviceEnabled;
    LocationPermission permissionGranted;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings(); 
      return;
    }

    permissionGranted = await Geolocator.checkPermission();
    if (permissionGranted == LocationPermission.denied) {
      permissionGranted = await Geolocator.requestPermission();
      if (permissionGranted == LocationPermission.denied) {
        return;
      }
    }

    Geolocator.getPositionStream(
      locationSettings: AndroidSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
        foregroundNotificationConfig: const ForegroundNotificationConfig(
          notificationTitle: "Last Location Service",
          notificationText: "Your location is being tracked",
        ),
      ),
    ).listen(
      (Position position) {
        setState(() {
          currentPos = LatLng(position.latitude, position.longitude);
        });
      },
      onError: (error) {
        print('Error getting location updates: $error');
      },
    );
  }
}