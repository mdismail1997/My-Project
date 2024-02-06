import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../../utils/constants/common';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    subContainer:{
        marginHorizontal:calcW(0.04),
        position:"relative"
    },
    searchContainer:{
        alignItems:'center',
        marginTop:calcH(0.02)
    },
    totalproductText:{
        marginTop: calcH(0.02),
        color:STYLES.PRIMARY_COLOR,
        fontSize: 12,
        marginBottom: calcH(0.02),
        fontFamily:"OpenSans-Regular"
    },
    scrollViewConatiner:{
        // maxHeight: calcH(0.58)
        height: calcH(0.58)
        // marginBottom: calcH(0.2)
    },
    createProductContainer:{
        alignItems:'flex-end',
        marginTop: calcH(0.022),
        position:"absolute",
        bottom:0,
        right:0
    },
    card:{
      width:calcW(0.92),
      height:calcH(0.1),
      backgroundColor:'#ffffff',
      marginTop:calcH(0.01),
      borderWidth:1,
    },
    cardSubcontainer:{
        marginHorizontal:calcW(0.02),
        marginTop:calcH(0.01),
        flexDirection:'row',
    },
    cardLeft:{
        width:calcW(0.1),
    },
    cardMiddle:{
        width:calcW(0.53),   
    },
    cardRight:{
        width:calcW(0.2), 
        alignItems:'flex-end',
        marginTop:calcH(0.025)
    },
    leftImaContainer:{
        width:calcW(0.1),
        height:calcW(0.1),
        borderRadius:calcW(0.01)
    },
    leftImg:{
        width:calcW(0.125),
        height:calcW(0.15),

    },
cardMiddleContainer:{
    marginHorizontal:calcW(0.05)
},
middleTopText:{
    fontSize:16,
    color:STYLES.PRIMARY_COLOR,
},
middleBottomtext:{
    fontSize:12,
    color:STYLES.PRIMARY_COLOR,
    fontWeight:'500',
    paddingTop:calcH(0.002)
},
lastBottomtext: {
    fontSize:10,
    color:STYLES.PRIMARY_COLOR,
    paddingTop:calcH(0.002)
},

})

export default styles;