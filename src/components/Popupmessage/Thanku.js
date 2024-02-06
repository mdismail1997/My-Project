import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Modal, IconButton } from 'react-native-paper';
import { useWindowDimensions, View } from 'react-native';
export const Thanku = ({ isModalVisible, onClose }) => {
  const { height, width } = useWindowDimensions();
  return (
    <Modal
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 50,
        position: 'absolute',
      }}
      onDismiss={onClose}
      visible={isModalVisible}
    // animationIn="zoomIn"
    // animationOut="zoomOut"
    >
      <View
        style={{
          width: width - 50,
          height: height / 5,
          backgroundColor: '#fff',
          borderRadius: 15,
        }}
      >
        <IconButton
          icon="close"
          size={26}
          color="red"
          style={{ alignSelf: 'flex-end' }}
          onPress={onClose}
        />

        <View
          style={{
            alignItems: 'center',
            marginTop: -30,
            borderRadius: 15,
          }}
        >
          <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          />

          <Text style={{ color: '#000' }}>Thank You For Booking</Text>
        </View>
      </View>
    </Modal>
  );
};
