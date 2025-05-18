import React, { useEffect, useState } from 'react';
import { View, Alert, Modal, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text, TextInput, Button, Badge, Snackbar, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng icon từ expo-vector-icons
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
  const [modalVisible, setModalVisible] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res);
      setFilteredUsers(res);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
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
    setModalVisible(true);
  };

  const handleDelete = (id, ten) => {
    Alert.alert('Xác nhận', `Bạn có chắc muốn xóa người dùng "${ten}"?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUser(id);
            setSnackbarMessage(`Đã xóa người dùng "${ten}"`);
            setSnackbarVisible(true);
            fetchUsers();
            setSelectedUser(null);
          } catch (error) {
            setSnackbarMessage('Lỗi khi xóa người dùng');
            setSnackbarVisible(true);
          }
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    if (!ten.trim()) {
      setSnackbarMessage('Tên không được để trống');
      setSnackbarVisible(true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setSnackbarMessage('Email không hợp lệ');
      setSnackbarVisible(true);
      return;
    }
    if (!['Admin', 'Khách hàng'].includes(vaiTro)) {
      setSnackbarMessage('Vai trò phải là "Admin" hoặc "Khách hàng"');
      setSnackbarVisible(true);
      return;
    }

    try {
      await updateUser(selectedUser.MaNguoiDung, { Ten: ten, Email: email, VaiTro: vaiTro });
      setSnackbarMessage(`Cập nhật người dùng "${ten}" thành công`);
      setSnackbarVisible(true);
      fetchUsers();
      setModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      setSnackbarMessage('Lỗi khi cập nhật người dùng');
      setSnackbarVisible(true);
    }
  };

  const roleColor = (role) => {
    return role === 'Admin' ? '#F44336' : role === 'Khách hàng' ? '#2196F3' : '#888';
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.index}>{index + 1}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.name}>{item.Ten}</Text>
        <Text style={styles.email}>{item.Email}</Text>
        <Badge style={[styles.badge, { backgroundColor: roleColor(item.VaiTro) }]}>
          {item.VaiTro}
        </Badge>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.MaNguoiDung, item.Ten)} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { flex: 1 }]}>STT</Text>
      <Text style={[styles.headerCell, { flex: 3 }]}>Thông tin</Text>
      <Text style={[styles.headerCell, { flex: 1 }]}>Hành động</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý người dùng</Text>
      <SearchBar
        placeholder="Tìm kiếm người dùng..."
        searchQuery={searchQuery}
        onSearch={handleSearch}
        style={styles.searchBar}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderItem}
          keyExtractor={(item) => item.MaNguoiDung.toString()}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<Text style={styles.emptyText}>Không tìm thấy người dùng</Text>}
          style={styles.scrollContainer}
        />
      )}

      {/* Modal chỉnh sửa */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Cập nhật người dùng</Text>
              <IconButton
                icon="close"
                size={24}
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              />
            </View>
            <TextInput
              label="Tên"
              value={ten}
              onChangeText={setTen}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Vai trò"
              value={vaiTro}
              onChangeText={setVaiTro}
              mode="outlined"
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleUpdate}
              style={styles.updateButton}
              labelStyle={styles.updateButtonText}
            >
              Cập nhật
            </Button>
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Đóng',
          onPress: () => setSnackbarVisible(false),
        }}
        style={styles.snackbar}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 8,
  },
  headerCell: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    alignItems: 'center',
  },
  index: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  userInfo: {
    flex: 3,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    margin: 0,
  },
  input: {
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 4,
    borderRadius: 8,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  snackbar: {
    backgroundColor: '#333',
  },
});

export default ManageAccount;