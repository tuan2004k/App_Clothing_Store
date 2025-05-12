// componentsUser.js/ProductCard.js
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProductCard = ({ product, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => onPress(product)} style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.favoriteIcon}
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF0000' : '#888'}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name}>{product.name || 'Không có tên'}</Text>
      <Text style={styles.price}>{product.price || 'Không có giá'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    margin: '1%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  favoriteIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  price: {
    fontSize: 12,
    color: '#673AB7',
    marginTop: 4,
  },
});

export default ProductCard;