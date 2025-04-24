import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SideBar from "../componentsUser.js/SideBar";
import Header from "../componentsUser.js/Header";

const User = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleMenuPress = () => {
    setIsSidebarOpen(true);
  };

  return (
    <View style={styles.container}>
      <Header onMenuPress={handleMenuPress} />
      <SideBar visible={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default User;
