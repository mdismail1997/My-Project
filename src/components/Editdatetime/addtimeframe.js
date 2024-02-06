import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, ScrollView, Image, Alert } from 'react-native';
import { Text, TextInput, Card, Paragraph, Snackbar } from 'react-native-paper';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIntl } from 'react-intl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Apis from '../../screens/Services/apis';
import Spinner from 'react-native-loading-spinner-overlay/lib';

export const AddTimeFrame = ({ value, onStartTimeChange, onEndTimeChange }) => {
  const intl = useIntl();
  const [starttimeVisible, setstarttimeVisible] = useState(false);
  const [endtimeVisible, setEndtimeVisible] = useState(false);

  const showstarttimePicker = () => {
    setstarttimeVisible(true);
  };

  const hidestarttimeDatePicker = () => {
    setstarttimeVisible(false);
  };

  // const handlestarttimeConfirm = (date) => {
  //   console.warn('A time has been picked: ', date.toLocaleTimeString('en-US'));
  //   const output = intl.formatTime(date);
  //   console.log('output======>', output);
  //   onStartTimeChange?.(output);

  //   hidestarttimeDatePicker();
  // };
  const showendtimePicker = () => {
    setEndtimeVisible(true);
  };

  const handlestarttimeConfirm = (date) => {
    const currentTime = new Date();
    const currentDate = new Date().setHours(0, 0, 0, 0);


    // if (date < currentTime) {
    //   Alert.alert('Invalid Time', 'Please select a future time');
    //   hidestarttimeDatePicker();
    // } else if (date >= currentDate) {
    console.warn('A time has been picked: ', date);
    const output = intl.formatTime(date);
    console.log('output======>', output);
    onStartTimeChange?.(output);

    hidestarttimeDatePicker();
    // }

  };

  const hideendtimeDatePicker = () => {
    setEndtimeVisible(false);
  };

  // const handleendtimeConfirm = (date) => {
  //   console.warn('A time has been picked: ', date.toLocaleTimeString('en-US'));
  //   const output = intl.formatTime(date);
  //   console.log('output======>', output);
  //   onEndTimeChange?.(output);

  //   hideendtimeDatePicker();
  // };
  const handleendtimeConfirm = (date) => {
    const currentTime = new Date();
    const currentDate = new Date().setHours(0, 0, 0, 0);


    // if (date < currentTime) {
    //   Alert.alert('Invalid Time', 'Please select a future time');
    //   hideendtimeDatePicker();
    // } else if (date >= currentDate) {
    console.warn('A time has been picked: ', date);
    const output = intl.formatTime(date);
    console.log('output======>', output);
    onEndTimeChange?.(output);

    hideendtimeDatePicker();
    //}

  };
  return (
    <SafeAreaView>
      <ScrollView>
        <TouchableOpacity
          style={{ flexDirection: 'row', width: '100%' }}
          onPress={showstarttimePicker}
        >
          <TextInput
            value={value.start_time}
            onChangeText={onStartTimeChange}
            mode="outlined"
            label="Start Time*"
            // placeholder="15:00:00 PM"
            selectionColor="black"
            outlineColor="black"
            onPressIn={showstarttimePicker}
            activeOutlineColor="black"
            showSoftInputOnFocus={false}
            style={{
              marginHorizontal: '9%',
              marginBottom: 10,
              width: '82%',
              backgroundColor: '#fff',
            }}
            editable={false}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../Assets/carbon_time.png')}
                onPress={showstarttimePicker}
                color="#000"
              />
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showendtimePicker}
          style={{ flexDirection: 'row', width: '100%' }}
        >
          <TextInput
            value={value.end_time}
            onChangeText={onEndTimeChange}
            mode="outlined"
            label="End Time*"
            // placeholder="15:00:00 PM"
            selectionColor="black"
            outlineColor="black"
            activeOutlineColor="black"
            showSoftInputOnFocus={false}
            onPressIn={showendtimePicker}
            editable={false}
            style={{
              marginHorizontal: '9%',
              marginBottom: 10,
              width: '82%',
              backgroundColor: '#fff',
            }}
            theme={{
              colors: {
                text: 'black',
                placeholder: 'black',
              },
            }}
            right={
              <TextInput.Icon
                icon={require('../../Assets/carbon_time.png')}
                onPress={showendtimePicker}
                color="#000"
              />
            }
          />
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={starttimeVisible}
          mode="time"
          onConfirm={handlestarttimeConfirm}
          onCancel={hidestarttimeDatePicker}
        // minimumDate={new Date()}
        />
        <DateTimePickerModal
          isVisible={endtimeVisible}
          mode="time"
          onConfirm={handleendtimeConfirm}
          onCancel={hideendtimeDatePicker}
        // minimumDate={new Date()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
