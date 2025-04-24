import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/ProductManagementStyles';
import { addProduct, updateProduct, addProductDetail } from '../../API/apiproduct';

const ProductModal = ({ visible, onClose, onSave, editingProduct }) => {
  const [name, setName] = useState(editingProduct?.Ten || '');
  const [description, setDescription] = useState(editingProduct?.MoTa || '');
  const [price, setPrice] = useState(editingProduct?.Gia?.toString() || '');
  const [quantity, setQuantity] = useState(editingProduct?.SoLuong?.toString() || '');
  const [image, setImage] = useState(editingProduct?.HinhAnh || ''); // Lưu chuỗi base64 hoặc URL
  const [categoryCode, setCategoryCode] = useState(editingProduct?.MaDanhMuc?.toString() || '');
  const [variants, setVariants] = useState(editingProduct?.ChiTietSanPham || []);
  const [newVariant, setNewVariant] = useState({ Size: '', MauSac: '', Gia: '', SoLuong: '' });

  // Yêu cầu quyền truy cập thư viện ảnh
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để chọn hình ảnh.');
      }
    })();
  }, []);

  const chooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5, // Giảm chất lượng để chuỗi base64 không quá lớn
        base64: true, // Lấy dữ liệu base64
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const base64 = result.assets[0].base64;
        const imageData = `data:image/jpeg;base64,${base64}`;
        setImage(imageData); // Lưu chuỗi base64 để hiển thị và gửi API
      } else if (result.canceled) {
        console.log('Người dùng đã hủy chọn ảnh');
      }
    } catch (error) {
      console.error('Lỗi khi chọn ảnh:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const addVariant = () => {
    if (newVariant.Size && newVariant.MauSac && newVariant.Gia && newVariant.SoLuong) {
      setVariants([...variants, { ...newVariant, MaChiTietSanPham: `temp_${Date.now()}` }]);
      setNewVariant({ Size: '', MauSac: '', Gia: '', SoLuong: '' });
    } else {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin biến thể.');
    }
  };

  const handleSave = async () => {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!name || !price || !quantity || !categoryCode) {
        Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin sản phẩm.');
        return;
      }

      const productData = {
        Ten: name,
        MoTa: description,
        Gia: parseFloat(price),
        SoLuong: parseInt(quantity),
        MaDanhMuc: categoryCode,
        HinhAnh: image || '', // Gửi chuỗi base64 hoặc chuỗi rỗng nếu không có ảnh
      };

      let product;
      if (editingProduct) {
        product = await updateProduct(editingProduct.MaSanPham, productData);
      } else {
        product = await addProduct(productData);
      }

      // Thêm các biến thể
      for (const variant of variants) {
        if (variant.MaChiTietSanPham.toString().startsWith('temp')) {
          await addProductDetail({
            MaSanPham: product.MaSanPham,
            Size: variant.Size,
            MauSac: variant.MauSac,
            Gia: parseFloat(variant.Gia),
            SoLuong: parseInt(variant.SoLuong),
          });
        }
      }

      onSave(productData, editingProduct, onClose);
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm'}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Tên sản phẩm"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Mô tả sản phẩm"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá sản phẩm"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          <TextInput
            style={styles.input}
            placeholder="Mã danh mục"
            value={categoryCode}
            onChangeText={setCategoryCode}
          />
          {image ? (
            <Image source={{ uri: image }} style={styles.previewImage} resizeMode="contain" />
          ) : (
            <Text style={styles.noImageText}>Chưa chọn hình ảnh</Text>
          )}
          <TouchableOpacity onPress={chooseImage} style={styles.chooseImageButton}>
            <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
          </TouchableOpacity>
          {/* Thêm biến thể */}
          <Text style={styles.modalTitle}>Thêm chi tiết sản phẩm</Text>
          <TextInput
            style={styles.input}
            placeholder="Size (S, M, L, XL)"
            value={newVariant.Size}
            onChangeText={(text) => setNewVariant({ ...newVariant, Size: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Màu sắc"
            value={newVariant.MauSac}
            onChangeText={(text) => setNewVariant({ ...newVariant, MauSac: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá biến thể"
            keyboardType="numeric"
            value={newVariant.Gia}
            onChangeText={(text) => setNewVariant({ ...newVariant, Gia: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Số lượng biến thể"
            keyboardType="numeric"
            value={newVariant.SoLuong}
            onChangeText={(text) => setNewVariant({ ...newVariant, SoLuong: text })}
          />
          <TouchableOpacity style={styles.chooseImageButton} onPress={addVariant}>
            <Text style={styles.chooseImageText}>Thêm chi tiết sản phẩm </Text>
          </TouchableOpacity>
          {/* Hiển thị danh sách biến thể */}
          <FlatList
            data={variants}
            keyExtractor={(item) => item.MaChiTietSanPham.toString()}
            renderItem={({ item }) => (
              <View style={styles.variantRow}>
                <Text style={styles.variantText}>Size: {item.Size}</Text>
                <Text style={styles.variantText}>Màu: {item.MauSac}</Text>
                <Text style={styles.variantText}>Giá: {item.Gia}đ</Text>
                <Text style={styles.variantText}>Số lượng: {item.SoLuong}</Text>
              </View>
            )}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductModal;