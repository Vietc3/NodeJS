function changeBranch(branch, isGetBranch, nameBranch) {
    return { type: 'CHANGE_BRANCH', branch, isGetBranch, nameBranch }
    
  }
  
  export default {
    changeBranch
  };