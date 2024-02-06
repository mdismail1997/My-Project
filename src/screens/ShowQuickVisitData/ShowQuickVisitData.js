import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Linking,
} from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { supabase } from '../../supabase/supabaseClient';
import Icon from 'react-native-vector-icons/AntDesign';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const ShowQuickVisitData = (props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bllodp, setBloodp] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [image, SetImage] = useState('');
  const [slotstart, SetSlotstart] = useState('');
  const [end, Setend] = useState('');
  const [bookingid, SetBookingid] = useState('');
  const [problem, SetProblem] = useState('');
  const [alldata, setAlldata] = useState([]);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [loading, setLoding] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  //const autoendtimeref = useRef(null);
  const [labresult, setLabresult] = useState('');
  const [labresultimg, setLabresultimg] = useState([]);
  const [surgicalhistory, setSurgicalhistory] = useState('');
  const [surgicalhistoryimg, setSurgicalhistoryimg] = useState([]);
  const [medicalhistory, setMedicalhistory] = useState('');
  const [pName, setPname] = useState('')
  const [DName, setDName] = useState('');
  const [dimage, SetDImage] = useState('');
  const [pid, setPid] = useState('')
  const [did, setDid] = useState('')
  const [socialhistory, setSocialhistory] = useState('');
  //const [counter, setCounter] = useState(60);
  const [expanded, setExpanded] = useState({
    allergy: false,
    medicine: false,
    labresult: false,
    surgicalhistory: false,
    medicalhistory: false,
    socialhistory: false,
  });
  const [viewimage, SetViewImage] = useState('');
  const [isImgVisible, SetIsImgVisible] = useState(false);
  const scrollviewref = useRef();
  const handlePress = (value) => {
    setExpanded((prevData) => ({ ...prevData, [value]: !prevData[value] }));
    //  scrollviewref.current?.scrollToEnd({ animated: true, index: -1 }, 200);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    GetRequest();
    setRefreshing(false);
  };
  useEffect(() => {
    GetRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params.bookingid]);
  const sendNotification = async (item) => {
    const data = {
      booking_id: props.route.params.bookingid,
      doctor_id: did,
      patient_id: pid,
      time_zone: RNLocalize.getTimeZone(),
    };
    // console.warn('notification data=========', data);
    setLoding(true);
    await Apis.doctornotificationbeforestart(data)

      .then(async (response) => {
        console.warn('notification data=========', response.data);
        setLoding(false);

      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
      time_zone: RNLocalize.getTimeZone()
    };
    console.log('id---', data);
    setLoding(true);
    await Apis.quickvisitdatashow(data)

      .then((response) => {
        console.warn("ekhn ", response.data);
        setLoding(false);
        console.log(" -- > ", response.data.data);
        setAlldata(response.data.data);
        setName(response.data.data.patient_name);
        setPhone(response.data.data.phone);
        setAge(response.data.data.age);
        setDay(response.data.data.day);
        setEmail(response.data.data.email);
        setGender(response.data.data.patient_gender);
        setHeight(response.data.data.height);
        setWeight(response.data.data.weight);
        setBloodp(response.data.data.blood_gr);
        setBloodsugar(response.data.data.blood_suger_level);
        setPname(response.data.data.name);
        setType(response.data.data.consultation_type);
        SetImage(response.data.data.patient_image);
        setDate(response.data.data.date);
        SetSlotstart(response.data.data.slot_start);
        Setend(response.data.data.slot_end);
        SetProblem(response.data.data.problem);
        SetBookingid(response.data.data.booking_id);
        setAllergy(response.data.data.allergy);
        setMedicine(response.data.data.medication);
        setLabresult(response.data.data.lab_result);
        setSocialhistory(response.data.data.social_history);
        setDName(response.data.data.doctor_name);
        SetDImage(response.data.data.doctor_image);
        setPid(response.data.data.patient_id);
        setDid(response.data.data.doctor_id);
        // setLabresultimg(response.data.data.lab_result_images);
        setLabresultimg(
          response.data.data.lab_result_images[0]
            ? response.data.data.lab_result_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        //  setSurgicalhistoryimg(response.data.data.surgical_images);
        setSurgicalhistoryimg(
          response.data.data.surgical_images[0]
            ? response.data.data.surgical_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        // for (let i = 0; i <= surgicalhistoryimg.length; i++) {
        //   console.log(surgicalhistoryimg[i]);
        // }
        setSurgicalhistory(response.data.data.surgical_history);
        setMedicalhistory(response.data.data.medical_history);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  let getallergy = allergy.split(',');
  let getmedicine = medicine.split(',');
  let getlabresult = labresult.split(',');
  let getsurgicalhistory = surgicalhistory.split(',');
  let getmedicalhistory = medicalhistory.split(',');
  let getsocialhistory = socialhistory.split(',');
  console.log('alldata', props.route.params?.bookingid);
  // useEffect(() => {
  //   clearInterval(autoendtimeref.current);
  //   autoendtimeref.current = setInterval(() => {
  //     if (Date.now() >= end + 15000) {
  //       onCreateTriggerNotification();
  //       //props.navigation.navigate('Dashboard');
  //     }
  //   }, 5000);
  //   return () => {
  //     clearInterval(autoendtimeref.current);
  //   };
  // }, []);
  // const getdoctordata = async () => {
  //   const data = {
  //     booking_id: props.route.params?.bookingid,
  //   };

  //   setLoding(true);
  //   await Apis.bookingdetailspatient(data)

  //     .then(async (response) => {
  //       console.warn('doc data=========', response.data);
  //       setLoding(false);

  //       setDName(response.data.response.doctor);

  //       SetDImage(response.data.response.doctor_image);
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //       setLoding(false);
  //     });
  // };

  // useEffect(() => {
  //   getdoctordata();
  // }, [props.route.params.bookingid]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Details" navProps={props.navigation} />
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
          // ref={(refff) => {
          //   scrollviewref.current = refff;
          // }}
          />
        }
      >
        <View style={styles.checkborder}>
          <Image style={styles.img} source={{ uri: image }} />
          <View style={{ flexDirection: "column", justifyContent: "space-around", marginLeft: "3.5%", width: "65%", }}>


            <Text
              style={{
                color: '#333333',
                paddingTop: 10,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              {name}

            </Text>
            <Text style={{ color: '#333333', paddingVertical: 10 }}>
              {date}
            </Text>
            <Text
              style={{
                color: '#333333',

                paddingBottom: 10
              }}
            >
              {day}, {slotstart}{" "}-{" "}{end}
            </Text>
          </View>
          {/* <View>
            <Image
              style={{
                width: 40,
                height: 42,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                marginTop: -67,
                marginRight: 20,
              }}
              source={require('../../Assets/chatbox.png')}
            />
          </View> */}

          <View style={{ alignItems: "center", justifyContent: "center" }}>
            {type === 'Chat' ? (
              <Image
                style={{
                  width: 40,
                  height: 42,
                  resizeMode: 'contain',
                  // alignSelf: 'flex-end',
                  // marginTop: -67,

                }}
                source={require('../../Assets/chatbox.png')}
              />
            ) : type === 'Audio' ? (
              <Image
                style={{
                  width: 40,
                  height: 42,
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/voicecall.png')}
              />
            ) : (
              <Image
                style={{
                  width: 40,
                  height: 42,
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/videocall.png')}
              />
            )}
          </View>
        </View>
        {/* 
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Problems facing
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
          }}
        >
          {problem}
        </Text> */}
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Visit Time
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {day}, {slotstart}-{end}
        </Text>
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
            {name}
          </Text>
        </View>
        {/* <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            {age} (Years)
          </Text>
        </View> */}
        {/* 
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            {phone}
          </Text>
        </View> */}
        {/* 
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Email Id
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
              textAlign: 'justify',
            }}
          >
            {email}
          </Text>
        </View> */}
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Gender
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
            {gender}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Height
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
            {height}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Weight
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
            {weight}
          </Text>
        </View>

        {/* <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Blood Group
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
            {bllodp}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Blood sugar
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
            {bloodsugar}
          </Text>
        </View> */}
        {/* 
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Allergy
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
            {allergy}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Medicine
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
            {medicine}
          </Text>
        </View> */}

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
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
            Type
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
            {type}
          </Text>
        </View>
        <List.Accordion
          title={`Allergy (${getallergy == '' || getallergy == 'None' ? 0 : getallergy.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.allergy}
          onPress={() => {
            handlePress('allergy');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          {getallergy.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Medicine (${getmedicine == '' || getmedicine == 'None' ? 0 : getmedicine.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicine}
          onPress={() => {
            handlePress('medicine');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          {getmedicine.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Social History (${getsocialhistory == '' || getsocialhistory == 'None' ? 0 : getsocialhistory.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.socialhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('socialhistory');
          }}
          style={{ backgroundColor: '#f5faf9', height: 50 }}
        >
          {getsocialhistory.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Lab Result (${getlabresult == '' || getlabresult == 'None' ? 0 : getlabresult.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.labresult}
          onPress={() => {
            handlePress('labresult');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          {getlabresult.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>

        <List.Accordion
          title={`Surgical History (${getsurgicalhistory == '' || getsurgicalhistory == 'None' ? 0 : getsurgicalhistory.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.surgicalhistory}
          onPress={() => {
            handlePress('surgicalhistory');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          {getsurgicalhistory.map((el) => (
            <List.Item
              title={el}
              titleStyle={{ color: '#000' }}
            //  right={(props) => <List.Icon {...props} icon="pill" />}
            />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Surgical History Image (${surgicalhistoryimg.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          // expanded={expanded.surgicalhistory}
          onPress={() => {
            handlePress('surgicalhistoryimg');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              flexWrap: 'wrap'

            }}
          >
            {surgicalhistoryimg.map((el, i) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(surgicalhistoryimg[i]);
                  Linking.openURL(el.name);
                }}
              >
                {/* // <Icon name="addfile" size={18} color="#2173A8" /> */}
                {el.name?.split('.').pop() === 'pdf' ? (
                  <Icon
                    name="addfile"
                    size={23}
                    color="#2173A8"
                    style={{ marginTop: 8, marginHorizontal: 5 }}
                  />
                ) : (
                  <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                      marginTop: 8,
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </List.Accordion>
        {/* <Title style={{ fontSize: 15, marginLeft: 25, marginTop: 10 }}>
              Surgical Image
            </Title>
            <View style={{ flexDirection: 'row', marginLeft: 20 }}>
              {surgicalhistoryimg.map((el, i) => (
                <TouchableOpacity
                  onPress={() => {
                    console.log(surgicalhistoryimg[i]);
                    Linking.openURL(el.name);
                  }}
                >
                  {/* // <Icon name="addfile" size={18} color="#2173A8" /> */}
        {/* <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                    }}
                  />
                </TouchableOpacity>
              ))}
            </View> */}
        <List.Accordion
          title={`Medical History (${getmedicalhistory == '' || getmedicalhistory == 'None' ? 0 : getmedicalhistory.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicalhistory}
          onPress={() => {
            handlePress('medicalhistory');
          }}
          theme={{ colors: { text: '#000' } }}
          // titleStyle={{ marginBottom: 40 }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          {getmedicalhistory.map((el) => (
            <List.Item
              title={el}
              titleStyle={{ color: '#000' }}
              onPress={() => { }}
            />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Lab Result Image (${labresultimg.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          // expanded={expanded.surgicalhistory}
          onPress={() => {
            handlePress('labresulimg');
          }}
          theme={{ colors: { text: '#000' } }}
          style={{ height: 50, backgroundColor: "#fff" }}
        >
          <View
            style={{ flexDirection: 'row', width: '90%', flexWrap: 'wrap' }}
          >
            {labresultimg.map((el, i) => (
              <TouchableOpacity
                onPress={() => {
                  console.log('kjgg==', labresultimg[i]);
                  Linking.openURL(el.name);
                }}
              >
                {/* <Icon name="addfile" size={20} color="#2173A8" /> */}
                {el.name?.split('.').pop() === 'pdf' ? (
                  <Icon
                    name="addfile"
                    size={23}
                    color="#2173A8"
                    style={{ marginTop: 8, marginHorizontal: 5 }}
                  />
                ) : (
                  <Image
                    source={{ uri: el.name }}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      marginHorizontal: 5,
                      marginTop: 5,
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </List.Accordion>
        {/* 
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
            onPress={async () => {
               props.navigation.navigate('PatientPrescription', {
                bookingid: bookingid,
              }) 
              /* const session = supabase.auth.session();
              if (session) {
              // const userid = await AsyncStorage.getItem('userid');
              // props.navigation.navigate('VideoCall', {
              //   booking_id: props.route.params?.bookingid,
              // });
              //   doctor_id: +userid,
              //   patient_id: alldata.patient_id,
              //   booking_id: alldata.booking_id,
              //   profile_Pic: image,
              //   endTime: new Date(`${date},${end}`).getTime(),
              // });
              // }
              if (type === 'Video') {
                props.navigation.navigate('VideoCall', {
                  booking_id: props.route.params?.bookingid,
                });
              } else if (type === 'Chat') {
                const userid = await AsyncStorage.getItem('userid');
                props.navigation.navigate('ChatMessage', {
                  doctor_id: +userid,
                  patient_id: alldata.patient_id,
                  booking_id: alldata.booking_id,
                  profile_Pic: image,
                  endTime: new Date(`${date},${end}`).getTime(),
                });
              }
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
            disabled={
              !(Date.now() >= new Date(`${date},${slotstart}`).getTime())
            }
          >
            Message Now(Start at){slotstart}
          </Button>
        </View> */}

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
              console.log(
                'kkkkk====>>>>>',
                new Date(`${date},${end}`).getTime()
              );
              sendNotification();
              let mil_time = new Date(
                `${date},${slotstart}`
              ).getTime();
              let Seconds = Math.max(
                Math.floor((mil_time - Date.now()) / 1000),
                0
              );
              // Seconds == 0
              //   ?
              const userid = await AsyncStorage.getItem('userid');
              props.navigation.navigate('BeforeConsult', {
                endDate: date,
                endTime: end,
                seconds: JSON.parse(Seconds),
                booking_id: props.route.params?.bookingid,
                endtime: new Date(`${date},${end}`).getTime(),
                // not sure, data of "patient_id", "pname", "pimage" is correct please check from AddMode.js 
                patient_id: pid,
                pname: name,
                pimage: image,
                type: type,
                doctor_id: did,
                // role: "doctor",
                sender_name: DName,
                sender_pic: dimage,
                reciever_name: name,
                sender_id: userid,
                reciever_id: props.route.params?.bookingid,
                booking_id: props.route.params?.bookingid,
                //    endTime: new Date(`${date},${end}`).getTime(),
                role: "doctor",
                //   // profile_Pic: el.profile_image,
                chat_id: props.route.params?.bookingid,
                dimage: dimage,
                dname: DName,
              })
              // if (type === 'Audio') {
              //   props.navigation.navigate('Voicecall', {
              //     booking_id: props.route.params?.bookingid,
              //     endTime: new Date(`${date},${end}`).getTime(),
              //     dimage: dimage,
              //     dname: DName,
              //   });
              // } else if (type === 'Chat') {
              //   const userid = await AsyncStorage.getItem('userid');
              //   props.navigation.navigate('ChatMessage', {
              //     reciever_Pic: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
              //     sender_name: DName,
              //     sender_pic: dimage,
              //     reciever_name: name,
              //     sender_id: userid,
              //     reciever_id: props.route.params?.bookingid,
              //     booking_id: props.route.params?.bookingid,
              //     endTime: new Date(`${date},${end}`).getTime(),
              //     role: "doctor",
              //     //   // profile_Pic: el.profile_image,
              //     chat_id: props.route.params?.bookingid,
              //     //  endTime: new Date(`${date},${endtime}`).getTime(),
              //   });
              //   console.log("reciever_Pic", "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png")
              //   console.log("sender_id", userid)
              //   console.log("chat_id", props.route.params?.bookingid)
              //   console.log("endTime", new Date(`${date},${end}`).getTime())
              //   console.log("reciever_name", name)
              //   console.log("sender_name", DName)
              //   console.log("sender_pic", dimage)
              //   console.log("booking_id", props.route.params?.bookingid)
              // } else {
              //   props.navigation.navigate('VideoCall', {
              //     booking_id: props.route.params?.bookingid,
              //     endTime: new Date(`${date},${end}`).getTime(),
              //     patient_id: pid,
              //   });
              // }
            }}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 15 }}
          // disabled={
          //   !(Date.now() >= new Date(`${date},${slotstart}`).getTime())
          // }
          >
            {type === 'Chat' ? (
              <Text
                style={{
                  textAlign: 'center',
                  lineHeight: 53,
                  color: '#FFFFFF',
                  fontWeight: '700',
                  fontSize: RFValue(17),
                  //  fontFamily: 'Rubik',
                  letterSpacing: 0.4,
                }}
              >
                Message Now (Start at {slotstart})
              </Text>
            ) : (
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
                Call now (Start at {slotstart})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    // justifyContent: 'space-between',
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
    flexDirection: "row",
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
  },

  img: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: 10,

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
