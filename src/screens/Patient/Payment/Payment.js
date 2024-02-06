import React, { useEffect } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler
} from 'react-native';
import { Text, TextInput, Button, FAB } from 'react-native-paper';
import { Header } from '../../../components/Header/Header';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RFValue } from 'react-native-responsive-fontsize';

export const PaymentSuccess = (props) => {

  const handleBackPress = () => {
    // Prevent the back press event
    return true;
  };

  useEffect(() => {
    // Add event listener for back press
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    // Clean up the event listener when the component is unmounted
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* <Header title="Account details" navProps={props.navigation} /> */}
      <ScrollView>
        <View
          style={{
            width: '35%',
            height: 120,
            borderRadius: 70,
            backgroundColor: '#2173A8',
            alignSelf: 'center',
            marginTop: '40%',
            flexWrap: 'wrap',
          }}
        >
          <MaterialCommunityIcons
            name="card-account-details-star-outline"
            size={50}
            color={'#fff'}
            style={{ marginTop: 30, marginLeft: 40 }}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            color: '#2173A8',
            marginTop: 20,
            fontSize: RFValue(30),
          }}
        >
          Thank You!
        </Text>
        <Text
          style={{
            textAlign: 'center',
            color: '#000',
            marginTop: 10,
            fontSize: RFValue(15),
          }}
        >
          Payment done Successfully
        </Text>
        {props.route.params?.app_type != 'Q' ?
          <Text
            style={{
              textAlign: 'center',
              color: '#333',
              marginHorizontal: 20,
              marginTop: 30,
            }}
          >
            You will be redirect to the booking page shortly or click here to home
            page
          </Text>
          : <Text
            style={{
              textAlign: 'center',
              color: '#333',
              marginHorizontal: 20,
              marginTop: 30,
            }}
          >
            You will be redirect to the booking page shortly
          </Text>}
        {props.route.params?.app_type != 'Q' ?
          <FAB
            //icon={require('../../../Assets/quickvisit.png')}
            style={styles.fab}
            label="Home"
            onPress={() => props.navigation.navigate('PatientTabNavigator')}
            uppercase={false}
          />
          : null}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    borderColor: '#2173A8',
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 45,
    borderRadius: 10,
    height: 55,
    width: '85%',
    backgroundColor: '#FFFFFF',
    shadowColor: '#2173A8',
    alignSelf: 'center',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    // position: 'absolute',
    //  margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#146BCE',
    tintColor: '#fff',
    width: '50%',
    alignSelf: 'center',
    marginTop: 50,
  },
  img: {
    width: 35,
    height: 47,
    resizeMode: 'contain',
  },
  text: {
    color: '#2173A8',
    fontSize: 15,

    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
