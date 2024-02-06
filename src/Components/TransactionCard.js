import React from 'react';
import {Text, Stack, Box, View} from 'native-base';

const generateColor = status => {
  switch (status) {
    case 'PAID':
      return 'green.500';
    case 'FAILED':
      return 'red.500';
    case 'PENDING':
      return 'amber.500';
    default:
      return 'amber.500';
  }
};

export function TransactionCard({
  title = 'Withdrawal request',
  amount,
  date = new Date().toLocaleString(),
  status = 'PENDING',
}) {
  return (
    <Box
      height="16"
      width="full"
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.300"
      backgroundColor={generateColor(status)}
      borderWidth="1"
      padding="2"
      _dark={{
        borderColor: 'coolGray.600',
      }}>
      <Stack direction="row">
        <View width="55%" height="full" justifyContent="center">
          <Text numberOfLines={2} color="white">
            {title}
          </Text>
          <Text numberOfLines={1} color="white">
            {date}
          </Text>
        </View>
        <View width="30%" justifyContent="center" alignItems="center">
          <Text numberOfLines={1} color="white">
            {status}
          </Text>
        </View>
        <View width="20%" justifyContent="center" alignItems="center">
          <Text color="white">{amount} $</Text>
        </View>
      </Stack>
    </Box>
  );
}
