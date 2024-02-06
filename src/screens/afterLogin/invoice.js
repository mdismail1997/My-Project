import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
//import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {allPadding, allRadius, calcH, calcW} from '../../utils/comon';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Evilcons from 'react-native-vector-icons/dist/EvilIcons';
import Hud from '../../utils/hud';
import {BASE_URL} from '../../utils/Api/apiName';

export default function Invoice({navigation, route}) {
  const dataalls = route.params.data;
  console.log('============DataAll================: ', dataalls);
  const [orderId, setOrderId] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [pickupPoint, setPickupPoint] = useState('');
  const [destinationPoint, setDestinationPoint] = useState('');
  const [riderName, setRiderName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [rideCost, setRideCost] = useState(0);
  const [waitingCharge, setWaitingCharge] = useState(0);
  const [stoppageCharge, setStoppageCharge] = useState(0);
  const [tipsCharge, setTipsCharge] = useState(0);
  const [riderph, setRiderph] = useState('');
  const [drivercab, setDrivercab] = useState('');
  const [dueamount,setDueAmount] = useState(0);
  const [refundamount,setRefundAmount] = useState(0);
  const [paiddueamount,setPaidDueAmount] = useState(0);

  
  

  React.useEffect(() => {


    console.log("============Props===========",route.params.data)
    //invoiceGenerate();

    const unsubscribe = navigation.addListener('focus', () => {
      invoiceGenerate();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const invoiceGenerate = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    console.log('huibi', dataalls.booking_id);
    Hud.showHud();
    await axios({
      method: 'GET',
      url: BASE_URL + `invoice?booking_id=${dataalls.booking_id}`,
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log('driver details:::::::::::::::::', response.data);
        Hud.hideHud();
        setPaidDueAmount(response.data.paid_due_amount)
        setRefundAmount(response.data.refunded_amount)
        setDueAmount(response.data.due_amount)
        setOrderId(response.data.booking_details.booking_id);
        setDepartureDate(response.data.booking_details.date_of_departure);
        setPickupPoint(response.data.booking_details.starting_point);
        setDestinationPoint(response.data.booking_details.destination);
        setRideCost(response.data.booking_details.price);
        setRiderName(response.data.booking_details.rider.name);
        setDriverName(response.data.booking_details.driver.name);
        setDrivercab(response.data.booking_details.driver.cab_no);
        setWaitingCharge(dataalls.waitingtimecharge);
        setStoppageCharge(dataalls.stoppageCharge);
        if (response.data.tips !== null) {
          setTipsCharge(response.data.tips[0].tips_amount);
        }
        setRiderName(response.data.booking_details.rider.name);
        setRiderph(response.data.booking_details.rider.cellphone);
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))
      })
      .catch(function (error) {
        console.log(error);
        Hud.hideHud();
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View style={styles.centeredModalView}>
          <View style={styles.childRideView}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  fontSize: RFValue(25),
                  fontWeight: 'bold',
                  color: '#000',
                }}>
                Invoice
              </Text>
              <Image
                style={styles.logoIcon}
                source={require('../../../assets/images/logo.png')}
                resizeMode="contain"
              />
            </View>
            <Text style={{fontWeight: 'bold', color: '#000'}}>
              Order#: {orderId}
            </Text>
            <Text style={{fontWeight: 'bold', color: '#000'}}>
              Date: {departureDate}
            </Text>
            <View style={styles.rideDetails}>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Pick up point</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{pickupPoint}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Destination point</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{destinationPoint}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Total distance</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>
                  {dataalls.distance.toFixed(2)} miles
                </Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Rider Name</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{riderName}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Contact No.</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{riderph}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Vehicle No.</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{drivercab}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Driver Name</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>{driverName}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Last Due Payment</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>$
                {Number(paiddueamount).toFixed(2)}
                    </Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Ride cost</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>${(Number(rideCost)-( Number(tipsCharge) +
                    Number(stoppageCharge) +
                    Number(waitingCharge))).toFixed(2)}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Waiting Time cost</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>${waitingCharge}.00</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Stoppage time cost</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>${stoppageCharge}.00</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Tips</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>
                  ${parseFloat(tipsCharge).toFixed(2)}
                </Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Total Amount</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>
                  $
                  {Number(rideCost).toFixed(2)}
                </Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Add-Cancellation charges</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>$0.00</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>less discount</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>0%</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftfinalText}>Net Amount</Text>
                <Text style={styles.colonfinaltext}>:</Text>
                <Text style={styles.rightfinalText}>
                  $
                  {Number(rideCost).toFixed(2)}
                </Text>
              </View>

              <View style={styles.rowStyle}>
                <Text style={styles.leftfinalText}>Actual Payment</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightfinalText}>${Number(rideCost).toFixed(2)}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Due Amount</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>${Number(dueamount).toFixed(2)}</Text>
              </View>
              <View style={styles.rowStyle}>
                <Text style={styles.leftText}>Refunded Amount</Text>
                <Text style={styles.colontext}>:</Text>
                <Text style={styles.rightText}>${Number(refundamount).toFixed(2)}</Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={styles.footerRiderText}>Thank you</Text>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={() => navigation.navigate('TabScreen')}>
                <Image
                  style={styles.arrowIcons}
                  source={require('../../../assets/images/back_arrow.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // padding: allPadding
  },
  childRideView: {
    width: calcW(0.85),
    flex: 1,
    // height: calcH(0.95),
    // margin: calcH(0.45),
    // justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: calcW(0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  logoIcon: {
    //left: calcW(0.24),
    height: calcW(0.2),
    width: calcW(0.25),
    // resizeMode: 'contain',
    // top: calcH(-0.03),
    // right: calcW(0.12),
  },
  rideDetails: {
    flex: 1,
    borderBottomColor: '#a6a6a6',
    borderBottomWidth: 1,
    // backgroundColor: colors.buttonColor
  },

  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftText: {
    textAlign: 'left',
    fontSize: RFValue(14),
    color: '#000',
    fontWeight: 'bold',
    marginBottom: calcH(0.02),
    flex: 5,
  },
  rightText: {
    fontSize: RFValue(14),
    color: '#515354',
    fontWeight: '400',
    marginBottom: calcH(0.02),
    flex: 5,
  },

  leftfinalText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#3165CC',
    fontWeight: '500',
    flex: 5,
  },
  rightfinalText: {
    fontSize: 16,
    color: '#3165CC',
    fontWeight: '500',
    flex: 5,
  },
  footerRiderText: {
    marginTop: calcH(0.04),
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3165CC',
  },

  colontext: {
    color: '#000',
    marginBottom: calcH(0.0175),
    flex: 1,
  },
  colonfinaltext: {
    fontSize: 16,
    color: '#3165CC',
    fontWeight: '500',
    flex: 1,
  },

  arrowContainer: {
    // justifyContent: 'center',
    top: calcH(0.045),
    width: calcW(0.1),
  },
  arrowIcons: {
    width: calcW(0.08),
    height: calcH(0.03),
  },
});
