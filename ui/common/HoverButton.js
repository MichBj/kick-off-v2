import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  buttonSpacing: {
    margin: theme.spacing(0.5),
  },
}));

const HoverButton = ({ style, onMouseEnter, onMouseLeave, children }) => {
  const [hovered, setHovered] = useState(false);
  const classes = useStyles();

  const handleMouseEnter = () => {
    setHovered(true);
    onMouseEnter && onMouseEnter();
  };

  const handleMouseLeave = () => {
    setHovered(false);
    onMouseLeave && onMouseLeave();
  };

  const buttonStyles = {
    ...style,
    backgroundColor: hovered ? '#BDCA32' : '#384152',
    color: '#FFFFFF',
  };

  return (
    <Button
      size="small"
      sx={{ mb: 2 }}
      color="primary"
      className={classes.buttonSpacing}
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </Button>
  );
};

export default HoverButton;
