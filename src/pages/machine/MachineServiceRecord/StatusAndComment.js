import React, { useState, memo, useEffect } from 'react'
import PropTypes from 'prop-types';
import { Grid, Box, Divider, Chip, TableRow, TableCell, Checkbox, Typography, Tooltip, Badge, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { fDate, fDateTime } from '../../../utils/formatTime';
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
    const [activeIndex, setActiveIndex] = useState(null);
    const [expanded, setExpanded] = useState(false);

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

  return (
    <>
    <TableRow key={childRow._id} sx={{":hover": {  backgroundColor: "#dbdbdb66" } }}>
    <Accordion
      sx={{":hover": {  backgroundColor: "#dbdbdb66" } }}
      key={childIndex?._id}
      expanded={expanded === `${index}${childIndex}`}
      onChange={childRow?.historicalData?.length > 0 && handleChange(`${index}${childIndex}`)}
    >
    <AccordionSummary
        sx={{ mt: expanded && 0.  }}
        expandIcon={childRow?.historicalData?.length > 0 && <Iconify icon="eva:arrow-ios-downward-fill" />}
        onClick={() => handleAccordianClick(`${index}${childIndex}`)}
    >
      <Grid sx={{width:'100%'}}>
        <Grid sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }} >
          <Typography variant="body2" ><b>{`${childIndex+1}). `}</b>{`${childRow.name}`}</Typography>
          {childRow?.checkItemValue && <Typography variant="body2" sx={{color: 'text.disabled'}}>Last Modified: {fDateTime(childRow?.createdAt)}{` by `}{`${childRow?.valueCreatedBy?.name || ''}`.toUpperCase()} {` at version (${childRow?.serviceRecord?.versionNo || 1})`}</Typography>}
        </Grid>
        {childRow?.checkItemValue && <Grid sx={{ mt:1,
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' }}>
          <Typography variant="body2" sx={{mr:1}}>
              <b>Value: </b>
              {childRow?.inputType.toLowerCase() === 'boolean' && childRow?.checkItemValue && <Iconify
                sx={{mb:-0.5}}
                color={childRow?.checkItemValue ? '#008000' : '#FF0000'} 
                icon={childRow?.checkItemValue ? 'ph:check-square-bold' : 'charm:square-cross' } />}

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
        <Grid sx={{  
          alignItems: 'center',
          whiteSpace: 'pre-line',
          wordBreak: 'break-word' }}>
          {childRow?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${childRow?.comments}`}</Typography>}
        </Grid>
      </Grid>
      </AccordionSummary>
      {childRow?.historicalData && childRow?.historicalData?.length > 0 && <AccordionDetails >
        <Grid sx={{ width: '100%' }} >
        {childRow?.historicalData?.map((ItemHistory, ItemIndex ) => (<>
            {ItemIndex === 0 && <Divider  sx={{ borderStyle: 'solid' }} />}
            <Box
              rowGap={2}
              columnGap={2}
              display="flex"
              justifyContent="space-between"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            >
              <Typography variant="body2" >{fDateTime(ItemHistory?.createdAt)}{` By ${ItemHistory?.createdBy?.name || ''}: `}</Typography>
              {/* <Typography variant="body2" >{ItemHistory?.createdBy?.name || ''}</Typography> */}
              <Typography variant="body2" sx={{mr:1.6}}>{ItemHistory?.checkItemValue || ''}</Typography>
            </Box>
            <Typography variant="body2" >{ItemHistory?.comments || ''}</Typography>
            <Divider  sx={{ borderStyle: 'solid' }} />
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