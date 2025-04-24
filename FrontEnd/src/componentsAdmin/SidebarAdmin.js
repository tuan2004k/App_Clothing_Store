import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialIcons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const AdminSidebar = ({ visible, onClose, onNavigate }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -screenWidth,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [visible]);

  return (
    <Animated.View
      style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
    >
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <Feather name="x" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile */}
      <View style={styles.profile}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Admin</Text>
        <Text style={styles.email}>admin@store.com</Text>
      </View>

      {/* Menu for Admin */}
      <ScrollView style={styles.menu}>
        <MenuItem
          icon={<Feather name="home" size={20} color="#fff" />}
          text="Trang chủ"
          onPress={() => onNavigate("Trang chủ")}
        />
        <MenuItem
          icon={<MaterialIcons name="category" size={20} color="#fff" />}
          text="Danh mục"
          onPress={() => onNavigate("Danh mục")}
        />
        <MenuItem
          icon={<Feather name="box" size={20} color="#fff" />}
          text="Quản lý sản phẩm"
          onPress={() => onNavigate("Quản lý sản phẩm")} // Điều hướng đến quản lý sản phẩm
        />
        <MenuItem
          icon={<Feather name="users" size={20} color="#fff" />}
          text="Quản lý tài khoản"
          onPress={() => onNavigate("Quản lý tài khoản")}
        />
        <MenuItem
          icon={<Feather name="shopping-bag" size={20} color="#fff" />}
          text="Quản lý đơn hàng"
          onPress={() => onNavigate("Quản lý đơn hàng")}
        />
        <MenuItem
          icon={<Feather name="credit-card" size={20} color="#fff" />}
          text="Quản lý thanh toán"
          onPress={() => onNavigate("Quản lý thanh toán")}
        />
      </ScrollView>

      {/* Logout */}
      <TouchableOpacity style={styles.logout}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.menuText}>Đăng xuất</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {icon}
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "75%",
    height: "100%",
    backgroundColor: "#264653",
    zIndex: 999,
    paddingTop: 60,
    paddingHorizontal: 20,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  closeBtn: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  profile: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  email: {
    color: "#e0e0e0",
    fontSize: 14,
  },
  menu: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
});

export default AdminSidebar;
