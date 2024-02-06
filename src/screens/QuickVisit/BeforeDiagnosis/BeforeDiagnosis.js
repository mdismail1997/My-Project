import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import { DotIndicator } from 'react-native-indicators';
import moment from 'moment';
import CountDown from 'react-native-countdown-component';
import { RFValue } from 'react-native-responsive-fontsize';

const BeforeDiagnosis = (props) => {
  const totalSeconds = 10;
  //const name = props.route.params.reciever_name
  useEffect(() => {

    //let time = props.route.params.endTime

    let currentDate = moment().format('L');

    setTimeout(() => {
      props.route.params.symptomid.length === 0 ? alert('please') :
        props.navigation.replace('AddReport', {
          symptomid: props.route.params.symptomid,
          gender: props.route.params.gender,
          userid: props.route.params?.userid,
          mail: props.route.params.mail,
          birthyear: props.route.params.birthyear,
          name: props.route.params.name
        })

    }, 5000);
    //setSec(10)



    // let Seconds = Math.max(Math.floor((mil_time - Date.now()) / 1000), 0)
    // setSec(JSON.parse(Seconds))
    console.log(props.route.params);
  }, [props.route.params]);

  const [sec, setSec] = useState();

  const onTimerFinish = () => {
    props.route.params.symptomid.length === 0 ? alert('please') :
      props.navigation.replace('AddReport', {
        symptomid: props.route.params.symptomid,
        gender: props.route.params.gender,
        userid: props.route.params?.userid,
        mail: props.route.params.mail,
        birthyear: props.route.params.birthyear,
        name: props.route.params.name
      })
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <View style={{ marginTop: 30, flexDirection: "row", alignItems: "center", alignItems: "center" }}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}
          style={{ marginLeft: 30 }}>
          <Image
            source={require('../../../Assets/back.png')}
            resizeMode="contain"
            style={{ width: 20, height: 20, tintColor: '#2173A8' }}
          />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginLeft: 35, color: "#366e87" }}>Consultation</Text>
      </View> */}
      <View style={{ marginTop: '30%' }}>
        <View style={{ width: '100%', alignSelf: 'center', marginBottom: 45 }}>
          <Text
            style={{
              marginTop: '20%',
              width: '85%',
              alignSelf: 'center',
              color: '#2e5261',
              color: 'black',
              fontSize: 18,
              lineHeight: 24,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            {props.route.params.name}
            <Text style={{ color: '#708a88', fontSize: 18, lineHeight: 24 }}>
              {' '}
              Your diagnosis is in progress{' '}
            </Text>
          </Text>
          {/* < BallIndicator color='#2173A8' size={30} style={{marginTop: "10%",marginBottom: 15}}/> */}
        </View>
        <View style={{
          //backgroundColor:'green',
          height: '30%'
        }}>
          <Image
            source={require('../../../Assets/Loader.gif')}
            style={{
              width: '80%', height: '80%',
              //backgroundColor: 'red', 
              alignSelf: 'center', alignContent: 'center', marginTop: 20,
            }}
          />

        </View>


        {/* <CountDown
          until={totalSeconds}
          size={28}
          onFinish={onTimerFinish}
          digitStyle={{ backgroundColor: '#2173A8', marginTop: '19%' }}
          digitTxtStyle={{ color: '#fff' }}
          timeToShow={['S']}
          timeLabels={{}}
    />*/}
        {/* <Text
          style={{
            color: '#2173A8',
            marginBottom: 10,
            textAlign: 'center',
            marginTop: 40,
            fontSize: RFValue(18),
          }}
        >
          Please Wait
        </Text>*/}
        {/*<View style={{ width: '85%', alignSelf: 'center', marginTop: 15 }}>
          <DotIndicator color="#2173A8" size={10} />
      </View>*/}
      </View>
    </SafeAreaView>
  );
};

export default BeforeDiagnosis;

const styles = StyleSheet.create({})