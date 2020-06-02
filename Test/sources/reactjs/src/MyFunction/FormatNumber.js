function FormatNumber(num){
	num = num || 0;
	num = num.toString();
	while(num.indexOf(",") > -1)
		num = num.replace(",",'');
		num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	return num
}

export default FormatNumber;