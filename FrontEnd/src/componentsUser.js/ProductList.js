import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import ProductCard from '../componentsUser.js/ProductCard';

const ProductList = ({ products }) => {
  return (
    <FlatList
      data={products}
      numColumns={2}
      renderItem={({ item }) => <ProductCard item={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.productList}
    />
  );
};

const styles = StyleSheet.create({
  productList: {
    padding: 10,
  },
});

export default ProductList;