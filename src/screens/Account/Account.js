import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { TextInput } from 'react-native-paper';
import { Header2, Header3 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import { supabase } from '../../supabase/supabaseClient';
export const Account = (props) => {
  useEffect(() => {
    getdata();
    getunseennotification();
  }, []);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      getunseennotification();
      // setUpcoming(true);
      // setCompleted(false);
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
    await Apis.doctorprofileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setEmail(response.data.response.email);
        SetImage(response.data.response.profile_image);
        setCountryname(response.data.response.country)
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
      doctor_id: user_id,
    };

    setLoding(true);
    await Apis.doctorunseenNotification(data)

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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
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
      <Header3
        title="Account"
        navProps={props.navigation}
        unseencount={unseencount?.toString()}
      />

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
        style={{}}
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
            onPress={() => props.navigation.navigate('EditProfile', { counrtyname: counrtyname })}
          >
            <Image
              source={{ uri: image }}
              style={{ height: 80, width: 80, borderRadius: 55, resizeMode: 'contain' }}
            />
            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                position: 'absolute',
                left: 55,
                top: 45,
              }}
              onPress={() => props.navigation.navigate('EditProfile', { counrtyname: counrtyname })}
            >
              <Image
                source={require('../../Assets/edit.png')}
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
              // marginLeft: '5%',
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
              #DT0055
            </Text>

            <Text
              style={{
                // marginLeft: 120,
                // position: 'absolute',
                marginTop: 3,
                color: '#000',
              }}
            >
              {email}
            </Text>
            <Text
              style={{
                //  marginLeft: 120,
                //  position: 'absolute',

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
          onPress={() => props.navigation.navigate('Schedule')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/schedule.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Scheduling Time</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('AddPrice')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/consultation-fees.png')}
              resizeMode={'contain'}
              style={[styles.img, { height: 40, width: 40 }]}
            />
            <Text style={styles.text}>Consultation Fees</Text>
          </View>

          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        {/* <View style={styles.verticleLine}></View>
        <TouchableOpacity
          style={{ height: 50, width: '95%', borderRadius: 20 }}
        >
          <Image
            source={require('../../Assets/request.png')}
            resizeMode={'contain'}
            style={styles.img}
          />
          <Text style={styles.text}>Request change of Medicine</Text>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity> */}
        <View style={styles.verticleLine}></View>
        {/* <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('AccountDetails')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={require('../../Assets/account.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Account Details</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          />
        </TouchableOpacity>
        <View style={styles.verticleLine}></View> */}
        <TouchableOpacity
          style={{
            height: 50,
            width: '95%',
            borderRadius: 20,
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => props.navigation.navigate('QuickVisitData')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/quickvisit.png')}
              resizeMode={'contain'}
              style={{
                height: 40,
                width: 40,
                borderRadius: 10,
                marginLeft: 20,
                marginTop: 5,
                backgroundColor: '#E9F1F6',
              }}
            />
            <Text style={styles.text}>Quick Chatbot Booking List</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('Notification')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/bellbox.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Notification</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('DoctorFavourite')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/favourite.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>Favorite Patient List</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('AboutUs')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/about.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}>About Us</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('PrivacyPolicy')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/privacy.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Privacy Policy</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('TermsAndCondition')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/terms.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Terms and Conditions</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={() => props.navigation.navigate('GoSettings')}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/setting.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Settings</Text>
          </View>
          <Image
            source={require('../../Assets/arrow-right.png')}
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
          onPress={llout}
        >
          <View style={{ flexDirection: 'row', }}>
            <Image
              source={require('../../Assets/logout.png')}
              resizeMode={'contain'}
              style={styles.img}
            />
            <Text style={styles.text}> Logout</Text>
          </View>
          {/* <Image
            source={require('../../Assets/arrow-right.png')}
            resizeMode={'contain'}
            style={styles.arrowimg}
          /> */}
        </TouchableOpacity>
        <View style={{ paddingBottom: 15 }} />
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
    marginTop: 2,
  },
  text: {
    position: 'absolute',
    marginLeft: 80,
    marginTop: 18,
    color: '#2173A8',
    fontWeight: 'bold',
    fontSize: 15,
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 5,
  },
});
