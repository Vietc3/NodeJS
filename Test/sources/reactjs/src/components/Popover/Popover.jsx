import React from 'react';
import Popover from '@material-ui/core/Popover';
import MoreVert from "@material-ui/icons/MoreVert";
export default function SimplePopover(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
	
	const {
		Title, 
		Content, 
		anchorOrigin, 
		transformOrigin, 
		buttonStyle,
		buttonTheme, 
    buttonProps,
		...rest
  } = props;
  return (
    <div>
			<div {...rest} onClick={handleClick} style={buttonStyle}>
      <MoreVert></MoreVert>
			</div>
      {Content !== null? 
				(<Popover
        id={id}
        open={ open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
        >
        <div style={{padding: '5px'}} onClick={()=>handleClose()}>
					{Content}
				</div>
      </Popover>) : null}
    </div>
  );
}