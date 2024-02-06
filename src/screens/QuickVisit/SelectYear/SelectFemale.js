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
export const SelectFemale = (props) => {
  const [selectedValue, setSelectedValue] = React.useState('');

  const handlePress = (event, value) => {
    setSelectedValue(value), props.navigation.navigate('Chatting');
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
      <Header6 title="Quick Visit" navProps={props.navigation} />
      <ScrollView
        style={{ marginBottom: 20, backgroundColor: '#fff', bottom: 0 }}
      >
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
            Helo {''}
            <Text style={{ color: '#2173A8' }}>Mr.Sdip laha</Text> Welcome .
            Chat for your appointment . Select from following
          </Text>
        </View>

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
            Please select your <Text style={{ color: '#2173A8' }}>Gender.</Text>
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
            Female
          </Text>
        </View>
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
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.app}
            onPress={() => props.navigation.navigate('Chatting')}
          >
            {chipData.map((el, i) => (
              <RadioSelector
                key={i}
                title={el}
                value={el}
                onPress={handlePress}
                selected={selectedValue}
              />
            ))}
          </TouchableOpacity>
        </ScrollView>
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
