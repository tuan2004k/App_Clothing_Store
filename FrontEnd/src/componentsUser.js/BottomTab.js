import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Thêm biểu tượng

const BottomTab = () => {
  const navigation = useNavigation();

  console.log('BottomTab is rendering'); // Log để debug

  // State để theo dõi tab đang active
  const [activeTab, setActiveTab] = React.useState('DashBoardScreen');

  return (
    <View style={styles.bottomTab}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'DashBoardScreen' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('DashBoardScreen');
          setActiveTab('DashBoardScreen');
        }}
      >
        <Ionicons name="home" size={24} color={activeTab === 'DashBoardScreen' ? '#673AB7' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'DashBoardScreen' && styles.activeTabText]}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'HistoryOrderScreen' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('HistoryOrderScreen');
          setActiveTab('HistoryOrderScreen');
        }}
      >
        <Ionicons name="receipt" size={24} color={activeTab === 'HistoryOrderScreen' ? '#673AB7' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'HistoryOrderScreen' && styles.activeTabText]}>Đơn Hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'CartScreen' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('CartScreen');
          setActiveTab('CartScreen');
        }}
      >
        <Ionicons name="cart" size={24} color={activeTab === 'CartScreen' ? '#673AB7' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'CartScreen' && styles.activeTabText]}>Giỏ hàng</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'FavoriteScreen' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('FavoriteScreen');
          setActiveTab('FavoriteScreen');
        }}
      >
        <Ionicons name="heart" size={24} color={activeTab === 'FavoriteScreen' ? '#673AB7' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'FavoriteScreen' && styles.activeTabText]}>Yêu thích</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'AccountScreen' && styles.activeTab]}
        onPress={() => {
          navigation.navigate('AccountScreen');
          setActiveTab('AccountScreen');
        }}
      >
        <Ionicons name="person" size={24} color={activeTab === 'AccountScreen' ? '#673AB7' : '#666'} />
        <Text style={[styles.tabText, activeTab === 'AccountScreen' && styles.activeTabText]}>Tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTab: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    elevation: 8, // Hiệu ứng bóng cho Android
    shadowColor: '#000', // Hiệu ứng bóng cho iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  activeTab: {
    paddingTop: 4,
    borderTopWidth: 2,
    borderTopColor: '#673AB7',
    
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  activeTabText: {
    color: '#673AB7',
    fontWeight: '500',
  },
});

export default BottomTab;