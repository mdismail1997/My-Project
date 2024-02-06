import React from 'react';
import { View, Text, Stack, Center } from 'native-base';
import Modal from 'react-native-modal';
import { useTheme } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface SuccessfullySubmitModalProps {
  isModalVisible: boolean;
  onClose?: () => void;
}

export const SuccessfullySubmitModal: React.FC<
  SuccessfullySubmitModalProps
> = ({ isModalVisible, onClose }) => {
  const { colors } = useTheme();
  return (
    <View>
      <Modal
        onBackdropPress={onClose}
        isVisible={isModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
      >
        <Stack
          padding="4"
          space="2"
          borderRadius="md"
          backgroundColor={colors.card}
        >
          <Center>
            <Ionicons
              name="checkmark-done-circle-outline"
              size={60}
              color="green"
            />
          </Center>
          <Center>
            <Text>Updated successfully</Text>
          </Center>
        </Stack>
      </Modal>
    </View>
  );
};
