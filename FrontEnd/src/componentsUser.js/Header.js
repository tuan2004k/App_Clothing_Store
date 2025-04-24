import React from "react";
import { View, Text, StyleSheet, TouchableOpacity,Image } from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
 

const Header = ({ onMenuPress }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>Geeta.</Text>

      <View style={styles.iconGroup}>
        <IconWithBadge icon={<Ionicons name="notifications-outline" size={25} color="black" />} count={9} />
        <IconWithBadge icon={<MaterialIcons name="shopping-bag" size={25} color="black" />} count={3} />

        <TouchableOpacity style={styles.icon}>
          <Feather name="heart" size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon}>
          <Feather name="search" size={25} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.icon} onPress={onMenuPress}>
          <Feather name="menu" size={25} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const IconWithBadge = ({ icon, count }) => (
  <View style={styles.iconWithBadge}>
    {icon}
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 12,
    height: 120,
  },
  logo: {
    fontSize: 35,
    fontWeight: "Bold",   
    color: "#648ce8",
    fontFamily:"Open Sans",
    paddingLeft: 20
  },
  iconGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginLeft: 20,
    fontWeight: "bold", 
  },
  iconWithBadge: {
    marginLeft: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#648ce8",
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default Header;
