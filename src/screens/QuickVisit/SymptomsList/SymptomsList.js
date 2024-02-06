import { compose } from '@reduxjs/toolkit';
import React from 'react';
import { useRef, useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity,
  Alert, FlatList
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Avatar, Button, Chip, Snackbar, Text } from 'react-native-paper';
import * as Apis from '../../Services/apis';
import { RFValue } from 'react-native-responsive-fontsize';
import Entypo from 'react-native-vector-icons/Entypo';
export const SymptomsList = (props) => {
  let val = [];
  const [SymptomsItem, setSymptomsItem] = React.useState();
  const [value, setValue] = React.useState([]);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loading, setLoding] = React.useState(false);
  const [translation, setTranslation] = React.useState(0);
  const [textvalue, setTextValue] = React.useState([]);
  const [length, setLength] = React.useState();
  const [text, setText] = React.useState('');
  const [symptomid, setSymptomId] = React.useState(0);
  const [orderId, setOrderId] = React.useState(null);
  const [allvalue, setAllValue] = React.useState([]);
  const [backid, setBackid] = React.useState([]);
  const [count, setCount] = React.useState(0);
  const [check, setCheck] = React.useState([]);
  const [image, setImage] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [error, setError] = useState({ iserror: false, message: '' });
  const currentQuestion = textvalue[currentIndex];
  const [select, setUnselect] = React.useState(false);
  const [showerror, setShowerror] = React.useState(false);
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Questions()
      // setUpcoming(true);
      // setCompleted(false);
    });
    return unsubscribe;
  }, [props.route.params?.data[0].id]);
  //console.log('previous Data', props.route.params?.data);
  // React.useEffect(() => {
  //   const Questions = async () => {
  //     try {
  //       setLoding(true);
  //       const id = props.route.params?.data[0].id;
  //       const res = await Apis.quickvisitquestion({
  //         pro_id: props.route.params?.data[0].id,
  //       });
  //       console.log(res);
  //       // setSymptomsItem(res.data.response);
  //       // setValue(res.data.response);
  //       // setSelectAll(true);
  //       setLoding(false);
  //     } catch (error) {
  //       console.error(error.response);
  //       setLoding(false);
  //     }
  //   };
  //   Questions();
  // }, [
  //   props.route.params?.data,
  //   props.route.params?.userid,
  //   props.route.params.mail,
  // ]);

  const Questions = async () => {
    const data = {
      pro_id: props.route.params?.data[0].id,
    };
    console.log('Question====', data);
    setLoding(true);
    await Apis.quickvisitquestion(data)

      .then((response) => {
        console.warn(response.data);
        setOrderId(response.data.response[0].order);
        setTextValue(response.data.response);
        setSymptomId(response.data.response[0].id);
        setLength(response.data.response.length);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  console.log('Symptomid??', symptomid);
  // useEffect(() => {
  //   Questions();
  // }, [props.route.params?.data[0].id]);
  const Symptom = async () => {
    const data = {
      ques_id: symptomid,
      gender: props.route.params.gender,
      problem_id: props.route.params?.data[0].id,
      selected_id: value.toString(),
      select: select,
    };
    console.log('Symptom Data', data);
    setLoding(true);
    await Apis.symptomsList(data)
      .then((response) => {
        console.warn('symptom response', response.data);
        setSymptomsItem(response.data.response);
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const NextRestrict = async () => {
    const data = {
      ques_id: symptomid,
      selected_id: value.toString(),
    };
    console.log('====', data);
    setLoding(true);
    await Apis.nextbuttonrestrict(data)
      .then((response) => {
        console.warn('symptom=======', response.data);
        if (response.data.success === "0") {
          // alert('Please select any symptom') 
          setShowerror(true);
          setError((data) => ({
            ...data,
            iserror: true,
            message: 'Please select symptoms',
          }));
        }
        else { handleSubmit() }
        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const NoneSelect = async () => {
    const data = {
      ques_id: symptomid,
      selected_id: value.toString(),
    };
    console.log('====mmmmmmm', data);
    // setLoding(true);
    await Apis.quickvisitnoneselect(data)

      .then((response) => {
        console.warn('nonedata====', response.data);
        setCheck(response.data.response);

        setLoding(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoding(false);
      });
  };
  const [selectedSymptom, setSelectedSymptom] = useState(null);

  const handleSymptomSelect = (symptom) => {
    setSelectedSymptom(symptom);
  };
  console.log('value=uuuuuuu==>>', value);
  useEffect(() => {
    // const unsubscribe = props.navigation.addListener('focus', () => {
    symptomid == null ? null : Symptom();
    //console.log('gender=============', props.route.params?.birthyear);
    // })
    // return unsubscribe
  }, [symptomid, props.route.params.gender, props.route.params.mail, props.route.params?.birthyear, props.route.params.name,]);

  console.log('symptomlist', SymptomsItem);
  const handleSubmit = async () => {

    setUnselect(false);
    if (currentIndex < textvalue.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSymptomId(textvalue[orderId]?.id);
      setOrderId(orderId + 1);

    }
    else if (currentIndex === textvalue.length - 1) {
      props.navigation.replace('BeforeDiagnosis', {
        symptomid: value,
        gender: props.route.params.gender,
        userid: props.route.params?.userid,
        mail: props.route.params.mail,
        birthyear: props.route.params.birthyear,
        name: props.route.params.name,
      })
    }
    console.log('sympid__orderid==', symptomid, orderId, currentIndex, textvalue[orderId]?.id)

    console.log('value====', value)

  };
  const onDismissSnackBar = () => {
    setError((data) => ({ ...data, iserror: false, message: '' }));
  };
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}

      {/* {error.message}
      </Snackbar> */}
      {image ? (
        <Image
          //visibility of Overlay Loading Spinner
          source={{ uri: 'https://media.baamboozle.com/uploads/images/416530/1641210782_730568_gif-url.gif' }}
        />
      ) : null}
      <ScrollView
        contentContainerStyle={{
          padding: 3,
        }}
      >

        <View
          style={{
            flexDirection: 'row',
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            borderColor: '#2173A8',
            width: '90%',
            alignSelf: 'center',
            alignItems: 'center',
            //backgroundColor:'red',
            marginVertical: 20,
            justifyContent: 'space-between',
          }}
        >
          <TouchableOpacity
            //onPress={() => props.navigation.goBack(null)} 
            onPress={() => {

              setShowerror(false);
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setOrderId(orderId - 1)
                setSymptomId(textvalue[orderId - 2]?.id)
              }
              else if (currentIndex === 0) { props.navigation.goBack(null); }
              console.log('backdata===', symptomid, orderId, currentIndex, textvalue[orderId]?.id)
            }
            }

            style={{ width: '15%', }}>
            <Image
              source={require('../../../Assets/back.png')}
              resizeMode="contain"
              style={{
                width: 30, height: 20,
                //marginTop: 5,
                // marginBottom:10,
                tintColor: '#2173A8',
                //backgroundColor: 'green',
              }}
            />

            {/* <Entypo
              name='arrow-left'
              size={30}
              color={'#000000'}
            /> */}

          </TouchableOpacity>

          <Text
            style={{
              fontSize: RFValue(18),
              // alignSelf: 'center',
              // alignItems: 'center',
              // textAlign: 'center',
              color: '#000',
              marginRight: 10,
              width: '85%',
              //marginTop: 5
              //backgroundColor: 'red'
            }}
          // key={item.id}
          >
            {currentQuestion?.type}
          </Text>

        </View>


        {SymptomsItem ? (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginVertical: 3,
              flex: 1,
            }}
          >

            <FlatList
              data={SymptomsItem}
              numColumns={2}
              keyExtractor={item => item.id}
              renderItem={({ item }) =>
                <View
                  style={{
                    width: '45%',
                    paddingHorizontal: 10,
                    marginVertical: 10,
                    marginLeft: 12,
                  }}
                >
                  <TouchableOpacity
                    key={item.id}
                    style={value.includes(item.id)
                      ?
                      item.condition === true
                        ?
                        // item.con === true 
                        // ?
                        // styles.selectext 
                        // : 
                        styles.unselecttext
                        :
                        styles.unselecttext
                      :
                      styles.selectext
                    }
                    onPress={() => {
                      setShowerror(false);
                      if (value.includes(item.id)) {
                        var temp = value.filter((ele) => ele !== item.id);
                        setValue([...temp])
                        // console.warn("Set Temp value", ...temp)

                      }

                      else {
                        if (item.symptoms == 'None') {
                          console.log("NUN====")

                          let t1 = []

                          SymptomsItem.map(item => {
                            if (item.symptoms != 'None') {
                              t1.push(item.id)
                            }

                          })




                          const filtered = value.filter(el => {
                            return t1.indexOf(el) === -1;
                          });


                          console.log("======ti=====>", filtered)
                          setValue([...filtered, item.id])
                        }
                        else {
                          let r = SymptomsItem.filter(i => i.symptoms == 'None')
                          console.log("rrrrrrrrrrrrrrrr", r)
                          if (r.length != 0) {
                            let t1 = value.filter(item => item != r[0].id)
                            setValue([...t1, item.id])
                          } else {

                            setValue((prevData) => [...prevData, item.id]);
                          }
                        }


                      }
                      // console.log('temp===', item);
                      // console.log('value===>>>', value);

                      handleSymptomSelect(item)
                      //console.log("12345678", item)

                    }}
                  >
                    <Image
                      source={{ uri: item.img }}
                      style={{
                        width: '33%',
                        borderRadius: 70,
                        height: 45,
                        marginHorizontal: 5,
                        borderColor: '#000',
                        borderWidth: 1, marginLeft: 15
                      }}
                    />
                    <Text
                      //numberOfLines={1}
                      style={
                        value.includes(item.id)
                          // ? item.condition === true
                          ? styles.stext
                          // : styles.stext
                          : styles.utext
                      }
                    >

                      {item.symptoms}
                    </Text>
                  </TouchableOpacity></View>}
            />

          </View>
        ) : null}
        <Button
          mode="contained"
          // disabled={value.length < 1}
          onPress={NextRestrict}
          icon="arrow-right-thick"
          contentStyle={{ flexDirection: 'row-reverse' }}
          style={{ marginHorizontal: 20, marginVertical: 10 }}
        >
          Next
        </Button>



      </ScrollView>
      {showerror ? (
        <Snackbar
          visible={error.iserror}
          onDismiss={onDismissSnackBar}
          style={{ backgroundColor: '#d15656', zIndex: 100, marginBottom: 50 }}
        >
          {error.message}
        </Snackbar>
      ) : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  stext: {
    width: '60%',
    marginVertical: 10,
    color: '#fff',
    fontSize: RFValue(13),
    marginHorizontal: 4,
    alignSelf: 'center'
    //textAlign: 'justify',
    // backgroundColor: 'red'
  },
  utext: {
    width: '60%',
    marginVertical: 10,
    color: '#000',
    fontSize: RFValue(13),
    marginHorizontal: 4,
    alignSelf: 'center'
    //textAlign: 'justify',
    //backgroundColor: 'green'
  },
  selectext: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    height: 100,
    alignSelf: 'center'
  },
  unselecttext: {
    flexDirection: 'row',
    backgroundColor: '#2173A8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
    borderWidth: 1,
    height: 100,
    alignSelf: 'center'
  },
  selecall: {
    margin: 2,
    marginHorizontal: 10,
    backgroundColor: '#2173A8',
  },
  unselectall: {
    margin: 2,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
});
