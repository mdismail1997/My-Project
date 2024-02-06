import {Formik} from 'formik';
import React, {useContext} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  HelperText,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import CustomButton from '../../components/CustomButton';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ProfileContext} from '../../Services/ProfileProvider';

export const Step = props => {
  const {isLogin1} = useContext(ProfileContext);
  //console.log('===+++++==>', isLogin1);
  const Height = Dimensions.get('screen').height;

  const DATA = [
    {
      id: 1,
      desc: 'Register and create your account',
    },
    {
      id: 2,
      desc: 'Verify email and log in to your account',
    },
    {
      id: 3,
      desc: 'Search for job/ post a job',
    },
    {
      id: 4,
      desc: 'Apply for job/ choose employee',
    },
    {
      id: 5,
      desc: 'Make payment once Job is complete/ get paid',
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        style={{
          // height: Height,
          flex: 1,
          width: '100%',
          resizeMode: 'stretch',
          // backgroundColor: 'transparent',
          opacity: 0.9,
        }}
        source={require('../../Assets/background.png')}>
        <LinearGradient
          start={{x: 1, y: 1}}
          end={{x: 0, y: 0}}
          style={{
            // alignItems: 'center',
            justifyContent: 'flex-end',
            // flex: 1,
            height: Height,
          }}
          colors={['#177200', '#E2FFB4']}>
          <View
            style={{
              // flexDirection: 'column-reverse',
              flex: 0.65,
              justifyContent: 'center',
              marginHorizontal: 42,
              alignItems: 'center',
              // backgroundColor: 'red',
            }}>
            <Text style={styles.titleText}>Follow the steps</Text>
            <View>
              {DATA.map((e, i) => {
                return (
                  <View
                    key={i}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 40,
                    }}>
                    <MIcon name="check-all" size={20} color={COLORS.WHITE} />
                    <Text style={styles.descText}>{e.desc}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <CustomButton
            title="Continue"
            buttonStyle={{
              marginBottom: hp(83),
              marginHorizontal: wp(42),
              backgroundColor: COLORS.WHITE,
            }}
            titleStyle={{
              color: COLORS.YELLOW_GREEN,
            }}
            onPress={() => props.navigation.navigate('LogIn')}
          />
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  titleText: {
    fontSize: wp(36),
    fontFamily: FONT_FAMILY.LATO_REGULAR,
    color: COLORS.WHITE,
    textAlign: 'center',
  },
  descText: {
    fontSize: wp(14),
    fontFamily: FONT_FAMILY.LATO_BOLD,
    color: COLORS.WHITE,
    marginLeft: wp(24),
  },
  modalview: {
    backgroundColor: '#fff',
    height: 350,
    width: '70%',
    alignSelf: 'center',
    justifyContent: 'center',
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
  },
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 15,
  },
  fpass: {
    color: '#2173A8',
    fontSize: 15,
    marginTop: 30,
    textAlign: 'right',
    marginRight: 30,
  },
  headtext: {
    color: '#333333',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 30,
  },
});
