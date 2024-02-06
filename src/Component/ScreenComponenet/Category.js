import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, TouchableOpacity} from 'react-native';
import {mainColor} from '../../utils/Color';
import {calcH, calcW} from '../../utils/Common';
import {
  AspectRatio,
  Box,
  Center,
  HStack,
  Heading,
  Skeleton,
  Stack,
} from 'native-base';
import {Font} from '../../utils/font';

const CategoryComp = ({icon, subject}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
      }}>
      <View style={styles.container}>
        <Image source={icon} style={styles.image} resizeMode="contain" />
      </View>
      <Text
        style={{textAlign: 'center', color: '#000', fontFamily: Font.Medium}}>
        {subject}
      </Text>
    </TouchableOpacity>
  );
};

export const SizeComp = ({size}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
      }}>
      <View style={styles.container}>
        <Text
          style={{
            textAlign: 'center',
            color: '#000',
            fontFamily: Font.Bold,
            fontSize: 20,
          }}>
          {size}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const ProductComp = ({icon, subject, price}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
        backgroundColor: mainColor,
      }}>
      <View style={styles.proContainer}>
        <Image
          source={icon}
          style={{
            width: calcW(0.3),
            height: calcH(0.2),
          }}
          resizeMode="contain"
        />
      </View>
      <Text
        style={{textAlign: 'center', color: '#fff', fontFamily: Font.Medium}}>
        {subject}
      </Text>
      <Text
        style={{textAlign: 'center', color: '#fff', fontFamily: Font.Medium}}>
        {price}
      </Text>
    </TouchableOpacity>
  );
};

export const DiscountComp = ({icon, subject, price}) => {
  return (
    <TouchableOpacity
      style={{
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 12,
      }}>
      <View style={styles.proContainer}>
        <Image
          source={icon}
          style={{
            width: calcW(0.5),
            height: calcH(0.2),
          }}
          resizeMode="contain"
        />
      </View>
      <Text style={{textAlign: 'center'}}>{subject}</Text>
      {/* <Text style={{textAlign: 'center'}}>{price}</Text> */}
    </TouchableOpacity>
  );
};

export const FilterComp = ({
  icon,
  heading,
  categoryname,
  discount,
  price,
  onpress,
}) => {
  return (
    <TouchableOpacity onPress={onpress} style={{flex: 0.2}}>
      <Box alignItems="center" padding={2}>
        <Box
          width={calcW(0.9)}
          height={calcH(0.35)}
          rounded="lg"
          borderColor="coolGray.200"
          borderWidth="1"
          // _dark={{
          //   borderColor: 'coolGray.600',
          //   backgroundColor: 'gray.700',
          // }}
          // _web={{
          //   shadow: 2,
          //   borderWidth: 0,
          // }}
          _light={{
            backgroundColor: 'gray.50',
          }}>
          <Center>
            <HStack>
              <Box flex={0.9}>
                <Image
                  source={icon}
                  alt="image"
                  resizeMode={'contain'}
                  style={{width: calcW(0.4), height: calcH(0.45)}}
                />
              </Box>
              <Stack
                p="5"
                space={3}
                alignItems={'flex-start'}
                justifyContent={'center'}>
                <Stack space={2}>
                  <Heading size="md" ml="-1" noOfLines={2}>
                    {heading}
                  </Heading>
                  <Text
                    fontSize="xs"
                    _light={{
                      color: 'violet.500',
                    }}
                    _dark={{
                      color: 'violet.400',
                    }}
                    fontWeight="500"
                    ml="-0.5"
                    mt="-1">
                    {categoryname}
                  </Text>
                </Stack>

                <Heading size="sm" ml="-1">
                  {discount}
                </Heading>
                <Text style={{color: mainColor, fontFamily: Font.Bold}}>
                  {price}
                </Text>
              </Stack>
            </HStack>
          </Center>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default CategoryComp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderColor: mainColor,
    borderWidth: 2,
    borderRadius: 85,
    width: calcW(0.18),
    height: calcH(0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: calcW(0.1),
    height: calcH(0.1),
  },
  proContainer: {},
});
