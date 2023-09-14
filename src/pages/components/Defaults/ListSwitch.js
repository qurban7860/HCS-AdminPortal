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

          <Switch  checked={isActiveVal || false} onChange={handleIsActiveChange} disabled />

    )
}