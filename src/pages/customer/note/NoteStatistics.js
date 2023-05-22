import PropTypes from 'prop-types';
// import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// routes
// import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

NoteStatistics.propTypes = {
    current_note_Statistics: PropTypes.object,
};


// ----------------------------------------------------------------------

export default function NoteStatistics({current_note_Statistics = null}) {

  const { note } = useSelector((state) => state.note);
//   console.log("note : ",note)
//   const navigate = useNavigate();

//   const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => ({
      created_at: current_note_Statistics?.createdAt || '',
      contact_by: current_note_Statistics?.createdBy || '',
      contact_by_ip: current_note_Statistics?.createdByIp || '',
      updated_at: current_note_Statistics?.updatedAt || '',
      updated_by: current_note_Statistics?.updatedBy || '',
      updated_by_ip: current_note_Statistics?.updatedByIp || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [current_note_Statistics, note]
  );

  // console.log(defaultValues); 
  return (
    <Card sx={{  p: 2 }}>
        <Grid container>
            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Created at:
                </Typography>
                <Typography variant="body2">{defaultValues.created_at}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Created By:
                </Typography>
                <Typography variant="body2">{defaultValues.contact_by}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Created By IP:
                </Typography>
                <Typography variant="body2">{defaultValues.contact_by_ip}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Updated At:
                </Typography>
                <Typography variant="body2">{defaultValues.updated_at}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Updated by:
                </Typography>
                <Typography variant="body2">{defaultValues.updated_by}</Typography>
            </Grid>

            <Grid item xs={12} sm={6} sx={{ mb: 2 }}>
                <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
                  Updated By Ip:
                </Typography>
                <Typography variant="body2">{defaultValues.updated_by_ip}</Typography>
            </Grid>
        </Grid>
    </Card>
  );
}
