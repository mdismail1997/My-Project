import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, IconButton, Text, View, VStack } from 'native-base';
import {
  launchImageLibrary,
  launchCamera,
  Asset,
} from 'react-native-image-picker';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { ImagePickerModal } from './ImagePickerModal';

export interface ImageUploaderProps {
  alt?: string;
  src?: string;
  helperText?: string;
  disabled?: boolean;
  onSelectFile?: (file: Asset[]) => void;
}

export function ImageUploader({
  src,
  alt,
  helperText,
  disabled,
  onSelectFile,
}: ImageUploaderProps): JSX.Element {
  const [visible, setVisible] = useState(false);

  const handlePicUpload = () => {
    setVisible(true);
  };

  const handleCameraPress = () => {
    launchCamera({ mediaType: 'photo' }, (response) => {
      console.log(response);
      if (response.assets) {
        onSelectFile?.(response.assets);
      }
      setVisible(false);
    });
  };

  const handleImageLibraryPress = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets) {
        onSelectFile?.(response.assets);
      }
      setVisible(false);
    });
  };

  return (
    <VStack alignItems="center">
      <ImagePickerModal
        isVisible={visible}
        onClose={() => {
          setVisible(false);
        }}
        onCameraPress={handleCameraPress}
        onImageLibraryPress={handleImageLibraryPress}
      />
      <View style={styles.uploadIconParent}>
        <Avatar
          size="2xl"
          source={{
            uri: src,
          }}
        >
          {alt?.charAt(0)}
        </Avatar>
        <IconButton
          onPress={handlePicUpload}
          disabled={disabled}
          variant="solid"
          borderRadius="full"
          style={styles.uploadIcon}
          _icon={{
            as: AntDesignIcons,
            name: 'camera',
          }}
        />
      </View>

      <Text ml={2}>{helperText ?? ''}</Text>
    </VStack>
  );
}

const styles = StyleSheet.create({
  uploadIconParent: {
    position: 'relative',
  },
  uploadIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 10,
    cursor: 'pointer',
  },
  fileInput: {
    display: 'none',
  },
});
