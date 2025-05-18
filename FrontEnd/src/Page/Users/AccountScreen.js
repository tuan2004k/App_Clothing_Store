import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserById } from '../../API/api';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState({
    Ten: 'Người dùng',
    Email: 'email@example.com',
    avatar: 'https://i.pravatar.cc/150?img=12',
    MaNguoiDung: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        console.log('Dữ liệu từ AsyncStorage:', userData); // Log để kiểm tra
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            Ten: parsedUser.Ten || 'Người dùng',
            Email: parsedUser.Email || 'email@example.com',
            avatar: parsedUser.avatar || 'https://i.pravatar.cc/150?img=12',
            MaNguoiDung: parsedUser.MaNguoiDung || null, // Đảm bảo MaNguoiDung tồn tại
          });

          if (parsedUser.MaNguoiDung) {
            try {
              const response = await getUserById(parsedUser.MaNguoiDung);
              console.log('Phản hồi từ API getUserById:', response);
              if (response && !response.error) {
                setUser({
                  Ten: response.Ten || parsedUser.Ten || 'Người dùng',
                  Email: response.Email || parsedUser.Email || 'email@example.com',
                  avatar: response.AnhDaiDien || parsedUser.avatar || 'https://i.pravatar.cc/150?img=12',
                  MaNguoiDung: parsedUser.MaNguoiDung,
                });
                await AsyncStorage.setItem('user', JSON.stringify(response));
              } else {
                console.warn('API trả về lỗi hoặc không có dữ liệu:', response);
              }
            } catch (apiError) {
              console.error('Lỗi khi gọi API user profile:', apiError);
              Alert.alert('Lỗi', 'Không thể tải thông tin người dùng từ API.');
            }
          } else {
            console.warn('MaNguoiDung không tồn tại trong AsyncStorage:', parsedUser);
          }
        } else {
          Alert.alert('Lỗi', 'Vui lòng đăng nhập để xem thông tin tài khoản!');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        Alert.alert('Lỗi', 'Không thể tải thông tin tài khoản, vui lòng thử lại!');
      }
    };

    fetchUserData();
  }, [navigation]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      Alert.alert('Lỗi', 'Đăng xuất thất bại, vui lòng thử lại!');
    }
  };

  const handleUpdateProfile = () => {
    navigation.navigate('UpdateProfileScreen');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: user.avatar }}
          style={styles.avatar}
          onError={() => setUser({ ...user, avatar: 'https://i.pravatar.cc/150?img=12' })}
        />
        <Text style={styles.userName}>{user.Ten}</Text>
        <Text style={styles.userEmail}>{user.Email}</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('CartScreen', { screen: 'Giỏ hàng' })}
        >
          <Ionicons name="cart-outline" size={24} color="#2196F3" />
          <Text style={styles.optionText}>Xem giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('Tabs', { screen: 'Yêu thích' })}
        >
          <Ionicons name="heart-outline" size={24} color="#2196F3" />
          <Text style={styles.optionText}>Danh sách yêu thích</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleUpdateProfile}
        >
          <Ionicons name="create-outline" size={24} color="#2196F3" />
          <Text style={styles.optionText}>Cập nhật thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#2196F3" />
          <Text style={styles.optionText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 15,
    backgroundColor: '#f5f5f5',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  optionsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#2196F3',
    fontWeight: '500',
  },
});