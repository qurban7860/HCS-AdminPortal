import React from 'react';
import PropTypes from 'prop-types';
import { blue } from '@mui/material/colors';

import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import DragHandleRoundedIcon from '@mui/icons-material/DragHandleRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

const PriorityIcon = ({ priority, noMediumIcon }) => {
    switch (priority) {
        case 'High':
            return <KeyboardArrowUpRoundedIcon color="error" />;
        case 'Medium':
            if (!noMediumIcon) {
                return <DragHandleRoundedIcon color="warning" />;
            }
            return '';
        case 'Low':
            return <KeyboardArrowDownRoundedIcon sx={{ color: blue[400] }} />;
        default:
            return '';
    }
};

PriorityIcon.propTypes = {
    priority: PropTypes.string,
    noMediumIcon: PropTypes.bool,
};

export default PriorityIcon;
