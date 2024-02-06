import {View, Text, SafeAreaView, TextInput, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import {styles} from './styles';
import {Header} from '../../components/Header/Header';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButton from '../../components/CustomButton';

const LocationScreen = props => {
  return (
    <SafeAreaView style={styles.container}>
      <Header {...props} title={'Location'} />

      <View style={{flex: 1}}>
        <View style={{flex: 1}}>
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            mapType="standard"
          />
        </View>
        <View style={{backgroundColor: '#fff'}}>
          <View style={styles.locationContainer}>
            <TextInput
              placeholder="Location"
              placeholderTextColor={'#737373'}
              style={styles.locationTextInput}
            />
            <Icon name="gps-fixed" color={'#737373'} size={20} />
          </View>
          <CustomButton
            title={'Continue'}
            buttonStyle={{marginTop: 16}}
            onPress={() => props.navigation.navigate('LocationRadius')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LocationScreen;
