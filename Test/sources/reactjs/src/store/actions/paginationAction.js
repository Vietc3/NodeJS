function changePagination(id, pageStatus) {
	return { type: 'CHANGE_PAGINATION', id, pageStatus }
}

export default {
  changePagination
};