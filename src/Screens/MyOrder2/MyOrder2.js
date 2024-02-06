import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  I18nManager
} from 'react-native';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import { GetRequest } from '../../Services/ApiFunctions';
import CartItem from '../../Component/CartItem/CartItem';
import { setLng, getLng } from '../../Component/lng/changeLng';
import strings from '../../Component/lng/LocalizedStrings';
export default class MyOrder2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loder: false,
      orderListt: [],
      GrandTotal:'',
      SubTotal:'',
      ShippingAmount:'',
      TaxAmount:'',
      myid:'',
    };
  }

  componentDidMount = async () => {
    this.setState({ loder: true });
    this.selectedLng()
    // console.warn('this.props', this.props.route.params.status);
    this.getOrderList(this.props.route.params.id);
  };

  selectedLng = async () => {
    const lngData = await getLng()
    if (lngData) {
      strings.setLanguage(lngData);
    }
    if (lngData === 'en') {
      I18nManager.forceRTL(false);
    }
    if (lngData === 'ar') {
      I18nManager.forceRTL(true)
    }
    // await setLoading(false);
    this.setState({
      loder: false,
    })
    // console.warn("selected Language data==>>>", lngData)
  }

  getOrderList = id => {
    GetRequest(`orders/${id}`, undefined, {}, 'admin')
      .then(response => {
        this.setState({ loder: false });
        // console.warn(
        //   'getOrderListgetOrderListgetOrderListgetOrderListgetOrderListgetOrderListgetOrderListgetOrderList',
        //   response.increment_id,
        // );
        
        this.setState({ orderListt: response.items });
        this.setState({ GrandTotal: response.base_grand_total })
        this.setState({ SubTotal: response.base_subtotal })
        this.setState({ ShippingAmount: response.base_shipping_amount })
        this.setState({ TaxAmount: response.base_tax_amount })
        this.setState({ myid :response.increment_id })
      })
      .catch(error => {
        this.setState({ loder: false });
        console.log('getOrderList errorrr', error);
      });
  };
 
  render() {
    return (
      <View style={styles.container}>
        <Header
          title={strings.MY_ORDERS}
          navigation={this.props.navigation}
          icon="arrowleft"
        />
       <ScrollView>
       <View
       style={{
         flexDirection: 'row',
         marginLeft: 20,
         marginTop: 30,
         marginRight: 20,
       }}>
       {/* <View style={{ marginLeft: 20, marginRight: 20 }}> */}
       <FlatList
         data={this.state.orderListt}
         renderItem={({ item, index }) => {
           return (
             <View>
               {item.product_type == 'virtual' ? null : (
                 <TouchableOpacity
                   onPress={() => {
                     this.props.navigation.navigate('OrderSteps', {
                       status: this.props.route.params.status,
                       item: item,
                       itemm: this.props.route.params.items,
                       date: this.props.route.params.date,
                       myid:this.props.route.params.incid
                     });
                   }}>
                   <View
                     style={{
                       backgroundColor: '#fff',
                       justifyContent: 'center',
                       borderRadius: 5,
                       borderColor: '#000',
                       paddingBottom: 40,
                     }}>
                     <View style={{ flexDirection: 'row' }}>
                       <CartItem item={item} fromScreen={'myorder'} />
                       <View style={{ marginLeft: 20 }}>
                         {/* <View style={{ flexDirection: 'row', }}> */}
                         <Text
                           numberOfLines={2}
                           style={{
                             color: '#FF141D',
                             fontSize: 10,
                             fontFamily: 'Roboto-bold',
                           }}>
                           {strings.DELIVERY_DATE} :{' '}
                           {this.props.route.params.date}
                         </Text>
                         {/* </View> */}
                         <Text
                           numberOfLines={2}
                           style={{
                             color: '#5A5A5F',
                             fontSize: 14,
                             fontFamily: 'Roboto-bold',
                             fontWeight: 'bold',
                             marginTop: 5,
                           }}>
                           {item.name}
                         </Text>
                         <Text
                           numberOfLines={2}
                           style={{
                             color: '#43BC18',
                             fontSize: 12,
                             fontFamily: 'Roboto-bold',
                           }}>
                           {strings.AED} {item.price}
                         </Text>
                       </View>
                     </View>
                     <Text style={{ paddingHorizontal: 20, fontSize: 10 ,color:'#000000'}}>
                 ________________________________________________
                     </Text>
                   </View>
                 </TouchableOpacity>
               )}
             </View>
           );
         }}
         keyExtractor={item => item.id}
         showsHorizontalScrollIndicator={false}
       />
       {/* </View> */}
     </View>


     <View style={{ flex: 1, alignItems: "flex-end", marginRight:40,}} >
     <Text numberOfLines={1} style={{ color: "#000000", fontSize: 17, fontFamily: "Roboto-Regular", marginTop: 5 }}>
   Subtotal : {strings.AED} {this.state.SubTotal} 
     </Text>
     <Text numberOfLines={1} style={{color: "#000000", fontSize: 17, fontFamily: "Roboto-Regular", marginTop: 5 }}>
     Shipping & Handling : {strings.AED} {this.state.ShippingAmount}
     </Text>
     <Text numberOfLines={1} style={{color: "#000000", fontSize: 17, fontFamily: "Roboto-Regular", marginTop: 5 }}>
     Tax : {strings.AED} {this.state.TaxAmount}
     </Text>
     <Text numberOfLines={1} style={{color: "#000000", fontSize: 17, fontFamily: "Roboto-Regular", marginTop: 5 }}>
     Grand Total	: {strings.AED} {this.state.GrandTotal}
     </Text>
     </View>

       </ScrollView>
      







        {this.state.loder && <Loder />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  lblContainer: {
    // marginTop: 40,
    padding: 20,
    // paddingLeft: 5,
    width: 135,
    // alignSelf: 'center'
  },
});
