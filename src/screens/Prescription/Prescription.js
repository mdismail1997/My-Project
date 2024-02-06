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
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Paragraph,
  Title,
  IconButton,
  HelperText,
  Snackbar,
  Checkbox,
} from 'react-native-paper';
import { Header2, Header4 } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUserToken } from '../../storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import MultiSelect from '../../components/React-Native-Multi-Select';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import DeviceInfo from 'react-native-device-info';
import * as RNLocalize from 'react-native-localize';
import DropDownPicker from 'react-native-dropdown-picker';
import { EditPrescription } from '../../components/EditPrescription/EditPrescription';
import { RFValue } from 'react-native-responsive-fontsize';
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
export const Prescription = (props) => {
  const [quickvisit, setQuickVisit] = useState('');
  useEffect(() => {
    console.log('qqqq===', quickvisit);
    getRoute();
    getPrescriptiondetails();
    GetRequest(), getlab(), getNote();
    getmedicine(), GetBackMedicine();
    setQuickVisit(props.route.params?.quickvisit);
  }, [
    props.route.params?.bookingid,
    selectmedicine,
    props.route.params?.endtime,
    props.route.params?.quickvisit,
  ]);
  const [otherlab, setOtherlab] = useState('');
  const [loading, setLoding] = useState(false);
  const [route, setRoute] = useState();
  const [selectroute, setSelectRoute] = useState();
  const [medicine, setMedicine] = useState();
  const [selectmedicine, setSelectMedicine] = useState('');
  const [course, setCourse] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [routeid, setRouteid] = useState([]);
  const [does, setDoes] = useState('');
  const [frequency, setFrequency] = useState('');
  const [brief, setBrief] = useState('');
  const [refills, setRefills] = useState('');
  const [comment, setComment] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [editdatetime, setEditdatetime] = useState();
  const [isModalVisible, SetIsModalVisible] = useState();
  const [isDeleteModalVisible, SetIsDeleteModalVisible] = useState();
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
  const [deletemodalmessage, SetDeleteModalmessage] = useState();
  const [value, setValue] = useState('');
  const [medvalue, setmedValue] = useState({});
  const [lab, setLab] = useState([]);
  const [addnote, setAddnote] = useState('');
  const [items, setItems] = useState([
    { label: 'ML', value: 'ML' },
    { label: 'MG', value: 'MG' },
  ]);
  const [refillsitems, setrefillsItems] = useState([
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
  ]);
  const [frequencyitems, setfrequencyItems] = useState([
    { label: 'One time a day', value: 'One time a day' },
    { label: 'Two times a day', value: 'Two times a day' },
    { label: 'Three times a day', value: 'Three times a day' },
    { label: 'Four times a day', value: 'Four times a day' },
    { label: 'Five times a day', value: 'Five times a day' },
    // { label: '5', value: '5' },
  ]);
  const [frequencyopen, setFrequencyOpen] = useState(false);
  const [refillsopen, setRefillsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [isNoteVisible, SetIsNoteVisible] = useState(false);
  const [isViewMedicineDetails, setisViewMedicineDetails] = useState(false);
  const [isUpdateMedicine, setisUpdateMedicine] = useState(false);
  const automadalcloseref = useRef(null);
  const autoendtimeref = useRef(null);
  const [id, setId] = useState();
  const [medid, setMedId] = useState();
  const Height = Dimensions.get('window').height;
  const [showmedicine, setShowMedicine] = useState('');
  const [showcourse, setShowCourse] = useState('');
  const [showroute, setShowRoute] = useState('');
  const [showdose, setShowDose] = useState('');
  const [showfrequency, setShowFrequency] = useState();
  const [showcomment, setShowComment] = useState('');
  const [showtype, setShowType] = useState('');
  const [checked, setChecked] = React.useState(true);
  const [check, setCheck] = React.useState(true);
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const showDate = () => {
    setOpen(true);
  };

  const hideDate = () => {
    setOpen(false);
  };
  console.log('endtime', props.route.params?.endtime);
  // useEffect(() => {
  //   const backAction = () => {
  //     props.navigation.navigate('Appointment');
  //     return true;
  //   };
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);
  // const Close = () => {
  //   SetIsModal(false);
  //   modalClosed = true;
  // };
  // useEffect(() => {
  //   if (isModal) {
  //     if (automadalcloseref.current) {
  //       clearTimeout(automadalcloseref.current);
  //     }

  //     automadalcloseref.current = setTimeout(() => {
  //       modalClosed = true;
  //       SetIsModal(false);
  //     }, 5000);
  //   }
  // }, [isModal]);
  const Close = () => {
    SetIsNoteVisible(false);
  };
  // const getmedicationdetails = async () => {
  //   let usertoken = await AsyncStorage.getItem('authtoken');
  //   const userid = await AsyncStorage.getItem('userid');
  //   const user_id = JSON.parse(userid);
  //   let token = usertoken;
  //   console.log('user id =====>>>>', user_id);
  //   console.log('token123=', token);
  //   const data = {
  //     user_id: user_id,
  //   };

  //   await Apis.medicinedetails(data)

  //     .then((response) => {
  //       console.warn(response.data);

  //       setSelectedItems((prevData) => ({
  //         ...prevData,
  //         ['medicine']: response.data.response.map((el) => el.id),
  //       }));
  //     })
  //     .catch((error) => {
  //       console.error(error.response);
  //     });
  // };
  const getmedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getmedication(token)

      .then((response) => {
        console.log('medication======>', response.data.response);
        const med = response.data.response.reduce(
          (acc, cur) => ({ ...acc, [cur.id]: cur.name }),
          {}
        );
        setmedValue(med);
        setMedicine(response.data.response);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
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
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.prescriptindetails(data)

      .then((response) => {
        console.warn('adddd---', response.data.response?.id);
        setLoding(false);

        setAlldata(response.data.response);
        console.log('alldata-----', response.data.response);
        console.warn('adddd---', response.data.response.id);
        // console.log('id==', alldata.id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const handleKeyPress = (event) => {
    const number = parseInt(event.nativeEvent.key);
    if (number >= 1 && number <= 9) {
      const newMessage = getNumberMessage(number);
      setFrequency(newMessage);
    }
  }

  const getNumberMessage = (number) => {
    switch (number) {
      case 1:
        return 'One time a day';
      case 2:
        return 'Two times a day';
      // Add cases for numbers 3 to 9 with their respective text values
      case 3:
        return 'Three times a day';
      // ... Repeat for numbers 4 to 9
      case 4:
        return 'Four times a day';
      case 5:
        return 'Five times a day';
      case 6:
        return 'Six times a day';
      case 7:
        return 'Seven times a day';
      case 8:
        return 'Eight times a day';
      case 9:
        return 'Nine times a day';
      default:
        return '';
    }
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
  const twoOptionAlertHandler = () => {
    //function to make two option alert
    Alert.alert(
      //title
      'Alert',
      //body
      'You have selected the None option. No prescription should be generated for this patient. Please click OK to proceed.',
      [

        {
          text: 'Ok',
          onPress: () => props.navigation.goBack(),
        },
        {
          text: 'Cancel',
          //  onPress: () => props.navigation.goBack(),
        },
      ],

      //clicking out side of alert will not cancel
    );
  };
  const AddMedicine = async (values) => {
    if (!selectmedicine?.[0] || selectmedicine?.[0].length < 1) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Medicine field is required',
      }));
    }
    else if (selectmedicine?.[0] == "None") {
      console.log(selectmedicine?.[0])
      twoOptionAlertHandler()
    }
    else if (check == false && selectroute?.[0] == undefined) {
      console.log(check, selectroute?.[0])
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Route field is required',
      }));
    }
    else if (!course || course?.length < 1) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Duration field is required',
      }));
    }
    // if (!selectroute?.[0] || selectroute[0]?.length < 1&&check===true) {
    //   setError((data) => ({
    //     ...data,
    //     iserror: true,
    //     message: 'Route field is required',
    //   }));
    // }

    else if (!does || does?.length < 1) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Dose field is required',
      }));
    }
    else if (!value || value?.length < 1) {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Type field is required',
      }));
    }
    else if (!frequency || frequency?.length < 1 || frequency == '') {
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Frequency field is required',
      }));
    }
    else if (!refills || refills?.length < 1 || refills == '') {
      console.log('refills====', refills)
      setError((data) => ({
        ...data,
        iserror: true,
        message: 'Refills field is required',
      }));
    }
    else {
      try {
        let usertoken = await AsyncStorage.getItem('authtoken');
        const userid = await AsyncStorage.getItem('userid');
        const user_id = JSON.parse(userid);
        let token = usertoken;
        console.log('user id =====>>>>', user_id);
        console.log('token123=', token);
        // setLoding(true);
        const Medicine = {
          medicine: selectmedicine?.[0],
          course: course,
          route_id: check ? 0 : selectroute?.[0],
          dose: does,
          frequency: frequency,
          dose_type: value,
          booking_id: props.route.params?.bookingid,
          refil: refills,
          id: id,
          sub: checked ? 1 : 0,
        };

        console.log('Medicine', Medicine);
        setLoding(true);
        const response = await Apis.medicineadd(Medicine);

        console.log(response.data);
        if (response.data.success === '1') {
          SetModalmessage(response.data.message);
          SetIsModalVisible(true);
          setMedId(response.data.med_id);
          console.log('uid==', medid);
        }
        setLoding(false);
        // props.navigation.navigate('OtpVerify');

        setAlldata((data) => [...data, Medicine]);
        setSelectMedicine();
        setCourse('');
        setSelectRoute();
        setDoes('');
        setBrief('');
        setFrequency('');
        setValue('');
        setRefills('')
      }

      catch (err) {
        console.warn('yyyyyy', err);
        console.log('refillsss', refills)

        setLoding(false);
      }
    }
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
  const GeneratePrescription = async (values) => {
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Prescription = {
        booking_id: props.route.params?.bookingid,
        time_zone: RNLocalize.getTimeZone(),
        comment: comment,
        remarks: brief
      };
      console.log('prescription', Prescription);
      setLoding(true);
      const response = await Apis.generateprescription(Prescription);
      console.log('dta==', response.data);

      console.log('prescription==', response.data.prescription);
      setLoding(false);
      if (response.data.prescription) {
        console.log('prescription------', response.data.prescription);
        return response.data.prescription;
      } else {
        console.log('message---', response.data);
        SetModalmessage(response.data.message);
        SetIsModalVisible(true);
      }
    } catch (err) {
      console.error(err.response.data);
      setError((data) => ({
        ...data,
        iserror: true,
        message: err.response.data,
      }));
    }
  };

  const GeneratePrescriptionQuiciVisit = async (values) => {
    try {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Prescription = {
        booking_id: props.route.params?.bookingid,
        time_zone: RNLocalize.getTimeZone(),
        comment: comment,
      };
      console.log('prescription', Prescription);
      setLoding(true);
      const response = await Apis.quickvisitgenarateprescription(Prescription);
      console.log(response.data);

      console.log('prescription==', response.data.prescription);
      setLoding(false);
      if (response.data.prescription) {
        console.log('prescription------', response.data.prescription);
        return response.data.prescription;
      } else {
        console.log('message---', response.data);
        SetModalmessage(response.data.message);
        SetIsModalVisible(true);
      }
    } catch (err) {
      console.error(err.response);
      setLoding(false);
      // setError((data) => ({
      //   ...data,
      //   iserror: true,
      //   message: err.response.data,
      // }));
    }
  };

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
        // setRefills()
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
      time_zone: RNLocalize.getTimeZone(),
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
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const MedDelete = async (medid) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      med_id: medid,
    };
    console.log('id---', data);
    setLoding(true);
    await Apis.medicinedelete(data)
      .then((response) => {
        console.warn(response.data);
        if (response.data.success === '1') {
          SetDeleteModalmessage(response.data.message);
          SetIsDeleteModalVisible(true);
        }
        setLoding(false);
        setAlldata((prevData) => prevData.filter((el) => el.id !== medid));
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const MedicineDetails = async (medid) => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      med_id: medid,
    };
    console.log('id---', data);
    setLoding(true);
    await Apis.medicineget(data)
      .then((response) => {
        console.warn(response.data);

        if (response.data.success === '1') {
          // SetDeleteModalmessage(response.data.message);
          // SetIsDeleteModalVisible(true);
          setisViewMedicineDetails(true);
          setShowMedicine(response.data.response.medicine);
          setShowCourse(response.data.response.course);
          setShowRoute(response.data.response.route_name);
          setShowDose(response.data.response.dose);
          setShowType(response.data.response.dose_type);
          setShowFrequency(response.data.response.frequency);
          setShowComment(response.data.response.brief);

        }
        setLoding(false);
        // setAlldata((prevData) => prevData.filter((el) => el.id !== medid));
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const handleClose = () => {
    SetIsModalVisible(false);
    SetIsNoteVisible(false);
    SetIsDeleteModalVisible(false);
    getPrescriptiondetails();
    GetBackMedicine();
  };
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
      await Apis.autosave(data)

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
        medicine: selectmedicine?.[0],
        course: course,
        route_id: selectroute?.[0],
        dose: does,
        brief: brief,
        frequency: frequency,
        dose_type: value,
        booking_id: props.route.params?.bookingid,
      },
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () =>
      backAction(backdata)
    );
    return () => backHandler.remove();
  }, [
    brief,
    course,
    does,
    frequency,
    medvalue,
    props.navigation,
    props.route.params?.bookingid,
    selectmedicine,
    selectroute,
    value,
  ]);
  const Autosave = useCallback(
    async (callback) => {
      let usertoken = await AsyncStorage.getItem('authtoken');
      const userid = await AsyncStorage.getItem('userid');
      const user_id = JSON.parse(userid);
      let token = usertoken;
      console.log('user id =====>>>>', user_id);
      console.log('token123=', token);
      const Medicine = {
        medicine: selectmedicine?.[0],
        course: course,
        route_id: selectroute?.[0],
        dose: does,
        brief: brief,
        frequency: frequency,
        dose_type: value,
        booking_id: props.route.params?.bookingid,
      };
      console.log('med======', Medicine);
      setLoding(true);
      await Apis.autosave(Medicine)

        .then((response) => {
          console.warn(response.data);
          setLoding(false);
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
    [
      brief,
      course,
      does,
      frequency,
      props.route.params?.bookingid,
      selectmedicine,
      selectroute,
      value,
    ]
  );

  useEffect(() => {
    clearInterval(autoendtimeref.current);
    autoendtimeref.current = setInterval(() => {
      if (Date.now() >= props.route.params?.endtime + 120000) {
        Autosave(() => {
          props.navigation.navigate('Dashboard');
        });
      }
    }, 5000);
    return () => {
      clearInterval(autoendtimeref.current);
    };
  }, [Autosave, props.navigation, props.route.params?.endtime]);
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  // if (isModalVisible === false) {
  //   getPrescriptiondetails();
  // }
  // const showprescription = () => {
  //   Alert.alert('You cannot generate');
  // };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Snackbar
        visible={error.iserror}
        onDismiss={onDismissSnackBar}
        duration={3000}
        style={{
          backgroundColor: '#d15656',
          bottom: 0,
          zIndex: 1,
        }}
        wrapperStyle={{ position: 'absolute' }}
      >
        {error.message}
      </Snackbar>
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
      <ScrollView>
        <View style={{ flexDirection: 'row', marginTop: 20, marginLeft: 20 }}>
          <TouchableOpacity
            onPress={() =>
              Autosave(() => {
                props.navigation.goBack();
              })
            }
          >
            <Image
              source={require('../../Assets/back.png')}
              resizeMode="contain"
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: 40,
              fontSize: 20,
              fontFamily: 'Roboto-Bold',
              color: '#333333',
            }}
          >
            Prescription
          </Text>
        </View>
        {/* <TouchableOpacity style={{ marginRight: 20 }}>
      <Image
        source={require('../../Assets/menu.png')}
        resizeMode="contain"
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity> */}
        {/* </View> */}
        {/* <KeyboardAvoidingView behavior='height'> */}
        <ScrollView
          style={{
            marginBottom: 20,
            backgroundColor: '#fff',
            position: 'relative',
          }}
        >

          <View style={styles.checkborder}>
            <Image style={styles.img} source={{ uri: image }} />
            <View>
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  marginTop: 5,
                  //  position: 'absolute',
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >
                {name}
              </Text>
              {/* <View style={{ flexDirection: 'row', width: '80%' }}> */}
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  marginTop: 3,
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
          </View>
          <View style={{ flexDirection: 'row', width: '80%' }}> */}
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  width: '38%',
                  marginTop: 3,
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
            </Button>
          </View> */}
              <Text
                style={{
                  color: '#333333',
                  marginLeft: 100,
                  marginTop: 3,
                }}
              >
                {day}, {slotstart} - {end}
              </Text>
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
              marginTop: 10,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Medicine List
          </Text>
          {alldata.map((el, i) => (
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                width: '87%',
                alignSelf: 'center',
                marginTop: 20,
                flexDirection: 'row',
                backgroundColor: '#fff',
                borderColor: '#ddd',
                borderWidth: 1,
              }}
            >
              <Card.Content style={{ flexDirection: 'row' }}>
                <Paragraph style={{ color: '#000' }}>{el.medicine}{' '}:{' '}</Paragraph>
                <Paragraph style={{ color: '#000' }}>{el.course}{' '}Days</Paragraph>
              </Card.Content>
              <Card.Content
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  justifyContent: 'space-between',
                  marginTop: -22,
                  marginBottom: 20,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setEditdatetime((data) => ({
                      ...data,
                      [el.id]: !data?.[el.id],
                    }))
                  }
                >
                  <Image
                    style={{
                      width: 20,
                      height: 22,
                      resizeMode: 'contain',
                      marginRight: 5,
                    }}
                    source={require('../../Assets/update.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    MedicineDetails(el.id);
                  }}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 22,
                      resizeMode: 'contain',
                      alignItems: 'center',
                    }}
                    source={require('../../Assets/eye.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    MedDelete(el.id);
                  }}
                >
                  <Image
                    style={{
                      width: 20,
                      height: 22,
                      resizeMode: 'contain',
                      marginLeft: 5,
                    }}
                    source={require('../../Assets/cross.png')}
                  />
                </TouchableOpacity>
              </Card.Content>
              {editdatetime?.[el.id] && (
                <EditPrescription
                  id={el.id}
                  data={alldata}
                  onMedicineChange={(id, medicine) => {

                    console.log('iddate====>', id, medicine);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].medicine = medicine;
                      return updateddata;
                    });
                  }}
                  onCourseChange={(id, course) => {
                    console.log('iddate====>', id, course);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].course = course;
                      return updateddata;
                    });
                  }}
                  onRouteChange={(id, route_name) => {
                    console.log('iddate====>', id, route_name);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].route_name = route_name;
                      return updateddata;
                    });
                  }}
                  onDoseChange={(id, dose) => {
                    console.log('iddate====>', id, dose);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].dose = dose;
                      return updateddata;
                    });
                  }}
                  onFrequencyChange={(id, frequency) => {
                    console.log('iddate====>', id, frequency);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].frequency = frequency;

                      return updateddata;
                    });
                  }}
                  onCommentChange={(id, brief) => {
                    console.log('iddate====>', id, brief);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].brief = brief;
                      return updateddata;
                    });
                  }}
                  onSubChange={(id, sub) => {
                    console.log('iddate====>', id, sub);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].sub = sub;
                      return updateddata;
                    });
                  }}
                  // onOralChange={(id,sub) => {
                  //   console.log('iddate====>', id, sub);
                  //   setAlldata((prevdata) => {
                  //     const indexdata = prevdata.indexOf(el);
                  //     console.log('predata------->', indexdata);
                  //     const updateddata = [...prevdata];
                  //     updateddata[indexdata].sub= sub;
                  //     return updateddata;
                  //   });
                  // }}
                  onDoseTypeChange={(id, dose_type) => {
                    console.log('iddate====>', id, dose_type);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].dose_type = dose_type;
                      return updateddata;
                    });
                  }}
                  onrefillChange={(id, refil) => {
                    console.log('iddate====>', id, refil);
                    setAlldata((prevdata) => {
                      const indexdata = prevdata.indexOf(el);
                      console.log('predata------->', indexdata);
                      const updateddata = [...prevdata];
                      updateddata[indexdata].refil = refil;
                      return updateddata;
                    });
                  }}
                  onSubmit={() => {
                    setEditdatetime((data) => ({
                      ...data,
                      [el.id]: !data?.[el.id],
                    }));
                  }}
                />
              )}
            </Card>
          ))}


          <Title
            style={{
              color: '#333333',
              marginLeft: 20,
              marginTop: 20,
              fontSize: 15,
              fontWeight: 'bold',
              width: '60%',
            }}
          >
            Medicine
          </Title>

          <Card
            style={{
              borderRadius: 10,
              marginHorizontal: 10,
              width: '85%',
              alignSelf: 'center',
              marginTop: 5,
              zIndex: -2,
              borderColor: '#2173A8',
              borderWidth: 0.5,
              backgroundColor: '#fff',
            }}
          >
            <Card.Content>
              <MultiSelect
                items={medicine}
                uniqueKey="name"
                // onToggleList={getSkill}
                selectedItems={selectmedicine}
                //  selectText={selectmedicine}
                onSelectedItemsChange={(item) => setSelectMedicine(item)}
                single
              //onPress={setChecked(false)}
              />
            </Card.Content>
          </Card>
          <View
            style={{ flexDirection: 'row', marginHorizontal: 25, width: '85%', }}
          >
            <View style={{ flexDirection: 'row', width: '50%', }}>
              <Title
                style={{
                  color: '#333333',
                  marginLeft: 10,
                  marginTop: 20,
                  fontSize: RFValue(15),
                  fontWeight: 'bold',
                }}
              >
                Substitute
              </Title>
              {/* </View> */}
              <View
                style={{
                  marginTop: 18,
                  borderRadius: 5,
                  marginLeft: 20,
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  borderWidth: 2,
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                <View
                  style={{
                    //   width: '55%',
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    // paddingLeft: 5,
                    // marginTop: 10
                  }}
                >
                  <Checkbox
                    status={checked ? 'checked' : 'unchecked'}
                    onPress={() => {
                      console.log(checked);
                      setChecked(!checked);
                    }}
                    style={{ marginLeft: 20 }}
                    //    checkborder='#fff'
                    // color="red"
                    uncheckedColor="#fff"
                  />
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 30, width: '50%', }}>
              <Title
                style={{
                  color: '#333333',
                  marginLeft: 10,
                  marginTop: 20,
                  fontSize: RFValue(15),
                  fontWeight: 'bold',
                }}
              >
                Oral
              </Title>
              {/* </View> */}
              <View
                style={{
                  marginTop: 18,
                  borderRadius: 5,
                  marginLeft: 20,
                  backgroundColor: '#fff',
                  borderColor: '#000',
                  borderWidth: 2,
                  height: 30,
                  width: 30,
                  justifyContent: 'center',
                  alignContent: 'center'
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignContent: 'center',
                    alignSelf: 'center',
                    //   paddingLeft: 10,
                    //  marginTop: 10
                  }}
                >
                  <Checkbox
                    status={check ? 'checked' : 'unchecked'}
                    onPress={() => {
                      console.log(check);
                      setCheck(!check);
                    }}
                    style={{ marginLeft: 30 }}
                    //    checkborder='#fff'
                    // color="red"
                    uncheckedColor="#fff"
                  />
                </View>
              </View>
            </View>
          </View>
          {!check ?
            <>
              <Title
                style={{
                  color: '#333333',
                  marginLeft: 50,
                  marginTop: 20,
                  fontSize: 15,
                  fontWeight: 'bold',
                }}
              >Route

              </Title>


              <Card
                style={{
                  borderRadius: 15,
                  marginHorizontal: 10,
                  width: '84%',
                  alignSelf: 'center',
                  marginTop: 5,
                  zIndex: -2,
                  borderColor: '#2173A8',
                  borderWidth: 0.5,
                  backgroundColor: '#fff',
                }}
              >
                <Card.Content>
                  <MultiSelect
                    items={route}
                    uniqueKey="id"
                    // onToggleList={getSkill}
                    selectedItems={selectroute}
                    selectText={selectroute}
                    onSelectedItemsChange={(item) => setSelectRoute(item)}
                    single
                  />
                </Card.Content>
              </Card>
            </>

            : null}
          <View style={{ marginHorizontal: 30, marginTop: 15 }}>
            <TextInput
              mode="outlined"
              label="Duration*"
              maxLength={3}
              value={course}
              onChangeText={(text) => setCourse(text)}
              right={
                <TextInput.Affix text="days" textStyle={{ color: '#000' }} />
              }
              keyboardType="number-pad"
              style={{ backgroundColor: '#fff' }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            />
          </View >
          {/* <View style={{flexDirection:'row',width:'100%',marginHorizontal:10}}>
        <View style={{ width: '25%',marginLeft:20}}>
          <Title
            style={{
              color: '#333333',
              marginLeft: 20,
              marginTop: 20,
              fontSize: 15,
              fontWeight: 'bold',
              width: '60%',
            }}
          >  Oral
           
          </Title>
          <View
            style={{
              marginTop: 10,
              borderRadius: 5,
              height: 70,
            //  width: '24%',
              justifyContent: 'space-between',
              marginLeft: 5,
              backgroundColor: '#fff',
              borderColor: '#000',
              borderWidth: 2,
            }}
          >
           <View style={{alignSelf:'center',marginTop:15,borderColor:'red',borderWidth:2}}>
              <Checkbox
                status={check ? 'checked' : 'unchecked'}
                onPress={() => {
                  console.log(check);
                  setCheck(!check);
                }}
                style={{ marginLeft: 30 }}
                //    checkborder='#fff'
                // color="red"
                uncheckedColor="#fff"
              />
          </View>
          </View>
          </View>
          {!check ?
       
          <Title
            style={{
              color: '#333333',
              marginLeft: 50,
              marginTop: 20,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >Route
         
          </Title>
       
         
        <Card
          style={{
            borderRadius: 15,
            marginHorizontal: 10,
            width: '90%',
            alignSelf: 'center',
            marginTop: 5,
            zIndex: -2,
            borderColor: '#2173A8',
            borderWidth: 0.5,
            backgroundColor: '#fff',
          }}
        >
          <Card.Content>
            <MultiSelect
              items={route}
              uniqueKey="id"
              // onToggleList={getSkill}
              selectedItems={selectroute}
              selectText={selectroute}
              onSelectedItemsChange={(item) => setSelectRoute(item)}
              single
            />
          </Card.Content>
        </Card>
     
    
       :null} 
        </View> */}
          <View
            style={{
              // marginTop: 20,
              flexDirection: 'row',
              marginHorizontal: 30, zIndex: 1000,
              // justifyContent: 'center',
              // borderWidth: 1,
              // borderColor: 'red',
              // backgroundColor: '#dbdbdb',
              // borderRadius: 5,
            }}
          >
            <TextInput
              mode="outlined"
              label="Dose*"
              placeholder=""
              value={does}
              maxLength={3}
              onChangeText={(text) => setDoes(text)}
              // right={<TextInput.Icon icon="eye" onPress={showDate} />}
              keyboardType="number-pad"
              // onEndEditing={() => {
              //   let string = '';
              //   console.log(value), console.log(does);
              //   string = does + value;
              //   setOnSubmit(string);
              //   console.log(onsubmit);
              // }}
              // onFocus={() => {
              //   setDoes(''), setValue('');
              // }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
              style={{
                width: '58%',
                backgroundColor: '#fff',
                marginTop: 13,
                zIndex: -2,
              }}
            />
            <DropDownPicker
              dropDownDirection='Bottom'
              open={open}
              value={value}
              // value={gender}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              placeholder="Type*"
              setItems={setItems}
              // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              labelStyle={{
                width: '37%',
                //height: 50,
                textAlign: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              containerStyle={{
                //marginHorizontal: 5,
                // marginBottom: 10,
                marginTop: 20,
                width: '35%',
                // zIndex: 5,
                marginLeft: 20,
                // backgroundColor: 'grey',
              }}

            />
          </View>
          <View style={{
            flexDirection: 'row',
            zIndex: 100,
            marginTop: 20,
            marginHorizontal: 30,
          }}>
            {/* <TextInput 
              mode="outlined"
              label="Frequency*"
              placeholder=""
              value={frequency}
              onKeyPress={handleKeyPress}
              keyboardType="numeric"
              style={{ zIndex: -2, backgroundColor: '#fff', width: '58%', }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
            /> */}
            {/* <View> */}
            <DropDownPicker
              dropDownDirection='Bottom'
              open={frequencyopen}
              value={frequency}
              // value={gender}
              items={frequencyitems}
              setOpen={setFrequencyOpen}
              setValue={setFrequency}
              placeholder="Frequency*"
              setItems={setfrequencyItems}
              // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              labelStyle={{
                width: '37%',
                //height: 50,
                textAlign: 'center',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              containerStyle={{
                //marginHorizontal: 5,
                marginBottom: 10,
                //marginTop: 10,
                width: '57%',
                // zIndex: 5,
                // marginLeft: 20,
                // backgroundColor: 'grey',
              }}

            />
            <DropDownPicker
              dropDownDirection='Bottom'
              open={refillsopen}
              value={refills}
              // value={gender}
              items={refillsitems}
              setOpen={setRefillsOpen}
              setValue={setRefills}
              placeholder='Refills*'
              setItems={setrefillsItems}
              // style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              labelStyle={{
                width: '37%',
                //  //height: 50,
                textAlign: 'center',
                //  alignSelf: 'center',
                // alignItems: 'center',
              }}
              containerStyle={{
                //marginHorizontal: 5,
                // marginBottom: 10,
                //  marginTop: 10,
                width: '35%',
                // zIndex: 5,
                marginLeft: 20,
                // backgroundColor: 'grey',
              }}
              zIndex={5}
            />


          </View>
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 20,
              borderRadius: 10,
              marginBottom: 20,
              zIndex: -2,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={AddMedicine}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Add Medicine
            </Button>
          </View>
          <View
            style={{
              marginHorizontal: 30,
              //  marginTop: 15,

              position: 'relative',
            }}
          >
            <TextInput
              mode="outlined"
              label="Comment For Patient "
              placeholder=""
              style={{ height: 80, backgroundColor: '#fff' }}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: 'black',
                },
              }}
              multiline={true}
              value={brief}
              onChangeText={(text) => setBrief(text)}
              maxLength={50}
            //style={{ height: 50 }}
            />
            <HelperText
              visible
              style={{ position: 'absolute', bottom: 0, right: 0, color: '#000' }}
            >
              {`${brief.length}/50`}
            </HelperText>
          </View>



          <View
            style={{
              marginHorizontal: 30,
              borderRadius: 10,
              marginBottom: 20,
              marginTop: 20,
              zIndex: -2,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={async () => {
                // if (quickvisit === 'QuickVisit') {
                //   const _prescription = await GeneratePrescriptionQuiciVisit();
                //   console.log('pres=====', _prescription);
                //   Linking.openURL(_prescription);
                // } else {
                const _prescription = await GeneratePrescription();
                console.log('pres=====', _prescription);
                Linking.openURL(_prescription);
                // }
              }}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Generate Prescription
            </Button>
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

        </ScrollView>
        {/* </KeyboardAvoidingView> */}
        <SuccessfullySubmitModal
          isModalVisible={isModalVisible}
          onClose={handleClose}
          style={{}}
          message={modalmessage}
        />
        <SuccessfullySubmitModal
          isModalVisible={isDeleteModalVisible}
          onClose={handleClose}
          style={{}}
          message={deletemodalmessage}
        />
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={isViewMedicineDetails}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
          style={{ width: 400, backgroundColor: '#fff' }}
        >
          <View
            style={{
              alignItems: 'center',
              backgroundColor: '#f5ebf4',
              // justifyContent: 'center',
              marginTop: 80,
              padding: 10,
              width: 300,
              alignSelf: 'center',
              elevation: 5,
              borderRadius: 15,
              height: 300,
            }}
          >
            <IconButton
              icon="close"
              size={26}
              color="#fff"
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#2173A8',
                borderRadius: 50,
              }}
              onPress={() => {
                setisViewMedicineDetails(false);
              }}
            />
            {/* <View style={{flexDirection:'row'}}> */}
            <Text
              style={{
                //  color: '#333333',
                marginLeft: 20,
                marginTop: 10,
                // width: '68%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Medicine {'    '}: </Text>
              {'   '}
              {showmedicine}
            </Text>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                //width: '38%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Course {'        '}: </Text>
              {'    '}
              {showcourse} Days
            </Text>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                //width: '38%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Route {'          '}: </Text>
              {'    '}
              {showroute}
            </Text>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                //width: '38%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Dose {'           '}: </Text>
              {'    '}
              {showdose}
            </Text>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                //width: '38%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Frequency {'  '}: </Text>
              {'    '}
              {showfrequency}
            </Text>
            <Text
              style={{
                marginLeft: 20,
                marginTop: 10,
                //width: '38%',
                alignSelf: 'flex-start',
                color: '#2173A8',
              }}
            >
              <Text style={{ color: '#000' }}> Comment {'   '}: </Text>
              {'    '}
              {showcomment}
            </Text>
            {/* </View> */}
          </View>
        </Modal>
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
              contentInsetAdjustmentBehavior="automatic"
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
                }}
                underlineColor={'#fff'}
                activeUnderlineColor={'#fff'}
                value={addnote}
                onChangeText={(text) => setAddnote(text)}
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
                onPress={handleClose}
                labelStyle={{ color: '#fff', fontSize: 18 }}
                style={{ marginLeft: 20 }}
              >
                Cancel
              </Button>
            </View>
          </KeyboardAvoidingView>
        </Modal>
        <View style={{ paddingBottom: 25 }} />
      </ScrollView>
    </SafeAreaView >
  );
};
const styles = StyleSheet.create({
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
