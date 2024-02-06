import { Input } from '@rneui/themed';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  I18nManager,
  FlatList,
  Dimensions,
} from 'react-native';
import ButtonDark from '../../Component/Common/ButtonDark';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest, PutRequest } from '../../Services/ApiFunctions';
import strings from '../../Component/lng/LocalizedStrings';
import { setLng, getLng } from '../../Component/lng/changeLng';
import { StrictMode } from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default function StoreCreditRefund({ navigation }) {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [data, setData] = useState('');
  const [loder, setLoder] = useState(false);

  const [amount,setAmount] = useState('');
  const [storedata, setStoreViewData] = useState('');
  const submit = () => {
    if (oldPassword == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_OLD_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password == '') {
      Alert.alert(strings.CHANGE_PASSWORD, strings.ENTER_PASS, [
        { text: strings.CANCEL },
        { text: strings.OK },
      ]);
    } else if (password.length < 8) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_ERR,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else if (password !== confirmPassword) {
      Alert.alert(
        strings.CHANGE_PASSWORD,
        strings.PASS_NOT_MATCH,
        [{ text: strings.CANCEL },
        { text: strings.OK },],
      );
    } else {
      resetPassword();
    }
  };

  const profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        // console.log('Profile responce => ', res);
        setData(res);
      })
      .catch(error => {
        console.log('Profile error => ', error);
        if (error.response.data.message == `The consumer isn't authorized to access %resources.`) {
          Alert.alert(strings.SESSION, '', [
            { text: '' },
            {
              text: strings.OK,
              onPress: () => {
                logout2();
              },
            },
          ])
        }
      });
  };

  const logout2 = async () => {
    setLoder(true)
    setTimeout(async () => {
      setLoder(false);

      navigation.navigate('signin');
      await AsyncStorage.removeItem('traderToken');
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }, 2000);

  };

 

  useEffect(() => {
    selectedLng
    // profileData();
    getStoreCredit(),
    getStoreView();
  }, []);

  selectedLng = async () => {
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
    setLoder(false)
    // console.warn("selected Language data==>>>", lngData)
  }



  const getStoreCredit = async () => {
    setLoder(true);
    // const cartid = await AsyncStorage.getItem('cartToken');
    // console.log('Cart ID =====> ', cartid);
    let AccessToken = await AsyncStorage.getItem('traderToken');
    // console.log('Token =====> ', AccessToken);
    
    await axios({
      method: 'GET',
      url: `https://traders-platform.com/rest/V1/customers/me/amstorecredit`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(async res => {
        setLoder(false);
        console.log('Store Creadit amount-----',  res.data);
        setAmount(res.data.store_credit)
        await AsyncStorage.setItem('storeAmount',JSON.stringify(res.data.store_credit.toString()));
      })
      
      .catch(function (error) {
        setLoder(false);
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response of  function ==>',
            error.response.data,
          );
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };


  const getStoreView = async () => {
    setLoder(true);
    // const cartid = await AsyncStorage.getItem('cartToken');
    // console.log('Cart ID =====> ', cartid);
    let AccessToken = await AsyncStorage.getItem('traderToken');
    // console.log('Token =====> ', AccessToken);
    
    await axios({
      method: 'GET',
      url: `https://traders-platform.com/rest/V1/customers/me/amstorecredit/storeview`,
      headers: {
        authorization: `Bearer ${AccessToken}`,
      },
    })
      .then(res => {
        setLoder(false);
        // console.log("gggggggggggggg",res.data)
        // console.log('Store View Response------', JSON.parse(res.data[0].action_data)[0]);
        setStoreViewData(res.data)


        let deduct = ''
        res.data.map((i) => {

        if (i.is_deduct == 1) {
       
          // deduct = i.value
        }
        // console.log("000000000",deduct)
        // setCreditAmount(Math.abs(storeAmount))
    })
      })
      
      .catch(function (error) {
        setLoder(false);
        if (error.response) {
          // Request made and server responded
          console.log(
            'error in response of  function ==>',
            error.response.data,
          );
          // ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        } else if (error.request) {
          // The request was made but no response was received
          console.log('error in request', error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('else error==>', error.message);
        }
      });
  };

  const renderEmptyCart = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 100,
        }}>
        <Image
          source={require('../../Assets/STrolly.png')}
          style={{ height: 100, width: 100 }}
        />
        <Text
          style={{
            fontSize: 18,
            color: '#000',
            fontWeight: 'bold',
            marginTop: 40,
          }}>
         Your meta shopping store amount Empty!
        </Text>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DashBoard');
          }}>
          <View
            style={{
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 5,
              marginVertical: 40,
              paddingVertical: 15,
              paddingHorizontal: 15,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                fontFamily: 'Roboto-Regular',
                fontWeight: 'bold',
              }}>
              No Refund Order Available
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <Header title={strings.CREDIT_REFUND} navigation={navigation} icon="back" />


      {amount == 0 &&  storedata == ''? 
        renderEmptyCart()       
        : 
     <View style={{ paddingHorizontal: 10, flex: 1,marginTop:15 }}>
     <Text style={{fontSize:20,fontFamily:'Roboto-Regular',color:'#000'}}>
     {strings.STORE_CREDIT_BALANCE} : AED{amount}
     </Text>
     <View style={{ marginLeft: 20, marginRight: 20,marginBottom:height*0.06}}>
     <FlatList
       data={storedata}
       inverted={true}
       renderItem={({ item, index }) => {
         // console.warn('itemmm', item.created_at.slice(0, 10));
         const strToDate = new Date(item.created_at.slice(0, 10));
         const newd = strToDate.setDate(strToDate.getDate() + 2);
         const numDate = new Date(newd);
         const formattedDate = numDate.toLocaleDateString("en-US")

         return (
           
             <View
             key={index}
               style={{
                 paddingLeft: 20,
                 paddingRight: 20,
                 padding: 10,
                 backgroundColor: '#fff',
                 justifyContent: 'center',
                 borderRadius: 5,
                 borderColor: '#000',
                 borderWidth: 1,
                 marginTop: 20,
               }}>
               <View
                 style={{
                   flexDirection: 'row',
                   justifyContent: 'space-between',
                 }}>
                 <Text
                   numberOfLines={2}
                   style={{
                     color: '#5A5A5F',
                     fontSize: 14,
                     fontFamily: 'Roboto-bold',
                     fontWeight: 'bold',
                   }}>
                   {strings.ORDER_ID} - {JSON.parse(item.action_data)[0]}
                 </Text>
                 <Text
                   numberOfLines={2}
                   style={{
                     color:item.is_deduct==0?  '#43BC18' : 'red',
                     fontSize: 13,
                     fontFamily: 'Roboto-bold',
                   }}>

                 {item.is_deduct==0? "+":"-"} AED {parseFloat(item.difference).toFixed(2)}
                 </Text>
               </View>
               <Text
                 numberOfLines={2}
                 style={{
                   color: '#5A5A5F',
                   fontSize: 15,
                   fontFamily: 'Roboto-bold',
                   marginTop: 5,
                 }}>
                 {strings.DATE} : {item.created_at.substring(0, 10)}
               </Text>
               {/* <Text numberOfLines={2} style={{ color: "#5A5A5F", fontSize: 12, fontFamily: "Roboto-bold", fontWeight: 'bold', marginTop: 5 }}>Delivery Id -</Text> */}
               <Text
                 numberOfLines={2}
                 style={{
                   color: '#5A5A5F',
                   fontSize: 15,
                   fontFamily: 'Roboto-bold',
                   fontWeight: 'bold',
                   marginTop: 5,
                 }}>
                 {strings.New_Balance} - {parseFloat(item.store_credit_balance).toFixed(2)}
                 
               </Text>
             </View>
         
         );
       }}
       keyExtractor={item => item.id}
       showsHorizontalScrollIndicator={false}
     />
   </View>
     </View>
      }
      
      {loder && <Loder />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
