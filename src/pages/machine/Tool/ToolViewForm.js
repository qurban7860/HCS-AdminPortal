import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { getTool, setToolEditFormVisibility } from '../../../redux/slices/products/tools';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

// Iconify

import { fDate } from '../../../utils/formatTime';

import ToolEditForm from './ToolEditForm';

import Iconify from '../../../components/iconify/Iconify';




// ----------------------------------------------------------------------


ToolViewForm.propTypes = {
  currentTool: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ToolViewForm({ currentTool = null }) {


  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    dispatch(setToolEditFormVisibility(true));
    navigate(PATH_MACHINE.tool.tooledit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { tool } = useSelector((state) => state.tool);
  // const tool = tools
  const { id } = useParams();

  const dispatch = useDispatch()
  // useLayoutEffect(() => {
  //   console.log(id,"useEffectNow")
  //   if(id != null){
  //     dispatch(getTool(id));
  //   }
  // }, [dispatch, id]);

  const defaultValues = useMemo(
    () => (
      {
        name:tool?.name || 'N/A',
        description:tool?.description || 'N/A',
        createdAt: tool?.createdAt || '',
        updatedAt: tool?.updatedAt || '',
        updatedIP: tool?.updatedIP || '',
        isDisabled: true,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, tool]
    );

    console.log(tool, "test")

  return (
    <Card sx={{ px: 5 }}>
      <Stack alignItems="flex-end" sx={{ mt: 2, mb: -4 }}>
        <Button
          onClick={() => { 
              toggleEdit(); 
          }}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>

      </Stack>
      <Grid container>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Name
          </Typography>

          <Typography variant="body2">{defaultValues.name ? defaultValues.name : 'N/A'}</Typography>

        </Grid>


        <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Description
          </Typography>

          <Typography variant="body2">{defaultValues.description ? defaultValues.description : 'N/A'}</Typography>

        </Grid>

        <Grid item xs={12} sm={12} sx={{ mb: 5 }}>
          <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
            Active
          </Typography>
          <Typography variant="body2">{defaultValues.isDisabled  ? 'Yes' : 'No'}</Typography>

        </Grid>
        
        <Grid container spacing={0} sx={{ mb: 5}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                Created by: Naveed, {fDate(defaultValues.createdAt)}, 192.168.10.101
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              Updated by: Naveed, {fDate(defaultValues.updatedAt)}, 192.168.10.101
            </Typography>
            </Grid>
        </Grid>

      </Grid>
    </Card>
  );
}
