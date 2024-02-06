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

export const CompleteAppoin = (props) => {
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
            width: '50%',
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
            width: '60%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>Proceed with appointment ?</Text>
        </View>
        <View style={{ flexDirection: 'row', width: '100%' }}>
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 50,
              borderColor: '#2173A8',
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
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#2173A8', fontSize: 18 }}
            >
              Remind later
            </Button>
          </View>
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
              onPress={() => props.navigation.navigate('BookAppointment')}
              contentStyle={{ height: 50 }}
              labelStyle={{ color: '#fff', fontSize: 18 }}
            >
              Continue
            </Button>
          </View>
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
