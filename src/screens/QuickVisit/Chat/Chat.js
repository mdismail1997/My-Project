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
import RadioSelector from '../../../components/Chip';
export const Chatting = (props) => {
  const [selectedValue, setSelectedValue] = React.useState('');

  const handlePress = (event, value) => {
    setSelectedValue(value);
  };
  const chipData = [
    '2004',
    '2003',
    '2002',
    '2001',
    '2000',
    '1999',
    '1998',
    '1997',
    '1996',
    '1995',
    '1994',
    '1993',
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', bottom: 0 }}>
      <Header6 title="Chat" navProps={props.navigation} />
      <ScrollView
        style={{ marginBottom: 20, backgroundColor: '#fff', bottom: 0 }}
      >
        <View
          style={{
            width: '50%',
            backgroundColor: '#2173A81A',
            marginTop: 20,
            marginLeft: 20,
            borderRadius: 10,
          }}
        >
          <Text style={{ padding: 15 }}>
            Select your <Text style={{ color: '#2173A8' }}> Birth Year.</Text>
          </Text>
        </View>
        <View
          style={{
            width: '20%',
            backgroundColor: '#2173A8',
            marginTop: 20,
            marginRight: 20,
            borderRadius: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Text style={{ padding: 15, color: '#fff', textAlign: 'center' }}>
            2003
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
            Please select the body part where you are experiencing pain
          </Text>
        </View>
        <View
          style={{
            alignSelf: 'center',
            justifyContent: 'center',
            paddingTop: 30,
            marginBottom: 30,
            marginRight: 10,
            width: '70%',
          }}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate('SelectCause')}
            style={{
              elevation: 15,
              borderRadius: 10,
              backgroundColor: '#fff',
              paddingHorizontal: 25,
              paddingTop: 10,
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
              Select of your body part
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
