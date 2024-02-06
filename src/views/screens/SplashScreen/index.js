import React from 'react';
import {
  View,
  Text,
  I18nManager,
  ImageBackground,
  ScrollView,
} from 'react-native';
import RenderHtml from 'react-native-render-html';

import Button from '../../components/Button';
import ButtonSplash from '../../components/ButtonSplash';
import styles from './style';
import COLORS from '../../../conts/colors';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';
import Loader from '../../components/Loader';
import icons from '../../../conts/icons.js';
import {calcH, calcW, fSize} from '../../../utils/constants/common.js';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import {ScreenWidth} from '@rneui/base';
import Toast from 'react-native-toast-message';

function SplashScreen({route, navigation}) {
  const [loading, setLoading] = React.useState(true);
  const [langCode, setLangCode] = React.useState(31);
  const [descriptionData, setDescriptionData] = React.useState('');

  const lngData = getLng();

  // React.useEffect(() => {
  //   if (lngData === 'en') setLangCode(31);
  //   if (lngData === 'ar') setLangCode(33);
  //   selectedLng();
  // }, []);


  React.useEffect(() => {
    setTimeout(() => {
      navigation.navigate("LanguageScreen")
    }, 3000);
    // setLoder(true)
    // selectedLng()
    // info()
  }, []);

  const selectedLng = async () => {
    const lngData = await getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (!lngData) {
      strings.setLanguage('en');
    }
    if (lngData === 'en') {
      setLangCode(31);
      await I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      setLangCode(33);
      await I18nManager.forceRTL(true);
    }
    console.log('selected Language data==>>>', lngData);
    //setLoading(false);
  };
  console.log('lngData', lngData);

  React.useEffect(() => {
    if (lngData === 'en' || 'ar') getUserDetails();
  }, [langCode]);

  const url = `${commonUrl.getSplashDescription}${langCode}`;

  console.log('langCode', langCode);

  const getUserDetails = async () => {
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        setDescriptionData(result?.data?.content);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        text1: `${error?.response?.data?.message}`,
        type: 'error',
      });
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  console.log('descriptionData', descriptionData);

  return (
    <View style={{ flex:1,}}>
  
    <ImageBackground
      source={icons.WelCome_bg}
      resizeMode="cover"
      style={{flex:1, }}>
      <View style={styles.bodyContainer}>
        <View style={{alignItems: 'center'}}>
       
        </View>
        
       
      </View>
    </ImageBackground>
    <Loader visible={loading} />
    </View>
    
   
  );
}

export default SplashScreen;
