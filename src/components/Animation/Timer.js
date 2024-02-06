import React, { useState, useEffect, } from 'react';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Clock from 'react-native-vector-icons/SimpleLineIcons'
const CountdownTimer = ({ endTime, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining());
  const [totalSec, setTotalSec] = useState(null)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);
    // if (endTime.totalSeconds == 0) {
    //   onFinish()
    // }
    return () => clearInterval(timer);
  }, [endTime]);

  function calculateTimeRemaining() {
    const totalSeconds = Math.max(Math.floor((endTime - Date.now()) / 1000), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    // setTotalSec(totalSeconds)
    return { hours, minutes, seconds, totalSeconds };
  }

  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  return (
    <SafeAreaView >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Clock name="clock" size={25} color={timeLeft.totalSeconds < 30 ? "red" : "green"} style={{ marginRight: 10 }} />
        <Text style={timeLeft.totalSeconds < 30 ? styles.afterThirty : styles.beforeThirty}>{formatTime(timeLeft.hours)} hr : </Text>
        <Text style={timeLeft.totalSeconds < 30 ? styles.afterThirty : styles.beforeThirty}>{formatTime(timeLeft.minutes)} m : </Text>
        <Text style={timeLeft.totalSeconds < 30 ? styles.afterThirty : styles.beforeThirty}>{formatTime(timeLeft.seconds)} s </Text>
      </View>
      {timeLeft.totalSeconds === 0 ? onFinish() : null}

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  beforeThirty: {
    fontSize: 14, color: "green"
  },
  afterThirty: {
    fontSize: 16, color: "red", fontWeight: "bold"
  }
})
export default CountdownTimer;