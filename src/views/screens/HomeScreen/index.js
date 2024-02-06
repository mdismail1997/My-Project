import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  I18nManager,
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  FlatList,
  StyleSheet,
} from 'react-native';
import Button from '../../components/Button';
import {useDrawerStatus} from '@react-navigation/drawer';
import styles from './style';
import {SearchBox} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  calcH,
  calcW,
  fSize,
  IMAGE_PATH,
  STORAGE_KEY,
  STYLES,
} from '../../../utils/constants/common';
import {
  createGet,
  createpost,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import Loader from '../../components/Loader';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';

import Toast from 'react-native-toast-message';
import PickerComponent from '../../components/PickerComponent.js';
import images from '../../../conts/icons.js';
import ProductCard from '../../components/ProductCard.js';
import storage from '../../../utils/constants/storage.js';
import mmkv from '../../../utils/constants/mmkv/index.js';

import NewPickerComponent from '../../components/NewPickerComponent.js';

const pickerItems = [
  {label: 'All Products', value: 'All Products'},
  {label: 'Active Products', value: 'Active Products'},
  {label: 'Inactive Products', value: 'Inactive Products'},
];

const NoProducts = () => (
  <View
    style={{
      alignItems: 'center',
      justifyContent: 'center',
      //borderWidth: 1,
      //height: '45%',
    }}>
    <Text style={[styles.noOrderText, {fontSize: fSize(60), lineHeight: 80}]}>
      No
    </Text>
    <Text style={styles.noOrderText}>Products available...</Text>
  </View>
);

function HomeScreen({navigation}) {
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [pickerFilter, setPickerFilter] = React.useState('All Products');
  const [productList, setProductList] = React.useState([]);
  const [activeProductList, setActiveProductList] = React.useState([]);
  const [inActiveProductList, setInActiveProductList] = React.useState([]);
  const [totalProductCount, setTotalProductCount] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [languagedata, setlngdata] = React.useState('');
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);

  //console.log('pickerFilter', pickerFilter);
  //console.log('productList', productList);

  const productsCategory = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: `${commonUrl.categories}`,
      });
      if (result.status === 200) {
        var obj = JSON.parse(
          JSON.stringify(result.data.children_data)
            .replaceAll('"name":', '"label":')
            .replaceAll('"id":', '"value":'),
        );
        //console.log('obj', obj);

        mmkv.store(STORAGE_KEY.CATEGORY, obj);
      }
    } catch (error) {
      console.log(`error in productsCategory`, error);
    } finally {
      setLoading(false);
    }
  };

  const getColors = React.useCallback(async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: `${commonUrl.getColors}`,
      });
      if (result.status === 200) {
        mmkv.store(STORAGE_KEY.COLORS, result.data);
      }
    } catch (error) {
      console.log('getColors error', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [getColors]);

  const getSizes = React.useCallback(async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: `${commonUrl.getSizes}`,
      });
      if (result.status === 200) {
        mmkv.store(STORAGE_KEY.SIZES, result.data);
      }
    } catch (error) {
      console.log('getSizes error', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  }, [getSizes]);

  React.useEffect(() => {
    if (pickerFilter == null) {
      getProductList();
    }
    if (pickerFilter == 'All Products') {
      getProductList();
    }
    if (pickerFilter == 'Active Products') getActiveProductList();
    if (pickerFilter == 'Inactive Products') getInActiveProductList();
  }, [page, pickerFilter]);

  const getData = () => {
    selectedLng();
    productsCategory();
    getSizes();
    getColors();
  };
  React.useEffect(() => {
    const unsubscribe = getData(); //subscribe
    return unsubscribe; //unsubscribe
  }, []);

  const selectedLng = async () => {
    setLoading(true);
    const lngData = getLng();
    // console.log('first', lngData);
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      setlngdata(lngData);
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      setlngdata(lngData);
      I18nManager.forceRTL(true);
    }
    setLoading(false);
    console.log('selected Language data==>>>', lngData);
  };

  const getProductList = async () => {
    setLoading(true);
    setProductList([]);
    const url = `${commonUrl.productlist}[currentPage]=${page}&searchCriteria[pageSize]=20`;

    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        setProductList([]);

        setProductList([...productList, ...result.data.items]);
        setTotalProductCount(result?.data?.total_count);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  const getActiveProductList = async () => {
    setLoading(true);

    setPage(1);
    const url = `${commonUrl.activeProductList}${page}&searchCriteria[pageSize]=20`;

    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        setActiveProductList([...activeProductList, ...result.data.items]);
        setTotalProductCount(result?.data?.total_count);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  const getInActiveProductList = async () => {
    setLoading(true);
    setPage(1);
    const url = `${commonUrl.inActiveProductList}${page}&searchCriteria[pageSize]=20`;

    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        //console.log(result.data);
        //console.log(`api call getInActiveProductList`);

        setInActiveProductList([...inActiveProductList, ...result.data.items]);
        setTotalProductCount(result?.data?.total_count);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  const searchProductList = async () => {
    setLoading(true);
    const url = `${commonUrl.productSearch}${search}`;
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        //console.log('result.', result?.data?.length);
        setProductList([result.data]);
        setTotalProductCount(result?.data?.length);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  React.useEffect(() => {
    checkSellerValid();
  }, []);

  const checkSellerValid = async () => {
    const {email} = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
    //console.log('email', email);
    const data = {
      sellerDetails: {
        email: email,
      },
    };
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: commonUrl.checkSellerValid,
        body: data,
      });
      if (result.status === 200) {
        mmkv.store(STORAGE_KEY.isSeller, result.data);
      }
    } catch (error) {
      Toast.show({
        text1: `Upload your documents to become a seller.`,
        text2: 'Seller not approved.',
        type: 'error',
        topOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  const renderProductList = () => {
    let data;
    if (pickerFilter == 'Active Products') data = activeProductList;
    if (pickerFilter == 'All Products') data = productList;
    if (pickerFilter == 'Inactive Products') data = inActiveProductList;
    return (
      <>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}${index.toString()}`}
          onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{height: calcH(0.245)}}
          removeClippedSubviews={true}
        />
      </>
    );
  };

  const renderItem = ({item}) => {
    let obj = {};
    item.custom_attributes?.map(i => {
      if (i.attribute_code == 'thumbnail') obj = i.value;
    });

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('editProduct', {sku: item?.sku, from: 'Home'})
          }>
          <ProductCard
            image={{uri: `${IMAGE_PATH.PRODUCT_PATH}${obj}`}}
            name={item?.name}
            price={`AED ${parseFloat(item?.price).toFixed(2)}`}
            order={`#ID-${item?.id}`}
            languagedata={languagedata}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderFooter = () => {
    return (
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator color="black" style={{margin: 15}} />
        ) : null}
      </View>
    );
  };

  const onFocus = () => navigation.navigate('SearchScreen');

  return (
    <>
      <SafeAreaView style={styles.container}>
        {loading && <Loader visible={loading} />}
        <View style={styles.subContainer}>
          <SearchBox
            placeholder={`${strings.SEARCH_BY} ${strings.NAME}...`}
            icon="search"
            keyboardType="web-search"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchProductList}
            onFocus={onFocus}
          />
          <View style={styles.pickerContainer}>
            <Text style={{fontSize: 11,color:'black'}}>
              {`${strings.TOTAL} ${totalProductCount} ${strings.PRODUCT_ARE_AVALIABLE}`}
            </Text>
            <View style={styles.pickerItem}>
              <NewPickerComponent
                value={pickerFilter}
                onValueChange={setPickerFilter}
                items={pickerItems}
              />
            </View>
          </View>
          {renderProductList()}
        </View>
      </SafeAreaView>
    </>
  );
}

export default HomeScreen;
