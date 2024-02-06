import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    headerContainer: {    
        width: calcW(1),
        height: calcH(0.10), 
        flexDirection: "row", 
        position: 'relative'
    },
    headerLogo: {
        width: calcW(0.30),
        height: calcW(0.22),
        resizeMode: 'contain',
        position: 'absolute',
        left: calcW(0.34)
    },
    backArrow: {
       position: 'absolute',
       left:calcW(0.06),
       top:calcW(0.08),
    },
    iconSize:{
        width:calcW(0.04),
        height:calcH(0.04),
        resizeMode:'contain'
    },
    userLogo: {
        position: 'absolute',
        width: calcW(0.13),
        height: calcW(0.13),
        right: calcW(0.06),
        marginTop: calcW(0.01),
        borderRadius: calcW(0.09)
    },
    searchIcon:{
        
    }
    
})

export default styles;