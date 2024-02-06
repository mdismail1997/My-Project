import React, { Component } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import Menu from '../Screens/Menu/Menu';
import { Dimensions } from 'react-native';
import { GetRequest } from '../Services/ApiFunctions';

const width = Dimensions.get('screen').width;

const Drawer = createDrawerNavigator();

export default class DrawerNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
      name: '',
      image: '',
    };
  }
  componentDidMount = () => {
    this.profileData();
    console.log('navigation', this.props);
    this.willFocusSubscription = this.props.navigation.addListener(
      'focus',
      async () => {
        this.profileData();
      },
    );
  };

  componentWillUnmount() {
    this.willFocusSubscription();
  }

  profileData = () => {
    GetRequest('customers/me/', undefined, {}, 'self')
      .then(res => {
        console.log('Profile responce Drawer => ', res);
        this.setState({ name: res?.firstname });
        res?.custom_attributes?.map(item => {
          if (item?.attribute_code == 'avatar') {
            this.setState({ image: item?.value });
          }
        });
      })
      .catch(error => {
        console.log('Profile error => ', error);
      });
  };

  render() {
    return (
      <Drawer.Navigator
        initialRouteName="Tab"
        screenOptions={{ headerShown: false, drawerStyle: { width: width - 50 } }}
        drawerContent={props => <Menu {...props} image={this.state.image} />}>
        <Drawer.Screen name="Tab" component={TabNavigator} />
      </Drawer.Navigator>
    );
  }
}
