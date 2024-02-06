import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  TextInput,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  google_api_key,
} from '../../utils/comon';
//import {ScreenScrollComponent, HeaderComponent} from '../../commonItem/index';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  AnimatedRegion,
  MarkerAnimated,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Header from '../../Header/Header';
//import {Switch} from 'react-native-switch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import CountDown from 'react-native-countdown-component';
// import CheckBox from '@react-native-community/checkbox';
import MapViewDirections from 'react-native-maps-directions';
import { RFValue } from 'react-native-responsive-fontsize';
import Hud from '../../utils/hud';
import { BASE_URL } from '../../utils/Api/apiName';

const AcceptRide = ({ navigation, route }) => {
  const markerRef = useRef();

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [driverCoordinate, setDriverCoordinate] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
    }),
  );
  const [driverHeading, setDriverHeading] = useState(0);
  const [codeVerify, setcodeVerify] = useState(0);
  const [img, setProfileimg] = useState(null)
  const [name, setName] = useState('')
  const [pickup, setPickup] = useState('');
  const [pickuplat, setPickuplat] = useState(22.5734368);
  const [pickuplng, setPickuplng] = useState(88.4305629);
  const [destination, setDestination] = useState('');
  const [departureTime, setDepartureTime] = useState(null);
  const [riderId, setRiderId] = useState(0);
  const [origin, setOrigin] = useState(null);
  //const [endPoint, setEndPoint] = useState(null);
  const [driverlocation, setDriverlocation] = useState(true);
  const [priceRide, setPriceRide] = useState(0);
  const location = useRef(undefined);
  const [distance, setDistance] = useState(0);

  // useEffect(() => {
  //   if (
  //     route.params?.fromNotification &&
  //     pickup !== '' &&
  //     destination !== '' &&
  //     riderId
  //   ) {
  //     acceptRequest();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pickup, destination, riderId]);

  useEffect(() => {
    getDocument();
    requestLocationPermission();
    const unsubscribe = navigation.addListener('focus', () => {
      getDocument();
    });
    if (driverlocation) {
      location.current = setInterval(() => {
        driverLocation();
      }, 3000);
    }
    return () => {
      Geolocation.clearWatch();
      clearTimeout(location.current);
      unsubscribe;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverlocation]);

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
        setOrigin(position.coords);
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

  const subscribeLocationLocation = () => {
    const watchID = Geolocation.watchPosition(
      position => {
        //Will give you the location on location change

        setLocationStatus('You are Here');
        console.log('subscribeLocationLocation', position);

        //getting the Longitude from the location json
        const currentLongitude = position.coords.longitude;

        //getting the Latitude from the location json
        const currentLatitude = position.coords.latitude;

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
        //generateMarkers(currentLatitude, currentLongitude)
        /* setDriverCoordinate(
          new AnimatedRegion({
            latitude: parseFloat(position.coords.latitude),
            longitude: parseFloat(position.coords.longitude),
          }),
        ); */
        animate(position.coords.latitude, position.coords.longitude);
        setDriverHeading(position.coords.heading);
      },
      error => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      },
    );
  };

  const getDocument = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('++++++++++++++++++++++++++++++++++++++', token);

    await axios
      .get(BASE_URL + 'ride-request-list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log('1232222132132132132132132132 ', response);
        const time =
          response.data.data[
            response.data.data.length - 1
          ].departure_time.split(':');
        const time2 = JSON.stringify(Number(time[1]) + 30);

        time[1] = time2;
        console.log(time);
        const final = time.join(':');
        console.log(final);

        setcodeVerify(response.data.data[response.data.data.length - 1].code);
        setDestination(
          response.data.data[response.data.data.length - 1].destination,
        );
        setPickup(
          response.data.data[response.data.data.length - 1].starting_point,
        );
        setDistance(
          response.data.data[response.data.data.length - 1].kilometer,
        );
        setDepartureTime(
          response.data.data[response.data.data.length - 1].departure_time,
        );
        setPickuplat(
          response.data.data[response.data.data.length - 1].latitude_departure,
        );
        setPickuplng(
          response.data.data[response.data.data.length - 1].longitude_departure,
        );
        setProfileimg(response.data.path)
        setName(response.data.data[response.data.data.length - 1].name)
        setRiderId(response.data.data[response.data.data.length - 1].id);
        setPriceRide(response.data.data[response.data.data.length - 1].price);
        AsyncStorage.setItem('rider_list', JSON.stringify(response));
      })
      .catch(err => {
        console.log('err1', err.response.data.message);
        Alert.alert(err.response.data.message);
      });
    // await axios
    //   .get('http://kabou.us/api/driver/ride-request-list', {
    //     headers: {
    //       Authorization: 'Bearer ' + token,
    //     },
    //   })
    //   .then(res => {
    //     // write your code here.
    //     console.log('<<<<<<👍>>>>>>', JSON.stringify(res));
    //   })
    //   .catch(err => {
    //     console.log('======//🔥//=====', err.response.data);
    //   });
  };

  const acceptRequest = async () => {
    console.log("+++++++++Accept Ride+++++++++++++")
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('++++++++++++++++++++++++++++++++++++++accept', token);
    console.log('riderID', riderId);
    console.log('currentlocation: ', currentLatitude);
    console.log('currentlocation: ', currentLongitude);
    const body = {
      id: riderId,
      latitude: parseFloat(currentLatitude),
      longitude: parseFloat(currentLongitude),
    };
    console.log('data', body);
    Hud.showHud();
    await axios({
      method: 'post',
      url: BASE_URL + 'accept-ride-request',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        console.log('Accept request ride ', response.data);
        Hud.hideHud();
        Alert.alert("", response.data.message)
        if (response.data.status == 'true') {

          setDriverlocation(false);
          clearInterval(location.current);
          AsyncStorage.setItem('rideRequest', JSON.stringify(response.data));
          navigation.navigate('acceptRide');
        }


        //setIsEnabled(response.success)
        // setFilePathDlFront(response.data.car_image_number_back)
      })
      .catch(err => {
        console.log('err2', JSON.stringify(err.response.data.Error_code));
        Hud.hideHud();
        const error = JSON.stringify(err.response.data.message);


        if (err.response.data.Error_code) {
          Alert.alert('Sorry', `${error}`, [
            { text: 'OK' },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ]);

        }
        else {
          Alert.alert('Sorry', `${error}`, [
            {
              text: 'OK',
              //onPress: () => navigation.navigate('documentUpload') 
            },
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
          ]);

        }

      });
  };
  const driverLocation = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    // console.log('++++++++++++++++++++++++++++++++++++++location', token);
    const body = {
      latitude: currentLatitude,
      longitude: currentLongitude,
    };
    // console.log('data', body);
    //Hud.showHud();
    await axios({
      method: 'post',
      url: 'http://kabou.us/api/driver/save-location',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        // console.log('Driver location ', response);
        //Hud.hideHud();
      })
      .catch(err => {
        console.log(
          'err2============',
          JSON.stringify(err.response.data.message),
        );
        //Hud.hideHud();
      });
  };
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = currentLongitude / height;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  const originroute = { latitude: currentLatitude, longitude: currentLongitude };
  const destinationroute = { latitude: pickuplat, longitude: pickuplng };
  const GOOGLE_MAPS_APIKEY = google_api_key;
  const mapRef = useRef();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header navigation={navigation} />

      <View style={styles.topContainer}>
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
              longitudeDelta: 0.00121,
            }}
            showsCompass={true}
            followsUserLocation={true}
            showsUserLocation={true}
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
              <View>

                <Image
                  style={{
                    width: 15,
                    height: 15,
                    padding: allPadding,
                    borderRadius: allRadius,
                    borderColor: '#000',
                    borderWidth: 2,
                  }}
                  source={{ uri: img }}
                />

              </View>
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
                //console.log('Distance:', result);
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

          <Text style={{ position: 'absolute' }}>Longitude: {pickuplat}</Text>

          <Text style={{ position: 'absolute', top: calcH(0.025) }}>
            Latitude: {pickuplng}
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.btnMainContainer}>
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
              width: calcW(0.8),
              flexDirection: 'row',
              //padding: allPadding,
            }}>
            <Text style={styles.price}>EST. cost: ${priceRide}</Text>
            <Text style={styles.price}>WT. cost: $0.00</Text>
            <Text style={styles.price}>
              Dist: {Number(distance).toFixed(2)} mi.
            </Text>
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
                fontSize: RFValue(14),
                color: colors.textHeader,
                marginRight: calcW(0.05),
              }}>
              Total: ${priceRide}
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.btnSubContainer}
              onPress={() => acceptRequest()}
            // disabled={route.params?.fromNotification === true}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnFamilySubContainer}
              onPress={() => navigation.navigate('homeScreen')}>
              <Text style={styles.btnBlackText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcceptRide;

const styles = StyleSheet.create({
  topContainer: {
    // alignItems: 'center',
    //flex: 1,
    height: calcH(0.528),
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(0.54),
    position: 'absolute',
    borderColor: 'orange',
    borderWidth: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  btnMainContainer: {
    backgroundColor: colors.background,
    flex: 1,
    // height: calcH(0.08),
    //marginBottom: calcH(0.02),
    //padding: allPadding,
    padding: 5,
  },
  btnContainer: {
    alignItems: 'center',
    marginTop: calcH(0.015),
  },
  btnSubContainer: {
    width: calcW(0.9),
    height: buttonHeight,
    borderRadius: allRadius,
    backgroundColor: colors.buttonColor,
    justifyContent: 'center',
    alignItems: 'center',
    //bottom: calcH(0.01),
  },
  btnFamilySubContainer: {
    marginTop: calcH(0.01),
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
    //borderColor: '#000',
    borderWidth: 0,
    shadowColor: '#003169',
    elevation: 1,
    shadowOpacity: 1,
  },
  price: {
    left: calcW(0.05),
    marginTop: calcW(0.02),
    fontWeight: '500',
    fontSize: RFValue(12),
    color: colors.textHeader,
    marginRight: calcW(0.05),
  },
});
