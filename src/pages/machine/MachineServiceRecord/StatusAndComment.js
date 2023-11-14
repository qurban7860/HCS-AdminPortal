import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Box, Divider, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip, Badge, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
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



const StatusAndComment = ({index, childIndex, childRow}) => {

    const { machineServiceRecord } = useSelector((state) => state.machineServiceRecord);
    const [checkItem, setCheckItem] = useState({});
    const [historyAnchorEl, setHistoryAnchorEl] = useState(null);
    const [history, setHistory] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [expanded, setExpanded] = useState(false);
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

    const handleChange = (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
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
    <TableRow key={childRow._id} sx={{":hover": {  backgroundColor: "#dbdbdb66" },borderRadius: 30  }}>
    <Accordion
      sx={{":hover": {  backgroundColor: "#dbdbdb66" },backgroundColor: expanded === `${index}${childIndex}` ? "#dbdbdb66" : ''}}
      key={childIndex?._id}
      expanded={expanded === `${index}${childIndex}`}
      onChange={childRow?.historicalData?.length > 0 && handleChange(`${index}${childIndex}`)}
    >
    <AccordionSummary
        sx={{ mt: expanded && 0.6, display:'flex'  }}
        expandIcon={childRow?.historicalData?.length > 0 && <Iconify icon="eva:arrow-ios-downward-fill" sx={{ml:'auto',mt:'auto'}}/>}
        onClick={() => handleAccordianClick(`${index}${childIndex}`)}
    >
      <Grid sx={{width:'100%'}}>
        <Grid sx={{ width: '100%' }} >
          <Typography variant="body2" ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}</Typography>
        </Grid>
        {childRow?.checkItemValue && <Grid sx={{ mt:1,
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' }}>
          <Typography variant="body2" sx={{mr:1}}>
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
                </> 
            }
          </Typography>
        </Grid>}
        <Grid sx={{display: 'flex', justifyContent:'end'}}>
            <StyledTooltip
                arrow
                title="Copy"
                placement='top'
                tooltipcolor={theme.palette.primary.main}
              >
              <Iconify icon="tabler:clipboard-copy" sx={{ cursor: 'pointer'}} onClick={()=> copyTextToClipboard(childRow?.comments)}/>
            </StyledTooltip>
        </Grid>
        <Grid sx={{  
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' }}>
          {childRow?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${childRow?.comments}`}</Typography>}
        </Grid>
        <Grid display="flex">
            {childRow?.checkItemValue && <Typography variant="body2" sx={{color: 'text.disabled',ml:'auto'}}>Last Modified: {fDateTime(childRow?.valueCreatedAt)}{` by `}{`${childRow?.valueCreatedBy?.name || ''}`} {` at version (${childRow?.serviceRecord?.versionNo|| 1})`}</Typography>}
        </Grid>
      </Grid>
      </AccordionSummary>
      {childRow?.historicalData && childRow?.historicalData?.length > 0 && 
      <AccordionDetails >
        <Grid sx={{ width: '100%' }} >
        {childRow?.historicalData?.map((ItemHistory, ItemIndex ) => (<>
          
            {ItemIndex === 0 && <Divider  sx={{ borderStyle: 'solid' }} />}

            {ItemHistory?.checkItemValue && <Grid sx={{ mt:1,
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              <Typography variant="body2" sx={{mr:1}}>
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
                         ItemHistory?.checkItemValue || '' 
                      }
                    </> 
                }
              </Typography>
            </Grid>}
            {ItemHistory?.comments && <Grid sx={{display: 'flex', justifyContent:'end'}}>
                <StyledTooltip
                    arrow
                    title="Copy"
                    placement='top'
                    tooltipcolor={theme.palette.primary.main}
                  >
                  <Iconify icon="tabler:clipboard-copy" sx={{ cursor: 'pointer'}} onClick={()=> copyTextToClipboard(ItemHistory?.comments)}/>
                </StyledTooltip>
            </Grid>}
            <Grid sx={{  
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              {ItemHistory?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${ItemHistory?.comments || ''}`}</Typography>}
            </Grid>
            <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'end'}} >
              {ItemHistory?.checkItemValue && <Typography variant="body2" sx={{color: 'text.disabled'}}>Modified at: {fDateTime(ItemHistory?.createdAt)}{` by `}{`${ItemHistory?.createdBy?.name || ''} at version (${ItemHistory?.serviceRecord?.versionNo || 1})`}</Typography>}
            </Grid>
            {ItemHistory?.checkItemValue && <Divider  sx={{ borderStyle: 'solid' }} />}
          </>))}
        </Grid>
      </AccordionDetails>}
      </Accordion>
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