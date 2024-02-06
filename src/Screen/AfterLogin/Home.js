import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  FlatList,
} from 'react-native';
import SafeView from '../../Component/SafeView';
import HeaderComponent from '../../Component/Header';
import {assetsIcon, assetsImages} from '../../utils/assets';
import {calcH, calcW} from '../../utils/Common';
import {colorSet, mainColor} from '../../utils/Color';
import {Font} from '../../utils/font';
import {Button, HStack} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import CategoryComp, {
  DiscountComp,
  ProductComp,
} from '../../Component/ScreenComponenet/Category';
import HomeLoader from '../../Component/ScreenComponenet/LoadingScreen';
import {
  getCategory,
  getProduct,
  getProductdata,
} from '../../reduxToolkit/slices/Product/productSlice';
import moment from 'moment';
import routes from '../../Navigation/routes';
import {getcategorydata} from '../../reduxToolkit/slices/Product/categorySlice';

const Home = props => {
  const [data, setData] = useState([]);
  // const [loading, setloading] = useState(false);
  const {productdata, loading} = useSelector(state => state.productData);
  const {categorydata} = useSelector(state => state.categoryData);
  console.log('product', productdata);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getcategorydata());

    dispatch(getProductdata());
  }, [dispatch]);

  const renderItem = ({item}) => (
    <DiscountComp icon={{uri: item.main_image}} subject={`${item.name}`} />
  );

  return (
    <SafeView style={{backgroundColor: colorSet.backgroundColor}}>
      <HeaderComponent
        img
        icon={assetsIcon.menu}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
        onPress={() => props.navigation.toggleDrawer()}
      />
      <HomeLoader visible={loading} color="blue" />
      <View style={styles.firstcontainer}>
        <FlatList
          data={categorydata?.data}
          horizontal={true}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item, index}) => {
            return (
              <CategoryComp icon={{uri: item.image}} subject={`${item.name}`} />
            );
          }}
        />
      </View>
      <Image
        source={assetsImages.banner}
        style={styles.banner}
        resizeMode="stretch"
      />
      <View>
        <View style={styles.secondContainer}>
          <Text style={styles.subHeading}>Latest Accessories</Text>
          <Button
            style={styles.viewButton}
            size={'xs'}
            _text={{color: colorSet.primarycolor, fontFamily: Font.Medium}}>
            View All
          </Button>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={productdata?.data?.filter(
              item =>
                new Date(item?.added_timestamp) >=
                new Date(
                  Date.UTC(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate() - 20000,
                  ),
                ),
            )}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => {
              return (
                <ProductComp
                  icon={{uri: item.main_image}}
                  subject={`${item.name}`}
                  price={`${new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(item.price)}`}
                />
              );
            }}
          />
        </View>
      </View>
      <View style={styles.thirdContainer}>
        <Text style={[styles.subHeading, {fontSize: calcW(0.04)}]}>
          Up To 70% | Refurbished Activity Trackers
        </Text>
        <FlatList
          data={productdata?.data?.slice(0, 4)}
          initialNumToRender={productdata?.data?.length}
          // horizontal={true}
          // showsHorizontalScrollIndicator={false}
          numColumns={2}
          keyExtractor={(x, i) => i.id}
          renderItem={renderItem}
        />
      </View>
      <View>
        <View style={styles.secondContainer}>
          <Text style={styles.subHeading}>Latest Products</Text>
          <Button
            style={styles.viewButton}
            size={'xs'}
            _text={{color: colorSet.primarycolor, fontFamily: Font.Medium}}>
            View All
          </Button>
        </View>
        <View style={{flex: 1, marginBottom: calcH(0.12), padding: 10}}>
          <FlatList
            data={productdata?.data}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item, index}) => {
              return (
                <>
                  {new Date(item?.added_timestamp) <=
                  new Date(
                    Date.UTC(
                      new Date().getFullYear(),
                      new Date().getMonth(),
                      new Date().getDate() - 40,
                    ),
                  ) ? (
                    <ProductComp
                      icon={{uri: item.main_image}}
                      subject={`${item.name}`}
                      price={`${new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).format(item.price)}`}
                    />
                  ) : null}
                </>
              );
            }}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default Home;

const styles = StyleSheet.create({
  firstcontainer: {
    backgroundColor: mainColor,
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  banner: {
    width: calcW(1),
    height: calcH(0.225),
  },
  subHeading: {
    color: '#FFF',
    fontSize: calcW(0.05),
    fontFamily: Font.Medium,
  },
  secondContainer: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#fff',
    borderColor: colorSet.primarycolor,
    borderWidth: 1,
    color: colorSet.primarycolor,
  },
  latestImage: {
    width: calcW(0.3),
    height: calcH(0.2),
  },
  thirdContainer: {
    padding: 12,
    // marginBottom: calcH(0.15)
  },
  discountImage: {
    width: calcW(0.45),
    height: calcH(0.45),
    marginTop: calcH(-0.05),
  },
});
