import {View, ScrollView, SafeAreaView, Alert} from 'react-native';
import React from 'react';
import {Header} from '../../components/Header/Header';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  HelperText,
  Checkbox,
} from 'react-native-paper';
import FIcon from 'react-native-vector-icons/dist/Fontisto';
import PhoneInput from 'react-native-phone-number-input';
import {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CustomButton from '../../components/CustomButton';
import {
  DateTimePicker,
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import moment from 'moment';
import Loader from '../../components/Loader';
import {bankDetailsSaveAction} from '../../Redux/actions/JobAction';
import { retrieveData } from '../../utils/AsyncStore';
import axios from 'axios';

const BankAdd = props => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('date');
  const [countryCode, setCountryCode] = useState('91');
  const [mobile, setMobile] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [last4, setLast4] = useState('');
  const [modal, setModal] = useState(false);
  const [Loading, setLoading] = useState(false);

 
  const isLoading = useSelector(state => state.Job.isLoading);




  const bankAdd = async () => {
    if (firstName.trim() == '') {
      Alert.alert('Sorry', 'Please enter First Name');
      return;
    }
    if (lastName.trim() == '') {
      Alert.alert('Sorry', 'Please enter Last Name');
      return;
    }
    if (accountNumber.trim() == '') {
      Alert.alert('Sorry', 'Please enter Account Number.');
      return;
    }
    if (routingNumber.trim() == '') {
      Alert.alert('Sorry', 'Please enter Routing Number.');
      return;
    }
    var userToken = await retrieveData('USER_TOKEN')

    setLoading(true)

    let config = {
      method: 'post',
      url: `https://nodeserver.mydevfactory.com:6098/api/bank/update_bank_details`,
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': userToken,
      },
      data: {
        first_name: firstName,
        last_name: lastName,
        routing_number: routingNumber,
        account_number: accountNumber,
      }


    };

    axios(config)
      .then(async (response) => {
        //console.log("............", response.data.message)
         if (response.status == 200) {
          Alert.alert(response.data.message)
          setLoading(false)
          props.navigation.goBack()

         }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.WHITE,
      }}>
      {isLoading && <Loader />}
      <Header title="Bank Details Add" {...props} />
      <ScrollView>
        <View
          style={{
            marginHorizontal: wp(38),
            marginTop: hp(30),
          }}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Account Holder First Name"
            placeholder=""
            onChangeText={text => {
              setFirstName(text);
            }}
            value={firstName}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              color: COLORS.COQUELICOT,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Account Holder Last Name"
            placeholder=""
            onChangeText={text => {
              setLastName(text);
            }}
            value={lastName}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        {/* <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Email"
            placeholder=""
            onChangeText={text => {
              setEmail(text);
            }}
            value={email}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View> */}
        {/* <View style={{marginTop: hp(16), marginLeft: wp(11)}}>
          <PhoneInput
            // useRef={phoneInput}
            defaultValue={mobile}
            defaultCode="IN"
            onChangeCountry={text => {
              setCountryCode(text);
            }}
            //onChangeText={(text) => { setMobile(text);}}
            onChangeText={handleMobile}
            //onChangeFormattedText={(text) => { setMobile(text); }}

            containerStyle={{
              marginTop: 20,
              borderRadius: 5,
              borderWidth: 1,
              height: 58,
              borderColor: '#627D7D',
              marginHorizontal: 30,
              width: wp(297),
            }}
            textInputStyle={{
              height: 40,
              marginLeft: 0,
              backgroundColor: '#fff',
            }}
          />
        </View> */}
        {/* <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Address Line 1"
            placeholder=""
            onChangeText={text => {
             setAddressLine1(text);
            }}
            value={addressLine1}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View> */}
        {/* <View style={{marginHorizontal: wp(38), marginTop: hp(20)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              mode="outlined"
              // placeholder="City"
              label="City"
              style={{
                width: wp(140),
                backgroundColor: COLORS.WHITE,
                marginTop: hp(15),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
              }}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={city}
              onChangeText={text => setCity(text)}
            />
      
            <TextInput
              mode="outlined"
              // placeholder="State"
              label="State"
              style={{
                width: wp(140),
                backgroundColor: COLORS.WHITE,
                marginTop: hp(15),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
              }}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={state}
              onChangeText={text => setState(text)}
            />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              mode="outlined"
              // placeholder="Zipcode"
              label="Zipcode"
              style={{
                width: wp(140),
                backgroundColor: COLORS.WHITE,
                marginTop: hp(15),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
              }}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={zip}
              onChangeText={text => setZip(text)}
            />
            <TextInput
              mode="outlined"
              // placeholder="Country"
              label="Country"
              style={{
                width: wp(140),
                backgroundColor: COLORS.WHITE,
                marginTop: hp(15),
                fontFamily: FONT_FAMILY.LATO_REGULAR,
                color: COLORS.BLACK,
              }}
              outlineColor={COLORS.NICKEL}
              activeOutlineColor={COLORS.NICKEL}
              value={country}
              onChangeText={text => setCountry(text)}
            />
          </View>
        </View> */}
        {/* <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Address Line 2"
            placeholder=""
            onChangeText={text => {
              setAddressLine2(text);
            }}
            value={addressLine2}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View> */}

        <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Account Number"
            placeholder=""
            onChangeText={text => {
              setAccountNumber(text);
            }}
            value={accountNumber}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Routing Number"
            placeholder=""
            onChangeText={text => {
              setRoutingNumber(text);
            }}
            value={routingNumber}
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View>
        {/* <View style={{marginHorizontal: wp(38), marginTop: hp(30)}}>
          <TextInput
            // error={touched.userName === true && errors.userName !== undefined}
            mode="outlined"
            label="Last 4 SSN Number"
            placeholder=""
            onChangeText={text => {
              setLast4(text);
            }}
            value={last4}
            keyboardType="numeric"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              fontFamily: FONT_FAMILY.LATO_REGULAR,
            }}
            activeOutlineColor={COLORS.NICKEL}
            outlineColor={COLORS.NICKEL}
          />
        </View> */}
        <View style={{marginHorizontal: wp(38), marginTop: hp(20)}}>
          {/* <TextInput
            placeholder="Start Date"
            style={{
              backgroundColor: COLORS.WHITE,
              marginTop: hp(15),
              fontFamily: FONT_FAMILY.LATO_REGULAR,
              color: COLORS.BLACK,
            }}
            mode="outlined"
            value={moment(date).format('ddd MMMM DD, YYYY')}
            onPressIn={() => showMode('date')}
            right={
              <TextInput.Icon
                name={() => (
                  <FIcon name={'date'} color={COLORS.NICKEL} size={wp(20)} />
                )}
              />
            }
            outlineColor={COLORS.NICKEL}
            activeOutlineColor={COLORS.NICKEL}
          /> */}
          {/* {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={false}
              onChange={onChange}
              display="spinner"
            />
          )} */}
          <CustomButton
            title={'Submit'}
            buttonStyle={{
              marginTop: hp(35),
              marginHorizontal: wp(1),
              marginBottom: hp(50),
            }}
            onPress={() => bankAdd()}
          />
        </View>
      </ScrollView>
      {/* {modal ? (
        <>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
          // onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          //   setModalVisible(!modalVisible);
          // }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Image
                  source={require('../../Assets/logo1.png')}
                  resizeMode={'contain'}
                />
                <Text style={styles.modalText}>{message}</Text>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                  <CustomButton
                    title="Ok"
                    // onPress={() => (message === "Job Created Successfully!" ? props.navigation.navigate('Home') : clear())}
                    //onPress={() => clear()}
                     onPress ={()=>props.navigation.goBack()}
                    buttonStyle={styles.button}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </>
      ) : null} */}
      {Loading && <Loader />}
    </SafeAreaView>
  );
};

export default BankAdd;
