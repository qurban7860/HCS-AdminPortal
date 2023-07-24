import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid,Switch} from '@mui/material';
import { is } from 'date-fns/locale';

ViewFormSWitch.propTypes = {
  heading: PropTypes.string,
  isActive: PropTypes.bool,
  customerAccess: PropTypes.bool,
  customer: PropTypes.bool,
  customerHeading: PropTypes.string,
  machine: PropTypes.bool,
  machineHeading: PropTypes.string,
  drawing: PropTypes.bool,
  drawingHeading:PropTypes.string,
};

    export default function ViewFormSWitch({heading, isActive, customerAccess, customer, customerHeading, machine, machineHeading, drawing, drawingHeading}) {
    const [isActiveVal, setIsActiveVal] = useState(isActive);
    const [customerAccessVal, setCustomerAccessVal] = useState(customerAccess);
    useEffect(() => {
        setIsActiveVal(isActive);
    },[isActive])

    useEffect(() => {
        setCustomerAccessVal(customerAccess);
    },[customerAccess])

    const handleIsActiveChange = (event) => {
        setIsActiveVal(event.target.checked);
      };

    const handleCustomerAccessChange = (event) => {
        setCustomerAccessVal(event.target.checked);
    };

    return (
      <Grid item xs={12} sm={12} sx={{  display: 'flex' }}>
       
        {customerAccess && (
        <Grid sx={{  display: 'flex', mx:1 }}>
          <Typography
          variant="subtitle2"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {heading || ''}
        </Typography>
          <Switch
              sx={{ mb: 1 }}
              checked={customerAccessVal || false}
              onChange={handleCustomerAccessChange}
              />
          </Grid>
        ) }

        { isActive && (
        <Grid sx={{  display: 'flex', mx:1 }}>
          <Typography
          variant="subtitle2"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {heading || ''}
        </Typography>
          <Switch
          disabled
              sx={{ mb: 1 }} checked={isActiveVal || false}
              onChange={handleIsActiveChange}
              />
          </Grid>
        )}

        {customer && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {customerHeading || ''}
        </Typography>
        <Switch
          disabled
              sx={{ mb: 1 }} checked={customer || false}
              onChange={handleIsActiveChange}
              />
            </Grid>
              }

        {machine && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {machineHeading || ''}
        </Typography>
        <Switch
          disabled
              sx={{ mb: 1 }} checked={machine || false}
              onChange={handleIsActiveChange}
              />
              </Grid>
              }

        {drawing && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {drawingHeading || ''}
        </Typography>
        <Switch
          disabled
              sx={{ mb: 1 }} checked={drawing || false}
              onChange={handleIsActiveChange}
              />
              </Grid>}

      </Grid>
    );
}