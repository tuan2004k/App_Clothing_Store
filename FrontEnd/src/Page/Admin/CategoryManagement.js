// src/screens/CategoryManagement.js
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, StyleSheet } from "react-native";
import {
  getAllcategory,
  addCategory,
  deleteCategory,
  updateCategory,
} from "../../API/apicategory";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [ten, setTen] = useState("");
  const [moTa, setMoTa] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lấy danh sách danh mục khi load
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getAllcategory();
      setCategories(data);
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleAddOrUpdate = async () => {
    if (!ten.trim()) return Alert.alert("Thông báo", "Tên danh mục không được để trống!");

    try {
      if (selectedCategory) {
        // Cập nhật
        await updateCategory(selectedCategory.MaDanhMuc, { Ten: ten, MoTa: moTa });
        Alert.alert("Thành công", "Cập nhật danh mục thành công!");
      } else {
        // Thêm mới
        await addCategory({ Ten: ten, MoTa: moTa });
        Alert.alert("Thành công", "Thêm danh mục thành công!");
      }
      setTen("");
      setMoTa("");
      setSelectedCategory(null);
      fetchCategories();
    } catch (error) {
      Alert.alert("Lỗi", error.message);
    }
  };

  const handleDelete = (id) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa danh mục này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            await deleteCategory(id);
            Alert.alert("Thành công", "Xóa thành công!");
            fetchCategories();
          } catch (error) {
            Alert.alert("Lỗi", error.message);
          }
        },
      },
    ]);
  };

  const handleSelectEdit = (category) => {
    setSelectedCategory(category);
    setTen(category.Ten);
    setMoTa(category.MoTa);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>
        {item.Ten} (Mã: {item.MaDanhMuc})
      </Text>
      <Text>{item.MoTa}</Text>
      <View style={styles.buttonGroup}>
        <Button title="Sửa" onPress={() => handleSelectEdit(item)} />
        <Button title="Xóa" color="red" onPress={() => handleDelete(item.MaDanhMuc)} />
      </View>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Quản lý danh mục</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên danh mục"
        value={ten}
        onChangeText={setTen}
      />
      <TextInput
        style={styles.input}
        placeholder="Mô tả"
        value={moTa}
        onChangeText={setMoTa}
      />
      <Button
        title={selectedCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        onPress={handleAddOrUpdate}
      />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.MaDanhMuc.toString()}
        renderItem={renderItem}
        style={{ marginTop: 20 }}
      />
    </View>
  );
};

export default CategoryManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
    borderRadius: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
