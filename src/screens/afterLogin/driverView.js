import React, {useState, useEffect, Component, useRef} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  BackHandler,
  Platform,
} from 'react-native';
import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  google_api_key,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import {BarIndicator} from 'react-native-indicators';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {RFValue} from 'react-native-responsive-fontsize';
import MapView, {
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import {localNotificationService} from '../../firebase/PushController';
import {fcmService} from '../../firebase/FcmService';
import reviewFeedback from './reviewFeedback';
import Hud from '../../utils/hud';

export default function DriverView({navigation, route}) {
  const [focusEmail, setFocusEmail] = useState(false);
  const [priceRide, setPriceRide] = useState(0);
  const [pickupLat, setPickupLat] = useState(22.5734368);
  const [pickuplng, setPickUpLng] = useState(88.43056299999999);
  const [destinationlat, setDestinationLat] = useState(22.5734368);
  const [destinationlng, setDestinationLng] = useState(88.4305629);

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const [pickupPlace, setPickupPlace] = useState('');
  const [destinationPlace, setDestinationPlace] = useState('');
  const [verifyCode, setVerifyCode] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [waitingCharge, setWaitingCharge] = useState(0);
  const [duepayment, setDuePayment] = useState(0);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = async () => {
    const data = JSON.parse(await AsyncStorage.getItem('data_ride'));
    const duedata = JSON.parse(await AsyncStorage.getItem('due_amount'));
    console.log('===========Due Amount============', duedata);
    setDuePayment(duedata)
    // console.log('dataaaaaaaaaaaaaaaaa', data.config.data);
    // const due_payment = [];
    // due_payment.push(JSON.parse(duedata));
    // setDuePayment(due_payment[0].due_amount)

    setVerifyCode(data.data.verify_code);
    const ride_data = [];
    ride_data.push(JSON.parse(data.config.data));

    setDestinationPlace(ride_data[0].destination);
    setPickupPlace(ride_data[0].starting_point);
    setPickupLat(ride_data[0].latitude_departure);
    setPickUpLng(ride_data[0].longitude_departure);
    setDestinationLat(ride_data[0].latitude_arrival);
    setDestinationLng(ride_data[0].longitude_arrival);
    setPriceRide(ride_data[0].price);
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token);
    await axios({
      method: 'GET',
      url: 'https://kabou.us/api/rider/waiting-time',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        console.log(JSON.stringify(response.data));

        fetchPrice();
        AsyncStorage.setItem(
          'waiting_time',
          JSON.stringify(response.data.data.value),
        );
        setWaitingTime(response.data.data.value);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const fetchPrice = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token);
    const id = JSON.parse(await AsyncStorage.getItem('car_id'));
    console.log('*******************************', id);
    await axios({
      method: 'GET',
      url: 'https://kabou.us/api/rider/waiting-charge?id=' + id,
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        console.log("======charge==============",response.data);
        setWaitingCharge(response.data.data[0].price);
        AsyncStorage.setItem(
          'waiting_price',
          JSON.stringify(response.data.data[0].price),
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const origin = {latitude: pickupLat, longitude: pickuplng};
  const destinationroute = {
    latitude: destinationlat,
    longitude: destinationlng,
  };
  const GOOGLE_MAPS_APIKEY = google_api_key;
  const mapRef = useRef();
  return (
    <SafeAreaView style={styles.topContainer}>
      <ScrollView
        // contentContainerStyle={{
        //   alignItems: 'center',
        //   flexGrow: 1,
        //   // marginVertical: 30,
        // }}
        showsVerticalScrollIndicator={false}>
        <View style={{alignItems: 'center'}}>
          <View style={styles.queryContainer}>
            <View style={styles.firstContainer}>
              <TouchableOpacity
                style={styles.arrowContainer}
               // onPress={() => navigation.navigate('bookingStep2')}
                >
                {/* <Image
                  style={styles.arrowIcon}
                  source={require('../../../assets/images/back_arrow.png')}
                /> */}
              </TouchableOpacity>
              <View style={styles.middleContainer}>
                <Image
                  style={styles.circleIcon}
                  source={require('../../../assets/images/circle.png')}
                />
              </View>
              <View style={styles.fromContainer}>
                <View
                  style={
                    focusEmail === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    placeholder="6th Avenue"
                    value={pickupPlace}
                    editable={false}
                    onBlur={() => onBlurTextInputEmail()}
                    onFocus={() => onFocusTextInputEmail()}
                    // onChangeText={text => setEmail(text)}
                    placeholderTextColor="#C9CCCF"
                  />
                </View>
              </View>
            </View>
            <IconMaterialCommunityIcons
              style={{left: calcW(0.091), top: calcH(0.025)}}
              size={15}
              name={'dots-vertical'}
            />

            <View style={styles.secondContainer}>
              <TouchableOpacity
                style={styles.arrowContainer}
                onPress={() => navigation.navigate('')}></TouchableOpacity>
              <View style={styles.middleContainer}>
                <Image
                  style={styles.locationIcon}
                  source={require('../../../assets/images/location.png')}
                />
              </View>
              <View style={styles.fromContainer}>
                <View
                  style={
                    focusEmail === true
                      ? styles.activeBorder
                      : styles.inActiveBorder
                  }>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Stewart street"
                    value={destinationPlace}
                    editable={false}
                    onBlur={() => onBlurTextInputEmail()}
                    onFocus={() => onFocusTextInputEmail()}
                    placeholderTextColor="#C9CCCF"
                    // onChangeText={text => setEmail(text)}
                  />
                </View>
              </View>
            </View>
          </View>

          <View style={styles.mapContainer}>
            {/* <Image style={styles.mapView} source={require('../../asserts/map_step1.png')} /> */}
            <MapView
              ref={mapRef}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              }
              showsUserLocation={true}
              showsCompass={true}
              zoomControlEnabled={true}
              rotateEnabled={true}
              style={styles.mapView}
              region={{
                latitude: pickupLat,
                longitude: pickuplng,
                latitudeDelta: 0.5022,
                longitudeDelta: 0.2421,
              }}>
              <Marker
                draggable
                coordinate={{latitude: pickupLat, longitude: pickuplng}}
              />
              <Marker
                draggable
                coordinate={{
                  latitude: destinationlat,
                  longitude: destinationlng,
                }}
              />
              <MapViewDirections
                origin={origin}
                destination={destinationroute}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={5}
                strokeColor={colors.activeBorder}
                optimizeWaypoints={true}
                onStart={params => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`,
                  );
                }}
                onReady={result => {
                  console.log(`Distance: ${result.distance} km`);
                  console.log(`Duration: ${result.duration} min.`);
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      right: 30,
                      bottom: 30,
                      left: 30,
                      top: 100,
                    },
                  });
                }}
              />
            </MapView>
          </View>

          <View style={styles.lowerContainer}>
            <View style={styles.driverContainer}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.driverImg}
                  //source={require('../../asserts/user.jpeg')}
                />
                {/* <UIActivityIndicator color="#000" size={20}  style={styles.driverImg}/> */}
              </View>
              <View style={styles.descripContainer}>
                {/* <Text style={styles.title1}>WB 24AB2546</Text> */}
                <View
                  style={{
                    borderColor: '#000',
                    borderWidth: 0,
                    flex: 1,
                    justifyContent: 'space-between',
                    // width: calcW(0.2),
                    // height: calcH(0.
                    flexDirection: 'row',
                  }}>
                  <View>
                    <BarIndicator
                      color="#000"
                      size={10}
                      // style={{right: calcW(0.15)}}
                    />
                    {/* <Text style={styles.title2}>John Doe</Text> */}
                    <BarIndicator
                      color="#000"
                      size={10}
                      // style={{right: calcW(0.15)}}
                    />
                  </View>
                  <View style={styles.starRate}>
                    <Image
                      style={styles.starIcon}
                      source={require('../../../assets/images/star.png')}
                    />

                    <BarIndicator
                      color="#000"
                      size={12}
                      style={{right: calcW(0.04)}}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: calcW(0.65),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      borderColor: '#000',
                      borderWidth: 0,
                      flex: 0.4,
                    }}>
                    <Text style={styles.title3}>Total Ride :</Text>

                    <BarIndicator
                      color="#000"
                      size={12}
                      // style={{right: calcW(0.15)}}
                    />
                  </View>
                  <Text style={styles.codeText}>${priceRide}</Text>
                </View>
              </View>
              {/* <View style={styles.starpriceContainer}> */}

              {/* </View> */}
            </View>
            <View
              style={{
                borderColor: colors.buttonColor,
                borderWidth: 2,
                padding: 8,
                borderRadius: 22,
                margin: 12,
                width: calcW(0.6),
                alignItems: 'center',
              }}>
              <Text style={styles.codeNoText}>OTP:{verifyCode}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                width: calcW(0.4),
                alignItems: 'center',
              }}>
              <Text style={styles.codeText}>Pickup Time :</Text>

              <BarIndicator
                color="#000"
                size={12}
                // style={{right: calcW(0.15)}}
              />
            </View>

            <View style={styles.lineStyle} />
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Due Amount: </Text>
              <Text>${duepayment}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>EST. cost: </Text>
              <Text>${priceRide}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Wt. cost: </Text>
              <Text>${waitingCharge}.00</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>ST. cost: </Text>
              <Text>${waitingCharge}.00</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Tips cost: </Text>
              <Text>${waitingCharge}.00</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text
                style={{
                  //right: calcW(0.01),
                  marginTop: calcW(0.02),
                  fontWeight: 'bold',
                  fontSize: RFValue(15),
                  color: colors.textHeader,
                  //marginRight: calcW(0.05),
                }}>
                Total:
              </Text>
              <Text>${(Number(priceRide) + Number(duepayment)).toFixed(2)}</Text>
            </View>
            <View style={styles.lineStyle} />
            <View style={styles.btnconfirmContainer}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={() =>
                    navigation.navigate('cancellation', {
                      charge: 120,
                    })
                  }>
                  <Text style={styles.btnconfirmText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    // alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    //padding: allPadding,
    // paddingBottom: 50,
  },
  queryContainer: {
    width: calcW(0.9),
    height: calcH(0.15),
    // alignItems: 'center',
    borderColor: '#000',
    borderWidth: 0,
  },
  firstContainer: {
    //marginTop: calcW(0.015),
    flexDirection: 'row',
    height: calcH(0.04),
  },
  dottedContainer: {},
  dottIcon: {},

  secondContainer: {
    marginTop: calcW(0.01),
    flexDirection: 'row',
    height: calcH(0.1),
  },
  arrowContainer: {
    justifyContent: 'center',
    width: calcW(0.1),
  },
  arrowIcon: {
    width: calcW(0.04),
    height: calcH(0.01),
  },
  middleContainer: {
    width: calcW(0.08),
    justifyContent: 'center',
  },
  circleIcon: {
    width: calcW(0.03),
    height: calcW(0.03),
    top: calcH(0.02),
  },
  locationIcon: {
    width: calcW(0.03),
    height: calcW(0.038),
  },
  fromContainer: {
    width: calcW(0.7),
    justifyContent: 'center',
    height: calcH(0.09),
    // backgroundColor: '#000',
  },
  textInput: {
    color: '#22272E',
    fontSize: RFValue(14),
    flex: 1,
    paddingLeft: calcW(0.01),
  },

  lowerContainer: {
    // height: calcH(0.285),
    // width: calcW(1),
    alignItems: 'center',
    flex: 1,
    //marginBottom: calcH(0.05),
    // paddingBottom: allPadding,
    // paddingHorizontal: allPadding,
    padding: allPadding,
    // top: calcH(0.02),
    borderColor: '#000',
    borderWidth: 0,
  },
  mapView: {
    width: calcW(1),
    height: calcH(0.52),
    alignItems: 'center',
  },
  btnMainContainer: {
    height: calcH(0.05),
  },

  btnContainer: {
    alignItems: 'center',
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonAnothercolor,
    justifyContent: 'center',
  },
  btnConfirm: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
    // marginBottom: calcH(1.2),
  },
  btnconfirmText: {
    textAlign: 'center',
    fontSize: RFValue(13),
    color: '#fff',
    fontWeight: '500',
  },
  btnText: {
    left: calcW(0.08),
    fontSize: RFValue(13),
    color: colors.textHeader,
    fontWeight: '500',
  },

  detailsContainer: {
    marginTop: calcW(0.01),
    height: calcW(0.15),
    width: calcW(0.9),
    flexDirection: 'row',
    backgroundColor: colors.buttonColor,
  },

  desContainer: {
    width: '45%',
    justifyContent: 'center',
  },
  title: {
    color: '#3B4045',
    fontSize: RFValue(18),
    fontWeight: '500',
  },
  subtitle: {
    color: '#3B4045',
    fontSize: RFValue(15),
    fontWeight: '400',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: calcW(0.8),
    padding: 8,
  },
  nextdetailsContainer: {
    marginTop: calcW(0.02),
    height: calcW(0.15),
    width: calcW(0.9),
    flexDirection: 'row',
    backgroundColor: colors.buttonAnothercolor,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginTop: calcW(0.03),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
  },
  subText: {
    fontSize: 16,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
  },
  driverContainer: {
    // height: calcW(0.3),
    // width: calcW(0.9),
    // top: calcH(0.01),
    flex: 1,
    flexDirection: 'row',
    borderWidth: 0,
    bottom: calcH(0.01),
  },
  imageContainer: {
    // top: calcH(-0.02),
    width: calcW(0.15),
    justifyContent: 'center',
    //borderColor: colors.activeBorder,
    borderWidth: 0,
    //borderRadius: 150,
  },
  driverImg: {
    width: calcW(0.15),
    height: calcW(0.15),
    borderRadius: calcW(0.09),
    borderWidth: 1,
    borderColor: colors.activeBorder,
  },
  descripContainer: {
    // width: calcW(0.45),
    justifyContent: 'center',
    flex: 1,
    marginStart: 5,
    // top: calcH(0.02),
    // padding: 12
  },
  title1: {
    fontWeight: '600',
    fontSize: 18,
    color: colors.textHeader,
  },
  title2: {
    fontWeight: '500',
    fontSize: 16,
    color: colors.textHeader,
  },
  title3: {
    // top: calcW(-0.01),
    fontWeight: '500',
    fontSize: RFValue(13),
    // left: calcW(0.02),
    color: colors.textHeader,
  },
  starpriceContainer: {
    width: calcW(0.3),
    justifyContent: 'center',
    padding: allPadding,
  },
  price: {
    //left: calcW(0.12),
    // right: calcW(0.01),
    // marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(13),
    color: colors.textHeader,
    // marginRight: calcW(0.05),
  },
  starRate: {
    // right: calcW(0.001),
    flexDirection: 'row',
    width: calcW(0.3),
    justifyContent: 'center',
    alignItems: 'center',
    padding: allPadding,
  },
  starIcon: {
    left: calcW(0.01),
    // marginTop: calcH(0.012),
    width: calcW(0.04),
    height: calcW(0.04),
  },
  titleRate: {
    left: calcW(0.04),
    fontWeight: '400',
    fontSize: RFValue(16),
    color: colors.textHeader,
    marginTop: calcH(0.01),
  },
  lineStyle: {
    // top: calcH(0.015),
    borderBottomColor: colors.textHeader,
    borderBottomWidth: 2,
    marginBottom: calcH(0.02),
  },
  codeContainer: {
    width: calcW(0.9),
    height: calcH(0.04),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    //top: calcH(-0.02),
  },
  codeverify: {
    width: calcW(0.4),
    justifyContent: 'center',
  },
  codenumber: {
    width: calcW(0.5),
    justifyContent: 'center',
    right: calcW(0.09),
    //padding: allPadding,
  },
  codeText: {
    fontSize: RFValue(13),
    color: colors.textHeader,
    fontWeight: '900',
    // top: calcH(-0.02),
  },
  codeNoText: {
    // left: calcW(0.3),
    fontSize: RFValue(14),
    color: colors.buttonColor,
    fontWeight: '700',
    // top: calcH(0.02),
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(0.52),
    borderWidth: 0,
    borderColor: colors.buttonAnothercolor,
    marginBottom: calcH(0.02),
  },
  btnconfirmContainer: {
    // height: calcH(0.04),
    //marginTop: calcH(0.004),
  },
  choosherContainer: {
    height: calcH(0.1),
    justifyContent: 'center',
    marginTop: calcW(0.01),
  },

  inActiveBorder: {
    // width: calcW(0.7),
    // height: calcH(0.05),
    borderColor: colors.inActiveBorder,
    flex: 0.7,
    borderWidth: 1,
    borderRadius: allRadius,
    // marginVertical: calcH(0.02),
    flexDirection: 'row',
    // padding: 1,
    alignItems: 'center',
    paddingLeft: allPadding,
    // marginBottom: calcH(0.02)
    // paddingVertical: 1,
  },
  activeBorder: {
    width: calcW(0.7),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    // marginVertical: calcH(0.015),
    flexDirection: 'row',
    padding: allPadding,
    alignItems: 'center',
    //paddingVertical: 2,
  },
  carContainer: {
    width: '30%',
    justifyContent: 'center',
  },
  carImage: {
    width: calcW(0.18),
    height: calcH(0.04),
  },
});
