import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

const LoginScreen = () => {
  const [Email, setEmail] = useState('');
  const [MatKhau, setMatKhau] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  // Fetch user data from AsyncStorage on mount (optional, for initial state)
  useEffect(() => {
    const fetchStoredUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          console.log('Dữ liệu người dùng từ AsyncStorage:', parsedUser);
          // Có thể sử dụng để pre-fill nếu cần, nhưng thường không cần trong login
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ AsyncStorage:', error);
      }
    };
    fetchStoredUser();
  }, []);

  const handleLogin = async () => {
    if (!Email || !MatKhau) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await loginUser({ Email, MatKhau });
      console.log('Phản hồi từ API trong handleLogin:', response);

      if (response && response.user) {
        const user = response.user;
        console.log('Thông tin người dùng từ API:', user);

        // Chuẩn bị dữ liệu để lưu vào AsyncStorage
        const userDataToStore = {
          id: user.id || '', // MaNguoiDung
          Ten: user.Ten || '',
          Email: user.Email || '',
          VaiTro: user.VaiTro || '',
          DiaChi: user.DiaChi || '', // Nếu API không trả, để rỗng, sẽ cập nhật sau
          SoDienThoai: user.SoDienThoai || '', // Nếu API không trả, để rỗng
          avatar: user.avatar || '', // Giả sử ban đầu rỗng
          token: response.token || '',
        };

        // Lưu vào AsyncStorage
        await AsyncStorage.setItem('user', JSON.stringify(userDataToStore));
        console.log('Đã lưu user vào AsyncStorage:', userDataToStore);

        // Navigate based on user role
        if (user.VaiTro === 'NguoiDung') {
          navigation.navigate('DashBoardScreen');
        } else if (user.VaiTro === 'admin') {
          navigation.navigate('Admin');
        } else {
          console.error('Vai trò người dùng không hợp lệ:', user.VaiTro);
          Alert.alert('Lỗi', 'Vai trò người dùng không hợp lệ');
        }
      } else {
        console.error('Không tìm thấy thông tin người dùng trong phản hồi API');
        Alert.alert('Lỗi', 'Đăng nhập thất bại, vui lòng kiểm tra thông tin đăng nhập!');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Đăng nhập thất bại, vui lòng kiểm tra kết nối và thử lại!');
    }
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.formContainer}>
          <Image
            source={require('../../../assets/logo.png')} // Update this path if needed
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Đăng Nhập</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={Email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#999"
              value={MatKhau}
              onChangeText={setMatKhau}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              style={styles.eyeIcon}
            >
              <MaterialIcons
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <LinearGradient
              colors={['#2196F3', '#21CBF3']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Đăng Nhập</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkText}>Chưa có tài khoản? Đăng ký</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.linkText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  linkText: {
    color: '#2196F3',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LoginScreen;