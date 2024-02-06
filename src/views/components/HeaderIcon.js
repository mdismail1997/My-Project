import React, {memo} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {useDrawerStatus} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';

import AppImage from './AppImage.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import storage from '../../utils/constants/storage.js';
import {
  calcH,
  calcW,
  fSize,
  IMAGE_PATH,
  STORAGE_KEY,
} from '../../utils/constants/common.js';
import {createGet} from '../../utils/constants/API/ServerRequest.js';
import COLORS from '../../conts/colors.js';
import * as commonUrl from '../../utils/constants/API/commonUrl';
import icons from '../../conts/icons.js';

import cache from '../../utils/constants/cache.js';
import {capitalizeFirstLetter} from '../navigator/DrawerContent.js';
import {FONTS} from '../../conts/theme.js';
import strings from './lng/LocalizedStrings.js';
import mmkv from '../../utils/constants/mmkv/index.js';

const HeaderIcon = ({isSingleIcon,setProfileId,profileid}) => {
  const [loading, setLoading] = React.useState(true);
  const [userData, setUserData] = React.useState({
    profilePicture: '',
    name: '',
  });

  const isDrawerOpen = useDrawerStatus() === 'open';
  const isDrawerClosed = useDrawerStatus() === 'closed';

  //console.log('userData ===>', userData);
  React.useEffect(() => {
    getUserDetails();
    // return () => {
    //   setUserData({}); // This worked for me
    // };
  }, [isDrawerClosed]);

  const getUserDetails = React.useCallback(async () => {
    setLoading(true);
    // const data = await cache.get(STORAGE_KEY.CUSTOMER_DETAILS);
    // console.log('data', data);
    const data = mmkv.get(STORAGE_KEY.CUSTOMER_DETAILS);
    console.log('data======>', data.id);
   
    if (data === null) {
      console.log(`getUserDetails  api call from HeaderIcon`);
      try {
        let result = await createGet({
          tokenType: 'self',
          url: commonUrl.customerDetails,
        });
        if (result.status === 200) {
          //console.log('Profile data ==> ', result.data);
          //setCustomerId(result.data?.id);
          setUserData(prevState => ({
            ...prevState,
            ['name']: result.data?.firstname,
          }));
          //setName(result.data?.firstname);
          result.data?.custom_attributes.map(item => {
            if (item?.attribute_code == 'avatar') {
              setUserData(prevState => ({
                ...prevState,
                ['profilePicture']: item?.value,
              }));
              //setProfileImg(item?.value);
            }
          });
        }
      } catch (error) {
        console.log('Profile error = ', error);
      } finally {
        setLoading(false);
      }
    } else {
      setProfileId(data.id)
      console.log(`getUserDetails mmkv headerIcon`);
      setUserData(prevState => ({...prevState, ['name']: data?.firstname}));
      data?.custom_attributes?.map(item => {
        if (item?.attribute_code == 'avatar') {
          setUserData(prevState => ({
            ...prevState,
            ['profilePicture']: item?.value,
          }));
        }
      });
      setLoading(false);
    }
  }, [getUserDetails]);

  const navigation = useNavigation();

  const onPressImage = () => navigation.navigate('Account');

  const RenderDefaultImage = () => (
    <AppImage
      size={isSingleIcon ? calcH(0.05) : calcH(0.04)}
      style={{marginRight: 2}}
      source={icons.user}
    />
  );
  const RenderProfileImage = () => (
    <AppImage
      size={isSingleIcon ? calcH(0.05) : calcH(0.04)}
      style={{marginRight: 2}}
      source={{
        uri: `${IMAGE_PATH.CUSTOMER_PROFILE_PATH}${userData?.profilePicture}`,
      }}
    />
  );

  if (isSingleIcon) {
    return (
      <View style={styles.container}>
        {userData.profilePicture === '' ? (
          <TouchableOpacity onPress={onPressImage}>
            <RenderDefaultImage />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onPressImage}>
            <RenderProfileImage />
          </TouchableOpacity>
        )}
        <View style={styles.greetingContainer}>
          <Text style={styles.title}>
            {strings.HI}, {`${capitalizeFirstLetter(userData?.name)}`}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
        <Ionicons
          name="md-search-outline"
          size={calcH(0.04)}
          color={COLORS.white}
          style={{marginRight: 15}}
        />
      </TouchableOpacity>
      {/* {userData.profilePicture === '' ? (
        // <AppImage
        //   size={calcH(0.04)}
        //   style={{marginRight: 2}}
        //   source={icons.user}
        // />
        <TouchableOpacity onPress={onPressImage}>
          <RenderDefaultImage />
        </TouchableOpacity>
      ) : (
        // <AppImage
        //   size={calcH(0.04)}
        //   style={{marginRight: 2}}
        //   source={{
        //     uri: `${IMAGE_PATH.CUSTOMER_PROFILE_PATH}${userData.profilePicture}`,
        //   }}
        // />
        <TouchableOpacity onPress={onPressImage}>
          <RenderProfileImage />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default memo(HeaderIcon);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    //borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: fSize(18),
    // marginTop: 3,
    // fontWeight: 'bold',
    ...FONTS.WorkSans_reg,
    color: COLORS.white,
    textAlign: 'center',
  },
  greetingContainer: {
    marginLeft: calcW(0.05),
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
