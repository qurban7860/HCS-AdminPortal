import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Divider, IconButton, Chip } from '@mui/material';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import CopyIcon from '../../../components/Icons/CopyIcon';
import { setContactDialog, getContact } from '../../../redux/slices/customer/contact';
import ServiceReportAuditLogs from './ServiceReportAuditLogs';

const HistoryNotes = ({ historicalData }) =>  {

  const dispatch = useDispatch()
  const [showHistory, setShowHistory] = useState(false);
  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const handleContactDialog = useCallback( async ( customerId, contactId ) => {
    await dispatch( getContact( customerId, contactId ) )
    await dispatch( setContactDialog( true ) )
  },[ dispatch ])

return(
  <>
  { Array.isArray(historicalData) && historicalData?.length > 0 && <Grid container item md={12} sx={{ px: 0.5 }} >
      <Grid container item md={12} sx={{ display: 'flex', justifyContent: "flex-start" , alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word'  }}>
        {/* <Typography variant="body2" sx={{ color: 'text.disabled', cursor: "pointer" }} onClick={toggleHistory} >
          <b>{`${showHistory ? "Hide " : "Show "} more:`}</b>
        </Typography> */}
        <StyledTooltip
          tooltipcolor='#2065D1'
          placement="top"
          title={`${showHistory ? "Hide " : "Show "} history
          `}
        >
          <IconButton onClick={toggleHistory}>
          {   /*  <Iconify icon={showHistory ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />  */  }
           <Iconify icon='mdi:history' />
          </IconButton>
        </StyledTooltip>
      </Grid>
      {showHistory && <Grid item md={12} sx={{ backgroundColor: '#f3f4f594', mb: 1, borderRadius: '7px', border: '1px solid #e1e1e1' }}>
        {historicalData?.map((historyItem, itemIndex) => (
          <React.Fragment key={historyItem?._id}>
            {itemIndex !== 0 && <Divider sx={{ borderStyle: 'solid', mx: 1 }} />}
              <Grid item md={12} sx={{p:1}}  >
                <Grid sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>

                  {historyItem?.note && (
                    <Typography variant="body2" >
                      {` ${historyItem?.note || ''}`}
                      {historyItem?.note?.trim() && <CopyIcon value={historyItem?.note} />}
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ color: 'text.disabled', alignItems: "center", display: "flex", width:"100%" }}>
                    <>
                      { Array.isArray( historyItem?.technicians ) && historyItem?.technicians?.length > 0 && (
                        <>
                            <b>Technician:</b>
                          {historyItem?.technicians?.map(op => (
                            <Chip
                              key={op._id}
                              sx={{ m: 0.5 }}
                              label={`${op.firstName || ''} ${op.lastName || ''}`}
                              onClick={() => handleContactDialog(op.customer?._id, op._id)}
                            />
                          ))}
                        </>
                      )}
                      { Array.isArray( historyItem?.operators ) && historyItem?.operators?.length > 0 && (
                        <>
                            <b>Operators:</b>
                          {historyItem?.operators?.map(op => (
                            <Chip
                              key={op._id}
                              sx={{ m: 0.5 }}
                              label={`${op.firstName || ''} ${op.lastName || ''}`}
                              onClick={() => handleContactDialog(op.customer?._id, op._id)}
                            />
                          ))}
                        </>
                      )}
                    </>
                  </Typography>
                      <ServiceReportAuditLogs data={ historyItem || null } />
                </Grid>
              </Grid>
          </React.Fragment>
        ))}
      </Grid>}
    </Grid>}
  </>
)};



HistoryNotes.propTypes = {
  historicalData: PropTypes.array,
};

export default HistoryNotes;
