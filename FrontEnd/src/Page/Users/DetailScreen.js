// screens/ProductDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { getProductById } from '../../API/apiproduct';
import { getProductDetailsByProductId } from '../../API/apidetailproduct';
import { addToCart } from '../../API/apicart';

import axios from 'axios';

export default function ProductDetailScreen() {
    const route = useRoute();
    const navigation = useNavigation();
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                // Lấy thông tin sản phẩm chính từ API SanPham
                const productData = await getProductById(productId);
                console.log('Thông tin sản phẩm từ API (SanPham):', productData);
                if (!productData || typeof productData !== 'object') {
                    throw new Error('Dữ liệu sản phẩm không hợp lệ');
                }

                // Lấy chi tiết sản phẩm từ API ChiTietSanPham
                const productDetails = await getProductDetailsByProductId(productId);
                console.log('Chi tiết sản phẩm từ API (ChiTietSanPham):', productDetails);
                if (!productDetails || !Array.isArray(productDetails)) {
                    throw new Error('Dữ liệu chi tiết sản phẩm không hợp lệ');
                }

                // Gộp dữ liệu: thêm ChiTietSanPham vào productData
                const combinedData = {
                    ...productData,
                    ChiTietSanPham: productDetails,
                };

                setProduct(combinedData);
                setLoading(false);

                // Chọn biến thể mặc định (nếu có)
                if (combinedData.ChiTietSanPham && Array.isArray(combinedData.ChiTietSanPham) && combinedData.ChiTietSanPham.length > 0) {
                    setSelectedSize(combinedData.ChiTietSanPham[0].Size);
                    setSelectedColor(combinedData.ChiTietSanPham[0].MauSac);
                    setSelectedVariant(combinedData.ChiTietSanPham[0]);
                } else {
                    setSelectedVariant(null);
                    setSelectedSize('');
                    setSelectedColor('');
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin sản phẩm:', error);
                setError('Không thể tải chi tiết sản phẩm. Vui lòng thử lại.');
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // Cập nhật biến thể khi người dùng thay đổi kích thước hoặc màu sắc
    useEffect(() => {
        if (product && product.ChiTietSanPham && Array.isArray(product.ChiTietSanPham)) {
            const variant = product.ChiTietSanPham.find(
                (v) => v.Size === selectedSize && v.MauSac === selectedColor
            );

            if (variant) {
                console.log('Đã tìm thấy biến thể:', variant);
                setSelectedVariant(variant);

                // Reset số lượng về 1 khi chọn biến thể mới
                setQuantity(1);
            } else {
                console.log('Không tìm thấy biến thể phù hợp với Size:', selectedSize, 'và MauSac:', selectedColor);
                setSelectedVariant(null);
            }
        }
    }, [selectedSize, selectedColor, product]);

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            Alert.alert('Thông báo', 'Vui lòng chọn kích thước và màu sắc hợp lệ.');
            return;
        }

        if (selectedVariant.SoLuong <= 0) {
            Alert.alert('Thông báo', 'Sản phẩm đã hết hàng.');
            return;
        }

        if (quantity <= 0 || quantity > selectedVariant.SoLuong) {
            Alert.alert('Thông báo', `Số lượng không hợp lệ. Còn lại: ${selectedVariant.SoLuong} sản phẩm.`);
            return;
        }

        const MaNguoiDung = 1;
        const MaChiTietSanPham = selectedVariant.MaChiTietSanPham;
        try {
            const response = await addToCart(MaNguoiDung, MaChiTietSanPham, quantity);
            console.log('Phản hồi từ API giỏ hàng:', response);
            console.log('Bắt đầu điều hướng đến CartScreen với MaNguoiDung:', MaNguoiDung);
            navigation.navigate('CartScreen', { MaNguoiDung });
            console.log('Điều hướng đã gọi');
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            Alert.alert('Lỗi', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
        }
    };

    const handleQuantityChange = (action) => {
        if (action === 'increase') {
            setQuantity((prev) => (selectedVariant && prev < selectedVariant.SoLuong ? prev + 1 : prev));
        } else if (action === 'decrease') {
            setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>{error || 'Sản phẩm không tồn tại.'}</Text>
            </View>
        );
    }

    const availableSizes = product.ChiTietSanPham && Array.isArray(product.ChiTietSanPham)
        ? [...new Set(product.ChiTietSanPham.map((v) => v.Size))]
        : [];
    const availableColors = product.ChiTietSanPham && Array.isArray(product.ChiTietSanPham)
        ? [...new Set(product.ChiTietSanPham.map((v) => v.MauSac))]
        : [];

    const displayPrice = selectedVariant && selectedVariant.Gia != null
        ? selectedVariant.Gia.toLocaleString()
        : product.Gia != null
            ? product.Gia.toLocaleString()
            : 'Không có giá';

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <Image source={{ uri: product.HinhAnh }} style={styles.image} />
                <Text style={styles.name}>{product.Ten}</Text>
                <Text style={styles.description}>{product.MoTa || 'Không có mô tả'}</Text>
                <Text style={styles.price}>{`Giá: ${displayPrice} VNĐ`}</Text>

                {/* Chọn biến thể */}
                <Text style={styles.sectionTitle}>Chọn biến thể:</Text>
                <View style={styles.variantContainer}>
                    <Text style={styles.label}>Kích thước:</Text>
                    <View style={styles.pickerBorder}>
                        <Picker
                            selectedValue={selectedSize}
                            onValueChange={(itemValue) => {
                                console.log('Đã chọn kích thước:', itemValue);
                                setSelectedSize(itemValue);
                            }}
                            style={styles.picker}
                            enabled={availableSizes.length > 0}
                        >
                            {availableSizes.length > 0 ? (
                                availableSizes.map((size) => (
                                    <Picker.Item key={size} label={size} value={size} />
                                ))
                            ) : (
                                <Picker.Item key="none" label="Không có kích thước" value="" />
                            )}
                        </Picker>
                    </View>
                </View>
                <View style={styles.variantContainer}>
                    <Text style={styles.label}>Màu sắc:</Text>
                    <View style={styles.pickerBorder}>
                        <Picker
                            selectedValue={selectedColor}
                            onValueChange={(itemValue) => {
                                console.log('Đã chọn màu sắc:', itemValue);
                                setSelectedColor(itemValue);
                            }}
                            style={styles.picker}
                            enabled={availableColors.length > 0}
                        >
                            {availableColors.length > 0 ? (
                                availableColors.map((color) => (
                                    <Picker.Item key={color} label={color} value={color} />
                                ))
                            ) : (
                                <Picker.Item key="none" label="Không có màu sắc" value="" />
                            )}
                        </Picker>
                    </View>
                </View>

                {/* Hiển thị thông tin về số lượng có sẵn */}
                {selectedVariant ? (
                    <View style={styles.stockInfo}>
                        <Text style={[styles.stockText, selectedVariant.SoLuong > 0 ? styles.inStock : styles.outOfStock]}>
                            {selectedVariant.SoLuong > 0
                                ? `Còn ${selectedVariant.SoLuong} sản phẩm`
                                : 'Hết hàng'}
                        </Text>
                    </View>
                ) : (
                    <View style={styles.stockInfo}>
                        <Text style={styles.stockWarning}>Vui lòng chọn kích thước và màu sắc</Text>
                    </View>
                )}

                {/* Chọn số lượng */}
                <View style={styles.quantityContainer}>
                    <Text style={styles.label}>Số lượng:</Text>
                    <View style={styles.quantitySelector}>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange('decrease')}
                            style={styles.quantityButton}
                            disabled={!selectedVariant}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity
                            onPress={() => handleQuantityChange('increase')}
                            style={styles.quantityButton}
                            disabled={!selectedVariant || quantity >= (selectedVariant?.SoLuong || 0)}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>


            {/* Footer with buttons */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Quay lại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.addToCartButton,
                        !selectedVariant && styles.disabledButton
                    ]}
                    onPress={handleAddToCart}
                    disabled={!selectedVariant}
                >
                    <Text style={styles.addToCartText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    description: {
        fontSize: 16,
        color: '#555',
        marginBottom: 8,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2ecc71',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    variantContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    pickerBorder: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    stockInfo: {
        marginBottom: 16,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
    },
    stockText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    inStock: {
        color: '#2ecc71',
    },
    outOfStock: {
        color: '#e74c3c',
    },
    stockWarning: {
        color: '#f39c12',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quantityContainer: {
        marginBottom: 16,
    },
    quantitySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        width: 120,
    },
    quantityButton: {
        padding: 8,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    backButton: {
        flex: 1,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginRight: 8,
    },
    backButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addToCartButton: {
        flex: 2,
        backgroundColor: '#ff6347',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginLeft: 8,
    },
    disabledButton: {
        backgroundColor: '#cccccc',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});