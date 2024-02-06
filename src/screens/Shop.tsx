import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  Input,
  Icon,
  VStack,
  FlatList,
  Box,
  Center,
  Spinner,
} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { ShopCard } from '../components/ShopCard';
import { getShopItems } from '../api/auth';
import { fetchCartItemList } from '../redux';
import {
  ColorScheme,
  CombineReducersType,
  InitialAppStateType,
  InitialUserDetailsType,
} from '../models';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from '@reduxjs/toolkit';

export const Shop = () => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));
  const { height } = useWindowDimensions();
  const dispatch =
    useDispatch<ThunkDispatch<InitialUserDetailsType, unknown, AnyAction>>();

  const [shopItems, setShopItems] = useState<Record<string, any>[]>();
  const [filterText, setFilterText] = useState<string>();
  const [filterShopItems, setFilterShopItems] = useState(shopItems);

  useEffect(() => {
    const fetchShopItems = async () => {
      const response = await getShopItems();
      setShopItems(response.data.data.items);
      setFilterShopItems(response.data.data.items);
      // console.log("dataaaaaaaaaaa",response.data.data.items)
      dispatch(fetchCartItemList());
    };
    fetchShopItems();
  }, [dispatch]);

  const handleFilterList = (text?: string) => {
    if (!text) {
      setFilterShopItems(shopItems);
    } else {
      const filteredData = shopItems?.flatMap((el) => {
        if (
          new RegExp(text, 'i').test(el?.lang?.[globalState.language]?.title)
        ) {
          return [el];
        } else {
          return [];
        }
      });
      setFilterShopItems(filteredData);
    }
  };

  return (
    <VStack m={4} space={2}>
      <Input
        minHeight="12"
        placeholder="Search"
        variant="filled"
        width="100%"
        borderRadius="10"
        borderColor="gray.500"
        backgroundColor="transparent"
        py="1"
        px="2"
        borderWidth="1"
        onChangeText={setFilterText}
        InputRightElement={
          <Icon
            mr="2"
            size="2xl"
            color="gray.400"
            as={
              <Ionicons
                name="ios-search"
                onPress={() => handleFilterList(filterText)}
              />
            }
          />
        }
      />
      {!shopItems ? (
        <Center>
          <Spinner size="lg" />
        </Center>
      ) : (
        <FlatList
          height={height - 210}
          showsVerticalScrollIndicator={false}
          data={filterShopItems}
          renderItem={({ item }) => (
            <Box>
              <ShopCard
                id={item?.['_id']}
                imageURL={item?.['shopImage']?.['uri']}
                title={item?.lang?.[globalState.language]?.title}
                alt={'image'}
                shortDescription={
                  item?.lang?.[globalState.language]?.shortDescription
                }
                description={item?.lang?.[globalState.language]?.description}
                price={item?.lang?.[globalState.language]?.price}
              />
            </Box>
          )}
          keyExtractor={(item) => item?.['_id']}
        />
      )}
    </VStack>
  );
};
