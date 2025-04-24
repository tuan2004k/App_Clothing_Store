import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text>Chào mừng bạn đến với trang chủ!</Text>
      <Button title="Đăng xuất" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default HomeScreen;
