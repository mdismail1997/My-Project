import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import colors from '../../asserts/colors.js/colors';
import {
  allPadding,
  allRadius,
  buttonHeight,
  calcH,
  calcW,
  cardButtonHeight,
  cardHeight,
  logoHeight,
  logoWidth,
} from '../../utils/comon';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/dist/Entypo';
import IconMaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {ImagePickerModal} from './../../Components/image-picker-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import RNPickerSelect from 'react-native-picker-select';
import DatePicker from 'react-native-datepicker';
import IconFontisto from 'react-native-vector-icons/dist/Fontisto';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import IconIonicons from 'react-native-vector-icons/dist/Ionicons';
import IconSimpleLineIcons from 'react-native-vector-icons/dist/SimpleLineIcons';
import IconEntypo from 'react-native-vector-icons/dist/Entypo';
import {BASE_URL} from '../../utils/Api/apiName';
import Hud from '../../utils/hud';
import {RFValue} from 'react-native-responsive-fontsize';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import moment from 'moment';
import { Popover, Button, Box, Center, NativeBaseProvider, Tooltip } from "native-base";

const DocumentUpload = ({navigation}) => {
  useEffect(() => {
    getDocument();
    fetch();
    fetchUser();
    const unsubscribe = navigation.addListener('focus', () => {
      getDocument();
      requestCameraPermission();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [showchk, setShowChk] = useState('');

 const [visibleSN, setVisibleSN] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSN(!visibleSN);

  const onDismissSnackBar = () => setVisibleSN(false);

  const [vehicleData, setVehicleData] = useState(null);

  const [vehicle, setVehicle] = useState('');
  // const [date, setDate] = useState(new Date())
  // const [open, setOpen] = useState(false)
  const [licencedate, setLicenceDate] = useState(new Date());
  const [insurancedate, setInsuranceDate] = useState(new Date());
  const [userToken, setUserToken] = useState('');

  const [filePathDlFront, setFilePathDlFront] = useState(null);
  const [filePathDlBack, setFilePathDlBack] = useState(null);
  const [fileDlFrontApi, setFileDlFrontApi] = useState(null);
  const [fileDlBackApi, setFileDlBackApi] = useState(null);

  const [visibleDlFront, setVisibleDlFront] = useState(null);
  const [visibleDlBack, setVisibleDlBack] = useState(null);

  const [filePathInsFront, setFilePathInsFront] = useState(null);
  const [filePathInsBack, setFilePathInsBack] = useState(null);
  const [fileInsFrontApi, setFileInsFrontApi] = useState(null);
  const [fileInsBackApi, setFileInsBackApi] = useState(null);

  const [visibleInsFront, setVisibleInsFront] = useState(null);
  const [visibleInsBack, setVisibleInsBack] = useState(null);

  const [visibleCarRegFront, setVisibleCarRegFront] = useState(null);
  const [visibleCarRegBack, setVisibleCarRegBack] = useState(null);

  const [filePathCarRegFront, setFilePathCarRegFront] = useState(null);
  const [filePathCarRegBack, setFilePathCarRegBack] = useState(null);
  const [fileCarRegFrontApi, setFileCarRegFrontApi] = useState(null);
  const [fileCarRegBackApi, setFileCarRegBackApi] = useState(null);

  const [focusEmail, setFocusEmail] = useState(false);
  const [cabno, setCabno] = useState('');
  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  ////////////////////////////////////////

  // ---------------------------------------------------------------------------------------------

  const [fileCarPhotoFrontApi, setFileCarPhotoFrontApi] = useState(null);
  const [fileCarPhotoBackApi, setFileCarPhotoBackApi] = useState(null);

  const [filePathCarInteriorFront, setFilePathCarInteriorFront] =
    useState(null);
  const [filePathCarInteriorBack, setFilePathCarInteriorBack] = useState(null);
  const [fileCarInteriorFrontApi, setFileCarInteriorFrontApi] = useState(null);
  const [fileCarInteriorBackApi, setFileCarInteriorBackApi] = useState(null);

  const [visibleCarInteriorFront, setVisibleCarInteriorFront] = useState(null);
  const [visibleCarInteriorBack, setVisibleCarInteriorBack] = useState(null);

  const [name, setName] = useState('');
  const [filePath, setFilePath] = useState(null);
  const [visible, setVisible] = useState(false);
  const [profileimg, setProfileImg] = useState(null);

  ////////////////////////////////////////////////////////////////////////////////////////////////

  const getDocument = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const userName = JSON.parse(await AsyncStorage.getItem('userName'));
    setName(userName);
    setUserToken(token);
    console.log('42515464', token);
    Hud.showHud();
    axios({
      method: 'get',
      url: BASE_URL + 'document-details',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        authorization: 'Bearer ' + token,
      },
    })
      .then(response => {
        console.log('1232222132132132132132132132 ', response.data);
        Hud.hideHud();
        setCabno(response.data.result.cab_no);
        setVehicle(response.data.result.vehicle_type);
        setFileDlFrontApi(response.data.result.licence_front);
        setFileDlBackApi(response.data.result.license_back);
        setLicenceDate(response.data.result2.driving_licence_validity_date);
        setInsuranceDate(response.data.result2.insurance_validity_date);
        setFileInsFrontApi(response.data.result.insurance_front);
        setFileInsBackApi(response.data.result.insurance_back);
        setFileCarRegFrontApi(response.data.result.car_registration_front);
        setFileCarRegBackApi(response.data.result.car_registration_back);
        //setFileCarImageFrontApi(response.data.car_image_number_front);
        //setFileCarImageBackApi(response.data.car_image_number_back);
        setFileCarPhotoFrontApi(response.data.result.photo_car_front);
        setFileCarPhotoBackApi(response.data.result.photo_car_back);
        setFileCarInteriorFrontApi(response.data.result.photo_car_front);
        setFileCarInteriorBackApi(response.data.result.photo_car_back);
        setProfileImg(response.data.result.profile_photo);  
        setShowChk(response.data.chk)
        //setFileCarSideFrontApi(response.data.car_side1);
        //setFileCarSideBackApi(response.data.car_side2);
        AsyncStorage.setItem(
          'vehicle_type',
          JSON.stringify(response.data.vehicle_type),
        );
        // setFilePathDlFront(response.data.car_image_number_back)
      })
      .catch(err => {
        console.log('err', err);
        Hud.hideHud();
        Alert.alert(err);
      });
  };

  // ----------------------------------------------------------------------------------------------------

  const fetch = async () => {
    try {
      var config = {
        method: 'get',
        url: BASE_URL + 'listVehicle',
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
          var data = response.data.vehicle.map(item => {
            return {label: item.name, value: item.id};
          });
          setVehicleData(data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {}
  };

  const DocumentPickerFun = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size,
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
        Alert.alert('No file selected');
      } else {
        throw err;
      }
    }
  };

  // --------------------------------------------------------------------------------------

  const fetchUser = async () => {
    try {
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      if (token) {
        setUserToken(token);
      }
    } catch (error) {}
  };

  const permissionState = Platform.select({
    android: PERMISSIONS.ANDROID.CAMERA,
    ios: PERMISSIONS.IOS.CAMERA,
  });

  const requestCameraPermission = async () => {
    try {
      const granted = await request(permissionState);
      if (granted === RESULTS.GRANTED) {
        console.log('Camera permission given');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  // const onImageLibraryPressCarPhotoFront = React.useCallback(() => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //   };
  //   launchImageLibrary(options, response => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       Alert.alert(response.customButton);
  //     } else {
  //       let source = response;
  //       console.log(
  //         'You can also display the image using data1====>',
  //         response,
  //       );
  //       setVisibleCarPhotoFront(false);
  //       setFilePathCarPhotoFront(source);
  //       setFileCarPhotoFrontApi(source.assets[0].uri);
  //     }
  //   });
  // }, []);

  // const onCameraPressCarPhotoFront = React.useCallback(() => {
  //   const options = {
  //     saveToPhotos: true,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //   };
  //   launchCamera(options, response => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       Alert.alert(response.customButton);
  //     } else {
  //       let source = response;
  //       console.log('', response);
  //       setVisibleCarPhotoFront(false);
  //       setFilePathCarPhotoFront(source);
  //       setFileCarPhotoFrontApi(source.assets[0].uri);
  //     }
  //   });
  // }, []);

  //////////////////////////////////////////////////////////////////

  // const onImageLibraryPressCarPhotoBack = React.useCallback(() => {
  //   const options = {
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //   };
  //   launchImageLibrary(options, response => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       Alert.alert(response.customButton);
  //     } else {
  //       let source = response;
  //       console.log(
  //         'You can also display the image using data2====>',
  //         response,
  //       );
  //       setVisibleCarPhotoBack(false);
  //       setFilePathCarPhotoBack(source);
  //       setFileCarPhotoBackApi(source.assets[0].uri);
  //     }
  //   });
  // }, []);

  // const onCameraPressCarPhotoBack = React.useCallback(() => {
  //   const options = {
  //     saveToPhotos: true,
  //     mediaType: 'photo',
  //     includeBase64: false,
  //   };
  //   launchCamera(options, response => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       Alert.alert(response.customButton);
  //     } else {
  //       let source = response;
  //       console.log('', response);
  //       setVisibleCarPhotoBack(false);
  //       setFilePathCarPhotoBack(source);
  //       setFileCarPhotoBackApi(source.assets[0].uri);
  //     }
  //   });
  // }, []);

  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////

  const onImageLibraryPressCarInteriorFront = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data5====>',
          response,
        );
        setVisibleCarInteriorFront(false);
        setFilePathCarInteriorFront(source);
        setFileCarInteriorFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressCarInteriorFront = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleCarInteriorFront(false);
        setFilePathCarInteriorFront(source);
        setFileCarInteriorFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  //////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////

  const onImageLibraryPressCarInteriorBack = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data6====>',
          response,
        );
        setVisibleCarInteriorBack(false);
        setFilePathCarInteriorBack(source);
        setFileCarInteriorBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressCarInteriorBack = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleCarInteriorBack(false);
        setFilePathCarInteriorBack(source);
        setFileCarInteriorBackApi(source.assets[0].uri);
      }
    });
  }, []);

  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////

  const onImageLibraryPressCarRegFront = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data9====>',
          response,
        );
        setVisibleCarRegFront(false);
        setFilePathCarRegFront(source);
        setFileCarRegFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressCarRegFront = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleCarRegFront(false);
        setFilePathCarRegFront(source);
        setFileCarRegFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPressCarRegBack = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data10====>',
          response,
        );
        setVisibleCarRegBack(false);
        setFilePathCarRegBack(source);
        setFileCarRegBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressCarRegBack = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleCarRegBack(false);
        setFilePathCarRegBack(source);
        setFileCarRegBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPressInsBack = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data11====>',
          response,
        );
        setVisibleInsBack(false);
        setFilePathInsBack(source);
        setFileInsBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressInsBack = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleInsBack(false);
        setFilePathInsBack(source);
        setFileInsBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPressInsFront = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data12====>',
          response,
        );
        setVisibleInsBack(false);
        setFilePathInsFront(source);
        setFileInsFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressInsFront = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleInsFront(false);
        setFilePathInsFront(source);
        setFileInsFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPressBack = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data13====>',
          response,
        );
        setVisibleDlBack(false);
        setFilePathDlBack(source);
        setFileDlBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPressBack = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleDlBack(false);
        setFilePathDlBack(source);
        setFileDlBackApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPress = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };

    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        console.log(
          'You can also display the image using data14====>',
          response,
        );
        setVisibleDlFront(false);
        setFilePathDlFront(source);
        setFileDlFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onCameraPress = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisibleDlFront(false);
        setFilePathDlFront(source);
        setFileDlFrontApi(source.assets[0].uri);
      }
    });
  }, []);

  const onImageLibraryPressProfile = React.useCallback(() => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        let source = response;
        setVisible(false);
        updateUserProfile(source.assets[0].uri);
        setFilePath(source);
        setProfileImg(source.assets[0].uri);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCameraPressProfile = React.useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
      // maxWidth: 500,
      // maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        // setImagePickermodal(false);
        let source = response;
        console.log('source------------->', source);
        setVisible(false);
        setFilePath(source);
        setProfileImg(source.assets[0].uri);
        updateUserProfile(source.assets[0].uri);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUserProfile = async value => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));

    console.log('userData.token--->', token);
    console.log('userData.image--->', profileimg);
    if (value === null) {
      Toast.show({
        type: 'error',
        text1: 'Please upload profile image',
      });
    } else {
      let formdata = new FormData();
      formdata.append('profile_photo', {
        uri: value,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      //const token = JSON.parse(await AsyncStorage.getItem('userToken'));

      const api = BASE_URL + 'update-profile-picture';
      Hud.showHud();
      axios({
        url: api,
        method: 'POST',
        data: formdata,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
        .then(function (response) {
          if (response.data) {
            Hud.hideHud();
            Toast.show({
              type: 'success',
              text1: response.data.success,
            });
          }
          console.log('response :', response);
          setProfileImg(response.data.data.profile_photo);
        })
        .catch(function (error) {
          console.log('error from image :', error);
          Hud.hideHud();
        });
    }
  };

  const handleSubmit = async () => {
    //     const body = {
    //     "photo_car_back":image file,
    //     "photo_car_front" : image file,
    //     "car_interior_front" : image file,
    //     "car_interior_back" : image file,
    //     "car_side1" : image file,
    //     "car_side2" : image file,
    //     "vehicle_type" : id of list vehicle
    // }
    console.log('USERRRRRTOKEN', userToken);
    const licence = JSON.stringify(licencedate).substring(1, 11);
    // const licencerev = licence.split('-').reverse().join('-');
    // console.log("$$$$$$$$$$$$$$$$$$$$1", JSON.stringify(licencerev));
    // setLicenceDate(licencerev)
    const insurance = JSON.stringify(insurancedate).substring(1, 11);
    // const insurancerev = insurance.split('-').reverse().join('-');
    // console.log("$$$$$$$$$$$$$$$$$$$$2", JSON.stringify(insurancerev));
    // setInsuranceDate(insurancerev)
    //updateUserProfile();
    if (!profileimg) {
      Toast.show({
        type: 'error',
        text1: 'Please upload profile image',
      });
    } else if (fileDlFrontApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload driving Licence Front image',
      });
    } else if (fileDlBackApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload driving Licence Back image',
      });
    } else if (fileInsFrontApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload Front Insurance image  ',
      });
    } else if (fileInsBackApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload Back Insurance image',
      });
    } else if (fileCarRegFrontApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload car registration front image ',
      });
    } else if (fileCarRegBackApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload registration back image',
      });
    }
    //  else if (fileCarPhotoFrontApi === '') {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Please upload car doc front image',
    //   });
    // } else if (fileCarPhotoBackApi === '') {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Please upload car doc back image',
    //   });
    // }
    else if (fileCarInteriorFrontApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload car front exterior image',
      });
    } else if (fileCarInteriorBackApi === '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload car back exterior image',
      });
    } else if (insurancedate === '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter insurance expire date',
      });
    } else if (vehicle === null) {
      Toast.show({
        type: 'error',
        text1: 'Please select car type',
      });
    } else if (cabno === null) {
      Toast.show({
        type: 'error',
        text1: 'Please enter your car number',
      });
    } else if (licencedate === '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter license expire date',
      });
    } else {
      let formdata = new FormData();
      formdata.append('profile_photo', {
        uri: profileimg,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('licence_front', {
        uri: fileDlFrontApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('license_back', {
        uri: fileDlBackApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      formdata.append('insurance_front', {
        uri: fileInsFrontApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('insurance_back', {
        uri: fileInsBackApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('driving_licence_validity_date', licence);
      formdata.append('insurance_validity_date', insurance);
      formdata.append('cab_no', cabno);
      formdata.append('car_registration_front', {
        uri: fileCarRegFrontApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('car_registration_back', {
        uri: fileCarRegBackApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      /////..............................
      // formdata.append(, {
      //   uri: fileCarPhotoFrontApi,
      //   name: 'image.jpg',
      //   type: 'image/jpeg',
      // });
      // formdata.append(, {
      //   uri: fileCarPhotoBackApi,
      //   name: 'image.jpg',
      //   type: 'image/jpeg',
      // });
      /////..............................

      /////..............................
      formdata.append('photo_car_front', {
        uri: fileCarInteriorFrontApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('photo_car_back', {
        uri: fileCarInteriorBackApi,
        name: 'image.jpg',
        type: 'image/jpeg',
      });
      formdata.append('vehicle_type', vehicle);
      // const driver = JSON.parse(data);
      // console.log(JSON.stringfy, 'formdata=====>', formdata, vehicle);
      console.log('formdata=====>', JSON.stringify(formdata));
      const api = BASE_URL + 'update-docs';
      Hud.showHud();
      axios({
        url: api,
        method: 'POST',
        data: formdata,
        headers: {
          //Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then(function (response) {
          Hud.hideHud();
          if (response.data.success) {
           
            Alert.alert(response.data.message)
            // Toast.show({
            //   type: 'success',
            //   text1: response.data.message,
            // });
            AsyncStorage.setItem('user_doc', JSON.stringify(response.data));
            navigation.navigate('account');

            // setTimeout(() => {
            //   navigation.navigate('account');
            // }, 1000);
          }else{
            Alert.alert('Sorry', `${response.data.message}`, [
              {text: 'OK', },
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
            ]);
          }
          console.log('response :', response);
        })
        .catch(function (error) {
          Hud.hideHud();
          console.log('error from image :', error);
        });
    }
  };

  const info = (value) => {
    return(
      <TouchableOpacity style={{marginLeft: calcW(0.03)}} onPress={()=> Toast.show({
        type: 'error',
        text1: value,
      })}>
        <IconIonicons size={25} name='md-information-sharp' color={colors.dalert}/>
      </TouchableOpacity>
      
    )
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <View style={styles.container}>
        <ScrollView
          style={{flex: 1, marginTop: calcH(0.05)}}
          contentContainerStyle={{flexGrow: 1}}>
          <View style={styles.viewTwo}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: calcH(0.02),
                marginTop: calcH(0.005),
                flexDirection: 'row'
              }}>
              <View
                style={{
                  borderRadius: 78,
                }}>
                {filePath ? (
                  <Image
                    style={{
                      height: 128,
                      width: 128,
                      resizeMode: 'cover',
                      overflow: 'hidden',
                      borderRadius: 78,
                      borderColor: colors.buttonColor,
                      borderWidth: 2,
                    }}
                    source={{uri: filePath.assets[0].uri}}
                  />
                ) : (
                  <>
                    {profileimg ? (
                      <Image
                        style={{
                          height: 128,
                          width: 128,
                          resizeMode: 'cover',
                          overflow: 'hidden',
                          borderRadius: 78,
                          borderColor: colors.buttonColor,
                          borderWidth: 2,
                        }}
                        source={{uri: profileimg}}
                      />
                    ) : (
                      <View
                        style={{
                          // left: calcW(0.3),
                          width: calcW(0.28),
                          height: calcW(0.28),
                          borderRadius: calcW(0.14),
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderColor: colors.buttonColor,
                          // position: 'absolute',
                          backgroundColor: '#878f99',
                        }}>
                        <Text style={{fontSize: RFValue(51)}}>
                          {name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </>
                )}
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '68%',
                    backgroundColor: colors.white,
                    padding: 15,
                    borderRadius: 30,
                    elevation: 10,
                  }}
                  onPress={() => setVisible(true)}>
                  <IconEntypo color={'#003169'} size={24} name={'camera'} />
                </TouchableOpacity>

                <ImagePickerModal
                  isVisible={visible}
                  onClose={() => setVisible(false)}
                  onImageLibraryPress={onImageLibraryPressProfile}
                  onCameraPress={onCameraPressProfile}
                />
              </View>
              {showchk?.profile_photo_check === 1? (info(showchk?.profile_photo_reason)): null}
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-start',
                alignItems: 'center',
                // padding: allPadding,
              }}>
              <View style={styles.singleItemStyle}>
                <Text style={styles.headerText}>
                  Driving Licence Front & Back
                </Text>
                <Text style={styles.subText}>
                  Upload your Driving Licence Front & back for verification
                </Text>

                <View style={styles.rowParentView}>
                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathDlFront?.assets ? (
                        <Image
                          source={{uri: filePathDlFront?.assets[0]?.uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileDlFrontApi ? (
                        <Image
                          source={{uri: fileDlFrontApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                      {showchk?.diver_license_font === 1? (info(showchk?.driver_license_reason)): null}
                    </View>

                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleDlFront}
                      onClose={() => setVisibleDlFront(false)}
                      onImageLibraryPress={onImageLibraryPress}
                      onCameraPress={onCameraPress}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleDlFront(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathDlBack ? (
                        <Image
                          source={{uri: filePathDlBack.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileDlBackApi ? (
                        <Image
                          source={{uri: fileDlBackApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                      {showchk?.diver_license_back === 1? (info(showchk?.driver_license_reason)): null}

                    </View>
                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleDlBack}
                      onClose={() => setVisibleDlBack(false)}
                      onImageLibraryPress={onImageLibraryPressBack}
                      onCameraPress={onCameraPressBack}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleDlBack(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <DatePicker
                    style={{width: '95%'}}
                    date={licencedate}
                    mode="date"
                    placeholder="select date"
                    format='YYYY-MM-DD'
                    minDate={moment().format('YYYY-MM-DD')}
                    // maxDate="01-01-2000"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        right: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {borderRadius: 30},
                      placeholderText: {
                        fontSize: 17,
                        color: 'gray',
                      },
                      dateText: {
                        fontSize: 17,
                      },
                      datePickerCon: {
                        backgroundColor: '#00a3ff',
                      },
                    }}
                    onDateChange={date => {
                      setLicenceDate(date);
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: 20,
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                  width: calcW(0.92),
                  height: 60,
                  borderRadius: 10,
                  borderBottomColor: 'grey',
                  borderWidth: 1,
                }}>
                <View style={{width: 50, padding: 10}}>
                  <FontAwesome5 color={'grey'} size={24} name={'car-side'} />
                </View>

                <View style={{width: calcW(0.8)}}>
                  {vehicleData && vehicleData != null ? (
                    <RNPickerSelect
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          top: 20,
                          right: 10,
                          color: '#000',
                          backgroundColor: '#fff',
                        },
                        placeholder: {
                          color: 'grey',
                          fontSize: 18,
                          fontWeight: 'bold',
                        },
                      }}
                      placeholderTextColor={'#000'}
                      placeholder={{
                        label: 'Select vehicle',
                        value: null,
                        color: 'grey',
                      }}
                      value={vehicle}
                      onValueChange={value => setVehicle(value)}
                      items={vehicleData}
                    />
                  ) : null}
                </View>
              </View>
              <View
                style={
                  focusEmail === true
                    ? styles.activeBorder
                    : styles.inActiveBorder
                }>
                <TextInput
                  style={styles.textInput}
                  placeholder="cab number"
                  value={cabno}
                  onBlur={() => onBlurTextInputEmail()}
                  onFocus={() => onFocusTextInputEmail()}
                  onChangeText={text => setCabno(text)}
                  placeholderTextColor="#C9CCCF"
                />
              </View>
              <View style={styles.singleItemStyle}>
                <Text style={styles.headerText}>Insurance Documents</Text>
                <Text style={styles.subText}>
                  Upload your Insurance Documents Front & back for verification
                </Text>

                <View style={styles.rowParentView}>
                  
                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row'
                      }}>
                      {filePathInsFront ? (
                        <Image
                          source={{uri: filePathInsFront.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileInsFrontApi ? (
                        <Image
                          source={{uri: fileInsFrontApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                      {showchk?.insurance_font === 1? (info(showchk?.insurance_reason)): null}
                    </View>
                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleInsFront}
                      onClose={() => setVisibleInsFront(false)}
                      onImageLibraryPress={onImageLibraryPressInsFront}
                      onCameraPress={onCameraPressInsFront}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleInsFront(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathInsBack ? (
                        <Image
                          source={{uri: filePathInsBack.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileInsBackApi ? (
                        <Image
                          source={{uri: fileInsBackApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                    {showchk?.insurance_back === 1? (info(showchk?.insurance_reason)): null}
                    </View>
                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleInsBack}
                      onClose={() => setVisibleInsBack(false)}
                      onImageLibraryPress={onImageLibraryPressInsBack}
                      onCameraPress={onCameraPressInsBack}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleInsBack(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{alignItems: 'center'}}>
                  <DatePicker
                    style={{width: '95%'}}
                    date={insurancedate}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate={moment().format('YYYY-MM-DD')}
                    // maxDate="01-01-2000"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        right: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        borderRadius: 30,
                      },
                      placeholderText: {
                        fontSize: 17,
                      },
                      dateText: {
                        fontSize: 17,
                      },
                      datePickerCon: {
                        backgroundColor: '#00a3ff',
                      },
                    }}
                    onDateChange={date => {
                      setInsuranceDate(date);
                    }}
                  />
                </View>
              </View>

              <View style={styles.singleItemStyle}>
                <Text style={styles.headerText}>
                  Car Registration Documents
                </Text>
                <Text style={styles.subText}>
                  Upload your Car Registration Front & back for verification
                </Text>

                <View style={styles.rowParentView}>
                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathCarRegFront ? (
                        <Image
                          source={{uri: filePathCarRegFront.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileCarRegFrontApi ? (
                        <Image
                          source={{uri: fileCarRegFrontApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                    {showchk?.car_registration_font === 1? (info(showchk?.car_registration_reason)): null}

                    </View>

                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleCarRegFront}
                      onClose={() => setVisibleCarRegFront(false)}
                      onImageLibraryPress={onImageLibraryPressCarRegFront}
                      onCameraPress={onCameraPressCarRegFront}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleCarRegFront(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathCarRegBack ? (
                        <Image
                          source={{uri: filePathCarRegBack.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileCarRegBackApi ? (
                        <Image
                          source={{uri: fileCarRegBackApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                    {showchk?.car_registration_back === 1? (info(showchk?.car_registration_reason)): null}

                    </View>
                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleCarRegBack}
                      onClose={() => setVisibleCarRegBack(false)}
                      onImageLibraryPress={onImageLibraryPressCarRegBack}
                      onCameraPress={onCameraPressCarRegBack}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleCarRegBack(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

             
              <View style={[styles.singleItemStyle, {borderBottomWidth: 0}]}>
                <Text style={styles.headerText}>Car Other Images</Text>
                <Text style={styles.subText}>
                  Car Exterior 1 & Exterior 2 with number,
                </Text>

               

                <View style={styles.rowParentView}>
                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathCarInteriorFront ? (
                        <Image
                          source={{uri: filePathCarInteriorFront.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileCarInteriorFrontApi ? (
                        <Image
                          source={{uri: fileCarInteriorFrontApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                     {showchk?.car_front_image === 1? (info(showchk?.car_image_reason)): null}

                    </View>

                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleCarInteriorFront}
                      onClose={() => setVisibleCarInteriorFront(false)}
                      onImageLibraryPress={onImageLibraryPressCarInteriorFront}
                      onCameraPress={onCameraPressCarInteriorFront}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleCarInteriorFront(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.rowChildView}>
                    <View
                      style={{
                        backgroundColor: '#E9E9E9',
                        borderRadius: 25,
                        height: 40,
                        width: 40,
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      {filePathCarInteriorBack ? (
                        <Image
                          source={{uri: filePathCarInteriorBack.assets[0].uri}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : fileCarInteriorBackApi ? (
                        <Image
                          source={{uri: fileCarInteriorBackApi}}
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 45 / 2,
                          }}
                        />
                      ) : (
                        <IconMaterialCommunityIcons
                          color={'#909090'}
                          size={24}
                          style={{marginLeft: calcW(0.02)}}
                          name={'upload'}
                        />
                      )}
                   {showchk?.car_back_image === 1? (info(car_image_reason)): null}

                    </View>
                    <Text style={[styles.subText, {fontWeight: 'bold'}]}>
                      Image file to upload
                    </Text>

                    <ImagePickerModal
                      isVisible={visibleCarInteriorBack}
                      onClose={() => setVisibleCarInteriorBack(false)}
                      onImageLibraryPress={onImageLibraryPressCarInteriorBack}
                      onCameraPress={onCameraPressCarInteriorBack}
                    />

                    <TouchableOpacity
                      style={{
                        width: '100%',
                      }}
                      onPress={() => setVisibleCarInteriorBack(true)}>
                      <View style={styles.buttonStyle}>
                        <Text style={styles.buttonTextStyle}>Select File</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

               
              </View>
              <TouchableOpacity
                style={{
                  width: '100%',
                  margin: 15,
                  paddingHorizontal: calcH(0.18),
                }}
                //onPress={() => navigation.navigate('account')}
                onPress={() => handleSubmit()}>
                <View style={[styles.buttonStyle, {height: buttonHeight}]}>
                  <Text style={[styles.buttonTextStyle, {fontSize: 18}]}>
                    Submit
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: '#000',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    height: 50,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    color: '#000000',
    // color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewOne: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  viewTwo: {
    flex: 2,
  },
  viewThree: {
    flex: 1,
  },
  inActiveBorder: {
    width: calcW(0.9),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: calcW(0.9),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  headerText: {
    fontSize: 18,
    color: colors.textHeader,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: colors.subHeader,
    marginVertical: 10,
    textAlign: 'center',
  },
  textInput: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
    color: '#000',
  },
  buttonStyle: {
    width: calcW(0.3),
    backgroundColor: colors.buttonColor,
    height: cardButtonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: calcW(0.01),
  },
  buttonTextStyle: {
    fontSize: 14,
    color: colors.white,
    // marginVertical: 10,
  },
  singleItemStyle: {
    width: '100%',
    borderBottomWidth: 2,
    borderColor: '#E8E8E8',
    padding: allPadding,
  },
  rowParentView: {
    flexDirection: 'row',
    height: cardHeight,
    marginBottom: 30,
  },
  rowChildView: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: allPadding,
    marginHorizontal: 10,
  },
  datePickerStyle: {
    width: '100%',
  },
});

export default DocumentUpload;
