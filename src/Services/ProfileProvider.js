import React, {createContext, useState} from 'react';

const ProfileContext = createContext();
const ProfileProvider = ProfileContext.Provider;
const ProfileConsumer = ProfileContext.Consumer;

export {ProfileContext, ProfileProvider};
export default ProfileContext;
