function UndoFormatNumber(num){
	num = num || "";
	num = num.toString();

	return num.split(",").join("");
	// return num;
}

export default UndoFormatNumber;