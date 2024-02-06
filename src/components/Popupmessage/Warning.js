import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Modal, IconButton } from 'react-native-paper';
import { useWindowDimensions, View } from 'react-native';
export const Warning = ({ isModal, onClose }) => {
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
      visible={isModal}
      // animationIn="zoomIn"
      // animationOut="zoomOut"
    >
      <View
        style={{
          width: 200,
          height: 60,
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
            //  alignItems: 'center',
            // justifyContent: 'center',
            borderRadius: 15,
            marginTop: -30,
            marginLeft: 20,
          }}
        >
          {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}

          <Text> 2 minute remaining </Text>
        </View>
      </View>
    </Modal>
  );
};
