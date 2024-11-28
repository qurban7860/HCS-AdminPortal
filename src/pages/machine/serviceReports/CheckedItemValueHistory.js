import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Divider, IconButton } from '@mui/material';
import Iconify from '../../../components/iconify';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import CheckedItemValueHistoryItem from './CheckedItemValueHistoryItem';

const CheckedItemValueHistory = ({ historicalData, inputType }) => {
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <Grid container display='flex' >
        <StyledTooltip tooltipcolor='#2065D1' placement="top" title={showHistory?"Hide History":"Show History"}>
          <IconButton onClick={toggleHistory}><Iconify icon="mdi:history" /></IconButton>
        </StyledTooltip>
      {showHistory && (
        <Grid item md={12} sx={{ backgroundColor: '#f3f4f594', p: 1, borderRadius: '7px', border: '1px solid #e1e1e1' }}>
          {historicalData?.map((itemHistory, itemIndex) => (
            <>
              {itemIndex !== 0 && <Divider sx={{ borderStyle: 'solid', mx: -1 }} />}
              <CheckedItemValueHistoryItem key={itemIndex} historyItem={itemHistory} inputType={inputType} />
            </>
          ))}
        </Grid>
      )}
    </Grid>
  );
};


CheckedItemValueHistory.propTypes = {
  historicalData: PropTypes.array,
  inputType: PropTypes.string,
};

export default CheckedItemValueHistory;
