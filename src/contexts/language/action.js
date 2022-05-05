import { type } from './type';

export const changeLang = (dispatch, lang) =>
  dispatch({
    type: type.CHANGE_LANG,
    payload: lang,
  });
