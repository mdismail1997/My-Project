import React, {useState} from 'react';
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
} from 'react-native';
//import {ScreenScrollComponent, HeaderComponent} from '../../utils/comon';
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
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Hud from '../../utils/hud';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import {RFValue} from 'react-native-responsive-fontsize';

export default function PaymentDetails(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [childmodalVisible, setchildModalVisible] = useState(false);
  const [actionTriggered, setActionTriggered] = useState('');
  const [data, setData] = useState([]);
  const [riderId, setRiderId] = useState('');
  const [details, setDetails] = useState('');

  React.useEffect(() => {
    bookingHistory();
    const unsubscribe = props.navigation.addListener('focus', () => {
      bookingHistory();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bookingHistory = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('42515464', token);
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'booking-history',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        console.log(
          '1232222132132132132132132132 ',
          JSON.stringify(response.data.data),
        );
        Hud.hideHud();
        setData(response.data.data);
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud();
        Alert.alert(err);
      });
  };
  const viewRideDetails = value => {
    console.log('value', value);
    setRiderId(value);
    setModalVisible(true);
  };
  const invoiceGenerate = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('42515464', token);
    Hud.showHud();
    await axios({
      method: 'GET',
      url: BASE_URL + `invoice?booking_id=${riderId}`,
      headers: {
        // Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(function (response) {
        console.log('driver details:::::::::::::::::', response.data);
        console.log(
          'driver details:::::::::::::::::',
          response.data.booking_details.waiting_time_charge,
        );
        Hud.hideHud();
        setchildModalVisible(true);
        setActionTriggered('ACTION_1');

        setDetails(response.data.booking_details);
      })
      .catch(function (error) {
        console.log(error);
        Hud.hideHud();
      });
  };

  return (
    // <ScrollView>
    <SafeAreaView>
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Image
              style={styles.arrowIcon}
              source={require('../../asserts/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.instruction}>Payment Details</Text>
        </View>
        {/*  */}

        <View style={styles.listingContainer}>
          <FlatList
            style={{flex: 1}}
            data={data}
            renderItem={({item, index}) => {
              return (
                <View style={styles.boxContainer}>
                  <View style={styles.subboxContainer}>
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
                          source={require('../../asserts/calender1.png')}
                        />
                        <Text style={styles.dateText}>{item.booking_date}</Text>
                        <Image
                          style={styles.timeIcon}
                          source={require('../../asserts/clock.png')}
                        />
                        <Text style={styles.timeText}>{item.booking_time}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.dotContainer}
                        onPress={() => {
                          viewRideDetails(item.id);
                        }}>
                        <IconMaterialCommunityIcons
                          size={30}
                          name={'dots-vertical'}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.normalcontainer}>
                      <Text style={styles.normalText}>5248</Text>
                    </View>
                    <View style={styles.drivercontainer}>
                      <Text style={styles.driverText}>{item.rider.name}</Text>
                    </View>
                    {/* <View style={styles.lineStyle} />
              <View style={styles.directioncontainer}>
                <View style={styles.firstline}>
                  <Image
                    style={styles.circleIcon}
                    source={require('../../asserts/circle.png')}
                  />
                  <Text style={styles.placeText}>6th Avaniue</Text>
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
                    source={require('../../asserts/location.png')}
                  />
                  <Text style={styles.placeText}>Stewart street</Text>
                </View>
              </View> */}
                  </View>
                </View>
              );
            }}></FlatList>
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                <Image
                  style={{
                    left: calcW(0.25),
                    width: calcW(0.05),
                    height: calcW(0.05),
                    marginTop: calcH(-0.025),
                    tintColor: '#000',
                  }}
                  source={require('../../asserts/cross_model.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowContainer}
                onPress={() => {
                  invoiceGenerate(); // HERE
                }}>
                <Image
                  style={styles.eyeIcon}
                  source={require('../../asserts/eye.png')}
                />
                <Text style={styles.modalText}>View</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rowContainer}
                onPress={() => {
                  setchildModalVisible(true);
                  setActionTriggered('ACTION_2'); // HERE
                }}>
                <Image
                  style={styles.rowIcon}
                  source={require('../../asserts/delete.png')}
                />
                <Text style={styles.modalTextdel}>Delete</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.rowContainer}
                onPress={() => {
                  setchildModalVisible(true);
                  setActionTriggered('ACTION_3'); // HERE
                }}>
                <Image
                  style={styles.downloadIcon}
                  source={require('../../asserts/download.png')}
                />
                <Text style={styles.modalText}>Download</Text>
              </TouchableOpacity> */}
            </View>
          </View>
          <Modal
            animationType="none"
            transparent={true}
            visible={childmodalVisible}
            onRequestClose={() => {
              setchildModalVisible(!childmodalVisible);
            }}>
            {actionTriggered === 'ACTION_1' ? (
              <View style={styles.centeredModalView}>
                <View style={styles.childRideView}>
                  <View style={styles.headerRiderchild}>
                    <TouchableOpacity
                      onPress={() => {
                        setchildModalVisible(!childmodalVisible);
                      }}>
                      <Image
                        style={styles.closeViewIcon}
                        source={require('../../asserts/cross_model.png')}
                      />
                    </TouchableOpacity>
                    <Image
                      style={styles.logoIcon}
                      source={require('../../asserts/logo.png')}
                    />
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftText}>Date</Text>
                    <Text style={styles.rightText}>Ride ID</Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftAnsText}>
                      {details.date_of_departure}
                    </Text>
                    <Text style={styles.rightAnsText}>
                      {details.booking_id}
                    </Text>
                  </View>

                  <View style={{height: calcH(0.02)}} />

                  <View style={styles.rideDetails}>
                    <Text style={styles.leftText}>Rider Name</Text>
                    {/* <Text style={styles.rightText}>Referal Name</Text> */}
                  </View>
                  <View style={styles.rideDetails}>
                    {console.log('details rider', details.rider)}
                    {details.rider != undefined ? (
                      <Text style={styles.leftAnsText}>
                        {details.rider.name}
                      </Text>
                    ) : null}

                    {/* <Text style={styles.rightAnsText}>John Doe</Text> */}
                  </View>

                  <View style={{height: calcH(0.02)}} />

                  {/* <View style={styles.rideDetails}>
                  <Text style={styles.leftText}>Pick up location</Text>
                  <Text style={styles.rightText}>Destination</Text>
                </View>
                <View style={styles.rideDetails}>
                  <Text style={styles.leftAnsText}>6th Avaniue</Text>
                  <Text style={styles.rightAnsText}>Stewart street</Text>
                </View> */}
                  <View style={styles.lineStyle} />
                  <View style={styles.directioncontainer}>
                    <View style={styles.firstline}>
                      <Image
                        style={styles.circleIcon}
                        source={require('../../asserts/circle.png')}
                      />
                      <Text style={styles.placeText}>
                        {details.starting_point}
                      </Text>
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
                        source={require('../../asserts/location.png')}
                      />
                      <Text style={styles.placeText}>
                        {details.destination}
                      </Text>
                    </View>
                  </View>

                  <View style={{height: calcH(0.02)}} />
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftAnsText}>Total Ride value</Text>
                    <Text style={styles.rightAnsText}>
                      ${details.price ?? 0}
                    </Text>
                  </View>
                  <View style={styles.lineStyle} />
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftcostText}>Ride cost</Text>
                    <Text style={styles.rightcostText}>
                      ${details.price ?? 0}
                    </Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftcostText}>Wating time cost</Text>
                    <Text style={styles.rightcostText}>
                      ${details.waiting_time_charge ?? 0}
                    </Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftcostText}>Stopage time cost</Text>
                    <Text style={styles.rightcostText}>
                      ${details.stoppage_time_charge ?? 0}
                    </Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftcostText}>Tips</Text>
                    <Text style={styles.rightcostText}>
                      ${details.tips ?? 0}
                    </Text>
                  </View>
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftcostText}>Total Ride value</Text>
                    <Text style={styles.rightcostText}>${details.price}</Text>
                  </View>
                  {/* <View style={styles.rideDetails}>
                  <Text style={styles.leftcostText}>
                    (-) coupon / adjusment
                  </Text>
                  <Text style={styles.rightcostText}>$15.00</Text>
                </View> */}
                  <View style={styles.lineStyle} />
                  <View style={styles.rideDetails}>
                    <Text style={styles.leftfinalText}>Total Ride value</Text>
                    <Text style={styles.rightfinalText}>$105.00</Text>
                  </View>
                  {/* <Text style={styles.footerRiderText}>Thank you</Text>
                <Text style={styles.modalSubText}>for Your Ride</Text> */}
                </View>
              </View>
            ) : actionTriggered === 'ACTION_2' ? (
              <View style={styles.centeredModalView}>
                <View style={styles.childDelModelView}>
                  <View style={styles.headerDelchild}>
                    <Text style={styles.modalDeleteText}>Delete</Text>
                    <Text style={styles.questionText}>
                      Are you sure want to delete
                    </Text>
                  </View>
                  <View style={styles.footerDelchild}>
                    <Text style={styles.NoDeleteText}>No</Text>
                    <TouchableOpacity
                      onPress={() => {
                        setchildModalVisible(!childmodalVisible);
                      }}>
                      <Text style={styles.YesDeleteText}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : actionTriggered === 'ACTION_3' ? (
              <View style={styles.centeredModalView}>
                <View style={styles.childmodalView}>
                  <View style={styles.headerchild}>
                    <TouchableOpacity
                      onPress={() => {
                        setchildModalVisible(!childmodalVisible);
                      }}>
                      <Image
                        style={styles.closeIcon}
                        source={require('../../asserts/cross_model.png')}
                      />
                    </TouchableOpacity>
                    <Image
                      style={styles.dpIcon}
                      source={require('../../asserts/download.png')}
                    />
                  </View>
                  <Text style={styles.modalHeaderText}>Thank you</Text>
                  <Text style={styles.modalSubText}>for Download</Text>
                </View>
              </View>
            ) : null}
          </Modal>
        </Modal>
      </View>
    </SafeAreaView>
    // </ScrollView>
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
  calenderIcon: {
    alignItems: 'center',
    // marginTop:calcW(0.02),
    width: calcW(0.056),
    height: calcW(0.066),
  },
  instruction: {
    left: calcW(0.035),
    fontSize: RFValue(18),
    fontWeight: '700',
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

  otherContainer: {
    width: '85%',
    marginTop: calcH(0.015),
    left: calcW(0.02),
    flexDirection: 'row',
    height: calcH(0.06),
  },
  dotContainer: {
    width: '6%',
    left: calcW(0.04),
    height: calcH(0.06),
  },

  subText: {
    fontSize: RFValue(16),
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
    height: calcH(0.22),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  subboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.8),
    height: calcH(0.18),
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
    fontSize: RFValue(14),
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
    fontSize: RFValue(14),
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
    top: calcH(0.02),
    flexDirection: 'row',
  },
  driverText: {
    fontSize: RFValue(18),
    fontWeight: '500',
    color: '#121212',
  },
  lineStyle: {
    width: calcW(0.8),
    marginVertical: calcH(0.01),
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  directioncontainer: {
    height: calcH(0.1),
    // backgroundColor : colors.primary
  },
  firstline: {
    flexDirection: 'row',
    height: calcH(0.03),
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
    height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  middleline: {
    height: calcH(0.03),
  },
  placeText: {
    //marginBottom: calcH(0.1),
    left: calcW(0.04),
    fontSize: RFValue(16),
    fontWeight: '400',
    color: '#22272E',
  },
  centeredView: {
    // width:calcW(0.45),
    // justifyContent: "flex-end",
  },
  modalView: {
    width: calcW(0.45),
    height: calcH(0.2),
    marginTop: calcH(0.2),
    marginLeft: calcW(0.5),
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
    height: calcH(0.85),
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
    justifyContent: 'center',
    height: calcH(0.1),
    marginBottom: calcH(0.03),
    // backgroundColor: colors.primary
  },
  logoIcon: {
    left: calcW(0.24),
    height: calcW(0.1),
    width: calcW(0.3),
    resizeMode: 'contain',
  },
  rideDetails: {
    height: calcH(0.035),
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: colors.buttonColor
  },
  closeViewIcon: {
    left: calcW(0.7),
    width: calcW(0.08),
    height: calcW(0.08),
  },
  leftText: {
    textAlign: 'left',
    fontSize: 14,
    color: '#515354',
    fontWeight: '500',
  },
  rightText: {
    textAlign: 'right',
    fontSize: 14,
    color: '#515354',
    fontWeight: '500',
  },
  leftAnsText: {
    textAlign: 'left',
    fontSize: RFValue(16),
    color: '#3B4045',
    fontWeight: '700',
  },
  rightAnsText: {
    textAlign: 'right',
    fontSize: RFValue(16),
    color: '#3B4045',
    fontWeight: '700',
  },
  leftcostText: {
    textAlign: 'left',
    fontSize: RFValue(16),
    color: '#515354',
    fontWeight: '500',
  },
  rightcostText: {
    textAlign: 'right',
    fontSize: RFValue(16),
    color: '#3B4045',
    fontWeight: '500',
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
});
