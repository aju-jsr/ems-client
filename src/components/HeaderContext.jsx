import { createContext, useContext, useState } from "react";

const HeaderContext = createContext();

export function HeaderProvider({ children }) {

    const [headerTitle, setHeaderTitle] = useState("Budget Proposal");

    return (
        <HeaderContext.Provider
            value={{
                headerTitle,
                setHeaderTitle
            }}
        >
            {children}
        </HeaderContext.Provider>
    );
}

export const useHeader = () => useContext(HeaderContext);