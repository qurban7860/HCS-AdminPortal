import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography, Divider, Chip, IconButton, Switch } from '@mui/material';
import CopyIcon from '../../../components/Icons/CopyIcon';
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import ViewFormServiceRecordVersionAudit from '../../../components/ViewForms/ViewFormServiceRecordVersionAudit';
import { StyledTooltip } from '../../../theme/styles/default-styles';

const CheckedItemValueHistory = ({ historicalData, inputType }) => {
  const [showHistory, setShowHistory] = useState(false);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  return (
    <Grid container display='flex' direction='row-reverse'>
        <StyledTooltip tooltipcolor='#2065D1' placement="top" title={showHistory?"Hide History":"Show History"}>
          <IconButton onClick={toggleHistory}><Iconify icon={showHistory?'eva:arrow-ios-upward-fill':'eva:arrow-ios-downward-fill'} /></IconButton>
        </StyledTooltip>
      {showHistory && (
        <Grid item md={12} sx={{ backgroundColor: '#f3f4f594', p: 1, borderRadius: '7px', border: '1px solid #e1e1e1' }}>
          {historicalData?.map((itemHistory, itemIndex) => (
            <>
              {itemIndex !== 0 && <Divider sx={{ borderStyle: 'solid', mx: -1 }} />}
              {itemHistory?.checkItemValue && (
                <Grid sx={{ mt: 0.5, alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <b>Value: </b>
                    {inputType.toLowerCase() === 'boolean' && itemHistory?.checkItemValue && (
                      <>
                        <Switch sx={{mt:-0.5}} size='small' disabled checked={itemHistory?.checkItemValue} />
                        <Iconify
                          sx={{ mb: -0.5 }}
                          color={itemHistory?.checkItemValue === true || itemHistory?.checkItemValue === 'true' ? '#008000' : '#FF0000'}
                          icon={itemHistory?.checkItemValue === true || itemHistory?.checkItemValue === 'true' ? 'ph:check-square-bold' : 'charm:square-cross'}
                        />
                      </>
                    )}
                    {inputType.toLowerCase() === 'date' ? (
                      fDate(itemHistory?.checkItemValue)
                    ) : (
                      <>
                        {inputType.toLowerCase() === 'status' ? (
                          itemHistory?.checkItemValue && <Chip size="small" label={itemHistory?.checkItemValue || ''} />
                        ) : (
                          (inputType.toLowerCase() === 'number' ||
                            inputType.toLowerCase() === 'long text' ||
                            inputType.toLowerCase() === 'short text') &&
                          itemHistory?.checkItemValue
                        )}
                        {itemHistory?.checkItemValue?.trim() && inputType.toLowerCase() !== 'boolean' && <CopyIcon value={itemHistory?.comments} />}
                      </>
                    )}
                  </Typography>
                </Grid>
              )}
              <Grid sx={{ alignItems: 'center', whiteSpace: 'pre-line', wordBreak: 'break-word' }}>
                {itemHistory?.comments && (
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    <b>Comment: </b>
                    {` ${itemHistory?.comments || ''}`}
                    {itemHistory?.comments?.trim() && <CopyIcon value={itemHistory?.comments} />}
                  </Typography>
                )}
              </Grid>
              <ViewFormServiceRecordVersionAudit value={itemHistory} />
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
