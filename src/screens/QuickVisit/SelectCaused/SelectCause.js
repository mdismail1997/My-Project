import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Modal,
  Portal,
  IconButton,
  Title,
  Card,
} from 'react-native-paper';
import { color } from 'react-native-reanimated';
import { Header4, Header6 } from '../../../components/Header/Header';
import MultiSelect from '../../../components/React-Native-Multi-Select';
import Symptom from '../../../components/Symptom';
import * as Apis from '../../Services/apis';
export const SelectCause = (props) => {
  useEffect(() => {
    console.log(props.route.params?.subcatid);
    console.log(props.route.params?.userid);
  }, [
    props.route.params?.subcat,
    props.route.params?.slug,
    props.route.params?.subcatid,
    props.route.params?.userid,
  ]);
  const [selectedValue, setSelectedValue] = React.useState('');
  const [isPartsModal, setIsPartsModal] = React.useState(false);
  const [loading, setLoding] = React.useState(false);
  const [selectedItems, setSelectedItems] = useState({});
  const [alldata, setAllData] = React.useState([]);
  const [symptom, setSymptom] = React.useState('');
  const [id, setId] = React.useState();
  const handlePress = (event, value) => {
    setSelectedValue(value), props.navigation.navigate('AddReport');
  };
  const onSelectedItemsChange = (id, _selectedItems) => {
    setSelectedItems((prevData) => ({ ...prevData, [id]: _selectedItems }));
  };
  const chipData = [
    'Drinking alcohol',
    'Eating certain foods',
    'Menstrual cycle',
    'Antacids (relieved by)',
    'Avoiding certain foods',
  ];

  const Subcategory = async () => {
    const data = {
      sub_cat_id: props.route.params?.subcatid,
      user_id: props.route.params?.userid,
    };

    setLoding(true);
    await Apis.symptom(data)

      .then((response) => {
        console.warn(response.data);
        setAllData(response.data.response);
        setSymptom(response.data.response.symptoms);
        setId(response.data.response.id);
        // setSelectedItems((prevData) => ({
        //   ...prevData,
        //   ['alldata']: response.data.response.map((el) => el.id),
        // }));

        console.log(alldata);
        setIsPartsModal(true);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response);
        setLoding(false);
      });
  };
  console.log('=====>', selectedItems['alldata']);
  console.log('=====>', symptom);
  console.log('=====>', id);
  return (
    <SafeAreaView>
      <Header6 title="Chat" navProps={props.navigation} />
      <ScrollView style={{ marginBottom: 90 }}>
        {/* <View
          style={{
            width: '50%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Select your <Text style={{ color: '#2173A8' }}> Birth Year.</Text>
          </Text>
        </View>
        <View
          style={{
            width: '20%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            1992
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
          <Text style={{ padding: 15 }}>
            Please select the body part where you are experiencing pain
          </Text>
        </View>
        <View
          style={{
            width: '30%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            {props.route.params?.slug}
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
          <Text style={{ padding: 15 }}>
            Select the specific part where you are experiencing pain
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
            {props.route.params?.subcat}
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
          <Text style={{ padding: 15 }}>Worsened by</Text>
        </View>
        <Button
          mode="contained"
          color="#2173A8"
          uppercase={false}
          onPress={() => Subcategory()}
          labelStyle={{ color: '#fff', fontSize: 15, marginTop: 15 }}
          style={{ marginHorizontal: 30, marginTop: 20, height: 50 }}
        >
          Select Your Symptom
        </Button>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={isPartsModal}
          onRequestClose={() => {
            console.log('Modal has been closed.');
          }}
          //  style={{ width: 400, backgroundColor: '#fff' }}
        >
          <View
            style={{
              //  alignItems: 'center',
              backgroundColor: '#fff',
              // justifyContent: 'center',
              marginTop: -60,
              padding: 10,
              width: 330,
              alignSelf: 'center',
              elevation: 5,
              borderRadius: 15,
              height: 400,
            }}
          >
            <IconButton
              icon="close"
              size={26}
              color="#fff"
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#2173A8',
                borderRadius: 50,
              }}
              onPress={() => {
                setIsPartsModal(false);
              }}
            />
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  //justifyContent: 'space-around',
                }}
              > */}
              {/* <Button
                      mode="contained"
                      color="#fff"
                      uppercase={false}
                      onPress={() => {
                        props.navigation.navigate(
                          'AddReport',

                          {
                            symptom: el.symptoms,
                            subcat: props.route.params?.subcat,
                            slug: props.route.params?.slug,
                            symptomid: el.id,
                          }
                        );
                      }}
                      labelStyle={{ color: '#2173A8', fontSize: 10 }}
                      style={{
                        // marginHorizontal: 10,
                        marginVertical: 10,
                        width: '100%',
                        borderColor: '#2173A8',
                        borderWidth: 1,
                        alignSelf: 'center',
                      }}
                    >
                      {el.symptoms} */}

              <View>
                <Title style={{ marginVertical: 5 }}>Symptom</Title>
                <Card
                  style={{
                    borderRadius: 15,
                    marginHorizontal: 10,
                    width: '100%',
                  }}
                >
                  <Card.Content>
                    <MultiSelect
                      items={alldata}
                      uniqueKey="id"
                      displayKey="symptoms"
                      // onToggleList={getmedical}
                      // selectedItems={alldata}
                      onSelectedItemsChange={(item) =>
                        onSelectedItemsChange('alldata', item)
                      }
                      //   onSelectedItemsChange={onSelectedItemsChange}
                      selectedItems={selectedItems['alldata']}
                    />
                  </Card.Content>
                </Card>
              </View>
              <Button
                mode="contained"
                color="#fff"
                uppercase={false}
                style={{
                  backgroundColor: '#146BCE',
                  marginHorizontal: 30,
                  marginTop: 20,
                }}
                labelStyle={{ color: '#fff' }}
                onPress={() => {
                  setIsPartsModal(false);
                  props.navigation.navigate('AddReport', {
                    symptom: alldata.symptoms,
                    subcat: props.route.params?.subcat,
                    slug: props.route.params?.slug,
                    symptomid: selectedItems['alldata'],
                    userid: props.route.params?.userid,
                  });
                }}
              >
                Submit
              </Button>
              {/* </View> */}

              {/* <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity style={styles.app}>
                  {chipData.map((el, i) => (
                    <Symptom
                      key={i}
                      title={el}
                      value={el}
                      onPress={handlePress}
                      selected={selectedValue}
                    />
                  ))}
                </TouchableOpacity>
              </View> */}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  app: {
    //marginHorizontal: 15,
    //marginRight: 40,
    width: 120,
    // flexDirection: 'row',
    marginTop: 10,
    marginBottom: 20,
  },
});
