import { useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../API/apiproduct';

const useProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const data = await getAllProducts();
      
      if (!Array.isArray(data)) {
        throw new Error('Dữ liệu không hợp lệ');
      }
      
      setProducts(data.sort((a, b) => a.MaSanPham - b.MaSanPham));
    } catch (error) {
      console.error('Lỗi:', error);
      Alert.alert('Lỗi', error.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const displayedProducts = useMemo(() => {
    return searchQuery 
      ? products.filter(p => 
          p.Ten.toLowerCase().includes(searchQuery.toLowerCase()))
      : products;
  }, [products, searchQuery]);

  const handleSave = async (productData, editingProduct, callback) => {
    if (loading) return;
    
    try {
      setLoading(true);
      const result = editingProduct
        ? await updateProduct(editingProduct.MaSanPham, productData)
        : await addProduct(productData);
      
      setProducts(prev => {
        const newProducts = editingProduct
          ? prev.map(p => p.MaSanPham === editingProduct.MaSanPham ? result : p)
          : [...prev, result];
        return newProducts.sort((a, b) => a.MaSanPham - b.MaSanPham);
      });
      
      callback?.();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId, callback) => {
    if (loading) return;
    
    try {
      setLoading(true);
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.MaSanPham !== productId));
      callback?.();
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Xóa thất bại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    displayedProducts,
    loading,
    searchQuery,
    handleSearch,
    handleSave,
    handleDelete,
    refreshProducts: fetchProducts
  };
};

export default useProductManagement;