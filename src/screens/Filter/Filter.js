import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import Slider from '@react-native-community/slider';
import DateTimePicker from '@react-native-community/datetimepicker';
export const Filter = (props) => {
  const [location, setLocation] = useState('');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title="Filter" navProps={props.navigation} />
      <ScrollView
        style={{}}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: 20 }}>
            <TextInput
              label="Location"
              value={location}
              onChangeText={(text) => setLocation(text)}
              mode="outlined"
              //change placeholder
              placeholder="xxxxxxx"
              // change color code
              selectionColor="black"
              outlineColor="black"
              activeOutlineColor="black"
              style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
              keyboardType="number-pad"
            />

            <Image
              source={require('../../Assets/location.png')}
              style={{
                height: 30,
                width: 30,
                position: 'absolute',
                right: '10%',
                alignSelf: 'center',
              }}
            />
          </View>
          <View>
            <Text style={{ marginLeft: 25, fontSize: 16, color: '#000' }}>
              Distance
            </Text>
            <Slider
              style={{
                width: 350,
                height: 50,
                flexDirection: 'row',
                marginLeft: 20,
              }}
              minimumValue={0}
              maximumValue={100}
              thumbTintColor="#2173A8"
              minimumTrackTintColor="#2173A8"
              maximumTrackTintColor="#000"
            />
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                color: '#000',
                marginTop: -15,
              }}
            >
              15miles
            </Text>
          </View>

          <TextInput
            label="Problem "
            // value={about}
            // onChangeText={text => setAbout(text)}
            mode="outlined"
            //change placeholder
            placeholder="Dental Problem"
            // change color code
            selectionColor="black"
            outlineColor="black"
            activeOutlineColor="black"
            style={{ marginHorizontal: '8%', marginBottom: 10 }}
          />
          <TextInput
            label="symptoms"
            // value={about}
            // onChangeText={text => setAbout(text)}
            mode="outlined"
            //change placeholder
            placeholder="Oral Surgery, Endodontics, Periodontics, Tee"
            // change color code
            selectionColor="black"
            outlineColor="black"
            activeOutlineColor="black"
            style={{ marginHorizontal: '8%', marginBottom: 10 }}
          />

          <Text style={{ marginLeft: 25, fontSize: 16, color: '#000' }}>
            Time Frame
          </Text>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
            <TextInput
              label="From date"
              // value={about}
              // onChangeText={text => setAbout(text)}
              mode="outlined"
              //change placeholder
              placeholder="19th May,2022"
              // change color code
              selectionColor="black"
              outlineColor="black"
              activeOutlineColor="black"
              style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
            />
            <Image
              source={require('../../Assets/date.png')}
              style={{
                height: 30,
                width: 30,
                position: 'absolute',
                right: '10%',
                alignSelf: 'center',
              }}
            />
          </View>
          <View style={{ flexDirection: 'row', width: '100%', marginTop: 10 }}>
            <TextInput
              label="To  date"
              // value={about}
              // onChangeText={text => setAbout(text)}
              mode="outlined"
              //change placeholder
              placeholder="19th May,2022"
              // change color code
              selectionColor="black"
              outlineColor="black"
              activeOutlineColor="black"
              style={{ marginHorizontal: '8%', marginBottom: 10, width: '84%' }}
            />

            <Image
              source={require('../../Assets/date.png')}
              style={{
                height: 30,
                width: 30,
                position: 'absolute',
                right: '10%',
                alignSelf: 'center',
              }}
            />
          </View>
          <View
            style={{
              marginTop: 30,
              width: '80%',
              height: 55,
              // change BorderColor
              borderColor: '#fff',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              borderWidth: 1,
              marginBottom: 50,
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
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  datePickerStyle: {
    width: 230,
  },
  text: {
    textAlign: 'left',
    width: 230,
    fontSize: 16,
    color: '#000',
  },
});
