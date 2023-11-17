import React, { useState, memo } from 'react'
import PropTypes from 'prop-types';
import { Grid, Divider, Chip, TableRow, Typography } from '@mui/material';
import { fDate } from '../../../utils/formatTime';
import Iconify from '../../../components/iconify';
import CopyIcon from '../../components/Icons/CopyIcon';
import HistoryDropDownUpIcons from '../../components/Icons/HistoryDropDownUpIcons';
import ViewFormServiceRecordVersionAudit from '../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTableRow } from '../../../theme/styles/default-styles';


const StatusAndComment = ({index, childIndex, childRow}) => {

    const [activeIndex, setActiveIndex] = useState(null);

    const handleAccordianClick = (accordianIndex) => {
      if (accordianIndex === activeIndex) {
        setActiveIndex(null);
      } else {
        setActiveIndex(accordianIndex);
      }
    };

  return (
    <TableRow key={childRow._id} sx={{ backgroundColor: 'none',}} >
    <Grid item md={12} sx={{mt: childIndex !==0 && 0.5, p:1,  border: '1px solid #e8e8e8',  borderRadius:'7px',backgroundColor: 'white' }} >
      <Grid item md={12} sx={{ display: childRow?.recordValue?.checkItemValue ? 'block' : 'flex'}}>
        <Typography variant="body2" ><b>{`${index+1}.${childIndex+1}- `}</b>{`${childRow.name}`}</Typography>
        {childRow?.recordValue?.checkItemValue && 
          <Grid >
            <Grid sx={{ mt:1,
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              <Typography variant="body2" >
                  <b>Value: </b>
                  {childRow?.inputType.toLowerCase() === 'boolean' && childRow?.recordValue?.checkItemValue && <Iconify
                    sx={{mb:-0.5}}
                    color={childRow?.recordValue?.checkItemValue === true || childRow?.recordValue?.checkItemValue  === 'true' ? '#008000' : '#FF0000'} 
                    icon={ childRow?.recordValue?.checkItemValue === true || childRow?.recordValue?.checkItemValue  === 'true' ? 'ph:check-square-bold' : 'charm:square-cross' } />}
                  {childRow?.inputType.toLowerCase() === 'date' ? fDate(childRow?.recordValue?.checkItemValue) : 
                    <> 
                      {childRow?.inputType.toLowerCase() === 'status' ? (childRow?.recordValue?.checkItemValue && 
                        <Chip size="small" label={childRow?.recordValue?.checkItemValue} /> || '') : 
                        (childRow?.inputType.toLowerCase() === 'number' || 
                        childRow?.inputType.toLowerCase() === 'long text' || 
                        childRow?.inputType.toLowerCase() === 'short text') && 
                        childRow?.recordValue?.checkItemValue 
                      }
                        {childRow?.recordValue?.checkItemValue?.trim() && childRow?.inputType?.toLowerCase() !== 'boolean' && <CopyIcon value={childRow?.recordValue?.checkItemValue}/>}
                    </> 
                }
              </Typography>
            </Grid>
            <Grid sx={{ 
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              {childRow?.recordValue?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{childRow?.recordValue?.comments}
                {childRow?.recordValue?.comments?.trim() && <CopyIcon value={childRow?.recordValue?.comments || ''} />}
              </Typography>}
            </Grid>
          <ViewFormServiceRecordVersionAudit value={childRow?.recordValue}/>
          </Grid>
        }
        {childRow?.historicalData && childRow?.historicalData?.length > 0 &&  <>
            <HistoryDropDownUpIcons showTitle="Show History" hideTitle="Hide History" activeIndex={`${activeIndex || ''}`} indexValue={`${index}${childIndex}`} onClick={handleAccordianClick}/>
          </>}
      </Grid>

      {activeIndex === `${index}${childIndex}` && childRow?.historicalData && childRow?.historicalData?.length > 0 && 
        <Grid item md={12} sx={{ backgroundColor: '#f3f4f594', p:1, borderRadius:'7px', border: '1px solid #e1e1e1'}} >
          {childRow?.historicalData?.map((ItemHistory, ItemIndex ) => (<>
              {ItemIndex !== 0 && <Divider  sx={{ borderStyle: 'solid' }} />}
            {ItemHistory?.checkItemValue && <Grid sx={{ mt:0.5,
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
                      {ItemHistory?.checkItemValue?.trim() && childRow?.inputType?.toLowerCase() !== 'boolean' && <CopyIcon value={ItemHistory?.comments} />}
                    </> 
                }
              </Typography>
            </Grid>}
           
            <Grid sx={{  
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}>
              {ItemHistory?.comments && <Typography variant="body2" sx={{mr:1}} ><b>Comment: </b>{` ${ItemHistory?.comments || ''}`}
              {ItemHistory?.comments?.trim() && <CopyIcon value={childRow?.comments} /> }
              </Typography>}
            </Grid>
            <ViewFormServiceRecordVersionAudit value={ItemHistory}/>
          </>))}
        </Grid>}
      </Grid>
    </TableRow>
  )
}
StatusAndComment.propTypes = {
    index: PropTypes.number,
    childIndex: PropTypes.number,
    childRow: PropTypes.object,
  };
export default memo(StatusAndComment)