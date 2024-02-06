import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import styles from './style';
import {calcH, calcW, STYLES} from '../../../utils/constants/common';
import Button from '../../components/Button';
import COLORS from '../../../conts/colors';
import Loader from '../../components/Loader';
import strings from '../../components/lng/LocalizedStrings';
import {setLng, getLng} from '../../components/lng/changeLng';

const OTPScreen = ({route, navigation}) => {
  const inputEl = useRef('codeInputRef2');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    selectedLng();
  }, []);

  const selectedLng = async () => {
    const lngData = await getLng();
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      await I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      await I18nManager.forceRTL(true);
    }
    console.log('selected Language data==>>>', lngData);
    setLoading(false);
  };

  const _onFulfill = code => {
    console.log(code);
    setOtp(code);
    console.log(otp);
  };

  const onSubmit = () => {
    const otpValue = otp;
    if (otpValue == 1234) {
      navigation.navigate('LoginScreen');
    }
  };

  const submitResetOtp = () => {
    console.log('submit reset otp work !');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader visible={loading} />
      <View style={[styles.container, {flexDirection: 'column'}]}>
        <View style={styles.headerContainer}>
          <Image
            source={require('../../../assets/headerSplash.png')}
            style={styles.headerImgStyle}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.textHeader}>Enter Your OTP</Text>
          <Text style={styles.subText}>We have sent a OTP on your number</Text>
          <View style={styles.descriptionContainer}>
            <CodeInput
              ref={inputEl}
              activeColor="rgb(60, 60, 60)"
              inactiveColor="rgb(60, 60, 60)"
              keyboardType="number-pad"
              autoFocus={true}
              ignoreCase={true}
              inputPosition="center"
              codeLength={4}
              space={calcW(0.04)}
              size={calcW(0.16)}
              onFulfill={code => _onFulfill(code)}
              containerStyle={{marginTop: calcW(0.07)}}
              codeInputStyle={{borderWidth: calcW(0.003)}}
            />
          </View>
          <View style={styles.otpContainer}>
            <TouchableOpacity onPress={submitResetOtp}>
              <Text style={styles.otpText}> Resend OTP </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomContainer}>
            <Button
              title="SUBMIT"
              bgColor={COLORS.BlackTie}
              onPress={onSubmit}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
          <Image
            source={require('../../../assets/footerSplash.png')}
            style={styles.imgStyle}
            resizeMode="contain"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;
