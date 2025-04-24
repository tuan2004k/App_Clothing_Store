import React, { useState } from 'react';
import { Text, TextInput, Button, View, StyleSheet, TouchableOpacity } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../API/api';

const LoginScreen = () => {
  const [Email, setEmail] = useState('');
  const [MatKhau, setMatKhau] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
        const response = await loginUser({ Email, MatKhau });
        console.log('Phản hồi từ API trong handleLogin:', response);  // Log chi tiết phản hồi từ API
        
        // Kiểm tra nếu phản hồi có trường user
        if (response && response.user) {
            const user = response.user;
            console.log('Thông tin người dùng:', user);
            
            // Điều hướng đến trang phù hợp dựa trên VaiTro
            if (user.VaiTro === 'NguoiDung') {
                navigation.navigate('Users');  // Điều hướng đến trang Home
            } else if (user.VaiTro === 'admin') {
                navigation.navigate('Admin');  // Điều hướng đến trang Admin
            } else {
                console.error('Vai trò người dùng không hợp lệ:', user.VaiTro);
                alert('Vai trò người dùng không hợp lệ');
            }
        } else {
            console.error('Không tìm thấy thông tin người dùng trong phản hồi API');
            alert('Đăng nhập thất bại, vui lòng kiểm tra lại!');
        }
    } catch (error) {
        console.error('Lỗi đăng nhập:', error);
        alert('Đăng nhập thất bại, vui lòng thử lại!');
    }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={Email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={MatKhau}
        onChangeText={setMatKhau}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
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
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingLeft: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 15,
  },
  linkText: {
    color: '#007BFF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
