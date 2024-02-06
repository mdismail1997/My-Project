import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {ScreenScrollComponent, CustomButton} from '../../commonItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import colors from '../../asserts/colors.js/colors';

import {BASE_URL} from '../../utils/Api/apiName';
import axios from 'axios';
import {calcH, calcW} from '../../utils/comon';
import {UIActivityIndicator} from 'react-native-indicators';
import colors from '../../utils/colors';

import Hud from '../../utils/hud';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import commonToast from '../../utils/commonToast';

export default function AccountScreen({navigation}) {
  const [profileImg, setProfileImg] = useState(null);
  const [name, setName] = useState('');
  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await LoginManager.logOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const onLogoutPress = () => {
    Alert.alert(
      //title
      'Logout',
      //body
      'Are you sure want to Logout?',
      [
        {text: 'Yes', onPress: () => processLogout()},
        {text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel'},
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );

   
  };
  const processLogout = async () => {
    AsyncStorage.multiRemove([  
    'userToken',
    'userName',
    'userEmail',
    'userID',]);
    navigation.reset({
      index: 0,
      routes: [{name: 'signIn'}],
    });
    signOut();
   
  
  };

  useEffect(() => {
    getProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
  }, [navigation]);

  const getProfile = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    console.log('token_select_car', token.data.data.token);
    const tokenUser = token.data.data.token;
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'user-details',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + tokenUser,
      },
    })
      .then(response => {
        console.log('vewyr8c3r0837tryc8437r38', response.data.profile_photo);
        Hud.hideHud();
        setProfileImg(response.data.profile_photo);
        setName(response.data.name);
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud();
        Alert.alert(err);
      });
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
   
   const user = JSON.parse(await AsyncStorage.getItem('userToken'));
   console.log(" user", user.data.data);
    const body={
      user_id: user.data.data.userData? user.data.data.userData.id :  user.data.data.rider.id
    }
   await axios({
      method: 'post',
      url: BASE_URL + 'my-profile-delete',
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + user.data.data.token,
      },
      data: body,
    })
    .then(response => {
        console.log('resend otp', response.data);
        if (response.data.success === true) {
          commonToast({
            text: response.data.message,
            position: 'top',
            toastFor: 'success',
          });
          GoogleSignin.signOut();
          LoginManager.logOut();
          AsyncStorage.multiRemove(['userToken', 'userData']);
          navigation.reset({
            index: 0,
            routes: [{name: 'signIn'}],
          });
          navigation.navigate('signIn')
        }else{
          Alert.alert("", response.data.message)
        }
      })
      .catch(err => {
        console.log('delete err', (JSON.stringify(err.response)));
      });
  }
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topContainer}>
          <View style={styles.imageContainer}>
            {/* {profileImg   ?
                    <Image style={styles.profileImg} source={{uri: profileImg}}
                    />
                   :
        // filePath === ''?
                    <Image style={styles.profileImg} source={require('../../asserts/profile.png')}
                    />
        }
            //     {/* : null
            //       } */}

            {/* <Image style={styles.profileImg} source={{uri: profileImg}} />               */}





            {profileImg ? (
              <Image style={styles.profileImg} source={{uri: profileImg}} />
            ) : (
              <View style={styles.proname}>
                <Text style={{fontSize: 55}}>{name.charAt(0)}</Text>
              </View>
            )}
            
            
          </View>
          <View style={styles.imageContainerTwo}>
            <Text style={{fontSize: 20}}>
              {name}
            </Text>
          </View>
        
          <View style={styles.listContainer}>
            <CustomButton
              iconName="arrowright"
              text="Edit Profile"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('editProfile')}
            />
            <CustomButton
              iconName="arrowright"
              text="Change Password"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('changePassword')}
            />

            <CustomButton
              iconName="arrowright"
              text="Add Card"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('payment')}
            />
            {/* <TouchableOpacity
            style={styles.listRow}
            onPress={() => navigation.navigate('payment')}>
            <Text style={styles.textleft}>Payment Details</Text>
            <IconAntDesign
              styles={styles.arrowTurn}
              color={colors.buttonColor}
              size={24}
              name={'arrowright'}
            />
          </TouchableOpacity> */}
            <CustomButton
              iconName="arrowright"
              text="Ride History"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('rideHistory')}
            />

            <CustomButton
              iconName="arrowright"
              text="Help & Support"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('helpSupport')}
            />

            <CustomButton
              iconName="arrowright"
              text="About"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => navigation.navigate('aboutScreen')}
            />

        <CustomButton
              iconName="arrowright"
              text="Delete Account"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => deleteAccount()}
            />

            <CustomButton
              iconName="arrowright"
              text="Logout"
              containerStyle={styles.listRow}
              color={colors.buttonColor}
              onPress={() => onLogoutPress()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1
  },
  imageContainer: {
    width: calcW(0.9),
    // flex: 1,
    height: calcH(0.2),
    justifyContent: 'center',
    // backgroundColor: colors.primary,
  },
  imageContainerTwo: {
    width: calcW(0.2),
    // flex: 1,
    height: calcH(0.04),
    justifyContent: 'center',
    left: calcW(0.035),
  
    // backgroundColor: colors.primary,
  },
  profileImg: {
    left: calcW(0.3),
    width: calcW(0.3),
    height: calcW(0.3),
    borderRadius: calcW(0.14),
    alignItems: 'center',
    position: 'absolute',
    borderColor: '#000',
    borderWidth: 0,
  },
  proname: {
    left: calcW(0.3),
    width: calcW(0.28),
    height: calcW(0.28),
    borderRadius: calcW(0.14),
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.buttonColor,
    position: 'absolute',
    backgroundColor: '#878f99',
  },
  cameraContainer: {
    left: calcW(0.5),
    width: calcW(0.12),
    height: calcW(0.12),
    borderRadius: calcW(0.3),
    backgroundColor: colors.white,
    position: 'relative',
    marginTop: calcH(0.2),
    justifyContent: 'center',
    elevation: 5,
  },
  cameraIcon: {
    left: calcW(0.025),
    width: calcW(0.06),
    height: calcW(0.06),
  },

  proName: {
    marginBottom: calcH(0.2),
    left: calcW(0.3),
    fontSize: 18,
    fontWeight: '600',
    color: '#121212',
  },
  proMail: {
    alignItems: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#121212',
  },
  listContainer: {
    paddingHorizontal: calcW(0.04),
    marginVertical: calcH(0.025),
    width: calcW(0.95),

    // height: calcH(0.7),
    // marginBottom: calcH(0.02),
  },
  listRow: {
    paddingHorizontal: calcW(0.04),
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: calcH(0.02),
    flexDirection: 'row',
    height: calcH(0.08),
    backgroundColor: colors.white,
    elevation: 5,
  },
});
