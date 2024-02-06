import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Header from '../../Component/Header/Header';
import {Input} from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {GetRequest} from '../../Services/ApiFunctions';
import {FlatList} from 'react-native-gesture-handler';
import TrendingCollection from '../../Component/Collections/TrendingCollection';

export default function AllCategory({navigation}) {
  useEffect(() => {
    profileData();
    profileData2();
  }, []);

  const profileData = () => {
    GetRequest('categories/51/products', undefined, {}, 'admin')
      .then(res => {
        // console.warn("Profile responce => ", res);
        setData(res);
      })
      .catch(error => {
        // console.warn("Profile error => ", error);
      });
  };

  const profileData2 = () => {
    GetRequest('categories/45/products', undefined, {}, 'admin')
      .then(res => {
        // console.warn("Profile responce => ", res);
        setData2(res);
      })
      .catch(error => {
        // console.warn("Profile error => ", error);
      });
  };
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [search, setSearch] = useState('');

  const renderItem = item => {
    console.log('item', item);
    return <TrendingCollection item={item} />;
  };

  const renderItem2 = item => {
    // console.warn('item', item)
    return <TrendingCollection item={item} />;
  };

  return (
    <View style={styles.container}>
      <Header title="Home" navigation={navigation} icon="menu" />
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            marginTop: 30,
            color: '#5A5A5F',
            fontFamily: 'Roboto-Bold',
            fontSize: 20,
          }}>
          Trending Collection
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />

        <Text
          style={{color: '#5A5A5F', fontFamily: 'Roboto-Bold', fontSize: 20}}>
          Watches and Jewelery
        </Text>
        <FlatList
          data={data}
          horizontal
          // numColumns={2}
          keyExtractor={(item, index) => item.id}
          renderItem={item => renderItem2(item)}
          scrollEnabled={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
