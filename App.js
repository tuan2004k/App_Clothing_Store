import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './FrontEnd/src/Page/LoginScreen';
import RegisterScreen from './FrontEnd/src/Page/RegisterScreen';
import Users from './FrontEnd/src/Page/Users';
import Admin from './FrontEnd/src/Page/Admin';
import 'react-native-reanimated';
 // Đã cập nhật để có Drawer

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Users"
          component={Users}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ headerShown: false }} // Admin sẽ có Drawer
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
