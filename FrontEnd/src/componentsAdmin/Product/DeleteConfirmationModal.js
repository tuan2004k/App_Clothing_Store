import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../../styles/ProductManagementStyles';

const DeleteConfirmationModal = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Xác nhận xóa sản phẩm</Text>
          <Text style={styles.modalMessage}>Bạn có chắc muốn xóa sản phẩm này không?</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={onConfirm}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteConfirmationModal;