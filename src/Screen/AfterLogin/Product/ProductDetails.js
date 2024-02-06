import React, {useEffect} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {AppButton, SafeView} from '../../../Component';
import HeaderComponent from '../../../Component/Header';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';
import {useDispatch, useSelector} from 'react-redux';
import {getProductDetailsdata} from '../../../reduxToolkit/slices/Product/productDetailsSlice';
import {AspectRatio, Box, Center, HStack, Image, VStack} from 'native-base';
import {calcH, calcW} from '../../../utils/Common';
import {Font} from '../../../utils/font';
import {assetsImages} from '../../../utils/assets';
import {SizeComp} from '../../../Component/ScreenComponenet/Category';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import routes from '../../../Navigation/routes';
import HomeLoader from '../../../Component/ScreenComponenet/LoadingScreen';
import {colorSet, mainColor} from '../../../utils/Color';

export const ProductDetails = props => {
  const {productDetailsdata, loading} = useSelector(
    state => state.productDetailsData,
  );
  console.log('product', productDetailsdata);
  const dispatch = useDispatch();
  useEffect(() => {
    const dataS = props.route.params.data;
    console.log(dataS);
    dispatch(getProductDetailsdata(dataS));
  }, [dispatch]);

  return (
    <SafeView>
      <HeaderComponent
        headingName={productDetailsdata?.data?.name}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
      />
      <HomeLoader visible={loading} color="blue" />

      <View style={{padding: 8}}>
        <Box
          alignItems="center"
          marginTop={calcH(0.02)}
          marginBottom={calcH(0.02)}>
          <Box
            maxW="80"
            rounded="lg"
            overflow="hidden"
            borderColor="coolGray.200"
            borderWidth="1"
            _dark={{
              borderColor: 'coolGray.600',
              backgroundColor: 'gray.700',
            }}
            _web={{
              shadow: 2,
              borderWidth: 0,
            }}
            _light={{
              backgroundColor: 'gray.50',
            }}>
            <Box>
              <AspectRatio w="100%" ratio={16 / 9}>
                <Image
                  source={{
                    uri: productDetailsdata?.data?.thumbnailSrc,
                  }}
                  alt="image"
                />
              </AspectRatio>
            </Box>
          </Box>
        </Box>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 5,
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              flex: 0.3,
              justifyContent: 'space-between',
            }}>
            <Text style={{color: '#fff', fontFamily: Font.Bold, fontSize: 18}}>
              Color :
            </Text>
            <Text style={styles.text}>Pink</Text>
          </View>
          <View style={{flexDirection: 'row', flex: 0.45}}>
            <Text style={{color: '#fff', fontFamily: Font.Bold, fontSize: 18}}>
              Available color:{' '}
            </Text>
            <Text style={[styles.text, {fontSize: 22}]}>
              {productDetailsdata?.data?.attributes?.color?.length}
            </Text>
          </View>
        </View>
        <HStack space={6} padding={2}>
          <Image source={assetsImages.image1} style={styles.imageS} />
          <Image source={assetsImages.image2} style={styles.imageS} />
          <Image source={assetsImages.image3} style={styles.imageS} />
        </HStack>
        <Text numberOfLines={2} style={styles.text}>
          {productDetailsdata?.data?.description}
        </Text>
        <View
          style={{
            padding: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: calcW(0.5),
          }}>
          <Text style={[styles.text, {color: 'green'}]}>
            {productDetailsdata?.data?.discount_percentage}% off
          </Text>
          <Text style={styles.text}>${productDetailsdata?.data?.price}</Text>
        </View>
        <View style={{backgroundColor: '#D0D0D0', width: calcW(0.8)}}>
          <Text style={{color: '#000', fontSize: 15}}>
            Get $10- off* on your first online order
          </Text>
        </View>
      </View>
      <View style={{padding: 8}}>
        <Text style={styles.heading}>Select Size</Text>
        <View style={{flexDirection: 'row', padding: 8}}>
          <SizeComp size={'S'} />
          <SizeComp size={'M'} />
          <SizeComp size={'L'} />
          <SizeComp size={'XL'} />
        </View>
        <View style={{padding: 8}}>
          <Text style={styles.heading}>Product Details</Text>
          <View
            style={{
              padding: 12,
              flex: 0.3,
              backgroundColor: '#424d54',
              borderRadius: 8,
            }}>
            <View>
              <Text style={styles.text}>Color: Pink</Text>
            </View>
            <View>
              <Text style={styles.text}>Length: Calf Length</Text>
            </View>
            <View>
              <Text style={styles.text}>Type: Fit and Flare</Text>
            </View>
            <View>
              <Text style={styles.text}>Color: Fit Butterfly Sleeve</Text>
            </View>
            <HStack justifyContent={'space-between'} marginTop={calcH(0.01)}>
              <Text style={[styles.text, {color: mainColor}]}>All Details</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(routes.SizeDetails)}>
                <Ionicons
                  name={'chevron-forward-circle-outline'}
                  size={18}
                  color={mainColor}
                />
              </TouchableOpacity>
            </HStack>
          </View>
        </View>
        <View style={{padding: 8}}>
          <AppButton
            title={'Buy Now'}
            icon={
              <Ionicons
                name="cart-outline"
                size={28}
                style={{marginRight: calcW(0.02)}}
                color={'#000'}
              />
            }
            buttonStyle={{backgroundColor: '#fff'}}
            textStyle={{color: '#000', fontSize: 20}}
          />
          <AppButton
            title={'Add to Cart'}
            icon={
              <Ionicons
                name="cart-outline"
                size={28}
                style={{marginRight: calcW(0.02)}}
                color={'#fff'}
              />
            }
            textStyle={{color: '#fff', fontSize: 20}}
          />
        </View>
      </View>
    </SafeView>
  );
};

const styles = StyleSheet.create({
  text: {color: '#fff', fontSize: 14, fontFamily: Font.Regular},
  imageS: {
    height: calcH(0.3),
    width: calcW(0.28),
  },
  heading: {color: '#fff', fontSize: 20, fontFamily: Font.Bold},
});
