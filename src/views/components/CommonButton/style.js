import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../../utils/constants/common';

const styles = StyleSheet.create({
   
    btnContainer:{
        width:calcW(0.75),
        height:calcH(0.07),
        backgroundColor:STYLES.THIRD_COLOR,
        justifyContent:'center',
        alignItems:'center',
        elevation:3
    },
    btnTxt:{
        fontSize:15,
        color:STYLES.PRIMARY_COLOR,
        textTransform:'uppercase',
        fontWeight:'500'
    }
})

export default styles;