import React, {useState} from 'react';
import {View, StyleSheet, Modal, ActivityIndicator, Text} from 'react-native';

function Loder() {
  const [open, setOpen] = useState(true);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => handleToggle()}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 30,
            paddingVertical: 15,
            borderRadius: 5,
          }}>
          <ActivityIndicator size="large" color="#5A5A5F" />
          <Text
            style={{
              fontFamily: 'OpenSans-Bold',
              fontSize: 20,
              color: '#5A5A5F',
              marginLeft: 30,
            }}>
            Loading...
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loder;
