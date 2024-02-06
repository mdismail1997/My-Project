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
    subheader: {
        textAlign:'center',
        fontSize: 22,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
    },
    cardContainer:{
        marginTop:calcH(0.02),

    },
    categoryRow1: {
        height:calcH(0.25),
        backgroundColor:STYLES.THIRD_COLOR,
        marginTop: calcH(0.025),
        flexDirection: "row",      
    },
    categoryRow2: {
        height:calcH(0.25),
        backgroundColor:STYLES.THIRD_COLOR,
        marginTop: calcH(0.01),
        flexDirection: "row", 
             
    },
    catCard1: {
        width: "49%",
        borderRadius:15,
        backgroundColor:STYLES.PRIMARY_COLOR,
        marginRight:"2%",
        justifyContent: "center",
        alignItems: "center",
         borderWidth: 2,
        borderColor: STYLES.FOUR_COLO  ,
         shadowColor: STYLES.FOUR_COLO,
         shadowOffset: { width: 0, height: 2 },
         shadowOpacity: 0.9,
         shadowRadius: 3,
         elevation: 3, 
    },
    
    catCard2: {
        width: "49%",
        borderRadius:15,
        marginRight:"2%",
     //   backgroundColor:STYLES.THIRD_COLOR,
        justifyContent: "center",
        alignItems: "center", 
        borderWidth: 2,
        borderColor: STYLES.FOUR_COLO  ,
        shadowColor: STYLES.FOUR_COLO,
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.9,
        shadowRadius: 3,
        elevation: 3,         
    },
    activecatName: {
    color:'#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'quicksand_semibold',
    },

    catName: {
        fontSize: 18,
        textAlign: 'center',
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
        }, 
})

export default styles;