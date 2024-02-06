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
        width: calcW(0.5),      
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff',
    
    },
    headTitle2: {
        width: calcW(0.5),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff',
   
    },
    destination: {      
        textAlign: 'left',     
        fontSize:21,
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
    },
    budget: {
        fontSize:21,
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
        textAlign: 'right'
    },
    place: {
        left: calcW(0.11),
        // paddingVertical:12,
        // paddingHorizontal:30,
        fontSize: 18,
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular',    
        width:'70%'
    },
    price: {
        width: '30%',
        fontSize: 18,       
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular',
        right: calcW(0.02),
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