import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ExploreScreen = () => {
    return (
      <View style={styles.container}>
        <Text>Work in process</Text>
      </View>
    );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
