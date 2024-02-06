import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  BackHandler,
  Alert,
  SafeAreaView,
} from 'react-native';
import { ScreenScrollComponent, HeaderComponent } from '../../commonItem';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import axios from 'axios';
import MapView, {
  AnimatedRegion,
  Marker,
  MarkerAnimated,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { firebase } from '@react-native-firebase/database';
import Geolocation from 'react-native-geolocation-service';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import Hud from '../../utils/hud';
import moment from 'moment';
import { Toast } from 'native-base';
import { BASE_URL } from '../../utils/Api/apiName';

const reference = firebase
  .app()
  .database('https://kabou-rider-default-rtdb.firebaseio.com/');

export default function WaitingScreen({ navigation }) {
  const markerRef = useRef();
  const backHandler = useRef();
  const waitingTimeRef = useRef();
  const dateNow = new Date().getTime();

  const [focusEmail, setFocusEmail] = useState(false);
  const [verifyCode, setVerifyCode] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [waitingmint, setwaitingmint] = useState(0);
  const [waitingCharge, setWaitingCharge] = useState(0);
  const [pickupPlace, setPickupPlace] = useState('');
  const [destinationPlace, setDestinationPlace] = useState('');
  const [priceRide, setPriceRide] = useState(0);
  const [timecharge, setTimecharge] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [departuretime, setDeparturetime] = useState(null);
  const [startwaiting, setStartwaiting] = useState(true);
  const [drivercab, setDrivercab] = useState('');
  const [drivername, setDrivername] = useState('');
  const [driverimage, setDriverimage] = useState(null);
  const [driverlatitude, setDriverlatitude] = useState(22.5734368);
  const [driverlongitude, setDriverlongitude] = useState(88.4305629);
  const [driverHeading, setDriverHeading] = useState(0);
  const [distance, setdistance] = useState(0);
  const [cancelRider, setCancelRider] = useState(false)
  const [driverCoordinate, setDriverCoordinate] = useState(
    new AnimatedRegion({
      latitude: 22.5734368,
      longitude: 88.4305629,
    }),
  );
  const [pickUpLat, setPickUpLat] = useState(22.5734368);
  const [pickuplng, setPickUpLng] = useState(88.4305629);
  const [arrivalLat, setarrivalLat] = useState(22.5734368);
  const [arrivalLng, setarrivalLng] = useState(22.5734368);
  const [bookingId, setBookingId] = useState(0);
  const [dueamount, setDueAmount] = useState(0)

  const [otpVerification, setOtpVerification] = useState(true);

  let timer = 0;
  let charge = 0;
  let waittime = 0;
  let waitSec = 0;
  let waitcharge = 0;

  let secondtimer = 0;
  let freetimer = 1;
  let freesecondtimer = 59;

  useEffect(() => {
    fetchdriver();

    //fetch();
    // waitingtime();
    // stoppagetime();
    const unsubscribe = navigation.addListener('focus', () => {
      setwaitingmint(1);
      setWaitingTime(59);
      setWaitingCharge(0);
      setMinutes(0);
      setSeconds(0);
      setTimecharge(0);
      setStartwaiting(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    backHandler.current = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);
  const driverlocation = useCallback(
    value => {
      // console.log('#################### ', value);
      // Geolocation.getCurrentPosition(
      //   //Will give you the current location
      //   position => {
      //     setLocationStatus('You are Here');
      //     console.log('position', position);
      //     //setOrigin(position.coords);
      //     //getting the Longitude from the location json
      //     const currentLongitude = JSON.stringify(position.coords.longitude);

      //     //getting the Latitude from the location json
      //     const currentLatitude = JSON.stringify(position.coords.latitude);

      //     //Setting Longitude state
      //     // setCurrentLongitude(currentLongitude);

      //     //Setting Longitude state
      //     // setCurrentLatitude(currentLatitude);
      //     // setCurrentCoords({currentLatitude, currentLongitude});
      //     setDriverHeading(position.coords.heading);
      //     reference.ref(`/driver-location/${bookingId}`).set({
      //       driverlat: position.coords.latitude,
      //       driverlng: position.coords.longitude,
      //       driverHeading: position.coords.heading,
      //       driverPickUpTime: departureTime ?? 0,
      //     });
      //   },
      // );
      //requestLocationPermission();
      reference.ref(`/driver-location/${bookingId}`).update({
        rideCancel: cancelRider
      })
    },
    [bookingId, cancelRider],
  );

  useEffect(() => {
    // if (rtdbRef.current) {
    //   reference
    //     .ref(`/driver-location/${bookingId}`)
    //     .off('value', rtdbRef.current);
    // }
    const onValueChange = reference
      .ref(`/driver-location/${bookingId}`)
      .on('value', snapshot => {
        //setSeconds(snapshot.val());
        //setTimecharge(snapshot.val() + 2);
        console.log('bookingId', bookingId);
        console.log('valuelocationfinal!!! ', snapshot.val());
        if (snapshot.val() !== null) {
          console.log('Value:::::before_long ', snapshot.val().driverlat);
          console.log(
            'Value:::::before_lats&&& time',
            snapshot.val().driverlng,
            snapshot.val().driverPickUpTime,
          );
          driverlocation(snapshot.val())
          animate(
            Number(snapshot.val().driverlat),
            Number(snapshot.val().driverlng),
          );
          setDriverlatitude(snapshot.val().driverlat);
          setDriverlongitude(snapshot.val().driverlng);
          setDriverHeading(snapshot.val().driverHeading);
          setDeparturetime(snapshot.val().driverPickUpTime);
          setOtpVerification(snapshot.val().otpVerification)

          console.log("=====driverPickUpTime==",typeof snapshot.val().otpVerification, snapshot.val().otpVerification)
          setDriverCoordinate(
            new AnimatedRegion({
              latitude: Number(snapshot.val().driverlat),
              longitude: Number(snapshot.val().driverlng),
            }),
          );

        }
      });
    return () =>
      reference
        .ref(`/driver-location/${bookingId}`)
        .off('value', onValueChange);
  }, [bookingId, driverlocation]);
  // useEffect(() => {
  //   const onValueChange = reference
  //     .ref(`/driver-location/${bookingId}`)
  //     .on('value', snapshot => {
  //       //if (typeof snapshot.val() === 'number') {
  //       console.log('Value:::::before_long ', snapshot.val());
  //       console.log('Value:::::before_lats', snapshot.val());
  //       if (snapshot.val() !== null) {
  //         console.log('Value:::::before_long ', snapshot.val().driverlat);
  //         console.log(
  //           'Value:::::before_lats&&& time',
  //           snapshot.val().driverlng,
  //           snapshot.val().driverPickUpTime,
  //         );
  //         animate(
  //           Number(snapshot.val().driverlat),
  //           Number(snapshot.val().driverlng),
  //         );
  //         setDriverlatitude(snapshot.val().driverlat);
  //         setDriverlongitude(snapshot.val().driverlng);
  //         setDriverHeading(snapshot.val().driverHeading);
  //         setDeparturetime(snapshot.val().driverPickUpTime);
  //         setDriverCoordinate(
  //           new AnimatedRegion({
  //             latitude: Number(snapshot.val().driverlat),
  //             longitude: Number(snapshot.val().driverlng),
  //           }),
  //         );
  //       }
  //     });

  //   // Stop listening for updates when no longer required
  //   return () =>
  //     reference
  //       .ref(`/driver-location/${bookingId}`)
  //       .off('value', onValueChange);
  // }, [bookingId]);
  // useEffect(() => {
  //   const onValueChange = reference
  //     .ref(`driver-location/${bookingId}`)
  //     .on('value', snapshot => {
  //       console.log('Value:::::location ', snapshot.val());
  //     });

  //   // Stop listening for updates when no longer required
  //   return () =>
  //     reference.ref(`driver-location/${bookingId}`).off('value', onValueChange);
  // }, [bookingId]);
  useEffect(() => {
    if (departuretime) {
      waitingTimeRef.current = reference
        .ref(`/waiting/${bookingId}`)
        .on('value', snapshot => {
          //if (typeof snapshot.val() === 'number') {
          console.log('Value:::::before ', snapshot.val());
          setwaitingmint(freetimer);
          setWaitingTime(freesecondtimer);
          if (snapshot.val() > departuretime * 60 + 119) {
            // var sec = new Date().getSeconds();

            // console.log('sec', sec);
            setStartwaiting(false);
            setwaitingmint(timer);
            secondtimer += 1;
            setWaitingTime(secondtimer);
            if (secondtimer === 59) {
              secondtimer = 0;
              timer += 1;
              setwaitingmint(timer);
              if (timer % 2 === 0) {
                charge += 1;
                setWaitingCharge(charge);
              }
            }
          } else {
            if (snapshot.val() > departuretime * 60) {
              freesecondtimer -= 1;
              setWaitingTime(freesecondtimer);
              if (freesecondtimer === 1) {
                freesecondtimer = 59;
                freetimer -= 1;
                setwaitingmint(freetimer);
              }
            }

            // setSeconds(snapshot.val());
            // setTimecharge(snapshot.val() + 2);
            //console.log('Value::::: ', snapshot.val());
          }
          // setSeconds(snapshot.val());
          // setTimecharge(snapshot.val() + 2);
          //console.log('User data: ', snapshot.val());
        });
    }

    // Stop listening for updates when no longer required
    return () => {
      reference
        .ref(`/waiting/${bookingId}`)
        .off('value', waitingTimeRef.current);
    };
  }, [bookingId, departuretime]);

  useEffect(() => {
    const onValueChange = reference
      .ref(`/booking/${bookingId}`)
      .on('value', snapshot => {
        // if (typeof snapshot.val() === 'number') {
        // setSeconds(snapshot.val());
        // setTimecharge(snapshot.val() + 2);
        // if (snapshot.val() > 240) {
        // console.log('sec', sec);
        waitSec += 1;
        setSeconds(waitSec);
        if (waitSec === 60) {
          waitSec = 0;
          waittime += 1;
          setMinutes(waittime);
          if (waittime % 2 === 0) {
            waitcharge += 1;
            setTimecharge(waitcharge);
          }
        }

        // setSeconds(snapshot.val());
        // setTimecharge(snapshot.val() + 2);
        console.log('Value::::: ', snapshot.val());
        // }
        console.log('Value::::: ', snapshot.val());
        // }
        // setSeconds(snapshot.val());
        // setTimecharge(snapshot.val() + 2);
        console.log('User data: ', snapshot.val());
      });

    // Stop listening for updates when no longer required
    return () =>
      reference.ref(`/booking/${bookingId}`).off('value', onValueChange);
  }, [bookingId]);

  reference.ref(`/booking/${bookingId}`).on('value', snapshot => {
    //console.log('User data45: ', typeof snapshot.val());
  });

  const fetchdriver = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    const data = JSON.parse(await AsyncStorage.getItem('data_ride'));
    console.log('dataaaaaaaaaaaaaaaaa', data.data.booking_id);
    setVerifyCode(data.data.verify_code);
    setBookingId(data.data.booking_id);
    const ride_data = [];
    ride_data.push(JSON.parse(data.config.data));

    console.log('dataaaaaaaaaaaa!', ride_data);
    //setDeparturetime(ride_data[0].departure_time);
    setDestinationPlace(ride_data[0].destination);
    setPickupPlace(ride_data[0].starting_point);
    setPickUpLat(ride_data[0].latitude_departure);
    setPickUpLng(ride_data[0].longitude_departure);
    setarrivalLat(ride_data[0].latitude_arrival);
    setarrivalLng(ride_data[0].longitude_arrival);
    setPriceRide(ride_data[0].price);
    setdistance(ride_data[0].distance);
    Hud.showHud();
    await axios({
      method: 'GET',
      url: 'https://kabou.us/api/rider/accepted-ride-details',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log(
          'driver details:::::::::::::::::',
          JSON.stringify(response.data),
        );
        Hud.hideHud();
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))
        setDrivercab(response.data.data.cab_no);
        setDrivername(response.data.data.name);
        setDriverimage(response.data.data.profile_photo);
        setDriverlatitude(response.data.data.latitude);
        setDriverlongitude(response.data.data.longitude);
        setDueAmount(response.data.due_amount)
      })
      .catch(function (error) {
        console.log(error);
        Hud.hideHud();
      });
  };
  const onFocusTextInputEmail = () => { };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  // var handleprice = async () => {
  //   // if(starttime === false){
  //   const pickuptime = await AsyncStorage.getItem('departureTime');
  //   console.log('=>>>>>>>>>>+++++++1', pickuptime);

  //   const pick = pickuptime.split(':');
  //   const hours = Number(pick[0]);
  //   const seconds = Number(pick[1]);
  //   console.log(hours);
  //   console.log(seconds);
  //   //var d =new Date().getMinutes()+Number(waitingTime)
  //   var phours = new Date().getHours();
  //   var pmins = new Date().getMinutes();
  //   //console.log('p============1', p);
  //   console.log('=>>>>>>>>>>+++++++1', phours + ':' + pmins);

  //   if (seconds < pmins || hours < phours) {
  //     // Alert.alert("time same not")
  //     setStarttime(true);
  //     setTimecharge(count + 2);
  //     setCount(timecharge);
  //     setSeconds(seconds => seconds + 1);
  //     //}
  //     // setCount(value)
  //     console.log(typeof value);
  //     console.log(timecharge);
  //   }
  //   const charge = 120 + timecharge;
  //   AsyncStorage.setItem('rideCharge', JSON.stringify(charge));

  //   //  setStarttime(true)
  // };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      driverCoordinate.timing(newCoordinate).start();
    }
  };

  const waitingtime = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    await axios({
      method: 'GET',
      url: 'https://kabou.us/api/rider/waiting-time',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log(
          'driver waiting:::::::::::::::::',
          response.data.data.value,
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const stoppagetime = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    await axios({
      method: 'GET',
      url: `https://kabou.us/api/rider/stoppage-price?id=${bookingId}`,
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log('driver stoppage:::::::::::::::::', response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const origin = {
    latitude: Number(pickUpLat),
    longitude: Number(pickuplng),
  };
  const destinationroute = {
    latitude: Number(driverlatitude),
    longitude: Number(driverlongitude),
  };
  const departureLatitude = {
    latitude: Number(arrivalLat),
    longitude: Number(arrivalLng),
  };
  const GOOGLE_MAPS_APIKEY = google_api_key;
  const mapRef = useRef();
  const maproute = useRef(true);

  const tipsPayment = async () => {
    setCancelRider(true)
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const canSaveCard = JSON.parse(
      await AsyncStorage.getItem('KabouRiderCardSaveStatus'),
    );
    console.log('=========Tokan==============', token);
    const finaltoken = token.data.data.token;
    console.log('========= FinalTokan==============', finaltoken);
    // Hud.showHud();
    const data = {
      booking_id: bookingId,
      tips_amount: 0,
    };
    console.log('tips send data: ', data);
    try {
      const response = await axios({
        method: 'post',
        url: BASE_URL + 'give-tips',
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + finaltoken,
        },
        data: data,
      });
      Hud.hideHud();
      console.log('canSaveCard =========>>>', response.data, canSaveCard);

      console.log('Response===========>>>', response.data);

      if (response.data.success === true) {
        if (canSaveCard && response.data.data.payment_method) {
          const res = await axios.post(
            `${BASE_URL}detach-payment`,
            {
              payment_methode_id: response.data.data.payment_method,
            },
            {
              headers: {
                Accept: 'application/json',
                authorization: 'Bearer ' + finaltoken,
              },
            },
          );

          console.warn('card saved status', res.data);
        }
        navigation.navigate('invoice', {
          data: {
            waitingtimecharge: waitingCharge,
            stoppageCharge: timecharge,
            total: priceRide,
            booking_id: bookingId,
            cab_no: drivercab,
            pickUpLocation: pickupPlace,
            destinationLocation: destinationPlace,
            driverPhoto: driverimage,
            driverName: drivername,
            distance,
          },
          tips_amount: 0,
        });
      }
      Toast.show({
        placement: 'top',
        title: response.data.message,
      });
    } catch (err) {
      console.log('errprofile', err.data);
      Hud.hideHud();
      Alert.alert(err);
    }
  };
 //console.log("==================otpVerification==========",otpVerification)
  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={styles.topContainer}>
        <View style={styles.queryContainer}>
          <View style={styles.firstContainer}>
            <TouchableOpacity
              style={styles.arrowContainer}
              //onPress={() => navigation.navigate('driverView')}
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
                  placeholderTextColor="#C9CCCF"
                //onChangeText={text => setEmail(text)}
                />
              </View>
            </View>
          </View>
          <IconMaterialCommunityIcons
            style={{ left: calcW(0.091), top: calcH(0.025) }}
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
                //onChangeText={text => setPickupPlace(text)}
                />
              </View>
            </View>
          </View>
        </View>

        {/* <View style={styles.mapContainer}> */}
        {/* <Image style={styles.mapView} source={require('../../asserts/map_4.png')} /> */}
        <MapView
          ref={mapRef}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          } // remove if not using Google Maps
          style={styles.mapView}
          region={{
            latitude: Number(driverlatitude),
            longitude: Number(driverlongitude),
            latitudeDelta: 0.00755,
            longitudeDelta: 0.00221,
          }}
          showsUserLocation={true}
          zoomEnabled={true}
          zoomControlEnabled
          followsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={true}
          moveOnMarkerPress={true}
          //showsScale={true}
          showsTraffic={true}
          showsBuildings={true}
        //userLocationUpdateInterval={1000}
        >
          <MarkerAnimated ref={markerRef} coordinate={driverCoordinate}>
            <Image
              source={require('../../../assets/images/car_premium_top.png')}
              style={{
                width: 40,
                height: 40,
                transform: [{ rotate: `${driverHeading}deg` }],
              }}
              resizeMode="contain"
            />
          </MarkerAnimated>
          <Marker
            //key={item.id}
            coordinate={{
              latitude: Number(pickUpLat),
              longitude: Number(pickuplng),
            }}>
            <View>
              <Image
                source={require('../../../assets/images/profile.png')}
                style={{
                  width: 15,
                  height: 15,
                  padding: allPadding,
                  borderRadius: allRadius,
                  borderColor: '#000',
                  borderWidth: 2,
                }}
              />
            </View>
          </Marker>
          <Marker
            draggable
            coordinate={{
              latitude: arrivalLat,
              longitude: arrivalLng,
            }}
          />
          {/* <Polyline
          coordinates={[
            { latitude: Number(driverlatitude), longitude: Number(driverlongitude)},
            {latitude: Number(pickUpLat), longitude: Number(pickuplng) },
            
          ]}
          strokeColor="#7F0000" // fallback for when `strokeColors` is not supported by the map-provider
          //strokeColor={['#7F0000']}
          strokeWidth={2}
        /> */}
          <MapViewDirections
            origin={origin}
            destination={destinationroute}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
            strokeColor={colors.activeBorder}
            optimizeWaypoints={true}
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              // setdistance(result.distance);
              console.log(`Duration: ${result.duration} min.`);
              // console.log('++++++++++++++++++++++++++++++', result.coordinates)
              if (maproute.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 30,
                    left: 30,
                    top: 100,
                  },
                });
                maproute.current = false;
              }
            }}
          />
          {/* {console.log('&&&&&&&&&&&&&&', distance)} */}

          <MapViewDirections
            origin={destinationroute}
            destination={departureLatitude}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={6}
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
              if (maproute.current) {
                mapRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: 30,
                    bottom: 30,
                    left: 30,
                    top: 100,
                  },
                });
                maproute.current = false;
              }
            }}
          />
        </MapView>
        {/* </View> */}
        <ScrollView>
          <View style={{ flex: 1, padding: allPadding, width: calcW(1) }}>
            <View style={styles.lowerContainer}>
              <Image style={styles.driverImg} source={{ uri: driverimage }} />
              <View style={styles.descripContainer}>
                <Text style={styles.title1}>{drivercab}</Text>
                <Text style={styles.title2}>{drivername}</Text>
                <Text style={styles.title3}>Total Ride : 15+</Text>
                <Text
                  style={{
                    fontSize: RFValue(15),
                    fontWeight: 'bold',
                    color: '#000',
                  }}>
                  PickUp Time:{' '}
                  {moment(dateNow + (departuretime ?? 0) * 60 * 1000).format(
                    'LT',
                  )}
                </Text>
              </View>

              <View style={styles.starpriceContainer}>
                <View style={styles.starRate}>
                  <Image
                    style={styles.starIcon}
                    source={require('../../../assets/images/star.png')}
                  />
                  <Text style={styles.titleRate}>4.9</Text>
                </View>
                <Text style={styles.codeNoText}>OTP :{verifyCode}</Text>
              </View>
            </View>
            <View style={{ padding: allPadding }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: calcW(0.54),
                }}>
                  
                <Text style={styles.price}>EST. cost: ${priceRide}</Text>
                <Text style={styles.price}>WT. cost: ${waitingCharge}.00</Text>
              
                {/* <Text style={styles.price}>Due. cost: ${dueamount}</Text> */}
               
                
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: calcW(0.8),
                }}>
                <Text style={styles.price}>ST. cost: ${timecharge}.00</Text>
                <Text style={styles.price}>TIPS: $0.00</Text>
                <Text
                  style={{
                    // right: calcW(0.01),
                    // marginTop: calcW(0.02),
                    fontWeight: 'bold',
                    fontSize: RFValue(16),
                    color: colors.textHeader,
                    // marginRight: calcW(0.02),
                    // paddingRight: calcW(0.1),
                    // padding: allPadding
                  }}>
                  Total: $
                  {(
                    Number(priceRide) +
                    Number(timecharge) +
                    Number(waitingCharge)+
                    Number(dueamount)
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: allPadding,
                shadowColor: '#808080',
                elevation: 0.5,
                shadowOpacity: 0.5,
                borderBottomWidth: 0,
                marginBottom: calcH(0.02),
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: allPadding,
                }}>
                <View>
                  {/* <Text style={styles.textTime}>{waitingTime} mints </Text> */}
                  {/* {starttime === true ? (
                  <View>
                    {starttime !== true ? (
                      <CountDown
                        until={60 * 2}
                        size={15}
                        onFinish={() => handleprice()}
                        //onPress={() => handleprice()}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{color: '#1CC625'}}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'MM', s: 'SS'}}
                      />
                    ) : (
                      <Text style={styles.textTime}>0 mins </Text>
                    )}
                  </View>
                ) : ( */}
                  {waitingmint <= 9 && waitingTime <= 9 ? (
                    <Text style={styles.textTime}>
                      {' '}
                      0{waitingmint}:0{waitingTime} mins{' '}
                    </Text>
                  ) : (
                    <>
                      {waitingmint <= 9 && waitingTime > 9 ? (
                        <Text style={styles.textTime}>
                          {' '}
                          0{waitingmint}:{waitingTime} mins{' '}
                        </Text>
                      ) : (
                        <Text style={styles.textTime}>
                          {' '}
                          {waitingmint}:{waitingTime} mins{' '}
                        </Text>
                      )}
                    </>
                  )}

                  {/* )} */}
                  {startwaiting === true ? (
                    <Text style={styles.textStyle}>Free waiting time</Text>
                  ) : (
                    <Text style={styles.textStyle}>Chargeable waiting time</Text>
                  )}
                </View>
                <View>
                  <Text style={styles.textTime}>${waitingCharge}.00</Text>
                  <Text style={styles.textStyle}>Waiting time cost</Text>
                </View>
              </View>
              {/* <TouchableOpacity
          style={{
            backgroundColor: colors.buttonColor,
            width: calcW(0.4),
            height: calcH(0.05),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: calcH(0.02),
            borderRadius: allRadius
          }}
          >
            <Text style={{color: '#fff'}}>End stopage time</Text>
          </TouchableOpacity> */}
            </View>
            <View
              style={{
                padding: allPadding,
                shadowColor: '#808080',
                elevation: 0.5,
                shadowOpacity: 0.5,
                borderBottomWidth: 0,
                marginBottom: calcH(0.02),
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  paddingHorizontal: allPadding,
                }}>
                <View>
                  {minutes <= 9 && seconds <= 9 ? (
                    <Text style={styles.textTime}>
                      {' '}
                      0{minutes}:0{seconds} mins{' '}
                    </Text>
                  ) : (
                    <>
                      {minutes <= 9 && seconds > 9 ? (
                        <Text style={styles.textTime}>
                          {' '}
                          0{minutes}:{seconds} mins{' '}
                        </Text>
                      ) : (
                        <Text style={styles.textTime}>
                          {' '}
                          {minutes}:{seconds} mins{' '}
                        </Text>
                      )}
                    </>
                  )}
                  <Text style={styles.textStyle}>Stoppages time</Text>
                </View>
                <View>
                  <Text style={styles.textTime}>${timecharge}.00</Text>
                  <Text style={styles.textStyle}>Stoppage time cost</Text>
                </View>
              </View>
              {/* <TouchableOpacity
          style={{
            backgroundColor: colors.buttonColor,
            width: calcW(0.4),
            height: calcH(0.05),
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: calcH(0.02),
            borderRadius: allRadius,
          }}
          >
            <Text style={{color: '#fff'}}>End stopage time</Text>
          </TouchableOpacity> */}
            </View>

            {/* <View style={styles.choosherContainer}>
                <Text style={styles.textChoose}>The car arrived but you didn't come</Text>
              </View> */}
            <View style={styles.btnconfirmContainer}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={
                    () =>
                      navigation.navigate('paymentDetails', {
                        data: {
                          waitingtimecharge: waitingCharge,
                          stoppageCharge: timecharge,
                          total: priceRide,
                          booking_id: bookingId,
                          cab_no: drivercab,
                          pickUpLocation: pickupPlace,
                          destinationLocation: destinationPlace,
                          driverPhoto: driverimage,
                          driverName: drivername,
                          distance,
                        },
                      })
                    // navigation.navigate('cancellation', {
                    //   charge: 120 + timecharge,
                    // })
                  }>
                  <Text style={styles.btnconfirmText}>Pay with tips</Text>
                </TouchableOpacity>
              </View>


              {otpVerification == true ?
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={{
                      width: calcW(0.42),
                      height: buttonHeight,
                      borderRadius: allRadius,
                      backgroundColor: colors.buttonAnothercolor,
                      borderColor: colors.buttonColor,
                      borderWidth: 2,
                      justifyContent: 'center',
                    }}
                    //onPress={tipsPayment}
                   //onPress={()=> setCancelRider(true)}
                   onPress={() =>
                    navigation.navigate('cancellation', {
                      charge: priceRide,
                    })
                  }
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: RFValue(14),
                        color: colors.buttonColor,
                        fontWeight: '500',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                : <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={{
                      width: calcW(0.42),
                      height: buttonHeight,
                      borderRadius: allRadius,
                      backgroundColor: colors.buttonAnothercolor,
                      borderColor: colors.buttonColor,
                      borderWidth: 2,
                      justifyContent: 'center',
                    }}
                    onPress={tipsPayment}
                  // onPress={()=> setCancelRider(true)}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: RFValue(14),
                        color: colors.buttonColor,
                        fontWeight: '500',
                      }}>
                      End
                    </Text>
                  </TouchableOpacity>
                </View>

              }

            </View>
            {/* </View> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
  },
  queryContainer: {
    width: calcW(0.9),
    height: calcH(0.15),
  },
  firstContainer: {
    // marginTop: calcW(0.008),
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
    //width: '10%',
    // marginTop:calcW(0.01),
    // backgroundColor:'red'
  },
  arrowIcon: {
    width: calcW(0.04),
    height: calcH(0.01),
    // marginTop:calcW(0.01),
    // backgroundColor:'red'
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
    // top: calcH(-0.015),
  },
  fromContainer: {
    width: calcW(0.7),
    justifyContent: 'center',
    height: calcH(0.09),
  },
  textInput: {
    color: '#22272E',
    fontSize: RFValue(14),
    flex: 1,
    paddingLeft: calcW(0.01),
  },

  mapContainer: {
    width: calcW(1),
    // height: calcH(0.5),
    flex: 1,
    borderWidth: 0,
    borderColor: colors.buttonAnothercolor,
  },
  mapView: {
    // height: calcH(0.5)
    flex: 1,
  },
  lowerContainer: {
    width: calcW(1),
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mapView: {
    width: calcW(1),
    height: calcH(0.5),
    alignItems: 'center',
  },
  btnMainContainer: {
    height: calcH(0.08),
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

  btnText: {
    left: calcW(0.08),
    fontSize: RFValue(10),
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
    width: calcW(0.18),
    justifyContent: 'center',
    padding: allPadding,
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
    paddingHorizontal: calcW(0.05),
    marginTop: calcW(0.03),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
  },
  subText: {
    fontSize: RFValue(14),
    color: colors.subHeader,
    marginVertical: calcH(0.01),
    textAlign: 'center',
  },
  driverContainer: {
    height: calcW(0.3),
    width: calcW(0.7),
    flexDirection: 'row',
  },
  imageContainer: {
    width: calcW(0.2),
    justifyContent: 'center',
  },
  driverImg: {
    width: calcW(0.13),
    height: calcW(0.13),
    borderRadius: calcW(0.09),
  },
  descripContainer: {
    width: calcW(0.43),
    justifyContent: 'center',
  },
  title1: {
    fontWeight: '600',
    fontSize: RFValue(18),
    color: colors.textHeader,
  },
  title2: {
    fontWeight: '500',
    fontSize: RFValue(16),
    color: colors.textHeader,
  },
  title3: {
    marginTop: calcW(0.01),
    fontWeight: '400',
    fontSize: RFValue(14),
    color: colors.textHeader,
  },
  starpriceContainer: {
    width: calcW(0.3),
    justifyContent: 'center',
  },
  price: {
    // right: calcW(0.01),
    // marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(12),
    color: colors.textHeader,
    // padding: allPadding
    // marginRight: calcW(0.05),
  },
  price1: {
    //right: calcW(0.01),
    // marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(12),
    color: 'red',
    // padding: allPadding
    // marginRight: calcW(0.05),
  },
  starRate: {
    // left: calcW(0.12),
    flexDirection: 'row',
  },
  starIcon: {
    // left: calcW(0.03),
    marginTop: calcH(0.012),
    width: calcW(0.04),
    height: calcW(0.04),
  },
  titleRate: {
    left: calcW(0.05),
    fontWeight: '400',
    fontSize: RFValue(16),
    color: colors.textHeader,
    marginTop: calcH(0.01),
  },
  lineStyle: {
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  codeContainer: {
    width: calcW(0.9),
    height: calcH(0.08),
    flexDirection: 'row',
  },
  codeverify: {
    width: calcW(0.5),
    justifyContent: 'center',
  },
  codenumber: {
    width: calcW(0.5),
    justifyContent: 'center',
  },
  codeText: {
    fontSize: RFValue(14),
    color: colors.textHeader,
    fontWeight: '500',
  },
  codeNoText: {
    left: calcW(0.08),
    fontSize: RFValue(14.5),
    color: colors.textHeader,
    fontWeight: '700',
  },

  btnconfirmContainer: {
    height: calcH(0.08),
    flexDirection: 'row',
    justifyContent: 'space-between',
    //marginTop: calcH(0.01),
  },

  btnConfirm: {
    width: calcW(0.42),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
  },
  btnconfirmText: {
    textAlign: 'center',
    fontSize: RFValue(14),
    color: '#fff',
    fontWeight: '500',
  },
  // btnText: {
  //   left: calcW(0.08),
  //   fontSize: 13,
  //   color: colors.textHeader,
  //   fontWeight: '500',
  // },
  choosherContainer: {
    height: calcH(0.08),
    justifyContent: 'center',
    // marginTop: calcW(0.01),
  },
  textChoose: {
    textAlign: 'center',
    color: '#22272E',
    fontSize: 16,
  },

  inActiveBorder: {
    // width: calcW(0.7),
    // height: calcH(0.05),
    flex: 0.7,
    borderColor: colors.inActiveBorder,
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
  waitTime: {
    fontWeight: '500',
    fontSize: RFValue(15),
    color: '#034693',
  },
  waitText: {
    fontWeight: '500',
    fontSize: RFValue(14),
    color: '#034693',
  },
  priceText: {
    left: calcW(0.34),
    fontSize: RFValue(18),
    color: '#034693',
    fontWeight: '400',
  },
  costText: {
    left: calcW(0.2),
    fontWeight: '500',
    fontSize: RFValue(14),
    color: '#034693',
  },
  textTime: {
    fontSize: RFValue(16),
    color: colors.activeBorder,
    fontWeight: 'bold',
  },
  textStyle: {
    color: colors.activeBorder,
    right: calcW(0.02),
  },
});
