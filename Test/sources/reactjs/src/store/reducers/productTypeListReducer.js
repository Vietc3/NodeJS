import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  productTypes: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_PRODUCT_TYPE_LIST":
      return {
        ...state,
        productTypes: action.productTypes,
      };

    default:
      return state;
  }
}
