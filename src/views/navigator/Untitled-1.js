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
