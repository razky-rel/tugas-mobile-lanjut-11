import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ChatScreen from './src/screens/ChatScreen';



const Stack = createNativeStackNavigator();

function NavigationRouter() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="Chat" component={ChatScreen}
          options={{title: 'Ruang Chat'}} />
      ): (
        <>
          <Stack.Screen name="Login" component={LoginScreen}
            options={{ headerShown: false}}/> 
          <Stack.Screen name="Register" component={RegisterScreen}
            options={{ title: "Daftar Akun"}}/> 
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <NavigationRouter/>
      </NavigationContainer>
    </AuthProvider>
  );
}