import React, {Component, useEffect, useState} from 'react';
import * as Yup from 'yup';
import AuthContainer from '../../Component/AuthContainer';
import {
  Alert,
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
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import {assetsImages} from '../../utils/assets';
import {useDispatch, useSelector} from 'react-redux';
import {Login} from '../../reduxToolkit/CounterSlice';
import {Formik} from 'formik';
import routes from '../../Navigation/routes';
import Hud from '../../utils/hud';
import SubmitButton from '../../Component/Form/SubmitButton';
import {clearMessage} from '../../reduxToolkit/slices/message';
import {toasterr, toastr} from '../../utils/commonToast';
import {colorSet, mainColor} from '../../utils/Color';
import {loginData} from '../../reduxToolkit/ApiFetch/loginSlice';
import HeaderComponent from '../../Component/Header';
import {tabBarIcon} from '../../Component/ScreenComponenet/BottomTabItem';
import {changePasswordData} from '../../reduxToolkit/ApiFetch/changePasswordSlice';

const validationSchema = Yup.object().shape({
  old_password: Yup.string().required().label('Type Old Password'),
  new_password: Yup.string().required().label('Type New Password'),
  reType_password: Yup.string().required().label('Retype New Password'),
});

const initialValues = {
  old_password: '',
  new_password: '',
  reType_password: '',
};

const ChangePassword = props => {
  const [show, setShow] = useState(false);
  const [loading, setloading] = useState(false);
  const dispatch = useDispatch();

  const {isLoggedIn} = useSelector(state => state.User);

  const handleSubmit = async ({
    old_password,
    new_password,
    reType_password,
  }) => {
    if (new_password != reType_password) {
      toasterr.showToast('new password and retype password should be same');
      return;
    }
    const data = {
      old_password: old_password,
      new_password: new_password,
    };
    console.log('data', data);
    setloading(true);
    dispatch(changePasswordData(data)).then(res => {
      console.log('login data', res);
      setloading(false);
      //         if(res.payload.message == "Login successful"){
      // props.navigation.navigate(routes.Drawertab);
      //         }else{
      //           console.log("routing is not done");
      //         }
    });
  };

  return (
    <SafeView>
      <VStack>
        <AuthContainer
          header={true}
          headerName={'Change Password'}
          // arrow={tabBarIcon('arrow-left')}
          onPress={() => props.navigation.toggleDrawer()}
          searchPress={() => props.navigation.navigate(routes.SearchItem)}>
          <View style={styles.inputContainer}>
            <AppForm
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              <AppFormField
                label="Type Old Password"
                placeholder="*****"
                name="old_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
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
                label="Type New Password"
                placeholder="*****"
                name="new_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
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
                label="Retype New Password"
                placeholder="*****"
                name="reType_password"
                icon="lock"
                autoCapitalize="none"
                // value={values.password}
                // onChangeText={handleSubmit('password')}
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
              <View style={styles.secondContainer}>
                <Text style={styles.text}>
                  *Password should be at least 8 characters long.{' '}
                </Text>
              </View>
              <SubmitButton title={'Submit'} loading={loading} />
            </AppForm>
          </View>
        </AuthContainer>
      </VStack>
    </SafeView>
  );
};

export default ChangePassword;

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
    // marginTop: calcH(0.1)
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
