import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'pages/profile.dart';
import 'pages/requests_pg.dart';
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

  runApp(homeState());
}

class homeState extends StatefulWidget {
  const homeState({super.key});

  @override
  State<homeState> createState() => _homeStateState();
}

class _homeStateState extends State<homeState> {
  int pgInd = 0;
  static const List<Widget> pages = <Widget>[
    Map(),//map page .ie home page
    Requests(),//requests page
    Profile(),//profile page
  ];

  void onSelectPage(int index){
    setState(() {
      pgInd = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: pages.elementAt(pgInd),//display the selected page
          //pages is a list of widgets (pages) and gets updated based on the index (pgInd) which is updated on press of the bottom nav bar items
        ),
        bottomNavigationBar: BottomNavigationBar(
          //items property of the bottom nav bar to set the items
          items: const <BottomNavigationBarItem>[
            BottomNavigationBarItem(
              icon: Icon(Icons.map),
              label: 'Map',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.send),
              label: 'Requests',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
          currentIndex: pgInd,//property of the bottom nav bar to set the current index
          selectedItemColor: const Color.fromARGB(255, 90, 79, 241),//color of the selected item
          onTap: onSelectPage,//calls the function to update the index on press
        ),
      )
  );
  }
}