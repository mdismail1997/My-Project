import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {SafeView} from '../../../Component';
import HeaderComponent from '../../../Component/Header';
import {tabBarIcon} from '../../../Component/ScreenComponenet/BottomTabItem';
import routes from '../../../Navigation/routes';

export default SizeDetails = props => {
  return (
    <SafeView>
      <HeaderComponent
        headingName={'Size Chart'}
        arrow={tabBarIcon('arrow-left')}
        onPress={() => props.navigation.goBack()}
        searchPress={() => props.navigation.navigate(routes.SearchItem)}
      />
    </SafeView>
  );
};

const styles = StyleSheet.create({});
