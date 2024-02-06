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
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff', 
       // backgroundColor: STYLES.PRIMARY_COLOR  
    },
    headTitle2: {
        width: calcW(0.5),      
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: STYLES.FOUR_COLO ,
        borderTopColor: '#ffffff', 
       // backgroundColor: STYLES.PRIMARY_COLOR  
    },
  
    destination: { 
        left: calcW(0.12),  
        fontSize:20,
        fontWeight: '700',
        fontFamily: 'quicksand_bold'
    },
    budget: {
        fontSize:20,
        fontWeight: '700',
        fontFamily: 'quicksand_bold'
    },
    place: {
        left: calcW(0.08),
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'quicksand_semibold',    
        width:'45%'
    },   
    listContainer: {
        width:calcW(1),
    },
    listView: {
        height: calcH(0.15),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO,
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row' ,
    } ,
    starPlace : {
        width:'45%',
        alignItems:'center',
         right: calcW(0.01), 
         marginTop:calcH(0.02),
        // backgroundColor: STYLES.PRIMARY_COLOR 
    }, 
    btnContainer: {
        flexDirection:'row' ,
        marginTop: calcW(0.025)
    },
    iconeye: {
        width:calcW(0.065),
        height:calcW(0.04)
    }, 
    iconplus: {     
        width:calcW(0.04),
        height:calcW(0.04),
       // backgroundColor: STYLES.PRIMARY_COLOR,
    },
    eyeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width:calcW(0.1),
        height:calcH(0.04) ,
        backgroundColor: STYLES.FOUR_COLO,
        borderRadius: calcW(0.1)
    },
    plusContainer: {
       justifyContent: 'center',
       alignItems: 'center',
        left: calcW(0.02),
        width:calcW(0.09),
        height:calcH(0.04) ,
        backgroundColor: STYLES.PRIMARY_COLOR,
        borderRadius: calcW(0.1)
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",     
      },
      modalView: {
        width: calcW(0.9), 
        height: calcH(0.48), 
        margin: 20,
        backgroundColor: "white",
        borderRadius: calcW(0.05),
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      headerView: {
        flexDirection: 'row', 
     },
     modelCancelContainer : {
       left: calcW(0.15),
        width: calcW(0.06),
        height: calcW(0.06),
        borderRadius: calcW(0.05),
        backgroundColor: STYLES.PRIMARY_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
     },
      button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
       modalText: {
        fontSize: 18, 
        fontWeight: '600',
        fontFamily: 'quicksand_semibold', 
        marginBottom: calcW(0.02),
        textAlign: "center"
      }, 
      lineModelStyle: {
        marginTop: calcH(0.005),
        width: '98%',
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO  ,
      },
      modalsubText: {
        fontSize: 16, 
        fontWeight: '400',
        fontFamily: 'Quicksand-Regular',   
        marginTop: calcW(0.05),
        textAlign: "center"
      },
      typeContainer: {
          marginTop: calcW(0.05)
      },
      subcanbtnContainer: {
        flexDirection:'row' ,
        width: '98%',
        marginTop: calcW(0.025)
      },
      cancelContainer: {
        width: '48%',
        justifyContent: 'center',
        alignItems: 'center',
        height:calcH(0.06) ,
        backgroundColor :STYLES.FOUR_COLO,
        borderRadius: calcW(0.1)
      },
      submitContainer : {
        width: '48%',
         justifyContent: 'center',
         alignItems: 'center',
         left: calcW(0.02),
      //   width:calcW(0.09),
         height:calcH(0.06) ,
         backgroundColor: STYLES.PRIMARY_COLOR,
         borderRadius: calcW(0.1)
      },
      cancelText : {

      },
      submitText : {
          color: STYLES.THIRD_COLOR
      },
     
})

export default styles;