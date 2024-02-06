import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../utils/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  logoHeight,
  logoWidth,
  fontSize,
} from '../../utils/comon';
import {RFValue} from 'react-native-responsive-fontsize';
import axios from 'axios';
import MapView, {
  Marker,
  MarkerAnimated,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BookingStep3 = props => {
  const pickUproute = props.route.params.userPickup;
  const destinationRoute = props.route.params.userDestination;
  console.log('eeeee', pickUproute.description);
  console.log('llll ', destinationRoute.description);
  const [email, setEmail] = useState('');
  const [focusEmail, setFocusEmail] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [pickupPlace, setPickupPlace] = useState('');
  const [destinationPlace, setDestinationPlace] = useState('');
  const [verifyCode, setVerifyCode] = useState(0);
  const [waitingTime, setWaitingTime] = useState(0);
  const [waitingCharge, setWaitingCharge] = useState(0);

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };
  useEffect(async () => {
    // const pickUproute = route.params.pickupPlace;
    fetch();
    fetchPrice();
    console.log('eeeee', pickUproute);
    if (pickUproute && destinationRoute) {
      setPickupPlace(pickUproute.description);
      setDestinationPlace(destinationRoute.description);
    }
    const code = await AsyncStorage.getItem('verification_code');
    console.log(code);
    setVerifyCode(code);
  }, []);
  const [coordinate, setCoordinate] = useState([
    {
      id: 0,
      latitude: 12.899844,
      longitude: 77.63163,
    },
    {
      id: 1,
      latitude: 12.905925,
      longitude: 77.632347,
    },
    {
      id: 2,
      latitude: 12.899844,
      longitude: 77.631634,
    },
    {
      id: 3,
      latitude: 12.905925,
      longitude: 77.632347,
    },
  ]);

  const fetch = async () => {
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
        console.log(response.data);
        AsyncStorage.setItem(
          'waiting_charge',
          JSON.stringify(response.data.data[0].price),
        );
        setWaitingCharge(response.data.data[0].price);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <ScreenScrollComponent>
      <View style={styles.topContainer}>
        <View style={styles.queryContainer}>
          <View style={styles.firstContainer}>
            <TouchableOpacity
              style={styles.arrowContainer}
              onPress={() => navigation.navigate('bookingStep2')}>
              <Image
                style={styles.arrowIcon}
                source={require('../../../assets/images/back_arrow.png')}
              />
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
                  placeholder="Dum dum airport"
                  value={pickupPlace}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text)}
                />
              </View>
            </View>
          </View>

          <IconMaterialCommunityIcons
            style={{left: calcW(0.085)}}
            size={20}
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
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setEmail(text)}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mapContainer}>
          {/* <Image style={styles.mapView} source={require('../../asserts/map_step1.png')} /> */}
          <MapView
            style={{
              width: calcW(1),
              height: calcH(0.55),
              alignItems: 'center',
            }}
            provider={
              Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
            }
            rotateEnabled={true}
            showsUserLocation={true}
            showsTraffic={false}
            showsMyLocationButton={true}
            zoomEnabled={true}
            initialRegion={{
              latitude: 12.899305,
              longitude: 77.634118,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}>
            {coordinate.map(item => (
              <MarkerAnimated
                draggable
                key={item.id}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude,
                }}
                rotation={15}>
                <View>
                  <Image
                    source={require('../../../assets/images/car_premium.png')}
                    style={{width: calcW(0.15), height: calcH(0.03)}}
                  />
                </View>
              </MarkerAnimated>
            ))}
          </MapView>
        </View>

        <View style={{}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: calcH(0.05),
              justifyContent: 'space-between',
              padding: allPadding,
              shadowColor: '#808080',
              elevation: 0.5,
              shadowOpacity: 1,
              borderBottomWidth: 0,
              marginBottom: calcH(0.02),
            }}>
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
              source={require('../../../assets/images/user.jpeg')}
            />
            <View
              style={{
                marginLeft: calcH(0.03),
              }}>
              <Text style={styles.textphone}>+912542154124</Text>
              <Text style={styles.textphone}>John Doe</Text>
              <Text>Total Ride: 15+</Text>
            </View>
            <View
              style={{
                marginLeft: calcH(0.12),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../../assets/images/star.png')}
                  style={{
                    width: calcW(0.04),
                    height: calcH(0.02),
                  }}
                />
                <Text>4.9</Text>
              </View>
              <Text style={styles.textphone}>$120.00</Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: 'space-between',
              flexDirection: 'row',
              padding: allPadding,
              shadowColor: '#808080',
              elevation: 0.5,
              shadowOpacity: 0.5,
              borderBottomWidth: 0,
              marginBottom: calcH(0.02),
            }}>
            <View>
              <Text>Code verification</Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: RFValue(22),
                }}>
                {verifyCode}
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
              }}>
              <View>
                <Text style={styles.textTime}>{waitingTime} min</Text>
                <Text style={styles.textStyle}>Free waiting time</Text>
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
              }}>
              <View>
                <Text style={styles.textTime}>00.00 min</Text>
                <Text style={styles.textStyle}>Stopages time</Text>
              </View>
              <View>
                <Text style={styles.textTime}>$0.00</Text>
                <Text style={styles.textStyle}>Stopages time cost</Text>
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
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>The car arrived but you didn't come</Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: calcH(0.06),
                width: calcW(0.9),
                borderRadius: allRadius,
                backgroundColor: colors.buttonColor,
                marginTop: calcH(0.02),
                marginBottom: calcH(0.02),
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold'}}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenScrollComponent>
  );
};

export default BookingStep3;

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  queryContainer: {
    width: calcW(0.9),
    height: calcH(0.25),
  },
  firstContainer: {
    marginTop: calcW(0.02),
    flexDirection: 'row',
    height: calcH(0.1),
  },
  dottedContainer: {},
  dottIcon: {
    //  height: calcH(0.1),
  },
  secondContainer: {
    marginTop: calcW(-0.02),
    flexDirection: 'row',
    height: calcH(0.1),
  },
  arrowContainer: {
    justifyContent: 'center',
    width: '10%',
  },
  arrowIcon: {
    width: calcW(0.04),
    height: calcH(0.015),
    // marginTop: calcH(0.015),
    // backgroundColor:'red'
  },
  middleContainer: {
    width: '10%',
    justifyContent: 'center',
  },
  circleIcon: {
    width: calcW(0.03),
    height: calcW(0.03),
  },
  locationIcon: {
    width: calcW(0.03),
    height: calcW(0.038),
  },
  fromContainer: {
    width: '80%',
    justifyContent: 'center',
    // backgroundColor: colors.buttonColor,
  },
  textInput: {
    color: '#22272E',
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
  },
  textChoose: {
    textAlign: 'center',
    color: '#22272E',
    fontSize: 16,
  },
  mapContainer: {
    width: calcW(1),
    height: calcH(0.5),
    borderWidth: 1,
    borderTopColor: colors.buttonAnothercolor,
    borderBottomColor: colors.buttonAnothercolor,
  },

  lowerContainer: {
    marginTop: calcW(0.1),
    height: calcH(0.54),
  },
  mapView: {
    width: calcW(1),
    height: calcH(0.6),
    alignItems: 'center',
  },
  btnMainContainer: {
    height: calcH(0.08),
  },

  btnconfirmContainer: {
    height: calcH(0.08),
    marginTop: calcH(0.04),
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
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  btnText: {
    left: calcW(0.08),
    fontSize: 15,
    color: colors.textHeader,
    fontWeight: '500',
  },
  choosherContainer: {
    height: calcH(0.1),
    justifyContent: 'center',
    marginTop: calcW(0.01),
  },

  inActiveBorder: {
    width: '100%',
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
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
  },
  detailsContainer: {
    marginTop: calcW(0.01),
    height: calcW(0.15),
    width: calcW(0.9),
    flexDirection: 'row',
    // backgroundColor: colors.buttonColor
  },
  carContainer: {
    width: '30%',
    justifyContent: 'center',
  },
  carImage: {
    left: calcW(0.026),
    width: calcW(0.18),
    height: calcH(0.04),
  },
  desContainer: {
    width: '45%',
    justifyContent: 'center',
  },
  title: {
    color: '#3B4045',
    fontSize: 18,
    fontWeight: '500',
  },
  subtitle: {
    color: '#3B4045',
    fontSize: 15,
    fontWeight: '400',
  },
  priceContainer: {
    width: '25%',
    justifyContent: 'center',
  },
  nextdetailsContainer: {
    marginTop: calcW(0.02),
    height: calcW(0.15),
    width: calcW(0.9),
    flexDirection: 'row',
    backgroundColor: colors.buttonAnothercolor,
  },
  textphone: {
    fontSize: fontSize,
    fontWeight: 'bold',
  },
  textTime: {
    fontSize: RFValue(18),
    color: colors.activeBorder,
    fontWeight: 'bold',
  },
  textStyle: {
    color: colors.activeBorder,
  },
});
