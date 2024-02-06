import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import * as Apis from '../../Services/apis';
import * as RNLocalize from 'react-native-localize';
import { RFValue } from 'react-native-responsive-fontsize';
const BeforeConsult = (props) => {
  const totalSeconds = props.route.params.seconds;
  const name = props.route.params.reciever_name
  useEffect(() => {
    setSec(props.route.params.seconds)
    let time = props.route.params.endTime


    let currentDate = moment().format('L')

    // let Seconds = Math.max(Math.floor((mil_time - Date.now()) / 1000), 0)
    // setSec(JSON.parse(Seconds))
    console.log(props.route.params.endTime)

  }, [])

  const [sec, setSec] = useState()
  const sendNotification = async (item) => {
    const data = {
      booking_id: props.route.params?.booking_id,
      doctor_id: props.route.params?.doctor_id,
      patient_id: props.route.params?.patient_id,
      time_zone: RNLocalize.getTimeZone(),
    };
    console.warn('notification data=========', data);
    // setLoding(true);
    await Apis.patientnotificationbeforestart(data)

      .then(async (response) => {
        console.warn('notification data=========', response.data);
        //setLoding(false);

      })
      .catch((error) => {
        console.error(error.response.data);
        //setLoding(false);
      });
  };
  const onTimerFinish = () => {
    sendNotification()
    if (props.route.params.type === 'Audio') {
      console.log('iii===', props.route.params?.pname)
      props.navigation.replace('Voicecall', {
        booking_id: props.route.params?.booking_id,
        endtime: props.route.params?.endtime,
        // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
        patient_id: props.route.params?.userid,
        pname: props.route.params?.pname,
        pimage: props.route.params?.pimage,
        dimage: props.route.params?.dimage,
        dname: props.route.params?.dname,
      })
    }
    else if (props.route.params.type === 'Video') {
      props.navigation.replace('VideoCall', {
        booking_id: props.route.params?.booking_id,
        endtime: props.route.params?.endtime,
        // not sure, data of "patient_id" is correct please check from AddMode.js 
        patient_id: props.route.params?.userid,
      })
    }
    else {
      props.route.params.role === 'doctor' ?
        (console.log('uuuuuu', props.route.params?.endTime),
          props.navigation.replace('ChatMessage', {
            reciever_Pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
            sender_name: props.route.params?.sender_name,
            sender_pic: props.route.params?.sender_pic,
            reciever_name: props.route.params?.reciever_name,
            sender_id: props.route.params?.sender_id,
            reciever_id: props.route.params?.reciever_id,
            booking_id: props.route.params?.booking_id,
            endTime: new Date(`${props.route.params.endDate},${props.route.params.endTime}`).getTime(),
            role: "doctor",
            //   // profile_Pic: el.profile_image,
            chat_id: props.route.params?.chat_id,
            //  endTime: new Date(`${date},${endtime}`).getTime(),
          })) :
        props.navigation.replace('ChatMessage', {
          reciever_id: props.route.params.reciever_id,
          sender_id: props.route.params.sender_id,
          booking_id: props.route.params.booking_id,
          chat_id: props.route.params.chat_id,
          sender_name: "Chatbot Patient",
          reciever_name: props.route.params.reciever_name,
          reciever_Pic: props.route.params.reciever_Pic,
          sender_pic: props.route.params.sender_pic,
          endTime: new Date(`${props.route.params.endDate},${props.route.params.endTime}`).getTime(),
          role: "chatPat"
        })
    }




  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}
          style={{ marginLeft: 30 }}>
          <Image
            source={require('../../../Assets/back.png')}
            resizeMode="contain"
            style={{ width: 20, height: 20, tintColor: '#2173A8' }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginLeft: 35, color: "#366e87" }}>{props.route.params.type} consultation</Text>
      </View>
      {/* <View style={{width:"100%",flexDirection:"row",alignSelf:"center",marginTop:"20%",marginBottom:15,}}> */}
      {/* <Text style={{ marginTop: "35%", width: "85%", alignSelf: "center", marginBottom: 15, color: "#2e5261", fontSize: 18, lineHeight: 24, fontWeight: "bold", textAlign: "center" }}>{name} */}
      <Text style={{ marginTop: "35%", alignSelf: "center", color: "#708a88", fontSize: RFValue(18), lineHeight: 24 }}> Your consultation will begin in </Text>
      {/* </Text> */}

      {/* </View> */}
      <CountDown
        until={totalSeconds}
        size={28}
        onFinish={onTimerFinish}
        digitStyle={{ backgroundColor: '#FFF', marginTop: 30 }}
        digitTxtStyle={{ color: '#1CC625' }}
        timeToShow={['H', 'M', 'S']}

        timeLabels={{ h: "HH", m: 'MM', s: 'SS' }}
      />
      <Text style={{ color: "#2173A8", marginBottom: 10, textAlign: "center", marginTop: 55, fontSize: 15 }}>Please Wait</Text>
      <View style={{ width: "85%", alignSelf: "center", marginTop: 15 }}>

        <DotIndicator color='#2173A8' size={10} />
      </View>
    </SafeAreaView>
  );
};

export default BeforeConsult

const styles = StyleSheet.create({})