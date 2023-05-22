import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid,Switch} from '@mui/material';

ViewFormSWitch.propTypes = {
    isActive: PropTypes.bool,
};



    export default function ViewFormSWitch({isActive}) {
    const [isActiveVal, setIsActiveVal] = useState(isActive);
    useEffect(() => {
        setIsActiveVal(isActive);
    },[isActive])
    
    const handleIsActiveChange = (event) => {
        setIsActiveVal(event.target.checked);
      };
    return (
        <Grid item xs={12} sm={12} sx={{pt: 3,display:'flex', }}>
        <Typography variant="overline" sx={{ pl:2,pb:1, color: 'text.disabled',display:'flex', alignItems:'center' }}>
             Active
           </Typography>
         <Switch sx={{ mb: 1 }} checked={isActiveVal || false} onChange={handleIsActiveChange} disabled />
       </Grid>
    )
}