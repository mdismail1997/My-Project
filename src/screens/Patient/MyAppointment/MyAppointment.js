import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { Header } from '../../../components/Header/Header';

const MyAppointment = (props) => {
  const HEIGHT = Dimensions.get('screen').height;
  const WIDTH = Dimensions.get('screen').width;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
        style={{ backgroundColor: 'white', height: HEIGHT, width: WIDTH }}
      >
        <Header title="My Appointment" navProps={props.navigation} />
        <View style={styles.uncheckborder}>
          <TouchableOpacity>
            <Image
              style={{
                width: 80,
                height: 90,
                resizeMode: 'contain',
                alignSelf: 'flex-start',
                borderRadius: 10,
                position: 'absolute',
              }}
              source={require('../../../Assets/drstive.png')}
            />

            <Text
              style={{
                color: '#333333',
                marginLeft: 90,
                marginTop: 10,
                position: 'absolute',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Dr. Stive Simth
            </Text>
            <Text
              style={{
                color: '#333333',
                marginLeft: 92,
                marginTop: 33,
                fontSize: 10,
                position: 'absolute',
              }}
            >
              Messaging
            </Text>
            <Text
              style={{
                color: '#2173A8',
                marginLeft: 150,
                marginTop: 33,
                fontSize: 10,
              }}
            >
              - Schedule
            </Text>
            <Text
              style={{
                marginLeft: 90,
                marginTop: 10,
                color: '#737373',
                fontSize: 10,
              }}
            >
              11:00AM - 11:30AM
            </Text>
            <View>
              <Image
                style={{
                  width: 40,
                  height: 42,
                  resizeMode: 'contain',
                  alignSelf: 'flex-end',
                  marginTop: -47,
                  marginRight: 20,
                }}
                source={require('../../../Assets/chatbox.png')}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: 20,
            width: '95%',
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}
        >
          <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              marginLeft: '5%',
              borderRadius: 25,
            }}
          >
            <Image
              source={require('../../../Assets/user.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              5553+
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Patients
            </Text>
          </View>

          <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderRadius: 25,
              borderWidth: 1,
            }}
          >
            <Image
              source={require('../../../Assets/user2.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              3 Years
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Experience
            </Text>
          </View>

          <View
            style={{
              borderColor: '#2173A8',
              height: 130,
              width: '28%',
              borderWidth: 1,
              borderRadius: 25,
            }}
          >
            <Image
              source={require('../../../Assets/chaticon.png')}
              style={{
                height: 40,
                width: 40,
                alignSelf: 'center',
                marginTop: 15,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={{
                fontSize: 16,
                color: '#2173A8',
                alignSelf: 'center',
                marginTop: 10,
                fontWeight: 'bold',
              }}
            >
              120+
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: 'black',
                alignSelf: 'center',
                marginTop: 5,
              }}
            >
              Reviews
            </Text>
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
          31 May, 2002
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 5,
            fontSize: 15,
          }}
        >
          Monday, 09.00AM - 20.00PM
        </Text>
        <View style={styles.verticleLine}></View>
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
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Name
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}Luhani Lk.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Age
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}29+
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Phone No.
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}+91 8675585698
            </Text>
          </View>
        </View>
        <View style={styles.verticleLine}></View>
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
        <View style={{ width: '35%', marginLeft: 20 }}>
          <Text
            style={{
              color: '#2173A8',
              marginTop: 12,
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            $5(Paid)
          </Text>
        </View>
        <View
          style={{
            marginTop: 40,
            width: '80%',
            height: 55,
            // change BorderColor
            borderColor: '#fff',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 40,
            backgroundColor: '#2173A8',
          }}
          activeOpacity={0.7}
        >
          <TouchableOpacity onPress={console.log('Submit Pressed')}>
            <Text
              style={{
                textAlign: 'center',
                lineHeight: 53,
                color: '#FFFFFF',
                fontWeight: '700',
                fontSize: 18,
                fontFamily: 'Rubik',
                letterSpacing: 0.4,
              }}
            >
              Message Now (Start at 11:00AM)
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyAppointment;
const styles = StyleSheet.create({
  verticleLine: {
    height: 2,
    width: '90%',
    backgroundColor: '#909090',
    marginLeft: 10,
    marginTop: 10,
    opacity: 0.2,
  },
  uncheckborder: {
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
});
