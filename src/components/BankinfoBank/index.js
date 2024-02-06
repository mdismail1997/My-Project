import { View, Text, StyleSheet, FlatList, TouchableOpacity,Alert } from 'react-native';
import React from 'react';
import { COLORS, FONT_FAMILY } from '../../utils/Const';
import { hp, wp } from '../../utils/ResponsiveLayout';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/FontAwesome';
import { List, IconButton, Checkbox } from 'react-native-paper';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { retrieveData } from '../../utils/AsyncStore';
import axios from 'axios';
import Loader from '../../components/Loader';

const BankInfoBank = props => {
    const { bank, bankDetails } = props

    console.log("/////////////////", bankDetails)

    const expiery = (month, year) => {
        const months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        return `${months[month - 1]} ${year}`
    }

    const [isDefault, setIsDefault] = React.useState(false);
    const [select, setSelect] = React.useState('');
    const [Loading, setLoading] = React.useState(false);



    const onDeleteBank = async (id) => {

        var userToken = await retrieveData('USER_TOKEN')
    
        setLoading(true)
    
        let config = {
          method: 'post',
          url: `https://nodeserver.mydevfactory.com:6098/api/bank/delete_bank_account`,
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': userToken,
          },
          data: {
            id:id

          }
    
        };
    
        axios(config)
          .then(async (response) => {
            // console.log(".....|||||.......", response)
            if (response.status == 200) {
              Alert.alert(response.data.message)
              setLoading(false)
              props.navigation.replace('Home')
    
            } else {
              Alert.alert("Fail to delete Bank account!")
            }
          })
          .catch((error) => {
            console.log(error);
          });
    
      }


    return (

        // <View style={styles.container}>
        //     <View style={styles.bankNameContainer}>
        //         <Text style={styles.bankNameText}>
        //             <Icon
        //                 name="bank"
        //                 color={COLORS.LAPSI_LAZULI}
        //                 size={wp(30)}
        //                 style={styles.iconStyle}
        //             />
        //         </Text>
        //     </View>
        //     <View style={styles.infoContainer}>
        //         <Text style={styles.accountNameText}>{bankDetails?.account_holder_name}</Text>
        //         {/* <Text style={styles.dateText}>{bankDetails?.legal_entity?.dob?.year}/{bankDetails?.legal_entity?.dob?.month}/{bankDetails?.legal_entity?.dob?.day}</Text> */}
        //         <Text style={styles.accountText}>{bankDetails?.external_accounts?.data[0]?.bank_name}</Text>
        //         <Text style={styles.accountNumberText}>*********{bankDetails?.external_accounts?.data[0]?.last4}</Text>

        //     </View>


        // </View> :

        // <View style={styles.container}>

        //     <View style={styles.infoContainer}>
        //         <Text style={[styles.accountNumberText, {}]} >No Bank Details Found. Please add!! </Text>
        //     </View>
        // </View>





       
        bank ?
            <FlatList
                style={{ flex: 1 }}
                nestedScrollEnabled={true}
                data={bankDetails}
                renderItem={(item, index) => {
                    return (

                        <View style={styles.container}>
                            <View style={styles.bankNameContainer}>
                                <Text style={styles.bankNameText}>
                                    <Icon
                                        name="bank"
                                        color={COLORS.LAPSI_LAZULI}
                                        size={wp(30)}
                                        style={styles.iconStyle}
                                    />
                                </Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.accountNameText}>{item?.item?.account_holder_name}</Text>
                                {/* <Text style={styles.dateText}>{bankDetails?.legal_entity?.dob?.year}/{bankDetails?.legal_entity?.dob?.month}/{bankDetails?.legal_entity?.dob?.day}</Text> */}
                                <Text style={styles.accountText}>{item?.item?.bank_name}</Text>
                                <Text style={styles.accountNumberText}>*********{item?.item?.last4}</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        //backgroundColor: 'red',
                                    }}>
                                    <Checkbox
                                        status={isDefault ? 'checked' : 'unchecked'}
                                        onPress={() => setIsDefault(!isDefault)}
                                        color={COLORS.YELLOW_GREEN}
                                        style={{ backgroundColor: 'yellow' }}
                                    />
                                    <Text
                                        style={{
                                            color: COLORS.LAPSI_LAZULI,
                                            fontSize: wp(12),
                                            fontFamily: FONT_FAMILY.LATO_REGULAR,
                                        }}>
                                        Set as Default
                                    </Text>
                                </View>

                            </View>
                            <TouchableOpacity style={{width:'45%',alignItems:'flex-end'}} onPress={() => onDeleteBank(item.item.id)}>
                                <MIcon
                                    name="delete"
                                    color={COLORS.COQUELICOT}
                                    size={wp(28)}
                                />
                            </TouchableOpacity>
                        </View>

                    );
                }}
            /> : null


            
    );
};

export default BankInfoBank;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        paddingVertical: hp(8),
        paddingHorizontal: wp(12),
        backgroundColor: COLORS.WHITE,
        borderRadius: 12,
        marginTop: hp(12),
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.25,
        borderColor: COLORS.YELLOW_GREEN,
        // shadowColor: '#000',
        // shadowOffset: {
        //     width: 0,
        //     height: 2,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 3,

    },
    bankNameContainer: {
        height: wp(44),
        width: wp(44),
        borderRadius: 50,
        backgroundColor: COLORS.YELLOW_GREEN,
        justifyContent: 'center',
        alignItems: 'center',

    },
    bankNameText: {
        fontSize: wp(16),
        fontFamily: FONT_FAMILY.LATO_BOLD,
        color: COLORS.WHITE,
        textTransform: 'uppercase',
    },
    infoContainer: {
        marginLeft: wp(14),
    },
    accountNameText: {
        fontSize: wp(14),
        fontFamily: FONT_FAMILY.LATO_BOLD,
        color: COLORS.BLACK,
    },
    dateText: {
        fontSize: wp(10),
        fontFamily: FONT_FAMILY.LATO_REGULAR,
        color: COLORS.NICKEL,
        marginTop: hp(4),
    },
    accountNumberText: {
        fontSize: wp(20),
        fontFamily: FONT_FAMILY.LATO_BOLD,
        color: COLORS.BLACK,
        marginTop: hp(8),
    },
    iconStyle: {
        alignSelf: 'flex-start',
        position: 'absolute',
        right: wp(12),
        top: hp(8),
    },
    accountText: {
        fontSize: wp(16),
        fontFamily: FONT_FAMILY.LATO_BOLD,
        color: COLORS.BLACK,
        marginTop: hp(8),
    }
});
