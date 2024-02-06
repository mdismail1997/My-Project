import React, { useState, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ToastAndroid,
  Animated,
  SafeAreaView,
  Image,
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

// const mapObject = data
//   .flatMap((el) => el.value)
//   .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
const mapObject = (value) =>
  value.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.name }), {});
let NewCertificate = [];
let NewLabCertificate = [];
export const AddDetails = (props) => {
  const [loading, setLoding] = useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [multipleFile, setMultipleFile] = useState([]);
  const [uri, setUri] = useState([]);
  const [labResultmultipleFile, setLabResultMultipleFile] = useState([]);
  const [labResulturi, setLabResultUri] = useState([]);
  const [checked, setChecked] = React.useState(false);
  const [check, setCheck] = React.useState(false);
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
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
  const [weight, setWeight] = useState([]);
  const [bloodgroup, setBloodgroup] = useState([]);
  const [bloodsugar, setBloodsugar] = useState([]);
  const [open, setOpen] = useState(false);
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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    const socialobject = mapObject(social);
    const SocialItem = selectedItems?.['social']?.reduce(
      (acc, cur, i) => ({ ...acc, [socialobject[cur]]: i }),
      {}
    );
    setSociaitem(SocialItem);
  }, [selectedItems, social]);
  useEffect(() => {
    getallergy();
    getmedical();
    getsergical();
    getlab();
    getmedicine();
    getsocial();
    getAllergydetails();
    getmedicaldetails();
    getsurgicaldetails();
    getsurgicalimage();
    getmedicationdetails();
    getlabresultdetails();
    getlabimage();
  }, []);
  // const incrementCount = () => {
  //   setFrequency(frequency + 1);
  // };
  // const decrementCount = () => {
  //   setFrequency(frequency - 1);
  // };

  const [errmsg, setErrMsg] = React.useState();

  React.useEffect(() => {
    console.log('===>', props.route.params?.birthyear);
  }, [
    props.route.params.mail,
    props.route.params.categoryid,
    props.route.params.category,
    props.route.params.inch,
    props.route.params.weight,
    props.route.params.feet,
    props.route.params?.birthyear,
    props.route.params?.userid,
    props.route.params?.name,
    props.route.params?.dob,
  ]);

  const getallergy = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    console.log('token123=', token);
    setLoding(true);
    await Apis.getallergy(token)

      .then((response) => {
        console.log('allergy======>', response.data.response);
        setAllergy(response.data.response);

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
        console.log('medical======>', response.data.response);
        setMedical(response.data.response);
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
        console.log('surgicalhistory======>', response.data.response);
        setSergical(response?.data.response);
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
        console.log('socailhistory======>', response.data.response);
        setSocial(response.data.response);
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
        console.log('medication======>', response.data.response);
        setMedicine(response.data.response);
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
        console.log('labresult======>', response.data.response);
        setLab(response.data.response);
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
      email: props.route.params.mail,
    };

    await Apis.allergyqyickvisit(data)

      .then((response) => {
        console.warn('ljk', response.data.response);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['allergy']: response?.data?.response?.map((el) => el.id),
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
      email: props.route.params.mail,
    };

    await Apis.surgicalqyickvisit(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['sergical']: response?.data?.response?.map((el) => el.id),
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
      email: props.route.params.mail,
    };

    await Apis.medicalhistoryqyickvisit(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['medical']: response?.data?.response?.map((el) => el.id),
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
      email: props.route.params.mail,
    };

    await Apis.labresultqyickvisit(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['lab']: response?.data?.response?.map((el) => el.id),
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
      email: props.route.params.mail,
    };

    await Apis.medicationqyickvisit(data)

      .then((response) => {
        console.warn(response.data);

        setSelectedItems((prevData) => ({
          ...prevData,
          ['medicine']: response?.data?.response?.map((el) => el.id),
        }));
      })
      .catch((error) => {
        console.error(error.response);
      });
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
    formData?.append('med_id[]', selectedItems['medicine']?.toString());
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
        formData.append(`surgical_result[]`, el);
      } else {
        NewCertificate.push(el.name);
      }
    });
    if (NewCertificate.length > 0) {
      formData.append(`new_surgery_images`, NewCertificate.toString());
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
    formData.append('weight', props.route.params.weight);
    formData.append('feet', props.route.params.feet);
    formData.append('inch', props.route.params.inch);
    formData.append('email', props.route.params.mail);
    formData.append('gender', props.route.params?.category);
    formData.append('year', props.route.params?.birthyear);
    formData.append('email', props.route.params.mail);
    formData.append('name', props.route.params.name);
    formData.append('dob', props.route.params.dob);
    console.log('from---', formData);
    await Apis.quickvisitdatasave(formData, token)
      .then((response) => {
        console.log('sucess response=====>', response.data);
        AsyncStorage.setItem('visitid', response.data.visit_id);
        /* props.navigation.navigate('BodyParts', {
          categoryid: props.route.params?.categoryid,
          category: props.route.params?.category,
          userid: props.route.params?.userid,
          mail: props.route.params?.mail,
        }); */
        props.navigation.replace('ProblemList', {
          userid: props.route.params?.userid,
          mail: props.route.params.mail,
          birthyear: props.route.params.dob.split('-')[0],
          gender: props.route.params?.category,
        });
        // CommonToast.showToast('Information submitted successfully', 'success');
      })
      .catch((error) => {
        console.error('error response======>', error.response);
        setLoding(false);
      });
  };

  const validator = () => {
    //console.log('all--------', name, mobno, location, gender, npi, dea);
    let errMsg;
    if (
      !selectedItems['allergy']?.toString() ||
      selectedItems['allergy']?.toString()?.length < 1
    ) {
      errMsg = 'Allergy field required';
    }
    if (
      !selectedItems['sergical']?.toString() ||
      selectedItems['sergical']?.toString()?.length < 1
    ) {
      errMsg = 'Surgigal History filed required';
    }
    // if (!weight || weight?.length < 1) {
    //   errMsg = 'Weight field required';
    // }

    // if (!birthyear || location?.length < 1) {
    //   errMsg = 'BirthYear field required';
    // }

    return errMsg;
  };
  const getlabimage = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      email: props.route.params.mail,
    };

    await Apis.labresultimgqyickvisit(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);

        setLabResultMultipleFile(
          response.data.response.lab_result[0]
            ? response.data.response.lab_result.map((el, i) => ({
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
      email: props.route.params.mail,
    };

    await Apis.surgicalimgqyickvisit(data)

      .then((response) => {
        console.warn('responsedata=================>', response.data);

        setMultipleFile(
          response.data.response.surgical_result[0]
            ? response.data.response.surgical_result.map((el, i) => ({
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
  console.log(uri);
  const openCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
      multiple: true,
    }).then((image) => {
      // setUri((prevData) => [...prevData, image]);
      setMultipleFile((prevData) => [...prevData, { fileCopyUri: null, size: image.size, type: image.mime, uri: image.path, name: image.path.split('/').slice(-1)[0] }])

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
      setLabResultMultipleFile((prevData) => [...prevData, { fileCopyUri: null, size: image.size, type: image.mime, uri: image.path, name: image.path.split('/').slice(-1)[0] }])
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
    props.navigation.replace('PatientProfile');
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Snackbar
        visible={errmsg !== undefined}
        onDismiss={() => {
          setErrMsg(undefined);
        }}
        style={{ backgroundColor: '#d15656', zIndex: 10 }}
      >
        {errmsg}
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row' }}>
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                // Bind opacity to animated value
                opacity: fadeAnim,
              },
            ]}
          >
            {/* <Text style={{ padding: 15 }}>
            Helo {''}
            <Text style={{ color: '#2173A8' }}>
              {props.route.params?.message}
            </Text>{' '}
            Welcome .
          </Text> */}
            <Image
              style={{
                width: 90,
                height: 90,
                marginLeft: 20,
                marginTop: 10,
                marginBottom: 10,
              }}
              source={{
                uri: 'https://thumbs.gfycat.com/ActualAbsoluteBighornedsheep-max-1mb.gif',
              }}
            />
          </Animated.View>
          <Title
            style={{
              marginVertical: 5,
              marginLeft: 20,
              marginTop: 35,
              color: '#000',
            }}
          >
            Patient overview
          </Title>
        </View>

        <View>
          <Title style={{ marginVertical: 5, marginLeft: 20, color: '#000' }}>
            Allergy
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
                    label="Add Your HIstory"
                    value={otherallergy}
                    onChangeText={(text) => {
                      if (text.length < 20) {
                        setOtherallergy(text);
                      }
                    }}
                    placeholder=""
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
                    }}
                  />
                )}
            </Card.Content>
          </Card>
        </View>
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Title style={{ marginVertical: 5, marginLeft: 20, color: '#000' }}>
              Medical History
            </Title>
          </View>
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
                    label="Add Your HIstory"
                    value={othermedical}
                    onChangeText={(text) => setOthermedical(text)}
                    placeholder=""
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
                    }}
                  />
                )}
            </Card.Content>
          </Card>
        </View>

        <View>
          <Title style={{ marginVertical: 5, marginLeft: 20, color: '#000' }}>
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
                    label="Add Your HIstory"
                    value={othersurgicalhistory}
                    onChangeText={(text) => setOthersurgicalhistory(text)}
                    placeholder=""
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
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
                    <Text style={{ width: '90%', color: '#000' }}>
                      {element.name.split('/').pop()}
                    </Text>
                    <IconButton
                      icon="delete"
                      color="red"
                      size={20}
                      onPress={() => handleDeleteFile(i)}
                    />
                  </View>
                ))}
                {uri.map((imageBlob) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: 5,
                    }}
                  >
                    <Text>{imageBlob.path.split('/').slice(-1)[0]}</Text>
                    <IconButton
                      icon="delete"
                      color="red"
                      size={20}
                      onPress={() =>
                        handleDeleteCaptureImage(imageBlob.modificationDate)
                      }
                    />
                  </View>
                ))}
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
                    onPress={selectMultipleFile}
                    style={{ alignSelf: 'center' }}
                  >
                    <Icon name="addfile" size={18} color="#2173A8" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={openCamera}
                    style={{ alignSelf: 'center' }}
                  >
                    <Icon name="camera" size={18} color="#2173A8" />
                  </TouchableOpacity>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
        {/* <View>
          <Title style={{ marginVertical: 5 }}>Social History</Title>
          <Card style={{ borderRadius: 15, marginHorizontal: 10 }}>
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
                  outlineColor="#fff"
                  style={{
                    borderRadius: 50,
                    elevation: 0,
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
                          socialhistorytype[socialitem?.['Smoking']] === 'Daily'
                            ? 'checked'
                            : 'unchecked'
                        }
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
                    maxLength={5}
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
                    keyboardType="number-pad"
                    placeholder=""
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
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
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
                    }}
                    keyboardType="number-pad"
                  />
                </View>
              )}
            </Card.Content>
          </Card>
        </View> */}
        <View>
          <View style={{ flexDirection: 'row' }}>
            <Title style={{ marginVertical: 5, marginLeft: 20, color: '#000' }}>
              Medication
            </Title>
          </View>
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
                    label="Add Your History"
                    placeholder=""
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
                    }}
                  />
                )}
            </Card.Content>
          </Card>
        </View>
        <View>
          <Title style={{ marginVertical: 5, marginLeft: 20, color: '#000' }}>
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
                    outlineColor="#fff"
                    style={{
                      borderRadius: 50,
                      elevation: 0,
                    }}
                  />
                )}

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
                  <Text style={{ width: '90%', color: '#000' }}>
                    {element.name.split('/').pop()}
                  </Text>
                  <IconButton
                    icon="delete"
                    color="red"
                    size={20}
                    onPress={() => handleLabResultDeleteFile(i)}
                  />
                </View>
              ))}
              {labResulturi.map((imageBlob) => (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 5,
                  }}
                >
                  <Text>{imageBlob.path.split('/').slice(-1)[0]}</Text>
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
              ))}
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
                  onPress={selectLabResultMultipleFile}
                  style={{ alignSelf: 'center' }}
                >
                  <Icon name="addfile" size={18} color="#2173A8" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={openLabResultCamera}
                  style={{ alignSelf: 'center' }}
                >
                  <Icon name="camera" size={18} color="#2173A8" />
                </TouchableOpacity>
              </View>
            </Card.Content>
          </Card>
        </View>

        <View style={{ marginHorizontal: 30, marginTop: 20, marginBottom: 10 }}>
          <Button
            style={{ fontSize: 32 }}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            contentStyle={{ height: 54 }}
            // onPress={getProfileextraupdate}
            onPress={() => {
              console.log('ppppp===========', selectedItems['allergy']);
              console.log('ppuuu===========', selectedItems['lab'].length);
              if (labResultmultipleFile.length != selectedItems['lab'].length) { alert("Please Give Proper details for labresult option") }
              else if (multipleFile.length != selectedItems['sergical'].length) { alert("Please Give Proper details for Surgicalresult option") }
              else if (selectedItems['allergy'].length < 1) { alert("Please select any allergy type") }
              else if (selectedItems['medical'].length < 1) { alert("Please select any medical history type") }
              else if (selectedItems['sergical'].length < 1) { alert("Please select any surgical history type") }
              else if (selectedItems['medicine'].length < 1) { alert("Please select any Madication type") }
              else if (selectedItems['lab'].length < 1) { alert("Please select any lab result type") }
              else { getProfileextraupdate(); }
              // const err = validator();
              // console.log('err-----', err);
              // if (!err) {
              //   getProfileextraupdate;
              // } else {
              //   setErrMsg(err);
              // }
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
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({});
