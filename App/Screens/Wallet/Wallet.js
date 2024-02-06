import React, {useState, useEffect} from 'react';

import {
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import {getApicall, postApiCall} from '../../Services/Network';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import {RadioButton} from 'react-native-paper';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {PaymentIcon} from 'react-native-payment-icons';
import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Wallet = props => {
  useEffect(() => {
    getMoney();
    getCard();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getMoney();
      getCard();
    });
    return unsubscribe;
  }, []);

  const [money, setMoney] = useState(0);
  const [currency, setCurrency] = useState('');
  const [checked, setChecked] = useState(null);
  const [sendCardValue, setSendCardValue] = useState('');
  const [cardData, setCardData] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getMoney = async () => {
    Hud.showHud();
    await getApicall('wallet', {}, {})
      .then(response => {
        // console.log('===wallet====>', response.data.data);
        if (response.status == 200) {
          Hud.hideHud();
          if (response.data.data.amount != null) {
            setMoney(response.data.data.amount);
            setCurrency(response.data.data.currency);
          }
        } else {
          Hud.hideHud();
          console.log(
            'error on loading celebrity in Home Page==>',
            response.data,
          );
        }
      })
      .catch(function (error) {
        console.log('error==>', error);

        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          Toast.show({
            type: 'error',
            text1: error.response.data.data.message,
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

  const getCard = async () => {
    //Hud.showHud();
    setLoading(true);
    await getApicall('usercardnolist', {}, {})
      .then(response => {
        setLoading(false);
        //Hud.hideHud();
        //console.log('response===>', response.data.data);
        if (response.status == 200) {
          setCardData(response.data.data);
        } else {
          console.log('error on loading celebrity in Home Page==>');
        }
      })
      .catch(function (error) {
        console.log('error==>', error);
        setLoading(false);
        //Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('====error.response===>', error.response.data);
          // Toast.show({
          //   type: 'error',
          //   text1: error.response.data.data.message,
          // });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Request Error==>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };
  const AddMoney = () => {
    props.navigation.navigate('Payment');
  };

  const cardSelect = (item, index) => {
    setChecked(index);
    console.log('item select==>', item);
    setSendCardValue(item);
  };

  const proceedFunction = () => {
    console.log('sendCardValue==>', sendCardValue);
    if (sendCardValue == '' || sendCardValue == null) {
      Toast.show({
        type: 'info',
        text1: 'Please Select a card',
      });
    } else {
      props.navigation.jumpTo('AddMoney', {
        cardData: sendCardValue,
      });
    }
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
        <HeaderwithTitle navProps={props.navigation} title={'Wallet'} />

        <KeyboardAvoidingScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff', width: '100%'}}>
          <View style={{alignItems: 'center', marginBottom: height * 0.15}}>
            <View
              style={{
                alignItems: 'flex-start',
                width: width * 0.85,
                marginTop: height * 0.03,
              }}>
              <Text
                style={{
                  color: '#8E7B85',
                  fontSize: RFValue(20),
                  fontWeight: '400',
                }}>
                Total Coin Balance
              </Text>
              <Text
                style={{
                  color: '#151143',
                  fontSize: RFValue(25),
                  fontWeight: '500',
                }}>
                {money}
              </Text>
            </View>

            <View
              style={{
                width: width * 0.85,
                height: 50,
                marginTop: height * 0.05,
                marginBottom: height * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => AddMoney()}
                style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E92D87',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#E92D87',
                    fontWeight: '600',
                  }}>
                  Add Coins
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{width: width * 0.85, alignItems: 'flex-start'}}>
              <Text
                style={{
                  color: '#151143',
                  fontWeight: '500',
                  fontSize: RFValue(25),
                  //fontFamily: 'Roboto-Medium',
                }}>
                Your Card
              </Text>
              {/* <View
                style={{
                  width: width * 0.85,
                  alignSelf: 'center',
                  height: height * 0.1,
                  marginVertical: height * 0.01,
                }}>
                <Image
                  source={require('../../Assets/Images/01.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View>

              <View
                style={{
                  width: width * 0.85,
                  alignSelf: 'center',
                  height: height * 0.1,
                  marginVertical: height * 0.01,
                }}>
                <Image
                  source={require('../../Assets/Images/2.png')}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                />
              </View> */}

              {isLoading ? (
                <View
                  style={{
                    width: '100%',
                    height: height * 0.2,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" color="#E92D87" />
                </View>
              ) : (
                <>
                  {cardData.length === 0 ? (
                    <View
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '10%',
                        alignSelf: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 22,
                          color: '#769292',
                          //fontFamily: 'Rubik',
                          fontWeight: 'normal',
                          letterSpacing: 0.9,
                        }}>
                        No Card is Stored
                      </Text>
                    </View>
                  ) : (
                    <>
                      {cardData.map((item, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              cardSelect(item, index);
                            }}
                            style={{
                              flexDirection: 'row',
                              width: '100%',
                              alignItems: 'center',
                              backgroundColor: '#EBE0E5',
                              padding: 10,
                              justifyContent: 'space-between',
                              borderRadius: 5,
                              marginVertical: height * 0.01,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                //backgroundColor: 'red',
                                width: '75%',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}>
                              <PaymentIcon
                                type={item?.brand.toLowerCase()}
                                //type="visa"
                                width={35}
                                height={30}
                              />

                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: RFValue(18),
                                  color: '#7C7C7C',
                                  letterSpacing: 0.5,
                                  marginLeft: 15,
                                }}>
                                xxxx xxxx xxxx {item.last_4}
                              </Text>
                            </View>

                            {/* <RadioButton
                              value={index}
                              status={
                                checked === index ? 'checked' : 'unchecked'
                              }
                              onPress={() => cardSelect(item, index)}
                              color="#E92D87"
                            /> */}
                            <CustomRadio
                              status={checked === index}
                              onPress={() => cardSelect(item, index)}
                              //style={{borderColor: '#B19DA7', borderWidth: 1}}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </>
                  )}
                </>
              )}
            </View>

            {cardData.length != 0 && (
              <View
                style={{
                  width: width * 0.85,
                  height: 50,
                  marginTop: height * 0.03,
                }}>
                <TouchableOpacity
                  onPress={() => proceedFunction()}
                  style={{
                    height: '100%',
                    width: '100%',
                    backgroundColor: '#E92D87',
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 19,
                      color: '#FFFFFF',
                      //fontFamily: 'Roboto-Bold',
                      fontWeight: '600',
                    }}>
                    Proceed
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({});
