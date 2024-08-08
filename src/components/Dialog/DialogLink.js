import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@mui/material';
import Iconify from '../iconify';

function DialogLink({ onClose, onClick, content, icon='mdi:arrow-right' }) {
  return (
    <Grid item sx={{ textAlign: 'right', p:2}} sm={12}>
      {onClose && 
        <Button
              variant="outlined"
              sx={{ flexShrink: 0, ml: 1 }}
              onClick={onClose}
              // endIcon={<Iconify icon="mdi:close-circle-outline" />}
            >
              Cancel
        </Button>
      }

      {onClick &&
        <Button
              variant="contained"
              sx={{ flexShrink: 0, ml: 1 }}
              onClick={onClick}
              endIcon={<Iconify icon={icon} />}
            >
              {content}
        </Button>
      }
    </Grid>
  );
}

DialogLink.propTypes = {
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  content: PropTypes.string,
  icon: PropTypes.string,
};

export default DialogLink;
