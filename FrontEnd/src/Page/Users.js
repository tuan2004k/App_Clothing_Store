import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Tabs from '../componentsUser.js/Tabs';
import BottonTab from '../componentsUser.js/BottomTab';

export default function Users() {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  console.log('Navigation object:', navigation);

  return (
    <View style={styles.container}>
      

      <Tabs />
      <BottonTab />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: 150,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#000',
  },
  searchIcon: {
    marginLeft: 5,
  },
  cartIcon: {
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 60,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
});