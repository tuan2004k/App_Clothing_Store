import React, { useState, useEffect } from 'react';
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
import { addNewCheckout } from '../../API/apicheckout';
import { createOrder } from '../../API/apiorder';
import { getUserById } from '../../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CheckoutScreen = ({ route, navigation }) => {
  const { selectedProducts, total } = route.params || {};
  const [paymentMethod, setPaymentMethod] = useState('TienMat'); // Keep state modifiable if needed later
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('Đang tải...');
  const [phoneNumber, setPhoneNumber] = useState('Đang tải...');
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [maNguoiDung, setMaNguoiDung] = useState(null);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log('Dữ liệu từ AsyncStorage:', userData);
        if (!userData) {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin đăng nhập! Vui lòng đăng nhập lại.');
          navigation.navigate('Login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.id || parsedUser.MaNguoiDung;
        console.log('MaNguoiDung từ AsyncStorage:', userId);

        if (!userId) {
          Alert.alert('Lỗi', 'Không tìm thấy ID người dùng trong thông tin đăng nhập!');
          setIsLoadingData(false);
          return;
        }

        setMaNguoiDung(userId);

        const response = await getUserById(userId);
        console.log('Phản hồi đầy đủ từ API getUserById:', response);

        if (response && response.data && response.data.DiaChi && response.data.SoDienThoai) {
          setAddress(response.data.DiaChi);
          setPhoneNumber(response.data.SoDienThoai);
        } else if (response && response.DiaChi && response.SoDienThoai) {
          setAddress(response.DiaChi);
          setPhoneNumber(response.SoDienThoai);
        } else {
          setAddress('Chưa cập nhật');
          setPhoneNumber('Chưa cập nhật');
          Alert.alert('Lưu ý', 'Không tìm thấy địa chỉ hoặc số điện thoại trong tài khoản!');
        }
      } catch (error) {
        console.error('Lỗi chi tiết khi lấy thông tin người dùng:', error.response?.data || error.message);
        setAddress('Chưa cập nhật');
        setPhoneNumber('Chưa cập nhật');
        Alert.alert('Lỗi', 'Không thể tải thông tin người dùng từ server.');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const uniqueProducts = Array.from(
    new Map(selectedProducts?.map((item) => [item.MaChiTietSanPham, item]) || []).values()
  );

  if (!selectedProducts || selectedProducts.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Không có sản phẩm nào để thanh toán.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (isLoadingData) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        </View>
      </SafeAreaView>
    );
  }

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      // Ensure proper formatting of selected products
      const formattedSelectedProducts = selectedProducts.map(item => ({
        MaChiTietSanPham: item.MaChiTietSanPham,
        SoLuong: parseInt(item.SoLuong || 1, 10), // Ensure we have a valid number
        Gia: parseFloat(item.ChiTietSanPham?.Gia || item.Gia || 0),
      }));

      const orderData = {
        MaNguoiDung: parseInt(maNguoiDung, 10),
        TongTien: parseFloat(total),
        selectedProducts: formattedSelectedProducts,
      };
      console.log('Dữ liệu gửi lên createOrder:', JSON.stringify(orderData, null, 2));

      const orderResponse = await createOrder(orderData);
      console.log('Phản hồi từ createOrder:', orderResponse);

      if (!orderResponse || !orderResponse.MaDonHang) {
        throw new Error('Không thể tạo đơn hàng. Phản hồi không hợp lệ.');
      }

      const MaDonHang = orderResponse.MaDonHang;
      setOrderId(MaDonHang);
      return MaDonHang;
    } catch (error) {
      console.log('Lỗi khi tạo đơn hàng:', error.response?.data || error.message);
      Alert.alert('Lỗi', error.response?.data?.message || error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCheckout = async () => {
    if (!maNguoiDung) {
      Alert.alert('Lỗi', 'Không tìm thấy ID người dùng! Vui lòng đăng nhập lại.');
      navigation.navigate('Login');
      return;
    }

    if (!address.trim() || !phoneNumber.trim() || address === 'Chưa cập nhật' || phoneNumber === 'Chưa cập nhật') {
      Alert.alert('Lỗi', 'Vui lòng cập nhật địa chỉ và số điện thoại trong tài khoản!');
      return;
    }

    setLoading(true);
    try {
      const MaDonHang = await handleCreateOrder();
      if (!MaDonHang) {
        setLoading(false);
        return;
      }

      const checkoutData = {
        MaDonHang: parseInt(MaDonHang, 10),
        PhuongThuc: paymentMethod,
        TrangThai: 'ThanhCong',
      };
      console.log('Dữ liệu gửi lên addNewCheckout:', checkoutData);

      const checkoutResponse = await addNewCheckout(checkoutData);
      console.log('Phản hồi từ addNewCheckout:', checkoutResponse);

      if (!checkoutResponse || !checkoutResponse.MaThanhToan) {
        throw new Error('Không thể tạo thanh toán. Phản hồi không hợp lệ.');
      }

      Alert.alert('Thành công', 'Đơn hàng đã được đặt thành công!', [
        {
          text: 'OK',
          onPress: () => {
            console.log('Navigating to OrderDetailScreen with orderId:', MaDonHang);
            navigation.navigate('OrderDetailScreen', { orderId: MaDonHang });
          },
        },
      ]);
    } catch (error) {
      console.log('Checkout Error:', error.response?.data || error.message || error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || error.message || 'Thanh toán thất bại. Vui lòng kiểm tra kết nối hoặc thử lại.'
      );
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
              data={uniqueProducts}
              keyExtractor={(item, index) => `${item.MaChiTietSanPham}-${index}`}
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
                onValueChange={(value) => setPaymentMethod(value)}
                style={styles.picker}
                enabled={false} // Disabled since we only allow TienMat
              >
                <Picker.Item label="Thanh toán trực tiếp" value="TienMat" />
              </Picker>
            </View>

            <View style={styles.accountInfo}>
              <Text style={styles.infoText}>Địa chỉ: {address}</Text>
              <Text style={styles.infoText}>Số điện thoại: {phoneNumber}</Text>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => navigation.navigate('UpdateProfileScreen')}
                disabled={loading}
              >
                <Text style={styles.updateButtonText}>Cập nhật thông tin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.totalContainer}>
          <View style={styles.totalInfo}>
            <Text style={styles.totalLabel}>
              Tổng tiền ({uniqueProducts.length} sản phẩm):
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
    paddingBottom: 20,
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
  accountInfo: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
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
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CheckoutScreen;