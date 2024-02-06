import React, {Component, useEffect, useState} from 'react';
import * as Yup from 'yup';
import AuthContainer from '../../Component/AuthContainer';
import {
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SafeView from '../../Component/SafeView';
import {Checkbox, HStack, Icon, Input, VStack} from 'native-base';
import {calcH, calcW} from '../../utils/Common';
import AppFormField from '../../Component/Form/AppFormField';
import {AppForm} from '../../Component/Form';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AppButton from '../../Component/AppButton';
import {Font} from '../../utils/font';
import Hud from '../../utils/hud';
import {useDispatch, useSelector} from 'react-redux';
import {Formik} from 'formik';
import routes from '../../Navigation/routes';
import SubmitButton from '../../Component/Form/SubmitButton';
import {clearMessage} from '../../reduxToolkit/slices/message';
import { signupData } from '../../reduxToolkit/ApiFetch/signupSlice';
import { colorSet, mainColor } from '../../utils/Color';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required().label('first_name'),
  last_name: Yup.string().required().label('last_name'),
  email: Yup.string().required().email().lowercase().label('email'),
  password: Yup.string().required().label('password'),
  confirm_password: Yup.string().required().label('confirm_password'),
});

const initialValues = {
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirm_password: '',
};

const SignUp = props => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.User);
  // const {message} = useSelector(state => state.message);

  // useEffect(() => {
  //   dispatch(clearMessage());
  // }, [dispatch]);

  const handleSubmit = async ({
    email,
    password,
    first_name,
    last_name,
    confirm_password,
  }) => {
    if (password !== confirm_password) {
      toasterr.showToast('Password and confirm password should be same');
      return false;
    }

    const data = {
      username: `${first_name}${last_name}`,
      email: email,
      password: password,
      firstname: first_name,
      lastname: last_name,
    };
    console.log('data', data);
    setLoading(true);
   await dispatch(signupData(data))
      .then(res => {
        console.log("success", res);
        setLoading(false)
        if(res.payload.message == "User registered successfully"){
          props.navigation.navigate(routes.SignIn);
        }else{
          console.log("routing is not done");
        }
        // 
        // window.location.reload();
      })
     
  };

  return (
    <SafeView>
      <VStack>
        <AuthContainer
          title={'Create Account'}
          subtitle={'Enter Your Registered Mobile Number and Password'}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                isRequired
                label="First Name"
                placeholder="first name"
                name="first_name"
                // value={values.first_name}
                // onChangeText={handleChange('first_name')}
              />
              <AppFormField
                isRequired
                label="Last Name"
                placeholder="last name"
                name="last_name"
                // value={values.last_name}
                // onChangeText={handleChange('last_name')}
              />
              <AppFormField
                isRequired
                label="Email Address"
                placeholder="info@gmail.com"
                name="email"
                keyboardType="email-address"
                // value={values.email}
                // onChangeText={handleChange('email')}
              />
              <AppFormField
                isRequired
                label="Password"
                placeholder="*****"
                name="password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleChange('password')}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={show ? 'eye-outline' : 'eye-off-outline'}
                          color={'#0000'}
                        />
                      }
                      size={5}
                    />
                  </Pressable>
                }
              />
              <AppFormField
                isRequired
                label="Confirm Password"
                placeholder="*****"
                name="confirm_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.confirm_password}
                // onChangeText={handleChange('confirm_password')}
                InputRightElement={
                  <Pressable onPress={() => setShow(!show)}>
                    <Icon
                      as={
                        <MaterialCommunityIcons
                          name={show ? 'eye-outline' : 'eye-off-outline'}
                          color={'#0000'}
                        />
                      }
                      size={5}
                    />
                  </Pressable>
                }
              />

              <Checkbox value="one" my={1} _text={{fontFamily: Font.Bold, color: mainColor}} >
                I agree to Terms and Condition and the Privacy Policy
              </Checkbox>

              <SubmitButton title={'SIGN UP'} loading={loading} />
            </AppForm>
            <Text style={[styles.text, {textAlign: 'center'}]}>OR</Text>

            <HStack justifyContent={'center'}>
              <Text style={styles.text}>Have An Account?</Text>
              <TouchableOpacity
                onPress={() => props.navigation.navigate(routes.SignIn)}>
                <Text style={[styles.text, {color: mainColor}]}>Login</Text>
              </TouchableOpacity>
            </HStack>
          </View>
          {/* {message && <>{toastr.showToast(message)}</>} */}
        </AuthContainer>
      </VStack>
    </SafeView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: colorSet.primarycolor,
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    elevation: 5,
    shadowColor: '#064681',
    padding: 25,
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
    marginTop: calcH(0.02),
  },
  text: {
    fontFamily: Font.Bold,
    color: '#fff',
  },
});
