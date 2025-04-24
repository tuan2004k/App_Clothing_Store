import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { registerUser } from '../API/api'; // Import hàm gọi API
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [Ten, setTen] = useState('');
  const [Email, setEmail] = useState('');
  const [MatKhau, setMatKhau] = useState('');

  const handleRegister = async () => {
    if (!Ten || !Email || !MatKhau) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const response = await registerUser({ Ten, Email, MatKhau });

      if (response.error) {
        Alert.alert('Lỗi', response.error);
      } else {
        // Lưu thông tin user vào AsyncStorage sau khi đăng ký thành công
        await AsyncStorage.setItem('user', JSON.stringify(response));
        console.log('🔄 Điều hướng sang Login');
        navigation.replace('Login');


      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng ký</Text>
      <TextInput style={styles.input} placeholder="Họ tên" value={Ten} onChangeText={setTen} />
      <TextInput style={styles.input} placeholder="Email" value={Email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mật khẩu" value={MatKhau} secureTextEntry onChangeText={setMatKhau} />

      <Button title="Đăng ký" onPress={handleRegister} />
      <Button title="Đã có tài khoản? Đăng nhập" onPress={() => navigation.navigate('Login')} />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 10 }
});

export default RegisterScreen;
