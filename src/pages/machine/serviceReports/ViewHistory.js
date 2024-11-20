import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Chip } from '@mui/material';
import HistoryNotes from './HistoryNotes';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import CopyIcon from '../../../components/Icons/CopyIcon';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import { fDateTime } from '../../../utils/formatTime';

const ViewHistory = ({ historicalData, title, isLoading, onEdit }) => {

  const dispatch = useDispatch()
  const currentData = ( Array.isArray(historicalData) && historicalData?.length > 0 ) && historicalData[0] || null;
  const hasTechnician = Boolean(currentData?.technician);
  const hasOperators = Array.isArray(currentData?.operators) && currentData?.operators.length > 0;
  const filteredHistoricalData = Array.isArray(historicalData) && historicalData?.slice(1) || [];
  
  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

  const onDelete = async () => {
    // await dispatch( setContactDialog( true ) )
  }

  return (
    <Grid container >
      <Grid container item md={12} sx={{ px: 0.5, pt: 1, display:"block", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word'  }}>
        <Typography variant="body2" sx={{color: 'text.disabled', }}>
          <Typography variant="overline" sx={{color: 'text.disabled', display: "flex", justifyContent: "space-between", alignItems: 'center', whiteSpace: 'pre-line', overflowWrap: 'break-word' }}>{`${title || "Notes"}:`}
            <Grid sx={{ position: "relative", mb: -2 }} >
              <ViewFormEditDeleteButtons 
                onDelete={onDelete}
                handleEdit={onEdit}
              />
            </Grid>
          </Typography>
          {currentData?.note || ""}{ currentData?.note?.trim() && <CopyIcon value={currentData?.note}/> }
        </Typography>
        <Typography variant="body2" sx={{ px: 0.5, color: 'text.disabled', alignItems: "center", display: "flex", width:"100%" }}>
          <>
            {hasTechnician && (
              <>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  <b>Technician:</b>
                </Typography>
                <Chip 
                  sx={{ m: 0.5 }}
                  label={`${currentData?.technician?.firstName || ''} ${currentData?.technician?.lastName || ''}`}
                  onClick={() => handleContactDialog(currentData?.technician?.customer?._id, currentData?.technician?._id)}
                />
              </>
            )}
            {hasOperators && (
              <>
                <Typography variant="overline" sx={{ color: 'text.disabled' }}>
                  <b>Operators:</b>
                </Typography>
                {currentData?.operators?.map(op => (
                  <Chip
                    key={op._id}
                    sx={{ m: 0.5 }}
                    label={`${op.firstName || ''} ${op.lastName || ''}`}
                    onClick={() => handleContactDialog(op.customer?._id, op._id)}
                  />
                ))}
              </>
            )}
            {currentData?.updatedBy && 
              <Typography variant="overline" sx={{ color: 'text.disabled', ml:"auto"  }}>
                <i><b>Last Modified: </b>{fDateTime(currentData?.createdAt)}{` by `}{`${ currentData?.updatedBy?.name || ''}`}</i>
              </Typography>
            }
          </>
        </Typography>
      </Grid>
      { Array.isArray(filteredHistoricalData) && filteredHistoricalData?.length > 0 && 
        <HistoryNotes title={title} historicalData={filteredHistoricalData} />
      }
    </Grid>
  );
};

ViewHistory.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  historicalData: PropTypes.array,
  onEdit: PropTypes.func,
};

export default ViewHistory;
