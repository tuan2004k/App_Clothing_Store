import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Modal, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import styles from '../../styles/ProductManagementStyles';
import { addProduct, updateProduct, addProductDetail } from '../../API/apiproduct';
import { getAllCategories } from '../../API/apicategory';

const ProductModal = ({ visible, onClose, onSave, editingProduct }) => {
  const [name, setName] = useState(editingProduct?.Ten || '');
  const [description, setDescription] = useState(editingProduct?.MoTa || '');
  const [price, setPrice] = useState(editingProduct?.Gia?.toString() || '');
  const [quantity, setQuantity] = useState(editingProduct?.SoLuong?.toString() || '');
  const [image, setImage] = useState(editingProduct?.HinhAnh || '');
  const [categoryCode, setCategoryCode] = useState(editingProduct?.MaDanhMuc?.toString() || '');
  const [variants, setVariants] = useState(editingProduct?.ChiTietSanPham || []);
  const [newVariant, setNewVariant] = useState({ Size: '', MauSac: '', Gia: '', SoLuong: '' });
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const sizeOptions = ['S', 'M', 'L', 'XL'];
  const colorOptions = ['Đỏ', 'Xanh', 'Vàng', 'Đen', 'Trắng'];

  const defaultCategories = [
    { MaDanhMuc: '1', TenDanhMuc: 'Quần áo' },
    { MaDanhMuc: '2', TenDanhMuc: 'Giày dép' },
    { MaDanhMuc: '3', TenDanhMuc: 'Phụ kiện' },
  ];

  // Yêu cầu quyền truy cập thư viện ảnh
  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Cần cấp quyền truy cập thư viện ảnh để chọn hình ảnh.');
      }
    };
    requestPermissions();
  }, []);

  // Lấy danh sách danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await getAllCategories();
        console.log('Dữ liệu danh mục từ API:', data);
        const mappedData = Array.isArray(data)
          ? data.map(item => ({
            MaDanhMuc: item.id || item.MaDanhMuc || item.categoryId || '',
            Ten: item.name || item.Ten || item.categoryName || 'Không xác định',
          })).filter(item => item.MaDanhMuc && item.Ten)
          : defaultCategories;
        setCategories(mappedData.length > 0 ? mappedData : defaultCategories);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        Alert.alert('Thông báo', 'Không thể tải danh sách danh mục. Sử dụng danh sách mặc định.');
        setCategories(defaultCategories);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const chooseImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          if (asset.base64) {
            const imageData = `data:image/jpeg;base64,${asset.base64}`;
            setImage(imageData);
            console.log('Ảnh đã chọn (base64):', imageData.substring(0, 50) + '...');
          } else {
            console.log('Không lấy được base64 từ ảnh:', asset);
            Alert.alert('Lỗi', 'Không thể lấy dữ liệu ảnh. Vui lòng thử lại.');
          }
        } else {
          console.log('Không có assets trong kết quả:', result);
          Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
        }
      } else {
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
      Alert.alert('Thông báo', 'Vui lòng chọn đầy đủ thông tin biến thể.');
    }
  };

  const handleModalSave = async () => {
    try {
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
        HinhAnh: image || '',
        ChiTietSanPham: variants,
      };

      console.log('Dữ liệu gửi đi:', {
        ...productData,
        HinhAnh: productData.HinhAnh ? productData.HinhAnh.substring(0, 50) + '...' : '',
      });

      let product;
      if (editingProduct) {
        product = await updateProduct(editingProduct.MaSanPham, productData);
      } else {
        product = await addProduct(productData);
      }

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

      onSave({ ...product, ChiTietSanPham: variants }, editingProduct, onClose);
    } catch (error) {
      console.error('Lỗi khi lưu sản phẩm:', error);
      Alert.alert('Lỗi', 'Không thể lưu sản phẩm. Vui lòng thử lại.');
    }
  };

  const retryFetchCategories = () => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const data = await getAllCategories();
        console.log('Dữ liệu danh mục từ API (retry):', data);
        const mappedData = Array.isArray(data)
          ? data.map(item => ({
            MaDanhMuc: item.id || item.MaDanhMuc || item.categoryId || '',
            TenDanhMuc: item.name || item.Ten || item.categoryName || 'Không xác định',
          })).filter(item => item.MaDanhMuc && item.Ten)
          : defaultCategories;
        setCategories(mappedData.length > 0 ? mappedData : defaultCategories);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục (retry):', error);
        Alert.alert('Thông báo', 'Không thể tải danh sách danh mục. Sử dụng danh sách mặc định.');
        setCategories(defaultCategories);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
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
          {isLoadingCategories ? (
            <Text style={styles.loadingText}>Đang tải danh mục...</Text>
          ) : categories.length === defaultCategories.length && categories.every((cat, i) => cat.MaDanhMuc === defaultCategories[i].MaDanhMuc) ? (
            <View>
              <Text style={styles.errorText}>Không tải được danh mục. Dùng danh sách mặc định.</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={retryFetchCategories}
              >
                <Text style={styles.buttonText}>Thử lại</Text>
              </TouchableOpacity>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={categoryCode}
                  onValueChange={(itemValue) => setCategoryCode(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Chọn danh mục" value="" />
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.MaDanhMuc || Math.random().toString()}
                      label={category.Ten || 'Không xác định'}
                      value={category.MaDanhMuc?.toString() || ''}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryCode}
                onValueChange={(itemValue) => setCategoryCode(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Chọn danh mục" value="" />
                {categories.map((category) => (
                  <Picker.Item
                    key={category.MaDanhMuc || Math.random().toString()}
                    label={category.Ten || 'Không xác định'}
                    value={category.MaDanhMuc?.toString() || ''}
                  />
                ))}
              </Picker>
            </View>
          )}
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
              resizeMode="contain"
              onError={(e) => console.log('Lỗi hiển thị ảnh:', e.nativeEvent.error)}
            />
          ) : (
            <Text style={styles.noImageText}>Chưa chọn hình ảnh</Text>
          )}
          <TouchableOpacity onPress={chooseImage} style={styles.chooseImageButton}>
            <Text style={styles.chooseImageText}>Chọn hình ảnh</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Thêm chi tiết sản phẩm</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newVariant.Size}
              onValueChange={(itemValue) => setNewVariant({ ...newVariant, Size: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Chọn size" value="" />
              {sizeOptions.map((size) => (
                <Picker.Item key={size} label={size} value={size} />
              ))}
            </Picker>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={newVariant.MauSac}
              onValueChange={(itemValue) => setNewVariant({ ...newVariant, MauSac: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Chọn màu sắc" value="" />
              {colorOptions.map((color) => (
                <Picker.Item key={color} label={color} value={color} />
              ))}
            </Picker>
          </View>
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
            <Text style={styles.chooseImageText}>Thêm chi tiết sản phẩm</Text>
          </TouchableOpacity>
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
            <TouchableOpacity style={styles.saveButton} onPress={handleModalSave}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductModal;