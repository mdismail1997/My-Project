import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW ,STYLES} from '../../utils/constants/common';

const styles = StyleSheet.create({
    container: {
        flex: 1,
       backgroundColor:STYLES.PRIMARY_COLOR,
       // justifyContent:'center',
        //alignItems:'center'
    },
    topContainer:{
        flex:8,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:STYLES.PRIMARY_COLOR
    },
    bottomContainer:{
        flex:2,
        backgroundColor:STYLES.PRIMARY_COLOR,
        alignItems:'center',
        justifyContent:'center'

    },
    topHeadText:{
        fontSize:45,
        color:STYLES.THIRD_COLOR,
        fontWeight:'700'
    },
    bottomTopText:{
        fontSize:10,
        color:STYLES.THIRD_COLOR,
        fontWeight:'100',
        letterSpacing:calcW(0.0025),
        
       // paddingTop:calcH(-0.01)
    },
    bottomSubContainer:{
        width:calcW(0.45)
    },
    logoContainer:{
        width:calcW(0.3),
        height:calcW(0.3),
        marginRight:calcW(0.04)
    },
    logoImg:{
        width:calcW(0.3),
        height:calcW(0.3),
        resizeMode:'contain'
    }
   
})

export default styles;