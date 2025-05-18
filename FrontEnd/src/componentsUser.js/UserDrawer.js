// import * as React from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { View, Text, TextInput, StyleSheet, TouchableOpacity,Image } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import Users from '../Page/Users';

// function CustomDrawerHeader() {
//   return (
//     <View style={styles.headerContainer}>
//       <Image
//         source={{ uri: 'https://via.placeholder.com/64' }}
//         style={styles.profileImage}
//       />
//       <Text style={styles.userName}>Varat Singh SH</Text>
//     </View>
//   );
// }

// function CustomDrawerContent({ navigation }) {
//   const menuItems = [
//     { name: 'Orders', icon: 'cart-outline' },
//     { name: 'Wishlist', icon: 'heart-outline' },
//     { name: 'Delivery Address', icon: 'location-outline' },
//     { name: 'Payment Methods', icon: 'card-outline' },
//     { name: 'Promo Card', icon: 'pricetag-outline' },
//     { name: 'Notifications', icon: 'notifications-outline' },
//     { name: 'Help', icon: 'help-circle-outline' },
//     { name: 'About', icon: 'information-circle-outline' },
//     { name: 'Log Out', icon: 'log-out-outline' },
//   ];

//   return (
//     <View style={styles.drawerContainer}>
//       <CustomDrawerHeader />
//       {menuItems.map((item, index) => (
//         <TouchableOpacity
//           key={index}
//           style={styles.menuItem}
//           onPress={() => {
//             if (item.name === 'Log Out') {
//               navigation.navigate('Login');
//             } else {
//               navigation.navigate('Users');
//             }
//           }}
//         >
//           <Ionicons name={item.icon} size={24} color="white" />
//           <Text style={styles.menuText}>{item.name}</Text>
//         </TouchableOpacity>
//       ))}
//     </View>
//   );
// }

// // Component Header tùy chỉnh
// function CustomHeader({ navigation }) {
//   const [searchText, setSearchText] = React.useState('');

//   return (
//     <View style={styles.customHeader}>
//       {/* Nút hamburger để mở Drawer */}
//       <TouchableOpacity onPress={() => navigation.openDrawer()}>
//         <Ionicons name="menu-outline" size={30} color="#fff" style={styles.hamburger} />
//       </TouchableOpacity>

//       {/* Các menu */}
//       <View style={styles.menuContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate('Users')}>
//           <Text style={styles.menuItemText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('Users')}>
//           <Text style={styles.menuItemText}>About</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('Users')}>
//           <Text style={styles.menuItemText}>Services</Text>
//         </TouchableOpacity>
//         <TouchableOpacity onPress={() => navigation.navigate('Users')}>
//           <Text style={styles.menuItemText}>Contact</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Thanh tìm kiếm */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search"
//           placeholderTextColor="#888"
//           value={searchText}
//           onChangeText={setSearchText}
//         />
//         <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
//       </View>
//     </View>
//   );
// }

// const Drawer = createDrawerNavigator();

// export default function UserDrawer() {
//   return (
//     <Drawer.Navigator
     
//     >
//       <Drawer.Screen
//         name="Users"
//         component={Users}
//         options={({ navigation }) => ({
//           header: () => <CustomHeader navigation={navigation} />,
//         })}
//       />
//     </Drawer.Navigator>
//   );
// }

// const styles = StyleSheet.create({
//   drawerContainer: {
//     flex: 1,
//     backgroundColor: '#673AB7',
//   },
//   headerContainer: {
//     padding: 16,
//     backgroundColor: '#512DA8',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//   },
//   userName: {
//     color: 'white',
//     fontSize: 18,
//     marginTop: 8,
//   },
//   menuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//   },
//   menuText: {
//     color: 'white',
//     fontSize: 16,
//     marginLeft: 16,
//   },
//   customHeader: {
//     backgroundColor: '#673AB7',
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   hamburger: {
//     marginRight: 16,
//   },
//   menuContainer: {
//     flexDirection: 'row',
//     flex: 1,
//   },
//   menuItemText: {
//     color: '#fff',
//     fontSize: 16,
//     marginHorizontal: 10,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 20,
//     paddingHorizontal: 10,
//     width: 200,
//   },
//   searchInput: {
//     flex: 1,
//     height: 40,
//     color: '#000',
//   },
//   searchIcon: {
//     marginLeft: 5,
//   },
// });