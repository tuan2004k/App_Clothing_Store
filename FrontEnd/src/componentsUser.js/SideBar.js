// import React, { useRef, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Animated,
//   TouchableOpacity,
//   Dimensions,
//   Image,
//   ScrollView,
// } from "react-native";
// import {
//   Feather,
//   Ionicons,
//   MaterialIcons,
//   AntDesign,
// } from "@expo/vector-icons";

// const screenWidth = Dimensions.get("window").width;

// const Sidebar = ({ navigation }) => {
//   const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

//   useEffect(() => {
//     Animated.timing(slideAnim, {
//       toValue: 0,
//       duration: 300,
//       useNativeDriver: false,
//     }).start();
//   }, []);

//   const onClose = () => {
//     navigation.closeDrawer();
//   };

//   const navigateTo = (screen) => {
//     navigation.navigate('Main', { screen: screen });
//     navigation.closeDrawer();
//   };

//   const handleLogout = () => {
//       navigation.navigate('Auth', { screen: 'Login' });
//     navigation.closeDrawer();
//   };

//   return (
//     <Animated.View
//       style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
//     >
//       <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
//         <Feather name="x" size={24} color="#fff" />
//       </TouchableOpacity>

//       {/* Profile */}
//       <View style={styles.profile}>
//         <Image
//           source={{
//             uri: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/rockcms/2023-07/230724-elon-musk-ac-1041p-bc05fb.jpg",
//           }}
//           style={styles.avatar}
//         />
//         <Text style={styles.name}>Elon Musk</Text>
//         <Text style={styles.email}>elonmuskceoX@gmail.com</Text>
//       </View>

//       {/* Menu */}
//       <ScrollView style={styles.menu}>

//         <MenuItem
//           icon={<Feather name="box" size={20} color="#fff" />}
//           text="Orders"
//           onPress={() => navigateTo("HomeUser")}
//         />
//         <MenuItem
//           icon={<Feather name="heart" size={20} color="#fff" />}
//           text="Wishlist"
//           onPress={() => navigateTo("Wishlist")}
//         />
//         <MenuItem
//           icon={<Feather name="credit-card" size={20} color="#fff" />}
//           text="Payment Methods"
//           onPress={() => navigateTo("PaymentMethods")}
//         />
//         <MenuItem
//           icon={<MaterialIcons name="card-giftcard" size={20} color="#fff" />}
//           text="Promo Cord"
//           onPress={() => navigateTo("PromoCode")}
//         />
//         <MenuItem
//           icon={<Ionicons name="notifications-outline" size={20} color="#fff" />}
//           text="Notifications"
//           onPress={() => navigateTo("Notifications")}
//         />
//         <MenuItem
//           icon={<Feather name="help-circle" size={20} color="#fff" />}
//           text="Help"
//           onPress={() => navigateTo("Help")}
//         />
//         <MenuItem
//           icon={<AntDesign name="infocirlceo" size={20} color="#fff" />}
//           text="About"
//           onPress={() => navigateTo("About")}
//         />
//       </ScrollView>

//       {/* Log out */}
//       <TouchableOpacity style={styles.logout} onPress={handleLogout}>
//         <Feather name="log-out" size={20} color="#fff" />
//         <Text style={styles.menuText}>LOG OUT</Text>
//       </TouchableOpacity>
//     </Animated.View>
//   );
// };

// const MenuItem = ({ icon, text, onPress }) => (
//   <TouchableOpacity style={styles.menuItem} onPress={onPress}>
//     {icon}
//     <Text style={styles.menuText}>{text}</Text>
//   </TouchableOpacity>
// );

// const styles = StyleSheet.create({
//   sidebar: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     width: "75%",
//     height: "100%",
//     backgroundColor: "#648ce8",
//     zIndex: 999,
//     paddingTop: 60,
//     paddingHorizontal: 20,
//     borderTopRightRadius: 24,
//     borderBottomRightRadius: 24,
//   },
//   closeBtn: {
//     position: "absolute",
//     top: 20,
//     right: 20,
//   },
//   profile: {
//     alignItems: "center",
//     marginBottom: 30,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   name: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 10,
//   },
//   email: {
//     color: "#e0e0e0",
//     fontSize: 14,
//   },
//   menu: {
//     flex: 1,
//   },
//   menuItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 14,
//   },
//   menuText: {
//     color: "#fff",
//     fontSize: 16,
//     marginLeft: 12,
//   },
//   logout: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 16,
//     borderTopColor: "#ffffff44",
//     borderTopWidth: 1,
//   },
// });

// export default Sidebar;

// SideBar.js (phiên bản tùy chỉnh)
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
  AntDesign,
} from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

// Thêm định nghĩa MenuItem
const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    {icon}
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
);

// Thêm props visible và onClose
const Sidebar = ({ navigation, visible, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  // Sử dụng onClose từ props thay vì navigation.closeDrawer()
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (navigation) {
      navigation.closeDrawer();
    }
  };

  const navigateTo = (screen) => {
    if (navigation) {
      navigation.navigate('Main', { screen: screen });
      navigation.closeDrawer();
    }
  };

  const handleLogout = () => {
    if (navigation) {
      navigation.navigate('Auth', { screen: 'Login' });
      navigation.closeDrawer();
    }
  };

  // Nếu không visible và không đang sử dụng drawer, trả về null
  if (!visible && !navigation) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}
    >
      <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
        <Feather name="x" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Profile */}
      <View style={styles.profile}>
        <Image
          source={{
            uri: "https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1000w,f_auto,q_auto:best/rockcms/2023-07/230724-elon-musk-ac-1041p-bc05fb.jpg",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Elon Musk</Text>
        <Text style={styles.email}>elonmuskceoX@gmail.com</Text>
      </View>

      {/* Menu */}
      <ScrollView style={styles.menu}>
        <MenuItem
          icon={<Feather name="box" size={20} color="#fff" />}
          text="Orders"
          onPress={() => navigateTo("HomeUser")}
        />
        <MenuItem
          icon={<Feather name="heart" size={20} color="#fff" />}
          text="Wishlist"
          onPress={() => navigateTo("Wishlist")}
        />
        <MenuItem
          icon={<Feather name="credit-card" size={20} color="#fff" />}
          text="Payment Methods"
          onPress={() => navigateTo("PaymentMethods")}
        />
        <MenuItem
          icon={<MaterialIcons name="card-giftcard" size={20} color="#fff" />}
          text="Promo Cord"
          onPress={() => navigateTo("PromoCode")}
        />
        <MenuItem
          icon={<Ionicons name="notifications-outline" size={20} color="#fff" />}
          text="Notifications"
          onPress={() => navigateTo("Notifications")}
        />
        <MenuItem
          icon={<Feather name="help-circle" size={20} color="#fff" />}
          text="Help"
          onPress={() => navigateTo("Help")}
        />
        <MenuItem
          icon={<AntDesign name="infocirlceo" size={20} color="#fff" />}
          text="About"
          onPress={() => navigateTo("About")}
        />
      </ScrollView>

      {/* Log out */}
      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Feather name="log-out" size={20} color="#fff" />
        <Text style={styles.menuText}>LOG OUT</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

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