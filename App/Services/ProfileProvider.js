import React, {createContext, useState} from 'react';

const ProfileContext = createContext();

const ProfileProvider = ({children}) => {
  const [profileContextData, setProfileContextData] = useState('');
  const [notificationStatusContextData, setnotificationStatusContextData] =
    useState(true);

  const [token, setToken] = useState('');
  const [questionList, setQuestionList] = useState([]);
  return (
    <ProfileContext.Provider
      value={{
        profileContextData,
        setProfileContextData,
        notificationStatusContextData,
        setnotificationStatusContextData,
        token,
        setToken,
        questionList,
        setQuestionList,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export {ProfileContext, ProfileProvider};
