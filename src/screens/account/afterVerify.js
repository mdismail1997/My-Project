import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
  Linking,
  Alert,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  google_api_key,
} from '../../utils/comon';
// import {ScreenScrollComponent, HeaderComponent} from '../../commonItem/index';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  MarkerAnimated,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Header from '../../Header/Header';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import MapViewDirections from 'react-native-maps-directions';
import { RFValue } from 'react-native-responsive-fontsize';
import { firebase } from '@react-native-firebase/database';
import Hud from '../../utils/hud';
import { BASE_URL } from '../../utils/Api/apiName';

import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import {
  showFloatingBubble,
  hideFloatingBubble,
  checkPermission as checkFloatingButtonPermission,
  initialize,
  requestPermission,
} from 'react-native-floating-bubble';
import BaseModal from '../../Components/BaseModal';

// const getRandomLatitude = (min = 48, max = 56) => {
//   return Math.random() * (max - min) + min;
// };

// const getRandomLongitude = (min = 14, max = 24) => {
//   return Math.random() * (max - min) + min;
// };
const reference = firebase
  .app()
  .database('https://kabou-rider-default-rtdb.firebaseio.com/');

let charge = 0;
let positionWatchUnsubscribe = null;

const AcceptRide = ({ navigation, route }) => {
  const markerRef = useRef();
  const modalRef = useRef();
  const locationRef = useRef();
  let timer = 0;
  let secondtimer = 0;

  const { width } = useWindowDimensions();

  const [currentLongitude, setCurrentLongitude] = useState(22.5734368);
  const [currentLatitude, setCurrentLatitude] = useState(88.4305629);
  const [driverCoordinate, setDriverCoordinate] = useState(
    new AnimatedRegion({
      latitude: 22.5734368,
      longitude: 88.4305629,
    }),
  );
  const [driverHeading, setDriverHeading] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');
  const [codeVerify, setcodeVerify] = useState(0);
  const [timecharge, setTimecharge] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [pickup, setPickup] = useState('');
  const [pickuplat, setPickuplat] = useState(22.5734368);
  const [pickuplng, setPickuplng] = useState(88.4305629);
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState(null);
  const [waitingcharge, setWaitingcharge] = useState(0);
  const [waitingtime, setWaitingtime] = useState(0);
  const [stoppagetime, setStoppagetime] = useState(false);
  const [bookingId, setBookingId] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [verify, setVerify] = useState(true);
  const [priceRide, setpriceRide] = useState(0);
  const [cellphone, setcellphone] = useState(0);
  const timeOut = useRef(undefined);
  const drivelocation = useRef(undefined);

  const startForegroundService = async (destLat, destLong, _bookingId) => {
    ReactNativeForegroundService.remove_task('taskIdAcceptRide');
    ReactNativeForegroundService.add_task(
      () => {
        positionWatchUnsubscribe &&
          Geolocation.clearWatch(positionWatchUnsubscribe);
        positionWatchUnsubscribe = Geolocation.watchPosition(position => {
          Geolocation.clearWatch(positionWatchUnsubscribe);

          console.warn('my current distance=======', position.coords);
          reference.ref(`/driver-location/${_bookingId}`).set(
            {
              driverlat: position.coords.latitude,
              driverlng: position.coords.longitude,
              driverHeading: position.coords.heading,
            },
            error => {
              if (error) {
                console.error('firebase error', error);
              } else {
                console.warn('data set successfully');
              }
            },
          );
        });
      },
      {
        delay: 1000,
        onLoop: true,
        taskId: 'taskIdAfterVerify',
        onError: e => console.log('Error logging:', e),
      },
    );
    ReactNativeForegroundService.start({
      id: 145,
      title: 'Navigation started to drop customer',
      message: 'You are ready to go. Safe Journey.',
    });
  };

  const completeRide = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('++++++++++++++++++++++++++++++++++++++location', token);
    const body = {
      booking_id: bookingId,
      complete_lat: currentLatitude,
      complete_long: currentLongitude,
      Waiting_time: waitingtime,
      Waiting_charge: waitingcharge,
      stoppage_time: minutes * 60 + seconds,
      stoppage_charge: timecharge,
    };
    console.log('data', body);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'complete-ride',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        console.log('Complete Ride ', response);
        Hud.hideHud();
      })
      .catch(err => {
        console.log('err2', JSON.stringify(err.response.data.message));
        Hud.hideHud();
      });
  };
  const nextRide = async () => {
    if (Platform.OS === 'android') {
      //notificationContext.usernotificationstatusnext = 'next';
      ReactNativeForegroundService.remove_task('taskIdAfterVerify');
      await ReactNativeForegroundService.stop();
    }
    reference.ref(`/waiting/${bookingId}`).off('value');
    reference.ref(`/booking/${bookingId}`).off('value');
    clearTimeout(timeOut.current);
    reference
      .ref(`/driver-location/${bookingId}`)
      .off('value', locationRef.current);
    clearInterval(drivelocation.current);
    getdestinationNotification();
    completeRide();
    setVerify(false);
    navigation.navigate('homeScreen');
  };

  useEffect(() => {
    getDocument();
    const unsubscribe = navigation.addListener('focus', () => {
      setSeconds(0);
      setMinutes(0);
      setTimecharge(0);
      getDocument();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlestoppage = useCallback(
    value => {
      // console.log('1111111111111', value);
      // settimer(value + 1);
      secondtimer += 1;

      setSeconds(secondtimer);
      if (secondtimer === 59) {
        secondtimer = 0;
        timer += 1;
        setMinutes(timer);
        if (timer % 2 === 0) {
          charge += 1;
          setTimecharge(charge);
        }
      }

      reference
        .ref(`/booking/${bookingId}`)
        .set(typeof value === 'object' ? 0 : value + 1);
      // .then(snapshot => {
      //   console.log('User data: ', snapshot.snapshot.val());
      // });
    },
    [bookingId],
  );

  useEffect(() => {
    const data = reference
      .ref(`/booking/${bookingId}`)
      .on('value', snapshot => {
        //setSeconds(snapshot.val());
        //setTimecharge(snapshot.val() + 2);
        // console.log('bookingId', bookingId);
        // console.log('value!!! ', snapshot.val());
        clearTimeout(timeOut.current);
        if (stoppagetime) {
          timeOut.current = setTimeout(() => {
            handlestoppage(snapshot.val());
          }, 1000);
        }
      });
    return () => {
      reference.ref(`/booking/${bookingId}`).off('value', data);
      clearTimeout(timeOut.current);
    };
  }, [stoppagetime, bookingId, handlestoppage]);

  useEffect(() => {
    requestLocationPermission();
    return () => {
      Geolocation.stopObserving();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
      subscribeLocationLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          //To Check, If Permission is granted
          getOneTimeLocation();
          subscribeLocationLocation();
          //getDocument()
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === 'android') {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      }
    } else {
      driverCoordinate
        .timing({
          ...newCoordinate,
          useNativeDriver: Platform.OS === 'ios' ? false : true,
          duration: 7000,
        })
        .start();
    }
  };

  const getOneTimeLocation = async () => {
    //const timeChargewait = JSON.parse(await AsyncStorage.getItem('waitingChargenext'))

    setLocationStatus('Getting Location ...');
    setLocationStatus('Getting Location ...');
    Geolocation.getCurrentPosition(
      //Will give you the current location
      position => {
        setLocationStatus('You are Here');
        console.log(position);
        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        setDriverCoordinate(
          new AnimatedRegion({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }),
        );
        animate(position.coords.latitude, position.coords.longitude);
        setDriverHeading(position.coords.heading);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      },
    );
  };

  const getDocument = async () => {
    // getProfiledoc();
    const timeChargewait = route.params.waitingcharge;
    const timeWait = route.params.waitingTime;
    console.log('++++++', timeChargewait);
    console.log('timeWait', timeWait);
    setWaitingcharge(timeChargewait);
    setWaitingtime(timeWait);
    const riderListAll = JSON.parse(await AsyncStorage.getItem('rideRequest'));
    const riderList = riderListAll.booking_data;
    console.log(
      'riderList.data.data[riderList.data.data.length - 1]',
      riderList,
    );
    const riderDetails = riderListAll.rider_details;
    setBookingId(riderList.id);
    setcodeVerify(riderList.code);
    setDestination(riderList.destination);
    setPickup(riderList.starting_point);
    setDepartureTime(riderList.departure_time);
    setPickuplat(riderList.latitude_arrival);
    setPickuplng(riderList.longitude_arrival);
    setpriceRide(riderList.price);
    setImage(riderDetails.profile_photo);
    setcellphone(riderDetails.cellphone);
    setName(riderDetails.name);
  };

  const subscribeLocationLocation = () => {
    const watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log('subscribeLocationAfterVerify', position);

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        //generateMarkers(currentLatitude, currentLongitude);
        /* setDriverCoordinate(
          new AnimatedRegion({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }),
        ); */
        animate(position.coords.latitude, position.coords.longitude);
        setDriverHeading(position.coords.heading);
        if (position.coords.speed < 5) {
          setStoppagetime(true);
        }
        if (position.coords.speed > 5) {
          setStoppagetime(false);
        }
        reference.ref(`/driver-location/${bookingId}`).set({
          driverlat: position.coords.latitude,
          driverlng: position.coords.longitude,
          driverHeading: position.coords.heading,
        });
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
        interval: 1000,
        showsBackgroundLocationIndicator: true,
      },
    );
  };

  const getdestinationNotification = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('++++++++++++++++++++++++++++++++++++++location', token);
    const body = {
      booking_id: bookingId,
    };
    console.log('data', body);
    //Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'destination-notification',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        console.log('destination notification ', response);
        Hud.hideHud();
      })
      .catch(err => {
        console.log('err2', JSON.stringify(err.response.data.message));
        Hud.hideHud();
      });
  };
  const driverlocation = useCallback(
    value => {
      // console.log('valuelocationfinal!!! ', value);
      Geolocation.getCurrentPosition(
        //Will give you the current location
        position => {
          setLocationStatus('You are Here');
          console.log('position', position);
          //setOrigin(position.coords);
          //getting the Longitude from the location json
          const currentLongitude = JSON.stringify(position.coords.longitude);

          //getting the Latitude from the location json
          const currentLatitude = JSON.stringify(position.coords.latitude);

          //Setting Longitude state
          // setCurrentLongitude(currentLongitude);

          //Setting Longitude state
          // setCurrentLatitude(currentLatitude);
          // setCurrentCoords({currentLatitude, currentLongitude});
          setDriverHeading(position.coords.heading);
          reference.ref(`/driver-location/${bookingId}`).set({
            driverlat: position.coords.latitude,
            driverlng: position.coords.longitude,
            driverHeading: position.coords.heading,
            otpVerify: false,
          });
        },
      );
      //requestLocationPermission();
      // reference.ref(`/driver-location/${bookingId}`).set({
      //   value: {
      //     driverlat: currentLatitude,
      //     driverlng: currentLongitude,
      //   },
      // });
    },
    [bookingId],
  );

  useEffect(() => {
    locationRef.current = reference
      .ref(`/driver-location/${bookingId}`)
      .on('value', snapshot => {
        //setSeconds(snapshot.val());
        //setTimecharge(snapshot.val() + 2);
        console.log('bookingId', bookingId);
        console.log('===========Afterverify valuelocationfinal!!!============', snapshot.val());

        clearInterval(drivelocation.current);
        if (verify) {
          drivelocation.current = setInterval(() => {
            driverlocation(snapshot.val());
          }, 1000);
        }
      });
    return () => {
      reference
        .ref(`/driver-location/${bookingId}`)
        .off('value', locationRef.current);
      clearInterval(drivelocation.current);
    };
  }, [verify, bookingId, driverlocation]);

  const permissionRequest = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  });

  const askAlwaysLocationPermission = () => {
    Alert.alert(
      'Background Location access request',
      'This app collects background location data to enable location tracking feature for better results even when the app is closed or not in use \nGive permission for Allow all the time',
      [
        {
          text: 'ok',
          onPress: async () => {
            await request(permissionRequest);
          },
        },
        { text: 'cancel' },
      ],
    );
  };

  const openMap = async () => {
    await startForegroundService(pickuplat, pickuplng, bookingId);
    const lat = pickuplat;
    const lng = pickuplng;
    const scheme = Platform.select({
      ios: 'maps://q?',
      android: 'google.navigation:q=',
    });
    const latLng = `${lat},${lng}`;
    const label = 'Custom Label';
    const url = Platform.select({
      ios: `${scheme}daddr=${latLng}&dirflg=d&t=m`,
      android: `${scheme}${latLng}`,
    });

    const isOpen = await Linking.openURL(url);
    return isOpen;
  };

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Background Location access request',
      'This app collects background location data to enable location tracking feature for better results even when the app is closed or not in use \nGive permission for Allow all the time',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => onDirectionButton() },
      ],
    );

  const onDirectionButton = async () => {
    const backgroundgranted = await request(permissionRequest);
    if (
      backgroundgranted === RESULTS.GRANTED ||
      (Platform.OS === 'android' && Platform.Version < 29)
    ) {
      if (Platform.OS === 'android') {
        await floatingButtonStatus();
      }
      if (Platform.OS === 'ios') {
        await openMap();
      }
    } else {
      async () => {
        await request(permissionRequest);
      };
      // askAlwaysLocationPermission();
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Please enable location permission.',
          ToastAndroid.SHORT,
        );
      }
      console.warn('Please enable location permission.');
    }
  };

  const initializeFloatingBubble = () => {
    // Initialize bubble manage
    initialize()
      .then(async () => {
        console.log('Initialized the bubble mange');
        const isOpen = await openMap();
        if (isOpen && Platform.OS === 'android') {
          showFloatingBubble(5, 5);
        }
      })
      .catch(err => {
        console.error('unable to import react-native-floating-bubble', err);
      });
  };

  const floatingButtonStatus = async () => {
    checkFloatingButtonPermission()
      .then(status => {
        console.warn('checkFloatingButtonPermission status', status);
        if (!status) {
          modalRef.current.toggleModal(true).then(data => {
            console.warn('=======>>', data);
          });
        } else {
          initializeFloatingBubble();
        }
      })
      .catch(err => {
        console.error('checkFloatingButtonPermission status', err);
      });
  };

  const handleStatusChange = status => {
    if (!status) {
      requestPermission()
        .then(() => {
          console.log('Permission Granted');
          initializeFloatingBubble();
        })
        .catch(() => console.log('Permission is not granted'));
    }
  };

  useEffect(() => {
    let bubbleEventSubscription = null;
    if (Platform.OS === 'android') {
      bubbleEventSubscription = DeviceEventEmitter.addListener(
        'floating-bubble-press',
        e => {
          // What to do when user press the bubble
          console.warn('Press Bubble');
          Linking.openURL('kabou-driver://main-navigation/after-verify').then(
            isOpened => {
              if (isOpened) {
                ReactNativeForegroundService.remove_task('taskIdAfterVerify');
                hideFloatingBubble().then(() =>
                  console.warn('Floating Bubble Removed'),
                );
              }
            },
          );
        },
      );
    }

    return () => {
      if (Platform.OS === 'android') {
        bubbleEventSubscription?.remove();
      }
    };
  }, []);

  const originroute = { latitude: currentLatitude, longitude: currentLongitude };
  const destinationroute = { latitude: pickuplat, longitude: pickuplng };
  const GOOGLE_MAPS_APIKEY = google_api_key;
  const mapRef = useRef();
  const maproute = useRef(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header navigation={navigation} />
      <BaseModal ref={modalRef} onStatusChange={handleStatusChange}>
        <View style={{ flex: 1, margin: 10 }}>
          <Text>1. Click on Kabou Driver.</Text>
          <Image
            source={require('../../asserts/kabou_driver_step_1.png')}
            resizeMode="contain"
            style={{ width: '100%' }}
          />
          <Text>2. Turn the radio button on.</Text>
          <Image
            source={require('../../asserts/kabou_driver_step_2.png')}
            resizeMode="contain"
            style={{ width: '100%' }}
          />
        </View>
      </BaseModal>
      <View style={{ flex: 1 }}>
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            } // remove if not using Google Maps
            style={styles.map}
            initialRegion={{
              latitude: Number(currentLatitude),
              longitude: Number(currentLongitude),
              latitudeDelta: 0.00755,
              longitudeDelta: 0.00221,
            }}
            zoomControlEnabled={true}
            showsUserLocation={true}
            zoomEnabled={true}
            showsCompass={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            moveOnMarkerPress={true}
            //showsScale={true}
            showsTraffic={true}
            showsBuildings={true}
            userLocationUpdateInterval={1}>
            <MarkerAnimated ref={markerRef} coordinate={driverCoordinate}>
              <Image
                source={require('../../asserts/car_premium_top.png')}
                style={{
                  width: 35,
                  height: 35,
                  transform: [{ rotate: `${driverHeading}deg` }],
                }}
                resizeMode="contain"
              />
            </MarkerAnimated>
            <Marker
              //key={item.id}
              coordinate={{
                latitude: Number(pickuplat),
                longitude: Number(pickuplng),
              }}>
              {/* <View>
                <Image
                  source={require('../../asserts/profile.png')}
                  style={{
                    width: 15,
                    height: 15,
                    padding: allPadding,
                    borderRadius: allRadius,
                    borderColor: '#000',
                    borderWidth: 2,
                  }}
                />
              </View> */}
              {image === null ? (
                <View
                  style={{
                    width: 15,
                    height: 15,
                    padding: allPadding,
                    borderRadius: allRadius,
                    borderColor: '#000',
                    borderWidth: 2,
                  }}>
                  <Text style={{ fontSize: RFValue(25) }}>{name.charAt(0)}</Text>
                </View>
              ) : (
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    padding: allPadding,
                    borderRadius: allRadius,
                    borderColor: '#000',
                    borderWidth: 2,
                  }}
                  source={{ uri: image }}
                />
              )}
            </Marker>
            {/* <Polyline
            coordinates={[
              { latitude: Number(currentLatitude), longitude: Number(currentLongitude)},
              {latitude: Number(pickuplat), longitude: Number(pickuplng) },
            ]}
            strokeColor="#7F0000" // fallback for when `strokeColors` is not supported by the map-provider
            //strokeColor={['#7F0000']}
            strokeWidth={2}
          /> */}
            <MapViewDirections
              origin={originroute}
              destination={destinationroute}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={7}
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
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: -25,
              right: (width - 150) / 2,
              backgroundColor: 'blue',
              width: 150,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 2,
              borderRadius: 30,
            }}
            onPress={createTwoButtonAlert}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                flexWrap: 'wrap',
                textAlign: 'center',
              }}>
              Start Direction
            </Text>
          </TouchableOpacity>
          <Text>Longitude: {pickuplat}</Text>

          <Text>Latitude: {pickuplng}</Text>
        </View>
        <ScrollView>
          <View
            style={{
              // backgroundColor: colors.background,
              flex: 1,
              padding: allPadding,
              // height: calcH(0.33),
              // marginBottom: calcH(0.33),
              // marginBottom: calcH(0.005),
            }}>
            <View style={styles.ridepoint}>
              <View>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: '#000',
                    fontWeight: 'bold',
                    marginBottom: 5,
                  }}>
                  Start point
                </Text>
                <Text
                  style={{
                    width: calcW(0.3),
                    fontSize: RFValue(13),
                    color: '#000',
                    fontWeight: '400',
                  }}>
                  {pickup}
                </Text>
              </View>
              <View
                style={{
                  alignItems: 'flex-end',
                  borderColor: '#000',
                  borderWidth: 0,
                  flex: 0.75,
                  paddingRight: 10,
                }}>
                <Text
                  style={{
                    fontSize: RFValue(16),
                    color: '#000',
                    fontWeight: 'bold',
                    marginBottom: 5,
                  }}>
                  End point
                </Text>
                <Text
                  style={{
                    fontSize: RFValue(13),
                    color: '#000',
                    fontWeight: '400',
                  }}>
                  {destination}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: calcH(0.01),
                justifyContent: 'space-between',
                padding: allPadding,
                shadowColor: '#808080',
                elevation: 0.5,
                shadowOpacity: 1,
                borderBottomWidth: 0,
                marginBottom: calcH(0.01),
              }}>
              {image === null ? (
                <View
                  style={{
                    height: calcH(0.08),
                    width: calcW(0.14),
                    // resizeMode: 'cover',
                    // overflow: 'hidden',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#878f99',
                    borderRadius: 60 / 2,
                    borderColor: colors.buttonColor,
                    borderWidth: 2,
                  }}>
                  <Text style={[{ fontSize: RFValue(25) }, styles.textStyle]}>{name.charAt(0)}</Text>
                </View>
              ) : (
                <Image
                  style={{
                    height: calcH(0.08),
                    width: calcW(0.14),
                    resizeMode: 'cover',
                    overflow: 'hidden',
                    borderRadius: 60 / 2,
                    borderColor: colors.buttonColor,
                    borderWidth: 2,
                  }}
                  source={{ uri: image }}
                />
              )}
              <View
                style={{
                  marginLeft: calcH(0.02),
                  padding: 2,
                }}>
                <Text style={styles.textStyle}>{cellphone}</Text>
                <Text style={styles.textStyle}>{name}</Text>
                {/* <Text>Total Ride: 15+</Text> */}
                {/* <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#000'
                  }}>PickUp Time:{departureTime}</Text> */}
              </View>
              <View
                style={{
                  marginLeft: calcH(0.19),
                }}>
                {/* <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    right: calcW(0.15),
                  }}
                >
                  <Image
                    source={require('../../asserts/star.png')}
                    style={{
                      width: calcW(0.04),
                      height: calcH(0.02),
                    }}
                  />
                  <Text>4.9</Text>
                </View> */}
                {/* <Text style={styles.textphone}>$120.00</Text> */}
              </View>
              {/* <View style={{
                        // width: calcW(0.5),
                        // top: calcH(0.02)
                        }}> */}

              {/* </View> */}
            </View>
            <View
              style={{
                width: calcW(0.9),
                flexDirection: 'row',
                paddingHorizontal: allPadding,
                justifyContent: 'flex-start',
              }}>
              <Text style={styles.price}>EST. cost: ${priceRide}</Text>
              <Text style={styles.price}>WT. cost: ${waitingcharge}.00</Text>
            </View>
            <View
              style={{
                width: calcW(0.9),
                flexDirection: 'row',
              }}>
              <Text style={styles.price}>ST. cost: ${timecharge}.00</Text>
              <Text style={styles.price}>TIPS: $0.00</Text>
              <Text
                style={{
                  left: calcW(0.05),
                  marginTop: calcW(0.02),
                  fontWeight: 'bold',
                  fontSize: RFValue(17),
                  color: colors.textHeader,
                  marginRight: calcW(0.05),
                }}>
                Total: $
                {Number(priceRide) + Number(waitingcharge) + Number(timecharge)}
              </Text>
            </View>

            <View
              style={{
                padding: allPadding,
                shadowColor: '#808080',
                elevation: 0.5,
                shadowOpacity: 0.5,
                borderBottomWidth: 0,
                // marginBottom: calcH(0.06),
              }}>
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
                  }}>
                  <View>
                    <TouchableOpacity onPress={() => setStoppagetime(true)}>
                      {minutes <= 9 && seconds <= 9 ? (
                        <Text style={styles.textTime}>
                          0{minutes}:0{seconds} mins
                        </Text>
                      ) : (
                        <>
                          {minutes <= 9 && seconds > 9 ? (
                            <Text style={styles.textTime}>
                              0{minutes}:{seconds} mins
                            </Text>
                          ) : (
                            <Text style={styles.textTime}>
                              {minutes}:{seconds} mins
                            </Text>
                          )}
                        </>
                      )}

                      <Text style={styles.textStyle}>Stopages time</Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text style={styles.textTime}>${timecharge}.00</Text>
                    <Text style={styles.textStyle}>Stopages time cost</Text>
                  </View>
                </View>
                {stoppagetime === false ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.buttonColor,
                      width: calcW(0.4),
                      height: calcH(0.05),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: calcH(0.02),
                      borderRadius: allRadius,
                    }}
                    onPress={() => setStoppagetime(true)}>
                    <Text style={{ color: '#fff' }}>Start stopage time</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: colors.buttonColor,
                      width: calcW(0.4),
                      height: calcH(0.05),
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: calcH(0.02),
                      borderRadius: allRadius,
                    }}
                    onPress={() => setStoppagetime(false)}>
                    <Text style={{ color: '#fff' }}>End stopage time</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  // marginTop: calcH(0.02),
                }}>
                <TouchableOpacity
                  style={styles.btnSubContainer}
                  onPress={() =>
                    Alert.alert('', 'Are you sure to end journey?', [
                      { text: 'OK', onPress: () => nextRide() },
                      {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                      },
                    ])
                  }>
                  <Text style={styles.btnText}>End Journey</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AcceptRide;

const styles = StyleSheet.create({
  mapContainer: {
    width: calcW(1),
    height: calcH(0.5),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btnMainContainer: {
    backgroundColor: colors.background,
    // flex: 1,
    height: calcH(0.32),
    // marginBottom: calcH(0.04),
  },
  btnContainer: {
    alignItems: 'center',
    // marginTop: calcH(0.03),
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    // bottom: calcH(0.01),
  },
  btnFamilySubContainer: {
    marginTop: calcH(0.02),
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonAnothercolor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    // left: calcW(0.08),
    fontSize: RFValue(15),
    color: '#fff',
    fontWeight: 'bold',
  },
  btnBlackText: {
    // left: calcW(0.08),
    fontSize: RFValue(15),
    color: colors.textHeader,
    fontWeight: '500',
  },
  ridepoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: allPadding,
    paddingTop: allPadding,
    borderColor: '#000',
    borderWidth: 0,
    shadowColor: '#003169',
    elevation: 1,
    shadowOpacity: 1,
  },
  price: {
    left: calcW(0.05),
    marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(13),
    color: colors.textHeader,
    marginRight: calcW(0.05),
  },
  textTime: {
    color: colors.activeBorder,
    fontSize: RFValue(14),
    fontWeight: '600',
  },
  textStyle: {
    color: colors.activeBorder,
    fontSize: RFValue(14),
    fontWeight: '600',
  },
});
