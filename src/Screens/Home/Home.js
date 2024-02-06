import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  I18nManager,
  Platform,

} from 'react-native';
import FastImage from 'react-native-fast-image';
import React, { useEffect, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks'
import axios from 'axios';
import Header from '../../Component/Header/Header';
import { Input } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import { FlatList } from 'react-native-gesture-handler';
import TrendingCollection from '../../Component/Collections/TrendingCollection';
import Loder from '../../Component/Common/Lodar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductBar from '../../Component/ProductBar/ProductBar';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Device, { isTablet } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');
const  Width  = Dimensions.get('window').width;
const  Height  = Dimensions.get('window').height;

export default function Home({ navigation }) {

  useEffect(() => {
    const isTablet = Device.isTablet();
    // console.warn('isTablet', isTablet)
    if (isTablet == true) {
      setIsTablet(true)
    }
    selectedLng();
    setLoder(true);
    getCartToken();
    getLocation()
    getbar();
    profileData2();
    getbanners();
    // allProducts();
    trendingCollection();
    cartItemDetails();
    const unsubscribe = navigation.addListener('focus', () => {
      const isTablet = Device.isTablet();
      // console.warn('isTablet', isTablet)
      if (isTablet == true) {
        setIsTablet(true)
      }
      selectedLng();
      setLoder(true);
      getCartToken();
      getLocation()
      getbar();
      profileData2();
      getbanners();
      // allProducts();
      trendingCollection();
      cartItemDetails();
    });

    return unsubscribe;
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
    setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }

  const getLocation = () => {
    GetRequest('location', undefined, {}, 'admin')
      .then(async res => {
        setLoder(false);
        // console.warn('Get location => ', res[0].current_code);
        await AsyncStorage.setItem('currentLocation', `${res[0].current_code}`);

      })
      .catch(error => {
        setLoder(false);
        console.log('Get location error => ', error);
      });
  };

  const getCartToken = async () => {
    setLoder(true);

    PostRequest('carts/mine', {}, {}, 'self')
      .then(async res => {
        setLoder(false);
        // console.warn("res ", res);
        await AsyncStorage.setItem('cartToken', `${res}`);
      })
      .catch(error => {
        setLoder(false);
        // console.warn("cart err ", error);
      });
  };

  const getbanners = () => {
    setLoder(true);

    GetRequest(`banner/`, undefined, {}, 'admin')
      .then(res => {
        // console.warn('bfdskjhfs', res);
        setLoder(false);
        setBannerData(res[0]);
      })
      .catch(error => {
        console.log('fhdhlsdhfudshufkhudshfsd', error.response);
        setLoder(false);
      });
  };

  // const profileData = () => {
  //   setLoder(true);
  //   GetRequest('categories/51/products', undefined, {}, 'admin')
  //     .then(res => {
  //       setLoder(false);

  //       // console.warn('setttttttttttttttt => ', res);
  //       setData(res);
  //     })
  //     .catch(error => {
  //       setLoder(false);

  //       console.log("Profile error => ", error);
  //     });
  // };

  

  const profileData2 = () => {
    setLoder(true);

    GetRequest('categories/45/products', undefined, {}, 'admin')
      .then(res => {
        setLoder(false);

        // console.warn("Profile responce => ", res);
        setData2(res);
      })
      .catch(error => {
        setLoder(false);

        console.log("Profile error => ", error);
      });
  };

  const allProducts = () => {
    GetRequest('products?searchCriteria=', undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.warn("===============> ", res);
        if (res.items.length > 0) {
          let fiterdCategories = res.items.filter(items => {
            if (items.status == 2) {
            } else if (items.visibility == 4 || items.status == 1) {
              let x = false;
              items?.custom_attributes?.map(values => {
                if (values?.attribute_code == 'category_ids') {
                  let arr = [];
                  // console.warn('each', values.value)
                  values?.value.forEach(element => {
                    if (element == 51) {
                      x = true;
                    }
                  });
                }
              });
              return x;
            }
          });
          // console.warn('fiterdCategories', fiterdCategories)
          setData(fiterdCategories);
        }
      })
      .catch(error => {
        setLoder(false);
        console.log('Get All Products error => ', error.response);
      });
  };
  const trendingCollection = async() =>{
    setLoder(true);
    // let AccessToken = await AsyncStorage.getItem('traderToken');
    let AccessToken = 'xdd48grne8e5keewy39cncxue0w0nhb4';
    console.log("gggggggggggggggggggg",AccessToken)
    // GetRequest('https://traders-platform.com/rest/V1/categories/51/products', undefined, {}, 'self')
    await axios({
      method: 'GET',
      url: `https://traders-platform.com/rest/all/V1/products?searchCriteria[currentPage]=1&searchCriteria[pageSize]=10&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=51`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(res => {
        setLoder(false);
        // console.warn('trending collection=======>', res.data.items);
        setData(res.data.items);
        // if (res) {
        //   let fiterdCategories = res.items.filter(items => {
        //      if (items.visibility == 4 || items.status == 1) {
        //       let x = false;
        //       return x;
        //     }
        //   });
        //   // console.warn('fiterdCategories', fiterdCategories)
        //   setData(fiterdCategories);
        // }



      })
      .catch(error => {
        setLoder(false);
        console.log('trending collection error=> ', error.response);
      });

  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false)
      navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

  const cartItemDetails = async () => {
    // console.warn('proddddddddd', AccessToken)

    let AccessToken = await AsyncStorage.getItem('traderToken');

    GetRequest('carts/mine/items', undefined, {}, 'self')
      .then(response => {
        // console.warn('res', response)
      })
      .catch(error => {
        console.log('Profile data error => ', error.response);
        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert('', strings.SESSION, [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                logout2();
              },
            },
          ])
        }
      });


    
  };
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [search, setSearch] = useState('');
  const [loder, setLoder] = useState(false);
  const [banner, setBannerData] = useState([]);
  const [proBar, setProBar] = useState([]);
  const [issTablet, setIsTablet] = useState(false)

  const getbar = () => {
    setLoder(true);

    GetRequest(`categories`, undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.warn('catttttttttttt', res.children_data);
        setProBar(res.children_data);
      })

      .catch(error => {
        setLoder(false);
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
    let description = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'meta_description') {
          description = item.value;
        }
      });
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductDetails', {
              fromScreen: 'Trendingcollection',
              id: item.item.id,
              image: img,
              name: item.item.name,
              description: description,
              price: item.item.price,
              sku: item.item.sku,
            });
          }}
        >
          <View style={[
            {
              backgroundColor: '#FFFFFF',
              borderRadius: 10,
              width: issTablet == true ? width / 2.2 : width / 2.4,
              marginVertical: 20,
              // marginRight: Platform.OS == 'ios' ? 40 : 0,
              marginHorizontal: 10,
              elevation: 2,
              alignItems: 'center'
            },
          ]}>
            <Image
              source={{
                uri: img
                  ? `https://traders-platform.com/pub/media/catalog/product${img}`
                  : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              }}
              
              resizeMode="cover"
              style={{ width: 150, height: 130, borderRadius: 10 }}
            />
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
                    width: issTablet == true ? width / 3 : width / 6,
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {item.item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 12,
                    width: issTablet == true ? width / 3 : width / 6,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {description}
                </Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', paddingVertical: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 12,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  AED {item.item.price}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      // <TrendingCollection navigation={navigation} item={item} />
    );
  };




  // useEffect(() => {

  //   const backAction = () => {
  //     Alert.alert("Hold on!", "Are you sure you want to go back?", [
  //       {
  //         text: "Cancel",
  //         onPress: () => null,
  //         style: "cancel"
  //       },
  //       { text: "YES", onPress: () => BackHandler.exitApp() }
  //     ]);
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);



  return (
    <View style={styles.container}>
      <Header title={strings.HOME} navigation={navigation} icon="menu" />

      <View style={{ paddingHorizontal: 10 }}>
        <ScrollView showsVerticalScrollIndicator={false} >
          <View style={{ marginTop: -100 }}>
            <FlatList
              data={proBar}
              renderItem={({ item, index }) => {
                // console.warn('oitemmmmmm', item)
                return (
                  <View style={{ marginVertical: 5 }}>
                    {item.is_active == true ?
                      <>
                        <View style={{ flex: 1 }}>
                          <ProductBar item={item} navigation={navigation} />
                        </View>
                        <View style={{ position: 'absolute', marginTop: 35, alignSelf: 'center', padding: 5, elevation: 5, backgroundColor: '#5A5A5F', borderRadius: 10 }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: '#fff',
                              fontFamily: 'OpenSans-Regular',
                              fontSize: 13,
                              // backfaceVisibility: 'visible',
                            }}>
                            {item.name.toUpperCase()}
                          </Text>
                        </View>
                      </>
                      :
                      null}
                  </View>

                );
              }}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View style={{ marginBottom: Platform.OS == 'ios' ? 90 : 50 }}>
            <Text
              style={{
                marginTop: 30,
                color: '#5A5A5F',
                fontFamily: 'Roboto-Bold',
                fontSize: 20,
              }}>
              {strings.TREND_COLL}
            </Text>
            <View style={{ alignItems: 'center' }}>
              <FlatList
                data={data}
                // horizontal
                numColumns={2}
                keyExtractor={(item, index) => item.id}
                renderItem={item => renderItem(item)}
                scrollEnabled={true}
              />
            </View>
          </View>
          {/* </View> */}
          {/* <Text style={{ color: "#5A5A5F", fontFamily: "Roboto-Bold", fontSize: 20 }}>Watches and Jewelery</Text> */}

          {/* <FlatList
            data={data2}
            horizontal
            // numColumns={2}
            keyExtractor={(item, index) => item.id}
            renderItem={(item) => renderItem(item)}
            scrollEnabled={true}
          /> */}

          {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 100, marginTop: 20 }}> */}
          {/* <TouchableOpacity onPress={() => {navigation.navigate('AllCategory')}} style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: 100, marginTop: 20 }}> */}
          {/* <Text style={{ color: "#5A5A5F", fontFamily: "Roboto-Bold", fontSize: 20 }}>See all Category</Text>
            <FontAwesome style={{ color: '#5A5A5F', fontSize: 30, marginLeft: 20 }} name={'long-arrow-right'} solid /> */}
          {/* </TouchableOpacity> */}
          {/* </View> */}
        </ScrollView>
      </View >
      {loder && <Loder />
      }
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
