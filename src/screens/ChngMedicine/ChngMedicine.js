import { View, Image, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Button, Searchbar } from 'react-native-paper';
import { Header } from '../../components/Header/Header';
export const ChngMedicine = (props) => {
  const [selected, setSelected] = useState(false);
  const data = [
    {
      id: 1,
      title: 'Diamox - 30 days course',
      description:
        'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ',
    },
  ];
  const showDescription = () => {
    return (
      <View>
        <Text
          style={{
            marginLeft: '3%',
            padding: 5,
            fontSize: 15,
            color: '#737373',
            fontWeight: '500',
            fontFamily: 'Rubik',
          }}
        >
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>
      </View>
    );
  };
  const renderdata = ({ item, index }) => {
    return (
      <View
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#627D7D',
          width: '85%',
          alignSelf: 'center',
          margin: '2%',
          paddingVertical: 3,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => setSelected(!selected)}
        >
          <Text
            style={{
              marginLeft: '5%',
              color: '#032F2F',
              fontSize: 17,
              paddingVertical: 12,
            }}
          >
            {item.title}
          </Text>
          {selected ? (
            <Image
              source={require('../../Assets/drop.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                alignSelf: 'center',
                tintColor: '#032F2F',
                marginRight: '3%',
              }}
            />
          ) : (
            <Image
              source={require('../../Assets/drop2.png')}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                marginRight: '3%',
                alignSelf: 'center',
                tintColor: '#032F2F',
              }}
            />
          )}
        </TouchableOpacity>
        {selected && showDescription()}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Change Medicine " navProps={props.navigation} />
      <FlatList
        data={data}
        renderItem={renderdata}
        keyExtractor={(item) => item.id}
      />
      <View style={{ flexDirection: 'row', marginHorizontal: 30 }}>
        <View
          style={{
            marginTop: 15,
            borderRadius: 35,
            height: 40,
            width: '60%',
            justifyContent: 'space-between',
          }}
        >
          <TextInput mode="outlined" label="Medicine name*" placeholder="" />
        </View>

        <View
          style={{
            marginTop: 15,
            borderRadius: 15,
            height: 40,
            width: '33%',
            justifyContent: 'space-between',
            marginLeft: 20,
          }}
        >
          <TextInput mode="outlined" label="Course*" placeholder="Days" />
        </View>
      </View>
      <View style={{ marginHorizontal: 30, marginTop: 45, height: 50 }}>
        <TextInput
          mode="outlined"
          label="brief *"
          placeholder=""
          multiline={true}
          style={{ marginBottom: 10, height: 80 }}
        />
      </View>
      <View
        style={{
          marginTop: 70,
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
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
