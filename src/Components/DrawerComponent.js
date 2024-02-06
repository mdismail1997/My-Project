import React, {useState, useEffect} from 'react';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../asserts/colors.js/colors';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';
import {calcH, calcW} from '../utils/comon';
import axios from 'axios';
import Hud from '../utils/hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {BASE_URL} from '../utils/Api/apiName';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';

function HomeScreen({navigation}) {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');

  // *******************************logout user details*************************************

  useEffect(() => {
    getProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await LoginManager.logOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };
  // ----------------------------------------------------------------------------------------------------
  const getProfile = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const userId = JSON.parse(await AsyncStorage.getItem('userID'));
    const user = JSON.parse(await AsyncStorage.getItem('userResponse'));
    console.log('{token}', userId, token, user);

    const useremail = JSON.parse(await AsyncStorage.getItem('userEmail'));
    const output = `${useremail.slice(0, 20)}${
      useremail.length > 20 ? '....' : ''
    }`;
    setEmail(useremail);
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + `profile-details/${userId}`,
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        console.log("{}{}{}{}{}",response.data);
        Hud.hideHud();
        setImage(response.data.profile_photo);

        setName(response.data.name);
        // setFilePath(response.data.profile_photo)
      })
      .catch(err => {
        console.log('errprofile', err.response.data);
        Hud.hideHud();
        Alert.alert(err);
      });
  };

  //..**************************************************************************************
  const doLogout = () => {
    Alert.alert(
      //title
      'Signout',
      //body
      'Are you sure want to signout?',
      [
        {text: 'Yes', onPress: () => processLogout()},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };
  const processLogout = async () => {
    // await AsyncStorage.setItem("user_token", "");
    // await GoogleSignin.signOut();
   
    await AsyncStorage.multiRemove([
      'userToken',
      'userName',
      'userEmail',
      'userID',
    ]);
    navigation.reset({
      index: 0,
      routes: [{name: 'signIn'}],
    });
    signOut()
  };

const deleteAccount = () => {
  Alert.alert(
    //title
    'Delete Account',
    //body
    'Are you sure want to delete account?',
    [
      {text: 'Yes', onPress: () => processDelete()},
      {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
    ],
    {cancelable: false},
    //clicking out side of alert will not cancel
  );
}

const processDelete = async() => {
  const token = JSON.parse(await AsyncStorage.getItem('userToken'));
  console.log('42515464', token);
  const userId =JSON.parse(await AsyncStorage.getItem('userID'));
  console.log('42515464', userId);
  const body={
    user_id: userId
  }
 await axios({
    method: 'post',
    url: BASE_URL + 'delete-my-profile',
    headers: {
      Accept: 'application/json',
      authorization: 'Bearer ' + token,
    },
    data: body,
  })
    .then(response => {
      console.log('resend otp', response.data);
      if (response.data.success === true) {
        Toast.show({
          type: 'success',
          text1: response.data.message,
        });
        navigation.navigate('signIn')
      }else{
        Alert.alert("", response.data.message)
      }
    })
    .catch(err => {
      console.log('delete err', err);
    });
}

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={{marginLeft: calcW(0.07)}}>
          <View
            style={{
              marginTop: calcH(0.04),
              flexDirection: 'row',
              alignItems: 'center',
              // flex: 1.5,
              marginBottom: calcH(0.03),
            }}>
            {image ? (
              <Image
                style={{
                  height: calcH(0.09),
                  width: calcW(0.16),
                  resizeMode: 'cover',
                  overflow: 'hidden',
                  borderRadius: 60 / 2,
                  borderColor: colors.buttonAnothercolor,
                  borderWidth: 2,
                }}
                source={{uri: image}}
              />
            ) : (
              <View
                style={{
                  height: calcH(0.09),
                  width: calcW(0.16),
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 60 / 2,
                  borderColor: colors.buttonAnothercolor,
                  borderWidth: 2,
                  backgroundColor: '#878f99',
                }}>
                <Text style={{fontSize: RFValue(25), color: '#FFF'}}>
                  {name.charAt(0)}
                </Text>
              </View>
            )}

            <View style={{flex: 0.9, borderColor: '#000', borderWidth: 0}}>
              <Text
                style={{
                  color: '#fff',
                  fontSize: RFValue(16),
                  marginLeft: calcW(0.01),
                  fontWeight: '600',
                }}>
                {name.toUpperCase()}
              </Text>
              <Text
              // numberOfLines={2}
                style={{
                  color: '#fff',
                  fontSize: RFValue(13),
                  marginLeft: calcW(0.02),
                }}>
                {email}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: calcH(0.001),
              width: calcW(0.65),
              backgroundColor: '#fff',
            }}
          />

          <ScrollView>
            <View style={{flex: 1}}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: calcH(0.01),
                }}
                onPress={() => navigation.navigate('homeScreen')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'car-side'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Home{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('account')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'account-circle'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Profile{' '}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('accountDetails')}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'bank-outline'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Account Details
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('payOut')}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name="cash"
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Payments
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('changePassword')}>
                <Fontisto
                  color={colors.inActiveBorder}
                  size={20}
                  name={'key'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Change Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('documentUpload')}>
                <Ionicons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'ios-document-text-outline'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Documentation
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('rideHistory')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'car-side'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Ride History{' '}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('cancelHistory')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'car-off'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Cancellation Ride
                </Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('tollScreen')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'receipt'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Add Toll Receipt
                </Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('paymentDetails')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'download-circle-outline'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Payment details
                </Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('termsandCondition')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'file-document-edit-outline'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Terms & Conditions
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('AboutScreen')}>
                <MaterialCommunityIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'file-document-edit-outline'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                 About Us
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => navigation.navigate('helpandSupport')}>
                <MaterialIcons
                  color={colors.inActiveBorder}
                  size={20}
                  name={'support'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Help {'&'} Support
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginBottom: calcH(0.18),
                }}
                onPress={deleteAccount}>
                <AntDesign
                  color={colors.inActiveBorder}
                  size={20}
                  name={'deleteuser'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                 Delete Account
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: calcH(0.18),
                }}
                onPress={doLogout}>
                <AntDesign
                  color={colors.inActiveBorder}
                  size={20}
                  name={'login'}
                />
                <Text
                  style={{
                    paddingVertical: calcH(0.02),
                    color: '#fff',
                    fontSize: RFValue(18),
                    marginLeft: calcW(0.02),
                  }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3165cb',
  },
});
export default HomeScreen;
