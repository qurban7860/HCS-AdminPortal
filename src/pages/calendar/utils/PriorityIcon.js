import React from 'react';
import PropTypes from 'prop-types';
import { blue } from '@mui/material/colors';

import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardDoubleArrowDownRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowDownRounded';

const PriorityIcon = ({ priority, noMediumIcon }) => {
    switch (priority) {
        case 'High':
            return <KeyboardDoubleArrowUpRoundedIcon color="error" />;
        case 'Medium':
            if (!noMediumIcon) {
                return <DragHandleRoundedIcon color="warning" />;
            }
            return '';
        case 'Low':
            return <KeyboardDoubleArrowDownRoundedIcon sx={{ color: blue[400] }} />;
        default:
            return '';
    }
};

PriorityIcon.propTypes = {
    priority: PropTypes.string,
    noMediumIcon: PropTypes.bool,
};

export default PriorityIcon;
