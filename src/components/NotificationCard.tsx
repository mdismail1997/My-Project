import React from 'react';
import { Box, Pressable, Spacer, Stack, Text, View } from 'native-base';
import moment from 'moment';

interface NotificationCardProps {
  title: string;
  time: number;
  description: string;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  time,
  description,
}) => {
  return (
    <View width="full">
      <Pressable onPress={() => {}}>
        {({ isPressed }) => (
          <Box
            borderRadius="lg"
            minHeight="20"
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
            _dark={{
              backgroundColor: '#8ba8a4',
            }}
            _light={{
              backgroundColor: 'darkBlue.500',
              color: 'white',
            }}
          >
            <Stack m="2">
              <Stack
                flex={1}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text
                  bold
                  isTruncated
                  flex={4}
                  _light={{
                    color: 'white',
                  }}
                >
                  {title}
                </Text>
                <Text
                  _light={{
                    color: 'white',
                  }}
                  flex={1}
                >
                  {moment(time).format('DD MMM YY')}
                </Text>
              </Stack>
              <Spacer />
              <Text
                _light={{
                  color: 'white',
                }}
                fontSize={'xs'}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {description}
              </Text>
            </Stack>
          </Box>
        )}
      </Pressable>
    </View>
  );
};
