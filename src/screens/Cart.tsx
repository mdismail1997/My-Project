import React, { useEffect } from 'react';
import {
  Stack,
  Box,
  Heading,
  FlatList,
  ScrollView,
  Center,
  Text,
  Spinner,
} from 'native-base';
import { CartItemCard } from '../components/CartItemCard';
import { useDispatch, useSelector } from 'react-redux';
import {
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';
import { fetchCartItemList } from '../redux';

export const Cart = () => {
  const globalState = useSelector<
    CombineReducersType,
    {
      language: InitialAppStateType['appLanguage'];
      cartItem: InitialUserDetailsType['userData']['cartItems'];
      fetching: InitialUserDetailsType['isFetching'];
    }
  >((state) => ({
    cartItem: state.userDetails.userData.cartItems,
    language: state.appDetails.appLanguage,
    fetching: state.userDetails.isFetching,
  }));
  const dispatch =
    useDispatch<ThunkDispatch<InitialUserDetailsType, unknown, AnyAction>>();

  useEffect(() => {
    const getData = async () => {
      dispatch(fetchCartItemList());
    };
    getData();
  }, [dispatch]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
      <Stack m={2} space={2}>
        <Heading size="md">
          Total:{' '}
          {globalState.cartItem.reduce(
            (acc, cur) => acc + cur.lang[globalState.language].price,
            0
          )}
        </Heading>
        <Box>
          <Heading size="md">
            {globalState.cartItem.length} item in cart
          </Heading>
          {globalState.cartItem.length === 0 &&
            (globalState.fetching ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
              <Center py="2">
                <Text>No item present</Text>
              </Center>
            ))}
          <FlatList
            data={globalState.cartItem}
            nestedScrollEnabled
            renderItem={({ item }) => (
              <Box py="2">
                <CartItemCard
                  id={item._id}
                  title={item.lang[globalState.language].title}
                  shortDescription={
                    item.lang[globalState.language].shortDescription
                  }
                  description={item.lang[globalState.language].description}
                  imageURL={item.shopImage?.uri}
                  alt={item.shopImage?.filename}
                  price={item.lang[globalState.language].price}
                />
              </Box>
            )}
            keyExtractor={(item) => item._id}
          />
        </Box>
        <Box>
          <Heading size="md">Save for later</Heading>
          {/* {cartData.length ? null : ( */}
          <Center py="2">
            <Text>No item present</Text>
          </Center>
          {/* )} */}
          {/* <FlatList
            data={cartData}
            renderItem={({ item }) => (
              <Box py="2">
                <CartItemCard
                  id={item.id}
                  title={item.title}
                  shortDescription={item.shortDescription}
                  description={item.description}
                  imageURL={item.imageURL}
                  alt={item.alt}
                  price={item.price}
                  inCart={false}
                />
              </Box>
            )}
            keyExtractor={(item) => item.id}
            extraData={cartData}
          /> */}
        </Box>
      </Stack>
    </ScrollView>
  );
};
