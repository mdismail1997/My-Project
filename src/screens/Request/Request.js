import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Text, TextInput, Button } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
export const RequestScreen = (props) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bllodp, setBloodp] = useState('');
  const [bloodsugar, setBloodsugar] = useState('');
  const [allergy, setAllergy] = useState('');
  const [medicine, setMedicine] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [image, SetImage] = useState('');
  const [slotstart, SetSlotstart] = useState('');
  const [end, Setend] = useState('');
  const [problem, SetProblem] = useState('');
  const [bookingid, SetBookingid] = useState('');
  const [fees, SetFees] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [bid, SetBid] = useState('');
  const onChangeSearch = (query) => setSearchQuery(query);
  const [loading, setLoding] = React.useState(false);

  const GetRequest = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    setLoding(true);
    await Apis.bookingdetails(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        console.log(response.data.data);
        setAlldata(response.data.data);
        setName(response.data.data.patient_name);
        setPhone(response.data.data.phone);
        setAge(response.data.data.age);
        setDay(response.data.data.day);
        setEmail(response.data.data.email);
        setGender(response.data.data.sex);
        setHeight(response.data.data.height);
        setWeight(response.data.data.weight);
        setBloodp(response.data.data.blood_gr);
        setBloodsugar(response.data.data.blood_suger_level);
        setAllergy(response.data.data.allergy);
        setMedicine(response.data.data.medication);
        setType(response.data.data.consultation_type);
        SetImage(response.data.data.profile_image);
        setDate(response.data.data.date);
        SetSlotstart(response.data.data.slot_start);
        Setend(response.data.data.slot_end);
        SetProblem(response.data.data.problem);
        SetBookingid(response.data.data.booking_id);
        SetFees(response.data.data.fee);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    GetRequest();
  }, [props.route.params?.bookingid]);
  const Accepted = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };

    setLoding(true);
    await Apis.accepted(data)

      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        props.navigation.navigate('Request');
        setAlldata(response.data.data);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };

  const Rejected = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      booking_id: props.route.params?.bookingid,
    };
    console.log('idd---', data);
    SetBid(data);
    setLoding(true);
    await Apis.rejected(data)
      .then((response) => {
        console.warn(response.data);
        setLoding(false);
        props.navigation.navigate('Request');
        setAlldata(response.data.data);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={name} navProps={props.navigation} />
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}
      <ScrollView>
        <View style={styles.checkborder}>
          <Image style={styles.img} source={{ uri: image }} />

          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: 5,
              position: 'absolute',
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            {name}
          </Text>
          <Text style={{ color: '#333333', marginLeft: 100, marginTop: 30 }}>
            {date}
          </Text>
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: -10,
            }}
          >
            {day}, {slotstart}-{end}
          </Text>
          <View>
            <Image
              style={{
                width: 40,
                height: 42,
                resizeMode: 'contain',
                alignSelf: 'flex-end',
                marginTop: -67,
                marginRight: 20,
              }}
              source={require('../../Assets/chatbox.png')}
            />
          </View>
        </View>

        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Problems facing
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
          }}
        >
          {problem}
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Visit Time
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {date}
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          {day}, {slotstart}-{end}
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Patient Information
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Name
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Age
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {age}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Phone No.
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {phone}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Email Id
          </Text>

          <Text style={{ marginTop: 15 }}>:</Text>

          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
              textAlign: 'justify',
            }}
          >
            {email}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Gender
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {gender}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Height
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {height}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Weight
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {weight}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Blood pressure
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {bllodp}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Blood sugar
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {bloodsugar}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Allergy
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {allergy}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Medicine
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {medicine}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Type
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {type}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#333333',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
              width: '35%',
            }}
          >
            Fees
          </Text>
          <Text style={{ marginTop: 15 }}>:</Text>
          <Text
            style={{
              color: '#737373',
              marginTop: 15,
              fontSize: 13,
              fontWeight: 'bold',
              width: '55%',
              marginLeft: 20,
            }}
          >
            {fees}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 30,
              borderColor: 'red',
              borderWidth: 1,
              bottom: 10,
              width: '35%',
              borderRadius: 5,
              height: 47,
            }}
          >
            <Button
              mode="contained"
              color="#fff"
              uppercase={false}
              onPress={() => Rejected(bookingid)}
              contentStyle={{ height: 44 }}
              labelStyle={{ color: 'red', fontSize: 18, borderRadius: 10 }}
              style={{ bordercolor: 'red' }}
            >
              Reject
            </Button>
          </View>
          <View
            style={{
              marginHorizontal: 30,
              marginTop: 30,
              bottom: 10,
              width: '35%',
              borderRadius: 5,
              height: 57,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={() => Accepted(bookingid)}
              contentStyle={{ height: 44 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Accept
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    shadowOffset: {
      width: 20,
      height: 20,
    },
    shadowOpacity: -3,
    shadowRadius: 2.35,
    alignSelf: 'center',
    elevation: 15,
    height: 90,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
  },

  img: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
    marginLeft: 20,
    marginTop: 10,
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
