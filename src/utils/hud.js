import React, {Component} from 'react';
import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';

var hud;

class Hud extends Component {
  constructor() {
    super();
    this.state = {
      visibility: false,
      msg: '',
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    this.setState({visibility: nextProps.visibility});
  }

  static setHud(ref) {
    hud = ref;
  }

  static toggleHud() {
    hud.setState({
      visibility: !hud.state.isVisible,
    });
  }

  static showHud() {
    hud.setState({
      visibility: true,
    });
  }

  static hideHud() {
    hud.setState({
      visibility: false,
    });
  }

  render() {
    if (!this.state.visibility) return null;
    return (
      <View style={styles.container} zIndex={500}>
        <StatusBar
          backgroundColor={Platform.select({
            ios: 'white',
            android: Platform.Version >= 23 ? 'white' : 'black',
          })}
          barStyle={Platform.select({
            ios: 'dark-content',
            android: Platform.Version >= 23 ? 'dark-content' : 'light-content',
          })}
        />
        <ActivityIndicator size="large" color="#00A3FE" />
        {/* <Image
          source={require('../Assets/loader.gif')}
          resizeMode={'contain'}
          style={styles.loader}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 500,
  },
  loader: {
    width: 80,
    height: 80,
    zIndex: 500,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 12,
  },
});

module.exports = Hud;
