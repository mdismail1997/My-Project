import React from 'react';
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
import { Header4 } from '../../../components/Header/Header';
export const PatientVoicecall = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header4 title="Voice call" navProps={props.navigation} />
      <ScrollView style={{ marginBottom: 20 }}>
        <View style={styles.checkborder}>
          <Image
            style={styles.img}
            source={require('../../../Assets/dejerome.png')}
          />

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
            Luhani Lk.
          </Text>
          <Text style={{ color: '#333333', marginLeft: 100, marginTop: 30 }}>
            30 may, 2022
          </Text>
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: -10,
              color: '#737373',
            }}
          >
            Monday, 09.00AM - 10.00AM
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
              source={require('../../../Assets/voicecall.png')}
            />
          </View>
        </View>

        <Text
          style={{
            color: '#333333',
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          30 minutes of voice call has been recorded
        </Text>

        <View
          style={{
            marginHorizontal: 30,
            marginTop: 30,
            bottom: 10,
            borderRadius: 10,
          }}
        >
          <Button
            icon={require('../../../Assets/playicon.png')}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() => console.log('Pressed')}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Play Recording
          </Button>
        </View>

        <View
          style={{
            marginHorizontal: 30,
            marginTop: 20,
            bottom: 10,
            borderRadius: 10,
          }}
        >
          <Button
            icon={require('../../../Assets/prescription.png')}
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() => props.navigation.navigate('PatientPrescription')}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            View prescription
          </Button>
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
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
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
