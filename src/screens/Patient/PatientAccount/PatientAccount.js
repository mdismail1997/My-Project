import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput, Text } from 'react-native-paper';
import { Header2, Header3 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
export const PatientAccount = (props) => {
  useEffect(() => {
    getdata();
    getunseennotification();
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      getunseennotification();

    });
    return unsubscribe;
  }, []);
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, SetImage] = useState('');
  const [unseencount, SetUnseenCount] = React.useState();
  const [counrtyname, setCountryname] = useState('');
  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.profileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setEmail(response.data.response.email);
        SetImage(response.data.response.profile_image);
        setCountryname(response.data.response.country);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getunseennotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      patient_id: user_id,
    };

    setLoding(true);
    await Apis.unseenNotification(data)

      .then((response) => {
        console.warn('unseencount', response.data);
        setLoding(false);
        SetUnseenCount(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      getunseennotification();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.navigation]);
  const llout = async () => {
    Alert.alert("", 'Log out from app?', [
      { text: 'CANCEL' },
      {
        text: 'OK',
        onPress: () => Logout()
      }


    ]);

  }
  const Logout = async () => {
    await Apis.logout()

      .then((response) => {
        AsyncStorage.removeItem('authtoken');
        console.warn('responsedata=================>', response.data);
        props.navigation.replace('Intro');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };


  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header3 title="Account" navProps={props.navigation} unseencount={unseencount?.toString()} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView
        // style={{ marginTop: 10 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
          <TouchableOpacity
            style={{
              marginLeft: 20,
              alignSelf: 'center',
              borderRadius: 55,
              height: 80,
              width: 80,

            }}
            onPress={() => props.navigation.navigate('PatientEditProfile', { counrtyname: counrtyname })}
          >
            <Image
              source={{ uri: image }}
              style={{
                height: 80, width: 80, borderRadius: 55, resizeMode: 'contain', borderWidth: 1,
                borderColor: '#000'
              }}
            />
            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                position: 'absolute',
                left: 52,
                top: 42,
              }}
              onPress={() => props.navigation.navigate('PatientEditProfile', { counrtyname: counrtyname })}
            >
              <Image
                source={require('../../../Assets/edit.png')}
                resizeMode={'contain'}
                style={{
                  height: '75%',
                  width: '75%',
                  borderRadius: 10,
                  alignSelf: 'center',
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          <View
            style={{
              marginLeft: '10%',
              justifyContent: 'center',
              flexDirection: 'column',
              width: '65%',
            }}
          >
            <Text
              style={{
                // marginLeft: 120,
                //  position: 'absolute',
                fontSize: 10,
                color: '#000',
                // marginTop: 10,
              }}
            >
              #PT12345
            </Text>
            <Text
              style={{
                //  marginLeft: 120,
                //  position: 'absolute',
                marginTop: 3,
                color: '#000',
              }}
            >
              {email}
            </Text>
            <Text
              style={{
                // marginLeft: 120,
                // position: 'absolute',
                marginTop: 3,
                color: '#000',
                fontSize: 15,
                fontWeight: 'bold',
                width: '80%'
              }}
            >
              {name}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              height: 45,
              width: 45,
              borderRadius: 20,
              marginRight: '5%',

              // position: 'absolute',
              //alignSelf: 'flex-end',
            }}
            onPress={() => props.navigation.navigate('PatientOverview')}
          >
            <Image
              source={require('../../../Assets/edit1.png')}
              resizeMode={'contain'}
              style={{ height: '85%', width: '85%', borderRadius: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('PrescriptionList')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/PatientPres.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>My Prescription</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('Orderlist')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/PatientPres.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>My Lab Tests</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('Favourite')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/favourite.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Favorite Doctor List</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        {/* <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
          onPress={() => props.navigation.navigate('ReqChngMedicine')}
        >
          <Image
            source={require('../../../Assets/request.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}>Request change of Medicine</Text>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity> */}
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('ShowAccountDetails')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/account.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Account Details</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('Notification')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/bellbox.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Notification</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>


        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('AboutUs')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/about.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> About Us</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('PrivacyPolicy')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/privacy.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Privacy Policy</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('TermsAndCondition')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/terms.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Terms and Conditions</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => props.navigation.navigate('GoSettings', { counrtyname: counrtyname })}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../../Assets/setting.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Settings</Text>
          </View>
          <Image
            source={require('../../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>

        <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10
          }}
          // onPress={async () => {
          //   await AsyncStorage.removeItem('authtoken');
          //   await deleteUserToken();
          //   props.navigation.navigate('SelectScreen');
          // }}
          onPress={llout}
        >
          <Image
            source={require('../../../Assets/logout.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}> Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  verticleLine: {
    height: 2,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.3,
  },
  arrowimg: {
    height: 25,
    width: 25,
    borderRadius: 10,
    marginTop: 10,
    // position: 'absolute',
  },
  text: {
    marginLeft: 20,
    marginTop: 7,
    color: '#2173A8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 10,
    alignItems: 'center',
  },
});
