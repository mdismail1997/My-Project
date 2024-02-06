import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Loder from '../../Component/Common/Lodar';
import Header from '../../Component/Header/Header';
import {GetRequest} from '../../Services/ApiFunctions';

export default class HomeKitchen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      data: [],
      cartToken: '',
      count: 0,
      loder: false,
      image: '',
      fashionData: [
        {name: 'Bed dressing and cover', id: 77},
        {name: 'Kitchenette', id: 78},
      ],
      colors: false,
      id: '',
    };
  }

  componentDidMount = async () => {
    this.setState({loder: true});
    this.allProducts();
  };

  allProducts = () => {
    GetRequest('products?searchCriteria=', undefined, {}, 'admin')
      .then(res => {
        console.warn('res', res);
        this.setState({loder: false});
        if (res.items.length > 0) {
          let fiterdCategories = res.items.filter(items => {
            if (items.status == 2) {
            } else if (items.visibility == 4 || items.status == 1) {
              let x = false;
              items?.custom_attributes?.map(values => {
                if (values?.attribute_code == 'category_ids') {
                  let arr = [];
                  // console.warn('each', values.value)
                  values?.value.forEach(element => {
                    if (element == 193) {
                      x = true;
                    }
                  });
                }
              });
              return x;
            }
          });
          // console.warn('fiterdCategories', fiterdCategories.length)
          this.setState({data: fiterdCategories});
        }
      })
      .catch(error => {
        this.setState({loder: false});
        console.warn('Get All Products error => ', error);
      });
  };

  renderItem = item => {
    let img = '';
    {
      item.item.custom_attributes.map(item => {
        if (item.attribute_code == 'image') {
          img = item.value;
        }
      });
    }
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('ProductDetails', {
              id: item.item.id,
              sku: item.item.sku,
            })
          }>
          <View
            style={[
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 10,
                width: 150,
                marginVertical: 15,
                marginRight: 15,
              },
            ]}>
            <Image
              source={{
                uri: img
                  ? `https://magento.mydevfactory.com/backup_tradersplatform/pub/media/catalog/product${img}`
                  : 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg',
              }}
              resizeMode="contain"
              style={{width: 160, height: 200}}
            />

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 5,
                paddingVertical: 5,
              }}>
              <View style={{paddingRight: 5, paddingVertical: 5}}>
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
              <View style={{alignItems: 'flex-end', paddingVertical: 5}}>
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

  fetchData = id => {
    this.setState({
      loder: true,
    });
    GetRequest('products?searchCriteria=', undefined, {}, 'admin')
      .then(res => {
        this.setState({loder: false});
        if (res.items.length > 0) {
          let fiterdCategories = res.items.filter(items => {
            // if (items.status == 2) {

            // }
            if (items.visibility == 4 || items.status == 1) {
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
          // console.warn('fiterdCategories', fiterdCategories.length)
          this.setState({data: fiterdCategories});
        }
      })
      .catch(error => {
        this.setState({loder: false});
        console.log('Get All Products error => ', error);
      });
  };

  onPress = id => {
    this.setState({colors: true, id: id, loder: true});
    this.fetchData(id);
    console.warn('iddd', id);
  };

  renderItem2 = item => {
    // console.warn('item', item)
    return (
      <TouchableOpacity onPress={() => this.onPress(item.item.id)}>
        <View
          style={{
            borderWidth: 1,
            margin: 5,
            padding: 10,
            backgroundColor:
              item.item.id == this.state.id && this.state.colors == true
                ? '#FDB833'
                : '#fff',
          }}>
          <Text
            numberOfLines={2}
            style={{
              color:
                item.item.id == this.state.id && this.state.colors == true
                  ? '#fff'
                  : '#000',
            }}>
            {item.item.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Header
          title="Home & Kitchen"
          navigation={this.props.navigation}
          icon="menu"
        />

        <View style={{margin: 20, marginTop: 30}}>
          <FlatList
            data={this.state.fashionData}
            horizontal
            keyExtractor={(item, index) => item.id}
            renderItem={item => this.renderItem2(item)}
            scrollEnabled={true}
          />

          {this.state.data.length !== 0 ? (
            <FlatList
              data={this.state.data}
              numColumns={2}
              keyExtractor={(item, index) => item.id}
              renderItem={item => this.renderItem(item)}
              scrollEnabled={true}
            />
          ) : (
            <View style={{alignItems: 'center', marginTop: 150}}>
              <Text style={{fontSize: 18}}>No products : (</Text>
            </View>
          )}
        </View>
        {this.state.loder && <Loder />}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
});
