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
  Platform,
  Alert,
  Dimensions,
  Linking,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
} from 'react';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  google_api_key,
} from '../../utils/comon';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  MarkerAnimated,
  AnimatedRegion,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {
  showFloatingBubble,
  hideFloatingBubble,
  initialize,
  requestPermission,
  checkPermission as checkFloatingButtonPermission,
} from 'react-native-floating-bubble';

import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import Header from '../../Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FontAwsome from 'react-native-vector-icons/dist/FontAwesome5';
import MapViewDirections from 'react-native-maps-directions';
import { firebase } from '@react-native-firebase/database';
import { RFValue } from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';

import { BASE_URL } from '../../utils/Api/apiName';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import BaseModal from '../../Components/BaseModal';
import moment from 'moment';

const reference = firebase
  .app()
  .database('https://kabou-rider-default-rtdb.firebaseio.com/');

let charge = 0;
let watchPositionUnsubscribe = null;

const AcceptRide = ({ navigation }) => {
  const markerRef = useRef();
  const modalRef = useRef();
  const rtdbRef = useRef();
  const dateNow = new Date().getTime();
  let timer = 0;
  let secondtimer = 0;
  let freetimer = 1;
  let freesecondtimer = 59;

  const [isSelected, setSelection] = useState(false);
  // const [notSelected, setNotSelected] = useState(false);
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [driverCoordinate, setDriverCoordinate] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
    }),
  );
  const [driverHeading, setDriverHeading] = useState(0);
  const [currentCoords, setCurrentCoords] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [locationStatus, setLocationStatus] = useState('');
  const [accept, setAccept] = useState(false);
  const [verify, setVerify] = useState(true);
  const [codeVerify, setcodeVerify] = useState(0);
  const [isEnabled, setIsEnabled] = useState(true);

  const [timecharge, setTimecharge] = useState(0);
  //const [count, setCount] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [pickup, setPickup] = useState('');
  const [pickuplat, setPickuplat] = useState(22.5734368);
  const [pickuplng, setPickuplng] = useState(88.4305629);
  const [destination, setDestination] = useState('');
  const [bookingId, setBookingId] = useState(0);
  const [departureTime, setDepartureTime] = useState(null);
  const [image, setImage] = useState(null);
  const [priceRide, setPriceRide] = useState(0);
  const [name, setName] = useState('');
  const timeOut = useRef(undefined);
  const [waitingtime, setWaitingtime] = useState(true);
  const [cellphone, setcellphone] = useState(0);
  const [otpInput, setOtpInput] = useState('');
  // const [timer, settimer] = useState(0);
  const drivelocation = useRef(undefined);

  // console.log('$$$$$$$$$$$$$', countTime);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      requestLocationPermission();
      setOtpInput('');
      Geolocation.clearWatch();
      setIsEnabled(true);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startForegroundService = async (
    destLat,
    destLong,
    booking_Id,
    sendNotification,
  ) => {
    let isNotificationSend = false;
    ReactNativeForegroundService.remove_task('taskIdAfterVerify');
    ReactNativeForegroundService.add_task(
      () => {
        watchPositionUnsubscribe &&
          Geolocation.clearWatch(watchPositionUnsubscribe);
        watchPositionUnsubscribe = Geolocation.watchPosition(position => {
          Geolocation.clearWatch(watchPositionUnsubscribe);

          console.warn('my current distance', position.coords);
          reference.ref(`/driver-location/${booking_Id}`).update(
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

          const R = 6371e3; // metres
          const φ1 = (position.coords.latitude * Math.PI) / 180; // φ, λ in radians
          const φ2 = (destLat * Math.PI) / 180;
          const Δφ = ((destLat - position.coords.latitude) * Math.PI) / 180;
          const Δλ = ((destLong - position.coords.longitude) * Math.PI) / 180;

          const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          const distance = R * c; // in metres

          if (distance <= 200 && distance <= 150 && !isNotificationSend) {
            sendNotification();
            isNotificationSend = true;
          }
        });
      },
      {
        delay: 1000,
        onLoop: true,
        taskId: 'taskIdAcceptRide',
        onError: e => console.log('Error logging:', e),
      },
    );
    ReactNativeForegroundService.start({
      id: 144,
      title: 'Navigation started to pickup',
      message: 'You are ready to go. Safe Journey.',
    });
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getDocument();
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
          getDocument();
          getOneTimeLocation();
          subscribeLocationLocation();
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

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
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
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
        setCurrentCoords({ currentLatitude, currentLongitude });
        setDriverCoordinate(
          new AnimatedRegion({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }),
        );
        animate(position.coords.latitude, position.coords.longitude);
        setDriverHeading(position.coords.heading);
        // reference.ref(`/driver-location/${bookingId}`).set({
        //   driverlat: currentLatitude,
        //   driverlng: currentLongitude,
        // });
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

  const subscribeLocationLocation = () => {
    const watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log(
          'subscribeLocationLocationAcceptRide',
          pickuplat,
          pickuplng,
          position,
        );

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        setCurrentCoords({ currentLatitude, currentLongitude });
        //generateMarkers(currentLatitude, currentLongitude)
        /* setDriverCoordinate(
          new AnimatedRegion({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }),
        ); */
        animate(position.coords.latitude, position.coords.longitude);
        setDriverHeading(position.coords.heading);
        reference.ref(`/driver-location/${bookingId}`).update({
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
        showsBackgroundLocationIndicator: true,
        interval: 1000,
      },
    );
    Geolocation.clearWatch(watchID);
  };
  const driverlocation = useCallback(
    value => {
      console.log('==============valuelocationfinal!!!================= ', value);
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
            driverPickUpTime: departureTime ?? 0,
            rideCancel: accept,
            otpVerification: verify
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
    [bookingId, departureTime, accept],
  );

  useEffect(() => {
    if (rtdbRef.current) {
      reference
        .ref(`/driver-location/${bookingId}`)
        .off('value', rtdbRef.current);
    }
    rtdbRef.current = reference
      .ref(`/driver-location/${bookingId}`)
      .on('value', snapshot => {
        //setSeconds(snapshot.val());
        //setTimecharge(snapshot.val() + 2);
        console.log('bookingId', bookingId);
        console.log('11111111111111111111111valuelocationfinal!!! ', snapshot.val());
        setAccept(snapshot.val()?.rideCancel)
        clearInterval(drivelocation.current);
        if (verify) {
          if (accept == false) {
            drivelocation.current = setInterval(() => {
              driverlocation(snapshot.val());
            }, 1000);
          }

        }
      });
    return () => {
      reference
        .ref(`/driver-location/${bookingId}`)
        .off('value', rtdbRef.current);
      clearInterval(drivelocation.current);
    };
  }, [verify, bookingId, driverlocation, accept, departureTime]);
  // ----------------------------------------------------------------------------------------------------
  //console.log('valuelocation!!! ', currentLatitude, currentLongitude);

  const getDocument = async () => {
    setSeconds(freesecondtimer);
    setMinutes(freetimer);
    setTimecharge(0);
    setVerify(true);
    // getProfiledoc();
    const riderListAll = JSON.parse(await AsyncStorage.getItem('rideRequest'));
    const riderList = riderListAll.booking_data;
    const riderDetails = riderListAll.rider_details;
    console.log('riderList.data.data,', riderListAll);
    setBookingId(riderList.id);
    setcodeVerify(riderList.code);
    setDestination(riderList.destination);
    setPickup(riderList.starting_point);
    // setDepartureTime(riderList.data.data[riderList.data.data.length -1].departure_time)
    setPickuplat(riderList.latitude_departure);
    setPickuplng(riderList.longitude_departure);
    setPriceRide(riderList.price);
    setImage(riderDetails.profile_photo);
    setcellphone(riderDetails.cellphone);
    setName(riderDetails.name);
    const time = riderList.departure_time.split(':');

    // const time2 = Number(time[1]) + 30;

    //time[1] = time2
    console.log('========>', riderList.departure_time);
    console.log('time111', time);
    // if(time2>=60){
    //   console.log("parseInt(time2/60)",time2);
    //   const time1 =JSON.stringify( Number(time[0])+parseInt(time2/60))
    //   const ok = JSON.stringify(time2%60)

    //   time[0] = time1
    //   time[1] = ok

    //   console.log("parseInt(time2/60)",parseInt(time2/60));
    // }else{
    //   const ok = JSON.stringify(time2)
    //   time[1] = ok
    // }
    // console.log(" parseInt(time2/60));",parseInt(time2/60));
  };

  const handlestoppage = useCallback(
    value => {
      console.log('1111111111111', value, (departureTime ?? 1) * 60);
      // settimer(value + 1);
      setSeconds(freesecondtimer);
      setMinutes(freetimer);
      if (value > (departureTime ?? 1) * 60 + 119) {
        // var sec = new Date().getSeconds();

        // console.log('sec', sec);
        setWaitingtime(false);
        setMinutes(timer);
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
      } else {
        if (value > (departureTime ?? 1) * 60) {
          freesecondtimer -= 1;
          setSeconds(freesecondtimer);
          if (freesecondtimer === 1) {
            freesecondtimer = 58;
            freetimer -= 1;
            setMinutes(freetimer);
          }
        }
      }

      reference
        .ref(`/waiting/${bookingId}`)
        .set(typeof value === 'object' ? 0 : value + 1);
      // .then(snapshot => {
      //   console.log('User data: ', snapshot.snapshot.val());
      // });
    },
    [bookingId, departureTime],
  );

  useEffect(() => {
    const data = reference
      .ref(`/waiting/${bookingId}`)
      .on('value', snapshot => {
        console.log('bookingId', bookingId);
        console.log('value!!! ', snapshot.val());
        const currentTime =
          new Date().getHours() + ':' + new Date().getMinutes();
        console.log('currentTime &&&&&&&&&&&&&&&&&&&&&', accept);
        // console.log(' pickupTime461887', departureTime);
        clearTimeout(timeOut.current);
        if (verify) {
          if (accept == false) {
            timeOut.current = setTimeout(() => {
              handlestoppage(snapshot.val());
            }, 1000);
          }

        }
      });
    return () => {
      clearTimeout(timeOut.current);
      reference.ref(`/waiting/${bookingId}`).off('value', data);
    };
  }, [verify, bookingId, handlestoppage, accept]);
  // ----------------------------------------------------------------------------------------------------

  // useEffect(() => {
  //   const timer = setInterval(value => {
  //     handleprice();
  //   }, 60000);
  //   return () => clearTimeout(timer);
  // });
  // const handleprice = () => {
  //   // if(starttime === false){
  //   const pickuptime = departureTime;
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

  //   // if (seconds < pmins || hours < phours) {
  //   //   setStarttime(true);
  //   //   setTimecharge(count + 2);
  //   //   setCount(timecharge);
  //   //   setSeconds(seconds => seconds + 1);
  //   //   //}
  //   //   // setCount(value)
  //   //   console.log(typeof value);
  //   //   console.log('timecharge', timecharge);
  //   //   return;

  //   //   // Alert.alert("time same not")
  //   // }
  //   AsyncStorage.setItem('waitingChargenext', JSON.stringify(timecharge));
  //   //  setStarttime(true)
  // };

  const verifyOtp = async () => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('++++++++++++++++++++++++++++++++++++++location', token);
      if (otpInput.length === 4) {
        const body = {
          booking_id: bookingId,
          code: Number(otpInput),
        };
        console.log('data', body);
        Hud.showHud();
        const riderOtp = await axios({
          method: 'post',
          url: BASE_URL + 'otp-verify-for-start-ride',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            authorization: 'Bearer ' + token,
          },
          data: body,
        });
        Hud.hideHud();
        console.log('ride otp verify', riderOtp.data);
        setVerify(false);
        if (riderOtp.data.verify == true) {
          if (Platform.OS === 'android') {
            ReactNativeForegroundService.remove_task('taskIdAcceptRide');
            await ReactNativeForegroundService.stop();
          }
          setVerify(false);
          clearTimeout(timeOut.current);
          Alert.alert(riderOtp.data.message);
          navigation.navigate('afterVerify', {
            waitingcharge: timecharge,
            waitingTime: minutes * 60 + seconds,
          });
        } else {
          Alert.alert(riderOtp.data.message);
        }
      } else {
        Alert.alert('', '4 digits OTP Required.');
      }
    } catch (error) {
      console.log('varifyOtp error', error);
    }
  };

  const cancelRide = async () => {
    ReactNativeForegroundService.remove_task('taskIdAcceptRide');
    ReactNativeForegroundService.stop();
    setVerify(false);
    const riderListAll = JSON.parse(await AsyncStorage.getItem('rideRequest'));
    const riderList = riderListAll.booking_data;
    navigation.navigate('cancelRide', { data: riderList });
  };

  const getpickupNotification = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('++++++++++++++++++++++++++++++++++++++location', token);
    const body = {
      booking_id: bookingId,
    };
    console.log('data7777777777777777777777777', body);
    //Hud.showHud();
    if (isEnabled) {
      await axios({
        method: 'post',
        url: BASE_URL + 'pickup-notification',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          authorization: 'Bearer ' + token,
        },
        data: body,
      })
        .then(response => {
          console.log('pickup notification ', response);
          setIsEnabled(false)
          //Hud.hideHud();
        })
        .catch(err => {
          console.log('err2', JSON.stringify(err.response?.data?.message));
          setIsEnabled(false)
          //Hud.hideHud();
        });
    }
  };
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA =
    (Number(currentLatitude) * Number(pickuplat)) /
    (width * height * ASPECT_RATIO);
  //console.log('LATITUDE_DELTA', LATITUDE_DELTA);
  const LONGITUDE_DELTA =
    (Number(currentLongitude) * Number(pickuplng) * LATITUDE_DELTA) /
    (width * height * ASPECT_RATIO);
  //console.log('LONGITUDE_DELTA', LONGITUDE_DELTA);
  const originroute = { latitude: currentLatitude, longitude: currentLongitude };
  const destinationroute = { latitude: pickuplat, longitude: pickuplng };
  const GOOGLE_MAPS_APIKEY = google_api_key;
  const mapRef = useRef();
  const maproute = useRef(true);

  const permissionRequest = Platform.select({
    android: PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
  });

  const askAlwaysLocationPermission = () => {
    Alert.alert(
      'Request location Permission',
      'Please allow always location access',
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
    await startForegroundService(
      pickuplat,
      pickuplng,
      bookingId,
      getpickupNotification,
    );
    const lat = pickuplat;
    const lng = pickuplng;
    const scheme = Platform.select({
      ios: 'maps://q?',
      android: 'google.navigation:q=',
    });
    const latLng = `${lat},${lng}`;
    const url = Platform.select({
      ios: `${scheme}daddr=${latLng}&dirflg=d&t=m`,
      android: `${scheme}${latLng}`,
    });
    const isOpen = await Linking.openURL(url);
    return isOpen;
  };

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
      askAlwaysLocationPermission();
      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Please enable location permission.',
          ToastAndroid.SHORT,
        );
      }
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
          Linking.openURL('kabou-driver://main-navigation/accept-ride').then(
            isOpend => {
              if (isOpend) {
                ReactNativeForegroundService.remove_task('taskIdAcceptRide');
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
        bubbleEventSubscription.remove();
      }
    };
  }, []);

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
      <ScrollView>
        <View style={{ flex: 1 }}>
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              initialRegion={{
                latitude: Number(currentLatitude),
                longitude: Number(currentLongitude),
                latitudeDelta: 0.00755,
                longitudeDelta: 0.00221,
              }}
              style={styles.map}
              zoomControlEnabled={true}
              showsUserLocation={true}
              provider={
                Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
              } // remove if not using Google Maps
              zoomEnabled={true}
              followsUserLocation={true}
              showsCompass={true}
              showsMyLocationButton={true}
              moveOnMarkerPress={true}
              // showsScale={true}
              showsTraffic={true}
              showsBuildings={true}
              zoomTapEnabled={true}
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
                    <Text style={{ fontSize: RFValue(25) }}>
                      {name.charAt(0)}
                    </Text>
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
                mode="DRIVING"
                onStart={params => {
                  console.log(
                    `Started routing between "${params.origin}" and "${params.destination}"`,
                  );
                }}
                onReady={result => {
                  if (
                    result.distance * 1000 <= 250
                    // result.distance * 1000 >= 100
                  ) {
                    getpickupNotification();
                    setIsEnabled(false);
                  }
                  console.log(`Distance*1000: ${result.distance * 1000} km`);
                  console.log(`Duration: ${result.duration} min.`);
                  console.log('origin', originroute);
                  console.log('destination', destinationroute);
                  setDepartureTime(result.duration);
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
              onPress={onDirectionButton}>
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
          <View
            style={{
              // backgroundColor: colors.background,
              flex: 1,
              //height: calcH(0.35),
              borderColor: '#000',
              borderWidth: 0,
              padding: allPadding,
              marginBottom: calcH(0.002),
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
              {console.log('image', image)}
              {image === '' ? (
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
                  marginLeft: calcH(0.03),
                  marginEnd: calcW(0.03),
                }}>
                <Text style={styles.textStyle}>{cellphone}</Text>
                <Text style={styles.textStyle}>{name}</Text>
                {/* <Text>Total Ride: 15+</Text> */}
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontWeight: 'bold',
                    color: '#000',
                  }}>
                  PickUp Time:
                  {departureTime
                    ? moment(dateNow + departureTime * 60 * 1000).format('LT')
                    : '-:-'}
                </Text>
              </View>
              <View
                style={{
                  marginLeft: calcH(0.15),
                  paddingRight: allPadding,
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
                <View
                  style={{
                    borderBottomColor: '#000000',
                    borderBottomWidth: 1,
                    right: calcW(0.25),
                    marginBottom: 5,
                  }}>
                  <TextInput
                    value={otpInput}
                    onChangeText={value => {
                      if (value.length < 5) {
                        setOtpInput(value);
                      } else {
                        Alert.alert('', 'OTP need to be 4 digit only.');
                      }
                    }}
                    placeholder="OTP"
                    placeholderTextColor={'#000'}
                    style={{ padding: 0, color: '#000000' }}
                  />
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    right: calcW(0.25),
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 8,
                    width: 60,
                  }}>
                  <TouchableOpacity
                    value={isSelected}
                    onPress={() => verifyOtp()}>
                    <FontAwsome
                      //color={colors.inActiveBorder}
                      color={'#00A3FE'}
                      size={24}
                      name={'thumbs-up'}
                    />
                  </TouchableOpacity>
                  {/* <CheckBox
              disabled={false}
                 value={isSelected}
                onValueChange={setSelection}
                // style={styles.checkbox}
              /> */}
                  {/* <CheckBox
            disabled={false}
              value={notSelected}
              onValueChange={setNotSelected}
              tintColors={{ true: '#F15927', false: '#dcdcdcd' }}
              // style={styles.checkbox}
            /> */}
                  <TouchableOpacity onPress={() => cancelRide()}>
                    <FontAwsome color={'#000'} size={24} name={'thumbs-down'} />
                  </TouchableOpacity>
                </View>
              </View>
              {/* <View style={{
                      // width: calcW(0.5),
                      // top: calcH(0.02)
                      }}> */}

              {/* </View> */}
            </View>
            <View
              style={{
                width: calcW(0.8),
                flexDirection: 'row',
                paddingHorizontal: allPadding,
              }}>
              <Text style={styles.price}>EST. cost: ${priceRide}</Text>
              <Text style={styles.price}>WT. cost: ${timecharge}.00</Text>
            </View>
            <View
              style={{
                width: calcW(0.9),
                flexDirection: 'row',
              }}>
              <Text style={styles.price}>ST. cost: $0.00</Text>
              <Text style={styles.price}>TIPS: $0.00</Text>
              <Text
                style={{
                  left: calcW(0.05),
                  marginTop: calcW(0.02),
                  fontWeight: 'bold',
                  fontSize: RFValue(15),
                  color: colors.textHeader,
                  marginRight: calcW(0.05),
                }}>
                Total: $
                {Number(Number(priceRide) + Number(timecharge)).toFixed(2)}
              </Text>
            </View>

            <View>
              {/* <View style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: allPadding,
              shadowColor: '#808080',
              elevation: 0.5,
              shadowOpacity: 0.5,
              borderBottomWidth: 0,
              marginBottom: calcH(0.02)
            }}>
            
              
              <Text>Code verification</Text>
            
              
              <Text style={{
                fontSize: 22
              }}>{codeVerify}</Text>
            
            </View> */}
              <View
                style={{
                  padding: allPadding,
                  shadowColor: '#808080',
                  elevation: 0.5,
                  shadowOpacity: 0.5,
                  borderBottomWidth: 0,
                  marginBottom: calcH(0.01),
                }}>
                {waitingtime === true ? (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View>
                      {/* {starttime === true?( */}
                      {/* <Text>{console.log(seconds)}</Text> */}
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

                      {/* {/* // ): (
                  //   <CountDown */}
                      {/* //   until={60*2}
                  //   size={15}
                  //   onFinish={() =>handleprice()}
                  //   //onPress={() => handleprice()}
                  //   digitStyle={{backgroundColor: '#FFF'}}
                  //   digitTxtStyle={{color: '#1CC625'}}
                  //   timeToShow={['M', 'S']}
                  //   timeLabels={{m: 'MM', s: 'SS'}}
                    
                  //   />
                  // )} */}

                      <Text style={styles.textStyle}>free waititng time</Text>
                    </View>
                    <View>
                      <Text style={styles.textTime}>$00.00</Text>
                      <Text style={styles.textStyle}>Waiting time cost</Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                    }}>
                    <View>
                      {/* {starttime === true?( */}
                      {/* <Text>{console.log(seconds)}</Text> */}
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

                      {/* {/* // ): (
                //   <CountDown */}
                      {/* //   until={60*2}
                //   size={15}
                //   onFinish={() =>handleprice()}
                //   //onPress={() => handleprice()}
                //   digitStyle={{backgroundColor: '#FFF'}}
                //   digitTxtStyle={{color: '#1CC625'}}
                //   timeToShow={['M', 'S']}
                //   timeLabels={{m: 'MM', s: 'SS'}}
                  
                //   />
                // )} */}

                      <Text style={styles.textStyle}>
                        chargeable waititng time
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.textTime}>${timecharge}.00</Text>
                      <Text style={styles.textStyle}>Waiting time cost</Text>
                    </View>
                  </View>
                )}
              </View>
              {/* <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: calcH(0.02),
                }}>
                <TouchableOpacity
                  style={styles.btnSubContainer}
                  onPress={() => verifyOtp()}>
                  <Text style={styles.btnText}>Start Ride</Text>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcceptRide;

const styles = StyleSheet.create({
  mapContainer: {
    width: calcW(1),
    height: calcH(0.55),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btnMainContainer: {
    backgroundColor: colors.background,
    // flex: 1,
    height: calcH(0.32),
    marginBottom: calcH(0.04),
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: calcH(0.03),
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: calcH(0.02),
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
    fontSize: RFValue(13),
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
    //top: calcH(0.015),
  },
  price: {
    left: calcW(0.05),
    marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(12),
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
