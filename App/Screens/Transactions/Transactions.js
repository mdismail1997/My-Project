import React, {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Toast from 'react-native-toast-message';
import RadioForm from 'react-native-simple-radio-button';
import {getApicall, postApiCall} from '../../Services/Network';
import Tooltip from 'react-native-walkthrough-tooltip';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import {ProfileContext} from '../../Services/ProfileProvider';
import {image_url} from '../../Services/constants';

import Hud from '../Common/Hud';

const {width, height} = Dimensions.get('window');

const Transactions = props => {
  useEffect(() => {
    handleTransaction();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      handleTransaction();
    });
    return unsubscribe;
  }, []);

  const {profileContextData} = useContext(ProfileContext);
  const [showTooltip, setShowTooltip] = useState(false);

  const [value, setValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterName, setFilterName] = useState('All');

  const [data, setData] = useState([]);
  var choice = [
    {label: 'All', value: 0},
    {label: 'Successful', value: 1},
    {label: 'Failed', value: 2},
    {label: 'Pending', value: 3},
  ];

  const userHandler = val => {
    //console.log('radio value==>', val);
    setValue(val);
    setShowTooltip(false);
    if (val == 0) {
      setFilterStatus('');
      setFilterName('All');
    } else if (val == 1) {
      setFilterStatus('Success');
      setFilterName('Successful');
    } else if (val == 2) {
      setFilterStatus('0');
      setFilterName('Failed');
    } else if (val == 3) {
      setFilterStatus('2');
      setFilterName('Pending');
    }
  };

  const handleTransaction = async () => {
    setValue(0), setFilterStatus('');

    if (profileContextData.user_type === 1) {
      userTransaction();
    } else if (profileContextData.user_type === 2) {
      celebrityTransaction();
    }
  };

  const userTransaction = async () => {
    console.log('Api for User Transaction');
    Hud.showHud();
    await getApicall('usertransactionlist', {}, {})
      .then(response => {
        console.log('Response in User Transaction', response.data.data[0]);
        if (response.status == 200) {
          Hud.hideHud();

          setData(response.data.data);
        } else {
          Hud.hideHud();
          console.log('error on loading Transaction Data==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);

        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('===error request===>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const celebrityTransaction = async () => {
    console.log('Api for celebrity Transaction');
    Hud.showHud();
    await getApicall('celebritytransactionlist', {}, {})
      .then(response => {
        console.log('Response in celebrity Transaction', response.data.data[0]);
        if (response.status == 200) {
          Hud.hideHud();
          setData(response.data.data);
        } else {
          Hud.hideHud();
          console.log('error on loading Transaction Data==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);

        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          Toast.show({
            type: 'error',
            text1: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  const statusValue = number => {
    if (number == null) {
      return '2';
    } else return number;
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
        <HeaderwithTitle navProps={props.navigation} title={'Transactions'} />

        <View
          style={{
            width: width * 0.85,
            marginTop: height * 0.01,
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: 50,
            //backgroundColor: 'red',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#151143',
              fontSize: 20,
              //fontFamily: 'Roboto-Medium',
              fontWeight: '500',
            }}>
            {/* {filterName} */}
            All
          </Text>
          {/* <TouchableOpacity
            onPress={() => setShowTooltip(true)}
            style={{
              backgroundColor: '#EBE0E5',
              height: 45,
              width: 70,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 7,
            }}>
            <Tooltip
              isVisible={showTooltip}
              placement="bottom"
              arrowSize={{width: 16, height: 13}}
              onClose={() => setShowTooltip(false)}
              content={
                <View style={{marginVertical: height * 0.03}}>
                  <RadioForm
                    radio_props={choice}
                    initial={value}
                    onPress={val => userHandler(val)}
                    buttonSize={12}
                    buttonOuterSize={20}
                    buttonColor={'#EBE0E5'}
                    selectedButtonColor={'#E92D87'}
                    //buttonInnerColor={'#EBE0E5'}
                    labelHorizontal={true}
                    labelStyle={{
                      fontSize: RFValue(20),
                      marginRight: 20,
                      color: '#151143',
                    }}
                    disabled={false}
                    formHorizontal={false}
                  />
                </View>
              }>
              <Text
                style={{
                  color: '#7B7B7B',
                  fontSize: 16,
                  //fontFamily: 'Roboto-Regular',
                  fontWeight: '400',
                }}>
                Filter
              </Text>
            </Tooltip>
          </TouchableOpacity> */}
        </View>
        {data.length == 0 ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '30%',
            }}>
            <Text
              style={{
                fontSize: 22,
                color: '#769292',
                //fontFamily: 'Rubik',
                fontWeight: 'normal',
                letterSpacing: 0.9,
              }}>
              No Transaction
            </Text>
          </View>
        ) : (
          <KeyboardAvoidingScrollView
            bounces={false}
            showsVerticalScrollIndicator={false}
            style={{backgroundColor: '#ffffff', width: width * 0.9}}>
            <View style={{marginBottom: height * 0.13}}>
              {data
                .filter(function (item, index) {
                  return statusValue(item.Status).includes(filterStatus);
                })
                .map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        flexDirection: 'row',
                        //margin: 5,
                        marginTop: height * 0.03,
                        width: width * 0.9,
                        //height: 85,
                        borderBottomColor: '#566690',
                        borderBottomWidth: 1,
                        justifyContent: 'space-between',
                        paddingBottom: 15,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 100,
                            alignItems: 'center',
                          }}>
                          <Image
                            //source={require('../../Assets/Images/angelina.png')}
                            //source={{uri: item.profile_image}}
                            source={{uri: image_url + item.profile_image}}
                            style={{
                              height: '100%',
                              width: '100%',
                              borderRadius: 100,
                            }}
                            resizeMode="cover"
                          />
                        </View>
                        <View
                          style={{
                            marginLeft: width * 0.01,
                            marginTop: height * 0.011,
                            alignItems: 'flex-start',
                          }}>
                          <Text
                            style={{
                              fontSize: RFValue(18),
                              color: '#151143',
                              //fontFamily: 'Roboto-Regular',
                              fontWeight: '400',
                              //fontWeight: 'bold',
                              //letterSpacing: 0.4,
                            }}>
                            {item.username}
                          </Text>

                          {/* <Text
                            style={{
                              fontSize: RFValue(14),
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              //letterSpacing: 0.4,
                            }}>
                            {item.trans_id}
                          </Text> */}

                          <Text
                            style={{
                              fontSize: RFValue(14),
                              color: '#7B7B7B',
                              //fontFamily: 'Roboto-Light',
                              fontWeight: '300',
                              //letterSpacing: 0.4,
                            }}>
                            Date : {item.transaction_date}
                          </Text>
                        </View>
                      </View>

                      <View style={{alignItems: 'flex-end'}}>
                        <Text
                          style={{
                            fontSize: RFValue(16),
                            //fontFamily: 'Roboto-Medium',
                            color: '#151143',
                            fontWeight: '600',
                          }}>
                          {item.send_amount}
                        </Text>

                        <Text
                          style={{
                            ...styles.textStyle,
                            color: '#26AC10',
                          }}>
                          Successful
                        </Text>
                        {/* {item.Status == 'Success' ? (
                          <Text style={{...styles.textStyle, color: '#26AC10'}}>
                            Successful
                          </Text>
                        ) : null}

                        {item.Status == '0' ? (
                          <Text style={{...styles.textStyle, color: '#F81C29'}}>
                            Failed
                          </Text>
                        ) : null}

                        {item.Status == null && (
                          <Text style={{...styles.textStyle, color: '#DDB011'}}>
                            Pending
                          </Text>
                        )} */}
                      </View>
                    </View>
                  );
                })}
            </View>
          </KeyboardAvoidingScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Transactions;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: RFValue(16),
    //fontFamily: 'Roboto-Medium',
    //color: '#DDB011',
    fontWeight: '600',
  },
});
