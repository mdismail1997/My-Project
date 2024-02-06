import React, {useState, useEffect, useContext} from 'react';

import {
  Image,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';

import {RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getApicall, postApiCall} from '../../Services/Network';
import Hud from '../../Screens/Common/Hud';
import Toast from 'react-native-toast-message';
const {width, height} = Dimensions.get('window');

import {ProfileContext} from '../../Services/ProfileProvider';

const CustomDrawer = props => {
  const {profileContextData} = useContext(ProfileContext);

  const [activeRoute, setRouteState] = useState(0);

  const navigateToProfile = () => {
    setRouteState(1);
    props.navigation.closeDrawer();
    props.navigation.navigate('Profile');
  };

  const navigateToListofQuestion = async () => {
    setRouteState(2);
    props.navigation.closeDrawer();

    if (profileContextData.user_type === 1) {
      props.navigation.navigate('ListOfQuestion');
    } else {
      //props.navigation.navigate('ListOfQuestionCelebrity');
      props.navigation.navigate('LiveQuestion');
    }
  };

  const navigateToRequest = async () => {
    setRouteState(3);
    props.navigation.closeDrawer();
    props.navigation.navigate('AllRequest');
    //props.navigation.navigate('CancelRequest');
  };

  const navigateToTransaction = async () => {
    setRouteState(4);
    props.navigation.closeDrawer();
    props.navigation.navigate('Transactions');
  };
  const navigateToAmountTransaction = async () => {
    setRouteState(10);
    props.navigation.closeDrawer();
    props.navigation.navigate('AmountTransaction');
  };

  const navigateToNotification = async () => {
    setRouteState(5);
    props.navigation.closeDrawer();
    props.navigation.navigate('NotificationSettingScreen');
  };

  const navigateToPrivacy = async () => {
    setRouteState(6);
    props.navigation.closeDrawer();
    props.navigation.navigate('PrivacyPolicy');
  };

  const navigateToTAndC = async () => {
    setRouteState(7);
    props.navigation.closeDrawer();
    props.navigation.navigate('TermAndCondition');
  };

  const navigateToFAQ = async () => {
    setRouteState(8);
    props.navigation.closeDrawer();
    props.navigation.navigate('FAQ');
  };

  const doLogout = () => {
    Alert.alert(
      //title
      'Logout',
      //body
      'Are you sure want to logout ?',
      [
        {text: 'Yes', onPress: () => navigateToLogout()},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const navigateToLogout = async () => {
    const statusInactiveData = {
      status: '0',
    };
    Hud.showHud();
    await postApiCall('sendonlinestatus', statusInactiveData, {})
      .then(async response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Hud.hideHud();
          console.log('Status has been set Offline');
          await AsyncStorage.removeItem('token');

          props.navigation.closeDrawer();
          props.navigation.replace('Login');
        } else {
          console.log('Status has not been set Offline');
        }
      })
      .catch(async function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          await AsyncStorage.removeItem('token');

          props.navigation.closeDrawer();
          props.navigation.replace('Login');

          console.log('error in response==>', error.response.data);

          Toast.show({
            type: 'error',
            text1: 'Socket Error',
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error in Request in the Drawer page===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error in Setting in the Drawer page==>', error.message);
        }
      });
  };

  const doDeleteProfile = () => {
    setRouteState(9);
    Alert.alert(
      //title
      'Delete Profile',
      //body
      'Are you sure want to delete your Profile ?',
      [
        {text: 'Yes', onPress: () => deleteProfile()},
        {
          text: 'No',
          onPress: () => console.log('No Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: false},
      //clicking out side of alert will not cancel
    );
  };

  const deleteProfile = () => {
    if (profileContextData.user_type == 1) {
      deleteProfileUser();
    } else {
      deleteProfileCelebrity();
    }
  };
  const deleteProfileCelebrity = async () => {
    Hud.showHud();
    await postApiCall('delete-celebrity-account', {}, {})
      .then(async response => {
        console.log('response==>', response.data);
        if (response.status == 200) {
          Hud.hideHud();

          Toast.show({
            type: 'success',
            text1: 'Account has been Deleted',
          });
          await AsyncStorage.removeItem('token');
          props.navigation.closeDrawer();
          props.navigation.replace('Login');
        } else {
        }
      })
      .catch(async function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded
          console.log(
            '====error.response.data========>',
            error.response.data.message,
          );
          Toast.show({
            type: 'error',
            text1: error.response.data.message,
          });
        } else if (error.request) {
          // The request was made but no response was received
          console.log('Error in Request in the Drawer page===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error in Setting in the Drawer page==>', error.message);
        }
      });
  };

  const deleteProfileUser = async () => {
    Toast.show({
      type: 'success',
      text1: 'Account has been Deleted',
    });
    // await AsyncStorage.removeItem('token');
    // props.navigation.closeDrawer();
    // props.navigation.replace('Login');
  };
  return (
    <View style={{flex: 1, backgroundColor: '#ffffff'}}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />

      <View
        style={{
          height: height * 0.21,
          width: '100%',
          backgroundColor: '#151143',
        }}>
        <View
          style={{
            width: '95%',
            alignItems: 'flex-end',
            marginTop: height * 0.01,
          }}>
          <TouchableOpacity
            style={{height: height * 0.05, width: width * 0.05}}
            onPress={() => props.navigation.closeDrawer()}>
            <Image
              source={require('../../Assets/Icon/close.png')}
              style={{height: '100%', width: '100%', tintColor: '#EBE0E5'}}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 100,
              marginLeft: '2%',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: profileContextData.profile_image}}
              style={{height: '100%', width: '100%', borderRadius: 100}}
              resizeMode="cover"
            />
          </View>
          <View
            style={{marginLeft: 15, marginTop: 10, alignItems: 'flex-start'}}>
            <Text
              style={{
                fontSize: 15,
                color: '#7B7B7B',

                letterSpacing: 0.4,
              }}>
              Hi,
            </Text>
            <Text
              style={{
                fontSize: 25,
                color: '#FFFFFF',

                fontWeight: 'bold',
                letterSpacing: 0.4,
              }}>
              {profileContextData.name}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 10,
          marginLeft: 0,
          borderWidth: 0,
          //borderColor: 'blue',
          width: '100%',
          justifyContent: 'center',
          //marginTop: 30,
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={navigateToProfile}
          style={
            activeRoute === 1 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/name1.png')}
                style={
                  activeRoute === 1
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 1
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            My Account
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToListofQuestion}
          style={
            activeRoute === 2 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 20,
              }}>
              <Image
                source={require('../../Assets/Icon/list.png')}
                style={
                  activeRoute === 2
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 2
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            {profileContextData.user_type == 1
              ? 'List of Questions'
              : 'List of Collective Questions'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToRequest}
          style={
            activeRoute === 3 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 20,
                width: 30,
                marginLeft: -7,
              }}>
              <Image
                source={require('../../Assets/Icon/request.png')}
                style={
                  activeRoute === 3
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 3
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            All Requests
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToTransaction}
          style={
            activeRoute === 4 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 20,
              }}>
              <Image
                source={require('../../Assets/Icon/wallet.png')}
                style={
                  activeRoute === 4
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 4
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            {profileContextData.user_type === 1
              ? 'All Transactions'
              : 'Collective Transactions'}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={navigateToAmountTransaction}
          style={
            activeRoute === 10 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 20,
              }}>
              <Image
                source={require('../../Assets/Icon/wallet.png')}
                style={
                  activeRoute === 10
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 10
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            {profileContextData.user_type === 1
              ? 'Amount Transactions'
              : 'Withdraw Transactions'}
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={navigateToNotification}
          style={
            activeRoute === 5 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 18,
              }}>
              <Image
                source={require('../../Assets/Icon/bell.png')}
                style={
                  activeRoute === 5
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 5
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            Notifications Setting
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToPrivacy}
          style={
            activeRoute === 6 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 17,
              }}>
              <Image
                source={require('../../Assets/Icon/lock.png')}
                style={
                  activeRoute === 6
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 6
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            Privacy Policy
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToTAndC}
          style={
            activeRoute === 7 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 17,
              }}>
              <Image
                source={require('../../Assets/Icon/t&c.png')}
                style={
                  activeRoute === 7
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 7
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            Terms & conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToFAQ}
          style={
            activeRoute === 8 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={{...styles.imgBox}}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/faq.png')}
                style={
                  activeRoute === 8
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 8
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            FAQ’s
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={doDeleteProfile}
          style={
            activeRoute === 9 ? styles.columnstyleSelected : styles.columnstyle
          }>
          <View style={{...styles.imgBox}}>
            <View
              style={{
                height: 21,
                width: 16,
              }}>
              <Image
                source={require('../../Assets/Icon/delete.png')}
                style={
                  activeRoute === 9
                    ? {width: '100%', height: '100%', tintColor: '#fff'}
                    : {width: '100%', height: '100%', tintColor: '#B19DA7'}
                }
              />
            </View>
          </View>

          <Text
            style={
              activeRoute === 9
                ? {...styles.textstyleSelected}
                : {...styles.textstyle}
            }>
            Delete Profile
          </Text>
        </TouchableOpacity>

        <View
          style={{
            // width: width * 0.7,
            width: '95%',
            //height: height * 0.002,
            height: 1,
            backgroundColor: '#B19DA7',
            marginTop: height * 0.03,
            alignSelf: 'center',
          }}
        />

        <TouchableOpacity onPress={() => doLogout()} style={styles.columnstyle}>
          <View style={styles.imgBox}>
            <View
              style={{
                height: 21,
                width: 22,
              }}>
              <Image
                source={require('../../Assets/Icon/logout.png')}
                style={{width: '100%', height: '100%'}}
              />
            </View>
          </View>

          <Text
            style={{
              fontSize: RFValue(22),
              color: '#E92D87',
              fontWeight: 'bold',
            }}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  columnstyleSelected: {
    alignSelf: 'center',
    marginTop: '1.5%',
    width: '95%',
    height: height * 0.08,
    borderRadius: 10,
    alignItems: 'center',

    flexDirection: 'row',
    backgroundColor: '#EE4897',
  },

  columnstyle: {
    alignSelf: 'center',
    marginTop: '1.5%',
    width: '95%',
    height: height * 0.08,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },

  textstyle: {
    fontSize: 16,
    color: '#8F99A8',
    fontWeight: '400',
  },
  textstyleSelected: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '400',
  },
  imgBox: {
    width: 55,
    height: 30,
    marginRight: width * 0.01,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
