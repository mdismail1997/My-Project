import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
  Linking,
} from 'react-native';
import React, { useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import { Paragraph, Snackbar } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as RNLocalize from 'react-native-localize';
const DoctorChat = (props) => {
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [chipData, setChipData] = React.useState([]);
  const [loading, setLoding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [starttime, setStarttime] = React.useState('');
  const [endtime, setEndtime] = React.useState('');
  const [date, setDate] = React.useState('');
  const [day, setDay] = React.useState('');
  const [patientname, setPatient] = React.useState('');
  const [age, setAge] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [fees, setFees] = React.useState('');
  const [allData, setAllData] = React.useState();
  const [dayNight, setDayNight] = React.useState('am');
  const [favourite, SetFavourite] = React.useState(false);
  const [patientid, setPatientId] = React.useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
  const handlePress = (event, value) => {
    setSelectedValue(value);
    console.log(value);
  };
  const getdoctordata = async () => {
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.bookingdetailspatient(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);
        setLoding(false);
        setAllData(response.data.response);
        setName(response.data.response.doctor);
        setAbout(response.data.response.consultation_type);
        SetImage(response.data.response.patient_image);
        setStarttime(response.data.response.slot_start);
        setEndtime(response.data.response.slot_end);
        setDate(response.data.response.date);
        setDay(response.data.response.day);
        setPatient(response.data.response.patient_name);
        setAge(response.data.response.patient_age);
        setPhone(response.data.response.patient_phone);
        setFees(response.data.response.fee);
        setDayNight(response.data.response.slot_end_p);
        setPatientId(response.data.response.patient_id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
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
          booking_id: props.route.params?.bookingid,
        };
        console.log('id---', data);

        const response = await Apis.getprescription(data);
        console.warn(response.data);
        setLoding(false);
        return response.data.prescription;
      } else {
        setLoding(false);
      }
    } catch (error) {
      setLoding(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getdoctordata();
    CheckFavourite();
  }, [props.route.params?.bookingid, patientid]);
  const AddFavourite = async () => {
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    const data = {
      doctor_id: user_id,
      patient_id: patientid,
    };
    console.log(data);
    setLoding(true);
    await Apis.addpatientfauvarite(data)

      .then((response) => {
        console.warn(response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
          setError((data) => ({
            ...data,
            iserror: true,
            message: response.data.message,
          }));
          setErr(() => ({

            iserr: false

          }));
        } else {
          SetFavourite(false);
          setErr((data) => ({
            ...data,
            iserr: true,
            message: response.data.message,
          }));
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const CheckFavourite = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: user_id,
      patient_id: patientid,
    };
    console.log(data);
    setLoding(true);
    await Apis.checkpatientfauvarite(data)

      .then((response) => {
        console.warn('kkkkoo', response.data);
        if (response.data.success === '1') {
          SetFavourite(true);
        } else {
          SetFavourite(false);
        }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
  console.log('select----', favourite);
  const renderData = ({ item }) => {
    return (
      <View style={{ marginTop: 10, marginLeft: '5%' }}>
        <View
          style={{
            height: 30,
            width: 95,
            borderColor: '#dce7e8',
            borderRadius: 12,
            backgroundColor: 'white',
            elevation: 1,
            justifyContent: 'center',
            borderWidth: 0.5,
          }}
        >
          <Text style={{ alignSelf: 'center', fontSize: 11, color: '#2173A8' }}>
            {item.title}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={patientname} navProps={props.navigation} />
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
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'white', height: HEIGHT, width: WIDTH }}
      >
        <View
          style={{
            marginTop: 10,
            backgroundColor: 'white',
            borderRadius: 15,
            flexDirection: 'row',
            alignSelf: 'center'
            // elevation: 5,
          }}
        >

          <Image
            source={{ uri: image }}
            style={{ width: '22%', height: 100, borderRadius: 15, margin: 10, }}
            resizeMode={'contain'}
          />
          {/* <View
              style={{
                justifyContent: 'space-between',
                marginLeft: 5,
             //   alignItems:'center',
                flexDirection: 'row',
                //backgroundColor:'#000'
              }}
            >  */}
          {/* <Text
              style={{
                fontSize: RFValue(15),
                marginTop: 20,
                // fontWeight: 'bold',
                fontWeight: '500',
                color: '#000',
                width: '60%',
                //  backgroundColor: 'pink',
                padding: 5,

              }}
            >
              {' '}
              {name}
            </Text> */}
          <TouchableOpacity
            onPress={() => AddFavourite()}
            style={{ marginTop: 20, position: 'relative', left: 80 }}
          >
            {favourite ? (
              <AntDesign
                name="heart"
                size={30}
                color="#2173A8"
                style={{

                  // backgroundColor:'red'
                  //zIndex: 9999,
                }}
              />
            ) : (
              <AntDesign
                name="hearto"
                size={30}
                color="#2173A8"
                style={{
                  //  position: 'absolute',
                  // zIndex: 9999,
                }}
              />
            )}
          </TouchableOpacity>
          {/* </View>  */}
          {/* <View style={{ justifyContent: 'space-around', width: "62%", marginRight: "2.5%" }}>
              <Text style={{ fontSize: 13, marginTop: 5, color: '#000', marginLeft: 10 }}>
                {patientname}

              </Text>
              <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: "#000", fontSize: 14, marginLeft: 10 }}>
                  {about}
                </Text>

                <Text
                  style={{
                    color: 'blue',
                    fontSize: 14
                  }}
                >
                  {' '}-{' '}Schedule
                </Text>

              </View>
              <Text style={{ fontSize: 11, color: '#000', marginLeft: 10 }}>
                {starttime}{' '}-{' '}{endtime}
              </Text>
            </View> */}
          {/* <TouchableOpacity
              onPress={() => AddFavourite()}
              style={{ alignItems: "center", justifyContent: "center" }}
            >
              {favourite ? (
                <AntDesign
                  name="heart"
                  size={30}
                  color="#2173A8"
                // style={{
                //   position: 'absolute',
                //   right: 10,
                //   top: 3,
                // }}
                />
              ) : (
                <AntDesign
                  name="hearto"
                  size={30}
                  color="#2173A8"
                // style={{
                //   position: 'absolute',
                //   right: 10,
                //   top: 3,
                // }}
                />
              )}
            </TouchableOpacity> */}
          {/* <Image
              source={require('../../Assets/heart2.png')}
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                right: 10,
                top: 3,
              }}
              resizeMode={'contain'}
            /> */}
        </View>

        <View style={{ marginTop: 15, marginRight: '5%' }}>
          <Text
            style={{
              color: 'black',
              marginLeft: '5%',
              fontWeight: 'bold',
              marginBottom: 10,
            }}
          >
            Visit Time
          </Text>
          {/* <View style={{marginTop:10,marginLeft:"5%"}}>
      <View style={{height:40,width:120,borderColor:"#dce7e8",borderRadius:12,backgroundColor:"white",elevation:10,justifyContent:"center",borderWidth:0.5}}>
        <Text style={{alignSelf:"center",fontSize:11}}>Oral surgary</Text>
      </View>
    </View> */}
          {/* <FlatList
            data={skillData}
            renderItem={renderData}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsHorizontalScrollIndicator={false}
          />*/}
          <Text
            style={{
              marginLeft: '10%',
              color: '#000',
            }}
          >
            {date}
          </Text>
          <Text
            style={{
              marginLeft: '10%',
              color: '#000',
              marginTop: 5
            }}
          >
            {day}, {starttime} - {endtime}
          </Text>
          <Text
            style={{
              marginLeft: '10%',
              color: '#000',
              marginTop: 5
            }}
          >
            {about}<Text
              style={{
                fontSize: 14
              }}
            >
              {' '}:{' '}Schedule
            </Text>
          </Text>
        </View>
        {/*<View style={{ marginTop: 20, marginLeft: '5%' }}>
          <Text style={{ color: 'black', fontSize: 14, fontWeight: 'bold' }}>
            Working Time
          </Text>

          <Text style={{ color: '#616a6b', fontSize: 12, marginTop: 10 }}>
            Mon-Fri 09:00 AM-02:00 PM
          </Text>
        </View>*/}
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Patient Information
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '6%',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Name
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {patientname}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '6%',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Age
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {age}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '6%',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Phone No.
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            +1 {phone}
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginLeft: '6%',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Fees
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            $ {fees}
          </Text>
        </View> */}
        {/* {about === 'Chat' ? (
          <View
            style={{
              marginTop: 20,
              width: '85%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 30,
              backgroundColor: '#2173A8',
            }}
            activeOpacity={0.7}
          >
            <TouchableOpacity
              onPress={async () => {
                const userid = await AsyncStorage.getItem('userid');
                props.navigation.navigate('ChatMessage', {
                  doctor_id: +userid,
                  patient_id: allData.patient_id,
                  booking_id: props.route.params?.bookingid,
                  profile_Pic: patientname,
                  endTime: new Date(`${date},${endtime}`).getTime(),
                });
              }}
              disabled={
                !(Date.now() >= new Date(`${date},${starttime}`).getTime())
              }
            >
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                View Chat
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              marginTop: 20,
              width: '85%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 30,
              backgroundColor: '#2173A8',
            }}
            activeOpacity={0.7}
          >
            <TouchableOpacity
            // onPress={async () => {
            //   const userid = await AsyncStorage.getItem('userid');
            //   props.navigation.navigate('ChatMessage', {
            //     doctor_id: +userid,
            //     patient_id: allData.patient_id,
            //     booking_id: props.route.params?.bookingid,
            //     profile_Pic: patientname,
            //     endTime: new Date(`${date},${endtime}`).getTime(),
            //   });
            // }}
            // disabled={
            //   !(Date.now() >= new Date(`${date},${starttime}`).getTime())
            // }
            >
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: 18,
                  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                View Call History
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View
          style={{
            marginTop: -10,
            width: '85%',
            height: 55,
            // change BorderColor
            borderColor: '#fff',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 30,
            backgroundColor: '#2173A8',
          }}
          activeOpacity={0.7}
        >
          <TouchableOpacity
            onPress={async () => {
              const userid = await AsyncStorage.getItem('userid');
              props.navigation.navigate('PatientPrescription', {
                doctor_id: +userid,
                patient_id: allData.patient_id,
                bookingid: props.route.params?.bookingid,
                profile_Pic: patientname,
                endTime: new Date(`${date},${endtime}`).getTime(),
              });
            }}
            disabled={
              !(Date.now() >= new Date(`${date},${starttime}`).getTime())
            }
          >
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 53,
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: 18,
                fontFamily: 'Rubik',
                letterSpacing: 0.4,
              }}
            >
              Generate Prescription
            </Text>
          </TouchableOpacity>
        </View> */}
      </ScrollView>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: 'green',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {error.message}
      </Snackbar>
      <Snackbar
        visible={err.iserr}
        onDismiss={onDismissSnackBar}
        style={{
          backgroundColor: '#d15656',
          bottom: 20,
          // zIndex: 10,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {err.message}
      </Snackbar>
    </SafeAreaView>
  );
};

export default DoctorChat;
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 20,

    maxWidth: 800,
    flexDirection: 'row',
    marginTop: 20,
  },
});
