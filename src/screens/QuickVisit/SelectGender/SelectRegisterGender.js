import React from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
  Dimensions,
} from 'react-native';
import { Text, TextInput, Button, Modal, Portal } from 'react-native-paper';
import { Header4, Header6 } from '../../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay';

export const SelectRegisterGender = (props) => {
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getdata();
      // getpatientdata();
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, []);
  React.useEffect(() => {
    getpatientdata();
  }, []);
  const [loading, setLoding] = React.useState(false);
  const [name, setName] = React.useState('');
  const [alldata, setAllData] = React.useState([]);
  const [feet, setFeet] = React.useState('');
  const [birthyear, setBirthYear] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [user_id, setUserid] = React.useState();
  const [showModal, setShowModal] = React.useState(false);
  const [zone, setZone] = React.useState('');
  const [mail, setMail] = React.useState('');
  const Height = Dimensions.get('window').height;
  const handleClose = () => {
    setShowModal(false);
  };

  const getdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    setUserid(user_id);
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    setLoding(true);
    await Apis.patientcategory()

      .then((response) => {
        console.warn(response.data);
        setAllData(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  const getpatientdata = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
    };

    setLoding(true);
    await Apis.profileData(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        if (response.data.response.color_code === '') {
          setShowModal(false);
        } else {
          setShowModal(true);
        }
        setName(response.data.response.name);
        setFeet(response.data.response.height);
        setWeight(response.data.response.weight);
        setBirthYear(response.data.response.date_of_year);
        setGender(response.data.response.gender);
        setMail(response.data.response.email);
        setZone(response.data.response.color_code);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
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
            <Text style={{ color: '#2173A8' }}>{name}</Text> welcome. Chat for
            your appointment.
          </Text>
        </View>

        {/* <View
          style={{
            width: '70%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Please select your <Text style={{ color: '#2173A8' }}>Gender.</Text>
          </Text>
        </View> */}

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
            Your <Text style={{ color: '#2173A8' }}>Gender</Text> is.
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {gender}
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
            Your{' '}
            <Text style={{ color: '#2173A8' }}>BirthYear</Text> is.
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {birthyear}
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
            Your <Text style={{ color: '#2173A8' }}>Height</Text> is
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {feet}
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
            Your <Text style={{ color: '#2173A8' }}>Weight</Text> is.
          </Text>
        </View>
        <View
          style={{
            width: '35%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {weight}
          </Text>
        </View>
        <View
          // key={el.id}
          style={{
            // alignSelf: 'center',
            //  justifyContent: 'center',
            paddingTop: 30,
            marginBottom: 30,
            marginHorizontal: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              //  setIndex([i]);
              //console.log('=====>', index);
              props.navigation.navigate('ProblemList', {
                userid: user_id,
                birthyear: birthyear,
                gender: gender,
                mail: mail,
              });
            }}
            style={styles.unselect}
          >
            <Text style={styles.textunselect}>Next</Text>
          </TouchableOpacity>
        </View>
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
                    mail: mail,
                    userid: user_id,
                    birthyear: birthyear,
                    gender: gender,
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
                    mail: mail,
                    userid: user_id,
                    birthyear: birthyear,
                    gender: gender,
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  unselect: {
    elevation: 5,
    borderRadius: 10,
    backgroundColor: '#146BCE',
    paddingHorizontal: 20,
    paddingTop: 15,
    height: 50,
  },
  textselect: { fontSize: 15, color: '#fff', marginBottom: 10 },
  textunselect: {
    fontSize: 15,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
});
