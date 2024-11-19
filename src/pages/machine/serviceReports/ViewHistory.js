import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Chip } from '@mui/material';
import HistoryNotes from './HistoryNotes';
import ViewFormNoteField from '../../../components/ViewForms/ViewFormNoteField';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import { fDateTime } from '../../../utils/formatTime';

const ViewHistory = ({ historicalData, title, isLoading, start }) => {

  const dispatch = useDispatch()
  const currentData = historicalData?.find(hd => !hd?.isHistory);
  const hasTechnician = Boolean(currentData?.technician);
  const hasOperators = Array.isArray(currentData?.operators) && currentData?.operators.length > 0;
  const filteredHistoricalData = Array.isArray(historicalData) && historicalData?.filter( hd => hd?.isHistory );
  
  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

  return (
    <Grid container >
      <ViewFormNoteField 
        sm={12}
        isLoading={isLoading}
        heading={title}
        param={currentData?.note || ""}
      />
      <Grid container sx={{ px: 0.5, mt: -3, alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
      {hasTechnician && (
        <>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            <b>Technician:</b>
          </Typography>
          <Chip 
            sx={{ m: 0.5 }}
            label={`${currentData.technician.firstName || ''} ${currentData.technician.lastName || ''}`}
            onClick={() => handleContactDialog(currentData.technician.customer?._id, currentData.technician._id)}
          />
        </>
      )}

      {hasOperators && (
        <>
          <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            <b>Operators:</b>
          </Typography>
          {currentData.operators.map(op => (
            <Chip
              key={op._id}
              sx={{ m: 0.5 }}
              label={`${op.firstName || ''} ${op.lastName || ''}`}
              onClick={() => handleContactDialog(op.customer?._id, op._id)}
            />
          ))}
        </>
      )}
      </Grid>
      {currentData?.updatedBy && <Grid sx={{ px: 0.5, mt: ( currentData.operators || currentData.technician ) ? 0 : -2 }}>
          <Typography variant="body2" sx={{color: 'text.disabled',ml:'auto'}}>
            <Typography variant="overline" sx={{color: 'text.disabled',ml:'auto'}}>Last Modified: </Typography>
            {fDateTime(currentData?.createdAt)}{` by `}{`${ currentData?.updatedBy?.name || ''}`}
          </Typography>
      </Grid>}
      { Array.isArray(filteredHistoricalData) && filteredHistoricalData?.length > 0 && 
        <HistoryNotes historicalData={filteredHistoricalData} start={start} />
      }
    </Grid>
  );
};

ViewHistory.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  historicalData: PropTypes.array,
  start: PropTypes.bool,
};

export default ViewHistory;
