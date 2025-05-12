import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import ProductCard from '../../componentsUser.js/ProductCard';
import Tabs from '../../componentsUser.js/Tabs';
import { getAllProducts, getProductsByCategory } from '../../API/apiproduct';
import { getAllCategories } from '../../API/apicategory';
import SearchBar from '../../Common/SearchBar';
import { useNavigation } from '@react-navigation/native';

export default function DashBoardScreen() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('Tất cả'); // Mặc định là "Tất cả"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách danh mục
        let categoriesData;
        try {
          categoriesData = await getAllCategories();
          console.log('Danh mục từ API:', categoriesData);
          if (!Array.isArray(categoriesData)) {
            throw new Error('Dữ liệu danh mục không đúng định dạng');
          }
        } catch (catError) {
          console.error('Không lấy được danh mục:', catError);
          categoriesData = [];
        }

        // Thêm danh mục "Tất cả" vào đầu danh sách
        const allCategory = { MaDanhMuc: null, Ten: 'Tất cả' };
        setCategories([allCategory, ...categoriesData]);

        // Lấy tất cả sản phẩm
        const productsData = await getAllProducts();
        console.log('Sản phẩm từ API:', productsData);
        setProducts(productsData);

        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTabChange = async (tab) => {
    console.log('Tab được chọn:', tab);
    console.log('Danh sách categories:', categories);
    setActiveTab(tab);
    try {
      setLoading(true);
      setError(null);
      const category = categories.find((cat) => cat.Ten === tab);
      console.log('Danh mục tìm thấy:', category);
      if (!category || tab === 'Tất cả') {
        console.log('Hiển thị tất cả sản phẩm');
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } else {
        console.log('Lọc sản phẩm theo danh mục:', category.MaDanhMuc);
        const filteredProducts = await getProductsByCategory(category.MaDanhMuc);
        setProducts(filteredProducts);
      }
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lọc sản phẩm:', error);
      setError('Không thể lọc sản phẩm. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar searchQuery="" onSearch={() => { }} placeholder="Tìm kiếm" style={styles.searchBar} />
      <Tabs categories={categories} activeTab={activeTab} setActiveTab={handleTabChange} />
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={{
                id: item.MaSanPham,
                name: item.Ten,
                price: `${item.Gia} VNĐ`,
                image: item.HinhAnh,
              }}
              onPress={handleProductPress}
            />
          )}
          keyExtractor={(item, index) => (item.MaSanPham ? item.MaSanPham.toString() : index.toString())}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      ) : (
        <Text style={styles.noProducts}>Không có sản phẩm nào</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    padding: 8,
  },
  noProducts: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  searchBar: {
    marginBottom: 10,
  },
});