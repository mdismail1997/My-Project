import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import {
    Card,
    Title,
    Paragraph,
    Button,
    Provider,
    Portal,
    Modal,
    Chip,
    Snackbar,
    TextInput,

} from 'react-native-paper';
import { hp, wp } from '../../utils/ResponsiveLayout';
import moment from 'moment';
import CustomButton from '../../components/CustomButton';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import {
    approveJobAction,
    acceptapproveJobAction,
    clearApproveJobMessageAction,
    startJobAction
} from '../../Redux/actions/JobAction';
import DialogAlert from '../../components/DialogAlert/DialogAlert';
import Loader from '../../components/Loader';
import { approveJob, startJob } from '../../Services/ApiService';
import { useState } from 'react';
import BankInfoCard from '../../components/BankInfoCard';
import { cardDetailsAction } from '../../Redux/actions/JobAction';
import {
    StripeProvider,
    CardForm,
    useStripe,
    initStripe,
    BillingDetails,
    CardField,
    useConfirmPayment,
    createPaymentMethod,
    PaymentSheetError,
    createToken
} from '@stripe/stripe-react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import axios from 'axios';
import { getUserToken } from '../../utils/DataStore';
import { retrieveData } from '../../utils/AsyncStore';



const saveCardPayment = props => {
    const approveData = useSelector(state => state.Job.approveData);
    const isLoading = useSelector(state => state.Job.isLoading);
    const payData = props.route.params.details;

    const cardData = useSelector(state => state.Job.cardData);
    console.log("======cardData===========>>>>>>>>", cardData)


    const dispatch = useDispatch();
    const onDismissSnackBar = () => setShowmodal(false);
    const [visible, setVisible] = React.useState(false);
    const [message, setMessage] = useState('');
    const [showmodal, setShowmodal] = useState(false);
    const [cardInfo, setCardInfo] = useState(null);
    const [Loading, setLoading] = useState(false);
    const [price, setPrice] = useState(0);
    const [modal, setModal] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [description, setDescription] = useState('');
    const [star, setStar] =useState(0);


    const publishableKey = "pk_test_qqTpgy8pQK3sVJmZIqxSHNho"



    useEffect(() => {

        dispatch(cardDetailsAction());

    }, []);


    const fetchCardDetails = (cardDetails) => {
        if (cardDetails.complete) {
            setCardInfo(cardDetails);
        } else {
            setCardInfo(null);
        }
    }

    // console.log("++++++++++++++ppprriiccee",price)

    const paymentHandle = async () => {

        setLoading(true)
        var resToken = await createToken({ ...cardInfo, type: "Card" })
        var userToken = await retrieveData('USER_TOKEN')
        // console.log("........................",resToken.token.id)
        // console.log("........................",userToken)
        // stripeData = {
        //   card_token: resToken.token.id,
        // }
        // console.log("777777777777", stripeData.card_token.token.id);


        let config = {
            method: 'post',
            url: `https://nodeserver.mydevfactory.com:6098/api/bank/transaction`,
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': userToken,
            },
            data: {
                job_id: payData?.item?._id,
                tips: price,

            }




        };

        axios(config)
            .then(async (response) => {
                console.log("............", response)
                if (response.status == 200) {
                    //console.log("............",response.data);
                    //Alert.alert("Success! Payment completed")
                    setLoading(false)
                    setModal(true)
                    // props.navigation.goBack()

                } else {
                    Alert.alert("Failed! Payment not completed")
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }




const submitHandle = async () =>{

    setLoading(true)
    var resToken = await createToken({ ...cardInfo, type: "Card" })
    var userToken = await retrieveData('USER_TOKEN')
    // console.log("........................",resToken.token.id)
    // console.log("........................",userToken)
    // stripeData = {
    //   card_token: resToken.token.id,
    // }
    // console.log("777777777777", stripeData.card_token.token.id);


    let config = {
        method: 'post',
        url: `https://nodeserver.mydevfactory.com:6098/api/users/give-rating`,
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': userToken,
        },
        data: {
            job_id: payData?.item?._id,
            rate: star,
            desc: description,

        }




    };

    axios(config)
        .then(async (response) => {
            console.log("............", response)
            if (response.status == 200) {
                //console.log("............",response.data);
                Alert.alert("Thank you for your feedback !")
                setLoading(false)
                
                 props.navigation.navigate('Home')

            } else {
                Alert.alert("Failed!")
            }
        })
        .catch((error) => {
            console.log(error);
        });

}




    return (
        <Provider>
            <SafeAreaView style={{ backgroundColor: COLORS.WHITE, flex: 1 }}>
                {isLoading && <Loader />}
                <Header {...props} title={'Payment'} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ padding: 12 }}>


                        <View style={{ width: "100%", alignItems: "center", alignSelf: 'center', }}>
                            <View style={{ height: 150, width: "95%", alignItems: "center", justifyContent: "center", marginTop: hp(20) }}>
                                {/* <StripeProvider
                                    publishableKey={publishableKey}
                                    merchantIdentifier="merchant.identifier" // required for Apple Pay
                                    urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
                                >
                                    <CardField
                                        postalCodeEnabled={false}
                                        placeholder={{
                                            number: 'Enter Your Card Number',
                                        }}

                                        cardStyle={{
                                            backgroundColor: COLORS.SILVER_SAND,
                                            textColor: COLORS.DARK_CHARCOAL,
                                            borderRadius: 10,
                                            fontSize: hp(19),
                                            placeholderColor: '#A9A9A9'
                                        }}
                                        CardFieldMultiLine={true}
                                        style={{
                                            width: '100%',
                                            height: 150,
                                        }}
                                        onCardChange={(cardDetails) => {
                                            fetchCardDetails(cardDetails);
                                        }}

                                    />
                                </StripeProvider> */}
                                <BankInfoCard card={cardData ? true : false} cardDetails={cardData} />
                            </View>


                        </View>

                        <View style={{ justifyContent: 'center', flexDirection: 'row', alignItems: 'center', marginTop: hp(15), width: '85%', alignSelf: 'center' }}>
                            <Text style={{ marginRight: '7.5%', fontSize: hp(18), color: COLORS.LAPSI_LAZULI, fontWeight: 'bold', }}>Add Tips</Text>
                            <TextInput
                                mode="outlined"
                                placeholder="0.00"
                                placeholderTextColor={COLORS.DARK_CHARCOAL}
                                style={[styles.inputStyle]}
                                outlineColor={COLORS.LAPSI_LAZULI}
                                activeOutlineColor={COLORS.NICKEL}
                                value={price}
                                onChangeText={text => setPrice(text)}

                                left={<TextInput.Affix text="$" />}
                            />
                        </View>



                        <TouchableOpacity
                            style={{
                                height: hp(40),
                                backgroundColor: COLORS.YELLOW_GREEN,
                                width: '80%',
                                borderRadius: 8,
                                marginTop: hp(35),
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center'
                            }}
                            disabled={false}
                            textStyle={{ color: COLORS.WHITE }}
                            onPress={() => paymentHandle()}>
                            {price != 0 ?
                                <Text style={{ color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 18, fontWeight: "500" }}>
                                    Pay {''} $ {payData?.item?.salary + JSON.parse(price == "" || price == NaN ? 0 : price)}
                                </Text> :
                                <Text style={{ color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 18, fontWeight: "500" }}>
                                    Pay {''} $ {payData?.item?.salary}
                                </Text>
                            }

                        </TouchableOpacity>





                    </View>










                </ScrollView>
                {modal ? (
                    <>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modal}
                        // onRequestClose={() => {
                        //   Alert.alert('Modal has been closed.');
                        //   setModalVisible(!modalVisible);
                        // }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Image
                                        source={require('../../Assets/logo1.png')}
                                        resizeMode={'contain'}
                                    />
                                    <Text style={styles.modalText}>"Success! Payment completed"</Text>
                                    <View
                                        style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        <CustomButton
                                            title="Ok"
                                            onPress={() => setModal2(true)}
                                            //onPress={() => clear()}
                                            //onPress={() => (select === 'social' ? onShare() : clear())}
                                            buttonStyle={styles.button}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : null}








                {modal2 ? (
                    <>
                        <Modal
                            animationType="slide"
                            // transparent={true}
                            visible={modal2}
                        // onRequestClose={hideModal}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView2}>
                                    {/* <TouchableOpacity
                                        onPress={() => setModal(false)}
                                        style={{ position: 'absolute', right: 15, top: 5 }}>
                                        <MIcon
                                            name="close-circle"
                                            color={COLORS.YELLOW_GREEN}
                                            size={wp(28)}
                                        />
                                    </TouchableOpacity> */}





                                    <View style={{ width: '100%', height: wp(50), justifyContent: 'center' }}>
                                        <Text style={styles.modalText2}>Please give a Feedback</Text>
                                    </View>

                                    <View style={{ width: '100%', height: wp(50), justifyContent: 'center' }}>
                                        <Rating
                                            type='star'
                                            ratingCount={5}
                                            imageSize={40}
                                            ratingTextColor={COLORS.YELLOW_GREEN}
                                            style={{ paddingVertical: 10 }}
                                            value={star}
                                            onStartRating={(star)=>setStar(star)}
                                            onSwipeRating={(star)=>setStar(star)}
                                            onFinishRating={(star)=>setStar(star)}
                                            
                                        />

                                    </View>

                                    <View style={{ width: '100%', height: wp(100), justifyContent: 'center' }}>

                                        <TextInput
                                            mode="outlined"
                                            placeholder="Description"
                                            style={[styles.inputStyle2, { marginTop: 0, height: hp(80) }]}
                                            outlineColor={COLORS.NICKEL}
                                            activeOutlineColor={COLORS.NICKEL}
                                            value={description}
                                            onChangeText={text => setDescription(text)}
                                            multiline={true}
                                        // numberOfLines={2}
                                        />

                                    </View>

                                    <View style={{ width: '100%', height: wp(100), justifyContent: 'center' }}>
                                        <CustomButton
                                            title={'SUBMIT'}
                                            buttonStyle={{
                                                padding: 10,
                                                width: '85%',
                                                marginTop: hp(20),

                                            }}
                                            onPress={() => submitHandle()}



                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </>
                ) : null}


            </SafeAreaView>
            {Loading && <Loader />}
        </Provider>
    );
};

export default saveCardPayment;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        alignItems: 'center',
        marginBottom: 25,
        padding: 15,
    },
    jobImage: {
        width: '95%',
        height: hp(195),
        borderRadius: 10,
        marginLeft: 12,
    },
    details: {
        // flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        padding: 2,
        width: '100%',
    },
    buttonContainer: {
        // flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(22),
        marginBottom: 12,
        flex: 1,
        // padding: 12,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 0,
        backgroundColor: 'blue',
    },
    modalView: {
        height: hp(250),
        width: '60%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
    },
    inputStyle: {
        backgroundColor: COLORS.WHITE,
        width: '50%',
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        color: COLORS.BLACK,

    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: hp(15)
    },
    modalText2: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: hp(18),
        color: COLORS.LAPSI_LAZULI,
    },
    button: {
        borderRadius: 10,
        padding: 15,
        elevation: 2,
        marginTop: wp(20)
    },
    modalView2: {
        height: hp(350),
        width: '85%',
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',


    },
    inputStyle2: {
        backgroundColor: COLORS.WHITE,
        marginTop: hp(15),
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        color: COLORS.BLACK,

    },
});
