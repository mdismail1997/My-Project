import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
    FlatList,
    Alert,
    I18nManager
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { Input } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { InteractionManager } from 'react-native';
import { setPath } from 'react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import Device, { isTablet } from 'react-native-device-info';

const { width, height } = Dimensions.get('window');

export default function TradersProduct(props) {
    useEffect(() => {
        const isTablet = Device.isTablet();
        console.warn('isTablet', isTablet)
        if (isTablet == true) {
            setIsTablet(true)
        }
        console.warn('props', props)
        setLoder(true);
        selectedLng()
        info();
        getreviews()

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
        setLoder(false)
        console.warn("selected Language data==>>>", lngData)
    }

    const [loder, setLoder] = useState(false);
    const [data, setdata] = useState([]);
    const [search, setSearch] = useState('');
    const [img, setimg] = useState('');
    const [path, setPath] = useState('');
    const [issTablet, setIsTablet] = useState(false)

    info = () => {
        GetRequest(`getTraderProductList?seller_id=${props.route.params.id}`, undefined, {}, 'admin')
            .then(response => {
               
                console.warn('fbdskj', response[0].product_data);
                // setimg(response[0].banner.banner_image);
                setLoder(false);
                setdata(response[0].product_data);
                // setPath(response[0].avatar_media_url)
            })
            .catch(error => {
                console.warn('info error => ', error);
                setLoder(false);
            });
    };

    getreviews = () => {
        GetRequest(`getTraderProductList?mpapi/sellers/me/review?seller_id=${props.route.params.id}`, undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                console.warn('getreviewsgetreviewsgetreviews', response);
                // setimg(response[0].banner.banner_image);
                // setdata(response);
                // setPath(response[0].avatar_media_url)
            })
            .catch(error => {
                console.warn('getreviewsgetreviews error => ', error);
            });
    };

    searchdata = (e) => {
        setSearch(e)

        GetRequest(`getTradersList?seller_name=${e}`, undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                console.warn('searchdata', response[0]);
                setimg(response[0].banner.banner_image);
                setdata(response[0].alltraders_data);
                setPath(response[0].avatar_media_url)
            })
            .catch(error => {
                console.warn('searchdata err => ', error);
            });
    };


    return (
        <View style={styles.container}>
            <Header title={strings.PRO_LIST} navigation={props.navigation} icon="arrowleft" />
            <View style={{ marginHorizontal: 30, }}>
                {/* <View style={{ alignItems: 'center' }}>
                    <Input
                        placeholder='Search sellers by shop name here...'
                        value={search}
                        placeholderTextColor="#676767"
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginTop: 15, borderColor: "#676767", borderWidth: 1, width: width / 1.07 }}
                        inputStyle={{ fontSize: 16, fontFamily: "Roboto-Regular" }}
                        leftIconContainerStyle={{ marginLeft: 15, marginRight: 5, padding: 0 }}
                        errorStyle={{ display: "none" }}
                        leftIcon={<TouchableOpacity><Ionicons style={{ color: '#676767', fontSize: 20 }} name={'search'} solid /></TouchableOpacity>}
                        onChangeText={(e) => searchdata(e)}
                    />
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                    <View>
                        <Text style={{}}>{strings.TOTAL} {data.length} {data.length == 1 ? strings.PRODUCT : strings.PRODUCTS}</Text>
                    </View>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('TradersReviews', { id: props.route.params.id, url: props.route.params.url }) }}>
                        <Text style={{ color: 'red' }}>{strings.VENDORS_REVIEWS}</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{ width: width / 1.07, alignSelf: 'center', marginTop: 0, marginBottom: 100 }}>
                    {/* {data.length == 0
                        ?
                        <View style={{ alignItems: 'center', marginTop: 150 }}>
                            <Text style={{ fontSize: 18 }}>No products : (</Text>
                        </View>
                        : */}
                    <View style={{ alignItems: 'center' }}>
                        <FlatList
                            data={data}
                            renderItem={({ item, index }) => {
                                // console.warn('iii', item)
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            props.navigation.navigate('ProductDetails', {
                                                fromScreen: 'TradersProduct',
                                                id: item.id,
                                                image: item.image_url,
                                                name: item.sku,
                                                // description: description,
                                                price: item.minimal_price,
                                                sku: item.sku,
                                            });
                                        }}
                                        style={[
                                            {
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: 10,
                                                width: issTablet == true ? width / 2.3 : width / 2.4,
                                                marginVertical: 20,
                                                // marginRight: Platform.OS == 'ios' ? 40 : 15,
                                                marginHorizontal: issTablet == true ? 20 : 10,
                                                elevation: 5
                                            },
                                        ]}>
                                        <Image
                                            source={{
                                                uri: item.image_url
                                                    ? `${item.image_url}`
                                                    : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                                            }}
                                            resizeMode="cover"
                                            style={{ width: width / 3, height: height / 8, alignSelf: 'center', borderRadius: 10, margin: 10 }}
                                        />
                                        <View
                                            style={{
                                                paddingHorizontal: 5,
                                                paddingVertical: 5,
                                            }}>
                                            <View style={{ flex: 1, paddingRight: 5, paddingVertical: 5 }}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        color: '#000',
                                                        fontSize: 14,
                                                        fontFamily: 'Roboto-Bold',
                                                    }}>
                                                    {item.sku}
                                                </Text>

                                            </View>
                                            <View style={{ flex: 1, }}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={{
                                                        color: '#676767',
                                                        fontSize: 12,
                                                        fontFamily: 'Roboto-Regular',
                                                        fontWeight: 'bold'
                                                    }}>
                                                    {strings.AED} {item.minimal_price ? parseInt(item.minimal_price).toFixed(0) : item.minimal_price}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            numColumns={2}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    {/* } */}
                </ScrollView>
            </View>

            {loder && <Loder />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
});
