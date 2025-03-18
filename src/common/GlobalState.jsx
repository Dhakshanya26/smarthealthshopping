import React, { createContext, useState, useContext } from "react";
// Create Context
const GlobalContext = createContext();
// Create Provider Component
export const GlobalProvider = ({ children }) => {
    const [selectedStoreValue, setSelectedStoreValue] = useState(null);
    const [currentCartId, setCurrentCartId] = useState(null);
    return (
        <GlobalContext.Provider value={{ selectedStoreValue, setSelectedStoreValue,currentCartId, setCurrentCartId }}>
            {children}
        </GlobalContext.Provider>
    );
};
// Custom Hook to use Global Context
export const useGlobalState = () => useContext(GlobalContext);