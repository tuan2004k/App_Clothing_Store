import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const FilterSort = () => {
  return (
    <View style={styles.filterSection}>
      <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterText}>FILTER & SORT</Text>
        <Icon name="filter" size={16} color="#000" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Icon name="grid" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    marginRight: 5,
  },
});

export default FilterSort;