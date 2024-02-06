import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  TextInput,
  Image,
} from 'react-native';
import React, {useState, useContext, useRef, useEffect} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {postApiCall} from '../../Services/Network';
import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Hud from '../Common/Hud';
import HeaderLastImage from '../Common/HeaderLastImage';
import {ProfileContext} from '../../Services/ProfileProvider';
import DatePicker from 'react-native-date-picker';
import {getStates} from 'country-state-picker';
// import CountryPicker from 'react-native-country-picker-modal';
import DropDownPicker from 'react-native-dropdown-picker';

const {width, height} = Dimensions.get('window');

const AddAccount = props => {
  const {profileContextData} = useContext(ProfileContext);
  useEffect(() => {
    getStateFunc();
  }, []);

  const getStateFunc = () => {
    if (profileContextData.city == null) {
      var temp = [];
      temp = getStates(profileContextData.country_code.toLowerCase());

      var temp1 = [];
      setState('');
      temp.map(item => {
        var state = {
          label: item,
          value: item,
        };

        temp1.push(state);
      });
      setStateRange(temp1);
      console.log('=========>', stateRange);
    }

    //console.log('===stateRange===>', stateRange);
  };

  console.log('=========>', profileContextData);
  const nameRef = useRef();
  const bankNameRef = useRef();
  const accountRef = useRef();
  const confirmAccountRef = useRef();
  const ifceRef = useRef();
  const address1Ref = useRef();
  const address2Ref = useRef();
  const postalCodeRef = useRef();
  const cityRef = useRef();
  const stateRef = useRef();
  const ssnRef = useRef();

  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [account, setAccount] = useState('');
  const [confirmAccount, setConfirmAccount] = useState('');
  const [ifcCode, setIfcCode] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [dob, setDOB] = useState(new Date());
  const [ssn, setSSN] = useState('');
  const [trimDate, setTrimDate] = useState('');

  const [stateRange, setStateRange] = useState([]);

  const [shownName, setShownName] = useState(false);
  const [shownBankName, setShownBankName] = useState(false);
  const [shownAccount, setShownAccount] = useState(false);
  const [shownConfirmAccount, setShownConfirmAccount] = useState(false);
  const [shownIfcCode, setShownIfcCode] = useState(false);
  const [shownRoutingNumber, setShownRoutingNumber] = useState(false);

  const [shownAddress1, setShownAddress1] = useState(false);
  const [shownAddress2, setShownAddress2] = useState(false);
  const [shownPostalCode, setShownPostalCode] = useState(false);
  const [shownCity, setShownCity] = useState(false);
  const [shownState, setShownState] = useState(false);
  const [shownDOB, setShownDOB] = useState(false);
  const [shownSSN, setShownSSN] = useState(false);

  const [open, setOpen] = useState(false);

  const [errorMsg, setErrorMsg] = useState({
    isName: true,
    isBankName: true,
    isAccount: true,
    isConfirmAccount: true,
    isIfcCode: true,
    isRoutingNumber: true,
    isAddress: true,
    isAddress2: true,
    isPostalCode: true,
    isCity: true,
    isState: true,
    isDOB: true,
    isSSN: true,
  });

  const nameHandler = value => {
    setName(value);
    setShownName(true);
    //console.log(name);
  };
  const bankHandler = value => {
    setBankName(value);
    setShownBankName(true);
    //console.log(name);
  };
  const accountHandler = value => {
    setAccount(value);
    setShownAccount(true);
    //console.log(name);
  };
  const confirmAccountHandler = value => {
    setConfirmAccount(value);
    setShownConfirmAccount(true);
    //console.log(name);
  };

  const ifcCodeHandler = value => {
    setIfcCode(value);
    setShownIfcCode(true);
  };
  const routingNumberHandler = value => {
    setRoutingNumber(value);
    setShownRoutingNumber(true);
  };

  const address1Handler = value => {
    setAddress1(value);
    setShownAddress1(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isAddress: true});
    }
  };

  const address2Handler = value => {
    setAddress2(value);
    setShownAddress2(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isAddress2: true});
    }
  };

  const cityHandler = value => {
    setCity(value);
    setShownCity(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isCity: true});
    }
  };

  const stateHandler = value => {
    setState(value);
    setShownState(true);
  };

  const postalCodeHandler = value => {
    setPostalCode(value);
    setShownPostalCode(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isPostalCode: true});
    }
  };

  const ssnHandler = value => {
    setSSN(value);
    setShownSSN(true);
    if (value.trim() != '') {
      setErrorMsg({...errorMsg, isSSN: true});
    }
  };

  const setDateFunc = value => {
    setShownDOB(false);
    console.log('Date==>', value);
    setDOB(value);
    var temp = JSON.stringify(value).substring(1, 11);
    console.log('Initial Date==>', temp);
    // var newDate = temp.split('-').reverse().join('-');
    // console.log('New Date==>', newDate);
    setTrimDate(temp);
  };

  const addAccount = async () => {
    console.log('Account has been added');
    if (name.trim() == '') {
      return setErrorMsg({...errorMsg, isName: false});
    } else if (bankName.trim() == '') {
      return setErrorMsg({...errorMsg, isBankName: false});
    } else if (account.trim() == '') {
      return setErrorMsg({...errorMsg, isAccount: false});
    } else if (confirmAccount.trim() == '') {
      return setErrorMsg({...errorMsg, isConfirmAccount: false});
    } else if (account !== confirmAccount) {
      return setErrorMsg({...errorMsg, isConfirmAccount: false});
    } else if (profileContextData.country.toLowerCase() == 'india') {
      if (ifcCode.trim() == '') {
        console.log('Hello');
        return setErrorMsg({...errorMsg, isIfcCode: false});
      } else if (routingNumber.trim() == '') {
        return setErrorMsg({...errorMsg, isRoutingNumber: false});
      }
    } else if (
      profileContextData.country_code != 'US' &&
      (profileContextData.ssn_last_4 == null || ssn.length < 4)
    ) {
      console.log('Hello1');
      return setErrorMsg({...errorMsg, isSSN: false});
    } else {
      Hud.showHud();
      console.log('Account has been added');
      const sendData = {
        holder_name: name,
        account_no: account,
        ifsc: ifcCode,
        branch_name: bankName,
        routing_number: routingNumber,
        city: profileContextData.city == null ? city : profileContextData.city,
        line1:
          profileContextData.line1 == null
            ? address1
            : profileContextData.line1,
        line2:
          profileContextData.line2 == null
            ? address2
            : profileContextData.line2,
        postal_code:
          profileContextData.postal_code == null
            ? postalCode
            : profileContextData.postal_code,
        state:
          profileContextData.state == null ? state : profileContextData.state,
        dob: profileContextData.dob == null ? trimDate : profileContextData.dob,
        ssn_last_4:
          profileContextData.ssn_last_4 == null
            ? ssn
            : profileContextData.ssn_last_4,
      };

      await postApiCall('bankaccountpost', sendData, {})
        .then(response => {
          Hud.hideHud();
          console.log('response.data', response.data);
          if ((response.status = 200)) {
            Toast.show({
              type: 'success',
              text1: response.data.message,
            });
            props.navigation.navigate('Balance');
          }
        })
        .catch(function (error) {
          if (error.response) {
            // Request made and server responded
            Hud.hideHud();
            console.log('========>', error.response.status);
            console.log('error in response==>', error.response.data);
          } else if (error.request) {
            // The request was made but no response was received
            console.log('error in request===>', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('other error ===>', error.message);
          }
        });
    }
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
        <HeaderLastImage navProps={props.navigation} title={'Account'} />

        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff', width: width * 0.9}}>
          <View
            style={{
              marginBottom: height * 0.14,
              marginTop: height * 0.02,
              alignItems: 'center',
            }}>
            <View style={shownName ? styles.divisionSelect : styles.division}>
              <View style={{flex: 1}}>
                <TextInput
                  ref={nameRef}
                  onChangeText={value => nameHandler(value)}
                  placeholder="Your Name"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    bankNameRef.current.focus();
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            {!errorMsg.isName && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(12),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Name
              </Text>
            )}

            <View
              style={shownBankName ? styles.divisionSelect : styles.division}>
              <View style={{flex: 1}}>
                <TextInput
                  ref={bankNameRef}
                  onChangeText={value => bankHandler(value)}
                  placeholder="Branch Name"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    accountRef.current.focus();
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            {!errorMsg.isBankName && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(12),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Branch name
              </Text>
            )}

            <View
              style={shownAccount ? styles.divisionSelect : styles.division}>
              <View style={{flex: 1}}>
                <TextInput
                  ref={accountRef}
                  onChangeText={value => accountHandler(value)}
                  placeholder="Account Number"
                  keyboardType="numeric"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    confirmAccountRef.current.focus();
                  }}
                  style={styles.input}
                />
              </View>
            </View>
            {!errorMsg.isAccount && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(12),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please enter Your Account number
              </Text>
            )}

            <View
              style={
                shownConfirmAccount ? styles.divisionSelect : styles.division
              }>
              <View style={{flex: 1}}>
                <TextInput
                  ref={confirmAccountRef}
                  onChangeText={value => confirmAccountHandler(value)}
                  placeholder="Re-Enter Account Number"
                  keyboardType="numeric"
                  //style={[styles.textInput]}
                  placeholderTextColor={'#8E7B85'}
                  autoCorrect={false}
                  returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   ifceRef.current.focus();
                  // }}
                  style={styles.input}
                />
              </View>
            </View>
            {!errorMsg.isConfirmAccount && (
              <Text
                style={{
                  color: 'red',
                  fontSize: RFValue(12),
                  textAlign: 'center',
                  width: '100%',
                }}>
                Please confirm Your Account number correctly
              </Text>
            )}

            {profileContextData.country.toLowerCase() == 'india' ? (
              <>
                <View
                  style={
                    shownIfcCode ? styles.divisionSelect : styles.division
                  }>
                  <View style={{flex: 1}}>
                    <TextInput
                      ref={ifceRef}
                      onChangeText={value => ifcCodeHandler(value)}
                      placeholder="IFCE code"
                      //style={[styles.textInput]}
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
                      style={styles.input}
                    />
                  </View>
                </View>
                {!errorMsg.isIfcCode && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: RFValue(12),
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    Please enter IFCE code
                  </Text>
                )}
              </>
            ) : (
              <>
                <View
                  style={
                    shownRoutingNumber ? styles.divisionSelect : styles.division
                  }>
                  <View style={{flex: 1}}>
                    <TextInput
                      // ref={ifceRef}
                      onChangeText={value => routingNumberHandler(value)}
                      placeholder="ACH Routing Number"
                      //style={[styles.textInput]}
                      placeholderTextColor={'#8E7B85'}
                      autoCorrect={false}
                      style={styles.input}
                    />
                  </View>
                </View>
                {!errorMsg.isRoutingNumber && (
                  <Text
                    style={{
                      color: 'red',
                      fontSize: RFValue(12),
                      textAlign: 'center',
                      width: '100%',
                    }}>
                    Please enter ACH Routing Number
                  </Text>
                )}

                {profileContextData.line1 == null && (
                  <>
                    <View
                      style={
                        shownAddress1 ? styles.divisionSelect : styles.division
                      }>
                      <TextInput
                        ref={address1Ref}
                        onChangeText={value => address1Handler(value)}
                        placeholder="Address1"
                        //style={[styles.textInput]}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                        //multiline={true}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          address2Ref.current.focus();
                        }}
                        style={styles.input}
                      />
                    </View>
                    {!errorMsg.isAddress && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: RFValue(15),
                          textAlign: 'center',
                          width: '100%',
                        }}>
                        Please enter Your Address
                      </Text>
                    )}
                  </>
                )}
                {profileContextData.line2 == null && (
                  <>
                    <View
                      style={
                        shownAddress2 ? styles.divisionSelect : styles.division
                      }>
                      <TextInput
                        ref={address2Ref}
                        onChangeText={value => address2Handler(value)}
                        placeholder="Address2"
                        //style={[styles.textInput]}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                        //multiline={true}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          postalCodeRef.current.focus();
                        }}
                        style={styles.input}
                      />
                    </View>

                    {!errorMsg.isAddress2 && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: RFValue(15),
                          textAlign: 'center',
                          width: '100%',
                        }}>
                        Please enter Your Address
                      </Text>
                    )}
                  </>
                )}
                {profileContextData.state == null && (
                  <>
                    <View style={{alignSelf: 'center'}}>
                      <DropDownPicker
                        placeholder="State"
                        placeholderStyle={{color: '#8E7B85'}}
                        disableBorderRadius={true}
                        open={open}
                        value={state}
                        items={stateRange}
                        setOpen={setOpen}
                        setValue={value => {
                          stateHandler(value);
                        }}
                        setItems={setStateRange}
                        style={
                          shownState ? styles.divisionSelect : styles.division
                        }
                        zIndexInverse={2000}
                        listMode="SCROLLVIEW"
                        dropDownContainerStyle={{
                          //backgroundColor: 'red',
                          width: '95%',
                          marginTop: 20,
                          //borderRadius: 20,
                        }}
                        textStyle={{
                          color: '#000',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          textAlign: 'left',
                          paddingHorizontal: width / 40,
                          fontSize: RFValue(15),
                        }}
                      />
                    </View>

                    {!errorMsg.isState && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: RFValue(15),
                          textAlign: 'center',
                          width: '100%',
                        }}>
                        Please enter Your State
                      </Text>
                    )}
                  </>
                )}
                {profileContextData.postal_code == null && (
                  <>
                    <View
                      style={
                        shownPostalCode
                          ? styles.divisionSelect
                          : styles.division
                      }>
                      <TextInput
                        ref={postalCodeRef}
                        onChangeText={value => postalCodeHandler(value)}
                        placeholder="Postal Code"
                        //style={[styles.textInput]}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                        keyboardType="numeric"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          cityRef.current.focus();
                        }}
                        style={styles.input}
                      />
                    </View>
                    {!errorMsg.isPostalCode && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: RFValue(15),
                          textAlign: 'center',
                          width: '100%',
                        }}>
                        Please enter Your Postal Code
                      </Text>
                    )}
                  </>
                )}

                {profileContextData.city == null && (
                  <>
                    <View
                      style={
                        shownCity ? styles.divisionSelect : styles.division
                      }>
                      <TextInput
                        ref={cityRef}
                        onChangeText={value => cityHandler(value)}
                        placeholder="City"
                        //style={[styles.textInput]}
                        placeholderTextColor={'#8E7B85'}
                        autoCorrect={false}
                        // multiline={true}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                          stateRef.current.focus();
                        }}
                        style={styles.input}
                      />
                    </View>
                    {!errorMsg.isCity && (
                      <Text
                        style={{
                          color: 'red',
                          fontSize: RFValue(15),
                          textAlign: 'center',
                          width: '100%',
                        }}>
                        Please enter Your City
                      </Text>
                    )}
                  </>
                )}

                {profileContextData.country_code == 'US' &&
                  profileContextData.ssn_last_4 == null && (
                    <>
                      <View
                        style={
                          shownSSN ? styles.divisionSelect : styles.division
                        }>
                        <TextInput
                          ref={ssnRef}
                          onChangeText={value => ssnHandler(value)}
                          placeholder="Last 4 digit Social Security Number"
                          maxLength={4}
                          //style={[styles.textInput]}
                          placeholderTextColor={'#8E7B85'}
                          autoCorrect={false}
                          returnKeyType="next"
                          style={styles.input}
                          keyboardType="numeric"
                        />
                      </View>
                      {!errorMsg.isSSN && (
                        <Text
                          style={{
                            color: 'red',
                            fontSize: RFValue(15),
                            textAlign: 'center',
                            width: '100%',
                          }}>
                          Please enter Your last 4 digit Social Security Number
                        </Text>
                      )}
                    </>
                  )}
                {profileContextData.dob == null && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        setShownDOB(true);
                      }}
                      style={
                        trimDate !== ''
                          ? styles.divisionSelect
                          : styles.division
                      }>
                      {/* <Text
                    style={{
                      fontSize: 15,
                      color: '#000',
                      //fontFamily: 'Roboto-Medium',
                      fontWeight: '500',
                      //fontWeight: 'bold',
                      //letterSpacing: 0.4,
                    }}></Text> */}
                      {trimDate == '' ? (
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#8E7B85',
                            //fontFamily: 'Roboto-Reqular',
                            fontWeight: '400',
                            alignSelf: 'center',

                            //fontWeight: 'bold',
                            //letterSpacing: 0.4,
                          }}>
                          Enter your Date of Birth
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#151143',
                            //fontFamily: 'Roboto-Reqular',
                            fontWeight: '400',
                            alignSelf: 'center',

                            //fontWeight: 'bold',
                            //letterSpacing: 0.4,
                          }}>
                          {trimDate}
                        </Text>
                      )}

                      <DatePicker
                        modal
                        open={shownDOB}
                        date={dob}
                        mode="date"
                        //theme="light"
                        //textColor={}
                        onConfirm={date => {
                          setDateFunc(date);
                        }}
                        onCancel={() => {
                          setShownDOB(false);
                        }}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </>
            )}
            <View
              style={{
                width: width * 0.85,
                height: 50,
                marginTop: height * 0.07,
              }}>
              <TouchableOpacity
                onPress={() => addAccount()}
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
                  Add Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddAccount;

const styles = StyleSheet.create({
  division: {
    width: width * 0.85,
    backgroundColor: '#EBE0E5',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },

  divisionSelect: {
    width: width * 0.85,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E92D87',
    height: 50,
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: height * 0.025,
    paddingLeft: 10,
  },
  input: {
    flex: 1,
    color: '#151143',
  },
  imagesty: {width: '100%', height: '100%'},
});
