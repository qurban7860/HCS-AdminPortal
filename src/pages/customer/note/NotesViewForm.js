import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, Button, DialogTitle, Dialog, InputAdornment, Link } from '@mui/material';
// global
import { CONFIG } from '../../../config-global';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import { getNotes, getNote } from '../../../redux/slices/note';






// ----------------------------------------------------------------------

export default function NoteViewForm() {

  const { note } = useSelector((state) => state.note);
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();


  const defaultValues = useMemo(
    () => ({
      id: note?._id || 'N/A',
      name: note?.name || 'N/A',
      status: note?.tradingName || 'N/A',
      accountManager: note?.accountManager || 'N/A',
      projectManager: note?.projectManager || 'N/A',
      supportManager: note?.supportManager || 'N/A',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note]
  );

  console.log(defaultValues); 




  return (
       <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Name
            </Typography>

            <Typography variant="body2">{defaultValues.name}</Typography>

          </Grid>


          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Trading Name
            </Typography>

            <Typography variant="body2">{defaultValues.tradingName}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Account Manager
            </Typography>

            <Typography variant="body2">{defaultValues.status}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Project Manager
            </Typography>

            <Typography variant="body2">{defaultValues.tag}</Typography>
            
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
             Suppport Manager
            </Typography>

            <Typography variant="body2">{defaultValues.location}</Typography>
            
          </Grid>

          {/* <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Department
            </Typography>
            
            <Typography variant="body2">{defaultValues.department}</Typography>
            
          </Grid> */}

            </Grid>
            </Card>
  );
}
