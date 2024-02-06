import {
  View, StyleSheet, ScrollView, SafeAreaView,
  Image, Alert, TouchableOpacity, KeyboardAvoidingView, PermissionsAndroid,
  Platform, ActivityIndicator, Dimensions, Modal, Linking, ToastAndroid
} from 'react-native';
import { Theme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect, useRef } from 'react';
import { TextInput, IconButton, Text, Checkbox, Title, Card, Snackbar, HelperText, } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import * as Apis from '../Services/apis';
import MultiSelect from '../../components/React-Native-Multi-Select';
import { Header } from '../../components/Header/Header';
import Icon from 'react-native-vector-icons/AntDesign';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { element } from 'prop-types';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Geolocation from '@react-native-community/geolocation';
import { Axios, AxiosError } from 'axios';
import { RFValue } from 'react-native-responsive-fontsize';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import { removeEmojis } from '../../components/emojiRegex';

export const EditProfile = (props) => {
  const [selectedItems, setSelectedItems] = useState({});
  const [loading, setLoding] = useState(false);
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');
  const [mobno, setMobno] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [about, setAbout] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [multipleFile, setMultipleFile] = useState([]);
  const [uri, setUri] = useState([]);
  const [cimage, SetImage] = useState('');
  const [gimage, SetGimage] = useState('');
  const [checked, setChecked] = React.useState(false);
  const [certificateFile, setcertificateFile] = useState([]);
  const [certificateuri, setcertificatetUri] = useState([]);
  const [skill, setSkill] = useState([]);
  const [certicatename, setCertificatename] = useState([]);
  const [registration, setRegistration] = useState([]);
  const [certicatenameimg, setCertificatenameimg] = useState([]);
  const [registrationimg, setRegistrationimg] = useState([]);
  const [regpractice, setRegpractice] = useState('');
  const [profilepic, SetProfilePic] = useState();
  const [imagecertificate, setImagecertificate] = useState();
  const [scdate, setScDate] = useState('');
  const [time, setTime] = useState([]);
  const [dea, setDea] = useState('');
  const [license, setLicense] = useState('');
  const [npi, setNpi] = useState('');
  const [experience, setExperience] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [userid, setUserid] = useState();
  const [errmsg, setErrMsg] = useState();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [counrtyname, setCountryname] = useState('');
  const phoneInput = useRef(null);
  const [items, setItems] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Others', value: 'Others' },
  ]);
  const [open, setOpen] = useState(false);
  const [valueex, setValueEx] = useState('');
  const [loding, setLoading] = useState(false);
  const [itemex, setItemsex] = useState([
    { label: 'Years', value: 'Years' },
    { label: 'Months', value: 'Months' },
  ]);
  const [openex, setOpenex] = useState(false);
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const [isModalVisible, SetIsModalVisible] = useState();
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [data, setData] = useState([]);
  const Height = Dimensions.get('window').height
  const Width = Dimensions.get('window').width
  const [visible, SetIsVisible] = useState(false);
  let NewCertificate = [];
  const getlocation = async (longitude, latitude) => {
    try {
      const response = await Apis.getlocation(longitude, latitude);
      setLoding(true);
      setLocation(response.data.results[0]?.formatted_address);
      setLoding(false);
    } catch (error) {
      console.error(error);
    }
  };


  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required',
            message: 'This App needs to Access your location',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

          getOneTimeLocation();
        } else {
          setLocationStatus('Permission Denied');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getOneTimeLocation = () => {
    setLocationStatus('Getting Location ...');
    setLoading(true)
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        setLocationStatus('You are Here');
        getlocation(position.coords.longitude, position.coords.latitude);
        setCurrentLatitude(position.coords.latitude);
        setCurrentLongitude(position.coords.longitude);
        setLoading(false)
      },
      (error) => {
        setLocationStatus(error.message);
        setLoading(false)
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  useEffect(() => {
    getSkill();
    getcertificate();
    getdoctordata();
    getspecialization();
    // getSkill();
    // getcertificate();
  }, []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (picdate) => {
    // const updateddate = picdate.toISOString();
    // // const svedate = updateddate.split('T')[0].replaceAll('-', '/');
    // setDob(updateddate.split('T')[0]);
    const updateddate = moment(picdate).format('MM-DD-YYYY')
    //console.warn('A date has been picked: ', updateddate);
    //setDate(updateddate.split('T')[0]);
    setDob(updateddate);
    setSelectedDate(picdate);
    hideDatePicker();
  };

  const Choose = () => {
    Alert.alert(
      'Choose',
      //body
      'Choose Images From',
      [
        { text: 'Camera', onPress: () => Picker() },
        { text: 'Gallery', onPress: () => GalleryPicker() },
        { text: 'Cancel', onPress: () => null },
      ],
      { cancelable: true }
      //clicking out side of alert will not cancel
    );
  };
  const Picker = () => {
    ImagePicker.openCamera({
      height: 110,
      width: 110,
      mediaType: 'photo',
    }).then((image) => {
      SetImage(image.path);
      SetProfilePic({
        name: image.path.split('/').pop(),
        size: image.size,
        uri: image.path,
        type: image.mime,
      });
    });
  };
  const GalleryPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      SetGimage(image.path);
      SetProfilePic({
        name: image.path.split('/').pop(),
        size: image.size,
        uri: image.path,
        type: image.mime,
      });
    });
  };
  let fileuri = () => {
    if (cimage) {
      return (
        <Image
          style={{
            borderRadius: 55,
            height: 110,
            width: 110,
            // marginTop: 30,
            position: 'absolute',
          }}
          source={{ uri: cimage }}
        />
      );
    } else if (gimage) {
      return (
        <Image
          style={{
            borderRadius: 55,
            height: 110,
            width: 110,
            // marginTop: 30,
            position: 'absolute',
          }}
          source={{ uri: gimage }}
        />
      );
    } else {
      return (
        <Image
          style={{
            borderRadius: 55,
            height: 110,
            width: 110,
            // marginTop: 30,
            position: 'absolute',
          }}
          source={require('../../Assets/noimage.png')}
        />
      );
    }
  };

  const validator = () => {
    let errMsg;
    if (name.trim() == '') {

      errMsg = 'First Name field is required';
    }
    else if (lastname.trim() == '') {

      errMsg = 'Last Name field is required';
    }

    else if (!mobno || mobno === undefined) {
      //console.log('mob', mobno)
      errMsg = 'Mobile No field is required';
    }
    else if (mobno?.length < 10) {
      //console.log('mob==', mobno?.length)
      errMsg = 'Please enter valid Mobile Number';
    }
    else if (!gender || gender?.length < 1) {
      errMsg = 'Gender field is required';
    }
    else if (!location || location?.length < 1) {
      errMsg = 'Location field is required';
    }
    else if (!dob || dob?.length < 1) {
      errMsg = 'DOB field is required';
    }
    else if (!dea || dea?.length < 1) {
      errMsg = 'DEA field is required';
    }
    else if (!license || license?.length < 1) {
      errMsg = 'License field is required';
    }
    else if (!npi || npi?.length < 1) {
      errMsg = 'NPI field is required';
    }
    else if (!experience || experience?.length < 0) {
      errMsg = 'Experience field is required';
    }
    else if (experience < 0) {
      errMsg = 'Please enter valid Experience ';
    }
    else if (!valueex || valueex?.length < 1) {
      errMsg = 'Duration field is required';
    }
    else if (about.trim() == '') {

      errMsg = 'About field is required';
    }
    // const [multipleFile, setMultipleFile] = useState([]);
    else if (selectedItems['skill'].length < 1) {
      errMsg = 'Specialist is required';
    }
    else if (!multipleFile || multipleFile?.length < 1)
      errMsg = 'Please add your Qualification';
    else if (!certificateFile || certificateFile?.length < 1)
      errMsg = 'Please add your Practitional License';
    return errMsg;
  };

  const getdoctorProfileupdate = async () => {

    let userid = await AsyncStorage.getItem('userid');
    const authtoken = await AsyncStorage.getItem('authtoken');
    const token = authtoken;
    let user_id = JSON.parse(userid);
    NewCertificate = [];
    //setLoding(true);
    var formdata = new FormData();
    formdata.append("user_id", user_id);
    formdata.append("f_name", name);
    formdata.append("l_name", lastname);
    formdata.append("phone", mobno);
    formdata.append("location", location);
    formdata.append("gender", gender);
    formdata.append('npi', npi);
    formdata.append('license', license);
    formdata.append('dea', dea);
    formdata.append("dob", dob);
    formdata.append('exp', experience);
    formdata.append('code', phoneNumber);
    formdata.append('country', counrtyname);
    formdata.append('duration', valueex);
    if (profilepic?.size !== undefined && profilepic?.uri !== undefined) {
      formdata.append("profile_image", {
        uri: profilepic.uri,
        type: profilepic.type,
        name: profilepic.name,
      });
    } else {
      formdata.append("profile_image", profilepic.url);
    }
    formdata.append('skills[]', selectedItems['skill'].toString());
    formdata.append('about', about);

    multipleFile.forEach((el, index) => {

      if (el?.size !== undefined && el?.uri !== undefined) {
        formdata.append(`certificate_mbbs[]`, {
          uri: el.uri,
          type: el.type,
          name: el.name || `filename${index}.jpg`,
        });
      } else {
        NewCertificate.push(el.name);
      }

    });
    if (NewCertificate.length > 0) {
      formdata.append(`new_certificate_mbbs`, NewCertificate.toString());
    }
    if (multipleFile.length < 1) {
      formdata.append(`certificate_mbbs`, '');
    }
    formdata.append('certificate_name[]', certicatename.toString());
    formdata.append('registration_no[]', registration.toString());

    if (certificateFile.length < 1) {
      formdata.append(`certificate_practice`, '');
    } else {
      if (certificateFile[0].size !== undefined && certificateFile[0]?.uri !== undefined) {
        formdata.append('certificate_practice', {
          uri: certificateFile[0].uri,
          type: certificateFile[0].type,
          name: certificateFile[0].name,
        });
      } else {
        formdata.append('certificate_practice', certificateFile[0].name);
      }
    }
    formdata.append('reg_no_practice', regpractice);
    formdata.append('latitude', currentLatitude);
    formdata.append('longitude', currentLongitude);
    console.log('fromdata======>', formdata);
    console.log("NewCertificate", NewCertificate.toString(), NewCertificate)
    console.log('mob==', mobno?.length)
    Apis.getdoctorprofileupdate(formdata, token)

      .then((response) => {
        setLoding(false);
        SetIsModalVisible(true);
        console.log("Update Profile Data", response.data);
      })
      .catch((error) => {
        setLoding(false);
        console.log(JSON.stringify(error.response));
      });

  };

  const getdoctordata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    // console.log('doctotdata===', data)
    Apis.doctorprofileData(data)

      .then(async (response) => {

        setUserid(response.data.response.id);
        setName(response.data.response.f_name);
        setLastName(response.data.response.last_name);
        setEmail(response.data.response.email);
        SetGimage(response.data.response.profile_image);
        SetProfilePic({ url: response.data.response.profile_image });
        setCurrentLatitude(response.data.response.lat);
        setCurrentLongitude(response.data.response.lang);
        setDob(response.data.response.dob);
        setLocation(response.data.response.address);
        setGender(response.data.response.gender);
        setAbout(response.data.response.about);
        setMobno(response.data.response.phone ?? '');
        setDea(response.data.response.dea);
        setLicense(response.data.response.license);
        setNpi(response.data.response.npi);
        setPhoneNumber(response.data.response.code);
        setCountryname(response.data.response.country);
        setExperience(response.data.response.exp.toString());
        setValueEx(response.data.response.years);
        setcertificateFile(
          response.data.response.certificate_practice == null
            ? []
            : [{ name: response.data.response.certificate_practice }]
        );

        {
          response.data.response.certificate_practice_reg_no === null
            ? setRegpractice('')
            : setRegpractice(
              response.data.response.certificate_practice_reg_no
            );
        }

        //console.warn('doctor===', response.data)
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  // const formData = new FormData();
  // formData.append('user_id', userid);
  // formData.append('name', name);
  // formData.append('phone', mobno);
  // formData.append('location', location);
  // formData.append('gender', gender);
  // formData.append('dob', dob);
  // formData.append('dea', dea);
  // formData.append('license', license);
  // formData.append('npi', npi);
  // // if (profilepic === undefined) {
  // //   formData.append('profile_image', profilepic);
  // // } else {
  // //   formData.append('profile_image', profilepic.uri);
  // // }
  // formData.append('profile_image', profilepic);
  // formData.append('about', about);
  // formData?.append('skills[]', selectedItems['skill']);
  // // formData.append(`certificate_mbbs[0]`, multipleFile[0]);
  // multipleFile.forEach((el, index) => {
  //   console.log(el);
  //   if (el?.size !== undefined && el?.uri !== undefined) {
  //     formData.append(`certificate_mbbs[${index}]`, el);
  //   } else {
  //     formData.append(`certificate_mbbs[${index}]`, el.name);
  //   }
  // });
  // if (multipleFile.length < 1) {
  //   formData.append(`certificate_mbbs[]`, null);
  // }
  // formData.append('certificate_name[]', certicatename.toString());
  // formData.append('registration_no[]', registration.toString());
  // formData.append('certificate_practice', certificateFile[0]);
  // formData.append('reg_no_practice', regpractice);
  // formData.append('latitude', currentLatitude);
  // formData.append('longitude', currentLongitude);
  // console.log(formData);
  // const getDataUsingPost = () => {
  //   fetch(
  //     'https://magento2.mydevfactory.com/doctorApp/public/api/doctor/profile_update_doctor',
  //     {
  //       method: 'POST', //Request Type
  //       body: formData,
  //       headers: {
  //         //Header Defination
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     }
  //   )
  //     .then((response) => {
  //       console.log(formData);
  //       console.log('data----', response.data);
  //     })
  //     //If response is not in json then in error
  //     .catch((error) => {
  //       // alert(JSON.stringify(error));
  //       console.error(error);
  //     });
  // };

  const getSkill = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    let token = usertoken;
    setLoding(true);
    // console.log('skilldata==', token)
    Apis.getskill(token)

      .then((response) => {
        setSkill(response.data.response);


        // console.warn('skill===', response.data)
      })

      .catch((error) => {
        console.error(error.response);
      });
  };

  const getspecialization = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;

    const data = {
      user_id: user_id,
    };

    setLoding(true);
    // console.log('specializationdata===', data)
    Apis.doctorspecilization(data)

      .then((response) => {
        //console.warn('specialization===', response.data)

        setSelectedItems((prevData) => ({
          ...prevData,
          ['skill']: response.data.response.map((el) => el.id),
        }));
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getcertificate = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;

    const data = {
      user_id: user_id,
    };

    setLoding(true);
    // console.log('certificatedata===', data)
    await Apis.doctorcertificate(data)

      .then((response) => {
        setMultipleFile(
          response.data.response.certificate_mbbs[0]
            ? response.data.response.certificate_mbbs.map((el, i) => ({
              name: el,
            }))
            : []
        );
        setCertificatename(response.data.response.certificate_name);
        setRegistration(response.data.response.registration_no);
        // setUri(
        //   response.data.response.certificate_mbbs[0]
        //     ? response.data.response.certificate_mbbs.map((el, i) => ({
        //         name: el,
        //       }))
        //     : []
        // );
        // setCertificatenameimg(response.data.response.certificate_name);
        // setRegistrationimg(response.data.response.registration_no);

        console.warn('certificate===', response.data)
      })

      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const openCamera = () => {
    if (multipleFile.length < 5) {
      ImagePicker.openCamera({
        cropping: true,
        // height: 110,
        // width: 110,
        mediaType: 'photo',
      }).then((image) => {
        // setUri((prevData) => [...prevData, image]);
        setMultipleFile((prevData) => [...prevData,
        {
          fileCopyUri: null,
          size: image.size,
          type: image.mime,
          uri: image.path,
          name: image.path.split('/').slice(-1)[0]
        }])
      })
    }
    else {
      //console.log('Already have a data', certificateFile);
      ToastAndroid.showWithGravityAndOffset(
        'You can add five file only',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      // Alert.alert('Alert', 'You can add one file only')
    }
  };


  const selectMultipleFile = async () => {
    //Opening Document Picker for selection of multiple file
    if (multipleFile.length < 5) {
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

          console.log("====================>", [...prevData,])
          console.log('=====================>', [...filteredArr])
          return [...prevData, ...filteredArr];
        });
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          ToastAndroid.showWithGravityAndOffset(
            'Canceled from multiple doc picker',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          // Alert.alert('Alert', 'Canceled from multiple doc picker');
        } else {
          //For Unknown Error
          Alert.alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    }
    else {
      //console.log('already have a data', certificateFile);
      ToastAndroid.showWithGravityAndOffset(
        'You can add five file only',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      // Alert.alert('Alert', 'You can add one file only')
    }
  };

  const handleDeleteFile = (index) => {
    setMultipleFile((prevData) => prevData.filter((el, i) => i !== index));
    setCertificatename((prevData) => prevData.filter((el, i) => i !== index));
    setRegistration((prevData) => prevData.filter((el, i) => i !== index));
  };

  const handleDeleteCaptureImage = (modificationDate) => {
    setUri((prevData) =>
      prevData.filter((el) => el.modificationDate !== modificationDate)
    );
  };

  const opencertificateCamera = () => {
    if (certificateFile.length < 1) {
      ImagePicker.openCamera({
        cropping: true,
        // height: 110,
        // width: 110,
        mediaType: 'photo',
      })
        .then((image) => {
          setcertificateFile((prevData) => [
            ...prevData,
            {
              fileCopyUri: null,
              size: image.size,
              type: image.mime,
              uri: image.path,
              name: image.path.split('/').slice(-1)[0],
            },
          ]);
        })
        .catch((err) => {
          console.log(err);
        });
    }
    else {
      //console.log('Already have a data', certificateFile);
      ToastAndroid.showWithGravityAndOffset(
        'You can add one file only',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      // Alert.alert('Alert', 'You can add one file only')
    }
  };

  const selectcertificateFile = async () => {
    if (certificateFile.length < 1) {
      try {
        const results = await DocumentPicker.pick({
          type: [
            DocumentPicker.types.pdf,
            DocumentPicker.types.doc,
            DocumentPicker.types.images,
          ],
        });
        //Setting the state to show multiple file attributes
        setcertificateFile((prevData) => {
          const filteredArr = results.filter((el) =>
            prevData.every((prevEl) => prevEl.name !== el.name)
          );
          return [...prevData, ...filteredArr];
        });
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          ToastAndroid.showWithGravityAndOffset(
            'Canceled from multiple doc picker',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          );
          // Alert.alert('Alert', 'Canceled from multiple doc picker');
        } else {
          //For Unknown Error
          Alert.alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
    } else {
      //console.log('already have a data', certificateFile);
      ToastAndroid.showWithGravityAndOffset(
        'You can add one file only',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      // Alert.alert('Alert', 'You can add one file only')
    }
  };
  const handlecertificateDeleteFile = (index) => {
    setcertificateFile((prevData) => prevData.filter((el, i) => i !== index));
    setRegpractice('');
  };

  const handlecertificateDeleteCaptureImage = (modificationDate) => {
    setcertificatetUri((prevData) =>
      prevData.filter((el) => el.modificationDate !== modificationDate)
    );
  };

  const handleClose = () => {
    SetIsModalVisible(false);
  };
  if (isModalVisible === false) {
    props.navigation.replace('Dashboard');
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title="Edit Profile" navProps={props.navigation} />
      <Snackbar
        visible={errmsg !== undefined}
        onDismiss={() => {
          setErrMsg(undefined);
        }}
        style={{ backgroundColor: '#d15656', zIndex: 9999 }}
      >
        {errmsg}
      </Snackbar>
      <ScrollView
        style={{}}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={{
            alignSelf: 'center',
            borderRadius: 65,
            height: 120,
            width: 120,
            marginTop: 30,
            borderColor: '#000',
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => { SetIsVisible(true) }}
        >
          {fileuri()}

          <TouchableOpacity
            style={{
              height: 30,
              width: 30,
              borderRadius: 20,
              position: 'absolute',
              left: 90,
              top: 70,
              backgroundColor: 'white',
            }}
            onPress={Choose}
          >
            <Image
              source={require('../../Assets/edit.png')}
              resizeMode={'contain'}
              style={{
                height: '95%',
                width: '95%',
                borderRadius: 10,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        {loading ? (
          <Spinner
            //visibility of Overlay Loading Spinner
            visible={loading}
            //Text with the Spinner
            textContent={'Loading...'}
            textStyle={{ color: '#fff' }}
          />
        ) : null}
        <TextInput
          label="First Name *"
          value={removeEmojis(name.charAt(0).toUpperCase() + name.slice(1))}
          onChangeText={(text) => setName(text)}
          mode="outlined"
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          // activeOutlineColor="black"
          placeholderTextColor={'#000'}
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          maxLength={10}
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        <TextInput
          label="Last Name *"
          value={removeEmojis(lastname.charAt(0).toUpperCase() + lastname.slice(1))}
          onChangeText={(text) => setLastName(text)}
          mode="outlined"
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          // activeOutlineColor="black"
          placeholderTextColor={'#000'}
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          maxLength={15}
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        <TextInput
          label="Email *"
          value={email}
          onChangeText={(text) => setEmail(text)}
          mode="outlined"
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          disabled
          //  activeOutlineColor="black"
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          theme={{
            colors: {
              disabled: '#2173A8',
              text: '#000',
            },
          }}
        />
        {/* <TextInput
          label="Mobile No"
          value={mobno.toString()}
          onChangeText={(text) => setMobno(text)}
          mode="outlined"
          //change placeholder

          // change color code
          //  selectionColor="black"
          outlineColor={'#2173A8'}
          //  activeOutlineColor="black"
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
          keyboardType="number-pad"
          maxLength={10}
          left={<TextInput.Affix text="+1" textStyle={{ color: '#000' }} />}
        /> */}

        <PhoneInput
          ref={phoneInput}
          // defaultValue={phoneNumber}
          placeholder='Mobile No *'
          placeholderTextColor='#000'
          defaultCode={props.route.params?.counrtyname}
          layout="second"
          withShadow
          autoFocus
          textInputProps={{ maxLength: 10, value: mobno.toString(), onChangeText: (text) => { setMobno(text) }, }}
          containerStyle={{
            width: '84%',
            height: 55,
            backgroundColor: 'white', alignSelf: 'center', borderColor: '#2173A8', borderWidth: 1, marginBottom: 10,
          }}
          textContainerStyle={{ paddingVertical: 0 }}
          onChangeCountry={text => { setCountryname(text.cca2), console.log('counrtyname--', counrtyname) }}
          onChangeFormattedText={text => {
            setPhoneNumber(text)
            console.log('country', phoneNumber)
          }}
        />
        <View style={{ zIndex: 100 }}>
          <DropDownPicker
            open={open}
            value={gender}
            items={items}
            setOpen={setOpen}
            setValue={setGender}
            placeholder="Gender *"
            setItems={setItems}
            style={{ backgroundColor: '#fff', borderColor: '#2173A8' }}
            labelStyle={{
              width: '100%',
              // backgroundColor: 'red',
              //height: 50,
            }}
            containerStyle={{
              marginHorizontal: '8%',
              marginBottom: 8,
              marginTop: 3,
              width: '84%',
              //  zIndex: 1000,
              //backgroundColor: 'red',
            }}
            dropDownContainerStyle={{ backgroundColor: '#fff' }}
          />
        </View>
        {/* <GooglePlacesAutocomplete
          placeholder='Location *'
          textInputProps={{ value: location, onChangeText: (text) => { setLocation(text) } }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(data, details);
            setLocation(data.description);
          }}
          enablePoweredByContainer={false}
          // fetchDetails={true}
          query={{
            key: 'AIzaSyAsJT9SLCfV4wvyd2jvG7AUgXYsaTTx1D4',
            language: 'en',
          }}
          styles={{
            textInputContainer: {
              //backgroundColor: 'grey',
              width: '85%',
              alignSelf: 'center'
            },
            textInput: {
              height: 58,
              color: '#5d5d5d',
              fontSize: 16,
              borderColor: '#2173A8',
              borderWidth: 1
            },
            predefinedPlacesDescription: {
              color: '#1faadb',
            },
            listView: {
              top: 45.5,
              zIndex: 10,
              position: 'absolute',
              // color: 'black',
              // backgroundColor:"white",
              width: '85%',
              alignSelf: 'center',
              borderColor: '#ddd',
              borderWidth: 1
            },
          }}
        /> */}

        <TextInput
          label="Location *"
          value={location.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
          onChangeText={(text) => setLocation(text)}
          mode="outlined"
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          // activeOutlineColor="black"
          placeholderTextColor={'#000'}
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          maxLength={40}
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        {/* <View style={{ flexDirection: 'row', width: '100%' }}>
          <TextInput
            label="Location"
            // value={removeEmojis(location)}
            // onChangeText={(text) => setLocation(text)}
            mode="outlined"
            //change placeholder
            placeholder=""
            // change color code
            // selectionColor="black"
            outlineColor={'#2173A8'}
            //   activeOutlineColor="black"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '84%',
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../Assets/location.png')}
                onPress={requestLocationPermission}
                color="#000"
              />
            }
          />
          {loding ? (
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                //  backgroundColor: 'red',
                //  marginTop: 150,
                position: 'absolute',
              }}>
              <ActivityIndicator size={40} color="#2E4497" />
            </View>
          ) : null}
        </View> */}
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <TextInput
            label="Date Of Birth *"
            // value={about}
            // onChangeText={text => setAbout(text)}
            mode="outlined"
            value={dob}
            editable={false}
            onChangeText={(text) => setDob(text)}
            //change placeholder
            placeholder="mm-dd-yyyy"
            // change color code
            // selectionColor="black"
            outlineColor={'#2173A8'}
            showSoftInputOnFocus={false}
            //  activeOutlineColor="black"
            keyboardType="number-pad"
            style={{
              marginHorizontal: '8%',
              marginBottom: 10,
              width: '84%',
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../Assets/date.png')}
                onPress={showDatePicker}
                color="#000"
              />
            }
          />
        </View>
        <DateTimePickerModal
          date={selectedDate}
          isVisible={datePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />
        <TextInput
          label="DEA *"
          value={removeEmojis(dea)}
          onChangeText={(text) => setDea(text)}
          mode="outlined"
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          //change placeholder
          placeholder=""
          // change color code
          //selectionColor="black"
          outlineColor={'#2173A8'}
          // activeOutlineColor="black"
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          maxLength={20}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        <TextInput
          label="License *"
          value={removeEmojis(license)}
          onChangeText={(text) => setLicense(text)}
          mode="outlined"
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          //  activeOutlineColor="black"
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          maxLength={20}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        <TextInput
          label="NPI *"
          value={removeEmojis(npi)}
          onChangeText={(text) => setNpi(text)}
          mode="outlined"
          keyboardType={
            Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
          }
          //change placeholder
          placeholder=""
          // change color code
          // selectionColor="black"
          outlineColor={'#2173A8'}
          // activeOutlineColor="black"
          style={{
            marginHorizontal: '8%',
            marginBottom: 10,
            backgroundColor: '#fff',
          }}
          maxLength={20}
          theme={{
            colors: {
              text: 'black',
              placeholder: 'black',
            },
          }}
        />
        <View
          style={{
            // marginTop: 20,
            flexDirection: 'row',
            marginHorizontal: 30,
            zIndex: 100,
            // justifyContent: 'center',
            // borderWidth: 1,
            // borderColor: 'red',
            // backgroundColor: '#dbdbdb',
            // borderRadius: 5,
            width: '100%',
            marginBottom: 10,
          }}
        >
          <TextInput
            mode="outlined"
            label="Experience *"
            placeholder=""
            value={experience.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            maxLength={2}
            onChangeText={(text) => setExperience(text)}
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
              width: '40%',
              backgroundColor: '#fff',
              // marginTop: 13,
              height: 50,
              zIndex: -2,
              marginLeft: 5
            }}
          />
          <DropDownPicker
            open={openex}
            value={valueex}
            items={itemex}
            dropDownDirection='Bottom'
            setOpen={setOpenex}
            setValue={setValueEx}
            placeholder="Duration *"
            setItems={setItemsex}
            labelStyle={{
              width: '47%',
              textAlign: 'center',
              alignSelf: 'center',
              alignItems: 'center',
            }}
            containerStyle={{
              marginTop: 5,
              width: '38%',
              marginLeft: 20,
            }}
            zIndex={5}
          />
        </View>

        <View>
          <TextInput
            label="About *"
            value={about.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
            onChangeText={(text) => {
              setAbout(text);
            }}
            mode="outlined"
            outlineColor={'#2173A8'}
            style={{
              marginHorizontal: '8%',
              height: 100,
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            keyboardType={
              Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
            }
            multiline={true}
            maxLength={100}
          />
          <HelperText
            visible
            style={{
              position: 'absolute',
              bottom: 0,
              right: 30,
              color: '#000',
            }}
          >
            {`${about.length}/100`}
          </HelperText>
        </View>
        <View>
          <Text
            style={{
              width: '84%',
              alignSelf: 'center',
              marginTop: 5,
              color: '#000',
              fontSize: RFValue(14),
            }}
          >
            Specialist In *
          </Text>
          <Card
            style={{
              borderRadius: 15,
              marginHorizontal: 10,
              width: '84%',
              alignSelf: 'center',
              backgroundColor: '#fff',
              marginTop: 5,
            }}
          >
            <Card.Content>
              <MultiSelect
                items={skill}
                uniqueKey="id"
                selectedItems={selectedItems['skill']}
                onSelectedItemsChange={(item) =>
                  onSelectedItemsChange('skill', item)
                }
              />
            </Card.Content>
          </Card>
        </View>
        <Text
          style={{
            width: '84%',
            alignSelf: 'center',
            marginTop: 5,
            color: '#000',
            fontSize: RFValue(14),
          }}
        >
          {' '}
          Add Qualification *
        </Text>
        <View
          style={{
            width: '84%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 20,
            backgroundColor: '#fff',
            elevation: 2,
            padding: 10,
          }}
        >
          {multipleFile.map((element, i) => (
            <View key={i}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}
              >

                <Text style={{ width: '70%', color: '#000' }}>
                  {element.name.split('/').pop()}
                </Text>
                {multipleFile[i].fileCopyUri === null ? null :
                  <Ionicons name='eye'
                    size={20}
                    color='#2173A8'
                    style={{ marginLeft: 5 }}
                    onPress={() => {
                      Linking.openURL(multipleFile[i].name)
                    }}
                  />
                }
                {/* <Ionicons name='eye'
                  size={20}
                  color='#2173A8'
                  onPress={() => {
                    console.log('mul===', multipleFile[i].name)
                    // Linking.openURL(multipleFile[i].name)
                  }}
                /> */}
                <IconButton
                  icon="delete"
                  color="red"
                  size={20}
                  style={{ position: 'relative', left: 15 }}
                  onPress={() => handleDeleteFile(i)}
                />
              </View>
              <TextInput
                mode="outlined"
                outlineColor={'#2173A8'}
                label="Add Certificate Name"
                placeholder=""
                maxLength={10}
                value={removeEmojis(certicatename?.[i])}
                onChangeText={(text) =>
                  setCertificatename((data) => {
                    const updateddata = [...data];
                    updateddata[i] = text;
                    return updateddata;
                  })
                }
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
                // keyboardType={
                //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                // }
                style={{
                  borderRadius: 50,
                  elevation: 0,
                  marginHorizontal: 20,
                  backgroundColor: '#fff',
                }}
              />
              <TextInput
                mode="outlined"
                label="Add Registration No."
                outlineColor={'#2173A8'}
                value={removeEmojis(registration?.[i])}
                maxLength={10}
                onChangeText={(text) =>
                  setRegistration((data) => {
                    const updateddata = [...data];
                    updateddata[i] = text;
                    return updateddata;
                  })
                }
                placeholder=""
                // keyboardType={
                //   Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                // }
                style={{
                  borderRadius: 50,
                  elevation: 0,
                  marginHorizontal: 20,
                  backgroundColor: '#fff',
                  marginTop: 10
                }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
            </View>
          ))}
          {uri.map((imageBlob, i) => (
            <View key={i}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 10,
                }}
              >

                <Text style={{ color: '#000', width: '85%' }}>
                  {imageBlob.path.split('/').pop()}
                </Text>

                <IconButton
                  icon="delete"
                  color="red"
                  size={20}
                  onPress={() =>
                    handleDeleteCaptureImage(imageBlob.modificationDate)
                  }
                />
              </View>
              <TextInput
                mode="outlined"
                outlineColor={'#2173A8'}
                label="Add Certificate Name"
                placeholder=""
                value={removeEmojis(certicatenameimg?.[i])}
                onChangeText={(text) =>
                  setCertificatenameimg((data) => {
                    const updateddata = [...data];
                    updateddata[i] = text;
                    return updateddata;
                  })
                }
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}

                style={{
                  borderRadius: 50,
                  elevation: 0,
                  marginHorizontal: 20,
                  backgroundColor: '#fff',
                }}
              />
              <TextInput
                mode="outlined"
                label="Add Registration No."
                outlineColor={'#2173A8'}
                value={removeEmojis(registrationimg?.[i])}
                onChangeText={(text) =>
                  setRegistrationimg((data) => {
                    const updateddata = [...data];
                    updateddata[i] = text;
                    return updateddata;
                  })
                }
                placeholder=""
                style={{
                  borderRadius: 50,
                  elevation: 0,
                  marginHorizontal: 20,
                  backgroundColor: '#fff',
                }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
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
              borderRadius: 15,
              marginRight: 10,
              marginTop: 5,
            }}
          >
            <TouchableOpacity
              onPress={selectMultipleFile}
              style={{ alignSelf: 'center' }}
            >
              <Icon style={{ marginRight: 8 }} name="addfile" size={18} color="#2173A8" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                openCamera();
              }}
              style={{ alignSelf: 'center', position: 'relative', left: 14 }}
            >
              <Icon name="camera" size={18} color="#2173A8" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '44%',
              alignSelf: 'center',
              marginTop: 5,
              borderRadius: 20,

              elevation: 2,
            }}
          ></View>
        </View>
        <Text
          style={{
            width: '84%',
            alignSelf: 'center',
            marginTop: 5,
            color: '#000',
            fontSize: RFValue(14),
          }}
        >
          {' '}
          Add Practitional License *
        </Text>
        <View
          style={{
            width: '84%',
            alignSelf: 'center',
            marginTop: 5,
            borderRadius: 20,
            backgroundColor: '#fff',
            elevation: 2,
            padding: 10,
          }}
        >
          {certificateFile?.map((element, i) => (
            <View key={i}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}
              >
                {/* <TouchableOpacity
                // onPress={() => {
                //   // console.log('i==', i);
                //   // console.log('file==', multipleFile[i].name)
                //   Linking.openURL(certificateFile[i].name)
                // }}
                > */}
                <Text style={{ width: '70%', color: '#000' }}>
                  {element?.name.split('/').pop()}
                </Text>
                {/* </TouchableOpacity> */}
                {certificateFile[i].fileCopyUri === null ? null :
                  <Ionicons name='eye'
                    size={20}
                    color='#2173A8'
                    style={{ marginLeft: 5 }}
                    onPress={() => {
                      Linking.openURL(certificateFile[i].name)
                    }}
                  />
                }
                <IconButton
                  icon="delete"
                  color="red"
                  style={{ position: 'relative', left: 15 }}
                  size={20}
                  onPress={() => handlecertificateDeleteFile(i)}
                />
              </View>
              <TextInput
                mode="outlined"
                outlineColor={'#2173A8'}
                label="Add Registration No."
                placeholder=""
                maxLength={10}
                value={regpractice.replace(/[^a-zA-Z0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '')}
                onChangeText={(text) => {
                  setRegpractice(text);
                }}
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                style={{ borderRadius: 50, elevation: 0, marginHorizontal: 20, backgroundColor: '#fff', }}
                theme={{
                  colors: {
                    text: 'black',
                    placeholder: 'black',
                  },
                }}
              />
            </View>
          ))}
          {certificateuri.map((imageBlob, i) => (
            <View key={i}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, }}>
                <Text style={{ color: '#000', width: '80%' }}>
                  {imageBlob.path.split('/').slice(-1)[0]}
                </Text>
                <IconButton
                  icon="delete"
                  color="red"
                  size={20}
                  onPress={() =>
                    handlecertificateDeleteCaptureImage(
                      imageBlob.modificationDate
                    )
                  }
                />
              </View>
              <TextInput
                mode="outlined"
                placeholder=""
                outlineColor={'#2173A8'}
                style={{
                  borderRadius: 50,
                  elevation: 0,
                  marginHorizontal: 20,
                  backgroundColor: '#fff',
                }}
                keyboardType={
                  Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
                }
              />
            </View>
          ))}

          <View style={{ width: 90, flexDirection: 'row', justifyContent: 'space-evenly', alignSelf: 'flex-end', padding: 10, borderRadius: 15, marginRight: 10, marginTop: 5, }}>
            <TouchableOpacity
              onPress={selectcertificateFile}
              style={{ alignSelf: 'center' }}
            >
              <Icon style={{ marginRight: 8 }} name="addfile" size={18} color="#2173A8" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => opencertificateCamera()}
              style={{ alignSelf: 'center', position: 'relative', left: 14 }}
            >
              <Icon name="camera" size={18} color="#2173A8" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              width: '44%',
              alignSelf: 'center',
              marginTop: 5,
              borderRadius: 20,

              elevation: 2,
            }}
          ></View>
        </View>
        {/* <View
          style={{
            width: '84%',
            alignSelf: 'center',
            marginTop: 15,
            borderRadius: 20,
            backgroundColor: '#fff',
            elevation: 2,
          }}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text
              style={{
                fontSize: 17,
                color: 'black',
                fontWeight: '600',
                marginTop: 10,
                marginLeft: 15,
              }}
            >
              Set your Schedule Time
            </Text>
            <TouchableOpacity
              style={{
                height: 45,
                width: 45,
                borderRadius: 20,
                backgroundColor: 'white',
                justifyContent: 'center',
                marginTop: 5,
                marginRight: 15,
                elevation: 5,
                marginBottom: 5,
              }}
              // onPress={() => props.navigation.navigate('Schedule')}
            >
              <Image
                source={require('../../Assets/edit2.png')}
                style={{
                  resizeMode: 'contain',
                  height: 25,
                  width: 25,
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </View>
          {alldata.map((el, i) => (
            <View style={{ flexDirection: 'row', marginLeft: 15 }}>
              <Image
                source={require('../../Assets/watch.png')}
                style={{
                  resizeMode: 'contain',
                  height: 25,
                  width: 25,
                  marginRight: 25,
                }}
              />
              <Text style={{ fontSize: 15, color: '#000' }}>
                {el.date},,{el.start_time} to {el.end_time}
              </Text>
            </View>
          ))}
        </View> */}
        <TouchableOpacity
          onPress={() => {
            const err = validator();
            if (!err) {
              getdoctorProfileupdate();
            } else {
              setErrMsg(err);
            }
          }}
          style={{
            marginTop: 30,
            width: '80%',
            height: 55,
            borderColor: '#fff',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 100,
            backgroundColor: '#2173A8',
          }}
          activeOpacity={0.7}
        >

          <Text
            style={{
              textAlign: 'center',
              lineHeight: 53,
              color: '#FFFFFF',
              fontWeight: '700',
              fontSize: RFValue(15),
              fontFamily: 'Rubik',
              letterSpacing: 0.4,
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>


      </ScrollView>
      <SuccessfullySubmitModal
        isModalVisible={isModalVisible}
        onClose={handleClose}
        style={{}}
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

          {cimage ?


            <Image
              style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              source={{ uri: cimage }}
            />
            :
            gimage ?

              <Image
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={{ uri: gimage }}
              />

              :

              <Image
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                source={require('../../Assets/noimage.png')}
              />

          }


        </View>

      </Modal>
    </SafeAreaView>
  );
};
