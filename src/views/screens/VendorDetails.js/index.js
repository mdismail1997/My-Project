import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import COLORS from '../../../conts/colors';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Loader from '../../components/Loader';
import {calcH, STORAGE_KEY, IMAGE_PATH} from '../../../utils/constants/common';

import {
  createGet,
  createpost,
  createPut,
} from '../../../utils/constants/API/ServerRequest';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import ImagePicker from 'react-native-image-crop-picker';
import ImageCropPicker from 'react-native-image-crop-picker';
import styles from './style';

import strings from '../../components/lng/LocalizedStrings';
import ProfileInput from '../../components/ProfileInput.js';
import storage from '../../../utils/constants/storage.js';
import AppImage from '../../components/AppImage.js';
import icons from '../../../conts/icons.js';
import cache from '../../../utils/constants/cache.js';
import BottomSheet from 'reanimated-bottom-sheet';
import CustomButton from '../../components/CustomButton.js';
import mmkv from '../../../utils/constants/mmkv/index.js';

const vendorDetailsArr = [
  {
    entity_id: '78',
    is_seller: '1',
    seller_id: '0',
    payment_source: '',
    twitter_id: '',
    facebook_id: '',
    gplus_id: '',
    youtube_id: '',
    vimeo_id: null,
    instagram_id: '',
    pinterest_id: null,
    moleskine_id: null,
    tw_active: '1',
    fb_active: '1',
    gplus_active: '1',
    youtube_active: '1',
    vimeo_active: '0',
    instagram_active: '1',
    pinterest_active: '0',
    moleskine_active: '0',
    others_info: null,
    banner_pic: 'banner-image.png',
    shop_url: 'tst.com',
    shop_title: 'shoptitle',
    logo_pic: 'noimage.png',
    company_locality: '',
    country_pic: '',
    company_description: '',
    meta_keyword: null,
    meta_description: null,
    background_width: null,
    store_id: '0',
    contact_number: '',
    return_policy: null,
    shipping_policy: null,
    created_at: '',
    updated_at: '',
    admin_notification: '0',
    privacy_policy: null,
    allowed_categories: '',
  },
];

function VendorDetails({route, navigation, props}) {
  const [inputs, setInputs] = React.useState({
    photo: '',
    image_location: null,
    imageName: '',
    mime: '',
  });
  const [imgs, setImgs] = useState();
  const [banner, setBanner] = useState();
  const [vendorDetails, setVendorDetails] = React.useState([]);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  const [editable, setEditable] = React.useState(false);

  const [image, setImage] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);

  const sheetRef = React.useRef(null);
  const fall = new Animated.Value(1);

  console.log('vendorDetails', vendorDetails);

  React.useEffect(() => {
    getVendorDetails();
  }, []);

  const takePhotoFromCamera = () => {
    try {
      ImagePicker.openCamera({
        compressImageMaxHeight: 400,
        compressImageMaxWidth: 400,
        cropping: true,
        compressImageQuality: 0.7,
        includeBase64: true,
      })
        .then(image => {
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
          setImage(imageUri);
          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
          setInputs(prevState => ({
            ...prevState,
            ['image_location']: imageUri,
          }));
          setInputs(prevState => ({...prevState, ['photo']: image.data}));
          setInputs(prevState => ({...prevState, ['imageName']: fileName}));
          setInputs(prevState => ({...prevState, ['mime']: image.mime}));

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
        compressImageMaxHeight: 400,
        compressImageMaxWidth: 400,
        //cropping: true,
        compressImageQuality: 0.7,
        includeBase64: true,
      })
        .then(image => {
          //console.log('image', image);
          const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;

          let fileName = image.path.substring(image.path.lastIndexOf('/') + 1);
          setInputs(prevState => ({
            ...prevState,
            ['image_location']: imageUri,
          }));
          setInputs(prevState => ({...prevState, ['photo']: image.data}));
          setInputs(prevState => ({...prevState, ['imageName']: fileName}));
          setInputs(prevState => ({...prevState, ['mime']: image.mime}));

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

  const productImg = type => {
    ImageCropPicker.openPicker({
      includeBase64: true,
      multiple: true,
    })
      .then(image => {
        if (type == 'profile') {
          const imageUri =
            Platform.OS === 'ios' ? image[0].sourceURL : image[0].path;
          console.log('image', image);
          let x = image[0].path.split('/');
          let name = x[x.length - 1];
          let imgData = {
            base64_encoded_data: image[0].data,
            name: name,
            path: imageUri,
          };
          setImgs(imgData);
        } else {
          const imageUri =
            Platform.OS === 'ios' ? image[0].sourceURL : image[0].path;
          console.log('image', image);
          let x = image[0].path.split('/');
          let name = x[x.length - 1];
          let imgData = {
            base64_encoded_data: image[0].data,
            name: name,
            path: imageUri,
          };
          setBanner(imgData);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  console.log('imgs', imgs);

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

  const renderHeader = () => (
    <View style={styles.headerDotContainer}>
      <View style={styles.headerDot} />
    </View>
  );

  const UploadCancelHandle = () => {
    setInputs(prevState => ({...prevState, ['photo']: null}));
  };
  const customerDetails = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);

  const getVendorDetails = async () => {
    setVendorDetails([]);
    try {
      let result = await createpost({
        tokenType: 'adminAdd',
        url: `${commonUrl.vendorDetails}`,
        body: {
          sellerid: {
            //seller_id: customerDetails?.id,
            seller_id: '14214',
          },
        },
      });
      if (result.status === 200) {
        console.log('result.data', result.data);
        setVendorDetails(result?.data);
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        text1: `${error}`,
        type: 'error',
        position: 'bottom',
      });
    } finally {
      setLoading(false);
    }
  };
  const handleOnchange = (text, input) => {
    setInputs(prevState => ({...prevState, [input]: text}));
  };

  const handleError = (error, input) => {
    setErrors(prevState => ({...prevState, [input]: error}));
  };

  return (
    <>
      {loading ? (
        <Loader visible={loading} />
      ) : (
        <SafeAreaView style={styles.container}>
          <Animated.View>
            <ScrollView>
              <View style={styles.subContainer}>
                <View style={styles.topContainer}>
                  <TouchableOpacity
                    style={styles.circleContainer}
                    onPress={() => productImg('profile')}>
                    <AppImage
                      source={{
                        uri: imgs?.path
                          ? imgs?.path
                          : `${IMAGE_PATH.VENDOR_DETAILS}/${
                              vendorDetails[vendorDetails.length - 1]?.logo_pic
                            }`,
                      }}
                      style={styles.imageContainer}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => productImg('profile')}>
                    <AppImage
                      source={icons.editImage}
                      size={calcH(0.05)}
                      style={styles.editImage}
                    />
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    style={[]}
                    onPress={() => productImg('banner')}>
                    <AppImage
                      source={{
                        uri: banner?.path
                          ? banner?.path
                          : `${IMAGE_PATH.VENDOR_DETAILS}/${
                              vendorDetails[vendorDetails.length - 1]
                                ?.banner_pic
                            }`,
                      }}
                      resizeMode="center"
                      style={{
                        width: '95%',
                        height: calcH(0.16),
                        borderRadius: 0,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.inputContainer}>
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="account-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.fullname}
                    inputContainer={true}
                    editable={editable}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      borderBottomWidth: editable ? 0 : 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: editable ? 1 : 0}}
                  /> */}
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="store-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.business}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   borderBottomWidth: editable ? 0 : 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{ borderWidth: editable ? 1 : 0 }}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  /> */}
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="email-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.email}
                    inputContainer={true}
                    // editable={false}
                    // //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   //borderBottomWidth: editable ? 0 : 0.5,
                    //   borderBottomWidth: 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{ borderWidth: 0 }}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                    // editable={editable}
                    // //selectTextOnFocus={editable}
                    // inputStyle={{
                    //   borderBottomWidth: editable ? 0 : 0.5,
                    //   borderColor: COLORS.profile_bottom_border,
                    // }}
                    // containerStyle={{borderWidth: editable ? 1 : 0}}
                  /> */}
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="phone-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.mobile}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  /> */}
                  {/* <Input
                    onChangeText={text => handleOnchange(text, 'fullname')}
                    onFocus={() => handleError(null, 'fullname')}
                    iconName="map-marker-outline"
                    placeholder={strings.ENTER_NAME}
                    error={errors.fullname}
                    value={inputs.address ? inputs.address : 'Empty'}
                    inputContainer={true}
                    editable={false}
                    //selectTextOnFocus={editable}
                    inputStyle={{
                      //borderBottomWidth: editable ? 0 : 0.5,
                      borderBottomWidth: 0.5,
                      borderColor: COLORS.profile_bottom_border,
                    }}
                    containerStyle={{borderWidth: 0}}
                  /> */}

                  <View>
                    {editable || inputs.image_location ? (
                      <Button
                        title={strings.UPDATE.toLocaleUpperCase()}
                        bgColor={COLORS.white}
                        onPress={validate}
                        containerStyle={{
                          marginVertical: calcH(0.01),
                          borderWidth: 1,
                        }}
                        color={COLORS.BlackTie}
                        height={calcH(0.065)}
                      />
                    ) : null}
                    <Button
                      title={!editable ? strings.EDIT_PROFILE : strings.CANCEL}
                      bgColor={COLORS.BlackTie}
                      onPress={() => {
                        setEditable(!editable);
                      }}
                      containerStyle={{marginVertical: calcH(0.01)}}
                      height={calcH(0.065)}
                    />
                  </View>
                  <View style={{height: calcH(0.12)}} />
                </View>
              </View>
            </ScrollView>
            {/* <BottomSheet
              ref={sheetRef}
              snapPoints={['55%', 300, 0]}
              borderRadius={10}
              //renderHeader={renderHeader}
              renderContent={RenderContent}
              initialSnap={2}
              //callbackNode={fall}
              enabledInnerScrolling={false}
              onCloseStart={() => setModal(false)}
            /> */}
          </Animated.View>
        </SafeAreaView>
      )}
    </>
  );
}

export default VendorDetails;
