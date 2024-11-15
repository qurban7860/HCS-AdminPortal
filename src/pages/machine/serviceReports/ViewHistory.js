import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Divider, IconButton } from '@mui/material';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import HistoryItem from './HistoryItem';
import ViewFormNoteField from '../../../components/ViewForms/ViewFormNoteField';

const ViewHistory = ({ historicalData, title, isLoading }) => {
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <Grid container sx={{ border: '1px solid #e1e1e1', borderRadius: '7px', mt:1, p:1, backgroundColor: '#f3f4f594'}} >
      <ViewFormNoteField 
        sm={12}
        isLoading={isLoading}
        heading={title}
        param={historicalData?.[0]?.comment || ""}
      />
      <StyledTooltip
        tooltipcolor='#2065D1'
        placement="top"
        title={showHistory ? "Hide History" : "Show History"}
      >
        <IconButton onClick={toggleHistory}>
          <Iconify icon={showHistory ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
        </IconButton>
      </StyledTooltip>

      {showHistory && (
        <Grid item md={12} sx={{ backgroundColor: '#f3f4f594', p: 1, borderRadius: '7px', border: '1px solid #e1e1e1' }}>
          {historicalData?.slice(1).map((itemHistory, itemIndex) => (
            <React.Fragment key={itemIndex + 1}>
              {itemIndex !== 0 && <Divider sx={{ borderStyle: 'solid', mx: -1 }} />}
              <HistoryItem historyItem={itemHistory} />
            </React.Fragment>
          ))}
        </Grid>
      )}
    </Grid>
  );
};


ViewHistory.propTypes = {
  isLoading: PropTypes.bool,
  title: PropTypes.string,
  historicalData: PropTypes.array,
};

export default ViewHistory;
