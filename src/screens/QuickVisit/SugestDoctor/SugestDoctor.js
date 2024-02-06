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
import { Header4, Header6 } from '../../../components/Header/Header';

export const SuggestDoctor = (props) => {
  const chipData = [
    'Drinking alcohol',
    'Eating certain foods',
    'Menstrual cycle',
    'Antacids (relieved by)',
    'Avoiding certain foods',
  ];
  return (
    <SafeAreaView>
      <Header6 title="Chat" navProps={props.navigation} />
      <ScrollView style={{ marginBottom: 80 }}>
        <View
          style={{
            width: '40%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            Eating certain foods
          </Text>
        </View>
        <View
          style={{
            width: '45%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            blood pressure - 92.2%
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginRight: 20,
          }}
        >
          <Image
            source={require('../../../Assets/xray.png')}
            style={{
              resizeMode: 'contain',
              marginTop: 20,
              marginLeft: 5,
              borderRadius: 5,
            }}
          />
          <Image
            source={require('../../../Assets/xray.png')}
            style={{
              resizeMode: 'contain',
              marginTop: 20,
              marginLeft: 5,
              borderRadius: 5,
            }}
          />
          <Image
            source={require('../../../Assets/xray.png')}
            style={{
              resizeMode: 'contain',
              marginTop: 20,
              marginLeft: 5,
              borderRadius: 5,
            }}
          />
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
          <Text style={{ padding: 15 }}>How are you feeling now?</Text>
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
            Heavy pain
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
            Gastroenteritis, Gas, Irritable bowel syndrome, Acid reflux,
            Vomiting, Gastritis, Food intolerances
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
            You may have Appendicitis. Your health status is{' '}
            <Text style={{ color: 'red' }}>Red </Text>zone. You can consultant
            available doctor
          </Text>
        </View>
        <View
          style={{
            width: '70%',
            backgroundColor: '#fff',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
            elevation: 5,
            height: 70,
          }}
        >
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Image
              source={require('../../../Assets/qdoctor.png')}
              style={{ alignSelf: 'flex-start', marginLeft: 10, marginTop: 5 }}
            />
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 5,
                marginLeft: 10,
              }}
            >
              Dr. Sumit Sen
            </Text>

            <Image
              source={require('../../../Assets/view.png')}
              style={{ alignSelf: 'flex-end', marginLeft: '40%' }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              marginLeft: '17%',
              color: 'grey',
              marginTop: -10,
            }}
          >
            9:00 am - 12:00pm
          </Text>
        </View>
        <View
          style={{
            width: '70%',
            backgroundColor: '#fff',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
            elevation: 5,
            height: 70,
          }}
        >
          <View style={{ flexDirection: 'row', marginTop: 10 }}>
            <Image
              source={require('../../../Assets/qdoctor.png')}
              style={{ alignSelf: 'flex-start', marginLeft: 10, marginTop: 5 }}
            />
            <Text
              style={{
                color: '#000',
                fontWeight: 'bold',
                fontSize: 15,
                marginTop: 5,
                marginLeft: 10,
              }}
            >
              Dr. Sumit Sen
            </Text>

            <Image
              source={require('../../../Assets/view.png')}
              style={{ alignSelf: 'flex-end', marginLeft: '40%' }}
            />
          </View>
          <Text
            style={{
              fontSize: 12,
              marginLeft: '17%',
              color: 'grey',
              marginTop: -10,
            }}
          >
            9:00 am - 11:30pm
          </Text>
        </View>
        <View
          style={{
            justifyContent: 'center',
            paddingTop: 10,
            marginBottom: 20,
            marginRight: 20,
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate('ProceedAppoin')}
            style={{
              elevation: 5,
              borderRadius: 10,
              backgroundColor: '#fff',
              paddingHorizontal: 10,
              paddingTop: 10,
              alignSelf: 'center',
              width: '30%',
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: '#2173A8',
                marginBottom: 10,
                textAlign: 'center',
              }}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  app: {
    marginHorizontal: 15,
    marginRight: 40,
    maxWidth: 770,
    flexDirection: 'row',
    marginTop: 20,
  },
});
