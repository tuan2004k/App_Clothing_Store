// Tạo file WishlistScreen.js trong thư mục Page/Users
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WishlistScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wishlist Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WishlistScreen;