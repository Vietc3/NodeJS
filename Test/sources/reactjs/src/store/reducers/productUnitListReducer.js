import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  productUnits: [],
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_PRODUCT_UNIT_LIST":
      return {
        ...state,
        productUnits: action.productUnits,
      };

    default:
      return state;
  }
}
