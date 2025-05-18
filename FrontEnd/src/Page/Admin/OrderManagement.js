import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import {
  getAllOrders,
  getOrderDetails,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from '../../API/apiorder';

const AdminOrderManagement = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data);
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (MaDonHang) => {
    try {
      const details = await getOrderDetails(MaDonHang);
      navigation.navigate('DetailManagement', { MaDonHang, details });
    } catch {
      Alert.alert('Lỗi', 'Không thể lấy chi tiết đơn hàng.');
    }
  };

  const handleUpdateStatus = async (MaDonHang, newStatus) => {
    try {
      await updateOrderStatus(MaDonHang, newStatus);
      Alert.alert('Thành công', 'Đã cập nhật trạng thái.');
      fetchOrders();
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const handleDeleteOrder = async (MaDonHang) => {
    try {
      await deleteOrder(MaDonHang);
      Alert.alert('Thành công', 'Đã xóa đơn hàng');
      fetchOrders();
    } catch (error) {
      Alert.alert('Lỗi', error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.5 }]} numberOfLines={1}>{item.MaDonHang}</Text>
      <Text style={[styles.cell, { flex: 0.5 }]} numberOfLines={1}>{item.MaNguoiDung}</Text>
      <Text style={[styles.cell, { flex: 1 }]} numberOfLines={1}>{item.NgayDat?.substring(0, 10)}</Text>
      <Text style={[styles.cell, styles.status(item.TrangThai), { flex: 1.2 }]} numberOfLines={1}>{item.TrangThai}</Text>
      <View style={[styles.actionsContainer, { flex: 2 }]}>
        <TouchableOpacity
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleViewDetails(item.MaDonHang)}
        >
          <Text style={styles.actionText}>Xem</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.updateButton]}
          onPress={() => handleUpdateStatus(item.MaDonHang, 'ĐãGiao')}
        >
          <Text style={styles.actionText}>Cập nhật</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteOrder(item.MaDonHang)}
        >
          <Text style={styles.actionText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Quản Lý Đơn Hàng</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : orders.length === 0 ? (
        <Text style={styles.emptyText}>Không có đơn hàng nào.</Text>
      ) : (
        <View style={styles.tableContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.headerCell, { flex: 0.5 }]}>Mã ĐH</Text>
            <Text style={[styles.headerCell, { flex: 0.5 }]}>Mã ND</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Ngày Tạo</Text>
            <Text style={[styles.headerCell, { flex: 1.2 }]}>Trạng Thái</Text>
            <Text style={[styles.headerCell, { flex: 2 }]}>Hành động</Text>
          </View>

          <FlatList
            data={orders}
            keyExtractor={(item) => item.MaDonHang.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

// Get device width to ensure the table fits properly
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  tableContainer: {
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: 'rgba(255,255,255,0.3)',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    color: '#333',
    fontSize: 12,
    paddingHorizontal: 2,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  status: (status) => ({
    color: status === 'ĐãGiao' ? 'green' : status === 'ChờXácNhận' ? 'orange' : 'red',
    fontWeight: '600',
  }),
  actionsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0,
  },
  actionButton: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginHorizontal: 1,
  },
  viewButton: {
    backgroundColor: '#4CAF50',
  },
  updateButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  list: {
    flexGrow: 1,
  },
});

export default AdminOrderManagement;