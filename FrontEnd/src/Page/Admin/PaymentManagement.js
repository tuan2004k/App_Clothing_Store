// src/Page/CategoryManagement.js
import React from "react";
import { View, Text, Button } from "react-native";

const CategoryManagement = () => {
  return (
    <View>
      <Text>Quản lý Danh Mục Sản Phẩm</Text>
      <Button title="Thêm danh mục" onPress={() => alert("Chuyển đến thêm danh mục")} />
      <Button title="Sửa danh mục" onPress={() => alert("Chuyển đến sửa danh mục")} />
      <Button title="Xóa danh mục" onPress={() => alert("Chuyển đến xóa danh mục")} />
    </View>
  );
};

export default CategoryManagement;
