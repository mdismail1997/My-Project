import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';


const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
    },
    lineStyle:{
        marginTop: calcH(0.005),
        width:calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO  ,
    },
    headerText: {
        marginTop: calcH(0.035),    
    },
    searchIcon: {
        position: 'absolute',
        width: calcW(0.05),
        height: calcW(0.05),
        left:calcW(0.5),
        marginTop: calcW(0.02),
       
    },
    headersecondText: {
        marginTop: calcH(0.08),   
    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    imageContainer: {
        borderRadius:5,
        paddingBottom:0,
        backgroundColor: STYLES.FOUR_COLO,
        marginTop: calcH(0.05),
        height: calcH(0.65),
        width:'100%',
        flexDirection:'row'
    },
    mapImg:{
        height: calcH(0.65),
        width:'100%',
        borderRadius: calcH(0.01), 
    }
})

export default styles;