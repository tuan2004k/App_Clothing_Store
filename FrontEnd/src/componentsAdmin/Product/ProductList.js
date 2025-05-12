import React, { useEffect, useState, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import styles from '../../styles/ProductManagementStyles';
import { getAllCategories } from '../../API/apicategory';

const ProductList = ({ products, loading: initialLoading, onEdit, onDelete }) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(initialLoading || true);
  const flatListRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const data = await getAllCategories();
        console.log('Danh sách danh mục từ API:', data);
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách danh mục:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (products.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [products]);

  const getCategoryName = (MaDanhMuc) => {
    if (!MaDanhMuc) return 'Không xác định';
    const catId = typeof MaDanhMuc === 'string' ? MaDanhMuc : MaDanhMuc.toString();
    const category = categories.find(cat => {
      const catIdFromData = typeof cat.MaDanhMuc === 'string' ? cat.MaDanhMuc : cat.MaDanhMuc.toString();
      return catIdFromData === catId;
    });
    return category ? category.Ten || category.TenDanhMuc || 'Không xác định' : 'Không xác định';
  };

  const safeKeyExtractor = (item, index) => {
    if (!item || !item.MaSanPham) return `item-${index}`;
    return item.MaSanPham.toString();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#007bff" />;
  }

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, { flex: 0.7 }]}>STT</Text>
          <Text style={[styles.headerCell, { flex: 1.5 }]}>Tên</Text>
          <Text style={[styles.headerCell, { flex: 2 }]}>Mô tả</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Giá</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>SL</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Danh mục</Text>
          <Text style={[styles.headerCell, { flex: 1 }]}>Hình ảnh</Text>
          <Text style={[styles.headerCell, { flex: 1.2 }]}>Thao tác</Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={products.filter(item => item && item.MaSanPham !== null && item.MaSanPham !== undefined)}
          extraData={products}
          keyExtractor={safeKeyExtractor}
          renderItem={({ item, index }) => {
            if (!item || !item.MaSanPham) return null; // Bỏ qua nếu item không hợp lệ
            return (
              <View style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 0.7 }]}>{index + 1}</Text>
                <Text style={[styles.cell, { flex: 1.5 }]} numberOfLines={1}>{item.Ten || 'Không xác định'}</Text>
                <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{item.MoTa || 'Không có mô tả'}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{item.Gia ? `${item.Gia}đ` : '0đ'}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{item.SoLuong || 0}</Text>
                <Text style={[styles.cell, { flex: 1 }]}>{getCategoryName(item.MaDanhMuc)}</Text>
                <View style={[styles.cell, { flex: 1 }]}>
                  <Image
                    source={{ uri: item.HinhAnh || 'https://via.placeholder.com/50' }}
                    style={styles.productImage}
                    onError={(e) => console.log('Lỗi tải hình ảnh:', e.nativeEvent.error)}
                  />
                </View>
                <View style={styles.actionCell}>
                  <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
                    <Text style={styles.buttonText}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.MaSanPham)}>
                    <Text style={styles.buttonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default ProductList;