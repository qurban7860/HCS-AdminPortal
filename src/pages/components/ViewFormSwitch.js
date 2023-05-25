import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid,Switch} from '@mui/material';
import { is } from 'date-fns/locale';

ViewFormSWitch.propTypes = {
  heading: PropTypes.string,
  isActive: PropTypes.bool,
  customerAccess: PropTypes.bool,
};

    export default function ViewFormSWitch({heading, isActive, customerAccess}) {
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
        <Typography
          variant="overline"
          sx={{ pl: 2, pb: 1, color: 'text.disabled', display: 'flex', alignItems: 'center' }}
         >
          {heading || ''}
        </Typography>
        {customerAccess ? (
          <Switch
              sx={{ mb: 1 }}
              checked={customerAccessVal || false}
              onChange={handleCustomerAccessChange}
              />
          
        ) : (
          <Switch
              sx={{ mb: 1 }} checked={isActiveVal || false}
              onChange={handleIsActiveChange}
              />
        )}
      </Grid>
    );
}