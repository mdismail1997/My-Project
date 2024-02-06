import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Modal,
  Dimensions,
  TouchableHighlight, TextInput,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Paragraph,
  Title,
  IconButton,
  HelperText,
  List,
} from 'react-native-paper';
import { Header2, Header4 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from '../../../components/React-Native-Multi-Select';
import { SuccessfullySubmitModal } from '../../../components/Popupmessage';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign';
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
export const PatientChart = (props) => {
  const scrollviewref = useRef();
  const [isendModalVisible, SetIsEndModalVisible] = useState(false);
  const [otherlab, setOtherlab] = useState('');
  const [loading, setLoding] = useState(false);
  const [route, setRoute] = useState();
  const [selectroute, setSelectRoute] = useState();
  const [selectmedicine, setSelectMedicine] = useState('');
  const [course, setCourse] = useState('');
  const [routeid, setRouteid] = useState([]);
  const [does, setDoes] = useState('');
  const [frequency, setFrequency] = useState('');
  const [brief, setBrief] = useState('');
  const [comment, setComment] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [editdatetime, setEditdatetime] = useState();
  //const [isModalVisible, SetIsModalVisible] = useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [image, SetImage] = useState('');
  const [slotstart, SetSlotstart] = useState('');
  const [end, Setend] = useState('');
  const [age, setAge] = useState('');
  const [prescription, SetPrescription] = useState('');
  const [problem, SetProblem] = useState('');
  const [modalmessage, SetModalmessage] = useState();
  const [value, setValue] = useState('');
  const [medvalue, setmedValue] = useState({});
  const [lab, setLab] = useState([]);
  const [addnote, setAddnote] = useState('');
  const [items, setItems] = useState([
    { label: 'ML', value: 'ML' },
    { label: 'MG', value: 'MG' },
  ]);
  const [order, setOrder] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isNoteVisible, SetIsNoteVisible] = useState(false);
  const automadalcloseref = useRef(null);
  const autoendtimeref = useRef(null);
  const [id, setId] = useState();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [heigh, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bllodp, setBloodp] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [type, setType] = useState('');
  // const [allergy, setAllergy] = useState('');
  // const [medication, setMedication] = useState('');
  const [labresult, setLabresult] = useState('');
  const [labresultimg, setLabresultimg] = useState([]);
  const [surgicalhistory, setSurgicalhistory] = useState('');
  const [surgicalhistoryimg, setSurgicalhistoryimg] = useState([]);
  const [medicalhistory, setMedicalhistory] = useState('');
  const [socialhistory, setSocialhistory] = useState('');
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
  const handlePress = (value) => {
    setExpanded((prevData) => ({ ...prevData, [value]: !prevData[value] }));
    scrollviewref.current?.scrollToEnd({ animated: true, index: -1 }, 200);
  };
  const Height = Dimensions.get('window').height;
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const showImg = () => {
    SetIsImgVisible(true);
  };

  const hideImg = () => {
    SetIsImgVisible(false);
  };

  const Close = () => {
    SetIsNoteVisible(false);
  };

  // const getmedicine = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   let token = usertoken;
  //   console.log('token123=', token);
  //   await Apis.getmedication(token)

  //     .then((response) => {
  //       console.log('medication======>', response.data.response);
  //       const med = response.data.response.reduce(
  //         (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
  //         {}
  //       );
  //       setmedValue(med);
  //       setMedicine(response.data.response);
  //     })

  //     .catch((error) => {
  //       console.error(error.response);
  //     });
  // };
  const getRoute = async () => {
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
    await Apis.getroute(data)

      .then((response) => {
        console.warn(response.data);

        setRoute(response.data.response);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const getPrescriptiondetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    setLoding(true);
    await Apis.prescriptindetails(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAlldata(response.data.response);

        console.log('alldata-----', alldata);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getNote = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    setLoding(true);
    await Apis.getnote(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setAddnote(response.data.response.note);
        console.log(alldata);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const getlab = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getlabresult(token)

      .then((response) => {
        console.log('labresult======>', response.data.response);
        setLab(response.data.response);
        // getlabresultdetails();
        // getlabimage();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  // const generatepres = () => {
  //   prescriptionshow ? showprescription() : Linking.openURL(prescription);
  // };

  const SaveNote = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
      note: addnote,
    };
    console.log('data---', data);
    setLoding(true);
    await Apis.savenote(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        // SetIsVisible(true);
        console.log(response.data.data);
        SetIsNoteVisible(false);
        // setAlldata(response.data.data);
      })
      .catch((error) => {
        console.error(error.response.data.errors);
        setLoding(false);
      });
  };
  const GetBackMedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };
    console.log('data---', data);
    setLoding(true);
    await Apis.backgetmedicine(data)

      .then((response) => {
        console.warn(response.data.response);
        setLoding(false);
        // SetIsVisible(true);
        console.log('fdbg---', response.data.response);
        setSelectMedicine([response.data.response.medicine]);
        // setMedicine(response.data.response.medicine);
        // setAlldata(response.data.data);
        setCourse(response.data.response.course);
        setDoes(response.data.response.dose);
        setSelectRoute([response.data.response.route_id]);
        setFrequency(response.data.response.frequency);
        setValue(response.data.response.dose_type);
        console.log('msdicine----', selectmedicine);
        console.log('msdicine----', does);
        setBrief(response.data.response.brief);
        setId(response.data.response.id);
      })
      .catch((error) => {
        console.error(error.response.data.errors);
        setLoding(false);
      });
  };
  console.log('medicine----', selectmedicine);
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
    await Apis.bookingdetails(data)
      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);

        setName(response.data.data.patient_name);
        setDay(response.data.data.day);
        SetImage(response.data.data.profile_image);
        setDate(response.data.data.date);
        SetSlotstart(response.data.data.slot_start);
        Setend(response.data.data.slot_end);
        SetProblem(response.data.data.problem);
        setAge(response.data.data.age);
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const handleClose = () => {
    // SetIsModalVisible(false);
    SetIsNoteVisible(false);
  };
  console.log('endtime', props.route.params?.endtime);
  const GetOtherDetails = async () => {
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
    await Apis.bookingdetails(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);

        console.log(response.data.data);
        setAlldata(response.data.data);
        setName(response.data.data.patient_name);

        setAge(response.data.data.age);

        setGender(response.data.data.sex);
        setHeight(response.data.data.height);
        setWeight(response.data.data.weight);
        setBloodp(response.data.data.blood_gr);
        setBloodsugar(response.data.data.blood_suger_level);
        setAllergy(response.data.data.allergy);
        setMedicine(response.data.data.medication);
        setLabresult(response.data.data.lab_result);
        // setLabresultimg(response.data.data.lab_result_images);
        setSocialhistory(response.data.data.social_history);
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
        console.error(error.response.data);
        setLoding(false);
      });
  };
  let getallergy = allergy.split(',');
  let getmedicine = medicine.split(',');
  let getlabresult = labresult.split(',');
  let getsurgicalhistory = surgicalhistory.split(',');
  let getmedicalhistory = medicalhistory.split(',');
  let getsocialhistory = socialhistory.split(',');
  //console.log('letters', surgicalhistoryimg[i]);
  useEffect(() => {
    const backAction = async (data) => {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);

      console.log('backdata', data);
      setLoding(true);
      await Apis.noteautosave(data)

        .then((response) => {
          console.warn(response.data);
          setLoding(false);
          // props.navigation.navigate('PatientChart', {
          //   bookingid: props.route.params?.bookingid,
          // });
          props.navigation.goBack();
          return true;
        })
        .catch((error) => {
          console.error(error.response);
          setLoding(false);
        });
    };
    const backdata = {
      ...{
        booking_id: props.route.params?.bookingid,
        note: addnote,
      },
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      backAction(backdata)
    );
    return () => backHandler.remove();
  }, []);

  const Autosave = useCallback(
    async (callback) => {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Medicine = {
        booking_id: props.route.params?.bookingid,
        note: addnote,
      };
      console.log('med======', Medicine);
      setLoding(true);
      await Apis.noteautosave(Medicine)

        .then((response) => {
          console.warn(response.data);
          setLoding(false);
          handleClose();
          callback?.();

          // props.navigation.navigate('PatientChart', {
          //   bookingid: props.route.params?.bookingid,
          // });
          // return true;
        })

        .catch((error) => {
          console.error(error.response);
          setLoding(false);
        });
      if (autoendtimeref.current) {
        clearInterval(autoendtimeref.current);
      }
    },
    [addnote, props.route.params?.bookingid]
  );
  // const GetImage = () => {
  //   for (let i = 0; i <= surgicalhistoryimg.length; i++) {
  //     SetViewImage(surgicalhistoryimg[i]);
  //     console.log(viewimage);
  //     // return (
  //     //   <View style={{ flex: 1 }}>
  //     //     <Image

  //     //       source={{ uri: surgicalhistoryimg[i] }}
  //     //       style={{ height: 40, width: 40, borderRadius: 20 }}
  //     //     />
  //     //     <Text>ughfte</Text>
  //     //   </View>
  //     // );
  //     // console.log(surgicalhistoryimg[i]);
  //   }

  //   return (
  //     <SafeAreaView>
  //       {/* {viewimage?.map((el, i) => (
  //         <View style={{ flex: 1 }}>
  //           <Image
  //             source={{ uri: viewimage[i] }}
  //             style={{ height: 40, width: 40, borderRadius: 20 }}
  //           />
  //           <Text>{el}</Text>
  //         </View>
  //       ))} */}
  //       <Text>ouytrre</Text>
  //     </SafeAreaView>
  //   );
  // };
  useEffect(() => {
    clearInterval(autoendtimeref.current);
    autoendtimeref.current = setInterval(() => {
      if (Date.now() >= props.route.params?.endtime + 120000) {
        SetIsEndModalVisible(true);
        Autosave(() => {
          props.navigation.navigate('Dashboard');
        });
      }
    }, 5000);
    return () => {
      clearInterval(autoendtimeref.current);
    };
  }, [Autosave, props.navigation, props.route.params?.endtime]);
  // if (isModalVisible === false) {
  //   getPrescriptiondetails();
  // }
  const showprescription = () => {
    Alert.alert('You cannot generate');
  };
  useEffect(() => {
    getPrescriptiondetails();
    GetRequest(), getNote();
    GetBackMedicine();
    GetOtherDetails();
  }, [
    props.route.params?.bookingid,
    selectmedicine,
    props.route.params?.endtime,
  ]);
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
      {/* <View style={styles.view}> */}
      <Header4 title="Patient Chart" navProps={props.navigation} />
      {/* <TouchableOpacity style={{ marginRight: 20 }}>
      <Image
        source={require('../../Assets/menu.png')}
        resizeMode="contain"
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity> */}
      {/* </View> */}
      <ScrollView
        style={{
          marginBottom: 20,
          backgroundColor: '#fff',
          position: 'relative',
        }}
      >
        <View style={styles.checkborder}>
          <Image style={styles.img} source={{ uri: image }} />

          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: 5,
              // position: 'absolute',
              fontSize: 15,
              fontWeight: 'bold',
              width: '60%'
            }}
          >
            {name}
          </Text>
          {/* <View style={{ flexDirection: 'row', width: '80%' }}> */}
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              //  marginTop: 30,
              width: '38%',
            }}
          >
            Age: {age}
          </Text>
          {/* <Button
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              contentStyle={{
                backgroundColor: '#2173A8',
                //    marginTop: 10,
                borderRadius: 15,
                marginLeft: 20,
              }}
              onPress={() => {
                SetIsNoteVisible(true);
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            >
              Show Note
            </Button>
          </View> */}
          {/* <View style={{ flexDirection: 'row', width: '80%' }}> */}
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              width: '38%',
              marginTop: 5,
            }}
          >
            {date}
          </Text>
          {/* <Button
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              contentStyle={{
                backgroundColor: '#2173A8',
                //   marginTop: 10,
                borderRadius: 15,
                width: '73%',
                marginLeft: 20,
              }}
              onPress={() => {
                props.navigation.navigate('Order', {
                  bookingid: props.route.params?.bookingid,
                });
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            >
              Order
            </Button> */}
          {/* </View> */}
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
            }}
          >
            {day}, {slotstart} - {end}
          </Text>
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

        <Modal visible={isNoteVisible} transparent={true}>
          <KeyboardAvoidingView
            style={{
              width: '90%',
              height: Height / 1.5,
              backgroundColor: '#f7ebf7',
              alignSelf: 'center',
              marginTop: '15%',
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              //   contentInsetAdjustmentBehavior="automatic"
              contentContainerStyle={{
                height: '75%',
                backgroundColor: '#fff',
                width: '90%',
                alignSelf: 'center',
                marginTop: 25,
              }}
            >
              <TextInput
                // placeholder="kkk"
                multiline={true}
                scrollEnabled={true}
                style={{
                  bottom: -20,
                  width: '90%',
                  alignSelf: 'center',
                  fontSize: 16,
                  backgroundColor: '#fff',
                  height: Height / 1.5,
                  textAlignVertical: 'top',
                  color: '#000',
                }}
                underlineColor={'#fff'}
                activeUnderlineColor={'#fff'}
                value={addnote}
                onChangeText={(text) => setAddnote(text)}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
            </ScrollView>
            <View
              style={{
                marginTop: 5,
                backgroundColor: '#fff',
                borderRadius: 8,
                width: '40%',
                alignSelf: 'center',
                position: 'absolute',
              }}
            >
              <Text
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  alignSelf: 'center',
                  color: '#000',
                }}
              >
                Add notes
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: 20,
                //flex: 1,
                // backgroundColor: '#000',
                borderRadius: 20,
                //   marginBottom: 20,
                // marginTop: 12,
                // width: 80,
                justifyContent: 'space-between',
                alignSelf: 'center',
                //marginRight: 30,
                flexDirection: 'row',
                top: -40,
                // height: '25%',
                // width: '100%',
              }}
            >
              <Button
                mode="contained"
                color="#2173A8"
                uppercase={false}
                // onPress={async () => {
                //   const _prescription = await GeneratePrescription();
                //   console.log('pres=====', _prescription);
                //   Linking.openURL(_prescription);
                // }}
                //contentStyle={{ height: 0 }}
                onPress={SaveNote}
                labelStyle={{ color: '#fff', fontSize: 18 }}
              >
                Save
              </Button>
              <Button
                mode="contained"
                color="#2173A8"
                uppercase={false}
                // onPress={async () => {
                //   const _prescription = await GeneratePrescription();
                //   console.log('pres=====', _prescription);
                //   Linking.openURL(_prescription);
                // }}
                //contentStyle={{ height: 0 }}
                onPress={() => { handleClose(), Autosave() }}
                labelStyle={{ color: '#fff', fontSize: 18 }}
                style={{ marginLeft: 20 }}
              >
                Cancel
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            marginTop: 30,
            justifyContent: 'space-around',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              // width: '28%',
              //  marginTop: 40,
              borderRadius: 10,
              // marginBottom: 20,
              //zIndex: -2,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={() => {
                props.navigation.navigate('Order', {
                  bookingid: props.route.params?.bookingid,
                  endtime: props.route.params?.endtime,
                });
              }}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 17 }}
            >
              Order
            </Button>
          </View>
          <View
            style={{
              //  width: '40%',
              // marginTop: 20,
              borderRadius: 10,
              //marginBottom: 20,
              //zIndex: -2,
              // marginHorizontal: 10,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={() => {
                props.navigation.navigate('PatientPrescription', {
                  bookingid: props.route.params?.bookingid,
                  endtime: props.route.params?.endtime,
                });
              }}
              contentStyle={{ height: 50, width: 180, marginLeft: -15 }}
              labelStyle={{ color: '#fff', fontSize: 17 }}
            >
              Prescription
            </Button>
          </View>
          <View
            style={{
              // width: '28%',
              borderRadius: 10,
              //// marginBottom: 20,

              //zIndex: -2,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={() => {
                SetIsNoteVisible(true);
              }}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 17 }}
            >
              Note
            </Button>
          </View>
        </View>
        {/* <Button
            uppercase={false}
            mode="contained"
            contentStyle={{ height: 40 }}
            labelStyle={{ color: '#fff', fontSize: 10 }}
            onPress={async () => {
              const _prescription = await GetPrescription();
              console.log('pres=====', _prescription);
              Linking.openURL(_prescription);
            }}
          >
            View Prescription
          </Button> */}
        <View
          style={{
            // height: 500,
            //   marginTop: 80,
            width: 400,
            borderRadius: 35,
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          <ScrollView
            contentContainerStyle={{}}
            showsVerticalScrollIndicator={false}
            ref={(refff) => {
              scrollviewref.current = refff;
            }}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 20,
                  marginTop: 20,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                Patient Information
              </Text>
            </View>
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
                {heigh} (Inch)
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
                {bloodsugar} (PP)
              </Text>
            </View> */}

            <List.Accordion
              title={`Allergy (${getallergy == '' || getallergy == 'None' ? 0 : getallergy.length})`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              expanded={expanded.allergy}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('allergy');
              }}
              style={{ backgroundColor: '#fff', height: 50 }}
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
              style={{ backgroundColor: '#fff', height: 50 }}
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
              style={{ backgroundColor: '#fff', height: 50 }}
            >
              {getsocialhistory.map((el) => (
                <List.Item title={el} titleStyle={{ color: '#000' }} />
              ))}
            </List.Accordion>
            <List.Accordion
              title={`Lab Result (${getlabresult == '' || getlabresult == 'None' ? 0 : getlabresult.length
                })`}
              left={(props) => <List.Icon {...props} icon="pill" />}
              expanded={expanded.labresult}
              theme={{ colors: { text: '#000' } }}
              onPress={() => {
                handlePress('labresult');
              }}
              style={{ backgroundColor: '#fff', height: 50 }}
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
              style={{ backgroundColor: '#fff', height: 50 }}
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
              style={{ backgroundColor: '#fff', height: 50 }}
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
              onPress={() => {
                handlePress('medicalhistory');
              }}
              theme={{ colors: { text: '#000' } }}
              // titleStyle={{ marginBottom: 40 }}
              style={{ backgroundColor: '#fff', height: 50 }}
            >
              {getmedicalhistory.map((el) => (
                <List.Item
                  title={el}
                  titleStyle={{ color: '#000' }}
                  // titleStyle={{ marginBottom: 20 }}
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
              style={{ backgroundColor: '#fff', height: 50 }}
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
          </ScrollView>
        </View>
      </ScrollView>
      {/* <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
        message={modalmessage}
      /> */}
      <Modal
        animationType={'slide'}
        transparent={true}
        visible={isendModalVisible}
        onRequestClose={() => {
          console.log('Modal has been closed.');
        }}
        style={{ width: 400, backgroundColor: '#fff' }}

      // animationIn="zoomIn"
      // animationOut="zoomOut"
      >
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#f5ebf4',
            // justifyContent: 'center',
            marginTop: 150,
            padding: 10,
            alignSelf: 'center',
            elevation: 5,
            borderRadius: 15,
            width: 300,
            height: 150,
          }}
        >
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              //marginTop: -30,
            }}
          >
            {/* <Ionicons
            name="checkmark-done-circle-outline"
            size={60}
            color="green"
          /> */}
            <Image
              source={require('../../../Assets/doctorappicon2.png')}
              style={{ width: 60, height: 60, borderRadius: 20 }}
            />

            <Text
              style={{
                fontSize: 15,
                marginTop: 15,
                color: '#2173A8',
                fontStyle: 'italic',
                fontWeight: 'bold',
              }}
            >
              Times Up....Data AutoSaved
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    backgroundColor: '#2196f3',
    justifyContent: 'center',
    marginTop: 80,
    padding: 10,
  },
  view: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
    marginLeft: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },

  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',

    alignSelf: 'center',
    height: 90,
    marginTop: 20,
    width: '90%',
  },
  // eslint-disable-next-line no-dupe-keys
  view: {
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
    elevation: 5,
    height: 60,
    marginTop: 20,
    borderRadius: 15,
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
