import React, {useState, createContext} from 'react';

export const DataContext = createContext();

export const DataProvider = ({children}) => {
  const [userLoginData, setUserLoginData] = useState(null);
  const [hostelContestData, setHostelDataContest] = useState(null);
  // console.log('CONTEST', hostelContestData);

  return (
    <DataContext.Provider
      value={{
        userLoginData,
        setUserLoginData,
        hostelContestData,
        setHostelDataContest,
      }}>
      {children}
    </DataContext.Provider>
  );
};
