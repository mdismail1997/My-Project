import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';

import {KeyboardAvoidingScrollView} from 'react-native-keyboard-avoiding-scroll-view';
import {base_url} from '../../Services/constants';
import axios from 'axios';

import Hud from '../Common/Hud';
import HeaderwithTitle from '../Common/HeaderwithTitle';
import RenderHtml from 'react-native-render-html';

const {width, height} = Dimensions.get('window');

const PrivacyPolicy = props => {
  const [data, setData] = useState([]);

  useEffect(() => {
    //getPrivacyPolicy();
    //unsubscribe();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getPrivacyPolicy();
    });
    return unsubscribe;
  }, []);

  const getPrivacyPolicy = async () => {
    Hud.showHud();
    await axios
      .get(base_url + 'cms/privacy_policy')
      .then(response => {
        //   console.log(response.status);
        //console.log('------>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
        } else {
          console.log('Response Error in Privacy Policy==>', error);
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          console.log(
            'Response error in Privacy Policy ==>',
            error.response.data,
          );
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Something happened in setting Error==>', error.message);
        }
      });
  };
  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}>
        <HeaderwithTitle navProps={props.navigation} title={'Privacy Policy'} />

        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff', width: width * 0.9}}>
          <View style={{marginBottom: height * 0.14, marginTop: height * 0.03}}>
            {data.map((item, index) => {
              return (
                <View style={styles.group} key={index}>
                  {/* <Text
                    style={{
                      color: '#7B7B7B',
                      fontWeight: '300',
                      fontSize: RFValue(18),
                      //fontFamily: 'Roboto-Light',
                    }}>
                    {item.content}
                  </Text> */}
                  <RenderHtml
                    contentWidth={width * 0.8}
                    source={{html: `${item.content}`}}
                    tagsStyles={tagsStyles}
                  />
                </View>
              );
            })}
          </View>
        </KeyboardAvoidingScrollView>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const tagsStyles = {
  body: {
    whiteSpace: 'normal',
    color: 'gray',
  },
  p: {
    color: '#7B7B7B',
    //fontSize: 16,
    fontWeight: '300',
    fontSize: RFValue(18),
    //fontFamily: 'Roboto-Light',
  },
};

const styles = StyleSheet.create({
  group: {
    margin: height * 0.01,
    //borderColor:'dimgrey',
    //borderWidth:1,
    borderRadius: 8,
    //elevation: 0.3,
    width: width * 0.9,
    alignSelf: 'center',
    padding: 10,
    borderColor: '#7B7B7B',
    borderWidth: 0.5,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 15,
  },
});