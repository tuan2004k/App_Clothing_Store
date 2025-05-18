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
              style={[
                styles.tabWrapper,
                category.Ten === activeTab && styles.activeTabWrapper
              ]}
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
    maxHeight: 54,
    marginHorizontal: 10,
    borderRadius: 20,
    

    // backgroundColor: '#FAFAFA',
  },
  tabs: {
    flexDirection: 'row',
    paddingVertical: 8,
    // paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#8bc2ec',
  },
  tabWrapper: {
    alignItems: 'center',
    marginHorizontal: 3,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#F5F5F5',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  activeTabWrapper: {
    backgroundColor: '#F0F5FF',
  },
  tab: {
    fontSize: 15,
    color: '#555555',
    fontWeight: '500',
  },
  activeTab: {
    color: '#3D5AFE',
    fontWeight: 'bold',
  },
  underline: {
    marginTop: 4,
    width: '80%',
    height: 2,
    backgroundColor: '#3D5AFE',
    borderRadius: 1,
  },
  noTabs: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default Tabs;