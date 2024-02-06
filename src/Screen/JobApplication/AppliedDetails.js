import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Header} from '../../components/Header/Header';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Provider,
  Portal,
  Modal,
  Chip,
} from 'react-native-paper';
import {hp, wp} from '../../utils/ResponsiveLayout';
import moment from 'moment';
import CustomButton from '../../components/CustomButton';
import {COLORS, FONT_FAMILY} from '../../utils/Const';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

const AppliedDetails = props => {
  const detailsView = props.route.params.details;
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  return (
    <Provider>
      <SafeAreaView style={{backgroundColor: COLORS.WHITE}}>
        <Header {...props} title={'Applied'} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{padding: 12}}>
            <Card style={{padding: 12}}>
              {/* <View style={styles.container}> */}
              {console.log('details', detailsView)}
              <Image
                source={{uri: detailsView.item.job_id.profileImage}}
                style={styles.jobImage}
                resizeMode={'stretch'}
              />
              <Chip
                style={{
                  height: hp(40),
                  backgroundColor: COLORS.YELLOW_GREEN,
                  width: wp(92),
                  borderRadius: 8,
                  position: 'absolute',
                  margin: hp(170),
                  marginLeft: wp(220),
                  // justifyContent: 'center',
                  alignItems: 'center',
                }}
                textStyle={{color: COLORS.WHITE}}
                onPress={() => console.log('Pressed')}>
                {`${detailsView.item.status
                  .charAt(0)
                  .toUpperCase()}${detailsView.item.status.slice(1)}`}
              </Chip>
              <View style={[styles.details, {marginTop: 18}]}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Job Title
                </Title>
                <Paragraph style={{color: COLORS.NICKEL}}>
                  {detailsView.item.job_id.title}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Category
                </Title>
                <Paragraph style={{color: COLORS.NICKEL}}>
                  {detailsView.item.job_id.category.name}
                </Paragraph>
              </View>
              {detailsView.item.job_id.subcategory ? (
                <View style={styles.details}>
                  <Title
                    style={{
                      fontFamily: FONT_FAMILY.LATO_BOLD,
                      fontSize: wp(18),
                    }}>
                    Subcategory
                  </Title>
                  <Paragraph style={{color: COLORS.NICKEL}}>
                    {detailsView.item.job_id.subcategory.name}
                  </Paragraph>
                </View>
              ) : null}

              <View style={styles.details}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Employer Name
                </Title>
                <Paragraph style={{color: COLORS.NICKEL}}>
                  {`${detailsView.item.employer_id.firstname} ${detailsView.item.employer_id.lastname}`}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Employer Contact
                </Title>
                <Paragraph style={{color: COLORS.NICKEL}}>
                  {detailsView.item.employer_id.phone_number}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Employer Email
                </Title>
                <Paragraph numberOfLines={1} style={{color: COLORS.NICKEL}}>
                  {detailsView.item.employer_id.email}
                </Paragraph>
              </View>
              <View style={styles.details}>
                <Title
                  style={{fontFamily: FONT_FAMILY.LATO_BOLD, fontSize: wp(18)}}>
                  Date Applied
                </Title>
                <Paragraph style={{color: COLORS.NICKEL}}>
                  {moment(detailsView.item.createdAt).format(
                    'ddd, MMM D YYYY ',
                  )}
                </Paragraph>
              </View>
              {/* <View style={styles.details}>
                <Title>Status</Title>
                <Paragraph>{detailsView.item.status.toUpperCase()}</Paragraph>
              </View> */}

              {/* <View style={styles.details}>
                <Title style={{fontFamily: FONT_FAMILY.LATO_BOLD}}>
                  Resume
                </Title>
                <TouchableOpacity
                  onPress={showModal}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      backgroundColor: COLORS.YELLOW_GREEN,
                      width: '13%',
                      height: hp(55),
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 8,
                    }}>
                    <Icon
                      name={'file-multiple-outline'}
                      color={COLORS.WHITE}
                      size={20}
                    />
                  </View>
                  <Text style={{color: '#0066ff', marginLeft: 12}}>
                    {detailsView.item.resume?.split('/').pop()}
                  </Text>
                </TouchableOpacity>
              </View> */}
              <Portal>
                <Modal
                  visible={visible}
                  onDismiss={hideModal}
                  contentContainerStyle={containerStyle}>
                  <Card>
                    <Card.Cover
                      source={{uri: detailsView.item.resume}}
                      resizeMode={'cover'}
                    />
                  </Card>
                </Modal>
              </Portal>

              <CustomButton
                title={'Close'}
                buttonStyle={{
                  width: wp(70),
                  backgroundColor: COLORS.NICKEL,
                  left: wp(85),
                  marginBottom: 32,
                }}
                onPress={() => props.navigation.navigate('JobApplication')}
              />
              {/* </View> */}
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Provider>
  );
};

export default AppliedDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    marginBottom: 25,
    padding: 15,
  },
  jobImage: {
    width: '95%',
    height: hp(195),
    borderRadius: 10,
    marginLeft: 12,
  },
  details: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    // alignItems: 'center',
    padding: 2,
    width: '100%',
  },
});
