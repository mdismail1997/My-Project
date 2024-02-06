import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
  I18nManager
} from 'react-native';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest, PostRequest } from '../../Services/ApiFunctions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CartItem from '../../Component/CartItem/CartItem';
import axios from 'axios';
import { Input } from '@rneui/themed';
import ButtonDark from '../../Component/Common/ButtonDark';
import email from 'react-native-email';
import { WebView } from 'react-native-webview';
import { ScrollView } from 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';

const { width, height } = Dimensions.get('window');

export default class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loder: false,
      setName: '',
      setEmail: '',
      setNum: '',
      setDisc: '',
    };
  }

  componentDidMount = async () => {
    this.selectedLng()
  };

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
    this.setState({
      loder: false
    })
  }

  contact = () => {
    let phoneRegExp = /^(?:00971|\+971|0)?(?:50|51|52|55|56|58|2|3|4|6|7|9)\d{7}$/;
    let num = this.state.setNum.slice(0, 3)
    // console.warn('nummmmmmm', num)
    if (this.state.setNum.length !== 0 && phoneRegExp.test(num == '971' ? ('00' + this.state.setNum) : this.state.setNum) == false) {
      Alert.alert('', strings.ENTER_10DIGIT_NO, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else {
      this.setState({ loder: true });

      const params = {
        'contactForm[name]': this.state.setName,
        'contactForm[email]': this.state.setEmail,
        'contactForm[telephone]': this.state.setNum,
        'contactForm[comment]': this.state.setDisc,
      };
      PostRequest('contactus?', {}, params, 'admin')
        .then(async res => {
          this.setState({ loder: false });

          Alert.alert('', res.message, [{ text: '' }, { text: '' }]);
          // console.warn('Login responce => ', res.message);

          this.setState({
            setName: '',
            setNum: '',
            setEmail: '',
            setDisc: '',
          });
        })
        .catch(error => {
          this.setState({ loder: false });

          console.log('Login error3 => ', error.response);
        });
    }
  };


  handleEmail = () => {
    const to = ['info@traders-platform.com', '']; // string or array of email addresses
    email(to, {
      // Optional additional arguments
      cc: ['', ''], // string or array of email addresses
      bcc: '', // string or array of email addresses
      subject: '',
      body: '',
    }).catch(e => {
      console.warn(e);
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Header
          title={strings.CONTACT_US}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
        {/* <ScrollView showsVerticalScrollIndicator={false}> */}
        <ScrollView style={{ margin: 20 }}>
          <View style={{ borderRadius: 3, marginTop: 5 }}>
            <Image
              source={require('../../Assets/inner-banmner.jpg')}
              style={{ width: width - 40, height: 100 }}
              resizeMode="cover"
            />
            <View
              style={{
                width: width,
                height: 100,
                position: 'absolute',
                backgroundColor: 'rgba(0,0,0, 0.4)',
                alignSelf: 'center',
              }}></View>
            <Text
              style={{
                marginTop: 45,
                fontWeight: '600',
                color: '#fff',
                fontFamily: 'OpenSans-Regular',
                alignSelf: 'center',
                fontSize: 13,
                position: 'absolute',
              }}>
              {strings.CONTACT_US2}
            </Text>
          </View>
          <Text
            style={{
              marginTop: 15,
              fontWeight: '600',
              color: '#000',
              fontFamily: 'OpenSans-Regular',
              alignSelf: 'center',
              fontSize: 13,
            }}>
            {strings.CONTACT_NOTE}
          </Text>

          <Input
            placeholder={strings.ENTER_NAME}
            inputContainerStyle={{ borderWidth: 0.8 }}
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: 10,
              marginTop: 20,
            }}
            inputStyle={{
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            errorStyle={{ display: 'none' }}
            onChangeText={e => this.setState({ setName: e })}
            value={this.state.setName}
          />
          <Input
            placeholder={strings.ENTER_EMAIL_ID}
            inputContainerStyle={{ borderWidth: 0.8 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 10 }}
            inputStyle={{
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            errorStyle={{ display: 'none' }}
            onChangeText={e => this.setState({ setEmail: e })}
            value={this.state.setEmail}
          />
          <Input
            placeholder={strings.ENTER_PHONE}
            inputContainerStyle={{ borderWidth: 0.8 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 10 }}
            inputStyle={{
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            errorStyle={{ display: 'none' }}
            onChangeText={e => this.setState({ setNum: e })}
            value={this.state.setNum.replace(/\s/g, '')}
          />
          <Input
            placeholder={strings.WHATS_ON_MIND}
            inputContainerStyle={{ borderWidth: 0.8 }}
            containerStyle={{ paddingHorizontal: 0, marginBottom: 10 }}
            inputStyle={{
              marginLeft: 10,
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            errorStyle={{ display: 'none' }}
            onChangeText={e => this.setState({ setDisc: e })}
            value={this.state.setDisc}
          />

          <ButtonDark
            handleClick={() => {
              this.contact();
            }}
            title={strings.SUBMIT}
          />

          <View style={{ backgroundColor: '#000', padding: 15, marginBottom: 8 }}>
            <View
              style={{
                backgroundColor: '#000',
                padding: 15,
                borderWidth: 1,
                borderColor: '#fff',
              }}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                {strings.ABU_DHABI}
              </Text>
              <Text style={{ color: '#fff' }}>{strings.UAE}</Text>
              <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <FontAwesome
                  style={{ alignSelf: 'center' }}
                  name="envelope-o"
                  color={'#fff'}
                  size={15}
                  solid
                />
                <TouchableOpacity
                  onPress={() => {
                    this.handleEmail();
                  }}>
                  <Text style={{ color: '#fff', marginLeft: 10 }}>
                    info@traders-platform.com
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <WebView
            scalesPageToFit={true}
            bounces={false}
            javaScriptEnabled
            style={{ height: 320, width: width * 2, alignSelf: I18nManager.isRTL ? 'flex-end' : 'flex-start', }}
            source={{
              html: `
                  <!DOCTYPE html>
                  <html>
                    <body>
                      <div id="baseDiv">
                      <iframe src="https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1sUAE+abu+dhabi!6i14!3m1!1sen!5m1!1sen"
                      title="iframe Example 1" width="410" height="400">
          </iframe>
                      </div> 
                    </body>
                  </html>
            `,
            }}
            automaticallyAdjustContentInsets={false}
          />
        </ScrollView>

        {/* </ScrollView> */}
        {this.state.loder && <Loder />}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

//22.686366989734733, 88.20934196477688
