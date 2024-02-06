import React from 'react';
import { useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Image,
  TouchableOpacity,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay/lib';
import { Avatar, Button, Chip, Text } from 'react-native-paper';
import * as Apis from '../../Services/apis';

export const OtherSymptomList = (props) => {
  const [SymptomsItem, setSymptomsItem] = React.useState();
  const [value, setValue] = React.useState([]);
  const [selectAll, setSelectAll] = React.useState(false);
  const [loading, setLoding] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 10,
      duration: 10000,
    }).start();
  }, [fadeAnim]);
  React.useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoding(true);

        const res = await Apis.symptompart({
          type: 'other associated symptoms',
          pro_id: props.route.params.problemdata,
        });
        setSymptomsItem(res.data.response);
        // setValue(res.data.response);
        // setSelectAll(true);
        setLoding(false);
      } catch (error) {
        console.error(error.response);
        setLoding(false);
      }
    };
    fetchSymptoms();
  }, [
    props.route.params?.data,
    props.route.params.problemdata,
    props.route.params.symptomid,
    props.route.params.symptomid1,
    props.route.params.symptomid2,
    props.route.params.symptomid3,
    props.route.params.symptomid4,
    props.route.params.userid,
    props.route.params.mail,
  ]);

  const handleSubmit = async () => {
    console.log(value + props.route.params.symptomid);
    console.log('ppppp', props.route.params.symptomid4);
    let arr = [];
    arr = [...value, ...props.route.params.symptomid];
    console.log(arr);
    console.log('mail===', props.route.params.mail);
    props.navigation.navigate('AddReport', {
      symptomid: arr,
      symptomid1: props.route.params.symptomid1,
      symptomid2: props.route.params.symptomid2,
      symptomid3: props.route.params.symptomid3,
      symptomid4: props.route.params.symptomid4,
      symptomid5: value,
      problemdata: props.route.params.problemdata,
      userid: props.route.params?.userid,
      mail: props.route.params.mail,
    });
  };

  return (
    <SafeAreaView>
      {loading ? (
        <Spinner
          //visibility of Overlay Loading Spinner
          visible={loading}
          //Text with the Spinner
          textContent={'Loading...'}
          textStyle={{ color: '#fff' }}
        />
      ) : null}

      <ScrollView
        contentContainerStyle={{
          padding: 3,
        }}
      >
        <View
          style={{
            borderRadius: 10,
            borderWidth: 1,
            padding: 10,
            borderColor: '#2173A8',
            width: '95%',
            alignSelf: 'center',
            marginVertical: 10,
            flexDirection: 'row',
            backgroundColor: '#fff',
          }}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
            <Image
              source={require('../../../Assets/back.png')}
              resizeMode="contain"
              style={{ width: 20, height: 20, marginTop: 55, marginRight: 20 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 17,
              textAlign: 'center',
              marginTop: 30,
            }}
          >
            Please select if you{'\n'} have any{' '}
            <Text style={{ color: 'red', fontWeight: 'bold' }}>
              other {'\n'}associated symptoms
            </Text>
          </Text>
          <Animated.View
            style={[
              styles.fadingContainer,
              {
                // Bind opacity to animated value
                opacity: fadeAnim,
              },
            ]}
          >
            <Image
              style={{
                width: 70,
                height: 125,
                marginLeft: 10,
                alignSelf: 'center',
                marginLeft: 30,
              }}
              source={{
                uri: 'https://i.pinimg.com/originals/2c/ea/fb/2ceafb64a5dae55d2a61ef5e12be6e5f.gif',
              }}
            />
          </Animated.View>
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
            {/* {SymptomsItem.length !== 0 && (
              <Chip
                mode="outlined"
                selected={selectAll}
                selectedColor={selectAll ? 'white' : 'blue'}
                style={selectAll ? styles.selectext : styles.unselecttext}
                onPress={() => {
                  if (!selectAll) {
                    setSelectAll(true);
                    setValue(SymptomsItem);
                  } else {
                    setSelectAll(false);
                    setValue([]);
                  }
                }}
              >
                Select all
              </Chip>
            )} */}

            {SymptomsItem.map((el, i) => (
              <Chip
                key={i}
                mode="outlined"
                //  icon={value.includes(el) && 'check'}
                selected={value.includes(el)}
                style={
                  value.includes(el) ? styles.selectext : styles.unselecttext
                }
                selectedColor={value.includes(el) ? 'white' : 'blue'}
                onPress={() => {
                  if (value.includes(el)) {
                    setValue((prevData) => {
                      return prevData.filter((ele) => ele.id !== el.id);
                    });
                  } else {
                    setValue((prevData) => [...prevData, el]);
                  }
                }}
                avatar={
                  <Avatar.Image
                    size={54}
                    source={{ uri: el.img }}
                    style={{
                      marginHorizontal: 10,
                      marginBottom: 30,
                      alignSelf: 'center',
                      alignItems: 'center',
                      resizeMode: 'cover',
                    }}
                  />
                }
              >
                {el.symptoms}
              </Chip>
            ))}
          </View>
        ) : null}

        <Button
          icon="arrow-right-thick"
          mode="contained"
          //  disabled={value.length < 1}
          onPress={handleSubmit}
          style={{ marginHorizontal: 20, marginVertical: 10 }}
          contentStyle={{ flexDirection: 'row-reverse' }}
        >
          Next
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  selectext: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#2173A8',
    height: 60,
    paddingHorizontal: 10,
  },
  unselecttext: {
    marginVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 60,
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
