import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    topContainer: {
       
        alignItems: 'center',
    },
    lineStyle:{
        //flex:1,
        marginTop: calcH(0.005),
        width:calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO,
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
    groupConatiner: {
        marginTop: calcW(0.10),
        width: calcW(1),
        height: calcH(0.44),
      //  backgroundColor: STYLES.FOUR_COLO
    },
    detailsRow: {
        flexDirection: 'row',
        height: calcH(0.11),
        //justifyContent: 'center',
        alignItems: 'center'
    },
    leftInfo: {
        width:calcW(0.40),
        fontSize: 18,
        color: '#000000',
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',
        left: calcW(0.06)
    },
    rightInfo: {
        width:calcW(0.45),
        fontSize: 18,
        fontWeight: "bold",
        color: '#DBDBDB',
      //  backgroundColor: STYLES.SECONDARY_COLOR
    },
    NrightInfo: {
        width:calcW(0.05),
        fontSize: 18,
        fontWeight: "bold",
        color: '#DBDBDB',
      //  backgroundColor: STYLES.SECONDARY_COLOR
    },
    middleInfo: {
        width:calcW(0.1),
        fontSize: 18,
        fontWeight: "bold",
        color: '#DBDBDB',
    },
    middleInfo1: {
        //backgroundColor:'red',
        width:calcW(0.08),
        position:'relative',
        marginLeft:25,
        fontSize: 18,
        fontWeight: "bold",
        color: '#DBDBDB',
    },
    btnContainer: {
        alignItems:'center',
        marginTop:calcH(0.05) ,
        marginBottom: calcH(0.1)    
    },
    btnSubContainer: {
        width:calcW(0.88),
        height:calcH(0.06),
        borderRadius:calcH(0.03),
        backgroundColor:STYLES.PRIMARY_COLOR,
        justifyContent:'center',
        alignItems:'center'
    },
    btnText: {
        fontSize:16,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500'
    }

})

export default styles;