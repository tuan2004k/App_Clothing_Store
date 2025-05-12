import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { createOrder, addNewCheckout } from '../../API/apicheckout';

const CheckoutScreen = ({ route, navigation }) => {
  const { MaNguoiDung, selectedProducts, total } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('TienMat');
  const [loading, setLoading] = useState(false);

  if (!selectedProducts || selectedProducts.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có sản phẩm nào để thanh toán.</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleConfirmCheckout = async () => {
    setLoading(true);
    try {
      const orderResponse = await createOrder({
        MaNguoiDung,
        TongTien: total,
        selectedProducts,
      });

      const MaDonHang = orderResponse.MaDonHang;

      await addNewCheckout({
        MaDonHang,
        PhuongThuc: paymentMethod,
        TrangThai: 'ThanhToanThanhCong',
      });

      Alert.alert('Thành công', 'Thanh toán thành công!');
      navigation.navigate('Cart');
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Thanh toán thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Xác nhận Thanh toán</Text>

          <View style={styles.productsContainer}>
            <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
            <FlatList
              data={selectedProducts}
              keyExtractor={item => item.MaChiTietSanPham.toString()}
              renderItem={({ item }) => (
                <View style={styles.productItem}>
                  <Text style={styles.productName}>{item.Ten || 'Tên không xác định'}</Text>
                  <Text style={styles.productDetails}>
                    Kích thước: {item.Size}, Màu sắc: {item.MauSac}
                  </Text>
                  <Text style={styles.productPrice}>
                    {(item.Gia || 0).toLocaleString()} VNĐ x {item.SoLuong}
                  </Text>
                </View>
              )}
            />
          </View>

          <View style={styles.paymentMethodContainer}>
            <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={paymentMethod}
                onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Tiền Mặt" value="TienMat" />
                <Picker.Item label="Chuyển Khoản" value="ChuyenKhoan" />
                <Picker.Item label="Thẻ Tín Dụng" value="TheTinDung" />
              </Picker>
            </View>
          </View>
        </ScrollView>

        <View style={styles.totalContainer}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>
              Tổng tiền ({selectedProducts.length} sản phẩm):
            </Text>
            <Text style={styles.totalText}>{total.toLocaleString()} VNĐ</Text>
          </View>
          <View style={styles.totalbutton}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirmButton, loading && styles.disabledButton]}
              onPress={handleConfirmCheckout}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
              )}
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Đệm dưới để tránh bị che bởi totalContainer
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f8f8f8',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 16,
    textAlign: 'center',
  },
  productsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  productItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productDetails: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  productPrice: {
    fontSize: 15,
    color: '#2ecc71',
    fontWeight: '600',
  },
  paymentMethodContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  totalContainer: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6347',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
    width: '60%',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#ff4444',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '30%',
    marginBottom: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  totalbutton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    


  },
});

export default CheckoutScreen;