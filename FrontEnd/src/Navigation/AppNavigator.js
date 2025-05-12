import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Page/LoginScreen';
import RegisterScreen from '../Page/RegisterScreen';
import UserDrawer from '../componentsUser.js/UserDrawer';
import Admin from '../Page/Admin';
import 'react-native-gesture-handler'; // Đảm bảo import ở đây
import DetailScreen from '../Page/Users/DetailScreen';
import CartScreen from '../Page/Users/CartScreen';
import CheckoutScreen from '../Page/Users/CheckoutScreen';

const Stack = createStackNavigator(); 

const AppNavigator = () => {
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
          component={UserDrawer}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Admin"
          component={Admin}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProductDetail"
          component={DetailScreen}
        />
        <Stack.Screen
          name="CartScreen"
          component={CartScreen}
        />
        <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppNavigator;