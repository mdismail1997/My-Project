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
import React, { useEffect, useState } from 'react';
import { Header } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import { List, Paragraph, Snackbar, Icon } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';
const PatientInformation = (props) => {
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;
  const [selectedValue, setSelectedValue] = React.useState('');
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [err, setErr] = React.useState({ iserr: false, message: '' });
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
  const [gender, setGender] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [favourite, SetFavourite] = React.useState(false);
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [labresult, setLabresult] = useState('');
  const [labresultimg, setLabresultimg] = useState([]);
  const [surgicalhistory, setSurgicalhistory] = useState('');
  const [surgicalhistoryimg, setSurgicalhistoryimg] = useState([]);
  const [medicalhistory, setMedicalhistory] = useState('');
  const [socialhistory, setSocialhistory] = useState('');
  const [counrtyname, setCountryname] = useState('');
  const [bloodgroup, setBloodgroup] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [expanded, setExpanded] = useState({
    allergy: false,
    medicine: false,
    labresult: false,
    surgicalhistory: false,
    medicalhistory: false,
    socialhistory: false,
  });
  // const handlePress = (event, value) => {
  //   setSelectedValue(value);
  //   console.log(value);
  // };
  const handlePress = (value) => {
    setExpanded((prevData) => ({ ...prevData, [value]: !prevData[value] }));
    //  scrollviewref.current?.scrollToEnd({ animated: true, index: -1 }, 200);
  };
  const getdoctordata = async () => {
    const data = {
      patient_id: props.route.params?.userid,
    };
    console.log(data);
    setLoding(true);
    await Apis.patientdata(data)

      .then(async (response) => {
        console.warn('doc data=========', response.data);

        setAllData(response.data.response);
        setName(response.data.response.name);
        setAbout(response.data.response.consultation_type);
        SetImage(response.data.response.profile_image);
        setGender(response.data.response.gender);
        setPatient(response.data.response.name);
        setAge(response.data.response.height);
        setPhone(response.data.response.phone);
        setWeight(response.data.response.weight);
        setAllergy(response.data.response.allergy);
        setMedicine(response.data.response.medication);
        setLabresult(response.data.response.lab_result);
        setSocialhistory(response.data.response.social_history);
        setCountryname(response.data.response.code)
        setBloodgroup(response.data.response.blood_gr)
        setBloodsugar(response.data.response.blood_suger_level)
        // setLabresultimg(response.data.data.lab_result_images);
        setLabresultimg(
          response.data.response.lab_result_images[0]
            ? response.data.response.lab_result_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        //  setSurgicalhistoryimg(response.data.data.surgical_images);
        setSurgicalhistoryimg(
          response.data.response.surgical_images[0]
            ? response.data.response.surgical_images.map((el, i) => ({
              name: el,
            }))
            : []
        );

        // for (let i = 0; i <= surgicalhistoryimg.length; i++) {
        //   console.log(surgicalhistoryimg[i]);
        // }
        setSurgicalhistory(response.data.response.surgical_history);
        setMedicalhistory(response.data.response.medical_history);
        setLoding(false);
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
  const AddFavourite = async () => {
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    const data = {
      doctor_id: user_id,
      patient_id: props.route.params?.userid,
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
  useEffect(() => {
    props.route.params?.userid, CheckFavourite();
  }, [props.route.params?.userid]);
  const CheckFavourite = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      doctor_id: user_id,
      patient_id: props.route.params?.userid,
    };

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

  console.log('select----', favourite);
  useEffect(() => {
    getdoctordata();
  }, [props.route.params?.userid]);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
    setErr((data) => ({ ...data, iserr: false, message: '' }));
  };
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
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'white', height: HEIGHT, width: WIDTH }}
      >
        <View
          style={{
            marginTop: 10,
            // backgroundColor: 'red',
            width: '85%',
            borderRadius: 15,
            //elevation: 5,
            alignSelf: 'center',
            // borderColor: '#000',
            // borderWidth: 1
          }}
        >
          {/* <TouchableOpacity
            style={{
              marginLeft: 10,

              borderRadius: 75,
              height: 130,
              width: 130,
alignSelf:'center',
              borderColor: '#000',
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => props.navigation.navigate('EditProfile')}
          >
            <Image
              style={{
                borderRadius: 70,
                height: 130,
                width: 130,
                alignSelf: 'center',
                // marginTop: -10,
              }}
              source={{ uri: image }}
            />

            <TouchableOpacity
              style={{
                height: 35,
                width: 35,
                borderRadius: 20,
                position: 'absolute',
                left: 100,
                top: 85,
              }}
              onPress={() => AddFavourite()}
            >
             {favourite ? (
                <AntDesign
                  name="heart"
                  size={30}
                  color="#000"
                  style={{
                    
                    // backgroundColor:'red'
                    //zIndex: 9999,
                  }}
                />
              ) : (
                <AntDesign
                  name="hearto"
                  size={30}
                  color="#000"
                  style={{
                 //  position: 'absolute',
                   // zIndex: 9999,
                  }}
                />
              )}
            </TouchableOpacity>
          </TouchableOpacity> */}
          <View style={{ flexDirection: 'row', width: '85%', }}>
            <Image
              source={{ uri: image }}
              style={{ width: '30%', height: 100, borderRadius: 15, margin: 10, }}
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
              style={{ marginTop: 20, marginLeft: 20 }}
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
          </View>

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
          >{patientname}
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
          >{weight}{weight != "NA" ? '  lbs' : null}
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
            {bloodgroup}
          </Text>
        </View> */}
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
            Blood Sugar
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
            {phone != "NA" ? counrtyname : null}{phone}
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
              marginLeft: 19,
            }}
          >{gender}
          </Text>
        </View>

        <List.Accordion
          title={`Allergy (${getallergy == '' || getallergy == 'None' ? 0 : getallergy.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.allergy}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('allergy');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getallergy.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Medication (${getmedicine == '' || getmedicine == 'None' ? 0 : getmedicine.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicine}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('medicine');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
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
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          {getsocialhistory.map((el) => (
            <List.Item title={el} titleStyle={{ color: '#000' }} />
          ))}
        </List.Accordion>
        <List.Accordion
          title={`Lab Result (${getlabresult == '' || getlabresult == 'None' ? 0 : getlabresult.length})`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.labresult}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('labresult');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
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
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('surgicalhistory');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
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
          title={`Surgical History Image (${surgicalhistoryimg == '' ? 0 : surgicalhistoryimg.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          // expanded={expanded.surgicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('surgicalhistoryimg');
          }}
          style={{ height: 50, backgroundColor: '#fff' }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '95%',
              flexWrap: 'wrap',
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
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      marginHorizontal: 5,
                      marginTop: 8,
                      borderColor: '#ddd', borderWidth: 1
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
          title={`Medical History (${getmedicalhistory == '' || getmedicalhistory == 'None' ? 0 : getmedicalhistory.length
            })`}
          left={(props) => <List.Icon {...props} icon="pill" />}
          expanded={expanded.medicalhistory}
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('medicalhistory');
          }}
          // titleStyle={{ marginBottom: 40 }}
          style={{ height: 50, backgroundColor: '#fff', color: '#000' }}
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
          theme={{ colors: { text: '#000' } }}
          onPress={() => {
            handlePress('labresulimg');
          }}
          style={{ height: 50, backgroundColor: '#fff', color: '#000' }}
        >
          <View
            style={{ flexDirection: 'row', width: '90%', flexWrap: 'wrap', paddingBottom: 20 }}
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
                      width: 40,
                      height: 40,
                      borderRadius: 25,
                      marginHorizontal: 5,
                      marginTop: 5,
                      borderColor: '#ddd', borderWidth: 1
                    }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </List.Accordion>
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

export default PatientInformation;
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 20,

    maxWidth: 800,
    flexDirection: 'row',
    marginTop: 20,
  },
});
