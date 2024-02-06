import React from 'react';
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
import { Text, TextInput, Button, Modal, Portal } from 'react-native-paper';
import { Header4 } from '../../../components/Header/Header';
export const PatientPrescription = (props) => {
  const data = [
    {
      id: 1,
      img: require('../../../Assets/chngmedicine.png'),
      title: 'Diamox - ',
      description: ' 30 days course',
    },
    {
      id: 2,
      img: require('../../../Assets/chngmedicine.png'),
      title: 'Ilube -  ',
      description: '07 days course',
    },
    {
      id: 3,
      img: require('../../../Assets/chngmedicine.png'),
      title: 'Otrivine-Antistin  ',
      description: '- 07 days course',
    },
  ];
  const renderdata = ({ item, index }) => {
    return (
      <View style={styles.view}>
        <View style={{ flexDirection: 'row', alignItem: 'center' }}>
          <Text
            style={{
              color: '#000',
              marginLeft: 20,
              fontSize: 15,
              alignSelf: 'center',
            }}
          >
            {item.title}
          </Text>
          <Text style={{ color: '#737373', fontSize: 10, alignSelf: 'center' }}>
            {item.description}
          </Text>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <Image
            style={{
              width: 20,
              height: 22,
              resizeMode: 'contain',
              alignSelf: 'center',
              right: 10,
            }}
            source={item.img}
          />
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header4 title="Prescription" navProps={props.navigation} />
      <ScrollView style={{ marginBottom: 20, backgroundColor: '#fff' }}>
        <View style={styles.checkborder}>
          <Image
            style={styles.img}
            source={require('../../../Assets/luhina.png')}
          />

          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: 5,
              position: 'absolute',
              fontSize: 15,
              fontWeight: 'bold',
            }}
          >
            Luhani Lk.
          </Text>
          <Text style={{ color: '#333333', marginLeft: 100, marginTop: 30 }}>
            30 may, 2022
          </Text>
          <Text
            style={{
              color: '#333333',
              marginLeft: 100,
              marginTop: -10,
              color: '#737373',
            }}
          >
            Monday, 09.00AM - 10.00AM
          </Text>
        </View>

        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Problems facing
        </Text>
        <Text
          style={{
            color: '#737373',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
          }}
        >
          It is a long established fact that a reader will be distracted by the
          readable content of a page when looking at its layout.
        </Text>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Patient Information
        </Text>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Name
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}Luhani Lk.
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View style={{ width: '35%', marginLeft: 20 }}>
            <Text
              style={{
                color: '#333333',
                marginTop: 12,
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Age
            </Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text
              style={{
                color: '#737373',
                marginTop: 15,
                fontSize: 13,
                fontWeight: 'bold',
              }}
            >
              :{'         '}29+
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Request change of Medicine List
        </Text>
        <View
          style={{
            width: '90%',
            flexDirection: 'row',
            elevation: 10,
            borderRadius: 10,
            borderWidth: 0.5,
            height: 50,
            alignSelf: 'center',
            borderColor: '#fff',
            backgroundColor: '#fff',
            marginTop: 15,
          }}
        >
          <View style={{ justifyContent: 'center', marginLeft: 10 }}>
            <Text style={{ alignSelf: 'center' }}>Prescription</Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              marginLeft: 10,
              width: '120%',
              flexDirection: 'row',
            }}
          >
            <TouchableOpacity style={{ alignSelf: 'center' }}>
              <Image
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                source={require('../../../Assets/download.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 10 }}>
              <Image
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                source={require('../../../Assets/eye.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignSelf: 'center', marginLeft: 10 }}>
              <Image
                style={{ width: 20, height: 20, resizeMode: 'contain' }}
                source={require('../../../Assets/share.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text
          style={{
            color: '#333333',
            marginLeft: 20,
            marginTop: 15,
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          Medicine List
        </Text>

        <FlatList
          data={data}
          renderItem={renderdata}
          keyExtractor={(item, index) => item.id}
        />
        <View
          style={{
            marginHorizontal: 30,
            marginTop: 10,
            borderRadius: 10,
            marginBottom: 20,
          }}
        >
          <Button
            mode="contained"
            color="#2173A8"
            uppercase={false}
            onPress={() => props.navigation.navigate('PatientChngMed')}
            contentStyle={{ height: 50 }}
            labelStyle={{ color: '#fff', fontSize: 18 }}
          >
            Request change of Medicine
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  checkborder: {
    justifyContent: 'space-between',
    backgroundColor: '#fff',

    alignSelf: 'center',
    height: 90,
    marginTop: 20,
    width: '90%',
  },
  view: {
    alignItem: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    elevation: 5,
    height: 50,
    marginTop: 20,
    borderRadius: 10,
    width: '90%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  modaltext: {
    marginTop: 25,
    color: '#333333',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 15,
  },
});
