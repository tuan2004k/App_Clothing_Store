import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

const AdminHeader = ({ title, onMenuPress, rightComponent }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Nút menu bên trái */}
      <TouchableOpacity onPress={onMenuPress} style={styles.iconButton}>
        <Feather name="menu" size={24} color="#000" />
      </TouchableOpacity>

      {/* Tiêu đề ở giữa */}
      <Text style={styles.title}>{title}</Text>

      {/* Chỗ để icon hoặc button bên phải nếu có */}
      <View style={styles.rightPlaceholder}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: '#648ce8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    elevation: 4,
  },
  iconButton: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 30, // đủ chỗ để đặt một icon hoặc button
    alignItems: 'flex-end',
  },
});

export default AdminHeader;
