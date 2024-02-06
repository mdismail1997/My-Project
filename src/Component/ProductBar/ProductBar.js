import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { GetRequest, FetchRequest } from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';
import Device from 'react-native-device-info';
import FastImage from 'react-native-fast-image';

const { width, height } = Dimensions.get('window');

function ProductBar(props) {
  useEffect(() => {
    getDetails();
    const isTablet = Device.isTablet();
    // console.warn('isTablet', isTablet)
    if (isTablet == true) {
      setIsTablet(true)
    }
    // console.warn('propssssssssssssssssssssssssssssssss', props.item.id);
    
  }, []);

  const [image, setImage] = useState('');
  const [loder, setLoder] = useState(false);
  const [price, setPrice] = useState('');
  const [id, setId] = useState('');
  const [issTablet, setIsTablet] = useState(false)


  const getDetails = id => {
    GetRequest(`categories/${props.item.id}`, undefined, {}, 'admin')
      .then(res => {
        console.warn('++++++++++++++++Categories InFormation++++++++++++', res);
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

  return (
    <View>

      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Productslist', {
            id: props.item.id,
            name: props.item.name,
            cd: props.item.children_data ? props.item.children_data : '',
            children: props.item.children? props.item.children : '',
          })
        }}
        style={{}}>
        <Image
          source={{
            uri: image
              ? `https://traders-platform.com/pub/media/catalog/category/${image}`
              : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
          }}
          style={{ width: issTablet == true ? width / 1.03 : width / 1.06, height: 100, opacity: 0.8, borderRadius: 10, elevation: 5 }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {loder && <Loder />}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  img: { width: 40, height: 40 },
  card: { padding: 10, borderRadius: 5, marginRight: 10 },
});

export default ProductBar;
