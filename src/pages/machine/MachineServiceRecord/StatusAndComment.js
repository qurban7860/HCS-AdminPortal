import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Box, Card, Divider, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip, Badge, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useSelector } from 'react-redux';
import { createTheme, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fDate, fDateTime } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import { HtmlTooltip, StyledTooltip } from '../../../theme/styles/default-styles';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import ViewFormHistoricalPopover from '../../components/ViewForms/ViewFormHistoricalPopover';
import ViewFormServiceRecordVersionAudit from '../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import ViewFormServiceRecordVersionHistoricalAudit from '../../components/ViewForms/ViewFormServiceRecordVersionHistoricalAudit';


const StatusAndComment = ({index, childIndex, childRow}) => {

    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const [checkItem, setCheckItem] = useState({});
    const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const theme = createTheme({
      palette: {
        success: green,
      },
    });



    const handleHistoryPopoverOpen = (event) => {
      setHistoryAnchorEl(event.currentTarget);
      setHistory(childRow?.historicalData)
    };
  
    const handleHistoryPopoverClose = () => {
      setHistoryAnchorEl(null);
      setHistory([])
    };

    const handleAccordianClick = (accordianIndex) => {
      if (accordianIndex === activeIndex) {
        setActiveIndex(null);
      } else {
        setActiveIndex(accordianIndex);
      }
    };


    const copyTextToClipboard = (textToCopy) => {
      try{
        const tempInput = document.createElement('input');
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      enqueueSnackbar("Coppied!");
      }catch(err){
        enqueueSnackbar('Copy Failed!');
      }
    };

  return (
    <>
    <TableRow key={childRow._id} >
      <Grid sx={{width:'100%'}}>
        <Grid sx={{ width: '100%' }} >
          <Typography variant="body2" ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}</Typography>
        </Grid>
        {childRow?.checkItemValue && 
        <Grid sx={{ml:1.5}}>
          <Grid sx={{ mt:1,
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word' }}>
            <Typography variant="body2" >
                <b>Value: </b>
                {childRow?.inputType.toLowerCase() === 'boolean' && childRow?.checkItemValue && <Iconify
                  sx={{mb:-0.5}}
                  color={childRow?.checkItemValue === true || childRow?.checkItemValue  === 'true' ? '#008000' : '#FF0000'} 
                  icon={ childRow?.checkItemValue === true || childRow?.checkItemValue  === 'true' ? 'ph:check-square-bold' : 'charm:square-cross' } />}

                {childRow?.inputType.toLowerCase() === 'date' ? fDate(childRow?.checkItemValue) : 
                  <> 
                    {childRow?.inputType.toLowerCase() === 'status' ? (childRow?.checkItemValue && 
                      <Chip size="small" label={childRow?.checkItemValue} /> || '') : 
                      (childRow?.inputType.toLowerCase() === 'number' || 
                      childRow?.inputType.toLowerCase() === 'long text' || 
                      childRow?.inputType.toLowerCase() === 'short text') && 
                      childRow?.checkItemValue 
                    }
                      {childRow?.checkItemValue?.trim() && childRow?.inputType?.toLowerCase() !== 'boolean' &&<StyledTooltip
                          arrow
                          title="Copy"
                          placement='top'
                          tooltipcolor={theme.palette.primary.main}
                        >
                        <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer',ml:1}} onClick={()=> copyTextToClipboard(childRow?.checkItemValue)}/>
                      </StyledTooltip>}
                  </> 
              }
            </Typography>
          </Grid>

          <Grid sx={{ 
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word' }}>
            {childRow?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${childRow?.comments}`}
            {childRow?.comments?.trim() && 
              <StyledTooltip
                  arrow
                  title="Copy"
                  placement='top'
                  tooltipcolor={theme.palette.primary.main}
                >
                <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer',ml:1 }} onClick={()=> copyTextToClipboard(childRow?.comments)}/>
              </StyledTooltip>}
              </Typography>}
          </Grid>
          {childRow?.historicalData && childRow?.historicalData?.length > 0 &&<Grid sx={{display: 'flex',}}>
            <Iconify icon={activeIndex === `${index}${childIndex}` ? "eva:arrow-ios-upward-fill" : "eva:arrow-ios-downward-fill" } 
            sx={{ml:'auto',mt:'auto',cursor: 'pointer'}}
            onClick={() => handleAccordianClick(`${index}${childIndex}`) }
            />
          </Grid>}
          <ViewFormServiceRecordVersionAudit value={childRow}/>
        </Grid>}

      </Grid>

      {activeIndex === `${index}${childIndex}` && childRow?.historicalData && childRow?.historicalData?.length > 0 && 
        <Grid sx={{ width: '100%',ml:1.5 }} >
          {childRow?.historicalData?.map((ItemHistory, ItemIndex ) => (<>
          
            {ItemIndex === 0 && <Divider  sx={{ borderStyle: 'solid' }} />}

            {ItemHistory?.checkItemValue && <Grid sx={{ mt:1,
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              <Typography variant="body2" sx={{mr:1, }}>
                  <b>Value: </b>
                  {childRow?.inputType?.toLowerCase() === 'boolean' && ItemHistory?.checkItemValue && <Iconify
                    sx={{mb:-0.5}}
                    color={ItemHistory?.checkItemValue === true || ItemHistory?.checkItemValue  === 'true' ? '#008000' : '#FF0000'} 
                    icon={ItemHistory?.checkItemValue  === true || ItemHistory?.checkItemValue  === 'true' ? 'ph:check-square-bold' : 'charm:square-cross' } />}

                  {childRow?.inputType?.toLowerCase() === 'date' ? fDate(ItemHistory?.checkItemValue) : 
                    <> 
                      {childRow?.inputType?.toLowerCase() === 'status' ? (ItemHistory?.checkItemValue && 
                        <Chip size="small" label={ItemHistory?.checkItemValue} /> || '') : 
                        (childRow?.inputType?.toLowerCase() === 'number' || 
                          childRow?.inputType?.toLowerCase() === 'long text' || 
                          childRow?.inputType?.toLowerCase() === 'short text') && 
                          ItemHistory?.checkItemValue  
                      }
                      {ItemHistory?.checkItemValue?.trim() && childRow?.inputType?.toLowerCase() !== 'boolean' && <StyledTooltip
                          arrow
                          title="Copy"
                          placement='top'
                          tooltipcolor={theme.palette.primary.main}
                        >
                        <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer',ml:1 }} onClick={()=> copyTextToClipboard(ItemHistory?.checkItemValue)}/>
                      </StyledTooltip>}
                    </> 
                }
              </Typography>
            </Grid>}
           
            <Grid sx={{  
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              {ItemHistory?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${ItemHistory?.comments || ''}`}
              {ItemHistory?.comments?.trim() && 
                <StyledTooltip
                    arrow
                    title="Copy"
                    placement='top'
                    tooltipcolor={theme.palette.primary.main}
                  >
                  <Iconify icon="mingcute:copy-line" sx={{ cursor: 'pointer', ml:1}} onClick={()=> copyTextToClipboard(ItemHistory?.comments)}/>
                </StyledTooltip>}
              </Typography>}
            </Grid>
            <ViewFormServiceRecordVersionHistoricalAudit value={ItemHistory}/>
            {ItemHistory?.checkItemValue && <Divider  sx={{ borderStyle: 'solid' }} />}
          </>))}
        </Grid>}
      {/* </Card> */}
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