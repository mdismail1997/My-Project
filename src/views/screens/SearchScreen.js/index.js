import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {SearchBox} from '../../components/index.js';

import styles from './style.js';
import {SafeAreaView} from 'react-native';
import strings from '../../components/lng/LocalizedStrings.js';
import Loader from '../../components/Loader';
import Toast from 'react-native-toast-message';
import {BASE_URL} from '../../../utils/constants/API/commonUrl.js';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import {calcH, fSize, IMAGE_PATH} from '../../../utils/constants/common.js';
import ProductCard from '../../components/ProductCard.js';
import {FlatList} from 'react-native';
import {TouchableOpacity} from 'react-native';

//const url = `${BASE_URL}products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&searchCriteria[filter_groups][0][filters][1][field]=name&searchCriteria[filter_groups][0][filters][1][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][1][condition_type]=like`

const SearchScreen = ({navigation}) => {
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [productList, setProductList] = React.useState([]);

  const url = `${BASE_URL}products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25${search}%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&searchCriteria[filter_groups][0][filters][1][field]=name&searchCriteria[filter_groups][0][filters][1][value]=%25${search}%25&searchCriteria[filter_groups][0][filters][1][condition_type]=like`;

  const searchProductList = async () => {
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
       // console.log('result.data', result.data);
        setProductList([...result.data.items]);
      }
    } catch (error) {
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
    }
  };

  React.useEffect(() => {
    if (search.length === 0) setProductList([]);
    const timer = setInterval(() => {
      if (search.length > 2) searchProductList();
    }, 3000);
    return () => clearInterval(timer);
  }, [search]);

  const renderProductList = () => {
    return (
      <>
        <FlatList
          data={productList}
          renderItem={renderItem}
          keyExtractor={(item, index) => `${item.id}${index.toString()}`}
          //   onEndReached={() => setPage(page + 1)}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          //contentContainerStyle={{paddingBottom: 30}}
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
    //console.log('obj', obj);
    
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('editProduct', {sku: item?.sku, from: 'Home'})
          }>
          <ProductCard
            image={{uri: `${IMAGE_PATH.PRODUCT_PATH}${obj}`}}
            name={item?.name}
            price={`aed ${parseFloat(item?.price).toFixed(2)}`}
            order={`#ID-${item?.id}`}
            // date={`${da} ${mo} ${ye}`}
            languagedata={'en'}
            key={(item,index)=> `${item.id}-${index}`}
          />
        </TouchableOpacity>
      </View>
    );
  };

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
            autoFocus={true}
          />
          {/* {renderProductList()} */}
          {productList?.length > 0 ? (
            renderProductList()
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                height: '85%',
              }}>
              <Text style={styles.noOrderText}>{strings.NO_PRODUCTS} </Text>
              <Text style={[styles.noOrderText, {fontSize: fSize(10)}]}>
                {strings.TYPE_MORE_THAN_2_CHARACTERS}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </>
  );
};

export default SearchScreen;
