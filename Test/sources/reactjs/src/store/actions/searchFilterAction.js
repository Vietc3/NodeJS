function changeSearchFilter(id, filter) {
	return { type: 'CHANGE_SEARCH_FILTER', id, filter }
}

export default {
  changeSearchFilter
};