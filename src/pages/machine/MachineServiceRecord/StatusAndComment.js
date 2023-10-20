import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { HtmlTooltip, StyledTooltip } from '../../../theme/styles/default-styles';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

const StatusAndComment = ({index, childIndex, childRow}) => {

    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const [checkItem, setCheckItem] = useState({});

    useEffect(() => {
      setCheckItem(machineServiceRecord?.checkParams?.find((element) =>
        element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle 
        &&
        element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    
  return (
    <>
    <TableRow key={childRow._id} sx={{":hover": {  backgroundColor: "#dbdbdb66" } }}>
      <TableCell>
        <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mx:-2}} >
          <TableCell ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}<Iconify icon='material-symbols:history' sx={{mb:-0.6, mx:1, cursor: 'pointer'}} /></TableCell>
          <TableCell align='right' >
            <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>
            {childRow?.inputType === 'Boolean' ? 
            <Checkbox disabled checked={checkItem?.value || false }  sx={{ml:'auto', my:-0.9}} />  :
              <Typography variant="body2" >
                {childRow?.inputType === 'Date' ? fDate(checkItem?.date) : checkItem?.value }
              </Typography> }
              <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent:'flex-end' }}>
                {checkItem?.status && <Chip size="small" label={checkItem?.status} /> }
              </Grid>
            </Grid>
          </TableCell>
        </Grid>
        <Grid sx={{ml:5, }} >
          {checkItem?.comments && <Typography variant="body2" >{` ${checkItem?.comments}`}</Typography>}
        </Grid>
      </TableCell>
        
    </TableRow>
    
  </>
  )
}
StatusAndComment.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    childRow: PropTypes.object,
  };
export default memo(StatusAndComment)