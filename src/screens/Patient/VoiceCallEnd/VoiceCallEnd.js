import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, Button } from 'react-native-paper';
import { Header4 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { SuccessfullySubmitModal } from '../../../components/Popupmessage';
export const VoiceCallEnd = (props) => {
  const [loading, setLoding] = useState(false);
  const [calltime, setCalltime] = useState('');
  const [doctorname, setDoctorname] = useState('');
  const [image, setImage] = useState('');
  const [bookingid, SetBookingid] = useState('');
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [modalmessage, SetModalmessage] = useState();
  const [doctorid, setDoctorid] = useState('');
  const [patientid, setPatientid] = useState('');
  const [type, setType] = useState('');
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  useEffect(() => {
    getdoctordata();
  }, [props.route.params?.booking_id]);

  const getdoctordata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.booking_id,
    };

    setLoding(true);
    await Apis.videocallend(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);
        // setAllData(response.data.response);
        setCalltime(response.data.response.call_time);
        setImage(response.data.response.doctor_image);
        setDoctorname(response.data.response.doctor_name);
        SetBookingid(response.data.response.id);
        setDoctorid(response.data.response.doctor_id);
        setPatientid(response.data.response.patient_id);
        setType(response.data.response.consultation_type);
        // setAbout(response.data.response.consultation_type);
        // SetImage(response.data.response.doctor_image);
        // setStarttime(response.data.response.slot_start);
        // setEndtime(response.data.response.slot_end);
        // setDate(response.data.response.date);
        // setDay(response.data.response.day);
        // setPatient(response.data.response.patient_name);
        // setAge(response.data.response.patient_age);
        // setPhone(response.data.response.patient_phone);
        // setFees(response.data.response.fee);
        // setDayNight(response.data.response.slot_end_p);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('ijjjj--', doctorid, patientid);
  const GetPrescription = async () => {
    try {
      setLoding(true);
      const token = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      if (userid) {
        const user_id = JSON.parse(userid);

        console.log('user id =====>>>>', user_id);
        console.log('token123=', token);
        const data = {
          booking_id: props.route.params?.booking_id,
        };
        console.log('id---', data);

        const response = await Apis.getprescription(data);
        console.warn(response.data);
        setLoding(false);

        if (response.data.prescription) {
          console.log('prescription------', response.data.prescription);
          return response.data.prescription;
        } else {
          console.log('message---', response.data);
          SetModalmessage(response.data.message);
          SetIsModalVisible(true);
        }
      } else {
        setLoding(false);
      }
      // if (response.data.prescription) {
      //   console.log('prescription------', response.data.prescription);
      //   return response.data.prescription;
      // } else {
      //   console.log('message---', response.data);
      //   SetModalmessage(response.data.message);
      //   SetIsModalVisible(true);
      // }
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView style={{ marginBottom: 20 }}>
        <View>
          {type === 'Video' ? (
            <Text
              style={{
                color: '#000',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 80,
                fontWeight: 'bold',
              }}
            >
              Video call Ended
            </Text>
          ) : (
            <Text
              style={{
                color: '#000',
                fontSize: 15,
                textAlign: 'center',
                marginTop: 80,
                fontWeight: 'bold',
              }}
            >
              Voice call Ended
            </Text>)}
          <Text
            style={{
              color: '#2173A8',
              fontSize: 15,
              textAlign: 'center',
              //marginTop: 10,
            }}
          >
            {calltime}
          </Text>
          {/* <Text style={{ color: '#737373', fontSize: 10, textAlign: 'center' }}>
            Recording has been saved in chat
          </Text> */}
        </View>
        <Image
          source={{ uri: image }}
          style={{
            borderRadius: 85,
            height: 150,
            width: 150,
            alignSelf: 'center',
            resizeMode: 'contain',
            borderColor: 'blue',
            borderWidth: 1,
            marginTop: 10,
          }}
        />
        <Text
          style={{
            color: '#000',
            fontSize: 18,
            textAlign: 'center',
            marginTop: 20,
            fontWeight: 'bold',
          }}
        >
          {doctorname}
        </Text>
        <View
          style={{
            marginHorizontal: 30,
            marginTop: 30,
            bottom: 10,
            borderRadius: 10,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() =>
              props.navigation.navigate('Review', {
                booking_id: bookingid,
                doctor_id: doctorid,
                patient_id: patientid,
              })
            }
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Write a Review
          </Button>
        </View>
        <View
          style={{
            marginHorizontal: 30,
            borderRadius: 5,
            borderColor: '#2173A8',
            borderWidth: 1,
            marginTop: 15,
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            uppercase={false}
            //  onPress={() => GetPrescription(bookingid)}
            onPress={async () => {
              const _prescription = await GetPrescription(bookingid);
              console.log('pres=====', _prescription);
              Linking.openURL(_prescription);
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#2173A8', fontSize: 18 }}
          >
            View Prescription
          </Button>
        </View>
      </ScrollView>
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
        message={modalmessage}
      />
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 15,
    height: 90,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
  },

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
