import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Ionicons name="person-circle-outline" size={80} color="#673AB7" />
        <Text style={styles.userName}>Varat Singh SH</Text>
        <Text style={styles.userEmail}>varat@example.com</Text>
      </View>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('Tabs', { screen: 'Giỏ hàng' })}
      >
        <Ionicons name="cart-outline" size={24} color="#673AB7" />
        <Text style={styles.optionText}>Xem giỏ hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('Tabs', { screen: 'Yêu thích' })}
      >
        <Ionicons name="heart-outline" size={24} color="#673AB7" />
        <Text style={styles.optionText}>Danh sách yêu thích</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Ionicons name="log-out-outline" size={24} color="#673AB7" />
        <Text style={styles.optionText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#673AB7',
  },
});