import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Text,
  TextInput,
  Button,
  Searchbar,
  Card,
  Paragraph,
  Snackbar,
  Modal,
  Portal,
  Provider,
  IconButton,
} from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import RadioSelector from '../../components/Chip';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { useIntl } from 'react-intl';
import { Editdatetime } from '../../components/Editdatetime/Editdate';
import { SuccessfullySubmitModal } from '../../components/Popupmessage';
import { RFValue } from 'react-native-responsive-fontsize';
import * as RNLocalize from 'react-native-localize';
export const Slot = (props) => {
  const intl = useIntl();

  const [loading, setLoding] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const [starttime, setStarttime] = useState('');
  const [endtime, setEndtime] = useState('');
  const [scheduletime, setScheduletime] = useState([]);
  const [date, setDate] = useState('');
  const [day, setDay] = useState('');
  const [alldata, setAlldata] = useState([]);
  const [id, setId] = useState([]);
  const [isModalVisible, SetIsModalVisible] = useState();
  const getavailabilitydetails = async () => {
    let usertoken = await AsyncStorage.getItem('authtoken');
    const userid = await AsyncStorage.getItem('userid');
    const user_id = JSON.parse(userid);
    let token = usertoken;
    console.log('user id =====>>>>', user_id);
    console.log('token123=', token);
    const data = {
      user_id: user_id,
      time_zone: RNLocalize.getTimeZone(),
    };

    setLoding(true);
    await Apis.availabilitydate(data)

      .then((response) => {
        console.warn(response.data.response);
        setLoding(false);

        let array = response.data.response;
        const uniqueArray = Object.values(
          array.reduce((acc, obj) => {
            acc[obj.date] = obj;
            return acc;
          }, {}),
        );
        console.log('ubique==', uniqueArray);
        setAlldata(uniqueArray);
        // setId(response.data.response.id);
        // setMedicine(response.data.response[0].medicine);
        // setCourse(response.data.response[0].course);
        // setDoes(response.data.response[0].dose);
        // setBrief(response.data.response[0].brief);
        console.log(alldata);
        // console.log(id);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  useEffect(() => {
    getavailabilitydetails();
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Scheduling time" navProps={props.navigation} />

      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text
            style={{
              color: '#000',
              marginLeft: 20,
              marginTop: 10,
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 15,
            }}
          >
            Slot time
          </Text>
        </View> */}
        {
          alldata?.length < 1 || alldata == null ?
            (
              <Text style={{ color: '#000', textAlign: 'center', marginTop: 20 }}>No Schedule Available</Text>
            ) : (
              alldata.map((el, i) => (
                <Card
                  key={el.id}
                  style={{
                    borderRadius: 15,
                    marginHorizontal: 10,
                    width: '84%',
                    marginTop: 20,
                    alignSelf: 'center',
                    marginBottom: 15,
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderWidth: 1
                  }}
                >
                  <Card.Content>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('Timing', {
                          date: el.date,
                        })
                      }
                    >
                      <Paragraph style={{ fontSize: RFValue(16), color: '#000', textAlign: 'center', }}>
                        {/* {`Schedule ${i + 1}`} ({el.day}) */}
                        {el.date}  {el.day}
                      </Paragraph>
                      {/* <Paragraph style={{ textAlign: 'center', color: '#000', fontSize: RFValue(16) }}>

                  Day: {el.day}
                </Paragraph> */}
                      <Text style={{ textAlign: 'center', marginBottom: 15, color: "#2173A8" }}>Consultation Type: <Text style={{ textAlign: 'center', marginBottom: 10, color: '#000' }}>{el.type.replace(/,/g, ', ')}</Text></Text>
                    </TouchableOpacity>
                  </Card.Content>
                  {console.log('elementid----------------->')}
                </Card>
              )
              ))}

      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  view: {
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',

    alignSelf: 'center',
    elevation: 5,
    height: 60,
    marginTop: 15,
    borderRadius: 15,
    width: '90%',
    marginBottom: 10,
  },
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 500,
    flexDirection: 'row',
    marginTop: 20,
  },
});
