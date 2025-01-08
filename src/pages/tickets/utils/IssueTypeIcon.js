import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const IssueTypeIcon = ({ issueType }) => {
    switch (issueType) {
        case 'System Problem':
            return <Icon icon="material-symbols:problem-rounded" width={24} height={24} color="#FF5722" />;
        case 'Change Request':
            return <Icon icon="mdi:file-document-edit-outline" width={24} height={24} color="#2196F3" />;
        case 'System Incident':
            return <Icon icon="mdi:alert-circle-outline" width={24} height={24} color="#FF9800" />;
        case 'Service Request':
            return <Icon icon="mdi:account-cog-outline" width={24} height={24} color="#4CAF50" />;
        default:
            return null;
    }
};

IssueTypeIcon.propTypes = {
    issueType: PropTypes.string.isRequired,
};

export default IssueTypeIcon;
