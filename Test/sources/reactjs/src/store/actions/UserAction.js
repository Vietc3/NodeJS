

function updateUserInfo(currentUser){
	return {type: "UPDATE_USER_INFO", currentUser: currentUser};
}
function updatePermission(permissions){
	return {type: "UPDATE_PERMISSION", permissions};
}

export default {
	updateUserInfo,
	updatePermission
};