import React, { useContext, useReducer } from 'react';
import { LanguageContext } from './context';
import LangReducer from './reducer';

export const useLangContext = () => {
  const { state, dispatch } = useContext(LanguageContext);

  return { state, dispatch };
};

export const LangStateProvider = ({ children }) => {
  const initialState = {
    lang:
      typeof localStorage !== 'undefined'
        ? localStorage.getItem('lang') || 'en'
        : 'en',
  };

  const [state, dispatch] = useReducer(LangReducer, initialState);

  return (
    <LanguageContext.Provider value={{ state, dispatch }}>
      {children}
    </LanguageContext.Provider>
  );
};
