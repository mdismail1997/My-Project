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
import Symptom from '../../../components/Symptom';
export const FellingNow = (props) => {
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
      <ScrollView>
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
            marginTop: 40,
            bottom: 10,
            width: '85%',
            borderRadius: 5,
            elevation: 5,
            marginHorizontal: 30,
          }}
        >
          <Button
            mode="contained"
            color="#fff"
            icon={() => (
              <Image
                source={require('../../../Assets/send.png')}
                style={{ tintColor: '#2173A8', marginLeft: 300 }}
              />
            )}
            uppercase={false}
            onPress={() => props.navigation.navigate('Diagnosis')}
            contentStyle={{ height: 40 }}
          ></Button>
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
