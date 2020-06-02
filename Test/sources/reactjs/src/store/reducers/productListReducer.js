import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  products: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_PRODUCT_LIST":
      return {
        ...state,
        products: action.products,
      };

    default:
      return state;
  }
}
