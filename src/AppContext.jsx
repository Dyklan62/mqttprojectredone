import { createContext, useState,useContext } from "react";

export const AppContext = createContext();

export const Context = ({ children }) =>{
    const [client, setClient] = useState(null)

    return (
        <AppContext.Provider value={{ client, setClient }}>
          {children}
        </AppContext.Provider>
      );
};
        
export function useAppContext() {
    return useContext(AppContext);
  }