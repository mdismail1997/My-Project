import React, { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/Header/Header';
import { getCategoryListAction } from '../../Redux/actions/HomeAction';
import { Avatar, Card, IconButton, Paragraph, Title } from 'react-native-paper';
import { hp, wp } from '../../utils/ResponsiveLayout';
import { COLORS } from '../../utils/Const';
import SearchComp from '../../components/SearchComp';

const CategoryListing = props => {


  const [value, setValue] = useState('');
  const categoryList = useSelector(state => state.Home.categoryList);
  const dispatch = useDispatch();



  console.log('====CATAGORY====>>>>>>', categoryList[2].description);

  useEffect(() => {
    const createjobDetails = props.navigation.addListener('focus', async () => {
      dispatch(getCategoryListAction());
      console.log('========>>>>>>', categoryList);
    });
    return createjobDetails;
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header {...props} title="Category List" />
      <View style={{ flex: 1 }}>
        <View style={styles.searchContainer}>
          <SearchComp title={'Enter keyword..'} icon={'icon'} value={value} onChangeText={text => setValue(text)} />
        </View>
        <FlatList
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          data={categoryList}
          // keyExtractor={(item, index) => `${item.id}#${index}`}
          renderItem={(item, index) => {
            return (
              <>
                {value == item.item.name.substring(0, value.length) || item.item.description.includes(value)? (
                  <Card style={styles.jobItemContainer}>
                    {/* {console.log('ITEM=====>>>>', item)} */}
                    <Card.Content
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={{ uri: item.item.icon }}
                        style={styles.jobImg}
                        resizeMode={'contain'}
                      />
                      <View style={{ marginLeft: 5, flex: 0.8 }}>
                        <Title style={{ fontSize: wp(18) }}>
                          {item.item.name}
                        </Title>
                        <Paragraph numberOfLines={4}>
                          {item.item.description}
                        </Paragraph>
                      </View>
                    </Card.Content>
                  </Card>
                ) : null}
              </>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoryListing;



const styles = StyleSheet.create({
  jobImg: {
    width: wp(60),
    height: hp(60),
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#000',
  },
  jobItemContainer: {
    marginBottom: hp(24),
    padding: 10,
    // width: '100%',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(25),
    // marginHorizontal: wp(12),
    marginLeft: wp(8),
    marginBottom: hp(15),
  },
});
