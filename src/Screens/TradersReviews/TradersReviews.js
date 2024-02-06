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
    Modal,
    Pressable,
    TextInput,
    I18nManager
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { Rating, Input } from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import { InteractionManager } from 'react-native';
import { setPath } from 'react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation';
import { ProgressBar, Colors } from 'react-native-paper';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
} from '@react-native-google-signin/google-signin';

const { width, height } = Dimensions.get('window');
const windowWidth = Dimensions.get('window').width;

export default function TradersReviews(props) {
    useEffect(() => {
        console.warn('props', props)
        setLoder(true);
        selectedLng()
        info();
        getreviews();
        profileData()
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
    const [data1, setdata] = useState([]);
    const [search, setSearch] = useState('');
    const [img, setimg] = useState('');
    const [path, setPath] = useState('');
    const [modalShow, setmodalShow] = useState(false);
    const [nickname, setnickname] = useState('');
    const [Summary, setsummary] = useState('');
    const [review1, setreview1] = useState('');
    const [review2, setreview2] = useState('');
    const [review3, setreview3] = useState('');
    const [review, setreview] = useState('');
    const [id, setBuyerID] = useState('');
    const [mail, setBuyerMail] = useState('');
    const [value, setValueRate] = useState('');
    const [price, setPriceRate] = useState('');
    const [quality, setQualityRate] = useState('');

    const profileData = () => {
        setLoder(true);
        GetRequest('customers/me/', undefined, {}, 'self')
            .then(res => {
                setLoder(false);
                // console.warn('Profile responce => ', res);
                setBuyerID(res.id)
                setBuyerMail(res.email)
            })
            .catch(error => {
                setLoder(false);
                if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
                    Alert.alert(strings.SESSION, '', [
                        { text: '' },
                        {
                            text: strings.OK,
                            onPress: () => {
                                logout2();
                            },
                        },
                    ])
                }
                console.warn('Profile error => ', error.response);

            });
    };

    const logout2 = async () => {
        setLoder(true)
        setTimeout(async () => {
            setLoder(false)

            props.navigation.navigate('signin');
            await AsyncStorage.removeItem('traderToken');
            await GoogleSignin.revokeAccess();
            await GoogleSignin.signOut();
        }, 2000);

    };

    info = () => {
        GetRequest(`mpapi/sellers/me/review?seller_id=${props.route.params.id}`, undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                console.warn('gettttt revie', response);
                if (response.length !== 0) {
                    setdata(response);


                    let price1 = []
                    response.map((item) => {
                        price1.push(item.feed_price)
                    })

                    let count = 0;
                    for (var i = 0; i < price1.length; i++) {
                        count += parseInt(price1[i]);
                    }
                    let x = count / response.length
                    setPriceRate(x)

                    let value1 = []
                    response.map((item) => {
                        value1.push(item.feed_value)
                    })

                    let count1 = 0;
                    for (var i = 0; i < value1.length; i++) {
                        count1 += parseInt(value1[i]);
                    }
                    let x1 = count1 / response.length
                    setValueRate(x1)

                    let quality1 = []
                    response.map((item) => {
                        quality1.push(item.feed_quality)
                    })

                    let count2 = 0;
                    for (var i = 0; i < quality1.length; i++) {
                        count2 += parseInt(quality1[i]);
                    }
                    let x2 = count2 / response.length
                    setQualityRate(x2)

                    console.warn(price / 100)
                }
            })
            .catch(error => {
                console.warn('gettttt revies err => ', error);
            });
    };
    // https://magento.mydevfactory.com/backup_tradersplatform/rest/V1/mpapi/sellers/me/review?seller_id=14200

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

    ratingCompleted1 = rating => {
        setreview1(rating * 10);
        // console.warn('Rating is:1 ', rating);
    };

    ratingCompleted2 = rating => {
        setreview2(rating * 10);
        // console.warn('Rating is:2 ', rating);
    };

    ratingCompleted3 = rating => {
        setreview3(rating * 10);
        // console.warn('Rating is:3 ', rating);
    };


    const addReview = async () => {

        setLoder(true);
        const senddata = {
            data: {
                buyer_id: id,
                buyer_email: mail,
                seller_id: props.route.params.id,
                shop_url: props.route.params.url,
                feed_price: review3,
                feed_value: review2,
                feed_quality: review1,
                feed_nickname: nickname,
                feed_summary: Summary,
                feed_review: review

            },
        };

        await PostRequest(`setSellerReview`, senddata, {}, 'admin')
            .then(res => {
                setLoder(false);
                console.warn('reviews ', res);
                Alert.alert(res, '', [
                    { text: strings.CANCEL },
                    { text: strings.OK, onPress: () => setmodalShow(!modalShow) },
                ]);
            })
            .catch(error => {
                setLoder(false);
                Alert.alert(strings.REVIEW_SUBMIT_FAILED, '', [
                    { text: strings.CANCEL },
                    { text: strings.OK },
                ]);
            });
    };

    const checkForReview = async () => {

        setLoder(true);
        const senddata = {
            data: {
                buyer_id: id,
                seller_id: props.route.params.id
            }
        };
        await PostRequest(`sellerReviewValid`, senddata, {}, 'admin')
            .then(res => {
                setLoder(false);
                console.warn('reviews ', res);
                if (res == true) {
                    setmodalShow(!modalShow)
                } else {
                    Alert.alert(res, '', [
                        { text: strings.CANCEL },
                        { text: strings.OK },
                    ]);
                }
            })
            .catch(error => {
                // console.warn(error.response);
                setLoder(false);
                Alert.alert(strings.REVIEW_ERR, '', [
                    { text: strings.CANCEL },
                    { text: strings.OK },
                ]);
            });
    };



    return (
        <View style={styles.container}>
            <Header title={strings.VENDORS_REVIEWS} navigation={props.navigation} icon="arrowleft" />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalShow}
                onRequestClose={() => setmodalShow(!modalShow)}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Pressable
                            onPress={() => setmodalShow(!modalShow)}
                            style={{ marginHorizontal: 10, alignSelf: 'flex-end' }}>
                            <Feather name="x" color={'#000'} size={30} solid />
                        </Pressable>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: '#676767',
                                    fontSize: 17,
                                    fontFamily: 'Roboto-Regular',
                                }}>
                                {strings.YOUAREREVIEWING}
                            </Text>
                            <Text
                                numberOfLines={1}
                                style={{
                                    color: '#676767',
                                    fontSize: 17,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {props.route.params.sku}
                            </Text>
                            <Text
                                style={{
                                    marginTop: 20,
                                    color: '#676767',
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {strings.YOURRATING}
                            </Text>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text
                                    style={{
                                        color: '#676767',
                                        fontSize: 15,
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                    }}>
                                    {strings.QUANTITY}
                                </Text>
                                <View style={{ marginLeft: 20 }}>
                                    <Rating
                                        type="custom"
                                        ratingColor="#e95f42"
                                        ratingBackgroundColor="#ddd"
                                        tintColor="#FFF"
                                        // fractions={1.1}
                                        startingValue={0}
                                        imageSize={20}
                                        onFinishRating={ratingCompleted1}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text
                                    style={{
                                        color: '#676767',
                                        fontSize: 15,
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                    }}>
                                    {strings.VALUE}
                                </Text>
                                <View style={{ marginLeft: 20 }}>
                                    <Rating
                                        type="custom"
                                        ratingColor="#e95f42"
                                        ratingBackgroundColor="#ddd"
                                        tintColor="#FFF"
                                        // fractions={1.1}
                                        startingValue={0}
                                        imageSize={20}
                                        onFinishRating={ratingCompleted2}
                                    />
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                <Text
                                    style={{
                                        color: '#676767',
                                        fontSize: 15,
                                        fontFamily: 'Roboto-Regular',
                                        fontWeight: 'bold',
                                    }}>
                                    {strings.PRICE}
                                </Text>
                                <View style={{ marginLeft: 20 }}>
                                    <Rating
                                        type="custom"
                                        ratingColor="#e95f42"
                                        ratingBackgroundColor="#ddd"
                                        tintColor="#FFF"
                                        // fractions={1.1}
                                        startingValue={0}
                                        imageSize={20}
                                        onFinishRating={ratingCompleted3}
                                    />
                                </View>
                            </View>

                            <Text
                                style={{
                                    marginTop: 20,
                                    color: '#676767',
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {strings.NICKNAME}
                            </Text>
                            <Input
                                value={nickname}
                                inputContainerStyle={{
                                    borderBottomWidth: 0.3,
                                    marginTop: 5,
                                    borderColor: '#676767',
                                    borderWidth: 0.3,
                                }}
                                containerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={{
                                    fontSize: 16,
                                    fontFamily: 'Roboto-Regular',
                                    paddingVertical: -1,
                                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                                }}
                                errorStyle={{ display: 'none' }}
                                onChangeText={e => {
                                    setnickname(e);
                                }}
                            />

                            <Text
                                style={{
                                    marginTop: 20,
                                    color: '#676767',
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {strings.SUMMARY}
                            </Text>
                            <Input
                                value={Summary}
                                inputContainerStyle={{
                                    borderBottomWidth: 0.3,
                                    marginTop: 5,
                                    borderColor: '#676767',
                                    borderWidth: 0.3,
                                }}
                                containerStyle={{ paddingHorizontal: 0 }}
                                inputStyle={{
                                    fontSize: 16,
                                    fontFamily: 'Roboto-Regular',
                                    paddingVertical: -1,
                                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                                }}
                                errorStyle={{ display: 'none' }}
                                onChangeText={e => {
                                    setsummary(e);
                                }}
                            />

                            <Text
                                style={{
                                    marginTop: 20,
                                    color: '#676767',
                                    fontSize: 15,
                                    fontFamily: 'Roboto-Regular',
                                    fontWeight: 'bold',
                                }}>
                                {strings.REVIEW2}
                            </Text>

                            <TextInput
                                value={review}
                                multiline={true}
                                numberOfLines={10}
                                onChangeText={text => setreview(text)}
                                style={{
                                    textAlignVertical: "top",
                                    borderBottomWidth: 0.3,
                                    marginTop: 5,
                                    borderColor: '#676767',
                                    color: "#000",
                                    borderWidth: 0.3,
                                    height: 100,
                                    width: windowWidth - 90,
                                    textAlign: I18nManager.isRTL ? 'right' : 'left',
                                }}

                            />

                            <TouchableOpacity
                                style={{ width: 150, alignSelf: 'center' }}
                                onPress={() => addReview()}>
                                <View
                                    style={{
                                        backgroundColor: '#676767',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        borderRadius: 5,
                                        marginVertical: 10,
                                        paddingVertical: 7,
                                    }}>
                                    <Text
                                        style={{
                                            color: '#fff',
                                            fontSize: 15,
                                            fontFamily: 'Roboto-Regular',
                                            letterSpacing: 2,
                                            fontWeight: 'bold',
                                        }}>
                                        {strings.SUBMITREVIEW}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{ marginHorizontal: 30, }}>
                {/* <View style={{ marginTop: 15, alignItems: 'center' }}> */}
                <View style={{ marginTop: 15 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Entypo style={{ color: '#000', fontSize: 25, alignSelf: 'center' }} name={'star'} solid />
                        <Text style={{ color: '#000', marginTop: 3, fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginLeft: 2 }}>
                            {data1.length !== 0 ? (((price / 10) + (value / 10) + (quality / 10)) * 5 / 15).toFixed(1) : '0'}
                        </Text>
                    </View>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{strings.AVG_RATE} ({data1.length !== 0 ? data1.length : '0'})</Text>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, alignSelf: 'center' }}>{data1.length !== 0 ? (((price / 10) + (value / 10) + (quality / 10)) * 100 / 15).toFixed(0) : '0'}{strings.POSITIVE_FB}</Text>
                </View>
                <TouchableOpacity onPress={() => { checkForReview() }} style={{ borderBottomWidth: 1, paddingBottom: 20 }}>
                    <Text style={{ color: '#fff', borderWidth: 1, padding: 10, backgroundColor: '#0000ff', alignSelf: 'center', marginTop: 15 }}>{strings.WRITE_REVIEW}</Text>
                </TouchableOpacity>
                {/* </View> */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-around',
                        height: 110,
                    }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Entypo style={{ color: '#000', fontSize: 25, alignSelf: 'center' }} name={'star'} solid />
                            <Text style={{ color: '#000', marginTop: 3, fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginLeft: 2 }}>
                                {data1.length !== 0 ? ((price / 10)).toFixed(1) : '0'}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 3, fontSize: 12 }}>{strings.AVG_PRICE_RATE}</Text>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Rating
                            type="custom"
                            ratingColor="#e95f42"
                            ratingBackgroundColor="#ddd"
                            tintColor="#FFF"
                            // fractions={1.1}
                            startingValue={data1.length !== 0 ? (price / 10) : 0}
                            imageSize={20}
                            readonly
                        />
                    </View>

                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-around',
                        height: 110,
                    }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Entypo style={{ color: '#000', fontSize: 25, alignSelf: 'center' }} name={'star'} solid />
                            <Text style={{ color: '#000', marginTop: 3, fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginLeft: 2 }}>
                                {data1.length !== 0 ? (value / 10).toFixed(1) : '0'}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 3, fontSize: 12 }}>{strings.AVG_VALUE_RATE}</Text>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Rating
                            type="custom"
                            ratingColor="#e95f42"
                            ratingBackgroundColor="#ddd"
                            tintColor="#FFF"
                            // fractions={1.1}
                            startingValue={data1.length !== 0 ? (value / 10) : 0}
                            imageSize={20}
                            readonly
                        />
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-around',
                        height: 110,
                    }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Entypo style={{ color: '#000', fontSize: 25, alignSelf: 'center' }} name={'star'} solid />
                            <Text style={{ color: '#000', marginTop: 3, fontSize: 25, fontWeight: 'bold', alignSelf: 'center', marginLeft: 2 }}>
                                {data1.length !== 0 ? (quality / 10).toFixed(1) : '0'}
                            </Text>
                        </View>
                        <Text style={{ marginTop: 3, fontSize: 12 }}>{strings.AVG_QUALITY_RATE}</Text>
                    </View>
                    <View style={{ alignSelf: 'center' }}>
                        <Rating
                            type="custom"
                            ratingColor="#e95f42"
                            ratingBackgroundColor="#ddd"
                            tintColor="#FFF"
                            // fractions={1.1}
                            startingValue={data1.length !== 0 ? (quality / 10) : 0}
                            imageSize={20}
                            readonly
                        />
                    </View>
                </View>
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
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: windowWidth - 50,
        backgroundColor: '#fff',
        paddingVertical: 20,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
});
