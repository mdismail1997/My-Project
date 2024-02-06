import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {allRadius, buttonHeight, calcH, calcW} from '../../utils/comon';

import MapView, {
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
  Marker,
} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {RFValue} from 'react-native-responsive-fontsize';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import commonToast from '../../utils/commonToast';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';

const getRandomLatitude = (min = 48, max = 56) => {
  return Math.random() * (max - min) + min;
};

const getRandomLongitude = (min = 14, max = 24) => {
  return Math.random() * (max - min) + min;
};

export default function BookingStep1({navigation}) {
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  //const [locationStatus, setLocationStatus] = useState('');
  const [address, setAddress] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [markers, setMarkers] = useState([
    {
      id: 0,
      latitude: 0,
      longitude: 0,
    },
  ]);
  console.log(markers);

  useEffect(() => {
    requestPermission();

    const unsubscribe = navigation.addListener('focus', () => {
      requestPermission();
    });
    return unsubscribe;
    // return () => {
    //   Geolocation.clearWatch(watchID);
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestPermission = () => {
    const permission = Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    });
    request(permission).then(result => {
      console.warn(result);
      if (result === 'granted') {
        //Alert.alert("Location Permission Granted.");
        checkPermission();
      } else {
        Alert.alert('Oops..', 'Location Permission Not Granted');
        //setAddress('4505 Roane Avenue, Hous.. ')
      }
    });
  };

  const checkPermission = () => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const {coords} = position;
              console.warn('pos================>', coords.latitude);
              setCurrentCoords({
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              });
              setCurrentLatitude(coords.latitude);
              setCurrentLongitude(coords.longitude);
              setCurrentCoords({
                latitude: parseFloat(coords.latitude),
                longitude: parseFloat(coords.longitude),
                // latitudeDelta: 0.0122,
                // longitudeDelta: 0.0051,
                // latitudeDelta: 0.0922,
                // longitudeDelta: 0.0421,
              });
              generateMarkers(coords.latitude, coords.longitude);
              // nearestDriver();
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
              setCurrentCoords({lat: 1, lng: 1});
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
          setCurrentCoords({lat: 1, lng: 1});
          // dispatch(outletActions.getAllOutlet(null));
        }
      });
    } else {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE).then(result => {
        if (result === 'granted') {
          Geolocation.getCurrentPosition(
            position => {
              const {coords} = position;
              setCurrentCoords({
                lat: parseFloat(coords.latitude),
                lng: parseFloat(coords.longitude),
              });
              setCurrentLatitude(coords.latitude);
              setCurrentLongitude(coords.longitude);
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
              setCurrentCoords({lat: 1, lng: 1});
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
                  const {coords} = position;
                  setCurrentCoords({
                    lat: parseFloat(coords.latitude),
                    lng: parseFloat(coords.longitude),
                  });
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
                  setCurrentCoords({lat: 1, lng: 1});
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
              setCurrentCoords({lat: 1, lng: 1});
              // dispatch(outletActions.getAllOutlet(null));
            }
          });
        }
      });
    }
  };
  // const generateMarkers = useCallback((lat, long) => {
  //   const markersArray = [];

  //   for (let i = 0; i < 10; i++) {
  //     markersArray.push({
  //       id: i,
  //       latitude: getRandomLatitude(lat - 0.01, lat + 0.01),
  //       longitude: getRandomLongitude(long - 0.01, long + 0.01),
  //     });
  //   }
  //   setMarkers(markersArray);
  // }, []);
  const generateMarkers = useCallback((lat, long) => {
    const nearestDriver = async () => {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('token_select_car', token.data.data.token);
      const userToken = token.data.data.token;
      console.log('!!!!!!!!!!!!!!!!!!!!!', lat);
      console.log('@@@@@@@@@@@@@@@@@', long);
      Hud.showHud();
      await axios({
        method: 'GET',
        url: `${BASE_URL}nearest-driver?latitude=${lat}&longitude=${long}`,
        headers: {
          // Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(function (response) {
          console.log('nearest driver', response.data);
          // setVehicledata(response.data.data);
          Hud.hideHud();
          const positions = response.data.data;
          const markersArray = [];
          for (let i = 0; i < positions.length; i++) {
            markersArray.push({
              id: i,
              latitude: Number(response.data.data[i].latitude),
              longitude: Number(response.data.data[i].longitude),
            });
          }
          setMarkers(markersArray);
        })
        .catch(function (error) {
          console.log(error.response.data);
          Hud.hideHud();
        });
    };
    nearestDriver();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.topContainer}>
        <HeaderComponent navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{flex: 1}}>
          <View style={{flex: 1}}>
            <View style={styles.mapContainer}>
              <MapView
                provider={
                  Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
                } // remove if not using Google Maps
                style={styles.map}
                region={{
                  latitude: Number(currentLatitude),
                  longitude: Number(currentLongitude),
                  latitudeDelta: 0.004757,
                  longitudeDelta: 0.00686,
                }}
                showsCompass={true}
                followsUserLocation={true}
                showsUserLocation={true}
                showsMyLocationButton={true}
                moveOnMarkerPress={true}
                //zoombutton={true}
                showsScale={true}
                showsTraffic={true}
                showsBuildings={true}
                userLocationUpdateInterval={1}>
                <Marker
                  draggable
                  coordinate={{
                    latitude: Number(currentLatitude),
                    longitude: Number(currentLongitude),
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
                      {item.id % 2 === 0 ? (
                        <Image
                          source={require('../../../assets/images/car_premium.png')}
                          style={{width: calcW(0.1), height: calcH(0.02)}}
                        />
                      ) : (
                        <Image
                          source={require('../../../assets/images/car_silver.png')}
                          style={{width: calcW(0.1), height: calcH(0.02)}}
                        />
                      )}
                    </View>
                  </Marker>
                ))}
              </MapView>

              <Text>Longitude: {currentLongitude}</Text>

              <Text>Latitude: {currentLatitude}</Text>
            </View>
          </View>
          <View style={styles.btnMainContainer}>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSubContainer}
                onPress={() => navigation.navigate('bookingStep2')}>
                <Text style={styles.btnText}>Ride for myself</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnFamilySubContainer}
                onPress={() => navigation.navigate('familyRide')}>
                <Text style={styles.btnBlackText}>
                  Ride for Family & Friend{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(0.55),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btnMainContainer: {
    backgroundColor: colors.background,
    height: calcH(0.2),
    borderColor: '#000',
    borderWidth: 0,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
  },
  btnFamilySubContainer: {
    marginTop: calcH(0.02),
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonAnothercolor,
    justifyContent: 'center',
  },
  btnText: {
    left: calcW(0.08),
    fontSize: RFValue(13),
    color: '#fff',
    fontWeight: '500',
  },
  btnBlackText: {
    left: calcW(0.08),
    fontSize: RFValue(13),
    color: colors.textHeader,
    fontWeight: '500',
  },
});
