import React, {useState} from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Dimensions,
  Linking,
  //ScrollView,
} from 'react-native';
//import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {allPadding, allRadius, calcH, calcW} from '../../utils/comon';

import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Evilcons from 'react-native-vector-icons/dist/EvilIcons';
import Hud from '../../utils/hud';
import {BASE_URL} from '../../utils/Api/apiName';
import {Center, Divider, IconButton, Popover} from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

export default function RideHistory({navigation}) {
  React.useEffect(() => {
    bookingHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      bookingHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const [modalVisible, setModalVisible] = useState(false);
  // const [actionTriggered, setActionTriggered] = useState('');
  const [data, setData] = useState([]);
  const [errorMessage, seterrorMessage] = useState('');
  const [showdata, setShowData] = useState(false);


  const [dueamount,setDueAmount] = useState(0);
  const [refundamount,setRefundAmount] = useState(0);
  const [paydueamount,setPayDueAmount] = useState(0);
  const [price,setPrice] = useState(0);
  const [actualAmount,setActualAmount] = useState(0);
  const [Distance,setDistance] = useState('');
  
  const [selectedItem, setSelectedItem] = useState();
  const bookingHistory = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('42515464', token.data.data.token);
    const userToken = token.data.data.token;
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'booking-history',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + userToken,
      },
    })
      .then(response => {
        console.log('1232222132132132132132132132 ', response.data.data);
        Hud.hideHud();
        AsyncStorage.setItem('rideCancel', JSON.stringify(response.data.data));
        setData(response.data.data);
      })
      .catch(err => {
        Hud.hideHud();
        console.log('err', err.response.data.message);
        setShowData(true);
        seterrorMessage(err.response.data.message);
        // Alert.alert(err);
      });
  };




  const invoiceGenerate = async (id) => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    console.warn("=======================")
    const userToken = token.data.data.token;
    console.log('=============ID=============', id);
    Hud.showHud();
    await axios({
      method: 'GET',
      url: BASE_URL + `invoice?booking_id=${id}`,
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(function (response) {
        console.log('driver details:::::::::::::::::', response.data);
        Hud.hideHud();
        setRefundAmount(response.data.refunded_amount)
        setDueAmount(response.data.due_amount)
        setPayDueAmount(response.data.paid_due_amount)
        setPrice(response.data.booking_details.price)
        setActualAmount(response.data.booking_details.price)
        // setOrderId(response.data.booking_details.booking_id);
        // setDepartureDate(response.data.booking_details.date_of_departure);
        // setPickupPoint(response.data.booking_details.starting_point);
        // setDestinationPoint(response.data.booking_details.destination);
        // setRideCost(response.data.booking_details.price);
        // setRiderName(response.data.booking_details.rider.name);
        // setDriverName(response.data.booking_details.driver.name);
        // setDrivercab(response.data.booking_details.driver.cab_no);
        // setWaitingCharge(dataalls.waitingtimecharge);
        // setStoppageCharge(dataalls.stoppageCharge);
        // if (response.data.tips !== null) {
        //   setTipsCharge(response.data.tips[0].tips_amount);
        // }
        // setRiderName(response.data.booking_details.rider.name);
        // setRiderph(response.data.booking_details.rider.cellphone);
        //fetchPrice()
        // AsyncStorage.setItem('waiting_time', JSON.stringify(response.data.data.value))
      })
      .catch(function (error) {
        console.log(error);
        Hud.hideHud();
      });
  };

  return (
    // <ScreenScrollComponent>
    <SafeAreaView style={styles.topContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={styles.arrowIcon}
            source={require('../../../assets/images/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.instruction}>Ride History</Text>
      </View>
      {/* <View style={styles.lowerContainer}>
          <View style={styles.searchCalenderContainer}>
            <View
              style={
                focusName === true ? styles.activeBorder : styles.inActiveBorder
              }>
              {focusName === true ? (
                <IconAntDesign
                  color={colors.activeBorder}
                  size={24}
                  name={'search1'}
                />
              ) : (
                <IconAntDesign
                  color={colors.inActiveBorder}
                  size={24}
                  name={'search1'}
                />
              )}
              <TextInput
                style={styles.textInput}
                placeholder="Search"
                value={name}
                onBlur={() => onBlurTextInputName()}
                onFocus={() => onFocusTextInputName()}
                onChangeText={text => setName(text)}
              />
            </View>

            <View style={styles.calender}>
              <Image
                style={styles.calenderIcon}
                source={require('../../asserts/calender.png')}
              />
            </View>
          </View>
          <View style={styles.checkBoxContainer}>
            <CheckBox
              disabled={false}
              tintColors={toggleCheckBox ? colors.buttonColor : null}
              value={toggleCheckBox}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <Text
              style={[
                styles.subText,
                {fontSize: 18, flex: 1, textAlign: 'left'},
              ]}>
              {' '}
              Ride History
            </Text>
            <Image
              style={styles.delIcon}
              source={require('../../asserts/delete.png')}
            />
          </View>
        </View> */}

      <View style={styles.listingContainer}>
        {showdata !== true ? (
          <FlatList
            style={{flex: 1}}
            data={data}
            renderItem={({item, index}) => {
              return (
                <>
                  {item.driver !== null ? (
                    <View style={styles.boxContainer}>
                      <View style={styles.subboxContainer}>
                        <View
                          style={
                            item.book_status === 'Booked'
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
                            {item.book_status}
                          </Text>
                          {/* <Text>{console.warn(item.book_status)}</Text> */}
                        </View>
                        <View style={styles.firstRow}>
                          {/* <View style={styles.checkBoxContainer2}>
                  <CheckBox
                    disabled={false}
                    tintColors={toggleCheckBox ? colors.buttonColor : null}
                    value={toggleCheckBox}
                    onValueChange={newValue => setToggleCheckBox(newValue)}
                  />
                </View> */}
                          <View style={styles.otherContainer}>
                            <Image
                              style={styles.calender2Icon}
                              source={require('../../../assets/images/calender1.png')}
                            />
                            <Text style={styles.dateText}>
                              {item.booking_date}
                            </Text>
                            {/* <Image
                        style={styles.timeIcon}
                        source={require('../../asserts/clock.png')}
                      />
                      <Text style={styles.timeText}>{item.booking_time}</Text> */}
                          </View>
                        </View>
                        {/* <View style={styles.normalcontainer}>
                    <Text style={styles.normalText}>5248</Text>
                  </View> */}
                        <View style={styles.drivercontainer}>
                          {/* {console.log('item.driver.name', item.driver.name)} */}
                          <Text style={styles.driverText}>
                            {item.driver.name}
                          </Text>
                          <Popover
                            trigger={triggerProps => {
                              return (
                                <IconButton
                                  {...triggerProps}
                                  rounded="full"
                                  icon={
                                    <IconMaterialCommunityIcons
                                      size={30}
                                      name={'dots-vertical'}
                                    />
                                  }
                                />
                              );
                            }}>
                            <Popover.Content w="56">
                              <Popover.Arrow />
                              <Popover.CloseButton />
                              <Popover.Body>
                                <TouchableOpacity
                                  style={styles.rowContainer}
                                  onPress={() => {
                                    setModalVisible(true);
                                    setSelectedItem(item);
                                    setDistance(item.distance)
                                    invoiceGenerate(item.b_id)

                                  }}>
                                  <Image
                                    style={styles.eyeIcon}
                                    source={require('../../../assets/images/eye.png')}
                                    resizeMode="contain"
                                  />
                                  <Text style={styles.modalText}>View</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  style={styles.rowContainer}
                                  onPress={() => {
                                    Linking.openURL(
                                      `https://kabou.us${item.invoice}`,
                                    );
                                  }}>
                                  <Image
                                    style={styles.downloadIcon}
                                    source={require('../../../assets/images/image.png')}
                                    resizeMode="contain"
                                  />
                                    {/* <Text style={styles.modalText}>{console.log("==================Itemmmmmm%%%%55555555555",item.invoice)}</Text> */}
                                  <Text style={styles.modalText}>Download</Text>
                                </TouchableOpacity>
                              </Popover.Body>
                            </Popover.Content>
                          </Popover>
                        </View>

                        <View style={styles.lineStyle} />
                        <View style={styles.directioncontainer}>
                          <View style={styles.firstline}>
                            <Image
                              style={styles.circleIcon}
                              source={require('../../../assets/images/circle.png')}
                            />
                            <Text style={styles.placeText} >
                              {item.starting_point}
                            </Text>
                            {/* <Text style={styles.placeText} >
                              Brainium information Technology Private limited
                            </Text> */}
                          </View>
                          <View style={styles.middleline}>
                            <IconMaterialCommunityIcons
                              size={16}
                              name={'dots-vertical'}
                            />
                          </View>
                          <View style={styles.lastline}>
                            <Image
                              style={styles.locationIcon}
                              source={require('../../../assets/images/location.png')}
                            />
                            <Text style={styles.placeText}>
                              {item.destination}
                            </Text>
                            {/* <Text style={styles.placeText} >
                              Brainium information technology private limited
                            </Text>  */}
                          </View>
                        </View>
                      </View>
                    </View>
                  ) : null}
                </>
              );
            }}
          />
        ) : (
          <View>
            {console.log('errorMessage', errorMessage)}
            <Text>{errorMessage}</Text>
          </View>
        )}
      </View>
      <Modal
        propagateSwipe={true}
        style={{position: 'relative'}}
        visible={modalVisible && selectedItem !== undefined}
        onDismiss={() => setModalVisible(false)}>
          <ScrollView>

        
        <View style={{height:'100%', paddingTop:20,}}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}>
            <Image
              style={styles.closeViewIcon}
              source={require('../../../assets/images/cross_model.png')}
            />
          </TouchableOpacity>
          <View>
            <View style={{padding: 10}}>
              <Image
                style={{width: 120, height: 60, alignSelf: 'center'}}
                source={require('../../../assets/images/logo.png')}
                resizeMode="contain"
              />
              {console.log("===========MyItem==============",selectedItem)}
              <Text
                style={[
                  {
                    width: 100,
                    alignSelf: 'center',
                    textAlign: 'center',
                    fontSize: RFValue(14),
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: 5,
                    backgroundColor:
                      selectedItem?.book_status === 'Booked' ? 'green' : 'red',
                  },
                ]}>
                {selectedItem?.book_status}
              </Text>

              <Text style={{textAlign: 'center', marginTop: 5}}>
                <Text style={styles.fieldName}>Date: </Text>
                {selectedItem?.booking_date}
              </Text>
            </View>
            <Center>
              <Divider width="90%" />
            </Center>
          
        
            <View
              style={{
                height:'80%',
                padding: 20,
                bottom:20,
             
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Pick up</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {selectedItem?.starting_point}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Destination</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {selectedItem?.destination}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Distance</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {(selectedItem?.distance).toFixed(2) ?? '' } miles */}
                  {/* {selectedItem.distance.toFixed(2)} miles */}
                  {Number(Distance).toFixed(2)} miles
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Driver name</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {selectedItem?.driver?.name}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}> Last Due Payment</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {selectedItem?.bk_cost} USD */}
                  ${paydueamount.toFixed(2)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Booking cost</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  ${selectedItem?.bk_cost.toFixed(2)}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Stoppage time cost</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  ${selectedItem?.st_cost}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Waiting time cost</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  ${selectedItem?.wt_cost}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Total ride cost</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  ${selectedItem?.price}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Tips</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  ${selectedItem?.tips}
                </Text>
              </View>
              {selectedItem?.book_status !== 'Booked' && (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.fieldName}>Cancellation cost</Text>
                  <Text style={styles.colonDivider}>:</Text>
                  <Text style={styles.valueContainer}>
                    ${selectedItem?.canceled_cost}
                  </Text>
                </View>
              )}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Net Amount</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {selectedItem?.total_booking_cost} USD */}
                  
                  ${(Number(price) + Number(selectedItem?.tips)).toFixed(2)}
                </Text>
              </View>

             

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Actual Payment</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {selectedItem?.total_booking_cost} USD */}
                  ${(Number(price) + Number(selectedItem?.tips)).toFixed(2)}
                  {/* {actualAmount} USD */}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Due Amount</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {selectedItem?.total_booking_cost} USD */}
                  ${dueamount}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.fieldName}>Refunded Amount</Text>
                <Text style={styles.colonDivider}>:</Text>
                <Text style={styles.valueContainer}>
                  {/* {selectedItem?.total_booking_cost} USD */}
                  ${refundamount}
                </Text>
              </View>
            </View>
           
          </View>
        </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.buttonAnothercolor,
  },
  headerContainer: {
    width: calcW(0.9),
    height: calcH(0.05),
    flexDirection: 'row',
    marginVertical: calcH(0.03),
    justifyContent: 'flex-start',
  },
  bookingStatus: {
    flexDirection: 'row',
    width: calcW(0.25),
    backgroundColor: '#00cc66',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    //right: calcW(0.1),
    left: calcW(0.6),

    justifyContent: 'center',
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
    //right: calcW(0.1),
    left: calcW(0.6),
    justifyContent: 'center',
    alignItems: 'center',
    height: calcH(0.04),
    padding: '0.8%',
  },
  calenderIcon: {
    alignItems: 'center',
    // marginTop:calcW(0.02),
    width: calcW(0.056),
    height: calcW(0.066),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: 18,
    fontWeight: '500',
    color: colors.textHeader,
  },
  lowerContainer: {
    width: calcW(0.9),
    height: calcH(0.18),
    // backgroundColor:colors.primary,
  },
  listingContainer: {
    width: calcW(0.9),
    height: calcH(0.9),
    //  backgroundColor:colors.primary,
  },
  searchCalenderContainer: {
    height: calcH(0.1),
    flexDirection: 'row',
    // backgroundColor:colors.white,
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
  textInput: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
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
    // marginTop: calcH(0.01),
    left: calcW(0.01),
    flexDirection: 'row',
    height: calcH(0.06),
    alignItems: 'center',
  },
  dotContainer: {
    width: '6%',
    //left: calcW(0.4),
    height: calcH(0.04),
  },

  subText: {
    fontSize: 16,
    color: '#3B4045',
    marginVertical: 10,
    textAlign: 'center',
  },
  delIcon: {
    width: calcW(0.04),
    height: calcW(0.06),
  },
  boxContainer: {
    marginTop: calcH(0.02),
    width: calcW(0.9),
    flex: 1,
    // height: calcH(0.37),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  subboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.8),
    flex: 1,
    // height: calcH(0.28),
    left: calcW(0.05),
  },
  firstRow: {
    flexDirection: 'row',
    // backgroundColor: colors.primary,
    justifyContent: 'flex-start',
    height: calcH(0.065),
  },
  calender2Icon: {
    width: calcW(0.036),
    height: calcW(0.034),
  },
  dateText: {
    left: calcW(0.025),
    fontSize: 14,
    fontWeight: '400',
    color: '#333434',
  },
  timeIcon: {
    // marginBottom: calcH(0.2),
    left: calcW(0.04),
    width: calcW(0.036),
    height: calcW(0.034),
  },
  timeText: {
    left: calcW(0.048),
    fontSize: 14,
    fontWeight: '400',
    color: '#333434',
  },

  normalcontainer: {},
  normalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#121212',
  },
  drivercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  driverText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#121212',
  },
  lineStyle: {
    width: calcW(0.8),
    marginVertical: calcH(0.03),
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  directioncontainer: {
    // height: calcH(0.1),
    flex: 1
    // backgroundColor : colors.primary
  },
  firstline: {
    flexDirection: 'row',
    // height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
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
    // height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  middleline: {
    marginLeft: calcW(-0.008),
    height: calcH(0.03),
  },
  placeText: {
    //marginBottom: calcH(0.1),
    left: calcW(0.04),
    fontSize: 16,
    fontWeight: '400',
    color: '#22272E',
  },
  centeredView: {
    width: calcW(0.45),
    justifyContent: 'flex-end',
  },
  modalView: {
    width: calcW(0.45),
    height: calcH(0.25),
    margin: calcH(0.3),
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
    marginTop: calcH(0.02),
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
    alignItems: 'center',
  },
  rowIcon: {
    marginTop: calcH(0.01),
    left: calcW(0.01),
    width: calcW(0.04),
    height: calcW(0.05),
  },
  centeredModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  childmodalView: {
    // backgroundColor: colors.primary,
    width: calcW(0.8),
    height: calcH(0.35),
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

  headerchild: {
    marginBottom: calcH(0.02),
    justifyContent: 'center',
    height: calcH(0.09),
  },

  closeIcon: {
    left: calcW(0.6),
    width: calcW(0.08),
    height: calcW(0.08),
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
    height: calcH(0.05),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#a6a6a6',
    borderBottomWidth: 1,
    // backgroundColor: colors.buttonColor
  },
  closeViewIcon: {
    // position: 'absolute',
    top: 3,
    left: calcW(0.85),
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
  fieldName: {
    textAlign: 'left',
    fontSize: RFValue(14),
    color: '#000',
    fontWeight: 'bold',
    marginBottom: calcH(0.02),
    flex: 5,
  },
  colonDivider: {color: '#000', marginBottom: calcH(0.0175), flex: 1},
  valueContainer: {
    fontSize: RFValue(14),
    color: '#515354',
    fontWeight: '400',
    marginBottom: calcH(0.02),
    flex: 5,
  },
});
