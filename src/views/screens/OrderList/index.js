import {
  FlatList,
  I18nManager,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import Toast from 'react-native-toast-message';

import {SearchBox} from '../../components/index.js';
import {getLng} from '../../components/lng/changeLng.js';
import strings from '../../components/lng/LocalizedStrings.js';
import {
  calcH,
  calcW,
  fSize,
  STORAGE_KEY,
} from '../../../utils/constants/common.js';
import images from '../../../conts/icons.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl.js';
import PickerComponent from '../../components/PickerComponent.js';
import COLORS from '../../../conts/colors.js';
import FloatingButton from '../../components/FloatingButton.js';
import ProductCard from '../../components/ProductCard.js';
import {AuthContext} from '../../components/context.js';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import Loader from '../../components/Loader.js';
import {FONTS} from '../../../conts/theme.js';
import cache from '../../../utils/constants/cache.js';
import storage from '../../../utils/constants/storage.js';
import mmkv from '../../../utils/constants/mmkv/index.js';
import {capitalizeFirstLetter} from '../../navigator/DrawerContent.js';
import NewPickerComponent from '../../components/NewPickerComponent.js';
import {useMemo} from 'react';
//import {TempOrderData} from '../../../conts/Data.js';

const pickerItemsOrders = [
  {label: 'All Orders', value: 'All Orders'},
  {label: 'Upcoming Order', value: 'Upcoming Order'},
  {label: 'Past Orders', value: 'Past Orders'},
];

const OrderList = ({navigation}) => {
  const [category, setCategory] = useState('All Orders');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  // const [orderList, setOrderList] = useState();
  const [upcomingOrderList, setUpcomingOrderList] = useState([]);
  const [pastOrderList, setPastOrderList] = useState([]);
  const [sellerOrders, setSellerOrders] = useState();
  //const {initialState} = useContext(AuthContext);
  //console.log('initialState', initialState);

  // useEffect(() => {
  //   // getOrderDetails();
  //   getSellerOrderDetails();
  // }, []);

  const getSellerOrderDetails = async () => {
    setLoading(true);

    const url = `${commonUrl.sellerOrders}${id}`;

    const storageData = mmkv.getTemp(url);
    console.log('storageData', storageData);

    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        mmkv.storeTemp(url, result.data);

        var sortedList = result.data
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();

        setSellerOrders(sortedList);
        // setOrderList(sortedList);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingOrder = async () => {
    setLoading(true);
    const url = `${commonUrl.sellerOrders}${id}&&order_status2=processing&order_status=pending`;
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        var sortedList = result.data
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();

        setSellerOrders(sortedList);
        // setOrderList(sortedList);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPastOrders = async () => {
    setLoading(true);
    const url = `${commonUrl.sellerOrders}${id}&order_status2=complete&order_status=canceled`;
    // const storageData = mmkv.getTemp(url);
    // console.log('storageData', storageData);

    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        //mmkv.storeTemp(url, result.data);
        var sortedList = result.data
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();
        setSellerOrders(sortedList);
        // setOrderList(sortedList);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (category == null) {
      getSellerOrderDetails();
    }
    if (category == 'All Orders') {
      getSellerOrderDetails();
    }
    if (category == 'Upcoming Order') getUpcomingOrder();
    if (category == 'Past Orders') getPastOrders();
  }, [category]);

  const orderList = useMemo(() => {
    return sellerOrders?.filter(order =>
      order.magepro_name.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [sellerOrders, search]);

  const {email} = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
  const {id} = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

  const getOrderDetails = async () => {
    setLoading(true);
    const url = `${commonUrl.getOrderList}${email}`;
    const storageData = mmkv.getTemp(url);
    console.log('storageData', storageData);
    if (storageData == null) {
      console.log(`api call orderList`);
      try {
        let result = await createGet({
          tokenType: 'admin',
          url: url,
        });
        if (result.status === 200) {
          mmkv.storeTemp(url, result.data);
          setOrderList(result?.data?.items);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        Toast.show({
          text1: `${error?.response?.data?.message}`,
          type: 'error',
        });
      }
    } else {
      setOrderList(storageData?.items);
      setLoading(false);
      console.log(`mmkv orderList`);
    }
  };

  console.log('sellerOrders', sellerOrders);
  console.log('orderList', orderList);

  const renderItem = ({item}) => {
    console.log('item', item);
    const orderData = item.created_at.split(' ')[0];
    const d = new Date(orderData);

    const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
    const mo = new Intl.DateTimeFormat('en', {month: 'short'}).format(d);
    const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);

    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderDetails', {item: item})}>
          <ProductCard
            image={{uri: item.magepro_name.product_image}}
            name={capitalizeFirstLetter(item?.magepro_name?.name)}
            price={`aed ${parseFloat(
              item?.purchased_actual_seller_amount,
            ).toFixed(2)}`}
            isSimple={capitalizeFirstLetter(item?.status)}
            order={`#OD-${item?.magerealorder_id}`}
            date={`${da} ${mo} ${ye}`}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderOrderData = () => {
    return (
      <FlatList
        data={orderList}
        renderItem={renderItem}
        keyExtractor={item => `${item.invoice_id}+${item.order_id}`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={{height: calcH(0.245)}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <View style={styles.subContainer}>
          <SearchBox
            placeholder={strings.SEARCH}
            keyboardType="web-search"
            value={search}
            onChangeText={setSearch}
          />
          <View style={styles.pickerContainer}>
            <Text style={{fontSize: 11}}>
              {`${strings.TOTAL} ${sellerOrders?.length || 0} ${
                strings.ORDERS_AVAILABLE
              }.`}
            </Text>
            <View style={styles.pickerItem}>
              {/* <PickerComponent
                pickerData={category}
                setPickerData={setCategory}
                mapData={TempCategory}
              /> */}
              <NewPickerComponent
                value={category}
                onValueChange={setCategory}
                items={pickerItemsOrders}
                key={i => `${i}`}
              />
            </View>
          </View>
          {orderList?.length > 0 ? (
            renderOrderData()
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '85%',
              }}>
              <Text style={styles.noOrderText}>No orders...</Text>
            </View>
          )}
        </View>
      )}
      {/* <FloatingButton /> */}
    </SafeAreaView>
  );
};

export default OrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginHorizontal: calcW(0.04),
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pickerItem: {
    borderWidth: 1,
    borderColor: COLORS.header_color,
    width: '50%',
    height: calcH(0.05),
    justifyContent: 'center',
  },
  noOrderText: {
    ...FONTS.Poppins_med,
    fontSize: fSize(25),
    color: COLORS.Profile_font_color,
  },
});
