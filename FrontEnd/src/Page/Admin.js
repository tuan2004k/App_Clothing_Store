import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import AdminDashboard from './Admin/AdminDashboard';
import ProductManagement from './Admin/ProductManagement';
import AccountManagement from './Admin/AccountManagement';
import OrderManagement from './Admin/OrderManagement';
import PaymentManagement from './Admin/PaymentManagement';
import CategoryManagement from './Admin/CategoryManagement';
import CustomDrawer from '../componentsAdmin/CustomDrawer'; // Đừng quên import

const Drawer = createDrawerNavigator();

export default function Admin() {
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
        name="Trang chủ"
        component={AdminDashboard}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Danh mục"
        component={CategoryManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quản lý sản phẩm"
        component={ProductManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="pricetags-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quản lý tài khoản"
        component={AccountManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quản lý đơn hàng"
        component={OrderManagement}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Quản lý thanh toán"
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
