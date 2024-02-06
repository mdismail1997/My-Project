import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    inputContainer: {
        width: calcW(0.8),
        height: calcH(0.07),
        marginBottom:calcH(0.02),
        borderRadius:calcH(0.01),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 11,
        },
        shadowOpacity: 0.57,
        shadowRadius: 15.19,
        
        elevation: 23,
        backgroundColor:'#ffffff',
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between'
        
    },
    inputContainer2:{
        width: calcW(0.7),
        height: calcH(0.07),
        marginBottom:calcH(0.02),
        alignItems:'center',
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomColor:'#e1e1e1',
        borderBottomWidth:1
    },

    inputSubContainer:{
        width:calcW(0.67),
        marginLeft:calcH(0.03)
    },
    iconContainer:{
        width:calcW(0.2),
    },

    inputSubContainer2:{
        width:calcW(0.67),
        //marginLeft:calcH(0.03)
    },
    iconContainer2:{
        width:calcW(0.2),
    },
    inputStyle:{
        height:calcH(0.06)
    },
    IconStyle:{
        width:calcW(0.04),
        height:calcH(0.04),
        resizeMode:'contain'
    },
    
})

export default styles;