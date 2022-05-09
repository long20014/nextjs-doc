import { type } from './type.js';

const LangReducer = (state, action) => {
  switch (action.type) {
    case type.CHANGE_LANG:
      return {
        ...state,
        lang: action.payload,
      };
    default:
      return state;
  }
};

export default LangReducer;
