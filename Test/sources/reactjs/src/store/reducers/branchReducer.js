import Constants from 'variables/Constants/'

const INITIAL_STATE = {
  branchId: Constants.DEFAULT_BRANCH_ID,
  isGetBranch: false,
  nameBranch: Constants.DEFAULT_BRANCH_NAME
};

export default function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "CHANGE_BRANCH":
      localStorage.setItem("branchId", action.branch)
      localStorage.setItem("nameBranch", action.nameBranch)
      return {
        ...state,
        branchId: action.branch,
        isGetBranch: action.isGetBranch,
        nameBranch: action.nameBranch
      };

    default:
      return state;
  }
}
