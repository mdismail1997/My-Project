import React, { useState } from 'react';
import {
  VStack,
  Center,
  FormControl,
  Stack,
  Input,
  Icon,
  WarningOutlineIcon,
  Button,
  TextArea,
  Select,
  CheckIcon,
} from 'native-base';
import { Formik, FormikConfig, FormikErrors } from 'formik';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import { ImageUploader, ImageUploaderProps } from './ImageUploader';
import { useTranslation } from 'react-i18next';
import { Asset } from 'react-native-image-picker';
import { deleteHorseProfile, updateHorseProfile } from '../api/auth';

interface HorseProfileProps {
  id: string;
  horseName?: string;
  type: string;
  race?: string;
  horseAge?: string;
  education?: string;
  bio?: string;
  imageURI?: string;
  onSubmit?: (data: Record<string, any>) => void;
  onError?: () => void;
  onDelete?: (id: string, data: any) => void;
  onDeleteError?: (data: any) => void;
}
const HorseProfileNames: Record<
  keyof HorseProfileProps,
  keyof HorseProfileProps
> = {
  id: 'id',
  horseName: 'horseName',
  type: 'type',
  race: 'race',
  horseAge: 'horseAge',
  education: 'education',
  bio: 'bio',
  imageURI: 'imageURI',
  onSubmit: 'onSubmit',
  onError: 'onError',
  onDelete: 'onDelete',
  onDeleteError: 'onDeleteError',
};
const HorseProfileLabels: Record<keyof HorseProfileProps, string> = {
  id: '',
  horseName: 'Name',
  type: 'Type',
  race: 'Race',
  horseAge: 'Age',
  education: 'Education',
  bio: 'Bio',
  imageURI: '',
  onSubmit: '',
  onError: '',
  onDelete: '',
  onDeleteError: '',
};

const validateHandler: FormikConfig<HorseProfileProps>['validate'] = (
  values
) => {
  let formErrors: FormikErrors<HorseProfileProps> = {};
  if (!values.horseName) {
    formErrors.horseName = 'Horse name required.';
  }
  return formErrors;
};

export const HorseProfile: React.FC<HorseProfileProps> = (props) => {
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<Asset>();
  const [isDeleting, setIsDeleting] = useState(false);

  const onSubmitHandler: FormikConfig<HorseProfileProps>['onSubmit'] = async (
    values,
    { resetForm }
  ) => {
    try {
      const formData = new FormData();

      formData.append('id', values.id);
      formData.append('name', values.horseName);
      formData.append('race', values.race);
      if (values.horseAge) {
        formData.append('age', Number(values.horseAge));
      }
      formData.append('education', values.education);
      if (selectedImage) {
        formData.append('photo', {
          name: selectedImage.fileName,
          size: selectedImage.fileSize,
          type: selectedImage.type,
          uri: selectedImage.uri,
        });
      }
      formData.append('type', values.type);

      const response = await updateHorseProfile(formData);
      setSelectedImage(undefined);
      props.onSubmit?.(response.data.data);
      resetForm();
    } catch (error: any) {
      props.onError?.();
      resetForm();
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await deleteHorseProfile({ id });
      props.onDelete?.(id, response.data);
      setIsDeleting(false);
    } catch (error: any) {
      props.onDeleteError?.(error?.response);
      setIsDeleting(false);
    }
  };

  return (
    <Formik
      initialValues={{ ...props, type: props.type ?? 'sitzVerbessern' }}
      onSubmit={onSubmitHandler}
      validate={validateHandler}
      enableReinitialize
    >
      {function FormComponent({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isSubmitting,
        setFieldValue,
        dirty,
      }) {
        const handleFileSelect: ImageUploaderProps['onSelectFile'] = (file) => {
          setSelectedImage(file[0]);
          setFieldValue(HorseProfileNames.imageURI, file[0].uri);
        };

        return (
          <VStack space={2} width="full">
            <Center>
              <ImageUploader
                alt={values.horseName}
                src={values.imageURI}
                onSelectFile={handleFileSelect}
              />
            </Center>
            <Center>
              <FormControl
                isRequired
                isInvalid={touched.horseName && errors.horseName !== undefined}
              >
                <Stack>
                  <Input
                    minHeight="12"
                    type="text"
                    defaultValue={values.horseName}
                    placeholder={HorseProfileLabels.horseName}
                    onChangeText={handleChange(HorseProfileNames.horseName)}
                    onBlur={handleBlur(HorseProfileNames.horseName)}
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
                  {touched.horseName === true &&
                    errors.horseName !== undefined && (
                      <FormControl.ErrorMessage
                        ml={2}
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.horseName}
                      </FormControl.ErrorMessage>
                    )}
                </Stack>
              </FormControl>
            </Center>
            <Center>
              <Stack position="relative">
                <MaterialCommunityIcons
                  style={{ position: 'absolute', top: '30%', left: 10 }}
                  name="form-select"
                  size={18}
                  color={'grey'}
                />
                <Select
                  selectedValue={values.type}
                  variant="rounded"
                  minWidth="100%"
                  paddingLeft={'9'}
                  accessibilityLabel={HorseProfileLabels.type}
                  placeholder={HorseProfileLabels.type}
                  _selectedItem={{
                    endIcon: <CheckIcon size="5" />,
                  }}
                  onValueChange={handleChange(HorseProfileNames.type)}
                >
                  <Select.Item label="sitz verbessern" value="sitzVerbessern" />
                  <Select.Item label="Hand Ruhiger" value="handRuhiger" />
                  <Select.Item
                    label="Schulter lockerer"
                    value="schulterLockerer"
                  />
                </Select>
              </Stack>
            </Center>
            <Center>
              <FormControl
                isRequired
                isInvalid={touched.race && errors.race !== undefined}
              >
                <Stack>
                  <Input
                    minHeight="12"
                    type="text"
                    defaultValue={values.race}
                    placeholder={HorseProfileLabels.race}
                    onChangeText={handleChange(HorseProfileNames.race)}
                    onBlur={handleBlur(HorseProfileNames.race)}
                    variant="rounded"
                    InputLeftElement={
                      <Icon
                        as={<MaterialCommunityIcons name="horse-variant" />}
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                  />
                  {touched.race === true && errors.race !== undefined && (
                    <FormControl.ErrorMessage
                      ml={2}
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.race}
                    </FormControl.ErrorMessage>
                  )}
                </Stack>
              </FormControl>
            </Center>
            <Center>
              <FormControl
                isRequired
                isInvalid={touched.horseAge && errors.horseAge !== undefined}
              >
                <Stack>
                  <Input
                    minHeight="12"
                    type="text"
                    defaultValue={values.horseAge}
                    placeholder={HorseProfileLabels.horseAge}
                    onChangeText={handleChange(HorseProfileNames.horseAge)}
                    onBlur={handleBlur(HorseProfileNames.horseAge)}
                    variant="rounded"
                    InputLeftElement={
                      <Icon
                        as={<AntDesignIcons name="calendar" />}
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                  />
                  {touched.horseAge === true && errors.horseAge !== undefined && (
                    <FormControl.ErrorMessage
                      ml={2}
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.horseAge}
                    </FormControl.ErrorMessage>
                  )}
                </Stack>
              </FormControl>
            </Center>
            <Center>
              <FormControl
                isRequired
                isInvalid={touched.education && errors.education !== undefined}
              >
                <Stack>
                  <Input
                    minHeight="12"
                    type="text"
                    defaultValue={values.education}
                    placeholder={HorseProfileLabels.education}
                    onChangeText={handleChange(HorseProfileNames.education)}
                    onBlur={handleBlur(HorseProfileNames.education)}
                    variant="rounded"
                    InputLeftElement={
                      <Icon
                        as={
                          <MaterialCommunityIcons name="book-open-page-variant-outline" />
                        }
                        size={5}
                        ml="2"
                        color="muted.400"
                      />
                    }
                  />
                  {touched.education === true &&
                    errors.education !== undefined && (
                      <FormControl.ErrorMessage
                        ml={2}
                        leftIcon={<WarningOutlineIcon size="xs" />}
                      >
                        {errors.education}
                      </FormControl.ErrorMessage>
                    )}
                </Stack>
              </FormControl>
            </Center>
            <Center>
              <FormControl
                isRequired
                isInvalid={touched.bio && errors.bio !== undefined}
              >
                <Stack>
                  <TextArea
                    value={values.bio}
                    autoCompleteType="off"
                    placeholder={HorseProfileLabels.bio}
                    onChangeText={handleChange(HorseProfileNames.bio)}
                    onBlur={handleBlur(HorseProfileNames.bio)}
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
                  {touched.bio === true && errors.bio !== undefined && (
                    <FormControl.ErrorMessage
                      ml={2}
                      leftIcon={<WarningOutlineIcon size="xs" />}
                    >
                      {errors.bio}
                    </FormControl.ErrorMessage>
                  )}
                </Stack>
              </FormControl>
            </Center>
            <Center>
              <Stack direction="row" space={'2'}>
                <Button
                  colorScheme="blue"
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting || dirty === false}
                  isLoading={isSubmitting}
                  isLoadingText="SUBMITTING"
                  borderRadius={30}
                  flex={1}
                  height={10}
                  style={{ marginVertical: 10 }}
                >
                  {t('SUBMIT')}
                </Button>
                {props.id !== '' &&
                  props.id !== undefined &&
                  props.id !== null && (
                    <Button
                      colorScheme="red"
                      onPress={() => handleDelete(values.id)}
                      disabled={isSubmitting || isDeleting}
                      isLoading={isDeleting}
                      isLoadingText="DELETING"
                      borderRadius={30}
                      flex={1}
                      height={10}
                      style={{ marginVertical: 10 }}
                    >
                      {t('DELETE')}
                    </Button>
                  )}
              </Stack>
            </Center>
          </VStack>
        );
      }}
    </Formik>
  );
};
