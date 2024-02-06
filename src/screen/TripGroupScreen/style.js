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
    groupContainer: {
        flexDirection : 'row',
        height:calcH(0.3),
        width:'98%',
        marginTop: calcH(0.12),
    },
    member: {
        width: calcW(0.25), 
        height: calcW(0.25),
        borderRadius: calcW(0.15),     
        justifyContent: 'center',
        alignItems: 'center',
      //  backgroundColor: STYLES.FOUR_COLO       
    },
   
    member1: {
        left: calcW(0.05),
        width: calcW(0.25), 
        height: calcW(0.25),
        borderRadius: calcW(0.15),     
        justifyContent: 'center',
        alignItems: 'center',
      //  backgroundColor: STYLES.FOUR_COLO       
    },
    member2: {
        left: calcW(0.1),
        width: calcW(0.25), 
        height: calcW(0.25),
        borderRadius: calcW(0.15),     
        justifyContent: 'center',
        alignItems: 'center',
      //  backgroundColor: STYLES.FOUR_COLO       
    },
   
    destination: {     
        textAlign: 'left',     
        fontSize:20
    },
    budget: {
        fontSize:20,
        textAlign: 'right'
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
    profileImg:{
        height: calcW(0.25),
        width: calcW(0.25),
        borderRadius: calcH(0.15),
     },
     memberName: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: 'quicksand_bold',
        marginTop:calcW(0.015)
     },
     btnContainer:{
        width: '100%',
        alignItems:'center',
        marginTop:calcH(0.3),
        marginBottom: calcH(0.1)
     },
     btnSubContainer:{
         width:calcW(0.85),
         height:calcH(0.06),
         borderRadius:calcH(0.03),
         backgroundColor:STYLES.PRIMARY_COLOR,
         justifyContent:'center',
         alignItems:'center'
     },
     btnText:{
        fontSize:14,
        color:STYLES.THIRD_COLOR,
        fontWeight:'500',
        fontFamily: 'quicksand_medium',
     },
})

export default styles;