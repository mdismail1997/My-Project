import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TextInput,
  PermissionsAndroid,
  Image,
  Alert,
  TouchableOpacity,
  Platform,
  Dimensions,
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
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import { ScreenScrollComponent, HeaderComponent } from '../../commonItem/index';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Polyline,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
//import Geolocation from '@react-native-community/geolocation';
import Header from '../../Header/Header';
import { Switch } from 'react-native-switch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import CountDown from 'react-native-countdown-component';
import CheckBox from '@react-native-community/checkbox';
import commonToast from 'react-native-toast-message';
import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import Geocoder from 'react-native-geocoder';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import FlashMessage, {
  showMessage,
  hideMessage,
} from 'react-native-flash-message';
import { BASE_URL } from '../../utils/Api/apiName';
import { RFValue } from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';
import notificationNavigate from '../../firebase/notificationNavigate';
import {
  initialize,
  requestPermission,
  checkPermission as checkFloatingButtonPermission,
} from 'react-native-floating-bubble';
import BaseModal from '../../Components/BaseModal';

const AcceptRide = ({ navigation }) => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationStatus, setLocationStatus] = useState('');
  const [accept, setAccept] = useState(false);
  const [verify, setVerify] = useState(false);
  const [driverlocation, setDriverlocation] = useState(true);

  const [address, setAddress] = useState('');

  const [isEnabled, setIsEnabled] = useState(true);
  const location = useRef();
  const modalRef = useRef(null);
  //const [notificationStatus, setNotificationStatus] = useState(false)
  // React.useEffect(() => {
  //   setTimeout(() => {

  //   }, 1000);
  // }, []);
  useEffect(() => {
    // getNotificationStatus();
    checkPermission();
    // if (driverlocation) {
    //   location.current = setInterval(() => {
    //     driverLocationhome();
    //   }, 3000);
    //   //clearInterval(location.current);
    //   return () => {
    //     clearInterval(location.current);
    //   };
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Location access request',
      'This app collects location data to enable location tracking feature for better results even when the app is closed or not in use',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel',
        },
        { text: 'OK', onPress: () => requestRequiredPermission() },
      ],
    );

  const requestRequiredPermission = () => {
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        console.warn('ACCESS_FINE_LOCATION', result);
        if (result === 'granted') {
          //Alert.alert("Location Permission Granted.");
          checkPermission();
        } else if (result === 'blocked') {
          Alert.alert('Oops..', 'Location Permission Not Granted');
          //setAddress('4505 Roane Avenue, Hous.. ')
        }
      });
      floatingButtonStatus();
    } else {
      checkPermission();
    }
  };

  const initializeFloatingBubble = () => {
    // Initialize bubble manage
    initialize()
      .then(() => console.log('Initialized the bubble mange'))
      .catch(err => {
        console.error('unable to import react-native-floating-bubble', err);
      });
  };

  const floatingButtonStatus = () => {
    checkFloatingButtonPermission()
      .then(status => {
        console.warn('checkFloatingButtonPermission status', status);
        if (!status) {
          modalRef.current.toggleModal(true).then(data => {
            console.warn('=======>>', data);
            // requestRequiredPermission();
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
  const requestCameraPermission = async () => {
    try {
      const granted = await request(permissionState);
      if (granted === RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const checkPermission = () => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        console.warn('errrrrrrrr', result);

        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const { coords } = position;
              console.warn('pos================>', coords);
              // setCurrentCoords({
              //   lat: parseFloat(coords.latitude),
              //   lng: parseFloat(coords.longitude),
              // });
              setCurrentLatitude(parseFloat(coords.latitude));
              setCurrentLongitude(parseFloat(coords.longitude));
              driverLocationhome();
              // setCurrentCoords({
              //   latitude: parseFloat(coords.latitude),
              //   longitude: parseFloat(coords.longitude),
              //   // latitudeDelta: 0.0122,
              //   // longitudeDelta: 0.0051,
              //   // latitudeDelta: 0.0922,
              //   // longitudeDelta: 0.0421,
              // });
              //generateMarkers(coords.latitude, coords.longitude);
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

              Geocoder.geocodePosition(pos)
                .then(res => {
                  //alert(res[0].formattedAddress);
                  // setLocation(res[1].formattedAddress);
                  // setCity(res[0].locality);
                  // setState(res[0].adminArea);
                  // setPostalcode(res[0].postalCode);
                  setAddress(res[1].formattedAddress);
                  console.warn('Address', res);
                })
                .catch(error => Alert.alert(error));
            },
            error => {
              commonToast({
                text: error['message'],
                position: 'top',
                type: 'error',
              });
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
            type: 'error',
          });
          createTwoButtonAlert();
          console.warn('errrrrrrrr', result);
          //setCurrentCoords({lat: 1, lng: 1});
          // dispatch(outletActions.getAllOutlet(null));
        } else {
          createTwoButtonAlert();
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
              setCurrentLatitude(parseFloat(coords.latitude));
              setCurrentLongitude(parseFloat(coords.longitude));

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

              /* Geocoder.geocodePosition(pos)
                .then(res => {
                  //alert(res[0].formattedAddress);
                  setLocation(res[1].formattedAddress);
                  setCity(res[0].locality);
                  setState(res[0].adminArea);
                  setPostalcode(res[0].postalCode);
                  // console.warn('Address',res[1].formattedAddress)
                })
                .catch(error =>
                  commonToast({
                    text: error,
                    position: 'top',
                    type: 'error',
                  }),
                ); */
            },
            error => {
              commonToast({
                text: error['message'],
                position: 'top',
                type: 'error',
              });
              console.warn('pos================>', error['message']);
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
                  setCurrentLatitude(coords.latitude);
                  setCurrentLongitude(coords.longitude);
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
                },
                error => {
                  commonToast({
                    text: error['message'],
                    position: 'top',
                    type: 'error',
                  });
                  console.warn('Address', error['message']);
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
                type: 'error',
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

  const driverLocationhome = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    // console.log('++++++++++++++++++++++++++++++++++++++locationhome', token);
    const body = {
      latitude: 22.872749,
      longitude: 87.791092,
    };
    // console.log('data', JSON.stringify(body));
    //Hud.showHud();
    // console.log('BASEURL', BASE_URL);
    await axios({
      method: 'POST',
      url: BASE_URL + 'save-location',
      headers: {
        'Content-Type': 'application/json',
        //Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        // console.log('Driver location home', response.data);
        //Hud.hideHud();
      })
      .catch(err => {
        console.log('err2', JSON.stringify(err.response.data.message));
        Alert.alert('Sorry', `${err.response.data.message}`, [
          {
            text: 'Check documents',
            onPress: () => navigation.navigate('documentUpload'),
          },
          {
            text: 'OK',
            style: 'cancel',
          },
        ]);
        //Hud.hideHud();
      });
  };

  const nextAccept = () => {
    setDriverlocation(false);
    clearInterval(location.current);
    navigation.navigate('getRide');
  };
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderColor: '#000',
        borderWidth: 0,
      }}>
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

      <View style={styles.topContainer}>
        <View style={styles.mapContainer}>
          <MapView
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            } // remove if not using Google Maps
            style={{
              width: calcW(1),
              height: calcH(0.56),
              alignItems: 'center',
            }}
            region={{
              latitude: parseFloat(currentLatitude),
              longitude: parseFloat(currentLongitude),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            showsUserLocation={true}
            zoomEnabled={true}
            //minZoomLevel={13}
            //maxZoomLevel={17}
            showBuildings="true"
            showsMyLocationButton={true}
            showsCompass={true}
            followsUserLocation={true}
            moveOnMarkerPress={true}
            //showsScale={true}
            showsTraffic={true}
            userLocationUpdateInterval={1}>
            <Marker
              coordinate={{
                latitude: Number(currentLatitude),
                longitude: Number(currentLongitude),
              }}>
              <Image
                source={require('../../asserts/car_premium_top.png')}
                style={{
                  width: 35,
                  height: 35,
                }}
                resizeMode="contain"
              />
            </Marker>
          </MapView>

          <Text style={{ position: 'absolute' }}>
            Longitude: {currentLatitude}
          </Text>

          <Text style={{ position: 'absolute', top: calcH(0.02) }}>
            Latitude: {currentLongitude}
          </Text>
        </View>
      </View>
      <View style={styles.btnMainContainer}>
        <ScrollView>
          <View style={styles.ridepoint}>
            <View>
              <Text>Start point</Text>
              {/* <TextInput
                placeholder="Starting point"
                style={{
                  width: calcW(0.3),
                }}
              /> */}
              <Text
                style={{
                  width: calcW(0.3),
                  marginTop: calcH(0.02),
                }}>
                Starting point
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text>End point</Text>
              {/* <TextInput
                placeholder="Ending point"
                // value={destination}
                style={{}}
              /> */}
              <Text style={{ marginTop: calcH(0.02) }}>Ending point</Text>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubContainer}
              onPress={() => {
                nextAccept();
              }}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFamilySubContainer}
              onPress={() => setAccept(false)}>
              <Text style={styles.btnBlackText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AcceptRide;

const styles = StyleSheet.create({
  topContainer: {
    // alignItems: 'center',
    flex: 1.8,
    borderColor: '#000',
    borderWidth: 0,
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(2.5),
    borderColor: '#000',
    borderWidth: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btnMainContainer: {
    backgroundColor: colors.background,
    paddingHorizontal: 5,
    flex: 1,
    // height: calcH(0.5),
    //marginBottom: calcH(0.04),
  },
  btnContainer: {
    alignItems: 'center',
    //marginTop: calcH(0.01),
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: calcH(-0.01),
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
    fontSize: RFValue(17),
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
    //top: calcH(0.05),
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
    fontSize: RFValue(14),
    color: colors.textHeader,
    marginRight: calcW(0.05),
  },
});
