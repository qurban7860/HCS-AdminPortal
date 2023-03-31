import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { setToolInstalledFormVisibility, setToolInstalledEditFormVisibility , updateToolInstalled ,deleteToolInstalled, saveToolInstalled , getToolsInstalled , getToolInstalled } from '../../../redux/slices/products/toolInstalled';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate,fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------
ToolsInstalledViewForm.propTypes = {
  currentTool: PropTypes.object,
};
export default function ToolsInstalledViewForm({ currentTool = null }) {

  const { initial,error, responseMessage , toolInstalledEditFormVisibility , toolsInstalled, toolInstalled, formVisibility } = useSelector((state) => state.toolInstalled);
  const { machine } = useSelector((state) => state.machine);
  const navigate = useNavigate();

  const dispatch = useDispatch(); 
  
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    await dispatch(deleteToolInstalled(machine._id, currentTool._id));
    handleCloseConfirm();
    dispatch(getToolsInstalled(machine._id));
  };

  const  handleEdit = async () => {
    await dispatch(getToolInstalled(machine._id, currentTool._id));
    dispatch(setToolInstalledEditFormVisibility(true));
    console.log(toolInstalledEditFormVisibility)
  };


  const defaultValues = useMemo(
    () => (
      {
        toolName:                 currentTool?.tool?.name || "",
        toolNote:                 currentTool?.note|| "",
        createdAt:                currentTool?.createdAt || "",
        createdByFullname:           currentTool?.createdBy?.name || "",
        createdIP:                currentTool?.createdIP || "",
        updatedAt:                currentTool?.updatedAt || "",
        updatedByFullname:           currentTool?.updatedBy?.name || "",
        updatedIP:                currentTool?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, machine]
  );

  return (
    <Grid sx={{ p: 2 }}>
      <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mb: -4 }}>
        <Button
          onClick={() => handleEdit()}
          variant="outlined"
          startIcon={<Iconify icon="eva:edit-fill" />}
        >
          Edit
        </Button>
        <Button
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          variant="outlined"
          color="error"
          startIcon={<Iconify icon="eva:trash-2-fill" />}
        >
          Delete
        </Button>
      </Stack>
      <Grid container>

          <Grid item xs={12} sm={12} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Tool 
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.toolName ? defaultValues.toolName : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={12} sx={{  pt:2}}>
            <Grid item xs={12} sm={12} >
              <Typography variant="overline" sx={{ color: 'text.disabled' }}>
              Note
              </Typography>
            </Grid>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line'}}>
            {defaultValues.toolNote ? defaultValues.toolNote : ''}
            </Typography>
          </Grid>

          <Grid container spacing={0} sx={{ mb:-3,  pt:4}}>
            <Grid item xs={12} sm={6} >
              <Typography paragraph variant="body2" sx={{ color: 'text.disabled' }}>
                created by: {defaultValues.createdByFullname}, {fDate(defaultValues.createdAt)}, {defaultValues.createdIP}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} >
            <Typography variant="body2" sx={{ color: 'text.disabled' }}>
              updated by: {defaultValues.updatedByFullname}, {fDate(defaultValues.updatedAt)}, {defaultValues.updatedIP}
            </Typography>
            </Grid>
          </Grid>
        <ConfirmDialog
            open={openConfirm}
            onClose={handleCloseConfirm}
            title="Delete"
            content="Are you sure want to delete?"
            action={
              <Button variant="contained" color="error" onClick={onDelete}>
                Delete
              </Button>
            }
          />

      </Grid>
    </Grid>
  );
}
