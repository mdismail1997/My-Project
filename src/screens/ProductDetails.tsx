import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { RouteProp, useRoute, useTheme } from '@react-navigation/native';
import {
  AspectRatio,
  ScrollView,
  VStack,
  Skeleton,
  Heading,
  Image,
} from 'native-base';
import RenderHTML from 'react-native-render-html';
import { ImageViewerModal } from 'react-native-advance-components';
import { RootStackParamList } from '../types';
import { baseStyles, systemFonts, tagsStyles } from '../utils/globalStyles';

export const ProductDetails = () => {
  const { params } =
    useRoute<RouteProp<RootStackParamList, 'ProductDetails'>>();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();

  const [productData, setProductData] = useState(params);

  useEffect(() => {
    setProductData(params);
  }, [params]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack space={4} m="4">
        <AspectRatio w="100%" ratio={7 / 4}>
          {productData.imageURL ? (
            <ImageViewerModal>
              <Image
                alt="horse"
                minHeight="100%"
                width="100%"
                source={{ uri: productData.imageURL }}
              />
            </ImageViewerModal>
          ) : (
            <Skeleton height="100%" />
          )}
        </AspectRatio>
        <Heading>{productData.name}</Heading>
        <RenderHTML
          contentWidth={width}
          source={{
            html: productData.description,
          }}
          tagsStyles={tagsStyles(colors.text)}
          baseStyle={baseStyles}
          systemFonts={systemFonts}
        />
      </VStack>
    </ScrollView>
  );
};
