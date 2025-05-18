import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng icon từ expo-vector-icons
import { getAllCategories, addCategory, deleteCategory, updateCategory } from "../../API/apicategory";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [ten, setTen] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách danh mục khi load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải danh mục: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!ten.trim()) {
      return Alert.alert("Lỗi", "Tên danh mục không được để trống!");
    }
    if (moTa.length > 100) {
      return Alert.alert("Lỗi", "Mô tả không được vượt quá 100 ký tự!");
    }

    setLoading(true);
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory.MaDanhMuc, { Ten: ten, MoTa: moTa });
        Alert.alert("Thành công", `Cập nhật danh mục "${ten}" thành công!`);
      } else {
        await addCategory({ Ten: ten, MoTa: moTa });
        Alert.alert("Thành công", `Thêm danh mục "${ten}" thành công!`);
      }
      setTen("");
      setMoTa("");
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      Alert.alert("Lỗi", "Thao tác thất bại: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, ten) => {
    Alert.alert("Xác nhận", `Bạn có chắc muốn xóa danh mục "${ten}"?`, [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          setLoading(true);
          try {
            await deleteCategory(id);
            Alert.alert("Thành công", `Đã xóa danh mục "${ten}"!`);
            fetchCategories();
          } catch (error) {
            Alert.alert("Lỗi", "Xóa thất bại: " + error.message);
          } finally {
            setLoading(false);
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleSelectEdit = (category) => {
    setSelectedCategory(category);
    setTen(category.Ten);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>
          {item.Ten} 
        </Text>
     
      </View>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleSelectEdit(item)}
        >
          <Ionicons name="create-outline" size={24} color="#2196F3" />
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => handleDelete(item.MaDanhMuc, item.Ten)}
        >
          <Ionicons name="trash-outline" size={24} color="#F44336" />
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quản lý danh mục</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <TextInput
        style={styles.input}
        placeholder="Tên danh mục"
        value={ten}
        onChangeText={setTen}
        placeholderTextColor="#888"
      />
   
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleAddOrUpdate}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {selectedCategory ? "Cập nhật" : "Thêm"} danh mục
        </Text>
      </TouchableOpacity>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.MaDanhMuc.toString()}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>Không có danh mục nào</Text>}
      />
    </View>
  );
};

export default CategoryManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2, // Shadow cho Android
    shadowColor: "#000", // Shadow cho iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
  },
  buttonText: {
    marginLeft: 5,
    color: "#333",
    fontSize: 14,
  },
  list: {
    marginTop: 10,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});