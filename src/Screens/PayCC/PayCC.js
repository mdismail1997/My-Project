import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import Header from '../../Component/Header/Header';
import { Input, CheckBox } from 'react-native-elements';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest, PutRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { RadioButton } from 'react-native-paper';
// import ButtonDark from '../../Component/Common/ButtonDark';
import WebView from 'react-native-webview';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function PayCC(props) {
  const webviewRef = useRef(null)
  useEffect(() => {
    // console.warn('----------', props.route.params.url);
    // const data = JSON.stringify(props.route.params.url.url)
    // console.warn('@@@@@@@@@@@@@@@@@@@@@@@@', props.route.params.url);
    // console.log("aaaaaaaaaa",props.route.params.url.url)
    // setUrlData(data)
  }, []);

  // const [urlData, setUrlData] = useState('')
  // useEffect(() => {
  //   // SocialLogin();
  //   // have to put it inside a timeout function, otherwise the postMessage was called before the page was loaded
  //     // const body = qs.stringify(urlData);
  //     // const workingKey = '';
  //     // const accessCode = 'AVMN04IL19BP99NMPB';
  //     // const encRequest = encrypt(body, workingKey)
  //     // const formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>'

  // }, [])

  // const SocialLogin = async () => {
  //   // console.warn("userInfo social login", userInfo);
  
  //   // setLoder(true);
  //   let formdata = new FormData();
  //     formdata.append("access_code", 'AVMN04IL19BP99NMPB')
  //     formdata.append("encRequest", props.route.params.url.fields.encRequest)
    
  //     fetch('https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction',{
  //       method: 'post',
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       body: formdata
  //       })
  //   // PostRequest('https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction', data, {}, 'admin')
  //     .then(async res => {
  //       // setLoder(false);
  //       console.warn('Payment Details => ', res);
  //     })
  //     .catch(error => {
  //       // setLoder(false);
  //       console.warn("SocialLogin/registration error", error.response);
  //     });
  // };


  // const headerObj= {  'Content-Type': 'application/form-data',}
  // let formdata = new FormData();
  //     formdata.append("access_code", 'AVMN04IL19BP99NMPB')
  //     formdata.append("encRequest",props.route.params.url.fields.encRequest)
  //     formdata.append("integration_type", 'redirect')

  return (
    <View style={styles.container}>
      <Header title="Pay CCavneu" navigation={props.navigation} icon="arrowleft" />
      <WebView
        ref={ref => ref}
        originWhitelist={['*']}
        source={{
          uri: `https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction&integration_type=redirect&access_code=AVMN04IL19BP99NMPB&encRequest=${props.route.params.url.fields.encRequest}`,
         
        }}
        // style={{marginTop: 20}}
        domStorageEnabled
        javaScriptEnabled
        allowUniversalAccessFromFileURLs
        onMessage={message => console.warn("Transcation Details=============>",message)}
        onError={e => console.warn('Webview Error', e)}
        mixedContentMode="always"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 2,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#47474B',
  },
  buttontext: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#47474B',
    // textAlign: "center"
    marginLeft: 15,
  },
  txtStl: {
    fontFamily: 'Roboto-Regular',
    color: '#4F4F54',
    paddingVertical: 20,
  },
});
