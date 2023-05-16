import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate,useParams } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Stack, Typography, Button } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { deleteMachinestatus } from '../../../redux/slices/products/statuses';
// Iconify
import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';

// ----------------------------------------------------------------------

StatusViewForm.propTypes = {
  currentMachinestatus: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function StatusViewForm({ currentMachinestatus = null }) {

  const [editFlag, setEditFlag] = useState(false);

  const toggleEdit = () => {
    navigate(PATH_MACHINE.machineStatus.statusedit(id));
  }

  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { machinestatus } = useSelector((state) => state.machinestatus);

  const { id } = useParams();

  const dispatch = useDispatch()
  

  const defaultValues = useMemo(
    () => (
      {
        name:                     machinestatus?.name || '',
        description:              machinestatus?.description || '',
        displayOrderNo:           machinestatus?.displayOrderNo || '',
        isActive:                 machinestatus?.isActive ,
        createdByFullName:        machinestatus?.createdBy?.name || "",
        createdAt:                machinestatus?.createdAt || "",
        createdIP:                machinestatus?.createdIP || "",
        updatedByFullName:        machinestatus?.updatedBy?.name || "",
        updatedAt:                machinestatus?.updatedAt || "",
        updatedIP:                machinestatus?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinestatus, machinestatus]
    );
    const onDelete = () => {
      dispatch(deleteMachinestatus(id))
      navigate(PATH_MACHINE.machineStatus.list)
    }

  return (
    <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons handleEdit={toggleEdit} onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={12}   heading='Name'                 param={defaultValues?.name} isActive={defaultValues.isActive}/>
        <ViewFormField sm={12}   heading='Description'          param={defaultValues?.description}/>
        <ViewFormField sm={12}   heading='Display Order No'     numberparam={defaultValues?.displayOrderNo ? defaultValues.displayOrderNo : ""}/>
        <ViewFormSWitch  isActive={defaultValues.isActive}/>
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
