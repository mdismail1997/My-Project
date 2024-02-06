import React, { Component } from 'react';
import { Text, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = require('./style');

var toast;

class CommonToast extends Component {
  static setToast(thisref) {
    toast = thisref;
  }

  static hideToast() {
    clearTimeout(toast.timerOut);
    Animated.timing(toast.state.animationY, {
      toValue: -100,
      duration: 300,
      delay: 800,
      useNativeDriver: true,
    }).start();
  }

  static showToast(title, type, callback = null) {
    toast.callback = callback;
    toast.setState({
      titleTxt: title,
      toastType: type,
    });
    if (toast.timerOut) clearTimeout(toast.timerOut);
    toast.showToastAnimation();
  }

  showToastAnimation() {
    Animated.spring(
      this.state.animationY,
      { toValue: 0 } // Back to zero
    ).start();

    //Hide the toast
    this.timerOut = setTimeout(function () {
      Animated.timing(toast.state.animationY, {
        toValue: -100,
        duration: 300,
      }).start();
      if (toast.callback) toast.callback(false);
    }, 2000);
  }

  constructor() {
    super();
    this.state = {
      animationY: new Animated.Value(-100),
    };
    this.showToastAnimation = this.showToastAnimation.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.visibility) {
      CommonToast.showToast(nextProps.title, nextProps.type);
    } else {
      CommonToast.hideToast();
    }
  }

  render() {
    return (
      <Animated.View
        style={[
          styles.container,
          { transform: [{ translateY: this.state.animationY }] },
        ]}
      >
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={
            this.state.toastType == 'success'
              ? ['#2fdc6f', '#358d10']
              : ['#FF2E95', '#FF5858']
          }
          style={{ flexDirection: 'row', padding: 12 }}
        >
          <Text style={styles.title}>{this.state.titleTxt}</Text>
          <Text
            style={styles.actionBtn}
            onPress={() => {
              if (this.callback) this.callback(true);
              this.callback = null;
              CommonToast.hideToast();
            }}
          >
            {this.state.toastType == 'success' ? '' : ''}
          </Text>
        </LinearGradient>
      </Animated.View>
    );
  }
}

module.exports = CommonToast;
