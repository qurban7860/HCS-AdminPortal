import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, createTheme } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import PriorityIcon from './PriorityIcon';

const EventContent = ({ info }) => {
    const theme = createTheme(); 
    const { timeText, event } = info;
    const { start, priority, customer, machines, primaryTechnician, supportingTechnicians } = event.extendedProps;
    const supportingTechnicianNames = supportingTechnicians.map( (tech) => `${tech?.firstName || '' } ${tech?.lastName || '' }` ).join(', ');
    const title = `${primaryTechnician?.firstName || '' } ${primaryTechnician?.lastName || '' }${supportingTechnicianNames || '' }, ${customer?.name || '' }`;
    const machineNames = machines.map( (mc) => `${mc?.name ? `${mc?.name || '' } - ` : ''}${mc?.serialNo || '' }` ).join(', ');

  return (
    <StyledTooltip
        title={
            <Grid item>
                <Typography variant='body2'><strong>Time:</strong> {fDateTime(start)}</Typography>
                <Typography variant='body2'><strong>Technician:</strong> {`${primaryTechnician?.firstName || '' } ${primaryTechnician?.lastName || '' }`}</Typography>
                <Typography variant='body2'><strong>Customer:</strong> {customer.name}</Typography>
                { machines?.length > 0 && ( <Typography variant='body2'><strong>Machines:</strong> {machineNames}</Typography>)}
                { priority?.trim() && <Typography variant="body2"><strong>Priority:</strong> {priority}</Typography>}
            </Grid>
        }
        placement='top-start'
        tooltipcolor={theme.palette.primary.main}
    >
        <div className="fc-event-main-frame" style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10 }} >
            <PriorityIcon priority={priority} />
            <div className="fc-event-time" style={{ marginRight: 4 }}>{timeText}</div>
            <div className="fc-event-title-container" >
                <div className="fc-event-title fc-sticky">{title}</div>
            </div>
        </div>
    </StyledTooltip>
  );
};

EventContent.propTypes = {
    info: PropTypes.shape({
        timeText: PropTypes.string,
        event: PropTypes.shape({
            extendedProps: PropTypes.shape({
                start: PropTypes.string.isRequired,
                priority: PropTypes.string,
                customer: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
                machines: PropTypes.array,
                primaryTechnician: PropTypes.shape({
                    firstName: PropTypes.string.isRequired,
                    lastName: PropTypes.string.isRequired,
                }).isRequired,
                supportingTechnicians: PropTypes.array,
            }).isRequired,
        }).isRequired,
    }).isRequired,
};

export default EventContent;
