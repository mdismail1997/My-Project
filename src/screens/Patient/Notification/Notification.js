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
import { TextInput, Switch, Paragraph, Text } from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const Notification = (props) => {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const [isVibrateOn, setIsVibrateOn] = useState(false);
  const onToggleVibrate = () => setIsVibrateOn(!isVibrateOn);
  const [istipsOn, setIstipsOn] = useState(false);
  const onToggletips = () => setIstipsOn(!istipsOn);
  const [isserviceOn, setIsserviceOn] = useState(false);
  const onToggleservice = () => setIsserviceOn(!isserviceOn);
  const [loading, setLoding] = useState(false);
  const [alldata, setAllData] = useState([]);
  const [userrole, setUserRole] = useState('');
  const [dataall, setDataAll] = useState([]);
  const SendPatientNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let role = await AsyncStorage.getItem('role');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', role);
    setUserRole(role);
    const data = {
      patient_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    setLoding(true);
    await Apis.listnotificationpatient(data)

      .then((response) => {
        setLoding(false);
        console.warn(response.data);
        setAllData(response.data.response);
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };
  const SeenNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let role = await AsyncStorage.getItem('role');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', role);
    const data = {
      patient_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    setLoding(true);
    await Apis.seenNotification(data)

      .then((response) => {
        setLoding(false);
        console.warn('seenotification', response.data);
        // setDataAll(response.data.response);
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };
  const DoctorSeenNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let role = await AsyncStorage.getItem('role');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', role);

    const data = {
      doctor_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    setLoding(true);
    await Apis.doctorseenNotification(data)

      .then((response) => {
        setLoding(false);
        console.warn('seenotification', response.data);
        // setDataAll(response.data.response);
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };

  const SendPatient = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let role = await AsyncStorage.getItem('role');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', props.route.params?.id);
    console.log('token123=', role);
    setUserRole(role);
    const data = {
      doctor_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.log('data--------', data);
    setLoding(true);
    await Apis.listnotificationdoctor(data)

      .then((response) => {
        setLoding(false);
        console.warn(response.data);
        setDataAll(response.data.response);
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };
  useEffect(() => {
    SendPatientNotification();
    SendPatient();
    SeenNotification();
    DoctorSeenNotification();

  }, []);
  return (
    <SafeAreaView style={{ flex: 1, color: '#fff', backgroundColor: '#fff' }}>
      <Header title="Notification" navProps={props.navigation} />
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
        // style={{ marginTop: 20 }}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        {userrole === 'Patient'
          ? alldata.map((el, i) => (
            <View
              style={{
                marginTop: 10,
                backgroundColor: 'white',
                width: '90%',
                borderRadius: 15,
                elevation: 2,
                alignSelf: 'center',
                marginBottom: 10,
                borderColor: '#ddd', borderWidth: 1
              }}
            >
              {/* <Image
              source={{ uri: image }}
              style={{ width: 90, height: 90, borderRadius: 15 }}
              resizeMode={'cover'}
            /> */}
              <View
                style={{
                  //justifyContent: 'space-around',
                  // marginLeft: 5,
                  width: '95%',
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(13),
                    marginTop: 5,
                    padding: 7,
                    // textAlign: 'justify',
                    color: '#000',
                    width: '100%',
                    //  backgroundColor: 'red'
                  }}
                >
                  {el.msg}
                </Text>
              </View>
            </View>
          ))
          : dataall.map((el, i) => (
            <View
              style={{
                marginTop: 15,
                backgroundColor: 'white',
                width: '90%',
                borderRadius: 15,
                elevation: 2,
                alignSelf: 'center',
                marginBottom: 5,
              }}
            >
              {/* <Image
                source={{ uri: image }}
                style={{ width: 90, height: 90, borderRadius: 15 }}
                resizeMode={'cover'}
              /> */}
              <View
                style={{
                  //justifyContent: 'space-around',
                  // marginLeft: 5,
                  width: '100%',
                  // backgroundColor: 'red'
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(13),
                    marginTop: 5,
                    padding: 7,
                    //  textAlign: 'justify',
                    color: '#000',

                  }}
                >
                  {el.msg}
                </Text>
              </View>
            </View>
          ))}
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
    height: 30,
    width: 30,
    borderRadius: 10,
    marginTop: 10,
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  text: {
    marginLeft: 20,
    color: '#333333',
    fontWeight: 'bold',
    fontSize: 15,
    alignSelf: 'center',
  },
  img: {
    height: 40,
    width: 40,
    borderRadius: 10,
    marginLeft: 20,
    marginTop: 5,
  },
});
