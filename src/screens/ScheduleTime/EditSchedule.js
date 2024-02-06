import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
import RadioSelector from '../../components/Chip';
export const EditSchedule = (props) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  const chipData = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const data = [
    {
      id: 1,
      img: require('../../Assets/time.png'),
      title: 'Mon - Fri, 09.00AM - 20.00PM',
    },
  ];
  const renderdata = ({ item, index }) => {
    return (
      <View style={styles.view}>
        <Image
          style={{
            color: '#000',
            marginLeft: 20,
            marginTop: 20,
            fontSize: 15,
            position: 'absolute',
          }}
          source={item.img}
        />
        <Text style={{ marginLeft: 50, marginTop: 23, fontSize: 10 }}>
          {item.title}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff' }}>
      <Header title="Edit Scheduling time" navProps={props.navigation} />

      <FlatList
        style={{ marginBottom: 20 }}
        data={data}
        renderItem={renderdata}
        keyExtractor={(item, index) => item.id}
      />
      <Text
        style={{
          color: '#333333',
          marginLeft: 20,
          marginTop: -5,
          fontSize: 15,
          fontWeight: 'bold',
        }}
      >
        Select Day
      </Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.app}>
          {chipData.map((el, i) => (
            <RadioSelector
              key={i}
              title={el}
              value={el}
              onPress={handlePress}
              selected={selectedValue}
            />
          ))}
        </View>
      </ScrollView>
      <ScrollView>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 25,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Time Frame
        </Text>
        <View style={{ marginHorizontal: 30, marginTop: 25 }}>
          <TextInput
            mode="outlined"
            label="Start Time*"
            placeholder="10:00:00 AM"
          />
          <Image
            style={{
              width: 20,
              height: 22,
              resizeMode: 'contain',
              marginTop: -40,
              marginRight: 15,
              alignSelf: 'flex-end',
            }}
            source={require('../../Assets/carbon_time.png')}
          />
        </View>
        <View style={{ marginHorizontal: 30, marginTop: 35 }}>
          <TextInput
            mode="outlined"
            label="End Time*"
            placeholder="15:00:00 PM"
          />
          <Image
            style={{
              width: 20,
              height: 22,
              resizeMode: 'contain',
              marginTop: -40,
              marginRight: 15,
              alignSelf: 'flex-end',
            }}
            source={require('../../Assets/carbon_time.png')}
          />
        </View>
        <View
          style={{
            marginTop: 40,
            width: '80%',
            height: 55,
            // change BorderColor
            borderColor: '#fff',
            alignSelf: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
            borderWidth: 1,
            marginBottom: 40,
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
              Update Now
            </Text>
          </TouchableOpacity>
        </View>
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
    marginTop: 20,
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
