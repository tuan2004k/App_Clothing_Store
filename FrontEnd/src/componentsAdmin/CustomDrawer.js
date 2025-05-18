import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function CustomDrawer(props) {
  const [user, setUser] = useState({ Ten: 'Admin', avatar: 'https://i.pravatar.cc/150?img=12' });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser({
            Ten: parsedUser.Ten || 'Admin',
            Email: parsedUser.Email || 'Email',
            avatar: parsedUser.avatar || 'https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/476423984_570906022608531_4458553715152377197_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeER8TpSUQG43eqmcsgX7Q4yCABdmzOQE7QIAF2bM5ATtCQ7fnGTuxvhC9aFanCIrNz03ZkivNGP-F5oHeFRXLZ6&_nc_ohc=Xv6ROtgDTQ8Q7kNvwFtDAgS&_nc_oc=Adksq1Qw9ef6o52btMoxkmk_vaShvPk72Zxv6gxDmB8NgmXaODikLVnezUJfmu3errk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QSH1tOnaG5O8851vQoqqvw&oh=00_AfKN4hCQgWCLCwIwLh76_5IZ7mZE-ACuDoJzVxdorboxwA&oe=6828D160', // Fallback avatar
          });
        }
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      props.navigation.navigate('Login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      alert('Đăng xuất thất bại, vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.gradient}>
        <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: user.avatar }}
              style={styles.avatar}
              onError={() => setUser({ ...user, avatar: 'https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/476423984_570906022608531_4458553715152377197_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeER8TpSUQG43eqmcsgX7Q4yCABdmzOQE7QIAF2bM5ATtCQ7fnGTuxvhC9aFanCIrNz03ZkivNGP-F5oHeFRXLZ6&_nc_ohc=Xv6ROtgDTQ8Q7kNvwFtDAgS&_nc_oc=Adksq1Qw9ef6o52btMoxkmk_vaShvPk72Zxv6gxDmB8NgmXaODikLVnezUJfmu3errk&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=QSH1tOnaG5O8851vQoqqvw&oh=00_AfKN4hCQgWCLCwIwLh76_5IZ7mZE-ACuDoJzVxdorboxwA&oe=6828D160' })}
            />
            <Text style={styles.name}>{user.Ten}</Text>
            <Text style={{ color: '#fff', fontSize: 14 }}>{user.Email}</Text>
          </View>
          <View style={styles.drawerItemsContainer}>
            <DrawerItemList {...props} />
          </View>
        </DrawerContentScrollView>
      </LinearGradient>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#333" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContainer: {
    backgroundColor: 'transparent',
  },
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#f5f5f5', // Fallback background for broken images
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  drawerItemsContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  logoutContainer: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
    fontWeight: '500',
  },
});