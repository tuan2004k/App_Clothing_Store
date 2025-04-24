import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Badge, Snackbar } from 'react-native-paper';
import { getAllUsers, updateUser, deleteUser } from '../../API/api';
import SearchBar from '../../Common/SearchBar';

const ManageAccount = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ten, setTen] = useState('');
  const [email, setEmail] = useState('');
  const [vaiTro, setVaiTro] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res);
      setFilteredUsers(res); // Initialize filteredUsers with all users
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Tìm kiếm và lọc vai trò
  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = users.filter(
      (user) =>
        user.Ten.toLowerCase().includes(text.toLowerCase()) ||
        user.Email.toLowerCase().includes(text.toLowerCase()) ||
        user.VaiTro.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setTen(user.Ten);
    setEmail(user.Email);
    setVaiTro(user.VaiTro);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setSnackbarMessage('Xóa thành công');
      setSnackbarVisible(true);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      setSnackbarMessage('Lỗi khi xóa');
      setSnackbarVisible(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(selectedUser.MaNguoiDung, {
        Ten: ten,
        Email: email,
        VaiTro: vaiTro,
      });
      setSnackbarMessage('Cập nhật thành công');
      setSnackbarVisible(true);
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      setSnackbarMessage('Lỗi khi cập nhật');
      setSnackbarVisible(true);
    }
  };

  const roleColor = (role) => {
    return role === 'Admin' ? 'red' : role === 'Khách hàng' ? 'blue' : 'gray';
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={{ flex: 1 }}>{index + 1}</Text>
      <Text style={{ flex: 2 }}>{item.Ten}</Text>
      <Text style={{ flex: 3 }}>{item.Email}</Text>
      <Badge style={{ backgroundColor: roleColor(item.VaiTro), color: 'white', flex: 2 }}>
        {item.VaiTro}
      </Badge>
      <View style={styles.actionContainer}>
        <Button compact onPress={() => handleEdit(item)} style={styles.button}>
          Sửa
        </Button>
        <Button compact onPress={() => handleDelete(item.MaNguoiDung)} color="red" style={styles.button}>
          Xóa
        </Button>
      </View>
    </View>
  );

  // Header Row for Table
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { flex: 1 }]}>STT</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Tên</Text>
      <Text style={[styles.headerCell, { flex: 3 }]}>Email</Text>
      <Text style={[styles.headerCell, { flex: 2 }]}>Vai trò</Text>
      <View style={styles.headerCell}></View> {/* Empty cell for actions */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý người dùng</Text>
      <SearchBar
        placeholder="Tìm kiếm người dùng..."
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />

      {selectedUser && (
        <View style={styles.updateForm}>
          <TextInput label="Tên" value={ten} onChangeText={setTen} />
          <TextInput label="Email" value={email} onChangeText={setEmail} />
          <TextInput label="Vai trò" value={vaiTro} onChangeText={setVaiTro} />
          <Button mode="contained" onPress={handleUpdate} style={styles.updateButton}>
            Cập nhật
          </Button>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.MaNguoiDung.toString()}
          style={styles.scrollContainer}
          ListHeaderComponent={renderHeader} // Add the header here
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Đóng',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  updateForm: {
    marginBottom: 16,
  },
  updateButton: {
    marginTop: 8,
  },
  scrollContainer: {
    marginTop: 16,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    backgroundColor: '#f5f5f5',
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 2,
    justifyContent: 'flex-end',
  },
  button: {
    marginHorizontal: 4,
  },
});

export default ManageAccount;
