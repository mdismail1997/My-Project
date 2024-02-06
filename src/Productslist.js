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
    // console.log('propssssssssssssssssssssssssssssssss1233333333333', props.route.params.cd[0].id);
   console.log('propsIDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',props.route.params.id);
    if(props.route.params.id.length === 0){
      console.warn("nothing")
    }
    else{
      
      fetchData(props.route.params.id)
    }
   



    // console.log("kkkkkkkkkkkkkkkkkkkk",props.route.params.cd[0].id)
    // getDetails()
    // totalData(props.route.params.cd)
    // setId3(props.route.params.cd[0].id)
  }, []);



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

  const fetchData = id => {
    // console.warn('ididididididid', id)

    setLoder(true);
    GetRequest('products?searchCriteria=', undefined, {}, "admin")
      .then(res => {
        // console.log("mmmmmmmmmmmm",res.items)
        // setState({ loder: false })
        setLoder(false);
        if (res.items.length > 0) {
          let fiterdCategories = res.items.filter(items => {
            if (items.status == 2) {

            }
            else if((items.visibility == 4 || items.visibility == 2 || items.visibility == 3) && items.status == 1) {
              let x = false;
              items?.custom_attributes?.map(values => {
                if (values?.attribute_code == 'category_ids') {
                  let arr = [];
                  // console.warn('each', values.value)
                  values?.value.forEach(element => {
                    if (id == element) {
                      // console.warn('elelele', element)
                      x = true;
                    }
                  });
                }
              });
              return x;
            }
          });
          // setState({ data: fiterdCategories })
          setdataa(fiterdCategories);

        }
      })
      .catch(error => {
        setLoder(false);
        console.log('Get All Products error => ', error);
      });
  };

  onPress2 = (id, item) => {
    // console.warn('itemmmmm', item);
    if (item.item.children_data.length !== 0) {
      setcd(item.item.children_data);
      setcd2([]);
      // fetchData(id)
    } else 
    // console.warn('idddddddd', id), 
    fetchData(id);
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
    // this.setState({ colors2: true, id2: id, loder: true })
    setcolor5(true);
    setId5(id);
  };

  renderItem3 = item => {
    // console.warn('item', item);
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
      <View style={{ width: width / 2, }}>
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
        {/* <SafeAreaView style={{ marginBottom: height / 6 }}> */}
      </View>

      <View>
                <Text style={{marginHorizontal: 25,fontSize:16,color:'#000',marginTop:15,}}>
                {dataa.length} ITEMS
                </Text>
                </View>



      <View>
        {dataa.length !== 0 ? (
          <FlatList
            data={dataa}
            numColumns={2}
            keyExtractor={(item, index) => item.id}
            renderItem={item => renderItem(item)}
            scrollEnabled={true}
          />
        ) : (
          <View style={{ alignItems: 'center', marginTop: 150 }}>
            <Text style={{ fontSize: 18, color: '#000' }}>{strings.NO_PRODUCTS}</Text>
          </View>
        )}
      </View>
      {/* </SafeAreaView> */}



      {loder && <Loder />}
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: height / 6

    // justifyContent: 'center',
    // alignItems: 'center',
  },
  img: { width: 40, height: 40 },
  card: { padding: 10, borderRadius: 5, marginRight: 10 },
});

export default Productslist;
