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
    pageTitle : {
        marginTop: calcH(0.038),
    },
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    headingContainer: {
        flexDirection : 'row',
        height:calcH(0.10),
        width:calcW(1),
        marginTop: calcH(0.03),
    },
    headTitle1: {
        width: calcW(0.3),      
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff',   
    },
   
    destination: {     
        textAlign: 'left',     
        fontSize:20,
        fontWeight: '700',
        fontFamily: 'quicksand_bold'
    },
    budget: {
        fontSize:20,
        textAlign: 'right',
        fontWeight: '700',
        fontFamily: 'quicksand_bold'
    },
    place: {
        left: calcW(0.08),
        fontSize: 14,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',    
        width:'30%'
    },
    price: {
        width: '30%',
        fontSize: 14,       
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',  
        left: calcW(0.06),
    }, 
    listContainer: {
        width:calcW(1),
    },
    listView: {
        height: calcH(0.1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row' ,
    } ,

})

export default styles;