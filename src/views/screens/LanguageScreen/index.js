// import React from 'react';
// import {
//   View,
//   Text,
//   Image,
//   SafeAreaView,
//   I18nManager,
//   ImageBackground,
//   ScrollView,
//   Dimensions,
//   Alert,
// } from 'react-native';
// import Button from '../../components/Button';
// import LanguageButton from '../../components/LanguageButton';
// import styles from './style';
// import COLORS from '../../../conts/colors';
// import RNRestart from 'react-native-restart';
// import {setLng, getLng} from '../../components/lng/changeLng';
// import strings from '../../components/lng/LocalizedStrings';
// import Loader from '../../components/Loader';
// import icons, * as images from '../../../conts/icons.js';
// import * as commonUrl from '../../../utils/constants/API/commonUrl';
// import RenderHtml from 'react-native-render-html';
// import {ScreenWidth} from '@rneui/base';
// import Toast from 'react-native-toast-message';
// import {createGet} from '../../../utils/constants/API/ServerRequest.js';
// import {calcH, fSize} from '../../../utils/constants/common.js';
// import ButtonDark0 from '../../Button/DarkButton';
// import ButtonWhite0 from '../../Button/ButtonWhite';
// import StartButton from '../../Button/Startbutton';


// const  Width  = Dimensions.get('window').width;
// const  Height  = Dimensions.get('window').height;


// function SplashScreen({route, navigation}) {
//   const [loading, setLoading] = React.useState(true);
//   const [langCode, setLangCode] = React.useState(32);
//   const [descriptionData, setDescriptionData] = React.useState('');
//   const [data, setdata] = React.useState('');
//   const [mybutton, setButton] = React.useState('');


//   const lngData = getLng();

//   React.useEffect(() => {
//     if (lngData === 'en') setLangCode(32);
//     if (lngData === 'ar') setLangCode(34);

//     selectedLng();
//   }, []);

//   const selectedLng = async () => {
//     const lngData = getLng();

//     if (lngData) {
//       strings.setLanguage(lngData);
//     }
//     if (lngData === 'en') {
//       I18nManager.forceRTL(false);
//       setLangCode(32);
//     }
//     if (lngData === 'ar') {
//       I18nManager.forceRTL(true);
//       setLangCode(34);
//     }

//     console.log('selected Language data==>>>', lngData);
//   };
//   console.log('descriptionData', descriptionData);
//   console.log('langCode', langCode);

//   const onChangeLng = lng => {
//     // console.log('onChangeLng work!');
//     console.log('onChangeLng lng', lng);
//     const lngData = getLng();

//     if (lng === 'en' && lngData === 'en') {
//       I18nManager.forceRTL(false);
//       //await setLng('en');
//       setLng('en');
//       navigation.navigate('LoginScreen');
//     } else if (lng === 'en' && !lngData) {
//       I18nManager.forceRTL(false);
//       //await setLng('en');
//       setLng('en');
//       navigation.navigate('LoginScreen');
//     }
//     if (lng === 'en' && lngData === 'ar') {
//       I18nManager.forceRTL(false);
//       //await setLng('en');
//       setLng('en');
//       //setLangCode(34);
//       //navigation.navigate("LoginScreen");
//       RNRestart.Restart();
//     }
//     if (lng === 'ar' && lngData === 'ar') {
//       I18nManager.forceRTL(true);
//       // await setLng('ar');
//       setLng('ar');
//       //setLangCode(34);
//       navigation.navigate('LoginScreen');
//     } else if (lng === 'ar' && !lngData) {
//       I18nManager.forceRTL(true);
//       //await setLng('en');
//       setLng('ar');
//       RNRestart.Restart();
//       //navigation.navigate("LoginScreen");
//     }
//     if (lng === 'ar' && lngData === 'en') {
//       I18nManager.forceRTL(true);
//       // await setLng('ar');
//       setLng('ar');
//       RNRestart.Restart();
//       //navigation.navigate("LoginScreen");
//     }
//   };

//   React.useEffect(() => {
//     if (lngData === 'en' || 'ar') getUserDetails();
//   }, [langCode]);

//   const url = `${commonUrl.getSplashDescription}${langCode}`;

//   const getUserDetails = async () => {
//     setLoading(true);
//     try {
//       let result = await createGet({
//         tokenType: 'admin',
//         url: url,
//       });
//       if (result.status === 200) {
//         setDescriptionData(result?.data?.content);
//         console.log('result.data', result.data);
//       }
//     } catch (error) {
//       setLoading(false);
//       Toast.show({
//         text1: `${error?.response?.data?.message}`,
//         type: 'error',
//       });
//       console.log(error.response.data.message);
//     } finally {
//       setLoading(false);
//     }
//   };



//   const selectLanguage =() =>{
//     if(mybutton=='en'){
//       onChangeLng('en');
//     }else if(mybutton=='ar'){
//       onChangeLng('ar');
//     }else{
//       Alert.alert('', 'Select any Language', [
//         { text: '' },
//         { text: 'OK' },
//       ])
//     }
//    }

//   return (
    
//     <SafeAreaView style={{  flex:1,}}>
//     <Loader visible={loading} />
//     <ImageBackground
//     source={icons.language_bg}
//     resizeMode="cover"
//     style={styles.container}>
 
//     <View style={{flexDirection:'row',width:Width*.5,alignSelf:'center',justifyContent:'space-between',marginTop:Height*.23, }}>
//     <ButtonDark0
//       handleClick={async () => {
//         setButton('en')
//         onChangeLng('en');
//       }}
//       title="ENGLISH"
//     />
//     <ButtonWhite0
//     handleClick={async () => {
      
//       setButton('ar')
//       onChangeLng('ar');
//     }}
//     title="ARABIC"
//   />
//     </View>
    


//     <View style={{flexDirection:'row',width:Width*.3,alignSelf:'center',marginTop:Height*.02,alignItems:'center',justifyContent:'center', }} >
//     <StartButton
//     handleClick={async () => {
//       selectLanguage()
      
//     }}
//     title="GET STARTED"
//   />
//     </View>
//     <View style={{flexDirection:'row',width:Width*.37,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor: '#727273',  borderRadius:10,}}>
//     <Text style={{color:'black', fontSize: 14,}}>
//     Start as a Traders
//     </Text>
//     </View>  
  
//   </ImageBackground>



  
//     </SafeAreaView>
     
   
//   );
// }

// export default SplashScreen;




import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  I18nManager,
  ImageBackground,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Button from '../../components/Button';
import LanguageButton from '../../components/LanguageButton';
import styles from './style';
import COLORS from '../../../conts/colors';
import RNRestart from 'react-native-restart';
import {setLng, getLng} from '../../components/lng/changeLng';
import strings from '../../components/lng/LocalizedStrings';
import Loader from '../../components/Loader';
import icons, * as images from '../../../conts/icons.js';
import * as commonUrl from '../../../utils/constants/API/commonUrl';
import RenderHtml from 'react-native-render-html';
import {ScreenWidth} from '@rneui/base';
import Toast from 'react-native-toast-message';
import {createGet} from '../../../utils/constants/API/ServerRequest.js';
import {calcH, fSize} from '../../../utils/constants/common.js';
import ButtonDark0 from '../../Button/DarkButton';
import ButtonWhite0 from '../../Button/ButtonWhite';
import StartButton from '../../Button/Startbutton';


const  Width  = Dimensions.get('window').width;
const  Height  = Dimensions.get('window').height;


function SplashScreen({route, navigation}) {
  const [loading, setLoading] = React.useState(true);
  const [langCode, setLangCode] = React.useState(32);
  const [descriptionData, setDescriptionData] = React.useState('');
  const [data, setdata] = React.useState('');
  const [mybutton, setButton] = React.useState('');


  const lngData = getLng();

  React.useEffect(() => {
    if (lngData === 'en') setLangCode(32);
    if (lngData === 'ar') setLangCode(34);

    selectedLng();
  }, []);

  const selectedLng = async () => {
    const lngData = getLng();

    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
      setLangCode(32);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true);
      setLangCode(34);
    }

    console.log('selected Language data==>>>', lngData);
  };
  console.log('descriptionData', descriptionData);
  console.log('langCode', langCode);

  const onChangeLng = lng => {
    // console.log('onChangeLng work!');
    console.log('onChangeLng lng', lng);
    const lngData = getLng();

    if (lng === 'en' && lngData === 'en') {
      I18nManager.forceRTL(false);
      //await setLng('en');
      setLng('en');
      navigation.navigate('LoginScreen');
    } else if (lng === 'en' && !lngData) {
      I18nManager.forceRTL(false);
      //await setLng('en');
      setLng('en');
      navigation.navigate('LoginScreen');
    }
    if (lng === 'en' && lngData === 'ar') {
      I18nManager.forceRTL(false);
      //await setLng('en');
      setLng('en');
      //setLangCode(34);
      //navigation.navigate("LoginScreen");
      RNRestart.Restart();
    }
    if (lng === 'ar' && lngData === 'ar') {
      I18nManager.forceRTL(true);
      // await setLng('ar');
      setLng('ar');
      //setLangCode(34);
      navigation.navigate('LoginScreen');
    } else if (lng === 'ar' && !lngData) {
      I18nManager.forceRTL(true);
      //await setLng('en');
      setLng('ar');
      RNRestart.Restart();
      //navigation.navigate("LoginScreen");
    }
    if (lng === 'ar' && lngData === 'en') {
      I18nManager.forceRTL(true);
      // await setLng('ar');
      setLng('ar');
      RNRestart.Restart();
      //navigation.navigate("LoginScreen");
    }
  };

  React.useEffect(() => {
    if (lngData === 'en' || 'ar') getUserDetails();
  }, [langCode]);

  const url = `${commonUrl.getSplashDescription}${langCode}`;

  const getUserDetails = async () => {
    setLoading(true);
    try {
      let result = await createGet({
        tokenType: 'admin',
        url: url,
      });
      if (result.status === 200) {
        setDescriptionData(result?.data?.content);
        console.log('result.data', result.data);
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
    <Loader visible={loading} />
    <ImageBackground
    source={icons.language_bg}
    resizeMode="cover"
    style={styles.container}>
 
    <View style={{flexDirection:'row',width:Width*.5,alignSelf:'center',justifyContent:'space-between',marginTop:Height*.23, }}>
    <ButtonDark0
      handleClick={async () => {
        setButton('en')
        onChangeLng('en');
      }}
      title="ENGLISH"
    />
    <ButtonWhite0
    handleClick={async () => {
      
      setButton('ar')
      onChangeLng('ar');
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
    {/* <View style={{flexDirection:'row',width:Width*.37,alignSelf:'center',alignItems:'center',justifyContent:'center',backgroundColor: '#727273',  borderRadius:10,}}>
    <Text style={{color:'black', fontSize: 14,}}>
    Start as a Traders
    </Text>
    </View>    */}
  
  </ImageBackground>



  
    </SafeAreaView>
     
   
  );
}

export default SplashScreen;
