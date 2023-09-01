import { useEffect, memo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid,Switch} from '@mui/material';

ViewFormSWitch.propTypes = {
  sm: PropTypes.number,
  isActiveHeading: PropTypes.string,
  isActive: PropTypes.bool,
  customerAccessHeading: PropTypes.string,
  customerAccess: PropTypes.bool,
  customer: PropTypes.bool,
  customerHeading: PropTypes.string,
  machine: PropTypes.bool,
  machineHeading: PropTypes.string,
  drawing: PropTypes.bool,
  drawingHeading:PropTypes.string,
  isMultiFactorAuthentication:PropTypes.string,
  isMultiFactorAuthenticationVal:PropTypes.bool,
};

function ViewFormSWitch({sm, isActiveHeading, isActive, isMultiFactorAuthentication, isMultiFactorAuthenticationVal, customerAccessHeading, customerAccess, customer, customerHeading, machine, machineHeading, drawing, drawingHeading}) {
    const [isActiveVal, setIsActiveVal] = useState(isActive);
    const [customerAccessVal, setCustomerAccessVal] = useState(customerAccess);
    const [multiFactorAuthenticationVal, setIsMultiFactorAuthenticationVal] = useState(isMultiFactorAuthenticationVal)
    useEffect(() => {
        setIsActiveVal(isActive);
    },[isActive])

    useEffect(() => {
        setCustomerAccessVal(customerAccess);
    },[customerAccess])

    const handleIsActiveChange = (event) => {
        setIsActiveVal(event.target.checked);
      };

      const handleMultiFactorAuthentication = (event) => {
        setIsMultiFactorAuthenticationVal(event.target.checked);
      };

    const handleCustomerAccessChange = (event) => {
        setCustomerAccessVal(event.target.checked);
    };

    return (
      <Grid item xs={12} sm={sm || 12} sx={{  display: 'flex', alignContent:'center',mt:-1}}>
       
        {customerAccess && (
        <Grid sx={{  display: 'flex', mx:1 }}>
          <Typography
          variant="subtitle2"
          sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {customerAccessHeading || ''}
        </Typography>
          <Switch
              sx={{ mb: 1 }}
              checked={customerAccessVal || false}
              onChange={handleCustomerAccessChange}
              />
          </Grid>
        ) }

        { isActiveHeading && (
        <Grid sx={{  display: 'flex', alignItems: 'center', mx:1 }}>
          <Typography
          variant="subtitle2"
          sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex',  }}
         >
          {isActiveHeading || ''}
        </Typography>
          <Switch
          disabled
              sx={{ mb: 0.6 }} checked={isActiveVal || false}
              onChange={handleIsActiveChange}
              />
          </Grid>
        )}

        { isMultiFactorAuthentication && (
                <Grid sx={{  display: 'flex', mx:1 }}>
                  <Typography
                  variant="subtitle2"
                  sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
                >
                  {isMultiFactorAuthentication || ''}
                </Typography>
                  <Switch
                  disabled
                      sx={{ mb: 1 }} checked={multiFactorAuthenticationVal || false}
                      onChange={handleMultiFactorAuthentication}
                      />
                  </Grid>
                )}



        {customerHeading && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
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

        {machineHeading && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
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

        {drawingHeading && 
          <Grid sx={{  display: 'flex', mx:1 }}>
        <Typography
          variant="subtitle2"
          sx={{ pl: 1, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
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

export default memo(ViewFormSWitch)