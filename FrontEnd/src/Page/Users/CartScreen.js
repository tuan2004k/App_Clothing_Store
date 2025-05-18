import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import {
  getCart,
  updateCart,
  removeFromCart,
  clearCart,
} from '../../API/apicart';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm import

const CartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [MaNguoiDung, setMaNguoiDung] = useState(null); // State để lưu MaNguoiDung

  useEffect(() => {
    // Lấy MaNguoiDung từ localStorage khi component mount
    const getUserIdFromStorage = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('MaNguoiDung');
        if (storedUserId) {
          setMaNguoiDung(parseInt(storedUserId, 10)); // Chuyển đổi sang số nguyên
        } else {
          // Nếu không có trong localStorage, dùng route.params hoặc mặc định
          const userIdFromParams = route.params?.MaNguoiDung;
          if (userIdFromParams) {
            setMaNguoiDung(userIdFromParams);
            await AsyncStorage.setItem('MaNguoiDung', userIdFromParams.toString());
          } else {
            setMaNguoiDung(1); // Mặc định nếu không có dữ liệu
            await AsyncStorage.setItem('MaNguoiDung', '1');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy MaNguoiDung từ localStorage:', error);
        setMaNguoiDung(1); // Fallback nếu có lỗi
        await AsyncStorage.setItem('MaNguoiDung', '1');
      }
    };

    getUserIdFromStorage().then(() => {
      if (MaNguoiDung) fetchCart(); // Chỉ gọi fetchCart khi có MaNguoiDung
    });
  }, [MaNguoiDung, route.params?.MaNguoiDung]);

  const fetchCart = async () => {
    if (!MaNguoiDung) return; // Đảm bảo MaNguoiDung đã được thiết lập
    try {
      setLoading(true);
      const data = await getCart(MaNguoiDung);
      setCartItems(data);

      const initialSelected = {};
      data.forEach((item) => {
        initialSelected[item.MaChiTietSanPham] = true;
      });
      setSelectedItems(initialSelected);

      calculateTotal(data, initialSelected);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items, selected = selectedItems) => {
    const totalAmount = items.reduce((sum, item) => {
      if (selected[item.MaChiTietSanPham]) {
        return sum + (item.Gia || 0) * (item.SoLuong || 0);
      }
      return sum;
    }, 0);
    setTotal(totalAmount);
  };

  const handleToggleSelect = (MaChiTietSanPham) => {
    const newSelectedItems = {
      ...selectedItems,
      [MaChiTietSanPham]: !selectedItems[MaChiTietSanPham],
    };
    setSelectedItems(newSelectedItems);
    calculateTotal(cartItems, newSelectedItems);
  };

  const handleToggleSelectAll = () => {
    const allSelected = Object.values(selectedItems).every((value) => value);
    const newSelectedItems = {};

    cartItems.forEach((item) => {
      newSelectedItems[item.MaChiTietSanPham] = !allSelected;
    });

    setSelectedItems(newSelectedItems);
    calculateTotal(cartItems, newSelectedItems);
  };

  const handleUpdateQuantity = async (MaChiTietSanPham, SoLuong) => {
    if (SoLuong <= 0) {
      Alert.alert('Cảnh báo', 'Số lượng phải lớn hơn 0.');
      return;
    }
    if (!MaNguoiDung) return;
    try {
      await updateCart(MaNguoiDung, MaChiTietSanPham, SoLuong);
      const updatedItems = cartItems.map((item) =>
        item.MaChiTietSanPham === MaChiTietSanPham ? { ...item, SoLuong } : item
      );
      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng.');
    }
  };

  const handleRemoveItem = async (MaChiTietSanPham) => {
    if (!MaNguoiDung) return;
    try {
      await removeFromCart(MaNguoiDung, MaChiTietSanPham);
      const updatedItems = cartItems.filter(
        (item) => item.MaChiTietSanPham !== MaChiTietSanPham
      );
      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[MaChiTietSanPham];
      setCartItems(updatedItems);
      setSelectedItems(newSelectedItems);
      calculateTotal(updatedItems, newSelectedItems);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
    }
  };

  const handleCheckout = () => {
    const selectedProducts = cartItems.filter(
      (item) => selectedItems[item.MaChiTietSanPham]
    );

    if (selectedProducts.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
      return;
    }

    if (!MaNguoiDung) return;
    navigation.navigate('CheckoutScreen', {
      MaNguoiDung,
      selectedProducts,
      total,
    });
  };

  const handleRemoveSelected = async () => {
    const selectedProductIds = Object.keys(selectedItems).filter(
      (id) => selectedItems[id]
    );

    if (selectedProductIds.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để xóa.');
      return;
    }

    if (!MaNguoiDung) return;
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              for (const id of selectedProductIds) {
                await removeFromCart(MaNguoiDung, id);
              }
              await fetchCart();
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa sản phẩm đã chọn.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const areAllSelected = () => {
    return (
      cartItems.length > 0 &&
      Object.keys(selectedItems).length > 0 &&
      cartItems.every((item) => selectedItems[item.MaChiTietSanPham])
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Giỏ hàng trống</Text>
      <TouchableOpacity
        style={styles.shopButton}
        onPress={() => navigation.navigate('Users')}
      >
        <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCartItems = () => (
    <>
      <View style={styles.selectAllContainer}>
        <CheckBox
          checked={areAllSelected()}
          onPress={handleToggleSelectAll}
          containerStyle={styles.selectAllCheckbox}
          title="Chọn tất cả"
          textStyle={styles.selectAllText}
        />
        <TouchableOpacity
          style={styles.removeSelectedButton}
          onPress={handleRemoveSelected}
        >
          <Text style={styles.removeSelectedText}>Xóa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.MaGioHang.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                checked={selectedItems[item.MaChiTietSanPham] || false}
                onPress={() => handleToggleSelect(item.MaChiTietSanPham)}
                containerStyle={styles.checkbox}
              />
            </View>
            <Image
              source={{ uri: item.HinhAnh || 'https://via.placeholder.com/80' }}
              style={styles.image}
              defaultSource={require('../../../../assets/AO LEN LOUIS VUITON.webp')}
            />
            <View style={styles.details}>
              <Text style={styles.name} numberOfLines={2}>
                {item.Ten || 'Tên không xác định'}
              </Text>
              <Text style={styles.variant}>
                Kích thước: {item.Size}, Màu sắc: {item.MauSac}
              </Text>
              <Text style={styles.price}>
                {(item.Gia != null ? item.Gia : 0).toLocaleString()} VNĐ
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    handleUpdateQuantity(item.MaChiTietSanPham, (item.SoLuong || 0) - 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.quantityValue}>
                  <Text style={styles.quantity}>{item.SoLuong || 0}</Text>
                </View>
                <TouchableOpacity
                  style={styles.quantityButton}
                  onPress={() =>
                    handleUpdateQuantity(item.MaChiTietSanPham, (item.SoLuong || 0) + 1)
                  }
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.MaChiTietSanPham)}
            >
              <Text style={styles.removeText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
        ListFooterComponent={<View style={styles.listFooterSpace} />}
      />
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          {cartItems.length === 0 ? renderEmptyCart() : renderCartItems()}
        </View>
        {cartItems.length > 0 && (
          <View style={styles.fixedBottomContainer}>
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>
                Tổng tiền ({cartItems.filter((item) => selectedItems[item.MaChiTietSanPham]).length} sản phẩm):
              </Text>
              <Text style={styles.totalText}>{total.toLocaleString()} VNĐ</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                Object.values(selectedItems).some((v) => v) ? {} : styles.disabledButton,
              ]}
              onPress={handleCheckout}
              disabled={!Object.values(selectedItems).some((v) => v)}
            >
              <Text style={styles.checkoutText}>Mua hàng</Text>
            </TouchableOpacity>
          </View>
        )}
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
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  selectAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectAllCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  selectAllText: {
    fontWeight: '500',
    fontSize: 14,
  },
  removeSelectedButton: {
    padding: 8,
  },
  removeSelectedText: {
    color: '#ff6347',
    fontSize: 14,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  checkboxContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  variant: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: '#2ecc71',
    fontWeight: '600',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityValue: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    backgroundColor: '#ff6347',
    padding: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  removeText: {
    color: '#fff',
    fontSize: 12,
  },
  flatListContent: {
    paddingHorizontal: 10,
  },
  listFooterSpace: {
    height: 120,
  },
  fixedBottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
  checkoutButton: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;