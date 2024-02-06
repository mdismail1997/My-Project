import React, { useState } from 'react';
import {
  CheckIcon,
  Divider,
  Icon,
  IconButton,
  Input,
  Select,
  Stack,
} from 'native-base';
import { useTheme } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface SearchBarProps {
  onSearch?: (selectedItem: string, searchTerm: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const { colors } = useTheme();
  const [selectItem, setSelectItem] = useState('training');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Input
      minHeight="12"
      placeholder="Search"
      width="100%"
      borderRadius="full"
      py="3"
      px="1"
      fontSize="14"
      value={searchTerm}
      onChangeText={(value) => {
        setSearchTerm(value);
      }}
      InputLeftElement={
        <Stack direction="row" alignItems="center" height="80%">
          <Select
            selectedValue={selectItem}
            variant="unstyled"
            width="24"
            borderWidth="0"
            accessibilityLabel="Choose Service"
            _actionSheetContent={{
              backgroundColor: colors.card,
            }}
            _selectedItem={{
              bg: 'teal.600',
              endIcon: <CheckIcon size="5" />,
            }}
            _item={{
              backgroundColor: colors.card,
            }}
            onValueChange={(itemValue) => {
              setSelectItem(itemValue);
            }}
          >
            <Select.Item label="Training" value="training" />
            <Select.Item label="Library" value="library" />
          </Select>
          <Divider thickness="2" orientation="vertical" />
        </Stack>
      }
      InputRightElement={
        <IconButton
          onPress={() => {
            onSearch?.(selectItem, searchTerm);
          }}
          icon={
            <Icon
              size="8"
              color="gray.400"
              as={<MaterialIcons name="search" />}
            />
          }
        />
      }
    />
  );
};
