
import {
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  Animated,
  Easing,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './styles';
import CustomButton from '../../components/CustomButton';
import {COLORS} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';
import ReactNativeBiometrics from 'react-native-biometrics';
import {
  getIsBioEnable,
  setIsBioEnable,
  setUserLogin,
} from '../../utils/DataStore';

const BiometricScreen = props => {
  const animated = new Animated.Value(60);
  const [bioStatus, setIsBioStatus] = useState(false);

  useEffect(() => {
    getBioStatus();
  }, []);

  useEffect(() => {
    _startAnim();
  }, [animated]);

  const _startAnim = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animated, {
          toValue: 180,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(animated, {
          toValue: 60,
          duration: 1600,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    ).start();
  };

  const getBioStatus = async () => {
    const status = await getIsBioEnable();

    if (status === null || status === 'false') {
      setIsBioStatus(false);
    } else {
      setIsBioStatus(true);
    }
  };

  //  check if biometric supported or not
  const checkBiometrics = () => {
    ReactNativeBiometrics.isSensorAvailable({allow: true}).then(
      resultObject => {
        const {available, biometryType} = resultObject;

        if (available && biometryType === ReactNativeBiometrics.TouchID) {
          checkKeyExist();
        } else if (available && biometryType === ReactNativeBiometrics.FaceID) {
          checkKeyExist();
        } else if (
          available &&
          biometryType === ReactNativeBiometrics.Biometrics
        ) {
          checkKeyExist();
        } else {
          console.log('Biometrics not supported');
        }
      },
    );
  };

  //  check if public key is exist
  const checkKeyExist = () => {
    ReactNativeBiometrics.biometricKeysExist().then(resultObject => {
      const {keysExist} = resultObject;

      if (keysExist) {
        createSignature();
      } else {
        createKey();
      }
    });
  };

  //  create public key for authentication
  const createKey = () => {
    ReactNativeBiometrics.createKeys('Confirm fingerprint').then(
      resultObject => {
        const {publicKey} = resultObject;
        if (publicKey) {
          createSignature();
        }
      },
    );
  };

  //  create biometric signature
  const createSignature = () => {
    let epochTimeSeconds = Math.round(new Date().getTime() / 1000).toString();
    let payload = epochTimeSeconds + 'uverListApp';

    ReactNativeBiometrics.createSignature({
      promptMessage: "Confirm your device's lock screen fingerprint",
      payload: payload,
    }).then(resultObject => {
      const {success, signature} = resultObject;

        //  Alert.alert(signature)
      
      if (success) {
        if (bioStatus === true) {
          setIsBioEnable('true');
          props.navigation.replace('Home');

          setLogin();
        } else {
          props.navigation.replace('Home');

        }
        
      }
    });
  };

  const setLogin = async () => {
    await setUserLogin('true');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require('../../Assets/logo/logo.png')}
          style={styles.logoImg}
        />
        <View style={styles.bioContainer}>
          <Animated.View
            style={[styles.scanLine, {transform: [{translateY: animated}]}]}
          />
          <Image
            style={styles.bioImg}
            source={
              Platform.OS === 'android'
                ? require('../../Assets/fingerPrint/fingerprint.png')
                : require('../../Assets/Face/face.png')
            }
          />
        </View>
        {Platform.OS === 'android' ? (
          <Text style={styles.enableText}>
            Enable{' '}
            <Text style={{color: COLORS.YELLOW_GREEN}}>
              Biometric Authentication
            </Text>
          </Text>
        ) : (
          <Text style={styles.enableText}>
            Enable{' '}
            <Text style={{color: COLORS.YELLOW_GREEN}}>
              FaceID Authentication
            </Text>
          </Text>
        )}
        <CustomButton
          title={
            !bioStatus
              ? 'Enable'
              : Platform.OS === 'android'
              ? 'Scan your Fingerprint'
              : 'Scan your FaceID'
          }
          buttonStyle={{marginHorizontal: wp(38), marginTop: hp(54)}}
          onPress={() => {
            setIsBioEnable('false');
            checkBiometrics()
            setLogin();
           // props.navigation.navigate('Home');
          }}
        />
        {!bioStatus && (
          <CustomButton
            title="Skip"
            buttonStyle={{
              marginHorizontal: wp(38),
              backgroundColor: COLORS.WHITE,
              borderColor: COLORS.YELLOW_GREEN,
              borderWidth: 1,
              marginTop: hp(12),
              marginBottom: hp(15),
            }}
            titleStyle={{
              color: COLORS.YELLOW_GREEN,
            }}
            onPress={() => {
              setIsBioEnable('false');
              setLogin();
              props.navigation.navigate('Home');
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BiometricScreen;
