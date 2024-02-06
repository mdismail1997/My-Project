import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ScrollView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {BASE_URL} from '../../utils/Api/apiName';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IconAntDesign from 'react-native-vector-icons/dist/AntDesign';
import Hud from '../../utils/hud';
import {
  calcH,
  calcW,
  allPadding,
  allRadius,
  buttonHeight,
} from '../../utils/comon';
import colors from '../../utils/colors';
import RenderHtml from 'react-native-render-html';
import commonToast from '../../utils/commonToast';
import {RFValue} from 'react-native-responsive-fontsize';

const PhoneNumberRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

export default function Termsandcondition({navigation}) {
  const [termsCondition, settermsCondition] = useState('');
  const [pagename, setPagename] = useState('');
  const [title, settitle] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [message, setMessage] = useState('');

  const [focusName, setFocusName] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [focusMobile, setFocusMobile] = useState(false);

  const onFocusTextInputName = () => {
    setFocusName(true);
  };

  const onBlurTextInputName = () => {
    setFocusName(false);
  };

  const onFocusTextInputEmail = () => {
    setFocusEmail(true);
  };

  const onBlurTextInputEmail = () => {
    setFocusEmail(false);
  };

  const onFocusTextInputMobile = () => {
    setFocusMobile(true);
  };

  const onBlurTextInputMobile = () => {
    setFocusMobile(false);
  };
  const [banner_image, setbanner_image] = useState(null);
  useEffect(() => {
    getProfile();
    const unsubscribe = navigation.addListener('focus', () => {
      getProfile();
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // function renderNode(node, index, siblings, parent, defaultRenderer) {
  //   if (node.name == 'mytag') {
  //     const specialSyle = node.attribs.style;
  //     return (
  //       <Text key={index} style={specialSyle}>
  //         {defaultRenderer(node.children, parent)}
  //       </Text>
  //     );
  //   }
  // }
  // ----------------------------------------------------------------------------------------------------
  const getProfile = async () => {
    const token = JSON.parse(await AsyncStorage.getItem('userToken'));
    const user = JSON.parse(await AsyncStorage.getItem('userData'));
    console.log('{token}', token);
    Hud.showHud();
    setName(user.name);
    setEmail(user.email);
    axios({
      method: 'get',
      url: BASE_URL + 'help-support',
      headers: {
        Accept: 'application/json',
        authorization: 'Bearer ' + token.data.data.token,
      },
    })
      .then(response => {
        console.log(response.data);
        Hud.hideHud();
        setPagename(response.data.page_name);
        settermsCondition(response.data.banner_content);
        settitle(response.data.title);
        setbanner_image(response.data.banner_image);
        // setFilePath(response.data.profile_photo)
      })
      .catch(err => {
        console.log('errprofile', err);
        Hud.hideHud();
        Alert.alert(err);
      });
  };
  const {width} = useWindowDimensions().width;
  //const {height} = useWindowDimensions().height;

  const handleSubmit = async () => {
    if (mobile) {
      if (!PhoneNumberRegex.test(mobile)) {
        commonToast({text: 'Invalid mobile no.', position: 'top'});
        return;
      }
    }
    try {
      Hud.showHud();
      const token = JSON.parse(await AsyncStorage.getItem('userToken'));
      console.log('{token}', token);
      const data = {
        name: name,
        email: email,
        cellphone: mobile,
        message: message,
      };
      const response = await axios({
        method: 'POST',
        url: BASE_URL + 'contact-us',
        data,
        headers: {
          Accept: 'application/json',
          authorization: 'Bearer ' + token.data.data.token,
        },
      });
      console.log(data, response.data);
      Hud.hideHud();
      navigation.goBack();
    } catch (error) {
      Hud.hideHud();
      console.error(error.response);
    }
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View
        style={{
          position: 'relative',
          left: 1,
          // top: 1,
          flexDirection: 'row',
          alignItems: 'center',
          height: calcH(0.1),
          width: calcW(1.5),
          borderColor: '#000',
          elevation: 1,
          paddingLeft: allPadding,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconAntDesign
            color={colors.textHeader}
            size={24}
            name={'arrowleft'}
          />
          <Text style={[styles.subText, {fontWeight: 'bold', fontSize: 18}]}>
            {'   '}
            {pagename}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{backgroundColor: colors.background}}>
        <View style={{flex: 1}}>
          <View style={{padding: allPadding}}>
            <Text style={{fontWeight: 'bold', fontSize: RFValue(22)}}>
              {title}
            </Text>
            {/* <HTMLView
              value={termsCondition}
              renderNode={renderNode}
              //paragraphBreak={}
            /> */}
            {/* <ScrollView style={{flex: 1}}> */}
            <RenderHtml contentWidth={width} source={{html: termsCondition}} />
            {/* </ScrollView> */}
            <Image
              source={{uri: banner_image}}
              style={{width: calcW(0.9), height: calcH(0.5)}}
            />
          </View>
          <View style={styles.lineStyle} />
          <View style={styles.contactContainer}>
            <Text style={styles.conHeader}>Contact us</Text>
            <Text style={styles.consubHeader}>
              Don't hesitate to tell your problems
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View
              style={
                focusName === true ? styles.activeBorder : styles.inActiveBorder
              }>
              <TextInput
                style={styles.textInput}
                placeholder="Name"
                value={name}
                onBlur={() => onBlurTextInputName()}
                onFocus={() => onFocusTextInputName()}
                onChangeText={text => setName(text)}
              />
            </View>

            <View
              style={
                focusEmail === true
                  ? styles.activeBorder
                  : styles.inActiveBorder
              }>
              <TextInput
                style={styles.textInput}
                placeholder="Email"
                value={email}
                onBlur={() => onBlurTextInputEmail()}
                onFocus={() => onFocusTextInputEmail()}
                onChangeText={text => setEmail(text)}
              />
            </View>

            <View
              style={
                focusMobile === true
                  ? styles.activeBorder
                  : styles.inActiveBorder
              }>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                placeholder="Mobile Number"
                placeholderTextColor={'black'}
                value={mobile}
                onBlur={() => onBlurTextInputMobile()}
                onFocus={() => onFocusTextInputMobile()}
                onChangeText={text => setMobile(text.replace(/[^0-9]/g, ''))}
              />
            </View>

            <View
              style={
                focusName === true
                  ? styles.activeMsgBorder
                  : styles.inActiveMsgBorder
              }>
              <TextInput
                style={styles.textMsgInput}
                placeholder="Message"
                placeholderTextColor={'black'}
                value={message}
                multiline={true}
                onBlur={() => onBlurTextInputName()}
                onFocus={() => onFocusTextInputName()}
                onChangeText={text => setMessage(text)}
              />
            </View>

            <TouchableOpacity style={{width: '100%'}} onPress={handleSubmit}>
              <View style={styles.buttonStyle}>
                <Text style={styles.buttonTextStyle}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  a: {
    fontWeight: '300',
    color: '#FF3366', // make links coloured pink
  },
  lineStyle: {
    width: calcW(0.9),
    marginVertical: calcH(0.03),
    borderBottomColor: '#E8E8E8',
    borderBottomWidth: 1,
  },
  contactContainer: {
    justifyContent: 'center',
  },
  conHeader: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 20,
    color: '#3B4045',
  },
  consubHeader: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    color: '#5F616B',
  },
  formContainer: {
    marginVertical: calcH(0.012),
    // width: calcW(0.9),
    // height: calcH(0.68),
    flex: 1,
    padding: allPadding,
    paddingHorizontal: 30,
    //alignItems: 'center',
  },
  inActiveBorder: {
    width: '100%',
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  activeBorder: {
    width: '100%',
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
  },
  inActiveMsgBorder: {
    width: '100%',
    // height: calcH(0.17),
    borderColor: colors.inActiveBorder,
    borderWidth: 1,
    //borderRadius: allRadius,
    marginVertical: 10,
    flexDirection: 'row',
    borderRadius: calcW(0.05),
    alignItems: 'center',
    paddingVertical: 2,
    flex: 1
  },
  activeMsgBorder: {
    width: '100%',
    // height: calcH(0.17),
    borderColor: colors.activeBorder,
    borderWidth: 1,
    borderRadius: calcW(0.05),
    marginVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: allPadding,
    alignItems: 'center',
    paddingVertical: 2,
    flex: 1
  },
  textInput: {
    fontSize: 16,
    color: '#003169',
    fontWeight: '500',
    paddingLeft: 10,
    padding: Platform.OS === 'ios' ? 10 : 0,
  },
  textMsgInput: {
    width: '100%',
    fontSize: 16,
    color: '#003169',
    paddingLeft: calcH(0.034),
    marginTop: calcH(0.02),
    
    // marginBottom: calcH(0.07),
    // marginVertical: 10,
// paddingHorizontal: allPadding,
// alignItems: 'center',
    paddingVertical: 2,
    height: calcH(0.14),
  },
  buttonStyle: {
    width: '100%',
    backgroundColor: colors.buttonColor,
    height: buttonHeight,
    borderRadius: allRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonTextStyle: {
    fontSize: 18,
    color: colors.white,
    textAlign: 'center',
  },
});
