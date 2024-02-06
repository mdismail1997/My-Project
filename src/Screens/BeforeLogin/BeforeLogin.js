import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, I18nManager, Dimensions } from 'react-native';
import ButtonDark from '../../Component/Common/ButtonDark';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import RenderHtml from 'react-native-render-html';
const { width, height } = Dimensions.get('window');

export default function BeforeLogin({ navigation }) {

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("language")
    }, 3000);
    // setLoder(true)
    // selectedLng()
    // info()
  }, []);
 

  const [loder, setLoder] = useState(false);
  const [lngData, setLngData] = useState('')
  const [data, setdata] = useState('');

  const selectedLng = async () => {
    const lngData = await getLng()
    setLngData(lngData)
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    setLoder(false)
    console.warn("selected Language data>>", lngData)
  }

  const info = async () => {
    const lngData = await getLng()
    let id = ''
    if (lngData == 'en') {
      id = 31
    } else {
      id = 33
    }
    GetRequest(`cmsBlock/${id}`, undefined, {}, 'admin')
      .then(response => {
        setLoder(false);
        console.warn('fbdskj', response);
        setdata(response.content);
      })
      .catch(error => {
        console.warn('info error => ', error);
      });
  };

  return (
    <ImageBackground
      source={require('../../Assets/Splash.jpg')}
      resizeMode="cover"
      style={styles.container}>
      <View style={styles.discript}>
       
        {/* <Text style={styles.text}>
          {lngData == 'ar' ? 'الحياة البيئية في الغد مجانية في العقارات. إنها ليست بوابة أو شاحنة نقية.' : `Tomorrow's ecological life is free in real estate. It is not a gate or a pure truck.`}
        </Text> */}

        
      </View>
    
     
      {loder && <Loder />}

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  heading: {
    fontSize: 30,
    fontFamily: 'Roboto-Regular',
    color: '#47474B',
    marginBottom: 10,
  },
  subhead: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#47474B',
    marginBottom: 20,
  },
  text: {
    fontSize: 15,
    fontFamily: 'Roboto-Regular',
    color: '#828287',
    textAlign: 'center',
    marginBottom: 30,
  },
  discript: {
    marginHorizontal: 40,
    alignItems: 'center',
  },
});
