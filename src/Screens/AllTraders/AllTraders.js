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
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';
import Device, { isTablet } from 'react-native-device-info';
import {FONTS} from '../../Component/Common/Fonts'

const { width, height } = Dimensions.get('window');

export default function AllTraders({ navigation }) {
    useEffect(() => {
        const isTablet = Device.isTablet();
        // console.log('isTablet', isTablet)
        if (isTablet == true) {
            setIsTablet(true)
        }
        setLoder(true);
        selectedLng()
        info();
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
        // console.warn("selected Language data==>>>", lngData)
    }

    const [loder, setLoder] = useState(false);
    const [data, setdata] = useState([]);
    const [search, setSearch] = useState('');
    const [img, setimg] = useState('');
    const [path, setPath] = useState('');
    const [issTablet, setIsTablet] = useState(false)

    info = () => {
        GetRequest('getTradersList', undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                // console.warn('Traders==================>', response[0].alltraders_data);
                setimg(response[0].banner.banner_image);
                setdata(response[0].alltraders_data);
                setPath(response[0].avatar_media_url)
            })
            .catch(error => {
                console.log('info error => ', error);
            });
    };

    searchdata = (e) => {
        setSearch(e)

        GetRequest(`getTradersList?seller_name=${e}`, undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                // console.warn('searchdata', response[0]);
                setimg(response[0].banner.banner_image);
                setdata(response[0].alltraders_data);
                setPath(response[0].avatar_media_url)
            })
            .catch(error => {
                console.log('searchdata err => ', error);
            });
    };


    return (
        <View style={styles.container}>
            <Header title={strings.SELLER_LIST} navigation={navigation} icon="arrowleft" />
            <View style={{ marginHorizontal: 30, }}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { }} style={{ borderRadius: 10, marginTop: 15 }}>
                        <Image source={{ uri: img }} style={{ width: width / 1.07, height: 80, borderRadius: 5 }} resizeMode='cover' />
                    </TouchableOpacity>

                    <Input
                        placeholder={strings.SEARCH_SELLERS}
                        value={search}
                        placeholderTextColor="#676767"
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        containerStyle={{ paddingHorizontal: 0, marginTop: 15, borderColor: "#676767", borderWidth: 1, width: width / 1.07 }}
                        inputStyle={{ fontSize: 16, fontFamily: "Roboto-Regular", textAlign: I18nManager.isRTL ? 'right' : 'left', }}
                        leftIconContainerStyle={{ marginLeft: 15, marginRight: 5, padding: 0 }}
                        errorStyle={{ display: "none" }}
                        leftIcon={<TouchableOpacity><Ionicons style={{ color: '#676767', fontSize: 20 }} name={'search'} solid /></TouchableOpacity>}
                        onChangeText={(e) => searchdata(e)}
                    />
                </View>
                <ScrollView style={{ width: width / 1.07, alignSelf: 'center', marginTop: 15, marginBottom: 230 }}>
                    {data.length == 0
                        ?
                        <View style={{ alignItems: 'center', marginTop: 150 }}>
                            <Text style={{ fontSize: 18, color: '#000' }}>{strings.NO_SELLER}</Text>
                        </View>
                        :
                        <FlatList
                            data={data}
                            renderItem={({ item, index }) => {
                                return (
                                    <TouchableOpacity onPress={() => { navigation.navigate('TradersProduct', { id: item.entity_id, url: item.shop_url }) }}>
                                        <View style={{ marginVertical: 5, flexDirection: 'row', borderWidth: 1, paddingVertical: 15, paddingHorizontal: 10 }}>
                                            <View>
                                                <Image
                                                    source={{
                                                        uri: item.logo_pic
                                                            ? `${path}${item.logo_pic}`
                                                            : `${path}noimage.png`,
                                                    }}
                                                    resizeMode="contain"
                                                    style={{ width: 50, height: 40, borderRadius: 1 }}
                                                />
                                            </View>

                                            <View style={{ marginLeft: 15, width: width / 1.7 }}>
                                                <Text numberOfLines={1} style={{ fontSize: 17, color: '#000',fontFamily:"Roboto", fontWeight: 'bold', }}>{item.name}</Text>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <Text numberOfLines={1} style={{ fontSize: 12, marginTop: 2, color: '#000',  flexDirection: 'row', justifyContent: 'space-between',}}>{item.total_product_count}</Text>
                                                    <Text numberOfLines={1} style={{ fontSize: 12, marginTop: 2, color: '#000',flexDirection: 'row', justifyContent: 'space-between', }}>{' '}{strings.TOTAL_PRO}</Text>
                                                </View>
                                            </View>

                                            <View style={{ marginLeft: issTablet == true ? width / 5 : 15, justifyContent: 'center', right: 0 }}>
                                                <Ionicons style={{ color: '#676767', fontSize: 17, }} name={'chevron-forward-sharp'} solid />
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                        />
                    }
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
