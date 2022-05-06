import React, { useContext, useReducer } from 'react';
import { LanguageContext } from './context';
import LangReducer from './reducer';
import { useRouter } from 'next/router';
import { resolveLangPath } from 'src/utils/resolve';

export const useLangContext = () => {
  const { state, dispatch } = useContext(LanguageContext);

  return { state, dispatch };
};

export const LangStateProvider = ({ children }) => {
  const router = useRouter();
  const lang = resolveLangPath(router.asPath) || 'en';
  const initialState = {
    lang,
  };

  const [state, dispatch] = useReducer(LangReducer, initialState);

  return (
    <LanguageContext.Provider value={{ state, dispatch }}>
      {children}
    </LanguageContext.Provider>
  );
};
