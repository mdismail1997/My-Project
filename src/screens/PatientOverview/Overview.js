import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import { Button } from 'react-native-paper';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
export const Overview = (props) => {
  const [checked, setChecked] = React.useState(false);
  const data = [
    {
      id: 1,
      title: 'Medical History',
      description: 'Hypertension',
    },
    {
      id: 2,
      title: 'Allergies ',
      description: ['penicillin', ' sulfa'],
    },
    {
      id: 3,

      title: 'Surgical History',
      description: [
        'Breast biopsy ',
        'Breast biopsy',
        ' Carotid endarterectomy',
      ],
    },

    {
      id: 4,
      title: 'Social History',
      description: ['smoking  ', ' alcohol ', ' Carotid endarterectomy'],
    },
    {
      id: 5,
      title: 'Medication',
      description: ['Prozac(100mg)  ', ' Tylenol(500mg) '],
    },
    {
      id: 6,
      title: 'Lab Result ',
    },
  ];
  const renderdata = ({ item, index }) => {
    return (
      <SafeAreaView>
        <View
          style={{
            width: '100%',
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#2173A8', fontSize: 15, marginLeft: '10%' }}>
              {item.title}
            </Text>
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginRight: '10%' }}
              onPress={() => {
                setChecked({ ...checked, [item.id]: !checked[item.id] });
              }}
            >
              {checked[item.id] ? (
                <Icon name="caretup" size={14} color="#2173A8" />
              ) : (
                <Icon name="caretdown" size={14} color="#2173A8" />
              )}
            </TouchableOpacity>
          </View>
          {checked[item.id] && (
            <View
              style={{
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
                // elevation: 2,
                alignSelf: 'center',
                height: 50,
                marginTop: 10,
                borderRadius: 20,
                width: '65%',
              }}
            >
              <Text
                style={{
                  marginLeft: '3%',
                  padding: 5,
                  fontSize: 13,
                  color: '#769292',
                  fontWeight: '500',
                  fontFamily: 'Rubik',
                  // alignSelf:"center"
                }}
              >
                {item.description}
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 20,
            color: '#2173A8',
            marginTop: 30,
            marginLeft: 20,
          }}
        >
          Patient Overview
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              marginLeft: 20,
              marginTop: 20,
              alignSelf: 'flex-start',
              borderRadius: 55,
              height: 80,
              width: 80,
            }}
          >
            <Image
              source={require('../../Assets/luhina.png')}
              style={{ height: 80, width: 80, borderRadius: 55 }}
            />
          </View>
          <View style={styles.checkborder}>
            <View
              style={{ width: '100%', flexDirection: 'row', marginTop: 10 }}
            >
              <Text style={{ color: '#2173A8', marginLeft: 5, width: '50%' }}>
                {' '}
                luhina Lk,50
              </Text>
              <Text style={{ color: '#000', marginRight: 5, width: '50%' }}>
                {' '}
                DOB:01/03/1999
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-between',
                marginTop: 10,
              }}
            >
              <Text style={{ color: '#2173A8', marginLeft: 5, width: '50%' }}>
                {' '}
                Food Allergy, Insect Allergy
              </Text>
              <Text style={{ color: '#000', marginRight: 5, width: '50%' }}>
                {' '}
                Height:5'5
              </Text>
            </View>
          </View>
        </View>
        <FlatList
          data={data}
          renderItem={renderdata}
          keyExtractor={(item, index) => item.id}
        />
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 50,
              bottom: 20,
              width: '40%',
              borderRadius: 10,
            }}
          >
            <Button
              mode="contained"
              color="#2173A8"
              uppercase={false}
              onPress={() => console.log('Pressed')}
              contentStyle={{ height: 40 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Accept
            </Button>
          </View>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 50,
              borderColor: 'red',
              borderWidth: 1,
              bottom: 20,
              width: '40%',
              borderRadius: 5,
            }}
          >
            <Button
              mode="contained"
              color="#fff"
              uppercase={false}
              onPress={() => console.log('Pressed')}
              contentStyle={{ height: 40 }}
              labelStyle={{ color: 'red', fontSize: 18 }}
            >
              Reject
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    backgroundColor: '#FFFFFF',
    elevation: 5,
    height: 90,
    marginTop: 20,
    borderRadius: 20,
    width: '65%',
    marginLeft: 20,
  },

  img: {
    width: 80,
    height: 90,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    borderRadius: 10,
    position: 'absolute',
  },
  text: {
    marginTop: 10,
    color: '333333',
    fontSize: 20,
    marginRight: 40,
    fontWeight: '600',
    fontFamily: 'Lato',
  },
});
