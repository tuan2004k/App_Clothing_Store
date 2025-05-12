// HomeUser.js
import React from "react";
import { View, StyleSheet } from "react-native";

const HomeUser = ({ navigation }) => {
  const handleMenuPress = () => {
    navigation.openDrawer(); // Sử dụng openDrawer từ navigation
  };

  return (
    <View style={styles.container}>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default HomeUser;