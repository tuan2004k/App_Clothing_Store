import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { getAllProducts, deleteProduct, updateProduct } from '../API/apiproduct';

const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await getAllProducts();
      console.log('Fetched products:', response);
      if (!Array.isArray(response)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      setProducts(response.sort((a, b) => a.MaSanPham - b.MaSanPham));
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error.message, error.response?.data);
      Alert.alert('Lỗi', error.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleDelete = async (productId, callback) => {
    if (loading) return;

    try {
      setLoading(true);
      console.log('Deleting product:', productId);
      await deleteProduct(productId);
      await fetchProducts();
      callback?.();
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error.message, error.response?.data);
      Alert.alert('Lỗi', error.message || 'Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (productId, productData, callback) => {
    if (loading) return;

    try {
      setLoading(true);
      console.log('Editing product:', { productId, productData });

      // Ensure productData includes ChiTietSanPham and correct data types
      const formattedProductData = {
        Ten: productData.Ten,
        MoTa: productData.MoTa,
        Gia: parseFloat(productData.Gia),
        SoLuong: parseInt(productData.SoLuong),
        MaDanhMuc: productData.MaDanhMuc,
        HinhAnh: productData.HinhAnh || '',
        ChiTietSanPham: productData.ChiTietSanPham || [],
      };

      const updatedProduct = await updateProduct(productId, formattedProductData);
      console.log('Updated product:', updatedProduct);

      await fetchProducts();
      callback?.(updatedProduct);
    } catch (error) {
      console.error('Lỗi khi chỉnh sửa sản phẩm:', error.message, error.response?.data);
      Alert.alert('Lỗi', error.response?.data?.message || error.message || 'Chỉnh sửa sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const displayedProducts = useMemo(() => {
    return searchQuery
      ? products.filter(p => p.Ten && p.Ten.toLowerCase().includes(searchQuery.toLowerCase()))
      : products;
  }, [products, searchQuery]);

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    displayedProducts,
    loading,
    searchQuery,
    handleSearch,
    handleDelete,
    handleEdit,
    refreshProducts: fetchProducts,
  };
};

export default useProductManagement;