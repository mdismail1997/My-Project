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
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function Refund({ navigation }) {
    useEffect(() => {
        setLoder(true);
        selectedLng()
        info();
    }, []);

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
        setLoder(false)
        // console.warn("selected Language data==>>>", lngData)
    }

    const [loder, setLoder] = useState(false);
    const [data, setdata] = useState('');

    info = async () => {
        const lngData = await getLng()
        let id = ''
        if (lngData == 'en') {
            id = 13
        } else {
            id = 14
        }
        GetRequest(`cmsPage/${id}`, undefined, {}, 'admin')
            .then(response => {
                setLoder(false);
                // console.warn('fbdskj', response);
                setdata(response.content);
            })
            .catch(error => {
                console.log('info error => ', error);
            });
    };

    return (
        <View style={styles.container}>
            <Header title={strings.REFUND} navigation={navigation} icon="arrowleft" />
            {/* <WebView
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
            <ScrollView style={{ margin: 20 }}>
                <RenderHtml contentWidth={width - 40}
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
