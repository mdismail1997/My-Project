import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import {GetRequest} from '../../Services/ApiFunctions';
import Loder from '../../Component/Common/Lodar';

function TrendingCollection(props) {
  useEffect(() => {
    // console.warn("props", props)
    getDetails();
  }, []);

  const getDetails = id => {
    setLoder(true);
    GetRequest(`products/${props.item.item.sku}`, undefined, {}, 'admin')
      .then(res => {
        setLoder(false);
        // console.warn("Product details responce => ", res);
        setname(res.name);
        setPrice(res.price);

        res.custom_attributes.map(item => {
          if (item.attribute_code == 'image') {
            setImage(item.value);
          }
        });
        res.custom_attributes.map(item => {
          if (item.attribute_code == 'meta_description') {
            setDescription(item.value);
          }
        });

        // const images = []
        // res.media_gallery_entries.map((item, index) => {

        //     if (item.media_type == 'image') {
        //         images.push(item)
        //     }
        // })

        // // console.warn('images', images)
        // if (images == '') {
        //     // console.warn(true)

        // } else {
        //     this.setState({
        //         smallImg: images[0].file,
        //         smallImg2: images.length <= 1 ? null : images[1].file,
        //         smallImg3: images.length <= 2 ? null : images[2].file,
        //     })
        // }
        // this.setState({ data: res })
        // console.warn('heyy', res.media_gallery_entries)
        // console.warn(res.custom_attributes)
      })

      .catch(error => {
        setLoder(false);
        // console.warn("Product details error => ", error);
      });
  };
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [data, setData] = useState([]);
  const [price, setPrice] = useState('');
  const [name, setname] = useState('');
  const [loder, setLoder] = useState(false);

  return (
    <View>
      {/* {props == {} ? <Text>ghkgkg</Text> : */}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('ProductDetails', {
            fromScreen: 'Trendingcollection',
            id: props.item.item.id,
            image: image,
            name: name,
            description: description,
            price: price,
            sku: props.item.item.sku,
          });
        }}
        style={[
          {
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            width: 150,
            marginVertical: 20,
            marginRight: 15,
          },
        ]}>
        <Image
          source={{
            uri: image
              ? `https://traders-platform.com/pub/media/catalog/product${image}`
              : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
          }}
          resizeMode="cover"
          style={{width: 150, height: 130, borderRadius: 10}}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}>
          <View style={{flex: 1, paddingRight: 5, paddingVertical: 5}}>
            <Text
              numberOfLines={1}
              style={{color: '#000', fontSize: 14, fontFamily: 'Roboto-Bold'}}>
              {name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: '#676767',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
              }}>
              {description}
            </Text>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end', paddingVertical: 5}}>
            <Text
              numberOfLines={1}
              style={{
                color: '#676767',
                fontSize: 12,
                fontFamily: 'Roboto-Regular',
              }}>
              AED {price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* } */}
      {/* {loder && <Loder />} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TrendingCollection;
