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
  StyleSheet,
} from 'react-native';
import Button from '../../components/Button';
import {useDrawerStatus} from '@react-navigation/drawer';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {SearchBox} from '../../components';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';
import {createGet} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import Loader from '../../components/Loader';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';
import {Input} from '@rneui/themed';
import FloatingButton from '../../components/FloatingButton.js';

function ReviewScreen({navigation}) {
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [productList, setProductList] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(200);
  const [loading, setLoading] = React.useState(true);
  const [languagedata, setlngdata] = React.useState('');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    selectedLng();

    // getProductList();
  }, [isDrawerOpen]);

  const selectedLng = async () => {
    const lngData = await getLng();
    if (!!lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      setlngdata(lngData);
      await I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      setlngdata(lngData);
      await I18nManager.forceRTL(true);
    }
    setLoading(false);
    console.log('selected Language data==>>>', lngData);
  };

  const getProductList = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: commonUrl.productlist,
      });
      if (result.data) {
        console.log(result.data.total_count);
        await setProductList(result.data.items);
        await setTotalCount(result.data.total_count);
        await setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.message);
    }
  };

  const validate = () => {
    console.log(productList);
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <View style={styles.subContainer}>
          <Input
            placeholder="Search by Name / ID"
            value={search}
            placeholderTextColor="#676767"
            inputContainerStyle={{borderBottomWidth: 0}}
            containerStyle={{
              paddingHorizontal: 0,
              marginTop: 15,
              borderColor: '#676767',
              borderRadius: 5,
              borderWidth: 1,
            }}
            inputStyle={{fontSize: 16, fontFamily: 'Roboto-Regular'}}
            leftIconContainerStyle={{
              marginLeft: 15,
              marginRight: 5,
              padding: 0,
            }}
            errorStyle={{display: 'none'}}
            leftIcon={
              <TouchableOpacity>
                <Ionicons
                  style={{color: '#676767', fontSize: 20}}
                  name={'search'}
                  solid
                />
              </TouchableOpacity>
            }
            onChangeText={e => setSearch(e)}
          />
          {/* <View style={styles.searchContainer}>
              <SearchBox
              // onPress={()=>navigation.navigate('SearchScreen')}
              />
            </View> */}
          <Text style={styles.totalproductText}>
            {strings.TOTAL} {totalCount} {strings.PRODUCT_ARE_AVALIABLE}
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scrollViewConatiner}>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4F4F54',
                  padding: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/image1.png')}
                    style={{width: 50, height: 60}}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#5A5A5F',
                        fontWeight: 'bold',
                      }}>
                      Silk Blend Saree
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
                      aed98
                    </Text>
                    <Text style={{fontSize: 14, color: '#4F4F54'}}>
                      #OD- 4594123126-N
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="eye-outline"
                    color="#5A5A5F"
                    size={20}
                    solid
                  />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>200</Text>
                  <EvilIcons name="star" color="#5A5A5F" size={20} solid />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>4.3</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4F4F54',
                  padding: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/image2.png')}
                    style={{width: 50, height: 60}}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#5A5A5F',
                        fontWeight: 'bold',
                      }}>
                      Silk Blend Saree
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
                      aed98
                    </Text>
                    <Text style={{fontSize: 14, color: '#4F4F54'}}>
                      #OD- 4594123126-N
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="eye-outline"
                    color="#5A5A5F"
                    size={20}
                    solid
                  />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>200</Text>
                  <EvilIcons name="star" color="#5A5A5F" size={20} solid />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>4.3</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4F4F54',
                  padding: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/image3.png')}
                    style={{width: 50, height: 60}}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#5A5A5F',
                        fontWeight: 'bold',
                      }}>
                      Silk Blend Saree
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
                      aed98
                    </Text>
                    <Text style={{fontSize: 14, color: '#4F4F54'}}>
                      #OD- 4594123126-N
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="eye-outline"
                    color="#5A5A5F"
                    size={20}
                    solid
                  />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>200</Text>
                  <EvilIcons name="star" color="#5A5A5F" size={20} solid />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>4.3</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4F4F54',
                  padding: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/image4.png')}
                    style={{width: 50, height: 60}}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#5A5A5F',
                        fontWeight: 'bold',
                      }}>
                      Silk Blend Saree
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
                      aed98
                    </Text>
                    <Text style={{fontSize: 14, color: '#4F4F54'}}>
                      #OD- 4594123126-N
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="eye-outline"
                    color="#5A5A5F"
                    size={20}
                    solid
                  />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>200</Text>
                  <EvilIcons name="star" color="#5A5A5F" size={20} solid />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>4.3</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: '#4F4F54',
                  padding: 10,
                  justifyContent: 'space-between',
                  marginBottom: 10,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../../assets/image5.png')}
                    style={{width: 50, height: 60}}
                  />
                  <View style={{marginLeft: 15}}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: '#5A5A5F',
                        fontWeight: 'bold',
                      }}>
                      Silk Blend Saree
                    </Text>
                    <Text
                      style={{fontSize: 14, color: '#000', fontWeight: 'bold'}}>
                      aed98
                    </Text>
                    <Text style={{fontSize: 14, color: '#4F4F54'}}>
                      #OD- 4594123126-N
                    </Text>
                  </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Ionicons
                    name="eye-outline"
                    color="#5A5A5F"
                    size={20}
                    solid
                  />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>200</Text>
                  <EvilIcons name="star" color="#5A5A5F" size={20} solid />
                  <Text style={{fontSize: 14, color: '#5A5A5F'}}>4.3</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      )}
      <FloatingButton containerStyle={{bottom: 90}} />
    </SafeAreaView>
  );
}

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: {
    marginHorizontal: calcW(0.04),
    position: 'relative',
  },
  searchContainer: {
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  totalproductText: {
    marginTop: calcH(0.02),
    color: STYLES.PRIMARY_COLOR,
    fontSize: 12,
    marginBottom: calcH(0.02),
    fontFamily: 'OpenSans-Regular',
  },
  scrollViewConatiner: {
    // maxHeight: calcH(0.58)
    height: calcH(0.58),
    // marginBottom: calcH(0.2)
  },
  createProductContainer: {
    alignItems: 'flex-end',
    marginTop: calcH(0.022),
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  card: {
    width: calcW(0.92),
    height: calcH(0.1),
    backgroundColor: '#ffffff',
    marginTop: calcH(0.01),
    borderWidth: 1,
  },
  cardSubcontainer: {
    marginHorizontal: calcW(0.02),
    marginTop: calcH(0.01),
    flexDirection: 'row',
  },
  cardLeft: {
    width: calcW(0.1),
  },
  cardMiddle: {
    width: calcW(0.53),
  },
  cardRight: {
    width: calcW(0.2),
    alignItems: 'flex-end',
    marginTop: calcH(0.025),
  },
  leftImaContainer: {
    width: calcW(0.1),
    height: calcW(0.1),
    borderRadius: calcW(0.01),
  },
  leftImg: {
    width: calcW(0.125),
    height: calcW(0.15),
  },
  cardMiddleContainer: {
    marginHorizontal: calcW(0.05),
  },
  middleTopText: {
    fontSize: 16,
    color: STYLES.PRIMARY_COLOR,
  },
  middleBottomtext: {
    fontSize: 12,
    color: STYLES.PRIMARY_COLOR,
    fontWeight: '500',
    paddingTop: calcH(0.002),
  },
  lastBottomtext: {
    fontSize: 10,
    color: STYLES.PRIMARY_COLOR,
    paddingTop: calcH(0.002),
  },
});
