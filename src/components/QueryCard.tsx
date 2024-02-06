import React from 'react';
import { Box, Pressable, Stack, Text, View } from 'native-base';
import { useNavigation } from '@react-navigation/native';

interface QueryCardProps {
  id: string;
  title: string;
  description: string;
  reply?: string;
}

export const QueryCard: React.FC<QueryCardProps> = ({
  id,
  title,
  description,
  reply,
}) => {
  const navigation = useNavigation();
  return (
    <View width="full">
      <Pressable
        onPress={() => {
          navigation.navigate('QueryDetails', {
            queryId: id,
            title,
            description,
            reply,
          });
        }}
      >
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
            }}
          >
            <Stack m="2" space={2}>
              <Text bold isTruncated _light={{ color: 'white' }}>
                {title}
              </Text>
              <Text
                fontSize={'xs'}
                numberOfLines={2}
                ellipsizeMode="tail"
                _light={{ color: 'white' }}
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
