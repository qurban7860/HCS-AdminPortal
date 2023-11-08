import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip, Badge } from '@mui/material';
import { useSelector } from 'react-redux';
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { HtmlTooltip, StyledTooltip } from '../../../theme/styles/default-styles';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import ViewFormHistoricalPopover from '../../components/ViewForms/ViewFormHistoricalPopover';
import IconTooltip from '../../components/Icons/IconTooltip';

const StatusAndComment = ({index, childIndex, childRow}) => {

    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const [checkItem, setCheckItem] = useState({});
    const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
    const [history, setHistory] = useState([]);

    const handleHistoryPopoverOpen = (event) => {
      setHistoryAnchorEl(event.currentTarget);
      setHistory(childRow?.historicalData)
    };
  
    const handleHistoryPopoverClose = () => {
      setHistoryAnchorEl(null);
      setHistory([])
    };

    // useEffect(() => {
    //   setCheckItem(machineServiceRecord?.checkParams?.find((element) =>
    //     element?.paramListTitle === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramListTitle 
    //     &&
    //     element?.serviceParam === machineServiceRecord?.serviceRecordConfig?.checkParams[index]?.paramList[childIndex]?._id));
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

  return (
    <>
    <TableRow key={childRow._id} sx={{":hover": {  backgroundColor: "#dbdbdb66" } }}>
      <TableCell>
        <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} >
          <TableCell ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}
            {childRow?.historicalData && childRow?.historicalData?.length > 0 && 
            <Badge badgeContent={childRow?.historicalData?.length} color="info" sx={{mb:-0.6, mx:1, cursor: 'pointer'}} onClick={handleHistoryPopoverOpen} >
              <Iconify
                title="History"
                icon="material-symbols:history"
                onClick={handleHistoryPopoverOpen}
                sx={{width: 25, height: 25}}
              />
            </Badge>}
          </TableCell>
          <TableCell align='right' >
            <Grid  sx={{display: { md:'flex', xs: 'block', }, justifyContent:'end'}}>

            {childRow?.inputType.toLowerCase() === 'boolean' ? 
              <Checkbox disabled checked={childRow?.checkItemValue || false }  sx={{ml:'auto', my:-0.9}} />  :
                <Typography variant="body2" >
                  {childRow?.inputType.toLowerCase() === 'date' ? fDate(childRow?.checkItemValue) : 
                  <Grid >
                    {childRow?.inputType.toLowerCase() === 'status' ? (childRow?.checkItemValue && <Chip size="small" label={childRow?.checkItemValue} /> || '') : childRow?.checkItemValue }
                  </Grid>
                  }
                </Typography> 
            }
              {/* <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent:'flex-end' }}>
                {childRow?.inputType.toLowerCase() === 'status' && <Chip size="small" label={childRow?.checkItemValue} /> }
              </Grid> */}
            </Grid>
          </TableCell>
        </Grid>
        <Grid sx={{          
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' }}>
          {childRow?.comments && <Typography variant="body2" >{` ${childRow?.comments}`}</Typography>}
        </Grid>
      </TableCell>
        
    </TableRow>
    <ViewFormHistoricalPopover
        open={historyAnchorEl }
        onClose={handleHistoryPopoverClose}
        ListArr={childRow?.historicalData || []}
        ListTitle= "History" />
  </>
  )
}
StatusAndComment.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    childRow: PropTypes.object,
  };
export default memo(StatusAndComment)