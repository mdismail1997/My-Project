import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
} from '../../utils/comon';
import Geolocation from 'react-native-geolocation-service';
import commonToast from '../../utils/commonToast';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  PROVIDER_DEFAULT,
} from 'react-native-maps';
import {check, PERMISSIONS, request} from 'react-native-permissions';
import {Toast} from 'native-base';
import {RFValue} from 'react-native-responsive-fontsize';

export default function FamilyRide({navigation}) {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [focusName, setFocusName] = useState(false);
  const [focusMobile, setFocusMobile] = useState(false);

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  const onFocusTextInputMobile = () => {
    setFocusMobile(true);
  };

  const onBlurTextInputMobile = () => {
    setFocusMobile(false);
  };
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
    if (Platform.OS === 'android') {
      request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        console.warn(result);
        if (result === 'granted') {
          //Alert.alert("Location Permission Granted.");
          checkPermission();
          //nearestDriver();
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
              //     //setAddress(res[1].formattedAddress);
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
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
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
  const familyRide = () => {
    const PhoneNumberRegex =
      /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    if (name === '') {
      commonToast({
        text: 'Please enter name',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (mobile === '') {
      commonToast({
        text: 'Please enter mobile number',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    } else if (!PhoneNumberRegex.test(mobile)) {
      commonToast({
        text: 'Please enter a valid mobile number',
        position: 'top',
        toastFor: 'error',
      });
      return false;
    }
    goRideBookingPage();
  };

  const goRideBookingPage = () => {
    navigation.navigate('bookingStep2', {name, mobile});
  };

  return (
    <SafeAreaView style={styles.topContainer}>
      <HeaderComponent navigation={navigation} icon />
      <ScrollView>
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
                coordinate={{
                  latitude: Number(currentLatitude),
                  longitude: Number(currentLongitude),
                }}
              />
            </MapView>

            <Text>Longitude: {currentLongitude}</Text>

            <Text>Latitude: {currentLatitude}</Text>
          </View>

          <View style={styles.lowerContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <View style={styles.instructionContainer}>
                <Image
                  style={styles.arrowIcon}
                  source={require('../../../assets/images/back_arrow.png')}
                />
                <Text style={styles.instruction}>Ride for Family & Friend</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.infoContainer}>
              <View
                style={
                  focusName === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusName === true ? (
                  <IconAntDesign
                    color={colors.activeBorder}
                    size={24}
                    name={'user'}
                  />
                ) : (
                  <IconAntDesign
                    color={colors.inActiveBorder}
                    size={24}
                    name={'user'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  placeholder="Name"
                  value={name}
                  onBlur={() => onBlurTextInputName()}
                  onFocus={() => onFocusTextInputName()}
                  onChangeText={text => setName(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View
                style={
                  focusMobile === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                {focusMobile === true ? (
                  <IconIonicons
                    color={colors.activeBorder}
                    size={24}
                    name={'ios-call-outline'}
                  />
                ) : (
                  <IconIonicons
                    color={colors.inActiveBorder}
                    size={24}
                    name={'ios-call-outline'}
                  />
                )}
                <TextInput
                  style={styles.textInput}
                  keyboardType="numeric"
                  placeholder="Mobile Number"
                  value={mobile}
                  onBlur={() => onBlurTextInputMobile()}
                  onFocus={() => onFocusTextInputMobile()}
                  onChangeText={text => setMobile(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
            </View>
            <View style={styles.btnconfirmContainer}>
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  style={styles.btnConfirm}
                  onPress={familyRide}>
                  <Text style={styles.btnconfirmText}>Continue</Text>
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
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(0.5),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapView: {
    width: calcW(1),
    height: calcH(0.6),
  },
  lowerContainer: {
    backgroundColor: colors.background,
    height: calcH(0.4),
    marginBottom: calcH(0.08),

    // flex: 1
  },
  infoContainer: {
    marginVertical: calcH(0.01),
    alignItems: 'center',
  },
  inActiveBorder: {
    width: calcW(0.9),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: calcH(0.015),
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  // lowerContainer: {
  //   height: calcH(0.48),
  // //  backgroundColor : colors.background,
  // },
  instructionContainer: {
    flexDirection: 'row',
    marginTop: calcH(0.02),
    width: calcW(0.9),
    paddingLeft: allPadding,
    justifyContent: 'flex-start',
    // backgroundColor: colors.buttonColor
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  textInput: {
    fontSize: 18,
    padding: 10,
    color: '#000000',
  },
  btnconfirmContainer: {
    height: calcH(0.08),
    marginTop: calcH(0.01),
    // marginBottom: calcH(0.2)
  },
  btnContainer: {
    alignItems: 'center',
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
});
