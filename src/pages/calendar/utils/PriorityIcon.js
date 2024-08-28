import React from 'react';
import PropTypes from 'prop-types';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

const PriorityIcon = ({ priority }) => {
    switch (priority) {
        case 'Highest':
            return <KeyboardDoubleArrowUpRoundedIcon color="error" />;
        case 'High':
            return <KeyboardArrowUpRoundedIcon color="error" />;
        default:
            return '';
    }
};

PriorityIcon.propTypes = {
    priority: PropTypes.string,
};

export default PriorityIcon;
