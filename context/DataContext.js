// import { createContext, useState } from "react";

// export const FormContext = createContext();

// export const FormProvider = ({ children }) => {
//   const [formData, setFormData] = useState([]);

//   const addFormData = (data) => {
//     setFormData((prev) => [...prev, data]);
//   };

//   return (
//     <FormContext.Provider value={{ formData, addFormData }}>
//       {children}
//     </FormContext.Provider>
//   );
// };

import { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataStore, setDataStore] = useState({
    sendotp: null,
    verify: null,
    aptime: null,
    paynow: null,
  });

  const addData = (key, data) => {
    setDataStore((prev) => ({
      ...prev,
      [key]: data,
    }));
  };

  const getData = (key) => {
    return dataStore[key];
  };

  const clearData = (key) => {
    setDataStore((prev) => {
      const updatedStore = { ...prev };
      delete updatedStore[key];
      return updatedStore;
    });
  };

  return (
    <DataContext.Provider value={{ dataStore, addData, getData, clearData }}>
      {children}
    </DataContext.Provider>
  );
};
