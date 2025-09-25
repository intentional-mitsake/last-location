import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import 'dart:async';//stream subscription

class Map extends StatefulWidget {
  const Map({super.key});

  @override
  State<Map> createState() => _MapState();
}

class _MapState extends State<Map> {

  LatLng? currentPos = null;
  LatLng defaultPos = LatLng(6.5244, 3.3792); // in case we don't get location
  StreamSubscription<Position>? positionStreamSubscription;// so that we can cancel the subscription when not needed

  @override
  void initState() {
    super.initState();
    handleLocationFlow(); // check and request permissions and start updates
  }

  @override
  void dispose() {
    positionStreamSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: currentPos == null
          ? const Center(child: Text('Loading...'))
          : GoogleMap(
              initialCameraPosition: CameraPosition(
                target: currentPos ?? defaultPos, // if currentPos is null use defaultPos
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

  // A single function to manage the entire location permission and update flow.
  Future<void> handleLocationFlow() async {
    LocationPermission permission = await checkPermission();
    if (permission != LocationPermission.deniedForever && permission != LocationPermission.denied) {
      locationUpdates();
    }
  }

  // check and request permissions.
  Future<LocationPermission> checkPermission() async {
    bool serviceEnabled;
    LocationPermission permission;

    // check if location services are enabled on the device.
    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      await Geolocator.openLocationSettings();
      return LocationPermission.denied; // Return denied since we can't get permission without service enabled
    }

    // check the current permission status.
    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      // If permission is denied, request it from the user.
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        // If permission is denied again, we can't proceed.
        return LocationPermission.denied;
      }
    }

    // check if the app has "while in use" permission but needs "always on".
    // This is the correct place to trigger the "always on" dialog.
    if (permission == LocationPermission.whileInUse) {
      if (mounted) {
        showPermissionDialog(context);
      }
    }
    return permission;
  }

  Future<void> locationUpdates() async {
    Geolocator.getPositionStream(
      locationSettings: AndroidSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 10,
        foregroundNotificationConfig: ForegroundNotificationConfig(
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

  // to show a popup teliing user to enable location always permission if not enabled
  Future<void> showPermissionDialog(BuildContext context) async {
    await showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Permission Required'),
          content: Text('Please enable "Allow All the Time" permission in app settings for background location access.'),
          actions: <Widget>[
            TextButton(
              child: Text('Open Settings'),
              onPressed: () {
                Geolocator.openAppSettings(); // open location settings
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: Text('Cancel'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }
}