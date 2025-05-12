import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const Tabs = ({ categories, activeTab, setActiveTab }) => {
  // Nếu categories không phải là mảng, trả về mảng rỗng
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Log để kiểm tra dữ liệu categories
  console.log('Danh mục trong Tabs:', safeCategories);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.tabContainer}
    >
      <View style={styles.tabs}>
        {safeCategories.length > 0 ? (
          safeCategories.map((category) => (
            <TouchableOpacity
              key={category.MaDanhMuc || category.Ten}
              onPress={() => setActiveTab(category.Ten)}
              style={styles.tabWrapper}
            >
              <Text
                style={[styles.tab, category.Ten === activeTab && styles.activeTab]}
              >
                {category.Ten || 'Không có tên'}
              </Text>
              {category.Ten === activeTab && <View style={styles.underline} />}
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noTabs}></Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    maxHeight: 60, 
  },
  tabs: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabWrapper: {
    alignItems: 'center',
    marginHorizontal: 10, // Khoảng cách giữa các tab
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  tab: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  activeTab: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  underline: {
    marginTop: 5,
    width: 30,
    height: 2,
    backgroundColor: '#6200EE',
  },
  noTabs: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default Tabs;