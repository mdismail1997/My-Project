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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import RenderHtml from 'react-native-render-html';

import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function PrivacyP({ navigation }) {
  useEffect(() => {
    setLoder(true);

    info();
  }, []);

  const [loder, setLoder] = useState(false);
  const [data, setdata] = useState('');

  info = () => {
    GetRequest('cmsPage/4', undefined, {}, 'admin')
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
    <View style={styles.container}>
      <Header title="Privacy Policy" navigation={navigation} icon="arrowleft" />
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
        <RenderHtml contentWidth={width} source={{ html: data }}
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
