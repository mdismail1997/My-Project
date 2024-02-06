import React, { useContext, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  Dimensions,
  Alert,
  SafeAreaView
} from 'react-native';
import ButtonDark from '../../Component/Common/ButtonDark';
import ButtonWhite from '../../Component/Common/ButtonWhite';
import ButtonDark0 from '../../Component/Common/LanguageSelectButton';
import ButtonWhite0 from '../../Component/Common/languageSelect0';
import StartButton from '../../Component/Common/StartButton'
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';
import RNRestart from 'react-native-restart';
import RenderHtml from 'react-native-render-html';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';

const  Width  = Dimensions.get('window').width;
const  Height  = Dimensions.get('window').height;

export default function SelectLanguage({ navigation }) {
  React.useEffect(() => {
    selectedLng();
    info()
  }, []);

  const [data, setdata] = useState('');
  const [mybutton, setButton] = useState('');

  const info = async () => {
    const lngData = await getLng()
    let id = ''
    if (lngData == 'en') {
      id = 32
    } else {
      id = 34
    }
    GetRequest(`cmsBlock/${id}`, undefined, {}, 'admin')
      .then(response => {
        // console.warn('fbdskj', response);
        setdata(response.content);
      })
      .catch(error => {
        // console.warn('info error => ', error);
      });
  };


  const selectedLng = async () => {
    const lngData = await getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      // I18nManager.forceRTL(true)
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      // I18nManager.swapLeftAndRightInRTL(true);
    }
    // await setLoading(false);
    console.warn('selected Language data==>>>', lngData);
  };

  // const onChangeLng = async (lng) => {
  //   console.warn("onChangeLng work!")
  //   if (lng === 'en') {
  //     await I18nManager.forceRTL(false);
  //     await setLng('en');
  //     navigation.navigate('signin')
  //   }
  //   if (lng === 'ar') {
  //     await I18nManager.forceRTL(true)
  //     await setLng('ar');
  //     navigation.navigate('signin')
  //     // RNRestart.Restart();
  //   }
  // }

  // const onChangeLng = async lng => {
  //   // console.log('onChangeLng work!');
  //   console.log('onChangeLng lng', lng);
  //   const lngData = await getLng();

  //   if (lng === 'en' && lngData === 'en') {
  //     I18nManager.forceRTL(false);
  //     //await setLng('en');
  //     setLng('en');
  //     navigation.navigate('signin');
  //   }
  //   if (lng === 'en' && lngData === 'ar') {
  //     I18nManager.forceRTL(false);
  //     //await setLng('en');
  //     setLng('en');
  //     navigation.navigate('signin');
  //     RNRestart.Restart();
  //   }
  //   if (lng === 'ar' && lngData === 'ar') {
  //     I18nManager.forceRTL(true);
  //     // await setLng('ar');
  //     setLng('ar');
  //     navigation.navigate('signin');
  //   }
  //   if (lng === 'ar' && lngData === 'en') {
  //     I18nManager.forceRTL(true);
  //     // await setLng('ar');
  //     setLng('ar');
  //     RNRestart.Restart();
  //     navigation.navigate('signin');
  //   }
  // };

  const onChangeLng = async lng => {
    const lngData = await getLng();
    console.warn('lngData', lngData, lng);
    if (lng === 'en' && lngData === 'en') {
      console.log('en en');
      I18nManager.forceRTL(false);
      await setLng('en');
      navigation.navigate('signin');
    } else
      if (lng === 'en' && lngData === 'ar') {
        console.log('en ar');
        I18nManager.forceRTL(false);
        await setLng('en');
        RNRestart.Restart();
      } else
        if (lng === 'ar' && lngData === 'ar') {
          console.log('ar ar');
          I18nManager.forceRTL(true);

          await setLng('ar');
          navigation.navigate('signin');
        } else
          if (lng === 'ar' && lngData === 'en') {
            console.log('aren');
            I18nManager.forceRTL(true);

            await setLng('ar');
            RNRestart.Restart();
          } else {
            await setLng(lng);
            RNRestart.Restart();
            if (lng == 'ar') {
              I18nManager.forceRTL(true);
            } else {
              I18nManager.forceRTL(false);
            }
          }
  };
 const selectLanguage =() =>{
  if(mybutton=='en'){
    onChangeLng('en');
  }else if(mybutton=='ar'){
    onChangeLng('ar');
  }else{
    Alert.alert('', 'Select any Language', [
      { text: '' },
      { text: 'OK' },
    ])
  }
 }
  return (
    <SafeAreaView style={{  flex:1,}}>
    
    <ImageBackground
    source={require('../../Assets/Splash03.jpg')}
    resizeMode="cover"
    style={styles.container}>
 
    <View style={{flexDirection:'row',width:Width*.5,alignSelf:'center',justifyContent:'space-between',marginTop:Height*.23, }}>
    <ButtonDark0
      handleClick={async () => {
        setButton('en'),
        onChangeLng('en');
        // await setLng('en');
      }}
      title="ENGLISH"
    />
    <ButtonWhite0
    handleClick={async () => {
      
      setButton('ar'),
      onChangeLng('ar');
      // await setLng('ar');
    }}
    title="ARABIC"
  />
    </View>
    


    <View style={{flexDirection:'row',width:Width*.3,alignSelf:'center',marginTop:Height*.02,alignItems:'center',justifyContent:'center', }} >
    <StartButton
    handleClick={async () => {
      selectLanguage()
      
    }}
    title="GET STARTED"
  />
    </View>
   
 
     
      
      {/* <Text style={styles.text}>{strings.START_DESC}</Text> */}
   
  
  </ImageBackground>
    
   
   
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height:Height,
    width:Width,
   
  },
  heading: {
    fontSize: 30,
    fontFamily: 'Roboto-Regular',
    color: '#47474B',
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: '#828287',
    textAlign: 'center',
    marginBottom: 30,
  },
  discript: {

  },
});
