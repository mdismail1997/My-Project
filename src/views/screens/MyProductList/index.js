import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert
} from 'react-native';
import React from 'react';

import Toast from 'react-native-toast-message';

import * as commonUrl from '../../../utils/constants/API/commonUrl.js';
import Loader from '../../components/Loader.js';
import styles from './style.js';
import mmkv from '../../../utils/constants/mmkv/index.js';
import {calcH, STORAGE_KEY} from '../../../utils/constants/common.js';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import {SearchBox} from '../../components/index.js';
import strings from '../../components/lng/LocalizedStrings.js';
import ProductCard from '../../components/ProductCard.js';
import FloatingButton from '../../components/FloatingButton.js';
import {capitalizeFirstLetter} from '../../navigator/DrawerContent.js';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import {FloatingAction} from 'react-native-floating-action';
import icons from '../../../conts/icons.js';
import COLORS from '../../../conts/colors.js';
import axios from 'axios';

const actions = [
  {
    text: 'Add Simple Products',
    icon: icons.image4,
    name: 'addProduct',
    position: 2,
  },
  {
    text: 'Add Configurable Products',
    icon: icons.order,
    name: 'addProduct2',
    position: 1,
  },
];

const MyProductList = ({navigation}) => {
  const [loading, setLoading] = React.useState(true);
  const [myProducts, setMyProducts] = React.useState(null);
  const [searchedProd, setSearchedProd] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  // const [sellorInformation, setSellorIformation] = React.useState('');
  const [SellorIformation, setSellorIformation] = React.useState(0);
  const {id} = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
//console.warn("kkkkkkkkkkkkkkkkk",id)
  React.useEffect(() => {
    getMyProductList();
    PostSellorInfo(id);
  }, []);

  React.useEffect(() => {
    if (search.length > 0) {
      const searchedProducts = myProducts.filter(product =>
        product.product_name.toLowerCase().includes(search.toLowerCase()),
      );
      setSearchedProd(searchedProducts);
    } else {
      setSearchedProd(myProducts);
    }
  }, [search]);

  const getMyProductList = React.useCallback(async () => {
    setLoading(true);
    const url = `${commonUrl.getSellerOrders}${id}`;
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        var sortedList = result?.data
          .sort((a, b) => {
            return (
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
            );
          })
          .reverse();

        setMyProducts(sortedList);
        setSearchedProd(sortedList);
        //console.log('result.data', result.data);
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
  }, [getMyProductList]);

  //console.log('result.data', SellorIformation);
  const renderMyProducts = () => {
    let data;

    return (
      <>
        <FlatList
          data={searchedProd}
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
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('editProduct', {sku: item?.product_sku})
          }>
          <ProductCard
            image={{uri: item?.thumbnail_url}}
            name={capitalizeFirstLetter(item?.product_name)}
            price={`AED ${parseFloat(item?.product_price).toFixed(2)}`}
            order={`#ID-${item?.product_id}`}
            isSimple={capitalizeFirstLetter(item?.product_type)}
          />
        </TouchableOpacity>
      </View>
    );
  };


  const PostSellorInfo = async (id) => {
    //setLoder(true);
    // console.log('vvvvvvvvvvvvvvvvvvv', email);
    var ACCESS_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4';
    const data = {
      sellerid: {
          seller_id: id
  
      }
    
  
  }

    console.log('Post sellor info data', data);
    await axios({
      method: 'POST',
      url: 'https://traders-platform.com/rest/V1/mpapi/sellers/me/sellerinfo',
      headers: {
        authorization: `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      data: data,
    })
      .then(res => {
        //setLoder(false);
        console.log('Post sellor info data respone =====', res.data[0].is_seller);

        if (res.data[0].is_seller == '0') {
          setSellorIformation(res.data[0].is_seller)
          Toast.show({
            text1: `Upload your documents to become a seller.`,
            text2: 'your document has been pending',
            type: 'error',
            topOffset: 50,
          });
        } else if (res.data[0].is_seller== '1'){

        setSellorIformation(res.data[0].is_seller)
        Toast.show({
          text1: `Document approved`,
          text2: 'Document approved sussesfully',
          //type: 'error',
          topOffset: 50,
        })
      }
        else if(res.data[0].is_seller == '2') {
          setSellorIformation(res.data[0].is_seller)
          Toast.show({
            text1: `Your Document in Processing`,
            text2: 'Seller in Processing.',
            type: 'error',
            topOffset: 50,
          });

          
        }
        else{
          console.log("nothing else")
        }


        
      })
      .catch(error => {
        //setLoder(false);
        console.log('Post sellor info error => ', error);
        Alert.alert(
          'Enter Your Details',
          'At first register your Details',
          [{text: 'OK', onPress: () => props.navigation.replace('RegisterScreen')}],
        );
      });
  };




  const seller = mmkv.get(STORAGE_KEY.isSeller);
//console.warn("sellloooorrr",seller)
  return (
    <>
      <SafeAreaView style={styles.container}>
        {loading && <Loader visible={loading} />}
        <View style={styles.subContainer}>
          <SearchBox
            placeholder={`${strings.SEARCH_BY} ${strings.NAME}`}
            icon="search"
            keyboardType="web-search"
            value={search}
            onChangeText={setSearch}
          />

          {/* {searchedProd?.length > 0 && renderMyProducts()} */}
          {searchedProd?.length == '0' ?(
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '85%',
              }}>
              <Text style={styles.noOrderText}>
              {`Upload your documents to get verified, Then you can create products.`}
              </Text>
              <Text style={styles.noOrderText}></Text>
            </View>
          ):
          (
            renderMyProducts()
          )
          
        }
        </View>
        {SellorIformation == '1' ? (
          <>
             <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '85%',
              }}>
              <Text style={styles.noOrderText}>{`No Products. Add some`}</Text>
              <Text style={styles.noOrderText}></Text>
            </View>

            <View style={{position: 'absolute', bottom: calcH(0.07), right: -10}}>
            <FloatingAction
              color={COLORS.header_color}
              buttonSize={50}
              actions={actions}
              onPressItem={name => {
                navigation.navigate(name);
              }}
            />
          </View>
          </>
        ) : ( null
          
         
         
        )}
      </SafeAreaView>
    </>
  );
};

export default MyProductList;
