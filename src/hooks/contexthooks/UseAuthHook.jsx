import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContexts/AuthContext';

const UseAuthHook = () => {
    const context = useContext(AuthContext)
    return context;
};

export default UseAuthHook;