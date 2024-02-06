import {
    View,
    Text,
    FlatList,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    Image,
    I18nManager
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Component/Header/Header';
import Loder from '../../Component/Common/Lodar';
import { GetRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import Device from 'react-native-device-info';
import { ScrollView } from 'react-native-gesture-handler';
const { width, height } = Dimensions.get('window');

export default function ProductsPage({ navigation }) {
    const [search, setSearch] = useState('');
    const [loder, setLoder] = useState(false);
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [name, setname] = useState('');
    const [data, setData] = useState([]);
    const [nosearch, setnosearch] = useState(false);
    const [issTablet, setIsTablet] = useState(false);

    const [page, setPage] = useState(1)
    const [totalproduct, setTotalProduct] = useState('')


    useEffect(() => {
        const isTablet = Device.isTablet();
        console.warn('isTablet', isTablet)
        if (isTablet == true) {
            setIsTablet(true)
        }
        // setLoder(true);
        selectedLng()
        getDetails();
        // setTimeout(() => {
        //     setLoder(true)
        // }, 3000);
    }, []);

    selectedLng = async () => {
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
        console.warn("selected Language data==>>>", lngData)
    }

   
    const getDetails = id => {
        setLoder(true);
        // GetRequest(`products?searchCriteria=`, undefined, {}, 'admin')
        GetRequest(`products?searchCriteria[currentPage]=1&searchCriteria[pageSize]=6`, undefined, {}, 'admin')
            .then(res => {
                
                console.warn("Product details responce => ", res.items.length);
                setTotalProduct(res.items.length)
                setname(res.name);
                setPrice(res.price);
                setData(res.items);
                setLoder(false);
                
            })

            .catch(error => {
                setLoder(false);
                // console.warn("Product details error => ", error);
            });
    };

    const getSecondDetails = id => {
        // setLoder(true);
        // GetRequest(`products?searchCriteria=`, undefined, {}, 'admin')
        GetRequest(`products?searchCriteria[currentPage]=${page}&searchCriteria[pageSize]=6`, undefined, {}, 'admin')
            .then(res => {
                
                console.warn("Product details responce => ", res.items.length);
                setname(res.name);
                setPrice(res.price);
                setData([...data,...res.items]);
                setLoder(false);
                setPage(page+1)
            })

            .catch(error => {
                setLoder(false);
                // console.warn("Product details error => ", error);
            });
    };
   

    const searchFilterFunction = e => {
        GetRequest(
            `products?searchCriteria[filter_groups][0][filters][0][field]=name&searchCriteria[filter_groups][0][filters][0][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][0][condition_type]=like&searchCriteria[filter_groups][0][filters][1][field]=name&searchCriteria[filter_groups][0][filters][1][value]=%25${e}%25&searchCriteria[filter_groups][0][filters][1][condition_type]=like`,
            undefined,
            {},
            'admin',
        )
            .then(res => {
                console.warn('searchhhhhhhhhhhhhhhhhhhhhhhhhhhhh', res);
                // setval(true)
                if (res.items.length == 0) {
                    // alert('No product found')

                    setnosearch(true);
                    setSearch(e);
                } else {
                    let d = [];
                    // setData(res.items)
                    res.items.map(item => {
                        if (item.visibility !== 1) {
                            d.push(item);
                        }
                    });
                    setnosearch(false);
                    setData(d);
                }
                console.warn('dataaaaaa', data);
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
                                width: issTablet == true ? width / 2.15 : width / 2.4,
                                marginVertical: 15,
                                marginRight: 15,
                                elevation: 5
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
                            resizeMode="contain"
                            style={{ width: issTablet == true ? width / 2 : width / 2.5, height: issTablet == true ? height / 5 : height / 6 }}
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

    const loadMore = () => {
        console.log('======loadMore=>');
        getSecondDetails(page);
      };

    return (
        <SafeAreaView SafeAreaView style={styles.container}>
            {loder && <Loder />}
            <Header title={strings.PRODUCTS} navigation={navigation} icon="arrowleft" />
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                    {/* <>
              <Input
                placeholder="Search"
                placeholderTextColor="#676767"
                inputContainerStyle={{ borderBottomWidth: 0 }}
                containerStyle={{
                  width: 325,
                  paddingHorizontal: 0,
                  marginTop: 15,
                  borderColor: '#5A5A5F',
                  borderWidth: 1,
                }}
                inputStyle={{ fontSize: 16, fontFamily: 'Roboto-Regular' }}
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
            </> */}
                    {/* <View style={{ marginLeft: 5, borderWidth: 1, borderColor: '#676767', padding: 10, marginTop: 15, width: 55, borderColor: '#5A5A5F' }}>
                          <TouchableOpacity onPress={() => navigation.navigate('Filter', { navigation: navigation })}><Image source={require('../../Assets/filter.png')} style={{ width: 20, height: 20, alignSelf: 'center', marginTop: 5 }} /></TouchableOpacity>
                      </View> */}
                </View>

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
                    {strings.MORE_THAN} {data.length}  {strings.PRODUCT_ARE_AVALIABLE}
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
                        <Text style={{ fontSize: 18, color: '#000' }}>No products : (</Text>
                    </View>
                ) : (
                    <View style={{width:'100%',height:height*0.83,}}>
                    <FlatList
                    data={data}
                    numColumns={2}
                    keyExtractor={(item, index) => item.id}
                    renderItem={item => renderItem(item)}
                    scrollEnabled={true}
                    onEndReachedThreshold ={2}
                    onEndReached={loadMore}


                    />
                  </View>
                )}
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
