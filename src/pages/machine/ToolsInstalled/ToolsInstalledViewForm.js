import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// redux
import { setToolInstalledFormVisibility, setToolInstalledEditFormVisibility , updateToolInstalled ,deleteToolInstalled, getToolsInstalled , getToolInstalled } from '../../../redux/slices/products/toolInstalled';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewFormField';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import ViewFormSwitch from '../../components/ViewFormSwitch';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------
ToolsInstalledViewForm.propTypes = {
  currentTool: PropTypes.object,
};
export default function ToolsInstalledViewForm({ currentTool = null }) {

  const { initial,error, responseMessage , toolInstalledEditFormVisibility , toolsInstalled, toolInstalled, formVisibility } = useSelector((state) => state.toolInstalled);
  const { machine } = useSelector((state) => state.machine);
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  const { enqueueSnackbar } = useSnackbar();

  
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
    try{
      await dispatch(deleteToolInstalled(machine._id, currentTool._id));
      dispatch(getToolsInstalled(machine._id));
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar("Tool installed delete failed!",{ variant: `error` })
      console.log("Error:", err);
    }
  };

  const  handleEdit = async () => {
    await dispatch(getToolInstalled(machine._id, currentTool._id));
    dispatch(setToolInstalledEditFormVisibility(true));
  };


  const defaultValues = useMemo(
    () => (
      {
        toolName:                 currentTool?.tool?.name || "",
        toolNote:                 currentTool?.note|| "",
        isActive:               currentTool?.isActive,
        createdAt:                currentTool?.createdAt || "",
        createdByFullName:           currentTool?.createdBy?.name || "",
        createdIP:                currentTool?.createdIP || "",
        updatedAt:                currentTool?.updatedAt || "",
        updatedByFullName:           currentTool?.updatedBy?.name || "",
        updatedIP:                currentTool?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, machine]
  );

  return (
    <Grid >
      
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
      <Grid container>
          <ViewFormField  sm={12} heading="Tool" param={defaultValues?.toolName} isActive={defaultValues.isActive}/>
          <ViewFormField  sm={12} heading="Note" param={defaultValues?.toolNote} />

          <ViewFormSwitch isActive={defaultValues.isActive} />

          <ViewFormAudit defaultValues={defaultValues}/>
      </Grid>
    </Grid>
  );
}
