import {StyleSheet, View, SafeAreaView, Image, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Header} from '../../components/Header/Header';
import {styles} from '../Invitescreen/styles';
import {Card, Paragraph, Text, Title} from 'react-native-paper';
import {COLORS} from '../../utils/Const';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCategoryListAction,
  getSubCategoryListAction,
} from '../../Redux/actions/HomeAction';
import Loader from '../../components/Loader';

const ProfileView = props => {
  const detailsView = props.route.params.details;
  const [category, setcategory] = useState();
  const categoryList = useSelector(state => state.Home.categoryList);
  const isLoading = useSelector(state => state.Home.isLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getCategoryListAction());

      setcategory(detailsView.occupation.map(e => e.category));
    });
    return createjobDetails;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}) => (
    
    <Card
      style={{
        height: '65%',
        marginRight: 12,
      }}>
        {console.log("item", item)}
      <Card.Content>
        <Image
          source={{uri: item.icon}}
          style={{width: wp(75), height: hp(75)}}
          resizeMode={'contain'}
        />
        <Paragraph numberOfLines={2}>{`${item.name
          .charAt(0)
          .toUpperCase()}${item.name.slice(1)}`}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={{backgroundColor: COLORS.WHITE, flex: 1, padding: 12}}>
      {isLoading && <Loader />}
      <Header
        {...props}
        title={`${detailsView.firstname} ${detailsView.lastname}`}
      />
      <View style={{padding: 12}}>
        <View style={styles.profileImgContainer}>
          <Image
            source={
              detailsView.profileimage !== null
                ? {uri: detailsView.profileimage}
                : require('../../Assets/userimage.png')
            }
            style={styles.profileImageStyle}
          />
        </View>
        <View style={{alignItems: 'center'}}>
          <Title>{`${detailsView.firstname} ${detailsView.lastname}`}</Title>
          <Text variant="displaySmall" style={{color: COLORS.NICKEL}}>
            {detailsView.email}
          </Text>
          <Paragraph>{`+${detailsView.phone_number}`}</Paragraph>
        </View>
        <Title style={{fontSize: wp(18)}}>Service Provided</Title>
      </View>
      <FlatList
        style={{margin: hp(15)}}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={categoryList?.filter(
          e => detailsView?.occupation[0]?.category?._id === e._id,
        )}
        renderItem={renderItem}
      />
      {console.log(
        'detailsView',

        detailsView
      )}
    </SafeAreaView>
  );
};

export default ProfileView;
