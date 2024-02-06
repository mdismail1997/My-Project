// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   FlatList,
//   Dimensions,
// } from 'react-native';
// import { GetRequest } from '../../Services/ApiFunctions';
// import Loder from '../../Component/Common/Lodar';
// import Header from '../../Component/Header/Header';
// import strings from '../lng/LocalizedStrings';
// import { SafeAreaView } from 'react-native-safe-area-context';
// const { width, height } = Dimensions.get('window');

// function Productslist(props) {
//   useEffect(() => {
//   //console.log('::::::::Privious data::::::::', props.route.params.cd[0].children_data);
//    console.log('++++++++++++Categories Id+++++',props.route.params.id);
//     if(props.route.params.id.length === 0){
//       console.warn("nothing")
//     }
//     else{
//       setmyId(props.route.params.id)
//       fetchData(props.route.params.id)
//     }
   



//     // console.log("kkkkkkkkkkkkkkkkkkkk",props.route.params.cd[0].id)
//     // getDetails()
//     // totalData(props.route.params.cd)
//     // setId3(props.route.params.cd[0].id)
//   }, []);


//   const [myid,setmyId] = useState('');
//   const [cd, setcd] = useState([]);
//   const [loder, setLoder] = useState(false);
//   const [color, setcolor] = useState('');
//   const [id2, setId] = useState('');
//   const [color3, setcolor3] = useState('');
//   const [id3, setId3] = useState('');
//   const [cd2, setcd2] = useState([]);
//   const [color4, setcolor4] = useState('');
//   const [id4, setId4] = useState('');
//   const [cd4, setcd4] = useState([]);
//   const [color5, setcolor5] = useState('');
//   const [id5, setId5] = useState('');
//   const [cd5, setcd5] = useState([]);
//   const [dataa, setdataa] = useState([]);


//   const [totalData, setTotalData] = useState('');

//   const [page, setPage] = useState(1)
//   const [totalproduct, setTotalProduct] = useState('')



//   const getDetails = id => {
//     GetRequest(`categories/${props.route.params.id}`, undefined, {})
//       .then(res => {
//         // console.warn('resss', res);
//         // setLoder(false)
//         // setPrice(res.price)
//         // setId(res.id)
//         res.custom_attributes.map(item => {
//           if (item.attribute_code == 'image') {
//             setImage(item.value);
//           }
//         });
//       })

//       .catch(error => {
//         setLoder(false);
//       });
//   };

//   const fetchData = (id) => {
//     // console.warn('ididididididid', id)

//     setLoder(true);
//     GetRequest(`products?searchCriteria[currentPage]=1&searchCriteria[pageSize]=6&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}`, undefined, {}, "admin")
//       .then(res => {
//         console.log("mmmmmmmmmmmm",res.items)
//         // setState({ loder: false })
//         setLoder(false);
//         setdataa(res.items)
//         // if(res.items.length > 5){
//         //   setTotalData(true)
//         //   console.log("aa")
//         // }
//         // else{
//         //   setTotalData(false)
//         //   console.log("bbb")
//         // }
       
//         // if((res.items.visibility == 4 || res.items.visibility == 2 || res.items.visibility == 3) && res.items.status == 1){
//         //   setdataa(res.items)
//         // }
       
//         // if (res.items.length > 0) {
//         //   let fiterdCategories = res.items.filter(items => {
//         //     if (items.status == 2) {

//         //     }
//         //     else if((items.visibility == 4 || items.visibility == 2 || items.visibility == 3) && items.status == 1) {
//         //       let x = false;
//         //       items?.custom_attributes?.map(values => {
//         //         if (values?.attribute_code == 'category_ids') {
//         //           let arr = [];
//         //           // console.warn('each', values.value)
//         //           values?.value.forEach(element => {
//         //             if (id == element) {
//         //               // console.warn('elelele', element)
//         //               x = true;
//         //             }
//         //           });
//         //         }
//         //       });
//         //       return x;
//         //     }
//         //   });
//         //   // setState({ data: fiterdCategories })
//         //   setdataa(fiterdCategories);

//         // }
//       })
//       .catch(error => {
//         setLoder(false);
//         console.log('Get All Products error => ', error);
//       });
//   };



//   const getSecondfetchData = async(id) => {
//     // setLoder(true);
    
//     // GetRequest(`products?searchCriteria=`, undefined, {}, 'admin')
//     GetRequest(`products?searchCriteria[currentPage]=${page}&searchCriteria[pageSize]=6&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}`, undefined, {}, 'admin')
//         .then(res => {
         
//             console.warn("Product details responce 222222=> ", res.items);
//             setLoder(false);
//             setdataa([...dataa, ...res])
//             setPage(page+1)
            
            
//         })

//         .catch(error => {
//             setLoder(false);
//             // console.warn("Product details error => ", error);
//         });
// };
// const loadMore = () => {
//   console.log('======loadMore=>',page);
//   // if(page != 1){
//     getSecondfetchData();
//   // }
  
// };

//   onPress2 = (id, item) => {
//     //console.warn('itemmmmm111111', item.item.children_data);
//     if (item.item.children_data.length !== 0) {
//       setcd(item.item.children_data);
//       setcd2([]);
//       // fetchData(id)
//     } else 
//     // console.warn('idddddddd', id), 
//     fetchData(id);
//     // setState({ colors2: true, id2: id, loder: true })
//     setcolor(true);
//     setId(id);
//   };

//   onPress3 = (id, item) => {
//     // console.warn('itemmmmm', item);
//     if (item.item.children_data.length !== 0) {
//       setcd2(item.item.children_data);
//       // fetchData(id)
//     } else 
//     // console.warn('idddddddd'), 
//     fetchData(id);
//     // setState({ colors2: true, id2: id, loder: true })
//     setcolor3(true);
//     setId3(id);
//   };

//   onPress4 = (id, item) => {
//     // console.warn('itemmmmm', item);
//     if (item.item.children_data.length !== 0) {
//       setcd4(item.item.children_data);
//       // fetchData(id)
//     } else 
//     // console.warn('idddddddd'), 
//     fetchData(id);
//     // setState({ colors2: true, id2: id, loder: true })
//     setcolor4(true);
//     setId4(id);
//   };

//   onPress5 = (id, item) => {
//     // console.warn('itemmmmm', item);
//     if (item.item.children_data.length !== 0) {
//       setcd5(item.item.children_data);
//       // fetchData(id)
//     } else 
//     // console.warn('idddddddd'), 
//     fetchData(id);
//     // this.setState({ colors2: true, id2: id, loder: true })
//     setcolor5(true);
//     setId5(id);
//   };

//   const renderItem3 = item => {
//     //console.warn('+++++++++++++++++subcategories+++++++++++++++++++++++', item);
//     return (
//       <TouchableOpacity onPress={() => onPress2(item.item.id, item)}>
//         <View
//           style={{
//             borderWidth: 1, margin: 5, padding: 5, marginTop: 10,
//             backgroundColor:
//               item.item.id == id2 && color == true ? '#FDB833' : '#fff',
//           }}>
//           <Text
//             numberOfLines={2}
//             style={{
//               color: item.item.id == id2 && color == true ? '#fff' : '#000', paddingVertical: 2,
//             }}>
//             {item.item.name}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//  const renderItem4 = item => {
//     // console.warn('item', item);
//     return (
//       <TouchableOpacity onPress={() => onPress3(item.item.id, item)}>
//         <View
//           style={{
//             borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

//             backgroundColor:
//               item.item.id == id3 && color3 == true ? '#FDB833' : '#fff',
//           }}>
//           <Text
//             numberOfLines={2}
//             style={{
//               color: item.item.id == id3 && color3 == true ? '#fff' : '#000',
//             }}>
//             {item.item.name}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   renderItem5 = item => {
//     // console.warn('item', item);
//     return (
//       <TouchableOpacity onPress={() => onPress4(item.item.id, item)}>
//         <View
//           style={{
//             borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

//             backgroundColor:
//               item.item.id == id4 && color4 == true ? '#FDB833' : '#fff',
//           }}>
//           <Text
//             numberOfLines={2}
//             style={{
//               color: item.item.id == id4 && color4 == true ? '#fff' : '#000',
//             }}>
//             {item.item.name}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   renderItem6 = item => {
//     // console.warn('item', item);
//     return (
//       <TouchableOpacity onPress={() => onPress5(item.item.id, item)}>
//         <View
//           style={{
//             borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

//             backgroundColor:
//               item.item.id == id5 && color5 == true ? '#FDB833' : '#fff',
//           }}>
//           <Text
//             numberOfLines={2}
//             style={{
//               color: item.item.id == id5 && color5 == true ? '#fff' : '#000',
//             }}>
//             {item.item.name}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const renderItem = item => {
//     let img = '';
//     {
//       item.item.custom_attributes.map(item => {
//         if (item.attribute_code == 'image') {
//           img = item.value;
//         }
//       });
//     }
//     let description = '';
//     {
//       item.item.custom_attributes.map(item => {
//         if (item.attribute_code == 'meta_description') {
//           description = item.value;
//         }
//       });
//     }
//     return (
//       <View style={{ width: width*0.47, }}>
//         <TouchableOpacity
//           onPress={() =>
//             props.navigation.navigate('ProductDetails', {
//               id: item.item.id,
//               image: img,
//               name: item.item.name,
//               description: description,
//               price: item.item.price,
//               sku: item.item.sku,
//             })
//           }>
//           <View
//             style={[
//               {
//                 backgroundColor: '#FFFFFF',
//                 borderRadius: 10,
//                 marginVertical: 15,
//                 marginRight: 15,
//                 elevation: 5
//               },
//             ]}>
//             <Image
//               source={{
//                 uri: img
//                   ? `https://traders-platform.com/pub/media/catalog/product${img}`
//                   : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
//               }}
//               resizeMode="contain"
//               style={{ width: 130, height: 120, marginHorizontal: 5, alignSelf: 'center', marginVertical: 5 }}
//             />

//             <View
//               style={{
//                 flexDirection: 'row',
//                 paddingHorizontal: 5,
//                 paddingVertical: 5,
//               }}>
//               <View style={{ paddingRight: 5, paddingVertical: 5 }}>
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     color: '#000',
//                     fontSize: 14,
//                     fontFamily: 'Roboto-Bold',
//                   }}>
//                   {item.item.name}
//                 </Text>

//                 {item.item.custom_attributes.map(item => {
//                   if (item.attribute_code == 'meta_description') {
//                     const description = item.value;
//                     return (
//                       <Text
//                         numberOfLines={1}
//                         style={{
//                           color: '#676767',
//                           fontSize: 12,
//                           fontFamily: 'Roboto-Regular',
//                         }}>
//                         {description}
//                       </Text>
//                     );
//                   }
//                 })}
//               </View>
//               <View style={{ alignItems: 'flex-end', paddingVertical: 5 }}>
//                 <Text
//                   numberOfLines={1}
//                   style={{
//                     color: '#676767',
//                     fontSize: 12,
//                     fontFamily: 'Roboto-Regular',
//                   }}>
//                   {item.item.number}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         title={props.route.params.name}
//         navigation={props.navigation}
//         icon="back"
//       />

//       <View style={{ marginHorizontal: 10 }}>
//         {props.route.params.cd ? (
//           <FlatList
//             data={props.route.params.cd}
//             horizontal
//             keyExtractor={(item, index) => item.id}
//             renderItem={item => renderItem3(item)}
//             scrollEnabled={true}
//           />
//         ) : null}
//         {cd.length !== 0 ? (
//           <FlatList
//             data={cd}
//             horizontal
//             keyExtractor={(item, index) => item.id}
//             renderItem={item => renderItem4(item)}
//             scrollEnabled={true}
//           />
//         ) : null}
//         {cd2.length !== 0 ? (
//           <FlatList
//             data={cd2}
//             horizontal
//             keyExtractor={(item, index) => item.id}
//             renderItem={item => renderItem5(item)}
//             scrollEnabled={true}
//           />
//         ) : null}
//         {cd5.length !== 0 ? (
//           <FlatList
//             data={cd5}
//             horizontal
//             keyExtractor={(item, index) => item.id}
//             renderItem={item => renderItem6(item)}
//             scrollEnabled={true}
//           />
//         ) : null}
       
//       </View>

//       <View>
//                 <Text style={{marginHorizontal: 25,fontSize:16,color:'#000',marginTop:15,}}>
//                 {dataa.length} ITEMS
//                 </Text>
//                 </View>



//       <View style={{ flex: 1, paddingHorizontal: 20 }}>  
//         {dataa.length !== 0 ? (
        
// <View style={{
//   //height:height*0.8, 
//                 width: width / 1.07,
//                 alignSelf: 'center', 
//                 marginTop: 0, 
//                 //marginBottom: 100,
//                 //backgroundColor:'red', 
//                 // height: height*0.95,

// }}>
//   {/* {totalData ?  */}
  
//           <FlatList
//             data={dataa}
//             numColumns={2}
//             style={{ marginTop: 10 }}
//             contentContainerStyle={{ paddingBottom: '5%' }}
      
//             keyExtractor={(item, index) => item.id}
//             renderItem={item => renderItem(item)}
//             scrollEnabled={true}

//             onEndReachedThreshold ={1}
//             onEndReached={()=>loadMore()}
//           /> 
          
       
//           </View>
           
//         ) : (
//           <View style={{ alignItems: 'center', marginTop: 150 }}>
//             <Text style={{ fontSize: 18, color: '#000' }}> {strings.Select_Categories}</Text>
//           </View>

//         )}
//       </View>
    



//       {loder && <Loder />}
//     </View >
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // marginBottom: height / 6

//     // justifyContent: 'center',
//     // alignItems: 'center',
//   },
//   img: { width: 40, height: 40 },
//   card: { padding: 10, borderRadius: 5, marginRight: 10 },
// });

// export default Productslist;



import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import { GetRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import strings from '../lng/LocalizedStrings';
import { SafeAreaView } from 'react-native-safe-area-context';
const { width, height } = Dimensions.get('window');

function Productslist(props) {
  useEffect(() => {
  //console.log('::::::::Privious data::::::::', props.route.params.cd[0].children_data);
   console.log('++++++++++++Categories Id+++++',props.route.params.id);
    if(props.route.params.id.length === 0){
      console.warn("nothing")
    }
    else{
      setmyId(props.route.params.id)
      fetchData(props.route.params.id)
      //getSecondfetchData(props.route.params.id)
    }
   



    // console.log("kkkkkkkkkkkkkkkkkkkk",props.route.params.cd[0].id)
    // getDetails()
    // totalData(props.route.params.cd)
    // setId3(props.route.params.cd[0].id)
  }, []);


  const [myid,setmyId] = useState('');
  const [cd, setcd] = useState([]);
  const [loder, setLoder] = useState(false);
  const [color, setcolor] = useState('');
  const [id2, setId] = useState('');
  const [color3, setcolor3] = useState('');
  const [id3, setId3] = useState('');
  const [cd2, setcd2] = useState([]);
  const [color4, setcolor4] = useState('');
  const [id4, setId4] = useState('');
  const [cd4, setcd4] = useState([]);
  const [color5, setcolor5] = useState('');
  const [id5, setId5] = useState('');
  const [cd5, setcd5] = useState([]);
  const [dataa, setdataa] = useState([]);


  const [totalData, setTotalData] = useState('');

  const [page, setPage] = useState(1)
  const [totalproduct, setTotalProduct] = useState('')

  const [subid,setSubId] = useState('');

  const getDetails = id => {
    GetRequest(`categories/${props.route.params.id}`, undefined, {})
      .then(res => {
        // console.warn('resss', res);
        // setLoder(false)
        // setPrice(res.price)
        // setId(res.id)
        res.custom_attributes.map(item => {
          if (item.attribute_code == 'image') {
            setImage(item.value);
          }
        });
      })

      .catch(error => {
        setLoder(false);
      });
  };

  const fetchData = (id) => {
     console.warn('ididididididid', id)
     setdataa([])
    setLoder(true);
    GetRequest(`products?searchCriteria[currentPage]=${page}&searchCriteria[pageSize]=6&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}`, undefined, {}, "admin")
      .then(res => {
        console.log("mmmmmmmmmmmm",res.items)
        // setState({ loder: false })
        setLoder(false);
        setdataa(res.items)
        setSubId(id)
        //getSecondfetchData(id);
        
      })
      .catch(error => {
        setLoder(false);
        console.log('Get All Products error => ', error);
      });
  };



  const getSecondfetchData = async(id,subid) => {
    // setLoder(true);
    //setPage(page+1)
    console.warn('++++++Second Id+++++', id)
    // GetRequest(`products?searchCriteria=`, undefined, {}, 'admin')
    GetRequest(`products?searchCriteria[currentPage]=${page}&searchCriteria[pageSize]=6&searchCriteria[filter_groups][0][filters][0][field]=category_id&searchCriteria[filter_groups][0][filters][0][value]=${id}`, undefined, {}, 'admin')
        .then(res => {
         
            console.warn("Product details responce 222222=> ", res.items);
            setLoder(false);
            setdataa([...dataa, ...res.items])
            setPage(page+1)
            
            
        })

        .catch(error => {
            setLoder(false);
            // console.warn("Product details error => ", error);
        });
};
const loadMore = () => {
  console.log('===LoadMore===Page_Number=>',page);
  getSecondfetchData(subid);
  // if(page != 1){
   
  // }
  
};

  onPress2 = (id, item) => {
    console.warn('First CLick=============', item.item.children_data);
    if (item.item.children_data.length !== 0) {
      setcd(item.item.children_data);
      setcd2([]);
      // fetchData(id)
    } else 
    // console.warn('idddddddd', id), 
    fetchData(id);
    //getSecondfetchData(id);
    // setState({ colors2: true, id2: id, loder: true })
    setcolor(true);
    setId(id);
  };

  onPress3 = (id, item) => {
    // console.warn('itemmmmm', item);
    if (item.item.children_data.length !== 0) {
      setcd2(item.item.children_data);
      // fetchData(id)
    } else 
    // console.warn('idddddddd'), 
    fetchData(id);
    //getSecondfetchData(id);
    // setState({ colors2: true, id2: id, loder: true })
    setcolor3(true);
    setId3(id);
  };

  onPress4 = (id, item) => {
    // console.warn('itemmmmm', item);
    if (item.item.children_data.length !== 0) {
      setcd4(item.item.children_data);
      // fetchData(id)
    } else 
    // console.warn('idddddddd'), 
    fetchData(id);
    //getSecondfetchData(id);
    // setState({ colors2: true, id2: id, loder: true })
    setcolor4(true);
    setId4(id);
  };

  onPress5 = (id, item) => {
    // console.warn('itemmmmm', item);
    if (item.item.children_data.length !== 0) {
      setcd5(item.item.children_data);
      // fetchData(id)
    } else 
    // console.warn('idddddddd'), 
    fetchData(id);
    //getSecondfetchData(id);
    // this.setState({ colors2: true, id2: id, loder: true })
    setcolor5(true);
    setId5(id);
  };

  const renderItem3 = item => {
    //console.warn('+++++++++++++++++subcategories+++++++++++++++++++++++', item);
    return (
      <TouchableOpacity onPress={() => onPress2(item.item.id, item)}>
        <View
          style={{
            borderWidth: 1, margin: 5, padding: 5, marginTop: 10,
            backgroundColor:
              item.item.id == id2 && color == true ? '#FDB833' : '#fff',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: item.item.id == id2 && color == true ? '#fff' : '#000', paddingVertical: 2,
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

 const renderItem4 = item => {
    // console.warn('item', item);
    return (
      <TouchableOpacity onPress={() => onPress3(item.item.id, item)}>
        <View
          style={{
            borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

            backgroundColor:
              item.item.id == id3 && color3 == true ? '#FDB833' : '#fff',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: item.item.id == id3 && color3 == true ? '#fff' : '#000',
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem5 = item => {
    // console.warn('item', item);
    return (
      <TouchableOpacity onPress={() => onPress4(item.item.id, item)}>
        <View
          style={{
            borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

            backgroundColor:
              item.item.id == id4 && color4 == true ? '#FDB833' : '#fff',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: item.item.id == id4 && color4 == true ? '#fff' : '#000',
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderItem6 = item => {
    // console.warn('item', item);
    return (
      <TouchableOpacity onPress={() => onPress5(item.item.id, item)}>
        <View
          style={{
            borderWidth: 1, margin: 5, padding: 5, marginTop: 10,

            backgroundColor:
              item.item.id == id5 && color5 == true ? '#FDB833' : '#fff',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color: item.item.id == id5 && color5 == true ? '#fff' : '#000',
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = item => {
    let img = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'image') {
          img = item.value;
        }
      });
    }
    let description = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'meta_description') {
          description = item.value;
        }
      });
    }
    return (
      <View style={{ width: width*0.47, }}>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('ProductDetails', {
              id: item.item.id,
              image: img,
              name: item.item.name,
              description: description,
              price: item.item.price,
              sku: item.item.sku,
            })
          }>
          <View
            style={[
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                marginVertical: 15,
                marginRight: 15,
                elevation: 5
              },
            ]}>
            <Image
              source={{
                uri: img
                  ? `https://traders-platform.com/pub/media/catalog/product${img}`
                  : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              }}
              resizeMode="contain"
              style={{ width: 130, height: 120, marginHorizontal: 5, alignSelf: 'center', marginVertical: 5 }}
            />

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View style={{ paddingRight: 5, paddingVertical: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#000',
                    fontSize: 14,
                    fontFamily: 'Roboto-Bold',
                  }}>
                  {item.item.name}
                </Text>

                {item.item.custom_attributes.map(item => {
                  if (item.attribute_code == 'meta_description') {
                    const description = item.value;
                    return (
                      <Text
                        numberOfLines={1}
                        style={{
                          color: '#676767',
                          fontSize: 12,
                          fontFamily: 'Roboto-Regular',
                        }}>
                        {description}
                      </Text>
                    );
                  }
                })}
              </View>
              <View style={{ alignItems: 'flex-end', paddingVertical: 5 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: '#676767',
                    fontSize: 12,
                    fontFamily: 'Roboto-Regular',
                  }}>
                  {item.item.number}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={props.route.params.name}
        navigation={props.navigation}
        icon="back"
      />

      <View style={{ marginHorizontal: 10 }}>
        {props.route.params.cd ? (
          <FlatList
            data={props.route.params.cd}
            horizontal
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem3(item)}
            scrollEnabled={true}
          />
        ) : null}
        {cd.length !== 0 ? (
          <FlatList
            data={cd}
            horizontal
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem4(item)}
            scrollEnabled={true}
          />
        ) : null}
        {cd2.length !== 0 ? (
          <FlatList
            data={cd2}
            horizontal
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem5(item)}
            scrollEnabled={true}
          />
        ) : null}
        {cd5.length !== 0 ? (
          <FlatList
            data={cd5}
            horizontal
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem6(item)}
            scrollEnabled={true}
          />
        ) : null}
       
      </View>

      <View>
                <Text style={{marginHorizontal: 25,fontSize:16,color:'#000',marginTop:15,}}>
                {dataa.length} ITEMS
                </Text>
                </View>



      <View style={{ flex: 1, paddingHorizontal: 20 }}>  
        {dataa.length !== 0 ? (
        
<View style={{
                //height:height*0.75, 
                width: width / 1.07,
                alignSelf: 'center', 
                marginTop: 0, 
                //marginBottom: 100,
                //backgroundColor:'red', 
                // height: height*0.95,

}}>
 
  
          <FlatList
            data={dataa}
            numColumns={2}
            style={{ marginTop: 10 }}
            contentContainerStyle={{ paddingBottom: '5%' }}
      
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem(item)}
            scrollEnabled={true}

            onEndReachedThreshold ={0.5}
            onEndReached={()=>loadMore()}
          /> 
          
       
          </View>
           
        ) : (
          <View style={{ alignItems: 'center', marginTop: 150 }}>
            <Text style={{ fontSize: 18, color:'#000' }}> {strings.Select_Categories}</Text>
          </View>

        )}
      </View>
    



      {loder && <Loder />}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginBottom: height / 6

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  img: { width: 40, height: 40 },
  card: { padding: 10, borderRadius: 5, marginRight: 10 },
});
export default Productslist;

