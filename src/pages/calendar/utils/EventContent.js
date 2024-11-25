import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, createTheme } from '@mui/material';
import { fDateTime } from '../../../utils/formatTime';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import PriorityIcon from './PriorityIcon';
import Iconify from '../../../components/iconify';
import { StatusColor } from './StatusColor';

const EventContent = ({ info }) => {
    const theme = createTheme(); 
    const { timeText, event } = info;
    const { isCustomerEvent, start, priority, status, customer, machines, primaryTechnician, supportingTechnicians } = event.extendedProps;
    const supportingTechnicianNames = supportingTechnicians.map( (tech) => `${tech?.firstName || '' } ${tech?.lastName || '' }` ).join(', ');
    const title = `${primaryTechnician?.firstName || '' } ${primaryTechnician?.lastName || '' }${supportingTechnicianNames || '' }, ${customer?.name || '' }`;
    const machineNames = machines.map( (mc) => `${mc?.name ? `${mc?.name || '' } - ` : ''}${mc?.serialNo || '' }` ).join(', ');

  return (
    <StyledTooltip
        title={
            <Grid item>
                <Typography variant='body2'><strong>Time:</strong> {fDateTime(start)}</Typography>
                <Typography variant='body2'><strong>{isCustomerEvent ? 'Technician:' : 'Assignee:'}</strong> {`${primaryTechnician?.firstName || '' } ${primaryTechnician?.lastName || '' }`}</Typography>
                { isCustomerEvent && <Typography variant='body2'><strong>Customer:</strong> {customer.name}</Typography>}
                { machines?.length > 0 && isCustomerEvent && ( <Typography variant='body2'><strong>Machines:</strong> {machineNames}</Typography>)}
                { priority?.trim() && <Typography variant="body2"><strong>Priority:</strong> {priority}</Typography>}
                { status?.trim() && <Typography variant="body2"><strong>Status:</strong> {status}</Typography>}
            </Grid>
        }
        placement='top-start'
        tooltipcolor={theme.palette.primary.main}
    >
        <div className="fc-event-main-frame" style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 10, 
            textDecoration: status === 'Cancelled' ? 'line-through' : 'none',
            textDecorationColor: status === 'Cancelled' ? StatusColor(status) : 'inherit' }} >
            {status && (
              <div className="fc-event-status" style={{ marginRight: 4,  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Iconify
                  icon="fluent-mdl2:status-circle-inner" 
                  color={StatusColor(status)} 
                />
              </div>
            )}
            <div className="fc-event-time" style={{ marginRight: 4 }}>{timeText}</div>
            <div className="fc-event-title-container" >
                <div className="fc-event-title fc-sticky"  style={{ textDecoration: status === 'Cancelled' ? 'line-through' : 'none', textDecorationColor: status === 'Cancelled' ? StatusColor(status) : 'inherit' }}>{title}</div>
            </div>
            <PriorityIcon priority={priority} noMediumIcon />
        </div>
    </StyledTooltip>
  );
};

EventContent.propTypes = {
    info: PropTypes.shape({
        timeText: PropTypes.string,
        event: PropTypes.shape({
            extendedProps: PropTypes.shape({
                isCustomerEvent: PropTypes.bool.isRequired,
                start: PropTypes.any.isRequired,
                priority: PropTypes.string,
                status: PropTypes.string,
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


