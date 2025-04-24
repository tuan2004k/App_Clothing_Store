import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import SearchBar from '../../Common/SearchBar';
import ProductList from '../../componentsAdmin/Product/ProductList';
import ProductModal from '../../componentsAdmin/Product/ProductModal';
import DeleteConfirmationModal from '../../componentsAdmin/Product/DeleteConfirmationModal';
import useProductManagement from '../../Hooks/useProductManagement';
import styles from '../../styles/ProductManagementStyles';

const ProductManagement = () => {
  const {
    displayedProducts,
    loading,
    searchQuery,
    handleSearch,
    handleSave,
    handleDelete,
  } = useProductManagement();

  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const openModal = (product = null) => {
    setEditingProduct(product);
    setModalVisible(true);
  };

  const openDeleteModal = (productId) => {
    setProductToDelete(productId);
    setDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Tìm sản phẩm theo tên..."
        searchQuery={searchQuery}
        onSearch={handleSearch}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
        <Text style={styles.addButtonText}>➕ Thêm Sản Phẩm</Text>
      </TouchableOpacity>
      <ProductList
        products={displayedProducts}
        loading={loading}
        onEdit={openModal}
        onDelete={openDeleteModal}
      />
      <ProductModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        editingProduct={editingProduct}
      />
      <DeleteConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={() => handleDelete(productToDelete, () => setDeleteModalVisible(false))}
      />
    </View>
  );
};

export default ProductManagement;