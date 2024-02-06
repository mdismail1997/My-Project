import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {getApicall, postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
// import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import HeaderLastImage from '../Common/HeaderLastImage';
import {RadioButton} from 'react-native-paper';
import CustomRadio from '../Common/CustomRadio';

const {width, height} = Dimensions.get('window');

const Balance = props => {
  const [money, setMoney] = useState(0);
  const [bankAccount, setBankAccount] = useState([]);
  const [checked, setChecked] = useState(null);
  const [accountData, setAccountData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [shownAmount, setShownAmount] = useState(false);

  useEffect(() => {
    getMoney();
    getAccount();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getMoney();
      getAccount();
    });
    return unsubscribe;
  }, []);

  const getMoney = async () => {
    Hud.showHud();
    await getApicall('wallet', {}, {})
      .then(response => {
        if (response.status == 200) {
          console.log('Walletresponse===>', response.data.data);
          Hud.hideHud();
          if (response.data.data.amount != null) {
            setMoney(response.data.data.amount);
          }
        } else {
          Hud.hideHud();
          console.log('error on loading celebrity in Home Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
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

  const getAccount = async () => {
    Hud.showHud();
    await getApicall('getbankaccounts', {}, {})
      .then(response => {
        if (response.status == 200) {
          console.log('Accountresponse===>', response.data.data);
          Hud.hideHud();
          setBankAccount(response.data.data);
        } else {
          Hud.hideHud();
          console.log('error on loading celebrity in Home Page==>');
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log('error==>', error.response.data);
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
  const Withdraw = () => {
    if (accountData == '') {
      Toast.show({
        type: 'error',
        text1: 'Please Select one account',
      });
    } else {
      setAmount('');
      setShownAmount(false);
      setShowModal(true);
    }
  };

  const handleAmount = value => {
    setAmount(value);

    if (value.trim() == '') {
      setShownAmount(false);
    } else {
      setShownAmount(true);
    }
  };

  const WithdrawFunc = async () => {
    setShowModal(false);
    if (amount.trim() === '') {
      Toast.show({
        type: 'error',
        text1: 'Please Enter valid Amount',
      });
    } else if (money < amount) {
      Toast.show({
        type: 'error',
        text1: 'Withdrawl amount exceed Balance amount',
      });
      setShownAmount(false);
    } else {
      setShownAmount(false);
      const sendData = {
        bank_id: accountData.id,
        amount: amount,
      };
      Hud.showHud();
      console.log('===sendData===>', sendData);
      await postApiCall('paymentwithdrawl', sendData, {})
        .then(response => {
          Hud.hideHud();
          // console.log('Withdrawl response===>', response.data);
          if (response.status == 200) {
            console.log('Withdrawl response 200===>', response.data);
            Toast.show({
              type: 'success',
              text1: 'Please Wait',
              text2: response.data.message,
            });
            setAmount('');
            setShownAmount(false);
          }
        })
        .catch(function (error) {
          Hud.hideHud();
          if (error.response) {
            // Request made and server responded
            console.log('error==>', error.response.data);
            if (
              error.response.data.message ==
              'Your previous withdrawl request is under process'
            ) {
              Toast.show({
                type: 'info',
                text1: 'Please Wait',
                text2: error.response.data.message,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: error.response.data.message,
              });
            }

            //Alert.alert(error.response.data.message);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('Request Error==>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
  };

  const hideAcc = number => {
    //return number;
    return number.replace(/^(\d{0})\d(?=\d{0})|\d(?=\d{2})/gm, 'x');
  };
  const cardSelect = (item, index) => {
    setChecked(index);
    console.log('item select==>', item);
    setAccountData(item);
  };
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <HeaderLastImage navProps={props.navigation} title={'Balance'} />

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

        <TouchableOpacity
          onPress={() => props.navigation.navigate('AddAccount')}
          style={{
            width: width * 0.85,
            height: 50,
            marginTop: height * 0.03,
            marginBottom: height * 0.03,
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
            Add Account
          </Text>
        </TouchableOpacity>

        <View
          style={{
            alignItems: 'flex-start',
            width: width * 0.85,
            // marginTop: height * 0.01,
          }}>
          <Text
            style={{
              color: '#000',
              fontSize: RFValue(20),
              //fontFamily: 'Roboto-Medium',
              fontWeight: '400',
            }}>
            Your Account
          </Text>
        </View>
        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{
            backgroundColor: '#ffffff',
            width: width * 0.9,
            alignSelf: 'center',
          }}>
          <View
            style={{
              marginBottom: height * 0.14,
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            {bankAccount.length === 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginVertical: '10%',
                }}>
                <Text
                  style={{
                    fontSize: 22,
                    color: '#769292',
                    //fontFamily: 'Rubik',
                    fontWeight: 'normal',
                    letterSpacing: 0.9,
                  }}>
                  No Account
                </Text>
              </View>
            ) : (
              <>
                {bankAccount.map((item, index) => {
                  return (
                    <TouchableOpacity
                      onPress={() => cardSelect(item, index)}
                      key={index}
                      style={{
                        backgroundColor: '#EBE0E5',
                        width: width * 0.85,
                        height: height * 0.11,
                        borderRadius: 10,
                        marginTop: height * 0.01,
                        padding: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: '#8E7B85',
                              fontSize: 18,
                              //fontFamily: 'Roboto-Regular',
                              fontWeight: '400',
                            }}>
                            Name :
                          </Text>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 18,
                              //fontFamily: 'Roboto-Medium',
                              fontWeight: '500',
                            }}>
                            {item.holder_name}
                          </Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={{
                              color: '#8E7B85',
                              fontSize: 18,
                              //fontFamily: 'Roboto-Regular',
                              fontWeight: '400',
                            }}>
                            Account No :{' '}
                          </Text>
                          <Text
                            style={{
                              color: '#000',
                              fontSize: 16,
                              //fontFamily: 'Roboto-Medium',
                              fontWeight: '500',
                              alignSelf: 'center',
                            }}>
                            {hideAcc(JSON.stringify(item.account_no))}
                          </Text>
                        </View>
                      </View>

                      {/* <RadioButton
                        value={index}
                        status={checked === index ? 'checked' : 'unchecked'}
                        onPress={() => cardSelect(item, index)}
                        color="#E92D87"
                      /> */}
                      <CustomRadio
                        status={checked === index}
                        onPress={() => cardSelect(item, index)}
                        //style={{alignSelf: 'center'}}
                      />
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
            <View
              style={{
                width: width * 0.85,
                height: 50,
                marginTop: height * 0.05,
              }}>
              <TouchableOpacity
                onPress={() => Withdraw()}
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
                    //fontFamily: 'Roboto-Medium',
                    fontWeight: '600',
                  }}>
                  Withdraw
                </Text>
              </TouchableOpacity>
            </View>
            <Modal
              visible={showModal}
              transparent={true}
              //animationType={'slide'}
              //presentationStyle="formSheet"
            >
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    //height: 80,
                    width: width * 0.9,
                    alignSelf: 'center',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 7,
                    padding: 15,
                    // marginTop: height * 0.1,
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: '#151143',
                        fontSize: RFValue(18),
                        fontWeight: '500',
                        //fontFamily: 'Roboto-Medium',
                      }}>
                      Withdrawl Amount
                    </Text>
                    <TouchableOpacity
                      style={{width: 25, height: 25}}
                      onPress={() => {
                        setShowModal(false);
                      }}>
                      <Image
                        source={require('../../Assets/Icon/close.png')}
                        style={{
                          height: '100%',
                          width: '100%',
                          tintColor: '#A6A6A6',
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      width: '100%',
                      alignSelf: 'center',
                      marginVertical: height * 0.02,
                    }}>
                    <TextInput
                      value={amount}
                      onChangeText={value => handleAmount(value)}
                      placeholder="Enter Amount"
                      style={
                        shownAmount
                          ? {...styles.selectedInput, color: '#151143'}
                          : styles.input
                      }
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
                      keyboardType="numeric"
                    />
                    <TouchableOpacity
                      onPress={() => WithdrawFunc()}
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#E92D87',
                        borderRadius: 7,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../Assets/Icon/tick.png')}
                        style={{height: '50%', width: '65%'}}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Balance;

const styles = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    backgroundColor: '#EBE0E5',
    color: '#000',
  },
  selectedInput: {
    paddingLeft: 10,
    height: 50,
    width: '81%',
    borderRadius: 7,
    // backgroundColor: '#000',
    color: '#000',
    borderWidth: 1,
    borderColor: '#E92D87',
  },
});
