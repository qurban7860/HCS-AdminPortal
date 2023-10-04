import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';

import Iconify from '../../../components/iconify';
import { HtmlTooltip, StyledTooltip } from '../../../theme/styles/default-styles';
import MenuPopover from '../../../components/menu-popover/MenuPopover';

const StatusAndComment = ({index, childIndex, childRow}) => {

    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const [visibilityAnchorEl, setVisibilityAnchorEl] = useState(null);
    const [checkItem, setCheckItem] = useState({});

    useEffect(() => {
      setCheckItem(machineServiceRecord?.checkParams?.find((element) =>
        element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle 
        &&
        element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleVisibilityPopoverOpen = () => {
        setVisibilityAnchorEl(true);
    };
    
    const handleVisibilityPopoverClose = () => {
        setVisibilityAnchorEl(false);
    };
    
  return (
    <>
    <TableRow key={childRow._id} sx={{":hover": {
        backgroundColor: "#dbdbdb66" }
      }}>
        <TableCell component="th" scope="row"><b>{`${childIndex+1}). `}</b>{`${childRow.name} ${childRow?.inputType ? '-' : '' } ${childRow?.inputType ? childRow?.inputType : '' }`}</TableCell>
        <TableCell align='right' >
          <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>
          {childRow?.inputType === 'Boolean' ? 
        <Checkbox  checked={
          machineServiceRecord?.checkParams?.find((element) =>
          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
          )?.value || false
          } readOnly sx={{ml:'auto', my:-0.9}} /> 
          :
          <Typography variant="body2" sx={{pr:1.5}}>
          {machineServiceRecord?.checkParams?.find((element) =>
            element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
            )?.value }
          </Typography> }

          <Grid sx={{ width:105,display: 'flex', alignItems: 'center', justifyContent:'flex-end' }}>
          {machineServiceRecord?.checkParams?.find((element) =>
          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
          )?.status && <Chip size="small" label={machineServiceRecord?.checkParams?.find((element) =>
          element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle && element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id
          )?.status} /> }

          {checkItem?.comments ? <HtmlTooltip
            placement="left"
            title={
              <>
                {/* <Typography color="inherit">Comments</Typography> */}
                {checkItem?.comments}
              </>
            }
          >
            <Iconify
              // onClick={()=> handleVisibilityPopoverOpen()}
              icon="mdi:comment-text-outline"
              sx={{ cursor: 'pointer',mx:0.4, color: 'green'  }}
              disabled={checkItem?.comments}
            />
          </HtmlTooltip> : 
          <StyledTooltip title="No Comments" placement="top" color="gray">
            <Iconify
              icon="mdi:comment-text-outline"
              sx={{ mx:0.4, color: 'gray', cursor: 'pointer' }}
              disabled={checkItem?.comments}
            />
          </StyledTooltip>
            }
          </Grid>

          </Grid>
        </TableCell>
      </TableRow>
    
    {/* <MenuPopover open={visibilityAnchorEl} onClose={handleVisibilityPopoverClose} sx={{ p: 2 }}>
      <Typography variant='subtitle1' width="100%"> Comments: </Typography>
      <Typography variant='body2' width="100%">{checkItem?.comments}</Typography>
    </MenuPopover> */}
  </>
  )
}
StatusAndComment.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    childRow: PropTypes.object,
  };
export default memo(StatusAndComment)