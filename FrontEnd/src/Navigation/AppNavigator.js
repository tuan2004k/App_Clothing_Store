import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../Page/LoginScreen';
import RegisterScreen from '../Page/RegisterScreen';
// import UserDrawer from '../componentsUser.js/UserDrawer';
import Admin from '../Page/Admin';
import 'react-native-gesture-handler'; // Đảm bảo import ở đây
import DetailScreen from '../Page/Users/DetailScreen';
import CartScreen from '../Page/Users/CartScreen';
import CheckoutScreen from '../Page/Users/CheckoutScreen';
import UpdateProfileScreen from '../Page/Users/UpdateProfileScreen';
import AccountScreen from '../Page/Users/AccountScreen';
import Users from '../Page/Users';
import OrderDetailScreen from '../Page/Users/OrderDetailScreen';
import DashBoardScreen from '../Page/Users/DashBoardScreen.js';
import HistoryOrderScreen from '../Page/Users/HistoryOrderScreen.js';
import FavoriteScreen from '../Page/Users/FavoriteScreen.js';
import DetailManagement from '../Page/Admin/DetailManagement.js';


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
          name="DashBoardScreen"
          component={DashBoardScreen}
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
          name="UpdateProfileScreen"
          component={UpdateProfileScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AccountScreen"
          component={AccountScreen}
         
        />
         <Stack.Screen
          name="CheckoutScreen"
          component={CheckoutScreen}
          
        />
        <Stack.Screen
          name="OrderDetailScreen"
          component={OrderDetailScreen}
          // options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HistoryOrderScreen"
          component={HistoryOrderScreen}
          // options={{ headerShown: false }}        
        />
        <Stack.Screen
          name="FavoriteScreen"
          component={FavoriteScreen}
          // options={{ headerShown: false }}        
        />
        <Stack.Screen
          name="DetailManagement"
          component={DetailManagement}
          // options={{ headerShown: false }}  
        />
       
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default AppNavigator;