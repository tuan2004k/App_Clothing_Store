// Common/SearchBar.js
import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const SearchBar = ({ placeholder, searchQuery, onSearch }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="gray" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={onSearch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    marginVertical: 10,
    width: "95%",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
});

export default SearchBar;
