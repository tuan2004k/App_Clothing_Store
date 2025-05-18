import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';

import AdminDashboard from './Admin/AdminDashboard';
import ProductManagement from './Admin/ProductManagement';
import AccountManagement from './Admin/AccountManagement';
import OrderManagement from './Admin/OrderManagement';
import PaymentManagement from './Admin/PaymentManagement';
import CategoryManagement from './Admin/CategoryManagement';
import CustomDrawer from '../componentsAdmin/CustomDrawer';

const Drawer = createDrawerNavigator();

// Create a Logout screen component
const LogoutScreen = ({ navigation }) => {
  // This component will not actually be rendered
  // It's just a placeholder for the drawer item
  return null;
};

export default function Admin() {
  // Handler for logout
  const handleLogout = () => {
    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        { 
          text: "Đăng xuất", 
          onPress: () => {
            // Implement your logout logic here
            // For example: clear auth token, navigate to login screen, etc.
            console.log("User logged out");
            // navigation.navigate('Login'); // Uncomment and modify as needed
          }
        }
      ]
    );
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#007bff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: { fontSize: 16 },
        headerStyle: { backgroundColor: '#007bff' },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="Admin Dashboard"
        component={AdminDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Category Management"
        component={CategoryManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Product Management"
        component={ProductManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Account Management"
        component={AccountManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Order Management"
        component={OrderManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment Management"
        component={PaymentManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
        }}
      />
     
    </Drawer.Navigator>
  );
}