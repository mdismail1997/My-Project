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
import axios from 'axios';
import { getUserToken } from '../../utils/DataStore';
import { retrieveData } from '../../utils/AsyncStore';



const CardAdd = props => {
  const approveData = useSelector(state => state.Job.approveData);
  const isLoading = useSelector(state => state.Job.isLoading);



  const dispatch = useDispatch();
  const onDismissSnackBar = () => setShowmodal(false);
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = useState('');
  const [showmodal, setShowmodal] = useState(false);
  const [cardInfo, setCardInfo] = useState(null);
  const [Loading, setLoading] = useState(false);


  const publishableKey = "pk_test_qqTpgy8pQK3sVJmZIqxSHNho"


  const fetchCardDetails = (cardDetails) => {
    if (cardDetails.complete) {
      setCardInfo(cardDetails);
    } else {
      setCardInfo(null);
    }
  }



  const paymentHandle = async () => {
    if (!!cardInfo) {
      setLoading(true)
      var resToken = await createToken({ ...cardInfo, type: "Card" })
      var userToken = await retrieveData('USER_TOKEN')
      // console.log("........................",resToken.token.id)
      // console.log("........................",userToken)
      // stripeData = {
      //   card_token: resToken.token.id,
      // }
      // console.log("777777777777", stripeData.card_token.token.id);
    }

    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/bank/update_card`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      data: {
        card_token: resToken.token.id
      }


    };

    axios(config)
      .then(async (response) => {
        console.log("............", response)
        if (response.status == 200) {
          //console.log("............",response.data);
          Alert.alert("Card added successfully!")
          setLoading(false)
          props.navigation.goBack()

        } else {
          Alert.alert("Fail to add card details!")
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
        <Header {...props} title={'Add Card Details'} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 12 }}>


            <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "space-around", }}>
              <View style={{ height: "50%", width: "95%", alignItems: "center", justifyContent: "center", marginTop: wp(50) }}>
                <StripeProvider
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
                      fontSize:hp(18),
                      placeholderColor:'#A9A9A9'
                    }}
                    CardFieldMultiLine={true}
                    style={{
                      width: '100%',
                      height: wp(150),
                    }}
                    onCardChange={(cardDetails) => {
                      fetchCardDetails(cardDetails);
                    }}

                  />
                </StripeProvider>
              </View>

              <TouchableOpacity
                style={{
                  height: hp(40),
                  backgroundColor: !cardInfo === true ? "gray" : COLORS.YELLOW_GREEN,
                  width: '80%',
                  borderRadius: 8,
                  marginTop: hp(35),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={!cardInfo}
                textStyle={{ color: COLORS.WHITE }}
                onPress={() => paymentHandle()}>
                <Text style={{ color: "#FFFFFF", fontFamily: "Poppins-SemiBold", fontSize: 18, fontWeight: "500" }}>
                  Add
                </Text>
              </TouchableOpacity>


            </View>






            {/* </Card> */}
            {/* {showmodal ? (
              <>
                <Snackbar
                  visible={showmodal}
                  onDismiss={onDismissSnackBar}
                  style={{ marginBottom: 62 }}
                  action={{
                    label: 'Undo',
                    onPress: () => {
                      // Do something
                    },
                  }}>
                  {message}
                </Snackbar>
              </>
            ) : null} */}
          </View>



        </ScrollView>
        {Loading && <Loader />}
      </SafeAreaView>
    </Provider>
  );
};

export default CardAdd;

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
    marginTop: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
