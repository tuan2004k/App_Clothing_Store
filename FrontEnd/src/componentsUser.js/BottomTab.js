import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import DashBoardScreen from '../Page/Users/DashBoardScreen';
import OrderScreen from '../Page/Users/OrderScreen';
import FavoritesScreen from '../Page/Users/FavoritesScreen';
import CartScreen from '../Page/Users/CartScreen';
import AccountScreen from '../Page/Users/AccountScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Trang chủ') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Giỏ hàng') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Yêu thích') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Tài khoản') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#673AB7',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
        },
        tabBarLabel: ({ focused, color }) => {
          const routeName = route.name;
          return (
            <Text style={{ color, fontSize: 12, marginBottom: 4 }}>
              {routeName}
            </Text>
          );
        },
      })}
    >
      <Tab.Screen
        name="Trang chủ"
        component={DashBoardScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Giỏ hàng"
        component={CartScreen}
        options={{ headerShown: false }}
      />
       <Tab.Screen
        name="Yêu thích"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Tài khoản"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}