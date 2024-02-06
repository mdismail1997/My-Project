const chainOperator = (
  data,
  arr_of_nested_keys,
  default_return_value_falsy,
) => {
  // user {} ['profession']
  if (!data) return default_return_value_falsy;

  for (const key of arr_of_nested_keys) {
    if (!data[key]) return default_return_value_falsy;
    data = data[key];
  }
  return data;
};

export const processMessages = (messages, user) => {
  if (!user) return [];
  if (!messages) return [];
  if (!messages.length) return [];

  return messages.map(msg => ({
    ...msg,
    self: chainOperator(msg, ['sender', '_id'], '') === user._id,
  }));
};

export const getRemoteUserData = (chat, attr, user) => {
  if (!user) return;
  if (!chat) return;
  if (!chat.remoteUser) return;
  if (!chat.remoteUser._id) return;

  const remoteUser =
    chat.remoteUser._id !== user._id ? chat.remoteUser : chat.user;

  switch (attr) {
    case 'id': {
      return remoteUser._id;
    }
    case 'profileImage': {
      return remoteUser.profileimage;
    }
    case 'fullname': {
      return `${remoteUser.firstname} ${remoteUser.lastname}`;
    }
    case 'firstname': {
      return `${remoteUser.firstname}`;
    }
    case 'status': {
      return checkOnline(remoteUser);
    }
    case 'status-text': {
      return remoteUser.isOnline ? 'online' : 'offline';
    }
    default: {
      return remoteUser;
    }
  }
};
