import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Platform,
  FlatList,
  SafeAreaView,
} from 'react-native';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  google_api_key,
  textInputHeight,
} from '../../utils/comon';
import Geolocation, {
  getCurrentPosition,
} from 'react-native-geolocation-service';
// import {Button, View, Text, Platform, Alert, StyleSheet} from 'react-native';
// import Geocoder from 'react-native-geocoding';
import axios from 'axios';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import CheckBox from '@react-native-community/checkbox';
import SelectDropdown from 'react-native-select-dropdown';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import commonToast from '../../utils/commonToast';
import MapViewDirections from 'react-native-maps-directions';
import { RFValue } from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';
import { Toast } from 'native-base';
import { BASE_URL } from '../../utils/Api/apiName';
import { StackActions } from '@react-navigation/native';

navigator.geolocation = require('@react-native-community/geolocation');

const getRandomLatitude = (min = 48, max = 56) => {
  return Math.random() * (max - min) + min;
};

const getRandomLongitude = (min = 14, max = 24) => {
  return Math.random() * (max - min) + min;
};

export default function BookingStep2({ navigation, route }) {
  console.log('=====route.params=====>', route.params);
  const [pickUp, setPickup] = useState('');
  const [pickUpLat, setPickUpLat] = useState(0);
  const [pickUpLng, setPickUpLng] = useState(0);
  const [selectID, setSelectID] = useState(null);
  const [position, setPosition] = useState({
    latitude: pickUpLat,
    longitude: pickUpLng,
  });
  const [departuretime, setDeparturetime] = useState(null);
  const [coupon, setCouponList] = useState([]);
  const [modal, setModal] = useState(false);
  const [destinationmodal, setdestinationModal] = useState(false);

  const ref = useRef();

  useEffect(() => {
    fetch();
    requestPermission();
    ref.current?.setAddressText(pickUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const getCouponList = async () => {
      try {
        const token = JSON.parse(await AsyncStorage.getItem('userToken'));
        const response = await axios({
          method: 'GET',
          url: 'https://kabou.us/api/rider/coupon-list',
          headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token.data.data.token}`,
          },
        });
        console.log(response.data);
        setCouponList(response.data.data);
      } catch (error) {
        console.log(error.response);
      }
    };
    navigation.addListener('focus', getCouponList);
    getCouponList();
  }, [navigation]);
  // const getPosition = () => {
  //   if (Platform.OS === 'android') {
  //     check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
  //       if (result === 'granted') {
  //         Geolocation.getCurrentPosition(
  //           pos => {
  //             const {coords} = pos;
  //             setError('');
  //             setPosition({
  //               latitude: pos.coords.latitude,
  //               longitude: pos.coords.longitude,
  //             });

  //             var position1 = {
  //               lat: parseFloat(position.latitude),
  //               lng: parseFloat(position.longitude),
  //             };
  //             Geocoders.geocodePosition(position1).then(res1 => {
  //               console.log('**********************************************');

  //               console.log(res1[1]);
  //               //console.log(res1[1]);
  //               setAddress(res1[1].formattedAddress);
  //               setPickup(res1[1].formattedAddress);
  //               // AsyncStorage.setItem()
  //               setPickUpLat(res1[1].position.lat);
  //               setPickUpLng(res1[1].position.lng);
  //               console.log(
  //                 '===================================================',
  //                 res1[1].position.lat,
  //               );
  //               generateMarkers(pickUpLat, pickUpLng);
  //               fetch();
  //             });
  //           },
  //           e => setError(e.message),
  //         );
  //       } else if (result === 'blocked') {
  //         Alert.alert('App is not permitted to access location.');
  //       }
  //     });
  //   }
  // };

  const [destination, setDestination] = useState('');
  const [destinationlat, setDestinationLat] = useState(0);
  const [destinationlng, setDestinationLng] = useState(0);

  const [focusPick, setFocusPick] = useState(false);
  //const [focusDestination, setFocusDestination] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  //const [focuscarType, setFocuscarType] = useState(false);
  const [vehicledata, setVehicledata] = useState([]);
  const [couponcode, setCouponcode] = useState('');
  const [setModel, setonModel] = useState(false);
  // const [lat, setLat] = useState('');
  // const [lng, setLng] = useState();
  const [selectPrice, setSelectPrice] = useState(null);
  //const [waitingtime, setWaitingTime] = useState(null);
  const [distanceRide, setDistanceRide] = useState(0);

  const rideType = ['Ride for myself', 'Ride for Family & Friend'];

  console.log('PickUp =============> ', pickUp);
  console.log('Destination ==============>  ', destination);

  const setonPressed = (id, price) => {
    //setFocuscarType(!focuscarType)
    // index === 0 ? setFocuscarType(!focuscarType) : setFocuscarType(focuscarType)
    setSelectID(id);
    setSelectPrice(price);
  };

  const requestPermission = () => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        console.warn(result);
        if (result === 'granted') {
          //Alert.alert("Location Permission Granted.");
          checkPermission();
        } else {
          Alert.alert('Oops..', 'Location Permission Not Granted');
          //setAddress('4505 Roane Avenue, Hous.. ')
        }
      });
    }
  };

  const checkPermission = () => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const { coords } = position;
              console.warn('pos================>', coords.latitude);
              setPosition({
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              });
              setPickUpLat(coords.latitude);
              setPickUpLng(coords.longitude);
              setPosition({
                latitude: parseFloat(coords.latitude),
                longitude: parseFloat(coords.longitude),
                // latitudeDelta: 0.0122,
                // longitudeDelta: 0.0051,
                // latitudeDelta: 0.0922,
                // longitudeDelta: 0.0421,
              });
              generateMarkers(pickUpLat, pickUpLng);
              // Geocoder.from(22.69949449, 88.44868688)
              // .then(json => {
              //   var addressComponent = json.results[0].address_components[0];
              //   console.log('address',addressComponent);
              // })
              // .catch(error => console.warn(error));
              var pos = {
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              };

              // Geocoder.geocodePosition(pos)
              //   .then(res => {
              //     //alert(res[0].formattedAddress);
              //     // setLocation(res[1].formattedAddress);
              //     // setCity(res[0].locality);
              //     // setState(res[0].adminArea);
              //     // setPostalcode(res[0].postalCode);
              //     setAddress(res[1].formattedAddress);
              //     console.warn('Address', res);
              //   })
              //   .catch(error => Alert.alert(error));
            },
            error => {
              commonToast({
                text: error.message,
                position: 'top',
                toastFor: 'error',
              });
              //setCurrentCoords({lat: 1, lng: 1});
              // dispatch(outletActions.getAllOutlet(null));
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
            },
          );
        } else if (result === 'blocked') {
          commonToast({
            text: 'App is not permitted to access location',
            position: 'top',
            toastFor: 'error',
          });
          console.warn('errrrrrrrr', result);
          //setCurrentCoords({lat: 1, lng: 1});
          // dispatch(outletActions.getAllOutlet(null));
        }
      });
    } else {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const { coords } = position;
              // setCurrentCoords({
              //   lat: parseFloat(coords.latitude),
              //   lng: parseFloat(coords.longitude),
              // });
              // setLatitude(coords.latitude);
              // setLongitude(coords.longitude);
              // setRegion({
              //   latitude: parseFloat(coords.latitude),
              //   longitude: parseFloat(coords.longitude),
              //   latitudeDelta: 0.0922,
              //   longitudeDelta: 0.0421,
              //   // latitudeDelta: 0.0922,
              //   // longitudeDelta: 0.0421
              // });
              //  dispatch(outletActions.getAllOutlet(coords));
              // Geocoder.from(position.coords.latitude, position.coords.longitude)
              // .then(json => {
              //   console.log(json);
              //   var addressComponent = json.results[0].address_components;
              //   setAddress(addressComponent)
              // })
              // .catch(error => Toast.show(error));
              var pos = {
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              };

              // Geocoder.geocodePosition(pos)
              //   .then(res => {
              //     //alert(res[0].formattedAddress);
              //     // setLocation(res[1].formattedAddress);
              //     // setCity(res[0].locality);
              //     // setState(res[0].adminArea);
              //     // setPostalcode(res[0].postalCode);
              //     // console.warn('Address',res[1].formattedAddress)
              //   })
              //   .catch(error =>
              //     commonToast({
              //       text: error,
              //       position: 'top',
              //       toastFor: 'error',
              //     }),
              //   );
            },
            error => {
              commonToast({
                text: error.message,
                position: 'top',
                toastFor: 'error',
              });
              console.warn('pos================>', error.message);
              //setCurrentCoords({lat: 1, lng: 1});
              // dispatch(outletActions.getAllOutlet(null));
            },
            {
              enableHighAccuracy: true,
              timeout: 20000,
            },
          );
        } else if (result === 'blocked') {
          check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
            if (result === 'granted') {
              Geolocation.getCurrentPosition(
                position => {
                  const { coords } = position;
                  // setCurrentCoords({
                  //   lat: parseFloat(coords.latitude),
                  //   lng: parseFloat(coords.longitude),
                  // });
                  // setLatitude(coords.latitude);
                  // setLongitude(coords.longitude);
                  // Geocoder.from(position.coords.latitude, position.coords.longitude)
                  // .then(json => {
                  //   console.log(json);
                  //   var addressComponent = json.results[0].address_components;
                  //   setAddress(addressComponent)
                  // })
                  // .catch(error => Toast.show(error));
                  var pos = {
                    lat: parseFloat(coords.latitude),
                    lng: parseFloat(coords.longitude),
                  };

                  // Geocoder.geocodePosition(pos)
                  //   .then(res => {
                  //     //alert(res[0].formattedAddress);
                  //     // setLocation(res[1].formattedAddress);
                  //     // setCity(res[0].locality);
                  //     // setState(res[0].adminArea);
                  //     // setPostalcode(res[0].postalCode);
                  //     console.warn('Address', res[1].formattedAddress);
                  //   })
                  //   .catch(error => Toast.show(error));
                },
                error => {
                  commonToast({
                    text: error.message,
                    position: 'top',
                    toastFor: 'error',
                  });
                  console.warn('Address', error.message);
                  //setCurrentCoords({lat: 1, lng: 1});
                  //dispatch(outletActions.getAllOutlet(null));
                },
                {
                  enableHighAccuracy: true,
                  timeout: 20000,
                },
              );
            } else if (result === 'blocked') {
              commonToast({
                text: 'App is not permitted to access location',
                position: 'top',
                toastFor: 'error',
              });
              console.warn('Address', result);
              //setCurrentCoords({lat: 1, lng: 1});
              // dispatch(outletActions.getAllOutlet(null));
            }
          });
        }
      });
    }
  };

  const [markers, setMarkers] = useState([
    {
      id: 0,
      latitude: pickUpLat,
      longitude: pickUpLng,
    },
  ]);
  console.log(markers);
  const generateMarkers = useCallback((lat, long) => {
    const markersArray = [];

    for (let i = 0; i < 5; i++) {
      markersArray.push({
        id: i,
        latitude: getRandomLatitude(
          (lat = pickUpLat - 0.15),
          (lat = pickUpLat + 0.05),
        ),
        longitude: getRandomLongitude(
          (long = pickUpLng - 0.05),
          (long = pickUpLng + 0.05),
        ),
      });
    }
    setMarkers(markersArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetch = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const userToken = token.data.data.token;
    Hud.showHud();
    await axios({
      method: 'GET',
      url: BASE_URL + 'car-list',
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log(JSON.stringify(response.data.data));
        setVehicledata(response.data.data);
        Hud.hideHud();
      })
      .catch(function (error) {
        console.log(error);
        Hud.hideHud();
      });
  };
  // const fetchwaitingTime = async () => {
  //   const token = JSON.parse(await AsyncStorage.getItem('userToken'));
  //   console.log('token_select_car', token);
  //   await axios({
  //     method: 'GET',
  //     url: 'https://kabou.us/api/rider/waiting-time',
  //     headers: {
  //       // Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       Authorization: `Bearer ${token}`,
  //     },
  //   })
  //     .then(function (response) {
  //       console.log(JSON.stringify(response.data));
  //       //fetchPrice()
  //       // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))

  //       setWaitingTime(response.data.data.value);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //     });
  // };

  const setCouponData = async ({ booking_id, coupon_code, balance }) => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('set coupon token', token.data.data.token);
      const userToken = token.data.data.token;
      const data = { booking_id, coupon_code, balance };
      console.log(data);
      const response = await axios({
        url: `${BASE_URL}couponUsed`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error.response);
    }
  };

  // const selectDriver = () => {
  //  // Alert.alert("Data===>"+JSON.stringify(pickUp.structured_formatting.main_text))
  //   Alert.alert("Data++++++++" + JSON.stringify(pickUp))
  //   selectDriver1()
  // }

  const selectDriver = async () => {
console.log("-===============PickUp Location===========",pickUp.name)
    var month = new Date().getMonth() + 1;

    var date =
      new Date().getFullYear() + '-' + month + '-' + new Date().getDate();
    var time = new Date().getHours() + ':' + new Date().getMinutes();
    var pickuptimemint = new Date().getMinutes() + 30;
    if (pickuptimemint >= 60) {
      var time = pickuptimemint - 60;
      var hours = new Date().getHours() + 1;
      // var mint = pickuptimemint % 60;
      var pickUptime = hours + ':' + time;
    } else {
      var pickUptime = new Date().getHours() + ':' + pickuptimemint;
    }
    const routedis = distanceRide * 0.621371;
    // console.log('================routedis========================', routedis);
    // var freewaitTime =
    //   new Date().getHours() + ':' + (new Date().getMinutes() + 2);
    // console.log('>>>>>>>>>>>>>>>>>>', pickUptime);
    // console.log('>>>>>>>>>>>>>>>>>>wait', freewaitTime);
    // console.log("===========Select Price===============", selectPrice)
    // console.log('dateMonth', date);
    setDeparturetime(pickUptime);
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    //console.log('token_select_driver', token.data.data.token);
    const userToken = token.data.data.token;
    // console.log('starting_point', pickUp.structured_formatting.main_text);
    // console.log('destination', destination.structured_formatting.main_text);
    // console.log('date_of_departure', date);
    // console.log('departure_time', time);
    // console.log('latitude_departure', JSON.parse(pickUpLat.toFixed(2)));
    // console.log('longitude_departure', pickUpLng);
    // console.log('latitude_arrival', destinationlat);
    // console.log('longitude_arrival', destinationlng);
    // console.log('type_vehicule', selectID);
    // console.log('price', (routedis * selectPrice).toFixed(2));
    // console.log('distanceRide', distanceRide * 0.621371);

    const data_select_car = {
     
      starting_point: pickUp?.structured_formatting?.main_text? JSON.stringify(pickUp.structured_formatting.main_text) : JSON.stringify(pickUp.name),
      destination: destination.structured_formatting.main_text,
      date_of_departure: date,
      departure_time: time,
      latitude_departure: JSON.parse(pickUpLat),
      longitude_departure: JSON.parse(pickUpLng),
      latitude_arrival: JSON.parse(destinationlat),
      longitude_arrival: JSON.parse(destinationlng),
      type_vehicule: selectID,
      price: (routedis * selectPrice).toFixed(2),
      distance: routedis,
      rider_gps: JSON.stringify({
        coords: {
          accuracy: 17.256000518798828,
          altitude: -50.69999694824219,
          heading: 0,
          latitude: JSON.parse(pickUpLat.toFixed(2)),
          longitude: JSON.parse(pickUpLng.toFixed(2)),
          speed: 0,
        },
        mocked: false,
        timestamp: 1649934316489,
      }),
    };
    const api = BASE_URL + 'select-car';
    console.log('+++++++++++++++', data_select_car);
    console.log('data_select_car=>>>>>>>>>>>', JSON.stringify(data_select_car));
    Hud.showHud();
    await axios({
      url: api,
      method: 'POST',
      data: data_select_car,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        Hud.hideHud();
       
        if (response.data.success !== 'false') {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'success',
          });
        } else {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'error',
          });
        }
        const car = [];
        const value = response.config.data;
        car.push(JSON.parse(value));
        console.log('==========response============== :', response.data);
        // console.log('>>>>>>>>>>>>>', departuretime);
        //console.log('response---------------------', JSON.parse(response.config.data.type_vehicule));
        //AsyncStorage.setItem('verification_code', JSON.stringify(response.data.verify_code))
        if (response.data.success !== 'false') {
          AsyncStorage.setItem('car_id', JSON.stringify(car[0].type_vehicule));
          AsyncStorage.setItem('departureTime', pickUptime);
          navigation.dispatch(StackActions.replace('driverView'));
          AsyncStorage.setItem('data_ride', JSON.stringify(response));
          AsyncStorage.setItem('due_amount', JSON.stringify(response.data.due_amount));
          if (couponcode) {
            setCouponData({
              booking_id: response.data.booking_id,
              balance: routedis * selectPrice,
              coupon_code: couponcode,
            });
          }
        }

        //AsyncStorage.setItem('destination_place', JSON.stringify(destination))
      })
      .catch(function (error) {
        // Alert.alert("==========="+ error)
        console.log('error  :', error.response.data.message);
        Hud.hideHud();
        const errorpay = error.response.data.message;
        console.log(errorpay);
        if (errorpay == 'Card Declined. Add another card for further process.') {
          Alert.alert(
            'Sorry',
            'Card Declined. Add another card for further process.',
            [
              { text: 'OK', onPress: () => navigation.navigate('editProfile') },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ],
          );
        }
        else {
          Alert.alert(
            'Sorry',
            'Please update your profile and payment information. Otherwise, you cannot book a cab.',
            [
              { text: 'OK', onPress: () => navigation.navigate('payment') },
              
            ],
          );

        }

      });
  };
  const origin = { latitude: pickUpLat, longitude: pickUpLng };
  const destinationroute = {
    latitude: destinationlat,
    longitude: destinationlng,
  };
  const mapRef = useRef();
  const GOOGLE_MAPS_APIKEY = google_api_key;

  console.log(vehicledata);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <View style={styles.queryContainer}>
          <View style={styles.firstContainer}>
            <TouchableOpacity
              style={styles.arrowContainer}
              onPress={() => navigation.navigate('TabScreen')}>
              {!destinationmodal ? (
                <Image
                  style={styles.arrowIcon}
                  source={require('../../../assets/images/back_arrow.png')}
                />
              ) : (
                <View style={styles.arrowIcon} />
              )}
            </TouchableOpacity>

            {modal === true ? null : (
              <TouchableOpacity
                style={styles.middleContainer}
                onPress={() => setModal(true)}>
                {/* <View style={styles.middleContainer}> */}
                <Image
                  style={styles.circleIcon}
                  source={require('../../../assets/images/circle.png')}
                  resizeMode={'contain'}
                />
                {/* </View> */}

                <View
                  keyboardShouldPersistTaps="handled"
                  style={styles.fromContainer}>
                  {/* <TextInput
                      style={styles.textInput}
                      editable={false}
                      value={pickUp.description}
                      onChange={(value)=>setPickup(value)}
                      /> */}
                  {pickUp === '' ? (
                    <Text style={styles.textInput}>PickUp Location</Text>
                  ) : (
                    <Text style={styles.textInput}>{pickUp.description ? pickUp.description : pickUp.vicinity}
                    
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
            <Modal
              visible={modal}
              transparent
              focusable={true}
              onDismiss={() => {
                setModal(false);
              }}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.0)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  // keyboardShouldPersistTaps="a"
                  style={{
                    top: Platform.OS === 'ios' ? calcH(0.06) : calcH(0.01),
                    width: calcW(0.9),
                    // maxHeight: calcH(0.1),
                    // paddingRight: 0,
                    // paddingLeft: 0,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    left: calcW(0.05),
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={styles.arrowContainer}
                    onPress={() => setModal(false)}>
                    <Image
                      style={styles.arrowIcon}
                      source={require('../../../assets/images/back_arrow.png')}
                    />
                  </TouchableOpacity>
                  <GooglePlacesAutocomplete
                    // style={styles.textInput}
                    // autoFocus={true}
                    //  listViewDisplayed={true}
                    numberOfLines={1}
                    ref={ref.current?.focus()}

                    fetchDetails={true}

                    keyboardShouldPersistTaps="always"

                    placeholder="Pick up location"
                    textInputProps={{
                      //   autoFocus:true,
                      // focusable:true,

                      //     keyboardAppearance:'default'
                      placeholderTextColor: 'black'
                    }}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      // getPosition()
                      setPickup(data, details);
                      console.log("=========Pick up location==========", data.vicinity);
                    
                      //Alert.alert("")
                      console.log("=========Pick up ==========", details);
                      setPickUpLat(details.geometry.location.lat);
                      setPickUpLng(details.geometry.location.lng);
                      // setMarkers(...coordinate, coordinate[0].latitude=details.geometry.location.lat,coordinate[0].longitude=details.geometry.location.lng)
                      //setCoordinate(...coordinate, coordinate[0].longitude=details.geometry.location.lng)
                      console.log('lat&lng ===> ', details.geometry.location.lat);
                      console.log('lat&lng ===> ', details.geometry.location.lng);
                      setModal(false);
                      //setCoordinate(coordinate.map((item)=> item.latitude=details.geometry.location.lat) )
                    }}
                  
                    minLength={2}
                    styles={{
                      listView: {
                        borderColor: '#BEBEBE',
                        position: 'absolute',
                        top: calcH(0.1),
                        flex: 1,
                        width: calcW(1),
                      },
                      textInputContainer: {
                        width: calcW(0.78),
                        backgroundColor: '#fff',
                        //paddingHorizontal: calcH(0.02),
                        borderRadius: allRadius,
                        //padding: calcH(0.025),
                        //paddingTop: calcH(0.04),
                        height: textInputHeight,
                        borderWidth: 0,
                        alignSelf: 'center',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,
                        //backgroundColor: '#000',
                      },
                      description: {
                        fontWeight: 'bold',
                      },
                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                      row: {
                        backgroundColor: '#fff',
                      },
                      textInput: {
                        marginTop: calcH(0.01),
                        height: textInputHeight,
                        borderWidth: 1,
                        borderColor: colors.activeBorder,
                        fontSize: RFValue(15),
                        alignSelf: 'center',
                        borderRadius: allRadius,
                        marginBottom: calcH(0.02),
                        color: '#000',
                        //backgroundColor: colors.buttonColor,
                      },
                      container: {
                        width: calcW(0.75),
                        borderColor: '#A0A0A0',
                        borderWidth: 0,
                        borderRadius: allRadius,
                      },
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    GooglePlacesSearchQuery={{
                      rankby: 'distance',
                      type: 'street',
                    }}
                    
                    currentLocation={true}
                    currentLocationLabel="Current Location"
                    query={{
                      key: google_api_key,
                      language: 'en',
                      //location: currentLocation ? `${currentLocation.latitude},${currentLocation.longitude}` : null,
                      radius: 5000, // Change this radius as per your requirement
                    }}
                  
                    // GoogleReverseGeocodingQuery={{

                    //   key: '',
                    //   language: 'en',
                    // }}

                    
                    // GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                    debounce={300}
                  // Will add a 'Current location' button at the top of the predefined places list                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  />
                </View>
              </View>
            </Modal>
          </View>

          {/* <IconMaterialCommunityIcons style={{left: calcW(0.085)}}
                                    size={20}
                                    name={'dots-vertical'}
                                  /> */}

          <View style={styles.secondContainer}>
            <TouchableOpacity
              style={styles.arrowContainer}
            //onPress={() => navigation.navigate('')}
            >
              <Text>{''}</Text>
            </TouchableOpacity>
            {destinationmodal === true ? null : (
              <TouchableOpacity
                style={styles.middleContainer}
                onPress={() => setdestinationModal(true)}>
                {/* <View style={styles.middleContainer}> */}
                <Image
                  style={styles.circleIcon}
                  source={require('../../../assets/images/location.png')}
                  resizeMode={'contain'}
                />
                {/* </View> */}

                <View
                  keyboardShouldPersistTaps="handled"
                  style={styles.fromContainer}>
                  {/* <TextInput
                      style={styles.textInput}
                      editable={false}
                      value={pickUp.description}
                      onChange={(value)=>setPickup(value)}
                      /> */}
                  {destination === '' ? (
                    <Text style={styles.textInput}>Destination Location</Text>
                  ) : (
                    <Text style={styles.textInput}>
                      {destination.description}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}

            <Modal visible={destinationmodal} transparent={true}>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0)',
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  keyboardShouldPersistTaps="handled"
                  style={{
                    top: Platform.OS === 'ios' ? calcH(0.13) : calcH(0.081),
                    width: calcW(0.9),
                    // maxHeight: calcH(0.1),
                    // paddingRight: 0,
                    // paddingLeft: 0,
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    left: calcW(0.07),
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    style={styles.arrowContainer}
                    onPress={() => setdestinationModal(false)}>
                    <Image
                      style={styles.arrowIcon}
                      source={require('../../../assets/images/back_arrow.png')}
                    />
                  </TouchableOpacity>
                  <GooglePlacesAutocomplete
                    ref={ref}
                    autoFocus={true}
                    fetchDetails={true}
                    renderDescription={row =>
                      row.description || row.formatted_address || row.name
                    }
                    keyboardShouldPersistTaps="always"
                    placeholder="Destination"
                    placeholderTextColor={'black'}

                    textInputProps={{
                      //   autoFocus:true,
                      // focusable:true,

                      //     keyboardAppearance:'default'
                      placeholderTextColor: 'black'
                    }}
                    nearbyPlacesAPI="GoogleReverseGeocoding"
                    currentLocationLabel="current location"
                    predefinedPlacesAlwaysVisible={true}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      console.log("=========Data================", data, details);
                      setDestination(data, details);
                      setDestinationLat(details.geometry.location.lat);
                      setDestinationLng(details.geometry.location.lng);
                      console.log('////', details.geometry.viewport.northeast);
                      console.log('=========deslat&lng===========', details.geometry.location.lat);
                      console.log('=========deslat&lng===========', details.geometry.location.lng);
                      //setCoordinate(...coordinate[1],coordinate[1].latitude=details.geometry.location.lat, coordinate[1].longitude=details.geometry.location.lng )
                      setdestinationModal(false);
                    }}
                    query={{
                      key: google_api_key,
                      language: 'en',
                    }}
                    styles={{
                      listView: {
                        borderColor: '#BEBEBE',
                        position: 'absolute',
                        top: calcH(0.1),
                      },
                      textInputContainer: {
                        width: calcW(0.75),
                        backgroundColor: '#fff',
                        // paddingHorizontal: calcH(0.02),
                        borderRadius: allRadius,
                        // padding: calcH(0.025),
                        // paddingTop: calcH(0.04),
                        height: textInputHeight,
                        borderWidth: 0,
                        alignSelf: 'center',
                        borderTopWidth: 0,
                        borderBottomWidth: 0,

                      },
                      description: {
                        fontWeight: 'bold',
                      },
                      predefinedPlacesDescription: {
                        color: '#1faadb',
                      },
                      row: {
                        backgroundColor: '#fff',
                      },
                      textInput: {
                        marginTop: calcH(0.008),
                        fontSize: RFValue(15),
                        alignSelf: 'center',
                        height: textInputHeight,
                        borderRadius: allRadius,
                        borderColor: colors.activeBorder,
                        borderWidth: 1,
                        //width: calcW(0.8),

                        marginBottom: calcH(0.02),
                        color: '#000',
                      },
                      container: {
                        width: calcW(0.75),
                        borderColor: '#A0A0A0',
                        borderWidth: 0,
                        borderRadius: allRadius,

                      },
                    }}
                    // nearbyPlacesAPI="GooglePlacesSearch"
                    GooglePlacesSearchQuery={{
                      rankby: 'distance',
                      type: 'street',
                    }}
                    // GooglePlacesDetailsQuery={{ fields: 'formatted_address' }}
                    debounce={10}
                  //currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  // Will add a 'Current location' button at the top of the predefined places list                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  />
                </View>
              </View>
            </Modal>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}>
          {/* <Text>{console.warn(coordinate)}</Text> */}
          <View style={{ flex: 1 }}>
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
                  latitude: pickUpLat,
                  longitude: pickUpLng,
                  latitudeDelta: 0.355,
                  longitudeDelta: 0.121,
                }}
                loadingEnabled
                zoomEnabled
                followsUserLocation={true}
                showsMyLocationButton={true}
                moveOnMarkerPress={true}
                //showsScale={true}
                showsTraffic={true}
                showsBuildings={true}
                userLocationUpdateInterval={1}>
                <Marker
                  draggable
                  coordinate={{ latitude: pickUpLat, longitude: pickUpLng }}
                />
                <Marker
                  draggable
                  coordinate={{
                    latitude: destinationlat,
                    longitude: destinationlng,
                  }}
                />

                {/* <Polyline
            coordinates={[
              { latitude: pickUpLat, longitude: pickUpLng },
              { latitude: destinationlat, longitude: destinationlng },
            ]}
            strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
            strokeColors={['#7F0000']}
            strokeWidth={2}
          /> */}
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
                    console.log(`Distance: ${result.distance} m`);
                    setDistanceRide(result.distance);
                    // console.log(`Duration: ${result.duration} min.`);
                    // console.log(
                    //   `Duration: ${JSON.stringify(result.coordinates)} min.`,
                    // );
                    mapRef.current.fitToCoordinates(result.coordinates, {
                      edgePadding: {
                        right: 50,
                        bottom: 50,
                        left: 50,
                        top: 100,
                      },
                    });
                  }}
                />
                {markers.map(item => (
                  <Marker
                    key={item.id}
                    coordinate={{
                      latitude: item.latitude,
                      longitude: item.longitude,
                    }}>
                    <View>
                      <Image
                        source={require('../../../assets/images/car_premium.png')}
                        style={{ width: calcW(0.15), height: calcH(0.03) }}
                      />
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>

            <View style={styles.lowerContainer}>
              <SelectDropdown
                data={rideType}
                defaultValueByIndex={route.params?.name ? 1 : 0}
                buttonStyle={{
                  backgroundColor: colors.buttonColor,
                  alignItems: 'center',
                  width: calcW(0.9),
                  height: calcH(0.05),
                  top: calcH(-0.02),
                }}
                dropdownIconPosition={'right'}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index);
                  if (selectedItem === rideType[1]) {
                    navigation.navigate('familyRide');
                  }
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  // text represented after item is selected
                  // if data array is an array of objects then return selectedItem.property to render after item is selected
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  // text represented for each item in dropdown
                  // if data array is an array of objects then return item.property to represent item in dropdown
                  return item;
                }}
              />

              <View style={styles.choosherContainer}>
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate('bookingStep3')}> */}
                <Text style={styles.textChoose}>Choose your vehicle</Text>
                {/* </TouchableOpacity> */}
              </View>
              <FlatList
                style={{ flex: 1, borderColor: '#000', borderWidth: 0 }}
                data={vehicledata}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={() =>
                          setonPressed(
                            item.id,
                            item?.base_price_data?.base_price,
                          )
                        }>
                        <View
                          style={{
                            ...styles.detailsContainer,
                            backgroundColor:
                              item.id === selectID ? '#DCDCDC' : '#fff',
                          }}>
                          <View style={styles.carContainer}>
                            {item.id == 2 ? (
                              <Image
                                style={styles.carImage}
                                source={require('../../../assets/images/car_silver.png')}
                                resizeMode="contain"
                              />
                            ) : (
                              <Image
                                style={styles.carImage}
                                source={require('../../../assets/images/car_premium.png')}
                                resizeMode="contain"
                              />
                            )}
                          </View>
                          <View style={styles.desContainer}>
                            <Text style={styles.title}>{item.name}</Text>
                            <Text style={styles.subtitle}>
                              Reach in 5:00 min
                            </Text>
                          </View>
                          <View style={styles.priceContainer}>
                            <Text style={styles.title}>
                              ${item?.base_price_data?.base_price}/mi
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              <View style={[styles.checkBoxContainer, { marginBottom: 3 }]}>
                <CheckBox
                  disabled={false}
                  tintColors={
                    toggleCheckBox ? colors.buttonColor : colors.inActiveBorder
                  }
                  value={toggleCheckBox}
                  onValueChange={newValue => {
                    setToggleCheckBox(newValue);
                    if (newValue) {
                      setonModel(true);
                    }
                  }}
                />
                <Modal
                  visible={setModel}
                  transparent={true}
                  onDismiss={() => {
                    setonModel(false);
                  }}>
                  <View
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        backgroundColor: '#fff',
                        width: calcW(0.8),
                        height: calcH(0.22),
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: allPadding,
                      }}>
                      {/* <Text style={styles.text}>There are many variations of passages of</Text>
                          <Text style={styles.text}> Lorem Ipsum available</Text> */}
                      <View style={styles.fromContainer}>
                        <View
                          style={
                            focusPick === true
                              ? styles.activeBorder
                              : [
                                styles.inActiveBorder,
                                { marginLeft: calcW(0.09) },
                              ]
                          }>
                          <TextInput
                            style={{ color: 'black', padding: 8 }}
                            placeholder="Enter coupon code"
                            placeholderTextColor={"black"}
                            value={couponcode}
                            // onBlur={() => onBlurTextInputPick()}
                            // onFocus={() => onFocusTextInputPick()}
                            onChangeText={text => setCouponcode(text)}
                          />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{
                          width: calcW(0.4),
                          backgroundColor: colors.buttonColor,
                          height: calcH(0.05),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: allRadius,
                          marginBottom: 5,
                        }}
                        onPress={() => {
                          if (
                            coupon?.find(i => i?.coupon_code === couponcode)
                          ) {
                            console.log('yyyyyyyyyy', couponcode);
                            commonToast({
                              text: '"Coupon data saved successfully".',
                              position: 'top',
                              toastFor: 'success',
                            });
                            setonModel(false);
                          } else {
                            commonToast({
                              text: 'Please enter the correct coupon code.',
                              position: 'top',
                              toastFor: 'error',
                            });
                          }
                        }}>
                        <Text style={styles.btnconfirmText}>Confirm</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: calcW(0.4),
                          backgroundColor: colors.dalert,
                          height: calcH(0.05),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: allRadius,
                        }}
                        onPress={() => {
                          setCouponcode('');
                          setToggleCheckBox(false);
                          setonModel(false);
                        }}>
                        <Text style={styles.btnconfirmText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
                <Text
                  style={[
                    styles.subText,
                    { fontSize: RFValue(16), flex: 1, textAlign: 'left' },
                  ]}>
                  {' '}
                  Apply Coupon
                </Text>
              </View>

              <View style={styles.btnconfirmContainer}>
                <View style={styles.btnContainer}>
                  <TouchableOpacity
                    style={styles.btnConfirm}
                    onPress={
                      () => selectDriver()
                      // navigation.navigate('bookingStep3', {userPickup: pickUp,userDestination : destination})
                    }>
                    <Text style={styles.btnconfirmText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // padding: 15,
  },
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
  },
  queryContainer: {
    width: calcW(1),
    height: calcH(0.14),
    top: calcH(-0.01),
    // flex: 1,
    alignItems: 'center',
    //padding: allPadding,
    borderColor: '#000',
    borderWidth: 0,
  },
  firstContainer: {
    // marginTop:calcW(0.02),
    flexDirection: 'row',
    height: calcH(0.085),
    // backgroundColor: colors.primary,
  },
  dottedContainer: {},
  dottIcon: {
    //  height: calcH(0.1),
  },
  secondContainer: {
    marginTop: calcW(-0.025),
    flexDirection: 'row',
    height: calcH(0.085),
    // backgroundColor: colors.buttonColor,
  },
  arrowContainer: {
    justifyContent: 'center',
    width: calcW(0.1),
    
  },
  arrowIcon: {
    width: calcW(0.04),
    height: calcH(0.015),
  },
  middleContainer: {
    width: calcW(0.74),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    padding: calcW(0.02),
    alignItems: 'center',
    //paddingVertical: 0,
    right: calcW(0.01),
    backgroundColor: colors.buttonAnothercolor,
    //left: calcW(0.01),
    justifyContent: 'center',
  },
  circleIcon: {
    width: calcW(0.03),
    height: calcW(0.03),
    left: calcW(0.03),
    marginEnd: calcW(0.03),
  },
  fromContainer: {
    //top:calcH(0.01),
    width: calcW(0.7),
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingEnd: calcW(0.03),
    // left: calcW(0.005),
    //paddingTop: 8
    //  flex: 1,
    // backgroundColor: colors.buttonColor,
  },
  textInput: {
    fontSize: RFValue(18),
    flex: 1,
    marginLeft: calcW(0.027),
    justifyContent: 'center',
    alignItems: 'center',
    // color: colors.activeBorder,
    borderColor: '#000',
    borderRadius: 1,
    height: calcH(0.3),
  },
  textChoose: {
    textAlign: 'center',
    color: '#22272E',
    fontSize: RFValue(16),
  },
  mapContainer: {
    // width: calcW(1),
    // height: calcH(0.43),
    flex: 1,
    borderWidth: 0,
    backgroundColor: colors.buttonAnothercolor,
    // borderTopColor: colors.buttonAnothercolor,
    // borderBottomColor: colors.buttonAnothercolor,
  },

  lowerContainer: {
    marginTop: calcW(0.02),
    //height: calcH(0.38),
    flex: 1,
    padding: allPadding,
  },
  mapView: {
    width: calcW(1),
    height: calcH(0.43),
    alignItems: 'center',
  },
  btnMainContainer: {
    height: calcH(0.08),
  },

  btnconfirmContainer: {
    height: calcH(0.024),
    marginTop: calcH(0.01),
    marginBottom: calcH(0.03),
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
    position: 'absolute',
  },
  antIcon: {
    position: 'relative',
    marginTop: calcH(0.018),
    left: calcW(0.35),
  },

  btnConfirm: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
  },
  btnconfirmText: {
    textAlign: 'center',
    fontSize: RFValue(18),
    color: '#fff',
    fontWeight: '500',
  },
  btnText: {
    left: calcW(0.08),
    fontSize: RFValue(15),
    color: colors.textHeader,
    fontWeight: '500',
  },
  choosherContainer: {
    height: calcH(0.03),
    justifyContent: 'center',
    marginTop: calcW(-0.04),
  },

  inActiveBorder: {
    width: calcW(0.5),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginBottom: calcH(0.02),
    // marginVertical: calcH(0.082),
    // flexDirection: 'row',
    // paddingHorizontal: allPadding,
    // alignItems: 'center',
    // paddingVertical: calcH(0.0038),
    // left: calcW(0.1),
  },
  activeBorder: {
    width: '100%',
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    height: calcH(0.02),
  },
  // detailsContainer: {
  //   marginTop: calcW(0.01),
  //   height: calcW(0.08),
  //   width: calcW(0.9),
  //   flexDirection: 'row',
  //   // backgroundColor: colors.buttonColor
  // },
  detailsContainer: {
    //marginTop: calcW(0.0),
    // height: calcW(0.12),
    // width: calcW(0.9),
    flex: 1,
    flexDirection: 'row',
  },

  carContainer: {
    // width: calcW(0.25),
    flex: 0.5,
    justifyContent: 'center',
    padding: allPadding,
    // backgroundColor: colors.buttonColor
  },
  carImage: {
    left: calcW(0.016),
    width: calcW(0.15),
    height: calcH(0.0365),
  },
  desContainer: {
    // width: calcW(0.48),
    flex: 1,
    padding: 5,
    justifyContent: 'center',
  },
  title: {
    color: '#3B4045',
    fontSize: RFValue(15),
    fontWeight: '500',
  },
  subtitle: {
    color: '#3B4045',
    fontSize: RFValue(15),
    fontWeight: '400',
  },
  priceContainer: {
    // width: calcW(0.15),
    flex: 1,
    borderColor: '#000',
    borderWidth: 0,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: calcW(0.01),
    height: calcH(0.07),
    //marginTop: calcW(0.02),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
  },
  subText: {
    fontSize: RFValue(16),
    color: colors.subHeader,
    marginVertical: calcH(0.025),
    textAlign: 'center',
    height: calcH(0.03),
    //backgroundColor: colors.buttonAnothercolor,
  },
  activeBackground: {
    backgroundColor: '#808080',
    borderColor: '#000',
    borderWidth: 2,
  },
  inActiveBackground: {
    backgroundColor: '#fff',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: calcH(1.0),
    width: calcW(1.0),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
