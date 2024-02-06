import React, {useState} from 'react';
import {
  Text,
  View,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
//import {ScreenScrollComponent, HeaderComponent} from '../../commonItem';
import colors from '../../utils/colors';
import {allPadding, allRadius, calcH, calcW} from '../../utils/comon';
//import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import CheckBox from '@react-native-community/checkbox';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Evilcons from 'react-native-vector-icons/dist/EvilIcons';
import Hud from '../../utils/hud';

import images from '../../utils/imageAssets';
import {BASE_URL} from '../../utils/Api/apiName';
import {ScreenScrollComponent} from '../../commonItem';

export default function RideHistory({navigation}) {
  React.useEffect(() => {
    bookingHistory();
    const unsubscribe = navigation.addListener('focus', () => {
      bookingHistory();
    });
    return unsubscribe;
  }, [navigation]);

  const [modalVisible, setModalVisible] = useState(false);
  const [childmodalVisible, setchildModalVisible] = useState(false);
  const [actionTriggered, setActionTriggered] = useState('');
  const [data, setData] = useState([]);
  const [errorMessage, seterrorMessage] = useState('');
  const [showdata, setShowData] = useState(false);

  const bookingHistory = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('42515464', token);
    const userToken = token.data.data.token;
    Hud.showHud();
    await axios({
      method: 'get',
      url: BASE_URL + 'booking-history',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
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
      });
  };

  return (
    <SafeAreaView style={styles.topContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.arrowIcon} source={images.back_arrow} />
        </TouchableOpacity>
        <Text style={styles.instruction}>Ride History</Text>
      </View>

      <View style={styles.listingContainer}>
        {showdata !== true ? (
          <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={data.filter(
              el => el.driver !== null && el.book_status === 'Canceled',
            )}
            renderItem={({item, index}) => {
              return (
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
                          source={images.calender1}
                        />
                        <Text style={styles.dateText}>{item.booking_date}</Text>
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
                      <Text style={styles.driverText}>{item.driver.name}</Text>
                      {/* <TouchableOpacity
                        style={styles.dotContainer}
                        onPress={() => {
                          setModalVisible(true);
                        }}>
                        <IconMaterialCommunityIcons
                          size={30}
                          name={'dots-vertical'}
                        />
                      </TouchableOpacity> */}
                    </View>

                    <View style={styles.lineStyle} />
                    <View style={styles.directioncontainer}>
                      <View style={styles.firstline}>
                        <Image
                          style={styles.circleIcon}
                          source={images.circle}
                        />
                        <Text style={styles.placeText}>
                          {item.starting_point}
                        </Text>
                        {/* <Text style={styles.placeText} >
                            Brainiumi information technology Private limited
                            </Text> */}
                        {/*  */}
                      </View>
                      {/* <View style={styles.middleline}> */}
                        <IconMaterialCommunityIcons
                          size={16}
                          name={'dots-vertical'}
                          style={{marginLeft: calcW(-0.008)}}
                        />
                      {/* </View> */}
                      <View style={styles.lastline}>
                        <Image
                          style={styles.locationIcon}
                          source={images.location}
                        />
                        <Text style={styles.placeText}>{item.destination}</Text>
                        {/* <Text style={styles.placeText}>
                          Brainium Information Technology Private Limited
                        </Text> */}
                      </View>
                    </View>
                  </View>
                </View>
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
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.rowContainer}
              onPress={() => {
                setchildModalVisible(true);
                setActionTriggered('ACTION_1'); // HERE
              }}>
              <Image style={styles.eyeIcon} source={images.eye} />
              <Text style={styles.modalText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowContainer}
              onPress={() => {
                setchildModalVisible(true);
                setActionTriggered('ACTION_2'); // HERE
              }}>
              <Image style={styles.rowIcon} source={images.delete_png} />
              <Text style={styles.modalTextdel}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowContainer}
              onPress={() => {
                setchildModalVisible(true);
                setActionTriggered('ACTION_3'); // HERE
              }}>
              <Image style={styles.downloadIcon} source={images.download} />
              <Text style={styles.modalText}>Download</Text>
            </TouchableOpacity>
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
                  {/* <TouchableOpacity  onPress={() =>{
                            setchildModalVisible(!childmodalVisible)
                          }}>
                                    <Image style={styles.closeViewIcon} source={require('../../asserts/cross_model.png')} />
                              </TouchableOpacity>    */}
                  <View>
                    <Text
                      style={{
                        fontSize: RFValue(25),
                        fontWeight: 'bold',
                        color: '#000',
                      }}>
                      Invoice
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', color: '#000'}}>
                        Order#:{' '}
                      </Text>
                      <Text>12005688</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{fontWeight: 'bold', color: '#000'}}>
                        Date:{' '}
                      </Text>
                      <Text>27-04-2022</Text>
                    </View>
                  </View>
                  <Image style={styles.logoIcon} source={images.logo} />
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Pick up point</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>Shyambazar,WB,India</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Destination point</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>Shyambazar,WB,India</Text>
                </View>

                {/* <View style={{height: calcH(0.02)}} /> */}

                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Rider Name</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>Jhone Doe</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Contact No.</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>1234567890</Text>
                </View>

                {/* <View style={{height: calcH(0.02)}} /> */}

                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Vehicle No.</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>AB06CD1234</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Driver Name</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>Smith Harry</Text>
                </View>

                {/* <View style={{height: calcH(0.02)}} /> */}
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Ride cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>$120.00</Text>
                </View>
                {/* <View style={styles.lineStyle}/>  */}
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftText}>Waiting Time cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightText}>$20.00</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Stoppage time cost</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>$5.00</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Tips</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>$0.00</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>Total Amount</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>$150.00</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>
                      Add-Cancellation charges
                    </Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>$20.00</Text>
                </View>
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftcostText}>less discount</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightcostText}>20%</Text>
                </View>
                {/* <View style={styles.lineStyle}/> */}
                <View style={styles.rideDetails}>
                  <View style={styles.subleftContainer}>
                    <Text style={styles.leftfinalText}>Net Amount</Text>
                    <Text style={styles.colontext}>:</Text>
                  </View>
                  <Text style={styles.rightfinalText}>$150.00</Text>
                </View>
                <Text style={styles.footerRiderText}>Thank you</Text>
                {/* <Text style={styles.modalSubText}>for Your Ride</Text>  */}
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
                      source={images.cross_model}
                    />
                  </TouchableOpacity>
                  <Image style={styles.dpIcon} source={images.download} />
                </View>
                <Text style={styles.modalHeaderText}>Thank you</Text>
                <Text style={styles.modalSubText}>for Download</Text>
              </View>
            </View>
          ) : null}
        </Modal>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.buttonAnothercolor,

    // flex: 1,
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
    width: calcW(0.22),
    backgroundColor: '#00cc66',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    //right: calcW(0.1),
    left: calcW(0.65),
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: calcH(0.04),
    padding: '0.8%',
  },
  bookingStatusC: {
    flexDirection: 'row',
    width: calcW(0.28),
    backgroundColor: 'red',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    //right: calcW(0.1),
    left: calcW(0.51),
    justifyContent: 'flex-end',
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
    // width: calcW(0.9),
    // height: calcH(0.9),
    paddingHorizontal: calcW(0.04),
    // marginVertical: calcH(-0.025),
    width: calcW(0.95),
    height: calcH(0.76),
    marginBottom: calcH(0.01),
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
    marginTop: calcH(0.015),
    left: calcW(0.02),
    flexDirection: 'row',
    height: calcH(0.06),
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
    flex: 1,
    paddingTop: 15,
    padding: 5,
    width: calcW(0.9),
    // height: calcH(0.33),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  subboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.8),
    padding: 5,
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
    flex: 1,
    
    // backgroundColor : colors.primary
  },
  firstline: {
    flexDirection: 'row',
    // height: calcH(0.03),
   paddingEnd: 22,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: colors.buttonColor,
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
    paddingRight: 25,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: colors.buttonColor,
  },
  middleline: {
    justifyContent: 'center',
    flex: 0.7,
    width: calcW(0.2),
    // padding: 2,
    borderColor: '#000',
    borderWidth: 1
  },
  placeText: {
    //marginBottom: calcH(0.1),
    left: calcW(0.04),
    fontSize: 16,
    fontWeight: '400',
    color: '#22272E',
  },
  centeredView: {
    // width:calcW(0.45),
    // justifyContent: "flex-end",
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
    right: calcW(0.1),
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
});
