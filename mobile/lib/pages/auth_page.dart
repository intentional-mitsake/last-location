import 'package:flutter/material.dart';

class AuthPage extends StatefulWidget {
  const AuthPage({super.key});

  @override
  State<AuthPage> createState() => _AuthPageState();
}

class _AuthPageState extends State<AuthPage> {
  bool isLogin = true;

  //form key to identify the form and interact with it
  //value of final can only be set once
  final formKey = GlobalKey<FormState>();

  //text controllers helps manage the input text
  final usernameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController(); 

  @override 
  void dispose(){
    usernameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  void toggle(){
    setState(() {
      isLogin = !isLogin;
    });
    emailController.clear();
    passwordController.clear();
    usernameController.clear();
  }

  void submit(){
    if(formKey.currentState!.validate()){
      final email = emailController.text;
      final password = passwordController.text; 
      final username = usernameController.text;

      //pushes to home page after successful login or registration
      //replaces the current page so that user cannot go back to auth page using back button
      //navigator.of gets the navigator for the current context
      Navigator.of(context).pushReplacementNamed('/home');
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(isLogin ? 'Login' : 'Register'),
      ),
    );
  }
}