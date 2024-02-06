import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  Modal,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  Platform,
} from 'react-native';

import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  calcH,
  calcW,
  cardButtonHeight,
} from '../../utils/comon';

import Evilcons from 'react-native-vector-icons/dist/EvilIcons';
import IconMaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {RFValue} from 'react-native-responsive-fontsize';
import DatePicker from 'react-native-datepicker';
import axios from 'axios';
import {ImagePickerModal} from './../../Components/image-picker-modal';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import Hud from '../../utils/hud';
import {BASE_URL} from '../../utils/Api/apiName';
import {Input, Stack} from 'native-base';

export default function RideHistory(props) {
  console.log('route', props.route.params);
  const [date, setDate] = useState(new Date());

  const [modalVisible, setModalVisible] = useState(false);

  const [tollamount, setTollamount] = useState('');
  const [riderdata, setRiderdata] = useState(props.route.params);
  const [ridername, setRidername] = useState('');
  const [filePathCarSideBack, setFilePathCarSideBack] = useState(null);
  const [tollname, setTollname] = useState('');
  const [visibleCarSideBack, setVisibleCarSideBack] = useState({open:false, index: ''});
  const [tolladd, setTolladd] = useState([
    {
      image: undefined,
      amount: '',
      name: '',
    },
  ]);
  const [bookingdate, setBookingdate] = useState('');
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      requestCameraPermission()
      setRiderdata(props.route.params);
      setRidername(props.route.params.rider.name);
      setBookingdate(props.route.params.booking_date);
      setBookingId(props.route.params.id);
      setModalVisible(false);
    });
    return unsubscribe;
  }, [props.route.params, props.navigation]);

  const updatedetails = async () => {
    setModalVisible(false);
    // const indexRide = props.route.params.details;
    // console.log('&&&&&&&&&&&&&&&&&&&&&&&', indexRide);
    Hud.showHud();
    const detailsRide = props.route.params;
    //const detailsIndex = JSON.parse(await AsyncStorage.getItem('rideIndex'));
    console.log('@@@@@@@@@@@@@@@@', detailsRide);
    Hud.hideHud();
    //console.log('@@@@@@@@@@@@@@@@INDEX', detailsIndex);
    //if(indexRide === detailsRide)
    setRiderdata(detailsRide);
    setRidername(detailsRide.rider.name);
    setBookingdate(detailsRide.booking_date);
    // setTolladd([]);
    // setFilePathCarSideBack(null);
    // setTollamount(0);
    // setTollname('');
  };

  const tollAddMore = () => {
    setTolladd(prevData => [
      ...prevData,
      {
        image: undefined,
        amount: '',
        name: '',
      },
    ]);
    console.log('Tolladd', tolladd);
  };
  const permissionState = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

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

  const onCameraPressCarSideBack = React.useCallback(index => {
    const options = {
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleCarSideBack(false);
              setTolladd(prevData => {
                const updatedData = [...prevData];
                updatedData[index].image = source.assets[0].uri ?? undefined;
                return updatedData;
              });
              setFilePathCarSideBack(source);
      }
    });
    // const options = {
    //   saveToPhotos: true,
    //   mediaType: 'photo',
    //   includeBase64: false,
    // };
    // console.log("index", index);
    // request(PERMISSIONS.ANDROID.CAMERA)
    //   .then(data => {
    //     if (data === RESULTS.GRANTED) {
    //       launchCamera(options, response => {
    //         console.log('Response = ', response);

    //         if (response.didCancel) {
    //           console.log('User cancelled image picker');
    //         } else if (response.error) {
    //           console.log('ImagePicker Error: ', response.error);
    //         } else if (response.customButton) {
    //           console.log('User tapped custom button: ', response.customButton);
    //           Alert.alert(response.customButton);
    //         } else {
    //           let source = response;
    //           console.log('', response);
    //           setVisibleCarSideBack(false);
    //           // setTolladd(prevData => {
    //           //   const updatedData = [...prevData];
    //           //   updatedData[index].image = source.assets[0].uri ?? undefined;
    //           //   return updatedData;
    //           // });
    //           setFilePathCarSideBack(source);
    //         }
    //       });
    //     } else {
    //       console.error('Camera permission failed');
    //     }
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }, []);

  //////////////////////////////////////////////////////////////////

  const onImageLibraryPressCarSideBack = React.useCallback(index => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', index);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data4====>',
          response,
        );
        setVisibleCarSideBack(false);
        setFilePathCarSideBack(source);
        setTolladd(prevData => {
          const updatedData = [...prevData];
          updatedData[index].image = source.assets[0].uri ?? undefined;
          return updatedData;
        });
      }
    });
  }, []);

  const addTollUpdate = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));

    console.log('===========>', token, tolladd);
    const array = tolladd.map(item => {
      console.log('$$$$$$$$$$$', item.amount);

      console.log('Tolladd1111111111', item.name);
      let formdata = new FormData();

      formdata.append('toll_image[]', {
        uri: item.image,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('amount', item.amount);
      formdata.append('name', item.name);
      formdata.append('booking_id', bookingId);
      formdata.append('date', bookingdate);
      // const driver = JSON.parse(data);
      // console.log(JSON.stringfy, 'formdata=====>', formdata, vehicle);
      console.log('formdata=====>', JSON.stringify(formdata));
      Hud.showHud();
      axios({
        url: BASE_URL + 'add-toll-info',
        method: 'POST',
        data: formdata,
        headers: {
          //Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          console.log('response :', response);
          Hud.hideHud();
          if (response.data) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            //AsyncStorage.setItem('user_doc', JSON.stringify(response.data));

            // setTimeout(() => {
            //   navigation.navigate('account');
            // }, 1000);
          }
        })
        .catch(function (error) {
          console.log('error from image :', error.response.data);
          Hud.hideHud();
          Toast.show({
            type: 'error',
            text1: error.response.data.message,
          });
        });
    });
  };
  const handleNavigation = () => {
    props.navigation.goBack(null);
    setRiderdata();
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        // margin: calcW(0.05),
        padding: 18,
        backgroundColor: colors.background,
      }}>
      {/* <Header navigation={props.navigation} /> */}

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => handleNavigation()}>
          <Image
            style={styles.arrowIcon}
            source={require('../../asserts/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>Ride Details</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{flex: 1}}> */}
        <View style={styles.listingContainer}>
          <View style={styles.boxContainer}>
            <View style={styles.subboxContainer}>
              {/* status */}
              <View
                style={
                  riderdata?.book_status === 'Booked'
                    ? styles.bookingStatus
                    : styles.bookingStatusC
                }>
                <Evilcons
                  name={'check'}
                  size={20}
                  color={'#fff'}
                  style={{right: calcW(0.02)}}
                />
                <Text
                  style={{
                    //width: '90%',
                    //left: calcW(0.03),
                    //height: calcH(0.06),
                    right: calcW(0.02),
                    color: '#fff',
                  }}>
                  {riderdata?.book_status}
                </Text>
              </View>
              {/* <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                }}>
                <Image
                  style={styles.closeIcon}
                  source={require('../../asserts/cross_model.png')}
                />
              </TouchableOpacity> */}
              <View style={styles.normalcontainer}>
                <Text style={styles.normalText}>R5248</Text>
              </View>
              <View style={styles.firstRow}>
                <View style={styles.otherContainer}>
                  <Image
                    style={styles.calender2Icon}
                    source={require('../../asserts/calender1.png')}
                  />
                  <Text style={styles.dateText}>{riderdata?.booking_date}</Text>
                  <Image
                    style={styles.timeIcon}
                    source={require('../../asserts/clock.png')}
                  />
                  <Text style={styles.timeText}>{riderdata?.booking_time}</Text>
                </View>
              </View>

              <View style={styles.drivercontainer}>
                <Text style={styles.driverText}>{ridername}</Text>
                {/* <Text style={styles.priceText}>$152.00</Text> */}
              </View>
              <View style={styles.lineStyle} />
              <View style={styles.directioncontainer}>
                <View style={styles.firstline}>
                  <View style={styles.subfirstline}>
                    <Image
                      style={styles.circleIcon}
                      source={require('../../asserts/circle.png')}
                    />
                    <Text style={styles.placeText}>
                      {riderdata?.starting_point}
                    </Text>
                  </View>
                </View>
                <View style={styles.middleline}>
                  <IconMaterialCommunityIcons
                    size={16}
                    name={'dots-vertical'}
                  />
                </View>
                <View style={styles.lastline}>
                  <View style={styles.sublastline}>
                    <Image
                      style={styles.locationIcon}
                      source={require('../../asserts/location.png')}
                    />
                    <Text style={styles.placeText}>
                      {riderdata?.destination}
                    </Text>
                  </View>
                  <Text style={styles.priceText}>
                    ${riderdata?.total_booking_cost}
                  </Text>
                </View>
                <View style={styles.lineStyle} />
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Ride cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>${riderdata?.bk_cost}</Text>
                </View>
                {/* <View style={styles.lineStyle}/>  */}
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Waiting Time cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>${riderdata?.wt_cost}</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Stoppage time cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>
                    ${riderdata?.st_cost}
                  </Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Tips</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>${riderdata?.tips}</Text>
                </View>
                {riderdata?.cancel_status !== null ? (
                  <View style={styles.rideDetails}>
                    <View style={styles.subleftContainer}>
                      <Text style={styles.leftcostText}>Cancellation cost</Text>
                      <Text style={styles.colontext}>:</Text>
                    </View>
                    <Text style={styles.rightcostText}>
                      ${riderdata?.canceled_cost}
                    </Text>
                  </View>
                ) : null}
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Total Amount</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>
                    ${riderdata?.total_booking_cost}
                  </Text>
                </View>
                {riderdata?.book_status === 'Booked' ? (
                  <View
                    style={{
                      marginTop: calcH(0.02),
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.buttonColor,
                        width: calcW(0.2),
                        height: calcH(0.05),
                        borderRadius: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => setModalVisible(true)}>
                      <Text
                        style={{
                          fontSize: RFValue(13),
                          color: '#fff',
                          fontWeight: 'bold',
                        }}>
                        Add Toll
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {modalVisible === true ? (
          <View style={styles.topContainer}>
            {/* <View style={styles.headerContainer}>
               <TouchableOpacity onPress={() => navigation.goBack()}>
                 <Image
                   style={styles.arrowIcon}
                   source={require('../../asserts/back_arrow.png')}
                 />
               </TouchableOpacity>
               <Text style={styles.instruction}>Add Toll Receipt</Text>
             </View> */}
            <View style={styles.secondContainer}>
              <Text style={styles.textHeader}>Add Toll Receipt Price</Text>
              <Text>Upload your toll receipt photo for verification</Text>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={styles.inputBox}>
                  <TextInput
                    
                    style={styles.textInput}
                    editable={false}
                 value={JSON.stringify(bookingId)}
                    // placeholder="Booking id"
                    // onChangeText={text => }
                    placeholderTextColor="#C9CCCF"
                  />
                  <DatePicker
                    style={styles.datePickerStyle}
                    date={bookingdate}
                    mode="date"
                    placeholder="select date"
                    format="DD/MM/YYYY"
                    minDate="01-01-1900"
                    maxDate={date}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        right: -5,
                        top: 4,
                        marginLeft: 0,
                        tintColor: '#4d4d4d',
                      },
                      dateInput: {
                        borderColor: 'gray',
                        alignItems: 'flex-start',
                        borderWidth: 0,
                        borderBottomWidth: 0,
                      },
                      placeholderText: {
                        fontSize: RFValue(16),
                      },
                      dateText: {
                        fontSize: RFValue(16),
                      },
                      datePickerCon: {
                        backgroundColor: '#00a3ff',
                      },
                    }}
                    // onDateChange={date => {
                    //   setDate(date);
                    // }}
                  />
                </View>
                {/* {console.log("tolladd", tolladd)} */}
                <FlatList
                  nestedScrollEnabled={true}
                  data={tolladd}
                  // keyExtractor={item=> item.}
                  renderItem={({item, index}) => {
                    return (
                      <Stack
                        key={index}
                        style={{paddingVertical: 10}}
                        space={2}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderRadius: 5,
                            borderStyle: 'dashed',
                            padding: 10,
                          }}>
                           
                          <View>
                            {item.image ? (
                              <Image
                                source={{
                                  uri: item.image,
                                }}
                                style={{
                                  width: 45,
                                  height: 45,
                                  borderRadius: 45 / 2,
                                }}
                              />
                            ) : (
                              <IconMaterialCommunityIcons
                                color={'#909090'}
                                size={24}
                                name={'upload'}
                              />
                            )}
                          </View>

                          <Text style={{marginHorizontal: 10}}>
                            Image file to upload
                          </Text>
                          <ImagePickerModal

                            isVisible={visibleCarSideBack.open}
                            onClose={() => setVisibleCarSideBack(false)}
                            onImageLibraryPress={() =>
                              onImageLibraryPressCarSideBack(visibleCarSideBack.index)
                              // console.log("asfdas", visibleCarSideBack.index)
                            }
                            onCameraPress={() =>
                              onCameraPressCarSideBack(visibleCarSideBack.index)
                            }
                          />

                          <TouchableOpacity
                            onPress={() => 
                            setVisibleCarSideBack({open: true, index: index})
                            // console.log("ibbfs", index)
                            }>
                            <View style={styles.buttonStyle}>
                              <Text style={styles.buttonTextStyle}>
                                Select File
                              </Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <Input
                          placeholder="Toll name"
                          value={item.name}
                          onChangeText={val => {
                            setTolladd(prevData => {
                              const updatedData = [...prevData];
                              updatedData[index].name = val;
                              return updatedData;
                            });
                          }}
                        />
                        <Input
                          placeholder="Toll amount"
                          value={item.amount}
                          onChangeText={val => {
                            setTolladd(prevData => {
                              const updatedData = [...prevData];
                              updatedData[index].amount = val;
                              return updatedData;
                            });
                            // console.log("gsd", index)
                          }}
                        />
                      </Stack>
                    );
                  }}
                />
              </View>
            </View>
            <View style={styles.thirdContainer}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => tollAddMore()}>
                <Image
                  source={require('../../asserts/add.png')}
                  style={styles.addnew}
                  resizeMode={'contain'}
                />
                <Text style={{color: '#000000'}}>Add more</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{width: '100%'}}
              onPress={() => addTollUpdate()}>
              <View
                style={{
                  width: calcW(0.9),
                  backgroundColor: colors.buttonColor,
                  height: calcH(0.07),
                  borderRadius: allRadius,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: calcW(0.1),
                  marginBottom: calcH(0.05),
                }}>
                <Text style={styles.buttonTextStyle}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
        {/* </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    top: calcH(0.05),
    flex: 1,
  },
  headerContainer: {
    width: '100%',
    height: calcH(0.05),
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  calenderIcon: {
    alignItems: 'center',
    // marginTop:calcW(0.02),
    width: calcW(0.056),
    height: calcW(0.066),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: RFValue(16),
    fontWeight: '500',
    color: colors.textHeader,
  },
  lowerContainer: {
    // width: calcW(0.9),
    // height: calcH(0.18),
    // backgroundColor:colors.primary,
  },
  listingContainer: {
    alignItems: 'center',
    // backgroundColor: colors.background,
    // top: calcH(0.05),
    padding: 12,
    borderColor: '#000',
    borderWidth: 0,
    flex: 1,
  },
  searchCalenderContainer: {
    height: calcH(0.1),
    flexDirection: 'row',
    // backgroundColor:colors.white,
  },
  mainnormalcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowIcon: {
    alignItems: 'center',
    marginTop: calcW(0.02),
    width: calcW(0.04),
    height: calcH(0.015),
  },
  activeBorder: {
    width: '76%',
    height: calcW(0.15),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    backgroundColor: colors.white,
  },
  inActiveBorder: {
    width: '76%',
    height: calcW(0.15),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    backgroundColor: colors.white,
  },

  calender: {
    width: '18%',
    left: calcW(0.05),
    height: calcW(0.15),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: calcW(0.2),
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  checkBoxContainer: {
    width: '97%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    marginTop: calcW(0.01),
    borderColor: '#C9CCCF',
    // backgroundColor:colors.white,
    // borderWidth: 1,
  },
  checkBoxContainer2: {
    width: '5%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 5,
    borderColor: '#C9CCCF',
    marginBottom: calcH(0.1),
    backgroundColor: colors.primary,
  },
  otherContainer: {
    width: '85%',
    //marginTop:calcH(0.01),
    //left: calcW(0.02),
    flexDirection: 'row',
    height: calcH(0.06),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    width: '8%',
    left: calcW(0.02),
    height: calcH(0.06),
  },

  delIcon: {
    width: calcW(0.04),
    height: calcW(0.06),
  },
  mainboxContainer: {
    marginTop: calcH(0.02),
    width: calcW(0.9),
    height: calcH(0.2),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  boxContainer: {
    //marginTop: calcH(0.01),
    justifyContent: 'center',
    // top: calcW(-0.08),
    // flex: 1,
  },
  mainsubboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.8),
    height: calcH(0.18),
    left: calcW(0.05),
  },
  subboxContainer: {
    width: '100%',
    flex: 1,
    //left: calcW(0.0),
  },
  bookingStatus: {
    flexDirection: 'row',
    width: calcW(0.25),
    backgroundColor: '#00cc66',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'center',
    height: calcH(0.04),
    padding: '0.8%',
  },
  bookingStatusC: {
    flexDirection: 'row',
    width: calcW(0.25),
    backgroundColor: 'red',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
    alignSelf: 'flex-end',
    height: calcH(0.04),
    padding: '0.8%',
  },
  priceText: {
    fontSize: RFValue(14),
    color: '#00cc66',
    fontWeight: '600',
  },
  mainfirstRow: {
    flexDirection: 'row',
    // backgroundColor: colors.primary,
    justifyContent: 'flex-start',
    height: calcH(0.06),
  },
  firstRow: {
    flexDirection: 'row',
    // backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    height: calcH(0.065),
  },
  mainotherContainer: {
    width: '85%',
    marginTop: calcH(0.01),
    left: calcW(-0.01),
    flexDirection: 'row',
    height: calcH(0.05),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  calender2Icon: {
    width: calcW(0.034),
    height: calcW(0.032),
  },
  dateText: {
    left: calcW(0.02),
    fontSize: RFValue(12),
    fontWeight: '400',
    color: '#333434',
  },
  timeIcon: {
    // marginBottom: calcH(0.2),
    left: calcW(0.03),
    width: calcW(0.034),
    height: calcW(0.032),
  },
  timeText: {
    left: calcW(0.038),
    fontSize: RFValue(12),
    fontWeight: '400',
    color: '#333434',
  },

  normalcontainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  normalText: {
    fontSize: RFValue(20),
    fontWeight: '500',
    color: '#121212',
  },
  drivercontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  maindrivercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: calcH(-0.02),
  },
  driverText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#121212',
  },
  lineStyle: {
    width: '100%',
    marginVertical: calcH(0.02),
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  directioncontainer: {
    flex: 1,
    // height: calcH(0.3),
    // backgroundColor : colors.primary
  },
  firstline: {
    flexDirection: 'row',
    height: calcH(0.05),
    width: calcW(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 0,
    // backgroundColor : colors.buttonColor
  },
  subfirstline: {
    flexDirection: 'row',
    height: calcH(0.05),
    width: calcW(0.5),
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 0,
  },
  circleIcon: {
    width: calcW(0.03),
    height: calcW(0.03),
  },
  locationIcon: {
    width: calcW(0.03),
    height: calcW(0.038),
  },
  lastline: {
    flexDirection: 'row',

    height: calcH(0.05),
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  sublastline: {
    flexDirection: 'row',
    width: calcW(0.5),
    height: calcH(0.05),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  middleline: {
    height: calcH(0.03),
  },
  placeText: {
    //marginBottom: calcH(0.1),
    left: calcW(0.04),
    fontSize: RFValue(13),
    fontWeight: '700',
    color: '#22272E',
  },
  centeredView: {
    width: calcW(1.0),
    height: calcH(0.9),
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    width: calcW(0.85),
    height: calcH(0.78),
    //margin: calcH(0.3),
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  headerView: {
    flexDirection: 'row',
  },
  modalText: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '400',
    color: '#3B4045',
    marginBottom: calcW(0.02),
    textAlign: 'center',
  },
  modalTextdel: {
    left: calcW(0.05),
    fontSize: 18,
    fontWeight: '400',
    color: '#3B4045',
    marginBottom: calcW(0.02),
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  rowIcon: {
    marginTop: calcH(0.01),
    left: calcW(0.01),
    width: calcW(0.04),
    height: calcW(0.05),
    tintColor: '#000',
  },
  centeredModalView: {
    width: calcW(1.0),
    height: calcH(0.6),
    justifyContent: 'center',
    alignItems: 'center',
  },
  childmodalView: {
    // backgroundColor: colors.primary,
    width: calcW(0.8),
    height: calcH(0.2),
    margin: calcH(0.1),
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: calcW(0.075),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerchild: {
    marginBottom: calcH(0.02),
    justifyContent: 'center',
    height: calcH(0.05),
  },

  closeIcon: {
    left: calcW(0.6),
    width: calcW(0.08),
    height: calcW(0.08),
    top: calcH(-0.05),
  },
  dpIcon: {
    marginTop: calcH(0.04),
    left: calcW(0.25),
    width: calcW(0.15),
    height: calcW(0.15),
  },
  modalHeaderText: {
    marginTop: calcH(0.04),
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4045',
  },
  modalSubText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
    color: '#3B4045',
  },

  childDelModelView: {
    width: calcW(0.8),
    height: calcH(0.3),
    margin: calcH(0.3),
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: calcW(0.075),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalDeleteText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3B4045',
  },
  questionText: {
    marginVertical: calcH(0.02),
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#3B4045',
    //marginBottom: calcH(0.09),
  },
  headerDelchild: {
    marginBottom: calcH(0.065),
    justifyContent: 'center',
    height: calcH(0.12),
  },
  footerDelchild: {
    height: calcH(0.04),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  NoDeleteText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#3B4045',
    fontWeight: '500',
  },
  YesDeleteText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#FF4546',
    fontWeight: '500',
  },
  childRideView: {
    width: calcW(0.85),
    height: calcH(0.95),
    margin: calcH(0.45),
    // justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: calcW(0.05),
    padding: calcW(0.04),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerRiderchild: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: calcH(0.1),
    marginBottom: calcH(0.03),
    flexDirection: 'row',
    // backgroundColor: colors.primary
  },
  logoIcon: {
    //left: calcW(0.24),
    height: calcW(0.25),
    width: calcW(0.35),
    resizeMode: 'contain',
  },
  rideDetails: {
    // height: calcH(0.05),

    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#a6a6a6',
    borderBottomWidth: 1,
    // backgroundColor: colors.buttonColor
  },
  closeViewIcon: {
    left: calcW(0.7),
    width: calcW(0.08),
    height: calcW(0.08),
  },
  leftText: {
    textAlign: 'left',
    fontSize: RFValue(14),
    color: '#000',
    fontWeight: 'bold',
  },
  rightText: {
    textAlign: 'right',
    fontSize: RFValue(13),
    color: '#515354',
    fontWeight: '400',
  },
  leftAnsText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#3B4045',
    fontWeight: '500',
  },
  rightAnsText: {
    textAlign: 'right',
    fontSize: 16,
    color: '#3B4045',
    fontWeight: '500',
  },
  leftcostText: {
    textAlign: 'left',
    fontSize: RFValue(14),
    color: '#000',
    fontWeight: 'bold',
  },
  rightcostText: {
    textAlign: 'right',
    fontSize: RFValue(13),
    color: '#3B4045',
    fontWeight: '400',
  },
  leftfinalText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#3165CC',
    fontWeight: '500',
  },
  rightfinalText: {
    textAlign: 'left',
    fontSize: 16,
    color: '#3165CC',
    fontWeight: '500',
  },
  footerRiderText: {
    marginTop: calcH(0.04),
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3165CC',
  },
  eyeIcon: {
    marginTop: calcH(0.01),
    width: calcW(0.055),
    height: calcW(0.032),
    tintColor: colors.buttonColor,
  },
  downloadIcon: {
    marginTop: calcH(0.01),
    width: calcW(0.055),
    height: calcW(0.054),
  },
  colontext: {
    color: '#000',
  },
  subleftContainer: {
    justifyContent: 'space-between',
    borderColor: '#000',
    borderWidth: 0,
    flexDirection: 'row',
    width: calcW(0.45),
  },

  secondContainer: {
    //padding: allPadding,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: calcW(0.85),
    borderBottomColor: '#808080',
    borderBottomWidth: 1,
    paddingVertical: allPadding,
  },
  textHeader: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
    marginBottom: calcH(0.02),
    color: '#000',
  },
  inputBox: {
    flexDirection: 'row',
    borderColor: '#000',
    borderWidth: 0,
    width: calcW(0.95),
    flex: 1,
    // height: calcH(0.15),
    justifyContent: 'space-between',
    alignItems: 'center',
    //marginBottom: calcH(0.0),
    padding: allPadding,
  },
  textInput: {
    fontSize: 16,
    padding: calcW(0.03),
    paddingHorizontal: calcW(0.08),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    width: calcW(0.35),
    height: calcH(0.06),
    borderRadius: allRadius,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#000',
  },
  datePickerStyle: {
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    width: calcW(0.45),
    height: calcH(0.06),
    borderRadius: 25,
    paddingHorizontal: allPadding,
  },
  rowChildView: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    //padding: allPadding,
    //marginHorizontal: 10,
    padding: 7,
  },
  subText: {
    fontSize: 14,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
    padding: allPadding,
  },
  subcontainer: {
    backgroundColor: '#E9E9E9',
    borderRadius: 25,
    height: 40,
    width: 40,
    //left: calcW(0.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 2,
  },
  buttonStyle: {
    width: calcW(0.25),
    backgroundColor: colors.buttonColor,
    height: cardButtonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontSize: RFValue(13),
    fontWeight: 'bold',
    color: colors.white,
    // marginVertical: 10,
  },
  thirdContainer: {
    backgroundColor: colors.buttonAnothercolor,
    height: calcH(0.06),
    width: calcW(0.9),
    marginTop: calcH(0.02),
    padding: allPadding,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addnew: {
    width: calcW(0.09),
    height: calcH(0.05),
    tintColor: '#808080',
    marginRight: calcW(0.02),
  },
});
