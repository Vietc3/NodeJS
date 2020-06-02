import notificationsStyle from "assets/jss/material-dashboard-pro-react/views/notificationsStyle.jsx";

// import buttonsStyle from "assets/jss/material-dashboard-pro-react/views/buttonsStyle.jsx";
import regularFormsStyle from "assets/jss/material-dashboard-pro-react/views/regularFormsStyle";

const MyAccountStyle = (theme)=>({
	...notificationsStyle(theme),
	...regularFormsStyle
});

export default MyAccountStyle;