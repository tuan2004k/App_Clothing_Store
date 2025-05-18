import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateUser, getUserById } from '../../API/api';

export default function UpdateProfileScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [user, setUser] = useState({
        Ten: '',
        Email: '',
        DiaChi: '',
        SoDienThoai: '',
        avatar: '',
        id: '',
        VaiTro: 'NguoiDung', // Thêm mặc định để tránh lỗi
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                console.log('Raw data from AsyncStorage:', userData);

                if (!userData) {
                    console.warn('Không tìm thấy key "user" trong AsyncStorage');
                    Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
                    navigation.navigate('Login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                console.log('Parsed user data:', parsedUser);

                if (!parsedUser.id && !parsedUser.MaNguoiDung) {
                    throw new Error('Thiếu ID người dùng trong dữ liệu');
                }

                setUser({
                    Ten: parsedUser.Ten || '',
                    Email: parsedUser.Email || '',
                    DiaChi: parsedUser.DiaChi || '',
                    SoDienThoai: parsedUser.SoDienThoai || '',
                    avatar: parsedUser.avatar || parsedUser.AnhDaiDien || '',
                    id: parsedUser.id || parsedUser.MaNguoiDung || '',
                    VaiTro: parsedUser.VaiTro || 'NguoiDung',
                });
            } catch (error) {
                console.error('Chi tiết lỗi:', error);
                Alert.alert('Lỗi nghiêm trọng', error.message);
                navigation.goBack();
            }
        };
        fetchUserData();
    }, [navigation]);

    const handleSave = async () => {
        if (!user.id) {
            Alert.alert('Lỗi', 'Vui lòng đăng nhập lại');
            navigation.navigate('Login');
            return;
        }

        try {
            const updateData = {
                MaNguoiDung: user.id,
                Ten: user.Ten,
                Email: user.Email,
                DiaChi: user.DiaChi,
                SoDienThoai: user.SoDienThoai,
                AnhDaiDien: user.avatar,
                VaiTro: user.VaiTro,
            };

            console.log('Payload gửi đi:', updateData);

            const response = await updateUser(user.id, updateData);
            console.log('Kết quả trả về từ updateUser:', response);

            if (response && response.message === 'Người dùng đã được cập nhật thành công') {
                // Thử lấy dữ liệu mới từ API
                let updatedUserData = null;
                try {
                    updatedUserData = await getUserById(user.id);
                    console.log('Dữ liệu lấy lại từ getUserById:', updatedUserData);
                } catch (getError) {
                    console.warn('Lỗi khi lấy dữ liệu mới từ getUserById:', getError);
                    // Nếu getUserById thất bại, sử dụng dữ liệu cục bộ
                    updatedUserData = { ...user, ...updateData };
                }

                // Cập nhật AsyncStorage với dữ liệu (từ API hoặc cục bộ)
                await AsyncStorage.setItem('user', JSON.stringify({
                    id: user.id,
                    Ten: updatedUserData.Ten || user.Ten,
                    Email: updatedUserData.Email || user.Email,
                    DiaChi: updatedUserData.DiaChi || user.DiaChi,
                    SoDienThoai: updatedUserData.SoDienThoai || user.SoDienThoai,
                    avatar: updatedUserData.AnhDaiDien || user.avatar,
                    VaiTro: updatedUserData.VaiTro || user.VaiTro,
                }));

                Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
                // Đảm bảo điều hướng
            } else {
                Alert.alert('Lỗi', response?.message || 'Cập nhật không thành công');
                navigation.navigate('AccountScreen');
            }
        } catch (error) {
            console.error('Lỗi chi tiết:', error);
            Alert.alert('Lỗi', error.response?.data?.message || error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cập nhật thông tin</Text>
            <Text style={styles.label}>Họ và tên: {user.Ten}</Text>
            <Text style={styles.label}>Email: {user.Email}</Text>
            <TextInput
                label="Địa chỉ"
                value={user.DiaChi}
                onChangeText={(text) => setUser({ ...user, DiaChi: text })}
                mode="outlined"
                style={styles.input}
            />
            <TextInput
                label="Số điện thoại"
                value={user.SoDienThoai}
                onChangeText={(text) => setUser({ ...user, SoDienThoai: text })}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Lưu thông tin</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
    input: {
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: '#2196F3',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});