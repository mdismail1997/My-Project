import {useState} from 'react';

const [data, setData] = useState({
  sku: data?.name,
  name: '',
  attribute_set_id: 4,
  price: 0,
  status: 1,
  visibility: 4,
  type_id: 'simple',
  weight: '1',
  custom_attributes: [
    {
      attribute_code: 'category_ids',
      value: ['3', '4'],
    },
    {
      attribute_code: 'color',
      value: '5478',
    },
    {
      attribute_code: 'size',
      value: '5749',
    },
  ],
  media_gallery_entries: [],
  extension_attributes: {
    category_links: [
      {
        position: 0,
        category_id: '3',
      },
      {
        position: 0,
        category_id: '4',
      },
    ],
    stock_item: {
      qty: '10',
      is_in_stock: true,
    },
  },
});


{
  data.media_gallery_entries.length == 0
    ? images.map((val, i) => (
        <TouchableOpacity
          key={i}
          onPress={() => productImg()}
          style={styles.iconsPad}>
          <MaterialCommunityIcons
            name="image-plus"
            color={'#948e8e'}
            size={calcH(0.03)}
          />
        </TouchableOpacity>
      ))
    : data.media_gallery_entries.length.map((val, i) => (
        <Image
          key={i}
          style={{
            width: 51,
            height: 51,
            resizeMode: 'cover',
          }}
          source={{
            uri: `data:${val?.content?.type};base64,${val?.content?.base64_encoded_data}`,
          }}
        />
      ));
}