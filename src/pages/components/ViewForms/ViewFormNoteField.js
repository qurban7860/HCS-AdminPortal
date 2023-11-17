import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Typography, Grid} from '@mui/material';
import CopyIcon from '../Icons/CopyIcon';

const ViewFormNoteField = ({ sm, heading, param }) => (
    <Grid item xs={12} sm={sm} sx={{ px: 2, py: 1, 
    alignItems: 'center',
    whiteSpace: 'pre-line',
    wordBreak: 'break-word' }}>
        <Typography variant="overline" sx={{ color: 'text.disabled' }}>
            {heading || ''}
        </Typography>
        <Typography variant="body2" >
            {param || ''}{param?.trim() && <CopyIcon value={param}/>}
        </Typography>
    </Grid>
  )

ViewFormNoteField.propTypes = {
    sm: PropTypes.number,
    heading: PropTypes.string,
    param: PropTypes.string,
}
export default memo(ViewFormNoteField)