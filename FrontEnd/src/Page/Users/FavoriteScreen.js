import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator, Alert, Image, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFavoritesByUser, deleteFavorite } from '../../API/apifavorite';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const FavoriteScreen = ({ navigation, route }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [MaNguoiDung, setMaNguoiDung] = useState(null);

  // Lấy MaNguoiDung từ AsyncStorage và tải danh sách yêu thích
  const fetchUserIdAndFavorites = async () => {
    try {
      setLoading(true);
      const userData = await AsyncStorage.getItem('user');
      console.log('Dữ liệu từ AsyncStorage:', userData); // Debug dữ liệu người dùng
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setMaNguoiDung(parsedUser.id);
        console.log('MaNguoiDung:', parsedUser.id); // Debug MaNguoiDung
        await fetchFavorites(parsedUser.id);
      } else {
        Alert.alert(
          'Yêu cầu đăng nhập',
          'Vui lòng đăng nhập để xem danh sách yêu thích.',
          [
            { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginScreen') },
            { text: 'Hủy', style: 'cancel' },
          ]
        );
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      Alert.alert('Lỗi', 'Không thể lấy thông tin người dùng.');
    } finally {
      setLoading(false);
    }
  };

  // Lấy danh sách yêu thích
  const fetchFavorites = async (userId = MaNguoiDung) => {
    if (!userId) return;
    try {
      const data = await getFavoritesByUser(userId);
      console.log('Danh sách yêu thích từ API:', data); // Debug dữ liệu từ API
      if (Array.isArray(data)) {
        setFavorites(data);
      } else {
        setFavorites([]);
        console.warn('Dữ liệu từ API không phải mảng:', data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể tải danh sách yêu thích.');
      setFavorites([]);
    }
  };

  // Gọi khi màn hình được render lần đầu
  useEffect(() => {
    fetchUserIdAndFavorites();
  }, []);

  // Tải lại danh sách yêu thích mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      if (MaNguoiDung) {
        fetchFavorites(MaNguoiDung);
      }
    }, [MaNguoiDung])
  );

  // Xử lý sản phẩm mới được thêm vào yêu thích (nếu có)
  useEffect(() => {
    if (route.params?.newFavorite) {
      setFavorites((prevFavorites) => {
        const updatedFavorites = [route.params.newFavorite, ...prevFavorites];
        return updatedFavorites.sort((a, b) => new Date(b.NgayThem) - new Date(a.NgayThem));
      });
    }
  }, [route.params?.newFavorite]);

  // Xử lý xóa sản phẩm yêu thích
  const handleDeleteFavorite = async (MaYeuThich) => {
    try {
      await deleteFavorite(MaYeuThich);
      setFavorites(favorites.filter(fav => fav.MaYeuThich !== MaYeuThich));
      Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi danh sách yêu thích.');
    } catch (error) {
      console.error('Lỗi khi xóa yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm khỏi danh sách yêu thích.');
    }
  };

  // Xử lý nhấn vào sản phẩm để xem chi tiết
  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.MaSanPham });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleProductPress(item)}
    >
      <Image
        source={{ uri: item.HinhAnh || 'https://via.placeholder.com/100' }}
        style={styles.favoriteImage}
        resizeMode="contain"
      />
      <View style={styles.favoriteInfo}>
        <Text style={styles.favoriteText} numberOfLines={1}>{item.TenSanPham || 'Không có tên'}</Text>
        <Text style={styles.favoritePrice}>{`$${item.Gia || 0}.00 USD`}</Text>
        <Text style={styles.favoriteCollection}>GEETA COLLECTION</Text>
      </View>
      <TouchableOpacity style={styles.arrowButton} onPress={() => handleProductPress(item)}>
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
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
          <Text style={styles.emptyText}>Vui lòng đăng nhập để xem danh sách yêu thích.</Text>
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
     
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.MaYeuThich.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có sản phẩm yêu thích nào.</Text>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8f8f8' },
  backButton: {
    fontSize: 20,
    color: '#000',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  list: { padding: 16 },
  row: {
    justifyContent: 'space-between',
  },
  favoriteItem: {
    width: (width - 32) / 2 - 8, // 2 cột, trừ padding và margin
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  favoriteInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteCollection: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 8,
  },
  arrowButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  arrowText: {
    fontSize: 16,
    color: '#000',
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

export default FavoriteScreen;