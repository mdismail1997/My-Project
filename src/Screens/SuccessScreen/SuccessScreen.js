import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  I18nManager
} from 'react-native';
import Header from '../../Component/Header/Header';
import ButtonDark from '../../Component/Common/ButtonDark';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import axios from 'axios';

export default function SuccessScreen(props) {
  const [id, setID] = useState('');
  const [newid, setNewID] = useState('');
  
  useEffect(() => {
    selectedLng()
    // console.warn('props*************', props.route.params.res);
    setID(props.route.params.res)
    confirmOrder(props.route.params.res);
  });

  const selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    // setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }



 const confirmOrder = async(id) => {
  const ADMIN_TOKEN = 'xdd48grne8e5keewy39cncxue0w0nhb4';
// console.log('iddddddddddddd,',id);
  await axios({
    method: 'GET',
    url: `https://traders-platform.com/rest/V1/orders/${id}`,
    headers: {
      authorization: `Bearer ${ADMIN_TOKEN}`,
      'Content-Type': 'application/json',
    },
  })
    // GetRequest(`orders/${id}`, undefined, {}, 'self')
      .then(response => {
        // console.warn('order response******', response.data.increment_id);
        if (response) {
          setNewID(response.data.increment_id);
          
        }
      })
      .catch(error => {
        console.log('Order Error======', error);
      });
  };


  return (
    <ScrollView style={styles.container}>
      <Header
        title={strings.PAY_SUCCESS}
        navigation={props.navigation}
        icon="arrowleft"
      />

      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
        }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, marginTop: 30, color: '#000' }}>
          {strings.PAY_SUCCESS2}
        </Text>
        <Text style={{ fontSize: 15, marginTop: 10, color: '#000' }}>
          {strings.ORDER_NO}{newid}.
        </Text>
        <Text style={{ fontSize: 15, marginVertical: 20, color: '#000' }}>
          {strings.PAY_SUCCESS3}
        </Text>
        <ButtonDark
          handleClick={() => {
            props.navigation.navigate('Home');
          }}
          title={strings.CONTISHOPPING}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 2,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#47474B',
  },
  buttontext: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    color: '#47474B',
    // textAlign: "center"
    marginLeft: 15,
  },
  txtStl: {
    fontFamily: 'Roboto-Regular',
    color: '#4F4F54',
    paddingVertical: 20,
  },
});
