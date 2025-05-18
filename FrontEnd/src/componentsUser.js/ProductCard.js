import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFavoritesByUser, addFavorite, deleteFavorite } from '../API/apifavorite';

const ProductCard = ({ product, onPress, navigation }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [MaNguoiDung, setMaNguoiDung] = useState(null);
  const [favoriteId, setFavoriteId] = useState(null);

  // Lấy MaNguoiDung từ AsyncStorage và kiểm tra trạng thái yêu thích ban đầu
  useEffect(() => {
    const fetchUserAndFavorites = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setMaNguoiDung(parsedUser.id);
          console.log('MaNguoiDung:', parsedUser.id); // Debug MaNguoiDung

          const favorites = await getFavoritesByUser(parsedUser.id);
          console.log('Danh sách yêu thích:', favorites); // Debug danh sách yêu thích
          const favoriteProduct = favorites.find(fav => fav.MaSanPham === product.id);
          if (favoriteProduct) {
            setIsFavorite(true);
            setFavoriteId(favoriteProduct.MaYeuThich);
            console.log('Sản phẩm đã yêu thích, MaYeuThich:', favoriteProduct.MaYeuThich);
          } else {
            console.log('Sản phẩm chưa yêu thích');
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng hoặc yêu thích:', error);
      }
    };

    fetchUserAndFavorites();
  }, [product.id]);

  // Xử lý nhấn biểu tượng yêu thích
  const handleFavoritePress = async () => {
    if (!MaNguoiDung) {
      Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm sản phẩm vào yêu thích.', [
        { text: 'Đăng nhập', onPress: () => navigation.navigate('LoginScreen') },
        { text: 'Hủy', style: 'cancel' },
      ]);
      return;
    }

    try {
      if (isFavorite) {
        // Xóa khỏi danh sách yêu thích
        await deleteFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
        console.log('Đã xóa yêu thích, MaYeuThich:', favoriteId);
        Alert.alert('Thành công', 'Đã xóa sản phẩm khỏi danh sách yêu thích.');
      } else {
        // Thêm vào danh sách yêu thích
        const response = await addFavorite(MaNguoiDung, product.id);
        console.log('Response từ addFavorite:', response); // Debug response
        if (response && response.MaYeuThich) {
          setIsFavorite(true);
          setFavoriteId(response.MaYeuThich);
          Alert.alert('Thành công', 'Đã thêm sản phẩm vào danh sách yêu thích.');
        } else {
          throw new Error('Không nhận được MaYeuThich từ response');
        }
      }
    } catch (error) {
      console.error('Lỗi khi xử lý yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể cập nhật danh sách yêu thích.');
    }
  };

  if (!product) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => onPress(product)} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteIcon} onPress={handleFavoritePress}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF0000' : '#888'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{product.name || 'Không có tên'}</Text>
      <Text style={styles.price}>{product.price || 'Không có giá'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  price: {
    fontSize: 12,
    color: '#673AB7',
    marginTop: 4,
  },
});

export default ProductCard;