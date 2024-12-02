import React, { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Chip } from '@mui/material';
import HistoryNotes from './HistoryNotes';
import ServiceReportAuditLogs from './ServiceReportAuditLogs';
import CopyIcon from '../../../components/Icons/CopyIcon';
import IconifyButton from '../../../components/Icons/IconifyButton';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';

const ViewNoteHistory = ({ label, historicalData, isEditing, onEdit, onDelete }) => {

  const dispatch = useDispatch()
  const [ currentData, setCurrentData ] = useState(null);
  const [ filteredHistoricalData, setFilteredHistoricalData ] = useState([]);

  useEffect(()=>{
    const Data = ( Array.isArray(historicalData) && historicalData?.length > 0 ) && historicalData[0] || null;
    setCurrentData( Data );
    setFilteredHistoricalData( Array.isArray(historicalData) && historicalData?.slice(1) || [] );
  },[ historicalData ])

  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

  return (
    <Grid container item md={12} >
      { label && currentData?.note?.trim() &&
        <Grid container item md={12}  >
          <FormLabel content={`${ label || currentData?.type || "Notes"}`} /> 
        </Grid>
      }
      { !isEditing &&
        <Grid container item md={12} sx={{ pt: 1, display:"block", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word'  }}>
          { currentData?.note && currentData?.note?.trim() &&
            <Typography variant="body2" sx={{color: 'text.disabled', whiteSpace: 'pre-line', overflowWrap: 'break-word' }} >
              {currentData?.note || ""}
              { currentData?.note?.trim() && <CopyIcon value={currentData?.note}/> }
              { onEdit && 
                <IconifyButton 
                  title='Edit'
                  icon='mdi:edit'
                  color='#103996'
                  onClick={ () => onEdit( currentData ) }
                />
              }
              { onDelete && 
                <IconifyButton 
                  title='Delete'
                  icon='mdi:delete'
                  color='#FF0000'
                  onClick={ () => onDelete( currentData ) }
                />
              }
            </Typography>
          }
          <Typography variant="body2" sx={{ color: 'text.disabled', alignItems: "center", whiteSpace: 'pre-line', overflowWrap: 'break-word', width:"100%" }}>
              { Array.isArray( currentData?.technicians ) && currentData?.technicians?.length > 0 && (
                <>
                  <b>Technicians:</b>
                  {currentData?.technicians?.map( t => (
                    t?.firstName && <Chip
                      size='small'
                      key={t?._id}
                      sx={{ m: 0.5 }}
                      label={`${t?.firstName || ''} ${t?.lastName || ''}`}
                      onClick={() => handleContactDialog(t?.customer?._id, t?._id)}
                    />
                  ))}
                </>
              )}
              { Array.isArray( currentData?.operators ) && currentData?.operators?.length > 0 && (
                <>
                  <b>Operators:</b>
                  {currentData?.operators?.map(op => (
                    op?.firstName && <Chip
                      size='small'
                      key={op?._id}
                      sx={{ m: 0.5 }}
                      label={`${op?.firstName || ''} ${op?.lastName || ''}`}
                      onClick={() => handleContactDialog(op?.customer?._id, op?._id)}
                    />
                  ))}
                </>
              )}
          </Typography>
          <ServiceReportAuditLogs data={ currentData || null } />
        </Grid>
      }
      { Array.isArray( filteredHistoricalData ) && filteredHistoricalData?.length > 0 &&
        <HistoryNotes historicalData={ filteredHistoricalData || [] } />
      }
    </Grid>
  );
};

ViewNoteHistory.propTypes = {
  label: PropTypes.string,
  isEditing: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  historicalData: PropTypes.array,
};

export default ViewNoteHistory;
