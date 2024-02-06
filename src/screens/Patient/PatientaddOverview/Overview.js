import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  Animated,
  SafeAreaView,
  Platform, Modal, Dimensions, Linking, Image
} from 'react-native';
import {
  Avatar,
  Title,
  Card,
  Paragraph,
  Button,
  TextInput,
  Text,
  IconButton,
  Checkbox,
  Snackbar,
} from 'react-native-paper';
import MultiSelect from '../../../components/React-Native-Multi-Select';

import Icon from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import * as Apis from '../../Services/apis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { element, object } from 'prop-types';
import CommonToast from '../../../components/CommonToast';
import { SuccessfullySubmitModal } from '../../../components/Popupmessage';
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';

// const data = [
//   {
//     id: 'mh',
//     title: 'Medical History',
//     value: [
//       { id: '1', name: ' Not Applicable' },
//       { id: '2', name: ' asthma' },
//       { id: '3', name: 'diabetes' },
//       { id: '4', name: 'Others' },
//     ],
//   },
//   {
//     id: 'al',
//     title: 'Allergies ',
//     value: [
//       { id: '1', name: 'Not Applicable' },
//       { id: '2', name: 'penicillin' },
//       { id: '3', name: 'sulfa' },
//       { id: '4', name: 'Others' },
//     ],
//   },
//   {
//     id: 'sh',

//     title: 'Surgical History',
//     value: [
//       { id: '1', name: ' Not Applicable' },
//       { id: '2', name: ' appendectomy' },
//       { id: '3', name: 'hernia repair' },
//       { id: '4', name: 'Others' },
//     ],
//   },

//   {
//     id: 'shistory',
//     title: 'Social History',
//     value: [
//       { id: '1', name: ' Not Applicable' },
//       { id: '2', name: 'smoking' },
//       { id: '3', name: 'alcohol' },
//       { id: '4', name: 'Others' },
//     ],
//   },
//   {
//     id: 'md',
//     title: 'Medication',
//     value: [
//       { id: '1', name: ' Not Applicable' },
//       { id: '2', name: 'Prozac(100mg)' },
//       { id: '3', name: 'Tylenol(500mg)' },
//       { id: '4', name: 'Others' },
//     ],
//   },
//   {
//     id: 'lr',
//     title: 'Lab Result',
//     value: [
//       { id: '1', name: ' Not Applicable' },
//       { id: '2', name: 'Alpha' },
//       { id: '3', name: 'Beta' },
//       { id: '4', name: 'Others' },
//     ],
//   },
// ];

// const mapObject = data
//   .flatMap((el) => el.value)
//   .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
let NewCertificate = [];
let NewLabCertificate = [];
export const PatientOverview = (props) => {
  const [loading, setLoding] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [multipleFile, setMultipleFile] = useState([]);
  const [uri, setUri] = useState([]);
  const [labResultmultipleFile, setLabResultMultipleFile] = useState([]);
  const [labResulturi, setLabResultUri] = useState([]);
  const [checked, setChecked] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const [visible, SetIsVisible] = useState(false);
  const Height = Dimensions.get('window').height
  const Width = Dimensions.get('window').width
  const [selectedimage, setSelectedImage] = useState('')
  // const onSelectedItemsChange = (id, _selectedItems) => {
  //   setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  // };

  // const Image = (img) => {
  //   console.log('image=====', img)
  //   setSelectedImage(img);
  //   SetIsVisible(true)
  // }

  const onSelectedItemsChange = (id, _selectedItems) => {

    console.log("222222222222222222222222222", _selectedItems)
    if (id == 'allergy' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp1 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp1)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp1 }));
      }

    }
    else if (id == 'medical' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp2 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp2)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp2 }));
      }

    }
    else if (id == 'social' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp3 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp3)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp3 }));
      }
    } else if (id == 'medicine' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp3 = _selectedItems.filter((item) => item != 1);
        console.log("hello Temp", temp3)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp3 }));
      }

    }

    else if (id == 'lab' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp3 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp3)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp3 }));
      }

    }
    else if (id == 'sergical' && _selectedItems.includes(1)) {
      if (_selectedItems[_selectedItems.length - 1] == 1) {
        setSelectedItems((prevData) => ({ ...prevData, [id]: [1] }));
      } else {
        let temp3 = _selectedItems.filter(item => item != 1)
        console.log("hello Temp", temp3)
        setSelectedItems((prevData) => ({ ...prevData, [id]: temp3 }));
      }

    }
    else {
      setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
      console.log("========Else===========", _selectedItems)
    }
  };
  console.log("=====Selected Item 12345==============", selectedItems)


  const [allergy, setAllergy] = useState([]);
  const [medical, setMedical] = useState([]);
  const [sergical, setSergical] = useState([]);
  const [social, setSocial] = useState([]);
  const [medicine, setMedicine] = useState([]);
  const [lab, setLab] = useState([]);
  const [otherallergy, setOtherallergy] = useState('');
  const [othersurgicalhistory, setOthersurgicalhistory] = useState('');
  const [othersocialhistory, setOthersocialhistory] = useState('');
  const [otherlab, setOtherlab] = useState('');
  const [othermed, setOthermed] = useState('');
  const [othermedical, setOthermedical] = useState('');
  const [socialhistorytype, setSocialhistorytype] = useState([
    'Daily',
    'Daily',
  ]);
  const [frequency, setFrequency] = useState(['1', '1']);
  const [socialitem, setSociaitem] = useState();
  const [isModalVisible, SetIsModalVisible] = useState();
  const [feet, setFeet] = useState('0');
  const [inch, setInch] = useState('0');
  const [weight, setWeight] = useState('');
  const [bloodgroup, setBloodgroup] = useState([]);
  const [bloodsugar, setBloodsugar] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = React.useState({ iserror: false, message: '' });
  // const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'A+', value: 'A+' },
    { label: 'B+', value: 'B+' },
    { label: 'AB+', value: 'AB+' },
    { label: 'O+', value: 'O+' },
    { label: 'A-', value: 'A-' },
    { label: 'B-', value: 'B-' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O-', value: 'O-' },
  ]);
  useEffect(() => {
    const socialobject = mapObject(social);
    const SocialItem = selectedItems?.['social']?.reduce(
      (acc, cur, i) => ({ ...acc, [socialobject[cur]]: i }),
      {}
    );
    setSociaitem(SocialItem);
  }, [selectedItems, social]);
  useEffect(() => {
    getdata();
    getallergy();
    getmedical();
    getsergical();
    getlab();
    getmedicine();
    getsocial();
    getextradetails();
  }, []);
  // const incrementCount = () => {
  //   setFrequency(frequency + 1);
  // };
  // const decrementCount = () => {
  //   setFrequency(frequency - 1);
  // };

  const [name, setName] = React.useState('');
  const [image, SetImage] = React.useState('');
  const [dob, setDob] = useState('');
  const getdata = async () => {
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
    await Apis.profileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        setName(response.data.response.name);
        setDob(response.data.response.dob);
        SetImage(response.data.response.profile_image);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getextradetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);

    let token = usertoken;
    console.log('token123=', token);
    console.log('user id =====>>>>', user_id);
    const data = {
      user_id: user_id,
    };
    setLoding(true);
    await Apis.addheightdetails(data)

      .then((response) => {
        console.log('details======>', response.data.response);
        setFeet(response.data.response.feet);
        setInch(response.data.response.inch);
        setWeight(JSON.parse(response.data.response.weight).toString());
        setBloodgroup(response.data.response.blood_gr);
        setBloodsugar(
          JSON.parse(response.data.response.blood_suger_level).toString()
        );
        setLoding(false);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getallergy = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    setLoding(true);
    await Apis.getallergy(token)

      .then((response) => {
        // console.log('allergy======>', response.data.response);
        setAllergy(response.data.response);
        getAllergydetails();
        setLoding(false);
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getmedical = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getmedicalhistory(token)

      .then((response) => {
        // console.log('medical======>', response.data.response);
        setMedical(response.data.response);
        getmedicaldetails();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };

  const getsergical = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getsurgicalhistory(token)

      .then((response) => {
        // console.log('surgicalhistory======>', response.data.response);
        setSergical(response.data.response);
        getsurgicaldetails();
        getsurgicalimage();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getsocial = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getsocialhistory(token)

      .then((response) => {
        // console.log('socailhistory======>', response.data.response);
        setSocial(response.data.response);
        getsocialhistorydetails();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };

  const getmedicine = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getmedication(token)

      .then((response) => {
        // console.log('medication======>', response.data.response);
        setMedicine(response.data.response);
        getmedicationdetails();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getlab = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    await Apis.getlabresult(token)

      .then((response) => {
        // console.log('labresult======>', response.data.response);
        setLab(response.data.response);
        getlabresultdetails();
        getlabimage();
      })

      .catch((error) => {
        console.error(error.response);
      });
  };
  const getAllergydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.allergydetails(data)

      .then((response) => {
        // console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['allergy']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getsurgicaldetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.surgicalhistorydetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['sergical']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getmedicaldetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.medicalhistorydetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['medical']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getsocialhistorydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.socialhistorydetails(data)

      .then((response) => {
        console.warn('socialhistory========================>', response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['social']: response.data.response.social_history.map((el) => el.id),
        }));
        setSocialhistorytype(response.data.response.social_history_type);
        setFrequency(response.data.response.frequency);
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getlabresultdetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.labresultdetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['lab']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };
  const getmedicationdetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.medicinedetails(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['medicine']: response.data.response.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
  };

  const validator = () => {
    let errMsg;
    if (!feet || feet?.length < 1) {
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: 'Feet field is required',
      }));
      // errMsg = 'Feet field required';
    }
    else if (!inch || inch?.length < 1) {
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: 'Inch field is required',
      }));
      // errMsg = 'Inch field required';
    }
    else if (!weight || weight?.length < 1) {
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: 'Weight field is required',
      }));
      // errMsg = 'Weight field required';
    }
    else if (!bloodgroup || bloodgroup?.length < 1) {
      setError((dat) => ({
        ...dat,
        iserror: true,
        message: 'Blood group field is required',
      }));
      // errMsg = 'Bloodgroup field required';
    }
    else if (!bloodsugar || bloodsugar?.length < 1) {

      setError((dat) => ({
        ...dat,
        iserror: true,
        message: 'Blood sugar field is required',
      }));
      //errMsg = 'Bloodsugar field required';
    }
    // if (labResultmultipleFile.length != selectedItems['lab'].length) { alert("Please Give Proper details for labresult option") }
    // else if (multipleFile.length != selectedItems['sergical'].length) { alert("Please Give Proper details for Surgicalresult option") }
    // else if (selectedItems['allergy'].length < 1) { alert("Please select any allergy type") }
    // else if (selectedItems['medical'].length < 1) { alert("Please select any medical history type") }
    // else if (selectedItems['sergical'].length < 1) { alert("Please select any surgical history type") }
    // else if (selectedItems['medicine'].length < 1) { alert("Please select any Madication type") }
    // else if (selectedItems['lab'].length < 1) { alert("Please select any lab result type") }
    // else { getProfileextraupdate(); }
    return errMsg;
  };

  const getProfileextraupdate = async () => {
    NewCertificate.length = 0;
    NewLabCertificate.length = 0;
    let userid = await AsyncStorage.getItem('userid');
    const authtoken = await AsyncStorage.getItem('authtoken');
    const token = authtoken;
    let user_id = JSON.parse(userid);
    console.log('auth token =====>>>>', token);
    console.log('user id =====>>>>', user_id);
    const formData = new FormData();

    formData.append('user_id', user_id);
    formData.append('allergy[]', selectedItems['allergy']?.toString());
    formData?.append(
      'surgical_history[]',
      selectedItems['sergical']?.toString()
    );
    formData?.append('social_history[]', selectedItems['social']?.toString());
    formData?.append('medications[]', selectedItems['medicine']?.toString());
    formData?.append('lab_result[]', selectedItems['lab']?.toString());
    formData?.append('medical_history[]', selectedItems['medical']?.toString());
    // multipleFile.forEach((el, index) => {
    //   console.log(el);
    //   if (el?.size !== undefined && el?.uri !== undefined) {
    //     formData.append(`surgery_images[${index}]`, el);
    //   } else {
    //     formData.append(`surgery_images[${index}]`, el.name);
    //   }
    // });
    multipleFile.forEach((el, index) => {
      console.log('ele=======', el);
      if (el?.size !== undefined && el?.uri !== undefined) {
        formData.append(`surgery_images[]`, el);
      } else {
        NewCertificate.push(el.name);
      }
    });
    if (NewCertificate.length > 0) {
      formData.append(`new_surgical_images`, NewCertificate.toString());
    }
    if (multipleFile.length < 1) {
      formData.append(`surgery_images`, '');
    }

    // labResultmultipleFile.forEach((el, index) => {
    //   console.log(el);
    //   if (el?.size !== undefined && el?.uri !== undefined) {
    //     formData.append(`lab_result_images[]`, el);
    //   } else {
    //     formData.append(`lab_result_images`, el.name);
    //   }
    // });
    labResultmultipleFile.forEach((el, index) => {
      console.log('ele=======', el);
      if (el?.size !== undefined && el?.uri !== undefined) {
        formData.append(`lab_result_images[]`, el);
      } else {
        NewLabCertificate.push(el.name);
      }
    });
    if (NewCertificate.length > 0) {
      formData.append(`new_lab_result_images`, NewLabCertificate.toString());
    }
    if (labResultmultipleFile.length < 1) {
      formData.append(`lab_result_images`, '');
    }
    formData.append('other_allergy', otherallergy);
    formData.append('other_surgical_history', othersurgicalhistory);
    formData.append('other_social_history', othersocialhistory);
    formData.append('other_lab', otherlab);
    formData.append('social_history_type[]', socialhistorytype);
    formData.append('frequency[]', frequency);
    formData.append('other_medical', othermedical);
    formData.append('other_med', othermed);
    formData.append('weight', weight);
    formData.append('feet', feet);
    formData.append('inch', inch);
    formData.append('blood_gr', bloodgroup);
    formData.append('blood_suger_level', bloodsugar);
    console.log('from---', formData);
    await Apis.profileDetails(formData, token)
      .then((response) => {
        console.log('sucess response=====>', response.data);
        SetIsModalVisible(true);
        // CommonToast.showToast('Information submitted successfully', 'success');
      })
      .catch((error) => {
        console.error('error response======>', error.response.data);
        if (
          error.response.data.errors.weight[0] ===
          'The weight must be a number.'
        ) {
          setError((dat) => ({
            ...dat,
            iserror: true,
            message: error.response.data.errors.weight,
          }));
        }
      });
  };

  const getlabimage = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.labresultimages(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);

        setLabResultMultipleFile(
          response.data.response.lab_result_images[0]
            ? response.data.response.lab_result_images.map((el, i) => ({
              name: el,
            }))
            : []
        );
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getsurgicalimage = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    await Apis.surgicalimages(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);

        setMultipleFile(
          response.data.response.surgical_images[0]
            ? response.data.response.surgical_images.map((el, i) => ({
              name: el,
            }))
            : []
        );
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  // console.log('multiple', multipleFile[0].name);
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
    }).then((image) => {
      // setUri(prevdata=> [...prevdata, image]);
      setMultipleFile((prevData) => [
        ...prevData,
        {
          fileCopyUri: null,
          size: image.size,
          type: image.mime,
          uri: image.path,
          name: image.path.split('/').slice(-1)[0],
        },
      ]);
      console.log(image.path.split('/').slice(-1)[0]);
    });
  };
  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],

        //There can me more options as well find above
      });
      console.log('docu', results);
      //Setting the state to show multiple file attributes
      setMultipleFile((prevData) => {
        const filteredArr = results.filter((el) =>
          prevData.every((prevEl) => prevEl.name !== el.name)
        );
        return [...prevData, ...filteredArr];
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleDeleteFile = (index) => {
    setMultipleFile((prevData) => prevData.filter((el, i) => i !== index));
  };

  const handleDeleteCaptureImage = (modificationDate) => {
    setUri((prevData) =>
      prevData.filter((el) => el.modificationDate !== modificationDate)
    );
  };

  const openLabResultCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
    }).then((image) => {
      // setLabResultUri((prevData) => [...prevData, image]);
      setLabResultMultipleFile((prevData) => [
        ...prevData,
        {
          fileCopyUri: null,
          size: image.size,
          type: image.mime,
          uri: image.path,
          name: image.path.split('/').slice(-1)[0],
        },
      ]);
    });
  };
  const selectLabResultMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
          DocumentPicker.types.images,
        ],

        //There can me more options as well find above
      });
      //Setting the state to show multiple file attributes
      setLabResultMultipleFile((prevData) => {
        const filteredArr = results.filter((el) =>
          prevData.every((prevEl) => prevEl.name !== el.name)
        );
        return [...prevData, ...filteredArr];
      });
    } catch (err) {
      //Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Canceled from multiple doc picker');
      } else {
        //For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const handleLabResultDeleteFile = (index) => {
    setLabResultMultipleFile((prevData) =>
      prevData.filter((el, i) => i !== index)
    );
  };

  const handleLabResultDeleteCaptureImage = (modificationDate) => {
    setLabResultUri((prevData) =>
      prevData.filter((el) => el.modificationDate !== modificationDate)
    );
  };
  const handleClose = () => {
    SetIsModalVisible(false);
  };
  if (isModalVisible === false) {
    props.navigation.goBack(null);
  }
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView style={{ margin: 15 }} showsVerticalScrollIndicator={false}>
          {loading ? (
            <Spinner
              //visibility of Overlay Loading Spinner
              visible={loading}
              //Text with the Spinner
              textContent={'Loading...'}
              textStyle={{ color: '#fff' }}
            />
          ) : null}
          <Snackbar
            visible={error?.iserror}
            onDismiss={onDismissSnackBar}
            duration={2000}
            style={{
              backgroundColor: '#d15656',
              bottom: 0,
              zIndex: 1000,
            }}
          // wrapperStyle={{ position: 'absolute' }}
          >
            {error.message}
          </Snackbar>
          {/* <Title style={{ marginVertical: 5 }}>Patient overview</Title> */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              //  marginHorizontal: 5,
              marginTop: 20,
              // width: '95%'
            }}
          >
            <TouchableOpacity onPress={() => { SetIsVisible(true), console.log(image) }} >
              <Avatar.Image style={{ marginRight: 5, }} source={{ uri: image }}
              />
            </TouchableOpacity>
            <Card
              style={{ flex: 1, borderRadius: 15, backgroundColor: '#fff', width: '100%' }}
            >
              <Card.Content
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ marginRight: 10, width: '55%' }}>
                  <Paragraph style={{ color: '#000' }}>{name}</Paragraph>
                  <Paragraph style={{ color: '#000' }}>DOB: {dob}</Paragraph>
                </View>
                <View>
                  <Paragraph style={{ color: '#000' }}>
                    Height: {feet}'{inch}"
                  </Paragraph>
                  <Paragraph style={{ color: '#000' }}>
                    Weight: {weight} lbs
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          </View>

          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>Allergy</Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={allergy}
                  uniqueKey="id"
                  // onToggleList={getallergy}
                  selectedItems={selectedItems['allergy']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('allergy', item)
                  }
                />
                {selectedItems['allergy']?.some(
                  (element) => mapObject(allergy)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      label="Add Your History"
                      value={otherallergy}
                      onChangeText={(text) => {
                        if (text.length < 20) {
                          setOtherallergy(text);
                        }
                      }}
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      placeholder=""
                      outlineColor={'#2173A8'}
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        }
                      }}
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
              </Card.Content>
            </Card>
          </View>
          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>
              Medical History
            </Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={medical}
                  uniqueKey="id"
                  // onToggleList={getmedical}
                  selectedItems={selectedItems['medical']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('medical', item)
                  }
                />
                {selectedItems['medical']?.some(
                  (element) => mapObject(medical)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      label="Add Your History"
                      value={othermedical}
                      onChangeText={(text) => setOthermedical(text)}
                      placeholder=""
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      outlineColor={'#2173A8'}
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        }
                      }}
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
              </Card.Content>
            </Card>
          </View>

          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>
              Surgical History
            </Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={sergical}
                  uniqueKey="id"
                  // onToggleList={getsergical}
                  selectedItems={selectedItems['sergical']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('sergical', item)
                  }
                />
                {selectedItems['sergical']?.some(
                  (element) => mapObject(sergical)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      label="Add Your History"
                      value={othersurgicalhistory}
                      onChangeText={(text) => setOthersurgicalhistory(text)}
                      placeholder=""
                      outlineColor={'#2173A8'}
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        },
                      }}
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',
                        marginBottom: 10
                      }}
                    />
                  )}
                <View>

                  {multipleFile.map((element, i) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                      }}
                    >
                      <TouchableOpacity style={{ width: '90%' }}
                        //    onPress={() => Image(element.name)}
                        onPress={() => {
                          // console.log('i==', i);
                          // console.log('file==', multipleFile[i].name)
                          Linking.openURL(multipleFile[i].name)
                        }


                        }
                      >
                        <Text style={{ color: '#000' }}>
                          {element.name.split('/').pop()}
                        </Text>
                      </TouchableOpacity>
                      <IconButton
                        icon="delete"
                        color="red"
                        size={20}
                        onPress={() => handleDeleteFile(i)}
                      />
                    </View>
                  ))}
                  {/* {uri.map((imageBlob,i) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                      }}
                    >
                      <Text style={{ color: '#000', width: '90%' }}>
                        {imageBlob.name.split('/').pop()}
                        
                      </Text>
                      <IconButton
                        icon="delete"
                        color="red"
                        size={20}
                        onPress={() =>
                          handleDeleteFile(i)
                        }
                      />
                    </View>
                  ))} */}

                  <View
                    style={{
                      width: 90,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignSelf: 'flex-end',
                      padding: 5,
                      borderWidth: 1,
                      borderRadius: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => { if (selectedItems['sergical'].includes(1)) { alert('You cannot select any file') } else { selectMultipleFile() } }}
                      style={{ alignSelf: 'center' }}
                    >
                      <Icon name="addfile" size={18} color="#2173A8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { if (selectedItems['sergical'].includes(1)) { alert('You cannot select any file') } else { openCamera() } }}
                      style={{ alignSelf: 'center' }}
                    >
                      <Icon name="camera" size={18} color="#2173A8" />
                    </TouchableOpacity>
                  </View>

                </View>
              </Card.Content>
            </Card>
          </View>
          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>
              Social History
            </Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={social}
                  uniqueKey="id"
                  // onToggleList={getsocial}
                  selectedItems={selectedItems['social']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('social', item)
                  }
                />
                {selectedItems['social']?.some(
                  (element) => mapObject(social)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      label="Add Your History"
                      value={othersocialhistory}
                      onChangeText={(text) => setOthersocialhistory(text)}
                      placeholder=""
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      outlineColor={'#2173A8'}
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        },
                      }}
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',
                      }}
                    />
                  )}
                {selectedItems['social']?.some(
                  (element) => mapObject(social)[element] === 'Smoking'
                ) && (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',

                            alignItems: 'center',
                          }}
                        >
                          <Checkbox.Item
                            set
                            label="Daily"
                            status={
                              socialhistorytype[socialitem?.['Smoking']] ===
                                'Daily'
                                ? 'checked'
                                : 'unchecked'
                            }
                            labelStyle={{ color: '#000' }}
                            uncheckedColor={'#000'}
                            onPress={() => {
                              setSocialhistorytype((data) => {
                                const updateddata = [...data];
                                updateddata[socialitem?.['Smoking']] = 'Daily';
                                return updateddata;
                              });
                            }}
                          />
                          <Checkbox.Item
                            label="Occasionally"
                            status={
                              socialhistorytype[socialitem?.['Smoking']] ===
                                'Occassionally'
                                ? 'checked'
                                : 'unchecked'
                            }
                            labelStyle={{ color: '#000' }}
                            uncheckedColor={'#000'}
                            onPress={() => {
                              setSocialhistorytype((data) => {
                                const updateddata = [...data];
                                updateddata[socialitem?.['Smoking']] =
                                  'Occassionally';
                                return updateddata;
                              });
                            }}
                          />
                        </View>
                      </View>

                      <TextInput
                        mode="outlined"
                        label="Add Frequency"
                        maxLength={20}
                        value={frequency[socialitem?.['Smoking']]}
                        onChangeText={(text) =>
                          setFrequency((data) => {
                            const updateddata = [...data];
                            updateddata[socialitem?.['Smoking']] = text;
                            return updateddata;
                          })
                        }
                        // right={<TextInput.Icon name="plus" />}
                        // left={
                        //   <TextInput.Icon name="minus" style={{ color: 'blue' }} />
                        // }
                        type="number"
                        //keyboardType="number-pad"
                        placeholder=""
                        outlineColor={'#2173A8'}
                        theme={{
                          colors: {
                            text: '#000',
                            placeholder: '#000'
                          },
                        }}
                        style={{
                          borderRadius: 50,
                          elevation: 0,
                          backgroundColor: '#fff',
                        }}
                      />
                    </View>
                  )}
                {selectedItems['social']?.some(
                  (element) => mapObject(social)[element] === 'Drinking'
                ) && (
                    <View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-evenly',
                          alignItems: 'center',
                        }}
                      >
                        <View
                          style={{
                            flexDirection: 'row',

                            alignItems: 'center',
                          }}
                        >
                          <Checkbox.Item
                            set
                            label="Daily"
                            status={
                              socialhistorytype[socialitem?.['Drinking']] ===
                                'Daily'
                                ? 'checked'
                                : 'unchecked'
                            }
                            labelStyle={{ color: '#000' }}
                            uncheckedColor={'#000'}
                            onPress={() => {
                              setSocialhistorytype((data) => {
                                const updateddata = [...data];
                                updateddata[socialitem?.['Drinking']] = 'Daily';
                                return updateddata;
                              });
                            }}
                          />
                          <Checkbox.Item
                            label="Occasionally"
                            status={
                              socialhistorytype[socialitem?.['Drinking']] ===
                                'Occassionally'
                                ? 'checked'
                                : 'unchecked'
                            }
                            labelStyle={{ color: '#000' }}
                            uncheckedColor={'#000'}
                            onPress={() => {
                              setSocialhistorytype((data) => {
                                const updateddata = [...data];
                                updateddata[socialitem?.['Drinking']] =
                                  'Occassionally';
                                return updateddata;
                              });
                            }}
                          />
                        </View>
                      </View>

                      <TextInput
                        mode="outlined"
                        label="Add Frequency"
                        value={frequency[socialitem?.['Drinking']]}
                        onChangeText={(text) =>
                          setFrequency((data) => {
                            const updateddata = [...data];
                            updateddata[socialitem?.['Drinking']] = text;
                            return updateddata;
                          })
                        }
                        // right={
                        //   <TextInput.Icon name="plus" onPress={incrementCount} />
                        // }
                        // left={
                        //   <TextInput.Icon name="minus" onPress={decrementCount} />
                        // }
                        placeholder=""
                        outlineColor={'#2173A8'}
                        theme={{
                          colors: {
                            text: '#000',
                            placeholder: '#000'
                          },
                        }}
                        maxLength={20}
                        style={{
                          borderRadius: 50,
                          elevation: 0,
                          backgroundColor: '#fff',
                        }}
                      // keyboardType="number-pad"
                      />
                    </View>
                  )}
              </Card.Content>
            </Card>
          </View>
          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>
              Medication
            </Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={medicine}
                  uniqueKey="id"
                  // onToggleList={getmedicine}
                  selectedItems={selectedItems['medicine']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('medicine', item)
                  }
                />
                {selectedItems['medicine']?.some(
                  (element) => mapObject(medicine)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      value={othermed}
                      onChangeText={(text) => setOthermed(text)}
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      label="Add Your History"
                      placeholder=""
                      outlineColor={'#2173A8'}
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        },
                      }}
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',

                      }}
                    />
                  )}
              </Card.Content>
            </Card>
          </View>
          <View>
            <Title style={{ marginVertical: 5, color: '#000' }}>
              Lab Result
            </Title>
            <Card
              style={{
                borderRadius: 15,
                marginHorizontal: 10,
                backgroundColor: '#fff',
              }}
            >
              <Card.Content>
                <MultiSelect
                  items={lab}
                  uniqueKey="id"
                  // onToggleList={getlab}
                  selectedItems={selectedItems['lab']}
                  onSelectedItemsChange={(item) =>
                    onSelectedItemsChange('lab', item)
                  }
                />
                {selectedItems['lab']?.some(
                  (element) => mapObject(lab)[element] === 'Others'
                ) && (
                    <TextInput
                      mode="outlined"
                      label="Add Your History"
                      value={otherlab}
                      onChangeText={(text) => setOtherlab(text)}
                      placeholder=""
                      outlineColor={'#2173A8'}
                      keyboardType={
                        Platform.OS === 'ios'
                          ? 'ascii-capable'
                          : 'visible-password'
                      }
                      style={{
                        borderRadius: 50,
                        elevation: 0,
                        backgroundColor: '#fff',
                        marginBottom: 10
                      }}
                      theme={{
                        colors: {
                          text: '#000',
                          placeholder: '#000'
                        },
                      }}
                    />
                  )}
                <View>
                  {labResultmultipleFile.map((element, i) => (
                    <View
                      key={i}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                      }}
                    >
                      <TouchableOpacity style={{ width: '90%' }}
                        //    onPress={() => Image(element.name)}
                        onPress={() => {
                          // console.log('i==', i);
                          // console.log('file==', multipleFile[i].name)
                          Linking.openURL(labResultmultipleFile[i].name)
                        }


                        }
                      >
                        <Text style={{ width: '90%', color: '#000' }}>
                          {element.name.split('/').pop()}
                        </Text>
                      </TouchableOpacity>
                      <IconButton
                        icon="delete"
                        color="red"
                        size={20}
                        onPress={() => handleLabResultDeleteFile(i)}
                      />
                    </View>
                  ))}
                  {/* {labResulturi.map((imageBlob) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: 5,
                      }}
                    >
                      <Text style={{ color: '#000', width: '90%' }}>
                        {imageBlob.path.split('/').slice(-1)[0]}
                      </Text>
                      <IconButton
                        icon="delete"
                        color="red"
                        size={20}
                        onPress={() =>
                          handleLabResultDeleteCaptureImage(
                            imageBlob.modificationDate
                          )
                        }
                      />
                    </View>
                  ))} */}
                  <View
                    style={{
                      width: 90,
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                      alignSelf: 'flex-end',
                      padding: 5,
                      borderWidth: 1,
                      borderRadius: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => { if (selectedItems['lab'].includes(1)) { alert('You cannot select any file') } else { selectLabResultMultipleFile() } }}
                      style={{ alignSelf: 'center' }}
                    >
                      <Icon name="addfile" size={18} color="#2173A8" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => { if (selectedItems['lab'].includes(1)) { alert('You cannot select any file') } else { openLabResultCamera() } }}
                      style={{ alignSelf: 'center' }}
                    >
                      <Icon name="camera" size={18} color="#2173A8" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </View>
          <Title style={{ marginVertical: 5, color: '#000' }}>Height</Title>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            <TextInput
              mode="outlined"
              label="Feet*"
              maxLength={2}
              value={feet}
              onChangeText={(Text) => {
                console.log('text==============>', Text);
                let cngfeet = Text;
                if (Text) {
                  cngfeet = Number.parseInt(Text).toString();
                }

                setFeet(cngfeet);
              }}
              type="text"
              keyboardType="number-pad"
              placeholder=""
              right={
                <TextInput.Affix text="ft" textStyle={{ color: '#000' }} />
              }
              theme={{
                colors: {
                  text: 'black',
                  placeholder: '#2173A8',
                },
              }}
              outlineColor={'#2173A8'}
              // keyboardType="decimal-pad"
              style={{
                borderRadius: 50,
                elevation: 0,
                marginHorizontal: 15,
                backgroundColor: '#fff',
                width: '43%',
                // marginTop: 10,
              }}
            />
            <TextInput
              mode="outlined"
              label="inch*"
              maxLength={2}
              value={inch}
              onChangeText={(Text) => {
                let cnginch = Text;
                if (Text) {
                  cnginch = Number.parseInt(Text).toString();
                }

                setInch(cnginch);
              }}
              type="number"
              keyboardType="number-pad"
              placeholder=""
              right={
                <TextInput.Affix text="in" textStyle={{ color: '#000' }} />
              }
              outlineColor={'#2173A8'}
              theme={{
                colors: {
                  text: 'black',
                  placeholder: '#2173A8',
                },
              }}
              style={{
                borderRadius: 50,
                elevation: 0,
                width: '43%',
                backgroundColor: '#fff',
                // marginTop: 10,
              }}
            />
          </View>
          <Title style={{ marginVertical: 5, fontsize: 5, color: '#000' }}>
            Weight
          </Title>
          <TextInput
            mode="outlined"
            maxLength={3}
            value={weight}
            label="Weight*"
            onChangeText={(text) => setWeight(text)}
            type="number"
            keyboardType="number-pad"
            right={<TextInput.Affix text="lbs" textStyle={{ color: '#000' }} />}
            placeholder=""
            outlineColor={'#2173A8'}
            theme={{
              colors: {
                text: 'black',
                placeholder: '#2173A8',
              },
            }}
            style={{
              borderRadius: 50,
              elevation: 0,
              marginHorizontal: 20,
              backgroundColor: '#fff',
              // marginTop: 10,
            }}
          />
          {/* <Title style={{ marginVertical: 5, color: '#000' }}>
            Blood Group
          </Title>

          <DropDownPicker
            open={open}
            value={bloodgroup}
            items={items}
            setOpen={setOpen}
            setValue={setBloodgroup}
            placeholder="Blood Group"
            setItems={setItems}
            autoScroll={true}
            flatListProps={{
              decelerationRate: 'fast',
            }}
            maxHeight={500}
            style={{ backgroundColor: '#fff', borderColor: '#2173A8' }}
            labelStyle={{
              width: '89%',
            }}
            containerStyle={{
              marginHorizontal: '6%',

              marginTop: 3,
              width: '88%',
            }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />

          <Title style={{ marginVertical: 5, color: '#000' }}>
            Blood Sugar
          </Title>
          <TextInput
            mode="outlined"
            label="Blood Sugar"
            maxLength={3}
            value={bloodsugar}
            onChangeText={(text) => setBloodsugar(text)}
            // type="number"
            keyboardType="number-pad"
            placeholder=""
            outlineColor={'#2173A8'}
            theme={{
              colors: {
                text: 'black',
                placeholder: '#2173A8',
              },
            }}
            style={{
              borderRadius: 50,
              elevation: 0,
              marginHorizontal: 20,
              backgroundColor: '#fff',
              // marginTop: 10,
            }}
          /> */}
          <View style={{ marginHorizontal: 30, marginTop: 30 }}>
            <Button
              style={{ fontSize: 32 }}
              mode="contained"
              color="#2173A8"
              uppercase={false}
              contentStyle={{ height: 54 }}
              onPress={() => {
                const err = validator();
                console.log('kkkkk', err);
                if (err === undefined) {
                  console.log(err);
                  if (selectedItems['allergy'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any allergy type",
                    }))
                  }
                  else if (selectedItems['medical'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any medical history type"
                    }))
                  }
                  else if (selectedItems['sergical'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any surgical history type",
                    }))
                  }
                  else if (selectedItems['medicine'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any medication type",
                    }))
                  }
                  else if (selectedItems['social'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any social history type",
                    }))
                  }
                  else if (selectedItems['lab'].length < 1) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please select any lab result type",
                    }))
                  }
                  else if (selectedItems['sergical'].includes(1) && multipleFile.length > 0) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please delete file from surgical history option.",
                    }))
                  }
                  else if (selectedItems['lab'].includes(1) && labResultmultipleFile.length > 0) {
                    setError((dat) => ({
                      ...dat,
                      iserror: true,
                      message: "Please delete file from lab result option.",
                    }))
                  }
                  else if ((selectedItems['lab'] == 1 && labResultmultipleFile.length > 0)) { alert("Please give proper details for lab result option") }
                  else if ((selectedItems['sergical'] == 1 && multipleFile.length > 0)) { alert("Please give proper details for surgical result option") }
                  else { getProfileextraupdate(); }
                  /// getProfileextraupdate();
                } else {
                  setError(error.message);
                }
              }}
            >
              Submit
            </Button>
          </View>
        </ScrollView>
        <SuccessfullySubmitModal
          isModalVisible={isModalVisible}
          onClose={handleClose}
          style={{ top: '10%' }}
        />
        <Modal
          transparent
          animationType="none"

          visible={visible}
        // onRequestClose={() => {
        //   SetIsVisible(!visible);
        // }}
        //  style={{ width: '100%', height: '100%', backgroundColor: 'red' }}

        // animationIn="zoomIn"
        // animationOut="zoomOut"
        >
          <View style={{ height: Height, width: Width, backgroundColor: '#fff' }}>

            <IconButton
              icon="close"
              size={26}
              color="red"
              style={{ alignSelf: 'flex-end' }}
              onPress={() => SetIsVisible(false)}
            />



            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            />

          </View>

        </Modal>
      </SafeAreaView >
    </>
  );
};

const styles = StyleSheet.create({});
