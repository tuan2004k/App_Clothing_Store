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
import {
  Feather,
  Ionicons,
  MaterialIcons,
  FontAwesome,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

const Sidebar = ({ visible, onClose }) => {
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
          source={{ uri: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/rockcms/2023-07/230724-elon-musk-ac-1041p-bc05fb.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Elon Musk</Text>
        <Text style={styles.email}>elonmuskceoX@gmail.com</Text>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menu}>
        <MenuItem icon={<Feather name="box" size={20} color="#fff" />} text="Orders" />
        <MenuItem icon={<Feather name="heart" size={20} color="#fff" />} text="Wishlist" />
        <MenuItem icon={<Ionicons name="location-outline" size={20} color="#fff" />} text="Delivery Address" />
        <MenuItem icon={<Feather name="credit-card" size={20} color="#fff" />} text="Payment Methods" />
        <MenuItem icon={<MaterialIcons name="card-giftcard" size={20} color="#fff" />} text="Promo Cord" />
        <MenuItem icon={<Ionicons name="notifications-outline" size={20} color="#fff" />} text="Notifications" />
        <MenuItem icon={<Feather name="help-circle" size={20} color="#fff" />} text="Help" />
        <MenuItem icon={<AntDesign name="infocirlceo" size={20} color="#fff" />} text="About" />
      </ScrollView>

      {/* Log out */}
      <TouchableOpacity style={styles.logout}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.menuText}>LOG OUT</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const MenuItem = ({ icon, text }) => (
  <TouchableOpacity style={styles.menuItem}>
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
    backgroundColor: "#648ce8",
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
    paddingVertical: 16,
    borderTopColor: "#ffffff44",
    borderTopWidth: 1,
  },
});

export default Sidebar;
