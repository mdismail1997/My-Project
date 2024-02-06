import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { Linking, StyleSheet } from 'react-native';
import {
  Text,
  Pressable,
  Box,
  Stack,
  Image,
  Button,
  AspectRatio,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { setCartItem } from '../redux';
import { addToCart } from '../api/auth';
import { CombineReducersType, InitialUserDetailsType } from '../models';

export interface ShopCardProps {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  imageURL: string;
  alt: string;
  bgColor?: ResponsiveValue<ColorType | ILinearGradientProps>;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  id,
  title,
  shortDescription,
  description,
  price,
  imageURL,
  alt,
  bgColor,
}) => {
  const globalState = useSelector<
    CombineReducersType,
    {
      cartQty: InitialUserDetailsType['userData']['cart'];
    }
  >((state) => ({
    cartQty: state.userDetails.userData.cart,
  }));
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const handleBuyItem = (itemId: string, _ev: GestureResponderEvent) => {
    console.log(`Buying ${itemId}`);
    navigation.navigate('Checkout');
  };

  const handleAddToCart = async (
    itemId: string,
    _ev: GestureResponderEvent
  ) => {
    console.log(`${itemId} added to cart`);
    dispatch(setCartItem(globalState.cartQty + 1));
    await addToCart({ item: itemId });
  };

  return (
    <Pressable
      onPress={() => {
        console.log(id);
        navigation.navigate('ProductDetails', {
          id,
          name: title,
          description,
          price,
          imageURL,
          alt,
        });
      }}
    >
      {({ isPressed }) => (
        <Box
          width="full"
          borderColor="coolGray.300"
          backgroundColor={bgColor}
          rounded="md"
          overflow="hidden"
          style={{
            transform: [
              {
                scale: isPressed ? 0.96 : 1,
              },
            ],
          }}
          _dark={{
            borderColor: 'coolGray.600',
          }}
        >
          <Stack direction={'row'} alignItems="center">
            <AspectRatio
              flex={2}
              width="100%"
              backgroundColor="coolGray.400"
              ratio={1}
            >
              <Image
                source={{ uri: imageURL }}
                alt={alt}
                height="full"
                width="full"
              />
            </AspectRatio>
            <Stack p={2} flex={3} space={2}>
              <Text bold isTruncated>
                {title}
              </Text>
              <Text fontSize={'xs'} numberOfLines={2} ellipsizeMode="tail">
                {shortDescription ?? ''}
              </Text>
              <Text fontSize="md">{price} EUR</Text>
              <Stack direction="row" space={2}>
                <Button
                  colorScheme="blue"
                  borderRadius="3xl"
                  width="16"
                  onPress={() => {
                    Linking.openURL(
                     'https://nodeserver.mydevfactory.com/projects/tulika/Soumen/equipro/equipro-web/#/OurShop'
                    );
                  }}

                    // handleBuyItem(id, ev)
                  // }
                >
                  Buy
                </Button>
                <Button
                  colorScheme="blue"
                  borderRadius="3xl"
                  onPress={(ev) => handleAddToCart(id, ev)}
                >
                  Add to cart
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      )}
    </Pressable>
  );
};
