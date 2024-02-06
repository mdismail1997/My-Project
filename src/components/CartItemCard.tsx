import React from 'react';
import {
  View,
  Text,
  Pressable,
  Box,
  Stack,
  Image,
  Spacer,
  Button,
  AspectRatio,
} from 'native-base';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItemList, setCartItem } from '../redux';
import {
  ColorType,
  ResponsiveValue,
} from 'native-base/lib/typescript/components/types';
import { ILinearGradientProps } from 'native-base/lib/typescript/components/primitives/Box/types';
import { removeFromCart } from '../api/auth';
import {
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

export interface CartItemCardProps {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  price: number;
  imageURL: string;
  alt: string;
  inCart?: boolean;
  bgColor?: ResponsiveValue<ColorType | ILinearGradientProps>;
  onCartStateChange?: (itemID: string, state: boolean) => void;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({
  id,
  title,
  shortDescription,
  description,
  imageURL,
  alt,
  price,
  inCart,
  bgColor,
  onCartStateChange,
}) => {
  const globalState = useSelector<
    CombineReducersType,
    {
      language: InitialAppStateType['appLanguage'];
      cartItem: InitialUserDetailsType['userData']['cartItems'];
      cartQty: InitialUserDetailsType['userData']['cart'];
      fetching: InitialUserDetailsType['isFetching'];
    }
  >((state) => ({
    cartItem: state.userDetails.userData.cartItems,
    cartQty: state.userDetails.userData.cart,
    language: state.appDetails.appLanguage,
    fetching: state.userDetails.isFetching,
  }));
  const dispatch =
    useDispatch<ThunkDispatch<InitialUserDetailsType, unknown, AnyAction>>();

  const handleRemove = async (_id: string) => {
    await removeFromCart(_id);
    dispatch(fetchCartItemList());
    dispatch(setCartItem(globalState.cartQty - 1));
  };

  return (
    <Pressable
      onPress={() => {
        console.log(id, description);
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
            <View p={2} flex={3}>
              <Text bold isTruncated>
                {title}
              </Text>
              <Spacer />
              <Text fontSize={'xs'} numberOfLines={2} ellipsizeMode="tail">
                {shortDescription ?? ''}
              </Text>
              <Spacer />
              <Text>{price} EUR</Text>
              <Stack direction="row" space={2}>
                <Button
                  borderRadius="3xl"
                  colorScheme="error"
                  onPress={() => handleRemove(id)}
                >
                  Remove
                </Button>
                <Button
                  colorScheme="blue"
                  borderRadius="3xl"
                  onPress={() => {
                    onCartStateChange?.(id, !inCart);
                  }}
                >
                  {inCart ? 'Save for later' : 'Add to cart'}
                </Button>
              </Stack>
            </View>
          </Stack>
        </Box>
      )}
    </Pressable>
  );
};
