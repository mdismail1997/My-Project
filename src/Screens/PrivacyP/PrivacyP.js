import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  I18nManager
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import RenderHtml from 'react-native-render-html';
import WebView from 'react-native-webview';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';

const { width, height } = Dimensions.get('window');

export default function PrivacyP({ navigation }) {
  useEffect(() => {
    setLoder(true);
    selectedLng()
    info();
  }, []);

  const [loder, setLoder] = useState(false);
  const [data, setdata] = useState('');

  selectedLng = async () => {
    const lngData = await getLng()
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
    // console.warn("selected Language data==>>>", lngData)
  }

  info = async () => {
    const lngData = await getLng()
    let id = ''
    if (lngData == 'en') {
      id = 4
    } else {
      id = 18
    }
    GetRequest(`cmsPage/${id}`, undefined, {}, 'admin')
      .then(response => {
        setLoder(false);
        console.warn('fbdskj', response);
        setdata(response.content);
      })
      .catch(error => {
        console.log('info error => ', error);
      });
  };

  return (

    <View style={styles.container}>
      <Header title={strings.PRIVACYPOL} navigation={navigation} icon="arrowleft" />
      {/* 
            <WebView
                // ref={ref => (webviewRef.current = ref)}
                originWhitelist={['*']}
                source={{ html: data }}
                domStorageEnabled
                javaScriptEnabled
                allowUniversalAccessFromFileURLs
                onMessage={message => console.warn('Webview ', message)}
                onError={e => console.warn('Webview Error', e)}
                mixedContentMode='always'
            /> */}
      <ScrollView style={{ paddingHorizontal: 20 }}>
        <RenderHtml
          contentWidth={width}
          source={{ html: data }}
          tagsStyles={{
            h1: { color: '#000' },
            h2: { color: '#000' },
            h3: { color: '#000' },
            h4: { color: '#000' },
            h5: { color: '#000' },
            p: { color: '#000' },
          }} />
      </ScrollView>
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
