import React from 'react';
import PropTypes from 'prop-types';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

const PriorityIcon = ({ priority }) => {
  switch (priority) {
    case 'Highest':
      return <KeyboardDoubleArrowUpRoundedIcon color="error" />;
    case 'High':
      return <KeyboardArrowUpRoundedIcon color="error" />;
    case 'Medium':
      return <DragHandleRoundedIcon color="warning" />;
    case 'Low':
      return <KeyboardArrowDownRoundedIcon color="success" />;
    case 'Lowest':
      return <KeyboardDoubleArrowDownRoundedIcon color="success" />;
    default:
      return null;
  }
};

PriorityIcon.propTypes = {
  priority: PropTypes.string.isRequired,
};

export default PriorityIcon;
