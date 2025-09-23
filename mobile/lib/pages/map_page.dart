import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';

class Map extends StatefulWidget {
  const Map({super.key});

  @override
  State<Map> createState() => _MapState();
}

class _MapState extends State<Map> {

  static const LatLng initialPosition = LatLng(37.7749, -122.4194); // San Francisco coordinates

  @override
  Widget build(BuildContext context) {


    return Scaffold(
      body: GoogleMap(
        initialCameraPosition: CameraPosition(
          target: initialPosition, 
          zoom: 10,
           ),
        markers: {
          Marker(
            markerId: MarkerId('currentLocation'), 
            position: initialPosition,
            infoWindow: InfoWindow(title: 'Your Location')
          )
        },
          ),
    );
  }
}