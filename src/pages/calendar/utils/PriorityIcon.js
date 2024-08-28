import React from 'react';
import PropTypes from 'prop-types';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

const PriorityIcon = ({ priority }) => {
    switch (priority) {
        case 'High':
            return <KeyboardArrowUpRoundedIcon color="error" />;
        case 'Low':
            return <KeyboardArrowDownRoundedIcon color="success" />;
        default:
            return '';
    }
};

PriorityIcon.propTypes = {
    priority: PropTypes.string,
};

export default PriorityIcon;
