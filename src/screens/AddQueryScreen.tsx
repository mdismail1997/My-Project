import React from 'react';
import {
  Button,
  Center,
  FormControl,
  Icon,
  Input,
  ScrollView,
  Stack,
  TextArea,
  View,
  VStack,
  WarningOutlineIcon,
} from 'native-base';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AddQuerySchema,
  ColorScheme,
  CombineReducersType,
  generateFormikErrors,
  InitialAppStateType,
} from '../models';
import { Formik, FormikConfig } from 'formik';
import { appTheme } from '../colorScheme';
import { getUserToken } from '../storage';
import { postQuery } from '../api/auth';

interface AddQueryScreenProps extends AddQuerySchema {}

const AddQueryScreenNames: Record<
  keyof AddQueryScreenProps,
  keyof AddQueryScreenProps
> = {
  name: 'name',
  comment: 'comment',
  type: 'type',
  images: 'images',
};
const AddQueryScreenLabals: Record<keyof AddQueryScreenProps, string> = {
  name: 'Name',
  comment: 'Message',
  type: 'type',
  images: 'images',
};

const validateHandler: FormikConfig<AddQueryScreenProps>['validate'] = (
  values
) => {
  return generateFormikErrors(AddQuerySchema, values);
};

export const AddQueryScreen: React.FC<AddQueryScreenProps> = (props) => {
  const globalState = useSelector<
    CombineReducersType,
    { colorScheme: ColorScheme; language: InitialAppStateType['appLanguage'] }
  >((state) => ({
    colorScheme: state.appDetails.colorScheme,
    language: state.appDetails.appLanguage,
  }));

  const onSubmitHandler: FormikConfig<AddQueryScreenProps>['onSubmit'] = async (
    values
  ) => {
    try {
      const output = AddQuerySchema.parse(values);
      const authData = await getUserToken();
      if (authData) {
        const res = await postQuery({ ...output, email: authData.username });
        if (res.status === 200) {
          console.log('Query send successfully.');
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View
      flex={1}
      backgroundColor={appTheme[globalState.colorScheme].colors.background}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack m={4}>
          <Formik
            initialValues={props}
            onSubmit={onSubmitHandler}
            validate={validateHandler}
          >
            {function FormComponent({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              touched,
              errors,
              isSubmitting,
            }) {
              return (
                <VStack space={2} width="full">
                  <Center>
                    <FormControl
                      isRequired
                      isInvalid={touched.name && errors.name !== undefined}
                    >
                      <Stack>
                        <Input
                          minHeight="12"
                          type="text"
                          defaultValue={values.name}
                          placeholder={AddQueryScreenLabals.name}
                          onChangeText={handleChange(AddQueryScreenNames.name)}
                          onBlur={handleBlur(AddQueryScreenNames.name)}
                          variant="rounded"
                          InputLeftElement={
                            <Icon
                              as={
                                <MaterialCommunityIcons name="horse-variant-fast" />
                              }
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                        />
                        {touched.name === true && errors.name !== undefined && (
                          <FormControl.ErrorMessage
                            ml={2}
                            leftIcon={<WarningOutlineIcon size="xs" />}
                          >
                            {errors.name}
                          </FormControl.ErrorMessage>
                        )}
                      </Stack>
                    </FormControl>
                  </Center>
                  <Center>
                    <FormControl
                      isRequired
                      isInvalid={
                        touched.comment && errors.comment !== undefined
                      }
                    >
                      <Stack>
                        <TextArea
                          value={values.comment}
                          autoCompleteType="off"
                          isRequired
                          isInvalid={
                            touched.comment && errors.comment !== undefined
                          }
                          placeholder={AddQueryScreenLabals.comment}
                          onChangeText={handleChange(
                            AddQueryScreenNames.comment
                          )}
                          onBlur={handleBlur(AddQueryScreenNames.comment)}
                          borderRadius="2xl"
                          InputLeftElement={
                            <Icon
                              as={<MaterialCommunityIcons name="draw" />}
                              size={5}
                              ml="2"
                              color="muted.400"
                            />
                          }
                        />
                        {touched.comment === true &&
                          errors.comment !== undefined && (
                            <FormControl.ErrorMessage
                              ml={2}
                              leftIcon={<WarningOutlineIcon size="xs" />}
                            >
                              {errors.comment}
                            </FormControl.ErrorMessage>
                          )}
                      </Stack>
                    </FormControl>
                  </Center>
                  <Center>
                    <Button
                      colorScheme="blue"
                      onPress={() => handleSubmit()}
                      disabled={isSubmitting}
                      isLoading={isSubmitting}
                      isLoadingText="Sending"
                      borderRadius={30}
                      size="full"
                      height={10}
                      style={{ margin: 10 }}
                    >
                      SEND QUERY
                    </Button>
                  </Center>
                </VStack>
              );
            }}
          </Formik>
        </VStack>
      </ScrollView>
    </View>
  );
};
