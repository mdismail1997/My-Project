import React, { Component } from 'react';
import { View, Text, StyleSheet, PixelRatio, Dimensions } from 'react-native';
import { calcH, calcW, STYLES } from '../../utils/constants/common';

const styles = StyleSheet.create({
    topContainer: {
        alignItems: 'center',
    },
    lineStyle: {
        marginTop: calcH(0.005),
        width: calcW(1),
        borderWidth: calcW(0.002),
        borderColor: STYLES.FOUR_COLO,
    },
    headerContainer: {
        marginTop: calcH(0.035),
        textAlign: 'center',
        flexDirection: "row",
        position: 'relative'
    },
    subheader: {
        marginRight: 30,
        // textAlign:'right',
        // justifyContent:'flex-start',
        // alignSelf:'flex-start',
        //textAlign:'right',
        //textAlign:'center',
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'quicksand_semibold',
    },
    searchIcon: {
        //backgroundColor:'#e2d970',
        tintColor: '#e2d970',
        position: 'absolute',
        width: calcW(0.07),
        height: calcW(0.07),
        left: calcW(0.6),
        marginTop: calcW(0.005),

    },
    SvgEyeOpen: {
        //backgroundColor: '#87CEEB',
        //tintColor: 'white',
        //position: 'absolute',
        width: calcW(0.065),
        height: calcW(0.05),
        //left:calcW(0.6),
        marginBottom: 15,

    },
    Deleteicon: {
        //backgroundColor: '#e2d970',
        //tintColor: 'white',
        //position: 'absolute',
        width: calcW(0.065),
        height: calcW(0.065),
        //left:calcW(0.6),
        marginTop: 15,

    },
    listContainer: {
        marginTop: calcH(0.04),
        marginBottom: calcH(0.12)
        // backgroundColor:'red',
    },
    listView: {
        height: calcH(0.14),
        //width: calcH(0.49),
        borderWidth: calcW(0.003),
        borderColor: STYLES.FOUR_COLO,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    place: {
        // backgroundColor:'black',
        fontSize: 16,
        fontWeight: '700',
        fontFamily: 'quicksand_regular',
    },
    price: {
        fontSize: 12,
        height: calcH(0.037),
        //backgroundColor:'red',
        borderRadius: calcW(0.03),
        //fontWeight: '700',
        fontFamily: 'quicksand_bold',
    },
    picContainer: {
        width: '34%',
        marginLeft: 10,
    },
    picture: {
        width: calcW(0.25),
        height: calcH(0.12),
        borderRadius: calcW(0.06),
        backgroundColor: STYLES.PRIMARY_COLOR,
    },
    infoContainer: {
        width: '40%',
    },
    btnContainer: {
        width: '20%',
        marginTop: calcH(0.035),
        justifyContent: 'center',
        height: calcH(0.02),
        alignItems: 'center',
        //backgroundColor:"#FFFDD0",
        borderRadius: calcH(0.03),
    },
    btnContainer1: {
        //width:'20%',
        marginTop: calcH(0.035),
        //justifyContent:'center',
        //height:calcH(0.02),
        // alignItems:'center',
        //backgroundColor:"#FFFDD0",
        //borderRadius:calcH(0.03),
    },
    btnText: {
        fontSize: 14,
        color: STYLES.THIRD_COLOR,
        fontWeight: '500'
    },

})

export default styles;