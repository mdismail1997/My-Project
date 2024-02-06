import React, { useEffect, useRef } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Pressable,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Portal, Modal } from 'react-native-paper';
import { Header4, Header6 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';
import Symptom from '../../../components/Symptom';
export const SelectGender = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();

      // getquickdata()
      // getpatientdata();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.navigation, props.route.params.message, props.route.params.userid]);
  // React.useEffect(() => {

  //   console.log(props.route.params?.userid);
  // }, [props.route.params?.message, props.route.params?.userid]);
  const [loading, setLoding] = React.useState(false);
  const [category, setCategory] = React.useState('');
  const [categoryid, setCategoryId] = React.useState('');
  const [alldata, setAllData] = React.useState([]);
  const [index, setIndex] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [birthyear, setBirthYear] = React.useState('');
  const [zone, setZone] = React.useState('');
  const Height = Dimensions.get('window').height;
  const chipData = ['Male', 'Female', 'Prefer not to say'];
  const handleClose = () => {
    setShowModal(false);
  };
  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    setLoding(true);
    await Apis.patientcategory()

      .then((response) => {
        console.warn(response.data);
        setAllData(response.data.response.cat);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const getquickdata = async () => {
    const data = {
      email: props.route.params?.message,
    };
    setLoding(true);
    await Apis.showquickvisitdata(data)
      .then((response) => {
        console.warn(response.data);
        console.log('lll', response.data);
        if (response.data.message === 'Here Quick Visit user data') {
          setShowModal(true);
        } else {
          setShowModal(false);
        }
        //setIndex(8);
        setSelectedValue(response.data.response.gender.toString());
        setBirthYear(response.data.response.year);
        setZone(response.data.response.color_code);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log(selectedValue);

  // console.log(weight);
  useEffect(() => {
    getquickdata();
  }, []);

  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', bottom: 0 }}>
      <Header4 title="Quick Visit" navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView
        style={{ marginBottom: 20, backgroundColor: '#fff', bottom: 0 }}
      >
        <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            Hello {''}
            <Text style={{ color: '#2173A8' }}>
              {props.route.params?.message}
            </Text>{' '}
            welcome. Chat for your appointment. Select from following
          </Text>
        </View>

        <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15, color: '#000' }}>
            Please select your <Text style={{ color: '#2173A8' }}>Gender.</Text>
          </Text>
        </View>
        {/* <Button onPress={fadeIn} >ssss</Button> */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            bottom: 0,
          }}
        >
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.app}
            // onPress={() => props.navigation.navigate('Chatting')}
            >
              {chipData.map((el, i) => (
                <Symptom
                  key={i}
                  title={el}
                  value={el}
                  onPress={handlePress}
                  selected={selectedValue}
                />
              ))}
            </TouchableOpacity>
          </ScrollView>
          {/* {alldata.map((el, i) => (
            <View
              key={el.id}
              style={{
                alignSelf: 'flex-end',
                justifyContent: 'center',
                paddingTop: 30,
                marginBottom: 30,
                marginRight: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // setIndex(i),
                  console.log('=====>', index);
                  setCategoryId(el.id), setCategory(el.cat);
                }}
                style={index === i ? styles.select : styles.unselect}
              >
                <Text
                  style={index === i ? styles.textselect : styles.textunselect}
                >
                  {el.cat}
                </Text>
              </TouchableOpacity>
            </View>
          ))} */}
        </View>
        <TouchableOpacity
          style={{
            width: '80%',
            backgroundColor: '#2173A8',
            height: 40,
            alignSelf: 'center',
            marginTop: 30,
            marginBottom: 10,
          }}
          onPress={() => {
            console.log(chipData.length);
            selectedValue
              ? props.navigation.navigate('AddHeight', {
                categoryid: categoryid,
                category: selectedValue,
                userid: props.route.params?.userid,
                mail: props.route.params?.message,
              })
              : alert('Please select an option to continue');
          }}
        >
          <Text style={{ textAlign: 'center', marginTop: 10, color: '#fff' }}>
            Next
          </Text>
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.fadingContainer,
            {
              // Bind opacity to animated value
              opacity: fadeAnim,
            },
          ]}
        >
          {/* <Text style={{ padding: 15 }}>
            Helo {''}
            <Text style={{ color: '#2173A8' }}>
              {props.route.params?.message}
            </Text>{' '}
            Welcome .
          </Text> */}
          <Image
            style={{
              width: 200,
              height: 250,
              alignSelf: 'flex-end',
              marginRight: 30,
            }}
            source={{
              uri: 'https://i.gifer.com/origin/e8/e85e517141772e97fec5fa4fceb81f39.gif',
            }}
          />
        </Animated.View>
      </ScrollView>
      <Modal visible={showModal}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={{
            backgroundColor: '#fff',
            height: '65%',
            width: '90%',
            alignSelf: 'center',
            marginTop: 25,
            borderRadius: 10,
          }}
        >
          <Image
            source={require('../../../Assets/doctorappicon2.png')}
            style={{
              width: 60,
              height: 60,
              borderRadius: 20,
              alignSelf: 'center',
            }}
          />
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 5,
              alignSelf: 'center',
              color: '#000',
              // marginTop: -10,
              //height: '35%',
            }}
          >
            Your Previous HealthStatus was{' '}
            <Text
              style={{
                color: zone.toLowerCase(),
                paddingHorizontal: 40,

                fontSize: 17,
                //  backgroundColor: '#1b85e0',
                fontWeight: 'bold',
              }}
            >
              {''}
              {zone}
              {''}
            </Text>{' '}
            zone
          </Text>
          <Text
            style={{
              paddingVertical: 10,
              paddingHorizontal: 5,
              alignSelf: 'center',
              color: '#000',
              fontSize: 15,
              fontWeight: 'bold',
              //height: '35%',
            }}
          >
            How Are You Feelings Now? 🤔🤔
          </Text>

          <View
            style={{
              //flex: 1,
              // backgroundColor: '#000',
              borderRadius: 20,
              marginBottom: 20,
              marginTop: 22,
              // width: 80,
              justifyContent: 'space-around',
              alignSelf: 'center',
              //marginRight: 30,
              flexDirection: 'row',
              marginHorizontal: 20,
              // height: '25%',
              // width: '100%',
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={handleClose}
              labelStyle={{ color: '#fff', fontSize: 15 }}
            >
              Good
            </Button>
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => {
                setShowModal(false),
                  props.navigation.navigate('ProblemList', {
                    userid: props.route.params?.userid,
                    mail: props.route.params?.message,
                    birthyear: birthyear,
                    gender: selectedValue,
                  });
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
              style={{ marginLeft: 20 }}
            >
              Better
            </Button>
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              // onPress={async () => {
              //   const _prescription = await GeneratePrescription();
              //   console.log('pres=====', _prescription);
              //   Linking.openURL(_prescription);
              // }}
              //contentStyle={{ height: 0 }}
              onPress={() => {
                setShowModal(false),
                  props.navigation.navigate('ProblemList', {
                    userid: props.route.params?.userid,
                    mail: props.route.params?.message,
                    birthyear: birthyear,
                    gender: selectedValue,
                  });
              }}
              labelStyle={{ color: '#fff', fontSize: 15 }}
              style={{ marginLeft: 20 }}
            >
              Bad
            </Button>
          </View>
        </ScrollView>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  select: {
    elevation: 15,
    borderRadius: 10,
    backgroundColor: '#146BCE',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  unselect: {
    elevation: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  textselect: { fontSize: 15, color: '#fff', marginBottom: 10 },
  textunselect: { fontSize: 15, color: '#2173A8', marginBottom: 10 },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 770,
    width: 480,
    flexDirection: 'row',
    marginTop: 10,
  },
});
