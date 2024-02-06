import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Center, Stack, Pressable, Text, Box, Actionsheet } from 'native-base';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '@react-navigation/native';

interface ImagePickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onImageLibraryPress?: (event: GestureResponderEvent) => void;
  onCameraPress?: (event: GestureResponderEvent) => void;
}

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isVisible,
  onClose,
  onCameraPress,
  onImageLibraryPress,
}) => {
  const { colors } = useTheme();

  return (
    <Actionsheet isOpen={isVisible} onClose={onClose}>
      <Actionsheet.Content backgroundColor={colors.border}>
        <Center height="40" borderTopRadius="3xl">
          <Stack direction="row" width="full" justifyContent="space-evenly">
            <Pressable onPress={onImageLibraryPress}>
              {({ isPressed }) => (
                <Box
                  alignItems="center"
                  style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                >
                  <AntDesignIcon
                    name="folderopen"
                    size={30}
                    color={colors.text}
                  />
                  <Text>Gallery</Text>
                </Box>
              )}
            </Pressable>
            <Pressable onPress={onCameraPress}>
              {({ isPressed }) => (
                <Box
                  alignItems="center"
                  style={{ transform: [{ scale: isPressed ? 0.96 : 1 }] }}
                >
                  <AntDesignIcon name="camerao" size={30} color={colors.text} />
                  <Text>Camera</Text>
                </Box>
              )}
            </Pressable>
          </Stack>
        </Center>
      </Actionsheet.Content>
    </Actionsheet>
  );
};
