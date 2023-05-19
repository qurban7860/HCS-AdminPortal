import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid,Switch} from '@mui/material';

ViewFormSWitch.propTypes = {
    isActive: PropTypes.bool,
    heading: PropTypes.string,
};



    export default function ViewFormSWitch({isActive, heading}) {
    const [isActiveVal, setIsActiveVal] = useState(isActive);
    useEffect(() => {
        setIsActiveVal(isActive);
    },[isActive])
    
    const handleIsActiveChange = (event) => {
        setIsActiveVal(event.target.checked);
      };
    return (
        <Grid item xs={12} sm={12} sx={{display:'flex', }}>
          <Typography sx={{ pl:2, pb:1, display:'flex', alignItems:'center' }}>
            {heading || ""}
          </Typography>
          <Switch  checked={isActiveVal || false} onChange={handleIsActiveChange} disabled />
       </Grid>
    )
}