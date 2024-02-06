import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Modal, IconButton } from 'react-native-paper';
import { useWindowDimensions, View } from 'react-native';
import { useState } from 'react-native';
export const ModalView = ({ isModal, onClose }) => {
  const { height, width } = useWindowDimensions();
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
    console.log('id---', data);
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
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  return (
    <Modal
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 50,
        position: 'absolute',
      }}
      onDismiss={onClose}
      visible={isModal}
      // animationIn="zoomIn"
      // animationOut="zoomOut"
    >
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
    </Modal>
  );
};
