import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, ScrollView, StyleSheet, Image} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import {Header} from '../../components/Header/Header';
import CustomButton from '../../components/CustomButton';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {COLORS} from '../../utils/Const';
import {useDispatch, useSelector} from 'react-redux';
import {userChangePasswordAction} from '../../Redux/actions/AuthAction';
import Loader from '../../components/Loader';
import {getUserToken} from '../../utils/DataStore';

export const ChangePassword = props => {
  const element = <TextInput.Icon icon="lock" />;
  //const element = <Image source={require('../../Assets/lockshow.png')} />
  const dispatch = useDispatch();

  // State variables
  const [OldPassword, setOldPassword] = useState('');
  const [NewPassword, setNewPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [checked, setChecked] = useState(false);

  const Auth = useSelector(state => state.Auth);
  const isLoading = useSelector(state => state.Auth.isLoading);

  useEffect(() => {
    if (Auth.changePasswordSuccess == true) {
      props.navigation.navigate('Home');
      // setLogin();
    } else {
      setErrorMessage(Auth.errorMessage);
    }
    return () => {
      setErrorMessage('MyAccount');
    };
  }, [Auth]);

  const validateData = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const fullPasswordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (OldPassword === '' && NewPassword === '') {
      setErrorMessage('Please insert all required fields');
    } else if (OldPassword === '') {
      setErrorMessage('Please insert OldPassword');
    } else if (NewPassword === '') {
      setErrorMessage('Please enter NewPassword');
    } else if (ConfirmPassword === '') {
      setErrorMessage('Please enter ConfirmPassword');
    }
    // else if (fullPasswordRegex.test(password) === false) {
    //   setErrorMessage(
    //     'Password must be between 8 to 32 characters and contain one uppercase, lowercase, special character and number',
    //   );
    // }
    else {
      // setErrorMessage('');
      onPressChangePassword('');
    }
  };

  const onPressChangePassword = async () => {
    const data = {
      current_password: OldPassword,
      new_password: NewPassword,
      confirm_password: ConfirmPassword,
      token: await getUserToken(),
    };
    dispatch(userChangePasswordAction(data));
  };
  const setData = () => {
    // props.navigation.navigate('MyAccount');
    onPressChangePassword();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.WHITE}}>
      {isLoading && <Loader />}
      <Header
        title="Change Password "
        // navProps={props.navigation}
        {...props}
      />
      <ScrollView style={{marginHorizontal: wp(38)}}>
        <View style={{alignItems: 'center', marginTop: hp(85)}}>
          <Image
            source={require('../../Assets/Loge.png')}
            style={styles.imagefingerCSS}
          />
        </View>
        <View style={{marginTop: hp(36)}}>
          <TextInput
            mode="outlined"
            label="Old Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setOldPassword(text);
            }}
            value={OldPassword}
            secureTextEntry
            right={element}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
            style={styles.textInputCSS}
          />
          <HelperText type="error">{errorMessage}</HelperText>
        </View>
        <View style={{marginTop: hp(20)}}>
          <TextInput
            mode="outlined"
            label="New Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setNewPassword(text);
            }}
            value={NewPassword}
            secureTextEntry
            right={element}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
            style={styles.textInputCSS}
          />
          <HelperText type="error">{errorMessage}</HelperText>
        </View>
        <View style={{marginTop: hp(20)}}>
          <TextInput
            mode="outlined"
            label="Confirm Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setConfirmPassword(text);
            }}
            value={ConfirmPassword}
            secureTextEntry
            right={element}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
            style={styles.textInputCSS}
          />
          <HelperText type="error">{errorMessage}</HelperText>
        </View>
        <CustomButton
          onPress={() => setData()}
          title="Update"
          buttonStyle={{marginTop: hp(20), marginHorizontal: wp(0)}}
          // disable={!checked}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  imagefingerCSS: {
    width: wp(100),
    height: hp(100),
    resizeMode: 'contain',
  },
  textInputCSS: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
  },
});
