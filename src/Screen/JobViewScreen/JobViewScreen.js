import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, ScrollView} from 'react-native';
import {Card, Paragraph, Title} from 'react-native-paper';

import {Header} from '../../components/Header/Header';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {hp, wp} from '../../utils/ResponsiveLayout';
import {styles} from './styles';
import AntIcon from 'react-native-vector-icons/dist/AntDesign';
import {COLORS} from '../../utils/Const';
import moment from 'moment';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import CustomButton from '../../components/CustomButton';

const JobViewScreen = props => {
  const detailsview = props.route.params.details;
  console.log('details', detailsview);

  const [index, setIndex] = React.useState(0);
  const [image, setimages] = useState([]);
  const [region, setRegion] = useState({latitude: 0, longitude: 0});
  const carouselRef = React.createRef();

  useEffect(() => {
    if (detailsview.data.gallery.length >= 1) {
      detailsview.data.gallery.push(detailsview.data.profileImage);
      setimages(detailsview.data.gallery);
    }
    setRegion({
      latitude: detailsview.data.location.coordinates[1],
      longitude: detailsview.data.location.coordinates[0],
    });
    console.log('category list: ', image);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header title={'Job Details'} {...props} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <Card style={styles}>
            {detailsview.data.gallery.length >= 1 ? (
              <>
                <Carousel
                  ref={carouselRef}
                  data={detailsview.data.gallery}
                  sliderWidth={400}
                  itemWidth={wp(200)}
                  itemHeight={300}
                  style={{
                    marginBottom: 0,
                    borderColor: '#000',
                    borderWidth: 12,
                  }}
                  renderItem={({item, index}) => (
                    // <Card.Cover>
                    //   <I

                    //     style={{width: wp(150), height: hp(160)}}
                    //   />
                    <Card.Cover source={{uri: item}} />
                  )}
                  onSnapToItem={index => setIndex(index)}
                  useScrollView={true}
                  // layout={'default'}
                  autoplay={false}
                  loop={false}
                  enableSnap={true}
                />
                <Pagination
                  dotContainerStyle={{height: 0, bottom: '3%'}}
                  dotsLength={detailsview.data.gallery.length}
                  activeDotIndex={index}
                  carouselRef={carouselRef}
                  dotStyle={{
                    width: 13,
                    height: 6,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    backgroundColor: '#4DB8B8',
                  }}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  tappableDots={true}
                />
              </>
            ) : (
              <Card.Cover source={{uri: detailsview.data.profileImage}} />
            )}
            <Card.Content>
              <Title>{detailsview.data.title}</Title>
              <Paragraph>{detailsview.data.description}</Paragraph>
            </Card.Content>
          </Card>
          <Card style={[styles.jobItemContainer, {marginTop: hp(25)}]}>
            <Card.Content>
              <Title>Post By</Title>
              <Paragraph>{`${detailsview.data.employer_id.firstname} ${detailsview.data.employer_id.lastname}`}</Paragraph>
              <Title>Job Type</Title>
              <Paragraph>{detailsview.data.job_type}</Paragraph>
              <Title>Project Amount</Title>
              {detailsview.data.price.type === 'fixed' ? (
                <Paragraph>{`$${detailsview.data.price.fixed}.00`}</Paragraph>
              ) : (
                <Paragraph>{`$${detailsview.data.price.min}.00 - $${detailsview.data.price.max}.00`}</Paragraph>
              )}

              <Title>Rating</Title>
              <Paragraph>
                <AntIcon name={'star'} size={15} color={'#F3D810'} />
                {`${detailsview.data.employer_id.rating.rate} - ${detailsview.data.employer_id.rating.total} view`}
              </Paragraph>
              <Title>Location</Title>
              <Paragraph>{`${detailsview.data.address}, ${detailsview.data.zipcode}, ${detailsview.data.city}, ${detailsview.data.state}, ${detailsview.data.country}`}</Paragraph>
              <Title>Time schedule</Title>
              {detailsview.data.isJobMoreThanOneDay === true ? (
                <Paragraph>{`Date:    ${moment(
                  detailsview.data.startDate,
                ).format('dddd, MMM D YYYY ')} - ${moment(
                  detailsview.data.endDate,
                ).format('dddd, MMM D YYYY ')}`}</Paragraph>
              ) : (
                <Paragraph>{`Date:    ${moment(detailsview.data.date).format(
                  'dddd, MMM D YYYY ',
                )}`}</Paragraph>
              )}

              <View style={{flexDirection: 'row'}}>
                <Paragraph>{`Time:    ${detailsview.data.start_time}`}</Paragraph>
                <Paragraph>
                  {` ${detailsview.data.start_time <= 12 ? 'AM' : 'PM'} `}
                </Paragraph>
                <Paragraph>{'-'}</Paragraph>
                <Paragraph>{`${detailsview.data.end_time}`}</Paragraph>
                <Paragraph>
                  {`${detailsview.data.end_time <= 12 ? 'AM' : 'PM'}`}
                </Paragraph>
              </View>
            </Card.Content>
          </Card>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            region={{
              latitude: region.latitude,
              longitude: region.longitude,
              latitudeDelta: 0.5922,
              longitudeDelta: 0.2421,
            }}>
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
          <View>
            <Text style={styles.milesText}>
              You Live{' '}
              <Text style={[styles.milesText, {color: COLORS.YELLOW_GREEN}]}>
                5 Miles Away
              </Text>
            </Text>
            <Text style={{color: COLORS.NICKEL}}>
              Address will become available if you are selected for the job!
            </Text>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Chat "
                buttonStyle={styles.applyButtonStyle}
                titleStyle={{color: COLORS.YELLOW_GREEN}}
                onPress={() => props.navigation.navigate('Friendsscreen')}
              />

              {/* <CustomButton
                title="Apply Now"
                buttonStyle={[
                  styles.buttonStyle,
                  {backgroundColor: COLORS.YELLOW_GREEN},
                ]}
              /> */}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default JobViewScreen;
