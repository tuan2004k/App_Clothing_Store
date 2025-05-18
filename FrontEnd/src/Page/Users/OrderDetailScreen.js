import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { getOrderById, getOrderDetails } from '../../API/apiorder';
import { getCheckoutsByOrder } from '../../API/apicheckout';
import { getUserById } from '../../API/api'; // Thêm getUserByOrder

const OrderDetailScreen = ({ route, navigation }) => {
  const MaDonHang = route.params?.orderId || null;
  const [orderInfo, setOrderInfo] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!MaDonHang) {
      console.error('Missing orderId in route params');
      Alert.alert('Lỗi', 'Không tìm thấy ID đơn hàng');
      navigation.goBack();
      return;
    }

    const fetchData = async () => {
      try {
        const order = await getOrderById(MaDonHang);
        console.log('Fetched order:', order);

        if (!order?.MaDonHang) {
          throw new Error('Đơn hàng không tồn tại');
        }

        const [details, payment] = await Promise.all([
          getOrderDetails(MaDonHang),
          getCheckoutsByOrder(MaDonHang)
        ]);

        // Lấy thông tin user
        const user = await getUserById(order.MaNguoiDung);

        setOrderInfo({
          ...order,
          TenNguoiDung: user?.Ten || 'Khách',
          DiaChi: user?.DiaChi || 'Chưa cập nhật',
          SoDienThoai: user?.SoDienThoai || 'Chưa cập nhật'
        });

        setOrderDetails(details || []);
        setPaymentInfo(payment?.[0] || null);
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Lỗi', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [MaDonHang]);
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
        </View>
      </SafeAreaView>
    );
  }

  if (!MaDonHang || !orderInfo) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không tìm thấy đơn hàng.</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderDetailItem = ({ item }) => (
    <View style={styles.detailItem}>
      <Text style={styles.productName}>{item.Ten || 'Tên không xác định'}</Text>
      <Text style={styles.productDetail}>
        Kích thước: {item.Size || 'Không có'}, Màu sắc: {item.MauSac || 'Không có'}
      </Text>
      <Text style={styles.productDetail}>Số lượng: {item.SoLuong || 0}</Text>
      <Text style={styles.productPrice}>Giá: {(item.Gia || 0).toLocaleString()} VNĐ</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Chi tiết đơn hàng #{orderInfo.MaDonHang}</Text>
        <View style={styles.orderInfo}>
          <Text style={styles.orderDetail}>Người đặt: {orderInfo.TenNguoiDung || 'Chưa cập nhật'}</Text>
          <Text style={styles.orderDetail}>Tổng tiền: {orderInfo.TongTien?.toLocaleString() || '0'} VNĐ</Text>
          <Text style={styles.orderDetail}>Địa chỉ: {orderInfo.DiaChi || 'Chưa cập nhật'}</Text>
          <Text style={styles.orderDetail}>Số điện thoại: {orderInfo.SoDienThoai || 'Chưa cập nhật'}</Text>
          <Text style={styles.orderDetail}>
            Ngày tạo: {new Date(orderInfo.NgayDat || Date.now()).toLocaleDateString()}
          </Text>
          <Text style={styles.orderStatus}>Trạng thái đơn hàng: {orderInfo.TrangThai || 'Chưa xác định'}</Text>
          {paymentInfo && (
            <View style={styles.paymentInfo}>
              <Text style={styles.orderDetail}>
                Phương thức thanh toán: {paymentInfo.PhuongThuc || 'Chưa thanh toán'}
              </Text>
              <Text style={styles.orderDetail}>
                Trạng thái thanh toán: {paymentInfo.TrangThai || 'Chưa xác nhận'}
              </Text>
              <Text style={styles.orderDetail}>
                Ngày thanh toán: {new Date(paymentInfo.NgayThanhToan || Date.now()).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.sectionTitle}>Sản phẩm trong đơn hàng</Text>
        <FlatList
          data={orderDetails}
          renderItem={renderDetailItem}
          keyExtractor={(item) => item.MaChiTiet?.toString() || Math.random().toString()}
          contentContainerStyle={styles.detailList}
          ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm trong đơn hàng.</Text>}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('DashBoardScreen')} // Sửa lỗi typo: DasboardScreen thành DashBoardScreen
        >
          <Text style={styles.backButtonText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  orderInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  paymentInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  orderDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2ecc71',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  detailList: {
    paddingBottom: 20,
  },
  detailItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff6347',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default OrderDetailScreen;