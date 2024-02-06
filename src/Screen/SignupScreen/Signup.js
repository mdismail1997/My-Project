import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, TouchableOpacity, Image, ScrollView, Pressable, StyleSheet, } from 'react-native';
import { Text, TextInput, Button, Modal, Portal, HelperText, Checkbox, } from 'react-native-paper';
import { ZodIssueCode } from 'zod';
import { Header } from '../../components/Header/Header';
import { User } from '../../models/userAuth';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { styles } from './styles';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomButton from '../../components/CustomButton';
import { userSignupAction } from '../../Redux/actions/AuthAction';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../components/Loader';

export const SignupScreen = props => {
  // State variables
  const [visible, setVisible] = useState(false);
  const [checked, setChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const setData = () => {
    props.navigation.navigate('LogIn');
    setVisible(false);
  };

  const dispatch = useDispatch();

  const Auth = useSelector(state => state.Auth);
  const isLoading = useSelector(state => state.Auth.isLoading);

  useEffect(() => {
    setErrorMessage('');
    if (Auth.signUpSuccess) {
      props.navigation.navigate('OtpVerifyScreen');
    } else {
      setErrorMessage(Auth.signUpError);
    }
  }, [Auth.signUpSuccess, Auth.signUpError]);

  // TODO: validation
  const validateData = () => {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const fullPasswordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/;
    if (
      username === '' &&
      email === '' &&
      password === '' &&
      confirmPassword === ''
    ) {
      setErrorMessage('Please insert all required fields');
    } else if (username === '') {
      setErrorMessage('Please insert username');
    } else if (email === '') {
      setErrorMessage('Please insert email');
    } else if (emailRegex.test(email) === false) {
      setErrorMessage('Please enter valid email address');
    } else if (password === '') {
      setErrorMessage('Please enter password');
    } else if (fullPasswordRegex.test(password) === false) {
      setErrorMessage(
        'Password must be between 8 to 32 characters and contain one uppercase, lowercase, special character and number',
      );
    } else if (confirmPassword === '') {
      setErrorMessage('Please enter confirm password');
    } else if (password !== confirmPassword) {
      setErrorMessage('Password does not match');
    } else {
      setErrorMessage('');
      onSignup();
    }
  };

  // TODO: call signup API
  const onSignup = () => {
    const data = {
      username: username,
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    };
    dispatch(userSignupAction(data));
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && <Loader />}
      <Header title="Sign Up" {...props} />
      <ScrollView>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.subHeading}>
          It is a long established fact that a reader will be distracted by the
          readable.
        </Text>

        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Email"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setUsername(text);
            }}
            value={username}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              color: COLORS.COQUELICOT,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
          {/* <HelperText
            type="error"
            visible={
              touched.userName === true && errors.userName !== undefined
            }>
            {errors.userName}
          </HelperText> */}
        </View>
        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="First Name"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setFirstName(text);
            }}
            value={firstname}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
          {/* <HelperText
            type="error"
            visible={
              touched.userName === true && errors.userName !== undefined
            }>
            {errors.userName}
          </HelperText> */}
        </View>
        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Last Name"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setLastName(text);
            }}
            value={lastname}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
          {/* <HelperText
            type="error"
            visible={
              touched.userName === true && errors.userName !== undefined
            }>
            {errors.userName}
          </HelperText> */}
        </View>

        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.email === true && errors.email !== undefined}
            mode="outlined"
            label="Email Id"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setEmail(text);
            }}
            value={email}
            style={{ backgroundColor: '#fff', borderRadius: 10 }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        {/* <HelperText
          type="error"
          visible={touched.email === true && errors.email !== undefined}>
          {errors.email}
        </HelperText> */}
        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.password === true && errors.password !== undefined}
            mode="outlined"
            label="Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setPassword(text);
            }}
            secureTextEntry
            value={password}
            style={{ backgroundColor: '#fff', borderRadius: 10 }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        {/* <HelperText
          type="error"
          visible={touched.password === true && errors.password !== undefined}>
          {errors.password}
        </HelperText> */}
        <View style={{ marginHorizontal: wp(38), marginTop: hp(30) }}>
          <TextInput
            // error={touched.cPassword === true && errors.cPassword !== undefined}
            mode="outlined"
            label="Confrim Password"
            placeholder=""
            onChangeText={text => {
              setErrorMessage('');
              setConfirmPassword(text);
            }}
            secureTextEntry
            value={confirmPassword}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        {errorMessage != '' && (
          <HelperText
            style={{
              marginHorizontal: wp(38),
              marginTop: 10,
              fontSize: 14,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            type="error">
            {errorMessage}
          </HelperText>
        )}
        <View style={styles.termsContainer}>
          <MIcon
            name={checked ? 'checkbox-outline' : 'checkbox-blank-outline'}
            size={wp(15)}
            color={COLORS.BLACK}
            style={{ marginRight: wp(10) }}
            onPress={() => setChecked(!checked)}
          />
          <Text style={styles.termsText}>
            I agree to{' '}
            <Text style={{ color: COLORS.YELLOW_GREEN }}>the privacy policy</Text>{' '}
            and <Text style={{ color: COLORS.YELLOW_GREEN }}>terms of use</Text>
          </Text>
        </View>
        <CustomButton
          title="Sign Up"
          buttonStyle={{
            marginTop: hp(24),
            marginHorizontal: wp(38),
            backgroundColor: !checked ? COLORS.NICKEL : COLORS.YELLOW_GREEN,
          }}
          disable={!checked}
          onPress={() => {
            validateData();
          }}
        />

        <View style={styles.singupContainer}>
          <Text style={styles.singupText}>
            {'Already Have an Account?'}
            <Text
              onPress={() => props.navigation.navigate('LogIn')}
              style={[styles.singupText, { color: COLORS.YELLOW_GREEN }]}>
              {' Sign In'}
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles1 = StyleSheet.create({
  view: {
    flexDirection: 'row',
    margin: 15,
    marginTop: 20,
    justifyContent: 'center',
    alignSelf: 'center',
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
