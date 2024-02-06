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
import HeaderwithTitle from '../Common/HeaderwithTitle';
import {base_url} from '../../Services/constants';
import axios from 'axios';

import Hud from '../Common/Hud';

const {width, height} = Dimensions.get('window');

const Faq = props => {
  useEffect(() => {
    //getFaq();
    //unsubscribe();
    const unsubscribe = props.navigation.addListener('focus', async () => {
      getFaq();
    });
    return unsubscribe;
  }, []);

  const getFaq = async () => {
    Hud.showHud();
    await axios
      .get(base_url + 'faq')
      .then(response => {
        //   console.log(response.status);
        console.log('------>', response.data.data);
        Hud.hideHud();
        if (response.status == 200) {
          setData(response.data.data);
          //setLoading(false);
        } else {
          //setLoading(false);
          console.log('Response Error in FAQ==>', error);
        }
      })
      .catch(function (error) {
        Hud.hideHud();
        if (error.response) {
          // Request made and server responded

          console.log('Response error in FAQ==>', error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error request===>', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Something happened in setting Error==>', error.message);
        }
      });
  };

  const setShow = index => {
    let newArr = [...check];
    newArr[index] = !newArr[index];

    setCheck(newArr);
  };

  const [data, setData] = useState([]);
  const [check, setCheck] = useState([]);
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
        <HeaderwithTitle navProps={props.navigation} title={'FAQ'} />

        {/* {isLoading ? (
          <ActivityIndicator size="large" color="#E92D87" />
        ) : ( */}
        <KeyboardAvoidingScrollView
          bounces={false}
          //behavior="padding"
          showsVerticalScrollIndicator={false}
          style={{backgroundColor: '#ffffff', width: width * 0.9}}>
          <View style={{marginBottom: height * 0.14, marginTop: height * 0.03}}>
            {data.map((item, index) => {
              return (
                <View style={styles.group} key={index}>
                  <TouchableOpacity
                    onPress={() => setShow(index)}
                    style={styles.header}>
                    <Text
                      style={{
                        color: '#151143',
                        fontWeight: '500',
                        fontSize: RFValue(18),
                        //fontFamily: 'Roboto-Medium',
                      }}>
                      {item.question}
                    </Text>

                    {check[index] ? (
                      <View style={{height: 15, width: 15}}>
                        {/* <Icon name="caret-up-sharp" size={13} /> */}
                        <Image
                          source={require('../../Assets/Icon/up.png')}
                          style={{width: '100%', height: '100%'}}
                          resizeMode="contain"
                        />
                      </View>
                    ) : (
                      <View style={{height: 15, width: 15}}>
                        {/* <Icon name="caret-up-sharp" size={13} /> */}
                        <Image
                          source={require('../../Assets/Icon/down.png')}
                          style={{width: '100%', height: '100%'}}
                          resizeMode="contain"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  {check[index] ? (
                    <View style={{margin: 5, padding: 5}}>
                      <Text
                        style={{
                          color: '#7B7B7B',
                          fontWeight: '300',
                          fontSize: RFValue(18),
                          //fontFamily: 'Roboto-Light',
                        }}>
                        {item.answer}
                      </Text>
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>
        </KeyboardAvoidingScrollView>
        {/* )} */}
      </View>
    </SafeAreaView>
  );
};

export default Faq;

const styles = StyleSheet.create({
  group: {
    margin: height * 0.01,
    //borderColor:'dimgrey',
    //borderWidth:1,
    borderRadius: 8,
    //elevation: 0.3,
    borderColor: '#7B7B7B',
    borderWidth: 0.5,
    width: width * 0.9,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 15,
  },
});
