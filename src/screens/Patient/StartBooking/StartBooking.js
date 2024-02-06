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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Selector from '../../../components/MakeAppointment';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import { Button, Paragraph } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import RadioSelector from '../../../components/Chip';
import DropDownPicker from 'react-native-dropdown-picker';
import { Thanku } from '../../../components/Popupmessage/Thanku';
import * as RNLocalize from 'react-native-localize';

const Booking = (props) => {
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [chipData, setChipData] = React.useState([]);
  const [amData, setAmData] = React.useState([]);
  const [name, setName] = React.useState('');
  const [about, setAbout] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [speciality, SetSpeciality] = React.useState('');
  const [alldata, setAlldata] = useState([]);
  const [mes, setMes] = useState(true);
  const [call, setCall] = useState(false);
  const [video, setVideo] = useState(false);
  const [isModalVisible, SetIsModalVisible] = useState(false);
  const [am, setAm] = React.useState(true);
  const [pm, setPm] = React.useState(false);
  const [communicationtype, setCommunicationtype] = useState('Chat');
  const [issubmit, SetIsSubmit] = useState(false);
  const [userrole, setUserRole] = useState('');
  const [bookingid, setBokkigid] = React.useState('');
  const [paymentstatus, setPaymentStatus] = React.useState('');
  const [index, setIndex] = React.useState();
  const [item, setItem] = React.useState('');
  const [typevalue, setTypeValue] = React.useState([]);
  const handlePress = (event, value) => {
    setSelectedValue(value);
    //console.log('selectted==', value);
  };

  const messageSelected = () => {
    setMes(true), setCall(false), setVideo(false);
    setCommunicationtype('Chat');
  };
  const callSelected = () => {
    setMes(false), setCall(true), setVideo(false);
    setCommunicationtype('Audio');
  };
  const videoSelected = () => {
    setMes(false), setCall(false), setVideo(true);
    setCommunicationtype('Video');
  };

  const [loading, setLoding] = useState(false);
  const [videofees, setVideofees] = useState();
  const [audiofees, SetAudiofees] = useState();
  const [chatfees, SetChatfees] = useState();
  const [error, setError] = React.useState({ iserror: false, message: '' });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState();

  useEffect(() => {
    GetFees();
    GetPaymentStatus()
  }, [props.route.params?.id]);
  const GetFees = async (values) => {
    setLoding(true);
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      //console.log('user id =====>>>>', user_id);
      //console.log('token123=', token);

      const Fees = {
        user_id: props.route.params?.id,
      };
      //console.log('Fees----------', Fees);
      const response = await Apis.getfees(Fees);
      setLoding(false);
      //console.log(response.data);
      SetChatfees(response.data.response?.fee_chat);
      setVideofees(response.data.response?.fee_video);
      SetAudiofees(response.data.response?.fee_audio);
      //console.log('uid==', response.data.user_id);
    } catch (err) {
      console.error(err);
      setLoding(false);
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: err.response,
      }));
    }
  };
  const GetPaymentStatus = async () => {
    setLoding(true);
    try {

      const response = await Apis.Paymentstatus();
      setLoding(false);
      //console.log(response.data);
      setPaymentStatus(response.data.response.status);
    } catch (err) {
      console.error(err);
      setLoding(false);
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: err.response,
      }));
    }
  };
  const getdoctordata = async () => {
    const data = {
      doctor_id: props.route.params?.id,
    };

    setLoding(true);
    await Apis.doctorprofile(data)

      .then(async (response) => {
        //console.warn('doc data=========', response.data);
        setLoding(false);
        setName(response.data.response.name);
        setAbout(response.data.response.about);
        SetSpeciality(response.data.response.speciality);
        SetImage(response.data.response.profile_image);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  useEffect(() => {
    console.log('oooo====>>>', props.route.params?.type);
    getdoctordata();
    peravability();
    getavailability();
    getavailabilityam();

  }, [props.route.params?.id, props.route.params?.bookingslotid, props.route.params?.type]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdoctordata();
      peravability();
      getavailability();
      getavailabilityam();

      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.route.params?.id, props.route.params?.bookingslotid, props.route.params?.type]);
  //console.log('type===', typevalue)

  const peravability = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', props.route.params?.id);
    //console.log('token123=', token);
    const data = {
      doc_id: props.route.params?.id,
    };

    setLoding(true);
    await Apis.perdoctorspeciality(data)

      .then((response) => {
        //console.warn(response.data);
        setLoding(false);
        setItems(response.data.response);
        setValue(response.data.response[0].id);
      })
      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const getavailability = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', user_id);
    //console.log('token123=', token);
    const data = {
      avl_id: props.route.params?.bookingslotid,
      time_zone: RNLocalize.getTimeZone(),
    };
    //console.log('avlid====', data);
    setLoding(true);
    await Apis.availabilitypm(data)

      .then((response) => {
        //console.warn(response.data.response);
        setChipData(response.data.response);
        // const newArr = arr.flatMap((el) => el);
        // console.log('status----', newArr);

        setLoding(false);
        // setChipData(arr);
      })

      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  const getavailabilityam = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', user_id);
    //console.log('token123=', token);
    const data = {
      avl_id: props.route.params?.bookingslotid,
      time_zone: RNLocalize.getTimeZone(),
    };
    //console.log('avlid====', data);
    setLoding(true);
    await Apis.availabilityam(data)

      .then((response) => {
        //console.warn(response.data.response);
        setAmData(response.data.response);
        // const newArr = arr.flatMap((el) => el);
        // console.log('status----', newArr);

        setLoding(false);
        // setChipData(arr);
      })

      .catch((error) => {
        console.error(error);
        setLoding(false);
      });
  };
  // console.log('chip---', chipData);

  const getavailabilitydetails = async () => {
    SetIsSubmit(true);
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    //console.log('user id =====>>>>', props.route.params?.id);
    // console.log('token123=', token);
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
      // spl_id: value,
      spl_id: 1,
      date: props.route.params?.bookingdate,
      slot_start: pm
        ? chipData[selectedValue].slot_start_time
        : amData[selectedValue].slot_start_time,
      slot_end: pm
        ? chipData[selectedValue].slot_end_time
        : amData[selectedValue].slot_end_time,
      consultation_type: item,
      time_zone: RNLocalize.getTimeZone(),
    };
    //console.log('data--------', data);
    setLoding(true);
    await Apis.appointmentbooking(data)

      .then((response) => {
        //console.warn(response.data);
        // console.log('bid---->', response.data.booking_id);
        //console.log('bookingdata==', response.data)
        setBokkigid(response.data.booking_id);
        setLoding(false);
        // SetIsModalVisible(true);
        SetIsSubmit(false);
        if (paymentstatus === "disable") { SetIsModalVisible(true); }
        else {
          props.navigation.navigate('AccountDetails',
            {
              price: response.data.fee,
              booking_id: response.data.booking_id,
              id: props.route.params?.id,
              type: item,
              date: response.data.booking_date,
              time: response.data.booking_time,
              img: response.data.doctor_image,
              doctorname: response.data.doctor_name,

            }
          );
        }
        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };

  const SendNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    // console.log('user id =====>>>>', props.route.params?.id);
    //console.log('token123=', token);
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
      booking_id: bookingid,
      time_zone: RNLocalize.getTimeZone()
    };
    // console.log('data--------', data);
    setLoding(true);
    await Apis.notificationdoctor(data)

      .then((response) => {
        //console.warn(response.data);

        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        SetIsSubmit(false);
      });
  };
  const SendPatientNotification = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    // console.log('user id =====>>>>', props.route.params?.id);
    // console.log('token123=', token);
    const data = {
      doctor_id: props.route.params?.id,
      patient_id: user_id,
      booking_id: bookingid,
      time_zone: RNLocalize.getTimeZone()
    };
    //  console.log('data--------', data);
    setLoding(true);
    await Apis.notificationpatient(data)

      .then((response) => {
        //console.warn(response.data);

        // props.navigation.navigate('Appointment');
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
        // SetIsSubmit(false);
      });
  };
  const handleClose = async () => {
    let role = await AsyncStorage.getItem('role');
    setUserRole(role);
    SetIsModalVisible(false);
    // if (userrole === 'Patient') {
    //   SendPatientNotification();
    // } else {
    //   SendNotification();
    // }
    SendNotification();
    SendPatientNotification();
    props.navigation.navigate('PatientTabNavigator');
  };

  useEffect(() => {
    getTimeFun()

    const unsubscribe = props.navigation.addListener('focus', () => {
      getTimeFun()
    });
    return unsubscribe;
  }, [])


  const getTimeFun = () => {
    const currentTime = new Date().toLocaleTimeString().split(' ')[1]
    console.log("====RNLocalize===", currentTime)
    if (currentTime == 'PM') {
      setPm(true), setAm(false);
    }
    else {
      setPm(false), setAm(true);
    }
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={name} navProps={props.navigation} />
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
      >
        {/* <View>
          <DropDownPicker
            open={open}
            items={items}
            value={value}
            schema={{ label: 'name', value: 'id' }}
            setOpen={setOpen}
            placeholder="Consulting for :"
            setItems={setItems}
            setValue={setValue}
            // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
            labelStyle={{
              width: '44%',
            }}
            containerStyle={{
              marginHorizontal: '8%',
              marginBottom: 8,

              width: '84%',
            }}
          />
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-around',
          }}
        >
          <View
            style={{
              marginTop: 30,
              bottom: 20,
              width: '40%',
              borderRadius: 5,
              marginLeft: 20,
              borderColor: '#2173A8',
              borderWidth: 1,
            }}
          >
            <Button
              mode="contained"
              color={am ? '#2173A8' : '#fff'}
              uppercase={false}
              onPress={() => {
                setPm(false), setAm(true);
              }}
              contentStyle={{ paddingVertical: 5 }}
              labelStyle={am ? styles.selecttext : styles.selectnottext}
              icon="svg"
            >
              AM
            </Button>
          </View>
          <View
            style={{
              marginTop: 30,
              borderColor: '#2173A8',
              borderWidth: 1,
              bottom: 20,
              width: '40%',
              borderRadius: 5,
              marginRight: 20,
            }}
          >
            <Button
              mode="contained"
              color={pm ? '#2173A8' : '#fff'}
              uppercase={false}
              // onPress={() => props.navigation.navigate('CompletedList')}
              onPress={() => {
                setPm(true), setAm(false);
              }}
              contentStyle={{ paddingVertical: 5 }}
              labelStyle={pm ? styles.selecttext : styles.selectnottext}
              icon="lightbulb-on"
            // size={50}
            >
              PM
            </Button>
          </View>
        </View>
        <View style={styles.app}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            showsHorizontalScrollIndicator={false}
          >
            {/* {amData.length > 0 && <Text>No Slot Available</Text>} */}

            {pm === true && am === false ? (
              chipData.length < 1 ? (
                <Text style={{ color: '#000' }}>No Slot Available</Text>
              ) : (
                chipData.map((el, i) => (
                  <RadioSelector
                    key={i}
                    title={el.slot_start_time}
                    value={i}
                    onPress={handlePress}
                    selected={selectedValue}
                    disabled={el.status === 'Booked'}
                  // style={{ width: '10' }}
                  />
                ))
              )
            ) : amData.length < 1 ? (
              <Text style={{ color: '#000' }}>No Slot Available</Text>
            ) : (
              amData.map((el, i) => (
                <RadioSelector
                  key={i}
                  title={el.slot_start_time}
                  value={i}
                  onPress={handlePress}
                  selected={selectedValue}
                  disabled={el.status === 'Booked'}
                // style={{ width: '10' }}
                />
              ))
            )}
          </ScrollView>
        </View>
        {props.route.params.type.map((item, i) => {
          return (
            <TouchableOpacity key={i}

              style={i === index ? styles.selected : styles.notSelected}
              onPress={() => {
                setIndex(i);
                setItem(item)
                console.log('item===', item)


              }}
            >
              <View style={i === index ? styles.selectedImage : styles.notSelectedImage}>
                {item === 'Chat' ?
                  <Image
                    source={require('../../../Assets/chat.png')}
                    style={{
                      height: 30,
                      width: 30,
                      resizeMode: 'contain',
                    }} />
                  :
                  item === 'Video' ?
                    <Image
                      source={require('../../../Assets/vvideo.png')}
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                      }} />
                    :
                    <Image
                      source={require('../../../Assets/vcall.png')}
                      style={{
                        height: 30,
                        width: 30,
                        resizeMode: 'contain',
                      }}
                    />
                }

              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '75%',
                }}
              >
                <View style={{ marginLeft: 5, flexDirection: 'column' }}>
                  <Text
                    style={i === index ? styles.selectedText1 : styles.notSelectedText1}
                  >
                    {item}
                  </Text>
                  <Text
                    style={i === index ? styles.selectedText2 : styles.notSelectedText2}
                  >
                    {item === 'Video' ? "Can video call with doctor " : item === 'Chat' ? "Can Message with doctor" : "Can voice call with doctor"}
                  </Text>
                </View>
                {/* <Text style={i === index ? styles.selectedPrice : styles.notselectedPrice}>
                  $  {item === 'Video' ? videofees : item === 'Chat' ? chatfees : audiofees}
                </Text> */}
              </View>
            </TouchableOpacity>
          );
        })}
        {/* <TouchableOpacity
          style={call ? styles.selected : styles.notSelected}
          onPress={callSelected}
        >
          <View style={call ? styles.selectedImage : styles.notSelectedImage}>
            <Image
              source={require('../../../Assets/vcall.png')}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '75%',
            }}
          >
            <View style={{ marginLeft: 5, flexDirection: 'column' }}>
              <Text
                style={call ? styles.selectedText1 : styles.notSelectedText1}
              >
                Voice Call
              </Text>
              <Text
                style={call ? styles.selectedText2 : styles.notSelectedText2}
              >
                Can voice call with doctor
              </Text>
            </View>
            <Text style={call ? styles.selectedPrice : styles.notselectedPrice}>
              $ {audiofees}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={video ? styles.selected : styles.notSelected}
          onPress={videoSelected}
        >
          <View style={video ? styles.selectedImage : styles.notSelectedImage}>
            <Image
              source={require('../../../Assets/vvideo.png')}
              style={{
                height: 30,
                width: 30,
                resizeMode: 'contain',
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '75%',
            }}
          >
            <View style={{ marginLeft: 5, flexDirection: 'column' }}>
              <Text
                style={video ? styles.selectedText1 : styles.notSelectedText1}
              >
                Video Call
              </Text>
              <Text
                style={video ? styles.selectedText2 : styles.notSelectedText2}
              >
                Can video call with doctor
              </Text>
            </View>
            <Text
              style={video ? styles.selectedPrice : styles.notselectedPrice}
            >
              $ {videofees}
            </Text>
          </View>
        </TouchableOpacity> */}

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
            onPress={() => {
              //console.log('lllll', chipData);
              selectedValue === '' ? Alert.alert('Alert', 'Please select any time.') : item === '' ? Alert.alert('Alert', 'Please select any consultation type.') : getavailabilitydetails()
              // if (am) { amData.length === 0 ? alert('fffffffff') : getavailabilitydetails() }
              // else { chipData.length === 0 ? alert('pm') : getavailabilitydetails() }

              // amData.length === 0 ? alert('fffffffff') : chipData.length === 0 ? alert('pm') : getavailabilitydetails()

              // amData.length < 1 
              //   ? alert('No Slot Available')
              //   : getavailabilitydetails;
            }}
          //  disabled={issubmit}
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
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Thanku
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
      />
    </SafeAreaView>
  );
};

export default Booking;
const styles = StyleSheet.create({
  app: {
    marginLeft: 30,
    // flexDirection: 'row',
    marginTop: -10,
    // width: 260,
    flex: 1,
    justifyContent: 'space-between',
  },
  selected: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#2173A8',
    borderRadius: 15,
    flexDirection: 'row',
    elevation: 50,
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#ddd',
    borderWidth: 1
  },

  notSelected: {
    width: '85%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    flexDirection: 'row',
    // elevation: 50,
    alignItems: 'center',
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1
  },

  selectedImage: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    marginTop: 15,
    marginHorizontal: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'white',
  },

  notSelectedImage: {
    height: 45,
    width: 45,
    resizeMode: 'contain',
    marginTop: 15,
    marginHorizontal: 8,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(33, 115, 168, 0.1)',
  },

  selectedText1: { fontSize: 13, color: '#fff' },
  notSelectedText1: { fontSize: 13, color: '#333333' },

  selectedText2: { fontSize: 12, color: '#fff' },
  notSelectedText2: { fontSize: 12, color: '#737373' },

  selectedPrice: { fontSize: 15, color: '#fff', fontWeight: 'bold' },
  notselectedPrice: { fontSize: 15, color: '#2173A8', fontWeight: 'bold' },
  selecttext: { color: '#fff', fontSize: 13 },
  selectnottext: { color: '#2173A8', fontSize: 13 },
});
