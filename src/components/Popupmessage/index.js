import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Modal, IconButton } from 'react-native-paper';
import { useWindowDimensions, View, Image } from 'react-native';

export const SuccessfullySubmitModal = ({
  isModalVisible,
  onClose,
  message = 'Updated successfully',
}) => {
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
          width: 300,
          height: 150,
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
            justifyContent: 'center',
            borderRadius: 15,
            marginTop: -30,
          }}
        >
          {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}
          <Image
            source={require('../../Assets/doctorappicon2.png')}
            style={{ width: 60, height: 60, borderRadius: 20 }}
          />

          <Text
            style={{
              fontSize: 15,
              marginTop: 15,
              color: '#2173A8',
              fontStyle: 'italic',
              fontWeight: 'bold',
            }}
          >
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
};
