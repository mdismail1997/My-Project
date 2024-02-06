import {
  View,
  Text,
  FlatList,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  I18nManager,
  Dimensions
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header/Header';
import { Input } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Loder from '../../Component/Common/Lodar';
import { GetRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import Device, { isTablet } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [loder, setLoder] = useState(false);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [name, setname] = useState('');
  const [data, setData] = useState([]);
  const [nosearch, setnosearch] = useState(false);
  const [issTablet, setIsTablet] = useState(false)

  useEffect(() => {
    setLoder(true);
    selectedLng();
    getDetails();
    // setTimeout(() => {
    //     setLoder(true)
    // }, 3000);
    const isTablet = Device.isTablet();
    // console.warn('isTablet', isTablet)
    if (isTablet == true) {
      setIsTablet(true)
    }
  }, []);

  const selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    // setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }

  const getDetails = id => {
    setLoder(true);
    GetRequest(`products?searchCriteria=`, undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        console.warn("Product details responce => ", res.items.length);
        setname(res.name);
        setPrice(res.price);
        setData(res.items);
      })

      .catch(error => {
        setLoder(false);
        // console.warn("Product details error => ", error);
      });
  };

  const searchFilterFunction = (e) => {
    setLoder(true);
    GetRequest(
      `products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&searchCriteria[filter_groups][0][filters][1][field]=name&searchCriteria[filter_groups][0][filters][1][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][1][condition_type]=like`,
      undefined,
      {},
      'admin',
    )
      .then(res => {
        // console.warn('search1111111111', res);
        // setval(true)
       
        if (res.items.length == 0) {
          // alert('No product found')

          setnosearch(true);
          setSearch(e);
        } else {
          let d = [];
          // setData(res.items)
          res.items.map(item => {
            // if (item.visibility !== 1) {
            //   d.push(item);
            // }

            if ((item.visibility == 2) && item.status == 1) {
              d.push(item)

          }
          if ((item.visibility == 3) && item.status == 1) {
              d.push(item)

          }
          if ((item.visibility == 4) && item.status == 1) {
              d.push(item)
          }



           
          });
          setnosearch(false);
          setData(d);
        }
        setLoder(false);
        // console.warn('dataaaaaa', d);
      })

      .catch(error => {
        setLoder(false);
        console.log('Get All Products error => ', error);
      });
  };

  const renderItem = item => {
    let img = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'image') {
          img = item.value;
        }
      });
    }
    let description1 = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'meta_description') {
          description1 = item.value;
        }
      });
    }
    // console.warn('item', item)
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetails',
              {
                id: item.item.id,
                image: img,
                name: item.item.name,
                description: description1,
                price: item.item.price,
                sku: item.item.sku,
              })

          }>
          <View
            style={[
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                width: issTablet == true ? width / 2.5 : width / 2.5,
                marginVertical: 15,
                // marginRight: 15,
                marginHorizontal: issTablet == true ? 20 : 10,
                elevation: 5,
                alignItems: 'center',
                padding: 10
              },
            ]}>
            {/* {item.item.custom_attributes.map((item) => {
                        if (item.attribute_code == 'image') {
                            const img = item.value
                            setImage(item.value)
                            return ( */}
            <Image
              source={{
                uri: img
                  ? `https://traders-platform.com/pub/media/catalog/product${img}`
                  : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              }}
              resizeMode="cover"
              style={{ width: issTablet == true ? width / 2.6 : width / 2.5, height: height / 7, }}
            />
            {/* )
                        }
                    })} */}
            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View style={{ paddingRight: 5, paddingVertical: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {item.item.name}
                </Text>

                {item.item.custom_attributes.map(item => {
                  if (item.attribute_code == 'meta_description') {
                    const description = item.value;
                    return (
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#676767',
                          fontSize: 12,
                          fontFamily: 'Roboto-Regular',
                        }}>
                        {description}
                      </Text>
                    );
                  }
                })}
              </View>
              <View style={{ alignItems: 'flex-end', paddingVertical: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 12,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {item.item.number}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView SafeAreaView style={styles.container}>
      {loder && <Loder />}
      <Header title={strings.SEARCH} navigation={navigation} icon="arrowleft" />
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <>
            <Input
              placeholder={strings.SEARCH}
              placeholderTextColor="#676767"
              inputContainerStyle={{ borderBottomWidth: 0 }}
              containerStyle={{
                width: width / 1.13,
                paddingHorizontal: 0,
                marginTop: 15,
                borderColor: '#5A5A5F',
                borderWidth: 1,
              }}
              inputStyle={{ fontSize: 16, fontFamily: 'Roboto-Regular', textAlign: I18nManager.isRTL ? 'right' : 'left', }}
              leftIconContainerStyle={{
                marginLeft: 15,
                marginRight: 5,
                padding: 0,
              }}
              errorStyle={{ display: 'none' }}
              leftIcon={
                <TouchableOpacity>
                  <Ionicons
                    style={{ color: '#676767', fontSize: 20 }}
                    name={'search'}
                    solid
                  />
                </TouchableOpacity>
              }
              onChangeText={e => searchFilterFunction(e)}
            />
          </>
          {/* <View style={{ marginLeft: 5, borderWidth: 1, borderColor: '#676767', padding: 10, marginTop: 15, width: 55, borderColor: '#5A5A5F' }}>
                        <TouchableOpacity onPress={() => navigation.navigate('Filter', { navigation: navigation })}><Image source={require('../../Assets/filter.png')} style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 5 }} /></TouchableOpacity>
                    </View> */}
        </View>
        <ScrollView>
          <Text
            style={{
              fontSize: 17,
              marginTop: 15,
              color: '#5A5A5F',
              fontFamily: 'Roboto-Regular',
              fontWeight: '600',
            }}>
            {strings.SHOW_RESULT}
          </Text>
          <Text
            style={{
              fontSize: 11,
              marginTop: 5,
              color: '#828287',
              fontFamily: 'Roboto-Regular',
              fontWeight: '400',
            }}>
            {strings.MORE_THAN} {data.length - 10}+  {strings.PRODUCT_ARE_AVALIABLE}
          </Text>
          {/* <ScrollView horizontal>
                    <View style={{ borderWidth: 1, borderColor: '#5A5A5F', marginBottom: 50, marginTop: 15, width: 70, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 13, color: '#5A5A5F', }}>Fashion</Text>
                    </View>
                    <View style={{ marginLeft: 10, borderWidth: 1, borderColor: '#5A5A5F', marginBottom: 25, marginTop: 15, width: 80, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 13, color: '#5A5A5F', }}>Silk Blend</Text>
                    </View>
                    <View style={{ marginLeft: 10, borderWidth: 1, borderColor: '#5A5A5F', marginBottom: 25, marginTop: 15, width: 80, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 13, color: '#5A5A5F', }}>$0 - $100</Text>
                    </View>
                    <View style={{ marginLeft: 10, borderWidth: 1, borderColor: '#5A5A5F', marginBottom: 25, marginTop: 15, width: 130, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 13, color: '#5A5A5F', }}>Price-Low to high</Text>
                    </View>
                    <View style={{ marginLeft: 10, borderWidth: 1, borderColor: '#5A5A5F', marginBottom: 25, marginTop: 15, width: 100, height: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ alignSelf: 'center', fontSize: 13, color: '#5A5A5F', }}>Size-small</Text>
                    </View>
                </ScrollView> */}
          {nosearch == true ? (
            <View style={{ alignItems: 'center', marginTop: 150 }}>
              <Text style={{ fontSize: 18, color: '#000' }}>{strings.NO_PRODUCTS}</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center' }}>
              <FlatList
                data={data}
                numColumns={2}
                keyExtractor={(item, index) => item.id}
                renderItem={item => renderItem(item)}
                scrollEnabled={true}
              />
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
