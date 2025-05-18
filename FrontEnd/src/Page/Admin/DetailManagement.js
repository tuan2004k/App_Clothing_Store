import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getOrderDetails } from '../../API/apiorder'; // Đường dẫn đến apiorder.js

const OrderDetailScreen = ({ route }) => {
  const { MaDonHang, details } = route.params;
  const [orderDetails, setOrderDetails] = useState(details || null);
  const [loading, setLoading] = useState(!details);

  useEffect(() => {
    if (!details) {
      fetchOrderDetails();
    }
  }, [MaDonHang]);


  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetails(MaDonHang);
      setOrderDetails(data);
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
      setOrderDetails(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy chi tiết đơn hàng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi Tiết Đơn Hàng #{orderDetails.MaDonHang}</Text>
      <Text>Người Dùng: {orderDetails.MaNguoiDung || 'N/A'}</Text>
      <Text>Ngày Tạo: {orderDetails.NgayDat || 'N/A'}</Text>
      <Text>Trạng Thái: {orderDetails.TrangThai || 'N/A'}</Text>
      <Text>Tổng Tiền: ${orderDetails.TongTien || 0}.00 USD</Text>
      {/* Thêm các trường khác từ orderDetails nếu có */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f8f8', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#ff6347', textAlign: 'center' },
});

export default OrderDetailScreen;