import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Caption, Card, Paragraph, Title } from 'react-native-paper';
import { Rating } from 'react-native-ratings';
import { RFValue } from 'react-native-responsive-fontsize';

export const AdvertiseCard = ({
  src,
  name,
  specialization,
  degree,
  rating,
  id,
  props,
  color,
  flag
}) => {
  return (

    <View style={{
      margin: 10,
      borderColor: flag ? color : 'gold',
      borderWidth: 1,
      height: 170,
      backgroundColor: '#fff',
    }}>
      <ScrollView>
        <Card
          onPress={() => flag ? null : props.navigation.navigate('DoctorProfile', { id: id })}
          style={{ backgroundColor: '#fff' }}
        >
          {/* <Caption style={{ margin: 5 }}>Ad.</Caption> */}
          <Card.Content>
            <View
              style={{
                flexDirection: 'row',
                // alignItems: 'center',
                width: "100%"
              }}
            >
              {/* <Avatar.Image source={src} style={{ marginRight: 20 }} /> */}
              <TouchableOpacity
                style={{
                  //  marginLeft: 10,
                  marginRight: 20,
                  borderRadius: 75,
                  height: 85,
                  width: 85,

                  borderColor: '#000',
                  borderWidth: 1,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              // onPress={() => props.navigation.navigate('PatientProfile')}
              >
                <Image
                  style={{
                    borderRadius: 50,
                    height: 85,
                    width: 85,
                    alignSelf: 'center',
                    // marginTop: -10,
                    resizeMode: 'contain'
                  }}

                  source={src}
                />
              </TouchableOpacity>

              <View
                style={{
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',

                }}
              >
                <Text
                  style={{
                    marginTop: -10,
                    color: '#000',
                    fontSize: RFValue(15),
                    width: '75%',
                  }}
                >
                  {name}
                </Text>
                <Text
                  style={{
                    width: '65%',
                    color: '#000',
                    fontSize: RFValue(12),
                    marginTop: 10
                  }}
                >
                  {specialization}
                </Text>
                <Caption style={{ color: '#000', fontSize: RFValue(10) }}>
                  {degree}
                </Caption>
                <Rating
                  fractions={2}
                  startingValue={rating}
                  imageSize={15}
                  ratingCount={5}
                  readonly={true}
                  style={{ alignSelf: 'flex-start' }}
                />

                {/* <Paragraph>⭐⭐⭐⭐</Paragraph> */}
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};
