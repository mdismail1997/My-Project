import { StyleSheet } from 'react-native';
import { calcH, calcW, STYLES } from '../../../utils/constants/common';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:STYLES.THIRD_COLOR
    },
    headerContainer: {
        flex: 1, 
        alignItems: 'flex-end'
    },
    footerContainer: {
        flex: 1
    },
    headerImgStyle : {
        width:calcW(0.6),
        height:calcW(0.565),
    },
    imgStyle:{
        width:calcW(0.4),
        height:calcW(0.85),
    },
    bodyContainer: {
        flex: 1,
        marginTop: calcW(0.15),
        alignItems:'center',
        marginHorizontal: 16,
    },
    textHeader: {
        color: STYLES.PRIMARY_COLOR,
        fontSize: 30,
    },
    subText: {
        color: STYLES.PRIMARY_COLOR,
        fontSize: 16,
        marginTop: 5,
        fontWeight: 'normal',
    },
    otpText: {
        color: STYLES.PRIMARY_COLOR,
        fontSize: 15,
        marginTop: 5,
        fontWeight: 'normal',
    },
    otpContainer: {
        marginTop:calcH(0.03),
    },
    descriptionContainer: {
        // marginTop: 12,
        alignItems:'center',
        flexDirection: "row",
        justifyContent:'center',
    },
    bottomContainer:{
        marginTop:calcH(0.04),
        flexDirection: "row",
        justifyContent:'center',
        alignItems:'center'
    },
    btnContainer:{
        width:calcW(0.85),
        height:calcH(0.07),
        backgroundColor:STYLES.SIVEN_COLOR,
        justifyContent:'center',
        alignItems:'center',
        // elevation:3
    },
    // btnTxt:{
    //     fontSize:18,
    //     color:STYLES.THIRD_COLOR,
    //     textTransform:'uppercase',
    //     fontWeight:'500',
    //     fontFamily:'sans-serif-light'
    // }
})

export default styles;