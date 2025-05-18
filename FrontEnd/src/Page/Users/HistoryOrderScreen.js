import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { getOrdersByUser, getOrderDetails } from '../../API/apiorder';
import { getCheckoutsByOrder } from '../../API/apicheckout';
import { getUserById } from '../../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const OrderListScreen = ({ navigation, route }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MaNguoiDung, setMaNguoiDung] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Dữ liệu người dùng từ AsyncStorage:', parsedUser);
          setMaNguoiDung(parsedUser.id);
        } else {
          Alert.alert(
            'Yêu cầu đăng nhập',
            'Bạn cần đăng nhập để xem lịch sử đơn hàng.',
            [
              { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginScreen') },
              { text: 'Hủy', style: 'cancel' },
            ]
          );
          setLoading(false);
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
        Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
        setLoading(false);
      }
    };

    fetchUserId();

    // Kiểm tra nếu có thông tin đơn hàng mới từ route (từ màn hình thanh toán)
    if (route.params?.newOrder) {
      setOrders((prevOrders) => [route.params.newOrder, ...prevOrders].sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat)));
    }
  }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      if (MaNguoiDung) {
        fetchOrders();
      }
    }, [MaNguoiDung])
  );

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getOrdersByUser(MaNguoiDung);
      console.log('Dữ liệu từ getOrdersByUser:', ordersData);

      if (ordersData && (Array.isArray(ordersData) || Array.isArray(ordersData.data))) {
        const rawOrders = Array.isArray(ordersData) ? ordersData : ordersData.data || [];
        const detailedOrders = await Promise.all(
          rawOrders.map(async (order) => {
            try {
              const details = await getOrderDetails(order.MaDonHang);
              console.log(`Chi tiết đơn hàng ${order.MaDonHang}:`, details); // Kiểm tra HinhAnh
              const payment = (await getCheckoutsByOrder(order.MaDonHang))[0] || {};
              const user = order.MaNguoiDung ? await getUserById(order.MaNguoiDung) : {};
              return {
                ...order,
                ChiTietDonHang: Array.isArray(details) ? details : [],
                ThanhToan: payment || {},
                DiaChi: user.DiaChi || 'Chưa cập nhật',
                SoDienThoai: user.SoDienThoai || 'Chưa cập nhật',
              };
            } catch (detailError) {
              console.error(`Lỗi khi lấy chi tiết cho MaDonHang ${order.MaDonHang}:`, detailError);
              return {
                ...order,
                ChiTietDonHang: [],
                ThanhToan: {},
                DiaChi: 'Chưa cập nhật',
                SoDienThoai: 'Chưa cập nhật',
              };
            }
          })
        );

        const sortedOrders = detailedOrders.sort((a, b) => new Date(b.NgayDat) - new Date(a.NgayDat));
        setOrders(sortedOrders);
      } else {
        setOrders([]);
        console.warn('Dữ liệu từ getOrdersByUser không phải mảng hoặc rỗng:', ordersData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách đơn hàng.');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (MaNguoiDung) {
      fetchOrders();
    } else {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để làm mới danh sách đơn hàng.',
        [
          { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginScreen') },
          { text: 'Hủy', style: 'cancel' },
        ]
      );
    }
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.orderItem}
      onPress={() => navigation.navigate('OrderDetailScreen', { orderId: item.MaDonHang })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderText}>Đơn hàng #{item.MaDonHang}</Text>
        <Text style={styles.orderStatus}>Trạng thái: {item.TrangThai || 'Chưa xác định'}</Text>
      </View>
      <Text style={styles.orderDate}>Ngày đặt: {new Date(item.NgayDat).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>Tổng: {(item.TongTien || 0).toLocaleString()} VNĐ</Text>
      <Text style={styles.orderAddress}>Địa chỉ: {item.DiaChi}</Text>
      <Text style={styles.orderPhone}>SĐT: {item.SoDienThoai}</Text>

      {item.ChiTietDonHang && item.ChiTietDonHang.length > 0 ? (
        <View style={styles.productList}>
          <Text style={styles.productTitle}>Sản phẩm:</Text>
          {item.ChiTietDonHang.map((product, index) => (
            <View key={index} style={styles.productItem}>
              {product.HinhAnh ? (
                <Image source={{ uri: product.HinhAnh }} style={styles.productImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.productText}>
                - {product.Ten || 'Không xác định'} (SL: {product.SoLuong || 0}, Giá: {(product.Gia || 0).toLocaleString()} VNĐ)
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noProducts}>Không có sản phẩm trong đơn hàng.</Text>
      )}

      {item.ThanhToan && Object.keys(item.ThanhToan).length > 0 ? (
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentStatus}>Thanh toán: {item.ThanhToan.TrangThai || 'Chưa xác nhận'}</Text>
          <Text style={styles.paymentMethod}>Phương thức: {item.ThanhToan.PhuongThuc || 'Chưa thanh toán'}</Text>
          <Text style={styles.paymentDate}>
            Ngày thanh toán: {new Date(item.ThanhToan.NgayThanhToan || Date.now()).toLocaleDateString()}
          </Text>
        </View>
      ) : (
        <Text style={styles.noPayment}>Chưa có thông tin thanh toán.</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!MaNguoiDung) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Vui lòng đăng nhập để xem lịch sử đơn hàng.</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('LoginScreen')}
          >
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch sử đơn hàng</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>Làm mới</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.MaDonHang.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có đơn hàng nào.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f8f8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: { padding: 16 },
  orderItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    color: '#2ecc71',
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 14,
    color: '#ff6347',
    fontWeight: '600',
    marginBottom: 4,
  },
  orderAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  orderPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productList: {
    marginTop: 8,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    marginRight: 8,
  },
  placeholderImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  placeholderText: {
    fontSize: 10,
    color: '#666',
  },
  productText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  noProducts: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  paymentInfo: {
    marginTop: 8,
  },
  paymentStatus: {
    fontSize: 14,
    color: '#3498db',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
  },
  noPayment: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
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
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderListScreen;