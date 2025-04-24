// src/Page/OrderManagement.js
import React from "react";
import { View, Text, Button } from "react-native";

const OrderManagement = () => {
  return (
    <View>
      <Text>Quản lý Đơn Hàng</Text>
      <Button title="Xem danh sách đơn hàng" onPress={() => alert("Chuyển đến danh sách đơn hàng")} />
      <Button title="Thay đổi trạng thái đơn hàng" onPress={() => alert("Chuyển đến thay đổi trạng thái đơn hàng")} />
    </View>
  );
};

export default OrderManagement;
