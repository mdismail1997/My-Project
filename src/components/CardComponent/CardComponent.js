import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Card, Title, Paragraph} from 'react-native-paper';
import {wp} from '../../utils/ResponsiveLayout';

const CardComponent = props => {
  return (
    <View style={styles.shadowProp}>
      <Card>
        {props.contain ? (
          <Card.Content>
            {props.image ? (
              <Image source={require('../../Assets/profile.png')} />
            ) : null}
            <Title>{props.title}</Title>
            <Paragraph>{props.paragraph}</Paragraph>
          </Card.Content>
        ) : (
          <Card.Content>
            <Image source={require('../../Assets/profile.png')} />
            <Title>{props.title}</Title>
            <Paragraph>{props.paragraph}</Paragraph>
          </Card.Content>
        )}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowProp: {
    // width: wp(110),
    flex: 0.3,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
export default CardComponent;
