import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import styles from '../../styles/ProductManagementStyles';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" />;
    }
    const flatListRef = React.useRef(null);
    useEffect(() => {
        if (products.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: true });
        }
    }, [products]);


    return (
        <View style={[styles.container, {flex: 1}]}> 

            <View style={styles.tableContainer }>
                <View style={styles.tableHeader}>
                    <Text style={[styles.headerCell, { flex: 0.7 }]}>STT</Text>
                    <Text style={[styles.headerCell, { flex: 1.5 }]}>Tên</Text>
                    <Text style={[styles.headerCell, { flex: 2 }]}>Mô tả</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Giá</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>SL</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Danh mục</Text>
                    <Text style={[styles.headerCell, { flex: 1 }]}>Hình ảnh</Text>
                    <Text style={[styles.headerCell, { flex: 1.2 }]}>Thao tác</Text>
                </View>
                <FlatList
                    ref={flatListRef}
                    data={products}
                    extraData={products}
                    keyExtractor={(item) => item.MaSanPham.toString()}
                    renderItem={({ item, index }) => (
                        <View style={styles.tableRow}>
                            <Text style={[styles.cell, { flex: 0.7 }]}>{index + 1}</Text>
                            <Text style={[styles.cell, { flex: 1.5 }]} numberOfLines={1}>{item.Ten}</Text>
                            <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{item.MoTa}</Text>
                            <Text style={[styles.cell, { flex: 1 }]}>{item.Gia}đ</Text>
                            <Text style={[styles.cell, { flex: 1 }]}>{item.SoLuong}</Text>
                            <Text style={[styles.cell, { flex: 1 }]}>{item.MaDanhMuc}</Text>
                            <View style={[styles.cell, { flex: 1 }]}>
                                <Image source={{ uri: item.HinhAnh }} style={styles.productImage} />
                            </View>
                            <View style={styles.actionCell}>
                                <TouchableOpacity style={styles.editButton} onPress={() => onEdit(item)}>
                                    <Text style={styles.buttonText}>✏️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.MaSanPham)}>
                                    <Text style={styles.buttonText}>🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
                
            </View>
   </View>
    );

};

export default ProductList;