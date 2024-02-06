import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {GetRequest} from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';

function CartItem(props) {
  useEffect(() => {
    // if (props.loder == true) {
    //     setLoder(true)
    // }
    // console.warn('propssssssssssssssssssssssssssssssss', props.item.sku);
    getDetails();
  }, []);

  const [image, setImage] = useState('');
  const [loder, setLoder] = useState(false);
  const [price, setPrice] = useState('');
  const [id, setId] = useState('');

  const getDetails = id => {
    GetRequest(`products/${props.item.sku}`, undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        setPrice(res.price);
        setId(res.id);
        res.custom_attributes.map(item => {
          if (item.attribute_code == 'image') {
            setImage(item.value);
          }
        });
      })

      .catch(error => {
        console.warn('er', error);
        setLoder(false);
      });
  };

  return (
    // console.warn(
    //   'image',
    //   `https://magento.mydevfactory.com/backup_tradersplatform/pub/media/catalog/product${image}`,
    // ),
    (
      <View>
        {props.fm ? (
          <TouchableOpacity onPress={() => {}} style={{margin: 5}}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 5,
                marginRight: 10,
                width: 160,
                elevation: 5,
              }}>
              {/* <Image source={require('../../Assets/frut.png')} resizeMode="cover" style={{ width: 160, height: 100, borderRadius: 5 }} /> */}
              <Image
                source={{
                  uri: image
                    ? `https://traders-platform.com/pub/media/catalog/product${image}`
                    : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
                }}
                resizeMode="cover"
                style={{width: 160, height: 100, borderRadius: 5}}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                }}>
                <View style={{flex: 1}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      fontSize: 14,
                      fontFamily: 'Roboto-Bold',
                      flexShrink: 1,
                      flexWrap: 'wrap',
                    }}>
                    {props.item.sku}
                  </Text>
                </View>
                <View style={{}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#676767',
                      fontSize: 10,
                      fontFamily: 'Roboto-Regular',
                      textDecorationLine: 'line-through',
                    }}>
                    AED {price}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: '#000',
                      fontSize: 12,
                      fontFamily: 'Roboto-Bold',
                    }}>
                    AED {price}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ) : props.fromScreen ? (
          <Image
            source={{
              uri: image
                ? `https://traders-platform.com/pub/media/catalog/product${image}`
                : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
            }}
            resizeMode="contain"
            style={{width: 50, height: 50, borderRadius: 5}}
          />
        ) : (
          <Image
            source={{
              uri: image
                ? `https://traders-platform.com/pub/media/catalog/product${image}`
                : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
            }}
            resizeMode="contain"
            style={{width: 110, height: 150, borderRadius: 5}}
          />
        )}
        {loder && <Loder />}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartItem;
