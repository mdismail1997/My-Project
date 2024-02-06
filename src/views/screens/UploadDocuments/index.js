import {Platform, SafeAreaView, ScrollView, Text, View} from 'react-native';
import React, {useContext} from 'react';

import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-toast-message';

import Loader from '../../components/Loader.js';
import UploadCard from '../../components/UploadCard.js';
import {calcH, STORAGE_KEY} from '../../../utils/constants/common.js';
import strings from '../../components/lng/LocalizedStrings.js';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import CustomButton from '../../components/CustomButton.js';
import COLORS from '../../../conts/colors.js';
import styles from './style.js';
import Button from '../../components/Button.js';
import UploadInfoCard from '../../components/UploadInfoCard.js';
import cache from '../../../utils/constants/cache.js';
import {createPut} from '../../../utils/constants/API/ServerRequest.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import {AuthContext} from '../../components/context.js';
import mmkv from '../../../utils/constants/mmkv/index.js';

const UploadDocuments = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);
  const [modal, setModal] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);

  const [inputs, setInputs] = React.useState({
    email: '',
    firstname: '',
    lastname: '',
    website_id: '',
    id: '',
    licence_photo: '',
    licence_image_location: null,
    licence_imageName: '',
    licence_mime: '',
    pancard_photo: '',
    pancard_image_location: null,
    pancard_imageName: '',
    pancard_mime: '',
    proof_photo: '',
    proof_image_location: null,
    proof_imageName: '',
    proof_mime: '',
    whatToUpload: '',
  });

  //console.log('whatToUpload', inputs.whatToUpload);
  const sheetRef = React.useRef(null);
  const fall = new Animated.Value(1);

  const uploadRef = React.useRef(null);

  // const animatedShadowOpacity = Animated.interpolate(fall, {
  //   inputRange: [0, 1],
  //   outputRange: [0.5, 0],
  // });

  const {signOut} = useContext(AuthContext);

  React.useEffect(() => {
    getUserDetails();
  }, []);

  const takePhotoFromCamera = () => {
    try {
      ImagePicker.openCamera({
        cropping: true,
        includeBase64: true,
        mediaType: 'photo',
      })
        .then(image => {
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          // setImage(imageUri);
          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
          if (inputs.whatToUpload === 'licence') {
            setInputs(prevState => ({
              ...prevState,
              ['licence_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_imageName']: fileName.replace(/[( )]/g, ''),
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_mime']: image.mime,
            }));
          }

          if (inputs.whatToUpload === 'panCard') {
            setInputs(prevState => ({
              ...prevState,
              ['pancard_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_imageName']: fileName.replace(/[( )]/g, ''),
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_mime']: image.mime,
            }));
          }

          if (inputs.whatToUpload === 'proof') {
            setInputs(prevState => ({
              ...prevState,
              ['proof_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_imageName']: fileName.replace(/[( )]/g, ''),
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_mime']: image.mime,
            }));
          }
          sheetRef.current.snapTo(2);
          setModal(!modal);
        })
        .catch(error => {
          console.log(`TakePhotoFromCamera error`, error);
          setModal(!modal);
        });
    } catch (error) {
      console.log(`TakePhotoFromCamera error`, error);
    }
  };

  const takePhotoFromLibrary = () => {
    try {
      ImagePicker.openPicker({
        includeBase64: true,
        mediaType: 'photo',
      })
        .then(image => {
          //console.log('image', image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);

          if (inputs.whatToUpload === 'licence') {
            setInputs(prevState => ({
              ...prevState,
              ['licence_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_imageName']: fileName,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['licence_mime']: image.mime,
            }));
          }

          if (inputs.whatToUpload === 'panCard') {
            setInputs(prevState => ({
              ...prevState,
              ['pancard_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_imageName']: fileName,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['pancard_mime']: image.mime,
            }));
          }

          if (inputs.whatToUpload === 'proof') {
            setInputs(prevState => ({
              ...prevState,
              ['proof_image_location']: imageUri,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_photo']: image.data,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_imageName']: fileName,
            }));
            setInputs(prevState => ({
              ...prevState,
              ['proof_mime']: image.mime,
            }));
          }
          sheetRef.current.snapTo(2);
          setModal(!modal);
        })
        .catch(error => {
          console.log(`TakePhotoFromLibrary error`, error);
          setModal(!modal);
        });
    } catch (error) {
      console.log(`TakePhotoFromLibrary error`, error);
    }
  };

  const handleModalClick = () => {
    setModal(!modal);
    modal ? sheetRef.current.snapTo(2) : sheetRef.current.snapTo(0);
  };

  const RenderContent = () => (
    <View style={styles.bottomSheet}>
      <View style={styles.headerDot} />
      <View>
        <Text style={styles.bottomSheetText}>Upload Photo</Text>
        <Text style={styles.bottomSheetText2}>Choose Your Photo</Text>
      </View>
      <View style={styles.renderContent}>
        <CustomButton
          text="Take Photo"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          name="camera"
          color={COLORS.Profile_font_color}
          onPress={takePhotoFromCamera}
        />
        <CustomButton
          text="Choose From Library"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          name="archive"
          color={COLORS.Profile_font_color}
          onPress={takePhotoFromLibrary}
        />
        <CustomButton
          text="Cancel"
          style={{marginBottom: 10, backgroundColor: COLORS.white}}
          textStyle={{color: COLORS.Profile_font_color}}
          onPress={() => {
            sheetRef.current.snapTo(2);
            setModal(false);
          }}
          name="close-o"
          color={COLORS.Profile_font_color}
        />
      </View>
    </View>
  );

  const validate = () => {
    let isValid = true;

    if (!inputs.licence_imageName) {
      Toast.show({
        text1: `Please selete your Trade licence`,
        type: 'error',
        position: 'bottom',
      });
      isValid = false;
    } else if (!inputs.pancard_imageName) {
      Toast.show({
        text1: `Please selete your Pan Card`,
        type: 'error',
        position: 'bottom',
      });
      isValid = false;
    } else if (!inputs.proof_imageName) {
      Toast.show({
        text1: `Please selete your Identity Proof`,
        type: 'error',
        position: 'bottom',
      });
      isValid = false;
    }

    if (isValid) {
      updateUser();
    }
  };

  const updateUser = async () => {
    setLoading(true);
    const url = `${commonUrl.registartion}/${inputs.id}`;
    try {
      const bodyData = {
        customer: {
          id: inputs.id,
          website_id: inputs.website_id,
          email: inputs.email,
          firstname: inputs.firstname,
          lastname: inputs.lastname,
          custom_attributes: [
            {
              attribute_code: 'licence',
              value: {
                base64EncodedData: inputs.licence_photo,
                type: inputs.licence_mime,
                name: inputs.licence_imageName.replace(/[( )]/g, ''),
              },
            },
            {
              attribute_code: 'pancard',
              value: {
                base64EncodedData: inputs.pancard_photo,
                type: inputs.pancard_mime,
                name: inputs.pancard_imageName.replace(/[( )]/g, ''),
              },
            },
            {
              attribute_code: 'proof',
              value: {
                base64EncodedData: inputs.proof_photo,
                type: inputs.proof_mime,
                name: inputs.proof_imageName.replace(/[( )]/g, ''),
              },
            },
          ],
        },
      };
      console.log('bodyData', bodyData);
      let result = await createPut({
        tokenType: 'admin',
        url: url,
        body: bodyData,
      });

      if (result.status === 200) {
        console.log('result', result.data);
        setLoading(false);

        mmkv.store(STORAGE_KEY.CUSTOMER_DETAILS, result.data);
        mmkv.store(STORAGE_KEY.isUploaded, {
          isUploaded: true,
        });

        Toast.show({
          text1: `Documents uploaded successfully`,
          type: 'success',
          position: 'bottom',
        });
      }
      if (result.status === 401) {
        Toast.show({
          text1: `Session expired. Please login again`,
          type: 'error',
          position: 'bottom',
        });
        signOut();
      }
    } catch (error) {
      setLoading(false);
      console.log('--------------------', error);
      Toast.show({
        text1: `${error.message}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      navigation.navigate('home');
    }
  };

  const getUserDetails = async () => {
    const userDetails = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

    setInputs(prevState => ({...prevState, ['email']: userDetails.email}));
    setInputs(prevState => ({
      ...prevState,
      ['firstname']: userDetails.firstname,
    }));
    setInputs(prevState => ({
      ...prevState,
      ['lastname']: userDetails.lastname,
    }));
    setInputs(prevState => ({...prevState, ['id']: userDetails.id}));
    setInputs(prevState => ({
      ...prevState,
      ['website_id']: userDetails.website_id,
    }));
  };
  const seller = mmkv.get(STORAGE_KEY.isSeller);
  const isSubmitted = mmkv.get(STORAGE_KEY.isUploaded);
  console.log('first', isSubmitted);
  return (
    <>
      <SafeAreaView style={styles.container}>
        <Animated.View>
          <ScrollView>
            <Loader visible={loading} />
            <View style={styles.subContainer}>
              {isSubmitted && (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: calcH(0.02),
                  }}>
                  <Text style={styles.noOrderText}>
                    {`${strings.DOCUMENTS_UPLOADED_WAITING_FOR_APPROVAL}`}
                  </Text>
                </View>
              )}
              {seller != null && (
                <View
                  style={{
                    alignItems: 'center',
                    marginVertical: calcH(0.02),
                  }}>
                  <Text style={styles.noOrderText}>
                    {`${strings.DOCUMENTS_APPROVED_YOU_CAN_CREATE_PRODUCTS_NOW}`}
                  </Text>
                </View>
              )}

              <UploadCard
                text={strings.TRADE_LICENCE}
                onPress={() => {
                  handleModalClick();

                  setInputs(prevState => ({
                    ...prevState,
                    ['whatToUpload']: 'licence',
                  }));
                }}
              />

              {inputs.licence_image_location && (
                <UploadInfoCard
                  source={{
                    uri: inputs.licence_image_location,
                  }}
                  text={`Info About Trader Licence`}
                  containerStyle={styles.marginBottom}
                />
              )}
              <UploadCard
                text={strings.PAN_CARD}
                onPress={() => {
                  handleModalClick();
                  setInputs(prevState => ({
                    ...prevState,
                    ['whatToUpload']: 'panCard',
                  }));
                }}
              />
              {inputs.pancard_image_location && (
                <UploadInfoCard
                  source={{
                    uri: inputs.pancard_image_location,
                  }}
                  size={50}
                  text={`Info About Pan Card`}
                  containerStyle={styles.marginBottom}
                />
              )}
              <UploadCard
                text={strings.IDENTITY_PROOF}
                onPress={() => {
                  handleModalClick();
                  setInputs(prevState => ({
                    ...prevState,
                    ['whatToUpload']: 'proof',
                  }));
                }}
              />
              {inputs.proof_image_location && (
                <UploadInfoCard
                  source={{
                    uri: inputs.proof_image_location,
                  }}
                  size={50}
                  text={`Info About Identity Proof`}
                />
              )}

              <Button
                title={strings.UPLOAD_DOCUMENTS}
                bgColor={COLORS.BlackTie}
                onPress={validate}
                containerStyle={{marginVertical: calcH(0.05)}}
                height={calcH(0.065)}
              />
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={
          Platform.OS === 'ios'
            ? [calcH(0.5), calcH(0.2), 0]
            : [calcH(0.55), calcH(0.2), 0]
        }
        borderRadius={10}
        renderContent={RenderContent}
        initialSnap={2}
        enabledInnerScrolling={false}
        onCloseStart={() => setModal(false)}
      />
    </>
  );
};

export default UploadDocuments;
