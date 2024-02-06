import React, {useState} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';

import colors from '../../asserts/colors.js/colors';
import {allPadding, allRadius, calcH, calcW} from '../../utils/comon';
import Evilcons from 'react-native-vector-icons/dist/EvilIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Header from '../../Header/Header';
import Hud from '../../utils/hud';
import {BASE_URL} from '../../utils/Api/apiName';
import { log } from 'react-native-reanimated';

export default function RideHistory(props) {
  const [data, setData] = useState([]);

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
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        // console.log('1232222132132132132132132132 ', response.data.data);
        Hud.hideHud();
        AsyncStorage.setItem('rideCancel', JSON.stringify(response.data.data));

        setData(response.data.data);
      })
      .catch(err => {
        console.log('err', JSON.stringify(err.response.data.message));
        Hud.hideHud();
        Alert.alert(err.response.data.message);
      });
  };

  const deleteHistory = async value => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('42515464', token);
    Hud.showHud();
    const body = {
      id: value.id,
    };
    console.log('value', JSON.stringify(data));
    await axios({
      method: 'post',
      url: BASE_URL + 'delete-history-dr',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      data: body,
    })
      .then(response => {
        console.log('delete ', response.data);
        Hud.hideHud();
        // Alert.alert(response.data.message);
        if(response.data.success == "false"){
          if(response.data.message === "The record cannot be deleted. It's already verified, let's complete the ride."){
            Alert.alert('Sorry', `${response.data.message}`, [
              // {text: 'Cancel Ride'},
              {
                text: 'Complete Ride',
                onPress: () => props.navigation.navigate('afterVerify',{
                  waitingcharge: value.wt_cost,
                  waitingTime: 0,
                }),
                style: 'cancel',
              },
            ]);
          }else{
            Alert.alert('Sorry', `${response.data.message}`, [
              {text: 'Cancel Ride', onPress: () => props.navigation.navigate('cancelRide', {data : value})
            },
              {
                text: 'Complete Ride',
                onPress: () => props.navigation.navigate('acceptRide'),
                style: 'cancel',
              },
            ]);
          }
          
        }else{
          Alert.alert('', `${response.data.message}`)
        }
       
        bookingHistory();
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud();
        Alert.alert('Sorry', `${err}`, [
          {text: 'Cancel Ride'},
          {
            text: 'Complete Ride',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ]);
      });
  };

  const handleNavigation = async (item, index) => {
    console.log('dataIndex', index);
    console.log('(((((((((((((', data[index]);

    await AsyncStorage.setItem('rideDetails', JSON.stringify(data[index]));
    //await AsyncStorage.setItem('rideIndex', JSON.stringify(index));
    // const detailsHistory = data[index];
    props.navigation.navigate('tollScreenUpdate', item);
  };

  const ongoingRide = (value, index) => {
    if(value.booking_status === 'Ride Incompleted') props.navigation.navigate('acceptRide')
    if(value.booking_status === 'Otp Verified') props.navigation.navigate('afterVerify',{
      waitingcharge: value.wt_cost,
      waitingTime: 0,
    })
    if(value.booking_status === 'Ride Completed')  handleNavigation(value, index);
  }

  return (
    // <ScrollView>
    <SafeAreaView>
      <View style={styles.topContainer}>
        <Header navigation={props.navigation} />
        <View style={styles.headerContainer}>
          <Text style={styles.instruction}>Ride History</Text>
        </View>

        <View style={styles.listingContainer}>
         
            <FlatList
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}
            data={data?.filter(el => el?.book_status === 'Booked')}
            renderItem={({item, index}) => {
              return (
                <View style={styles.mainboxContainer}>
                  <View style={styles.mainsubboxContainer}>
                    {console.log('afasfas', item.id)}
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
                        // style={{right: calcW(0.02)}}
                      />
                      <Text
                        style={{
                          //width: '90%',
                          //left: calcW(0.03),
                          //height: calcH(0.06),
                          // right: calcW(0.02),
                          color: '#fff',
                        }}>
                        {item.booking_status === 'Ride Incompleted' || item.booking_status === 'Otp Verified' ? 'Ongoing' : 'Completed'}
                      </Text>
                      {/* <Text>{console.warn(item.book_status)}</Text> */}
                    </View>
                    <View style={styles.mainfirstRow}>
                      <View style={styles.mainotherContainer}>
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
                    </View>
                    <View style={styles.mainnormalcontainer}>
                      <Text style={styles.normalText}>R5248</Text>
                      {/* <Text>{console.warn('Index=====', index)}</Text> */}
                      <TouchableOpacity
                        style={styles.dotContainer}
                        onPress={() => {
                          // setModalVisible(true);
                          //navigation.navigate('tollScreenUpdate');
                          ongoingRide(item, index)
                          
                        }}>
                          {item.complete_status === 2 ? console.log("otp"): null}
                        <Image
                          style={styles.eyeIcon}
                          source={require('../../asserts/eye.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.maindrivercontainer}>
                      <Text style={styles.driverText}>{item.rider.name}</Text>

                      <TouchableOpacity
                        style={styles.rowContainer}
                        onPress={() =>  Alert.alert('', `Are you sure you want to delete this ride?`, [
                          {text: 'Ok', onPress: ()=> deleteHistory(item)},
                          {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel Pressed'),
                            style: 'cancel',
                          },
                        ])}>
                        <Image
                          style={styles.rowIcon}
                          source={require('../../asserts/delete.png')}
                        />
                        {/* <Text style={styles.modalTextdel}>Delete</Text> */}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
          />
         
          
        </View>
      </View>
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
    //top: calcH(0.002)
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
  mainboxContainer: {
    marginTop: calcH(0.02),
    width: calcW(0.9),
    // height: calcH(0.2),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  boxContainer: {
    //marginTop: calcH(0.01),
    width: calcW(0.7),
    height: calcH(0.18),
    backgroundColor: colors.white,
    justifyContent: 'center',
    top: calcW(-0.08),
  },
  mainsubboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.8),
    // height: calcH(0.18),
    left: calcW(0.05),
  },
  subboxContainer: {
    marginBottom: calcH(0.01),
    width: calcW(0.7),
    height: calcH(0.1),
    //left: calcW(0.0),
  },
  bookingStatus: {
    flexDirection: 'row',
    // width: calcW(0.25),
    flex: 2,
    
    backgroundColor: '#00cc66',
    borderColor: '#000',
    borderWidth: 0,
    borderTopStartRadius: 12,
    borderBottomStartRadius: 12,
    //right: calcW(0.1),
    left: calcW(0.6),
    // justifyContent: 'flex-end',
    // alignItems: 'center',
    // height: calcH(0.08),
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: calcH(0.04),
    padding: '0.8%',
  },
  priceText: {
    fontSize: RFValue(20),
    color: '#00cc66',
    fontWeight: '800',
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
    width: calcW(0.8),
    marginVertical: calcH(0.02),
    right: calcW(0.08),
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
    width: calcW(0.8),
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 0,
    // backgroundColor : colors.buttonColor
  },
  subfirstline: {
    flexDirection: 'row',
    height: calcH(0.03),
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

    height: calcH(0.03),
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor : colors.buttonColor
  },
  sublastline: {
    flexDirection: 'row',
    width: calcW(0.5),
    height: calcH(0.03),
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  middleline: {
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
});
