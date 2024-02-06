import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Alert,
} from 'react-native';
import { Input } from '@rneui/themed';
import ButtonDark from '../../Component/Common/ButtonDark';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loder from '../../Component/Common/Lodar';
import { GetRequest, PostRequest, PutRequest } from '../../Services/ApiFunctions';
import Header from '../../Component/Header/Header';

const { width } = Dimensions.get('window');

export default function SelectPayment({ navigation }) {
  const [allData, setAllData] = useState({});
  const [loder, setLoder] = useState(false);

  return (
    <View style={styles.container}>
      <Header title="Cart" navigation={navigation} icon="menu" />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 30,
        }}>
        {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)' }}> */}
        {/* <View style={{ backgroundColor: '#fff', width: width - 60, borderRadius: 5 }}>
                    <Feather onPress={() => setShowModal(!showModal)} style={{ color: '#676767', fontSize: 30, alignSelf: "flex-end", marginTop: 10, marginRight: 10 }} name={'x'} solid />
                    <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}> */}
        <Text style={[styles.txtStl, { fontSize: 20, fontWeight: 'bold' }]}>
          Select a payment method
        </Text>
        <View style={{}}>
          <Input
            placeholder="Pay with Amazon Pay UPI"
            inputContainerStyle={{ borderWidth: 1, paddingVertical: 6 }}
            containerStyle={{ paddingHorizontal: 0 }}
            inputStyle={{
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              height: 5,
              marginLeft: 10,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            onChangeText={e => {
              setAllData({ houseNo: e });
            }}
            value={allData.houseNo}
          />
          <Input
            placeholder="xxxxxxxxxxxx1256"
            inputContainerStyle={{ borderWidth: 1, marginTop: 5 }}
            containerStyle={{ paddingHorizontal: 0 }}
            inputStyle={{
              fontSize: 14,
              fontFamily: 'Roboto-Regular',
              color: '#47474B',
              height: 5,
              marginLeft: 10,
              textAlign: I18nManager.isRTL ? 'right' : 'left',
            }}
            placeholderTextColor="#47474B"
            onChangeText={e => {
              setAllData({ streetNo: e });
            }}
            value={allData.streetNo}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Input
              placeholder="Expiry Date"
              inputContainerStyle={{ borderWidth: 1, marginTop: -15 }}
              containerStyle={{ paddingHorizontal: 0, width: 145 }}
              inputStyle={{
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
                color: '#47474B',
                height: 5,
                marginLeft: 10,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholderTextColor="#47474B"
              onChangeText={e => {
                setAllData({ city: e });
              }}
              value={allData.city}
            />
            <Input
              placeholder="CVV"
              inputContainerStyle={{ borderWidth: 1, marginTop: -15 }}
              containerStyle={{ paddingHorizontal: 0, width: 145 }}
              inputStyle={{
                fontSize: 14,
                fontFamily: 'Roboto-Regular',
                color: '#47474B',
                height: 5,
                marginLeft: 10,
                textAlign: I18nManager.isRTL ? 'right' : 'left',
              }}
              placeholderTextColor="#47474B"
              onChangeText={e => {
                setAllData({ zipcode: e });
              }}
              value={allData.zipcode}
            />
          </View>
          <ButtonDark handleClick={() => { }} title="Continue" />
        </View>
        <Text
          style={[
            styles.txtStl,
            {
              fontWeight: '600',
              borderBottomWidth: 1,
              borderBottomColor: '#C4C4C4',
            },
          ]}>
          Select card
        </Text>
      </View>
    </View>
    // </View>
    // <TouchableOpacity onPress={() => navigation.navigate('SelectPayment')} style={styles.button}>
    //     <Text style={styles.buttontext}>Delivery to this address</Text>
    // </TouchableOpacity>
    // <TouchableOpacity onPress={() => setShowModal(!showModal)} style={styles.button}>
    //     <Text style={styles.buttontext}>Add new address</Text>
    // </TouchableOpacity>
    // {loder && <Loder />}
    // </View>
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4B4B52',
    paddingVertical: 13,
    width: '100%',
    borderRadius: 2,
    marginTop: 10,
  },
  buttontext: {
    fontSize: 18,
    fontFamily: 'Roboto-Regular',
    color: '#fff',
    textAlign: 'center',
  },
  txtStl: {
    fontFamily: 'Roboto-Regular',
    color: '#4F4F54',
    paddingVertical: 20,
  },
});
