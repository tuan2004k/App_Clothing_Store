// AdminStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Admin from './FrontEnd/src/Page/Admin';
import ProductManagement from '../component/ProductManagement'; // Ví dụ: quản lý sản phẩm
import CategoryManagement from '../component/CategoryManagement'; // Ví dụ: quản lý danh mục

const Stack = createStackNavigator();

const AdminStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="AdminHome">
      <Stack.Screen 
        name="AdminHome" 
        component={Admin} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Quản lý sản phẩm" 
        component={ProductManagement} 
      />
      <Stack.Screen 
        name="Quản lý danh mục" 
        component={CategoryManagement} 
      />
      {/* Thêm các màn hình admin khác vào đây */}
    </Stack.Navigator>
  );
};

export default AdminStackNavigator;
