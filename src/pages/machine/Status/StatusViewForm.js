import PropTypes from 'prop-types';
import {  useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid } from '@mui/material';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { deleteMachinestatus } from '../../../redux/slices/products/statuses';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../components/ViewForms/ViewFormField';

// ----------------------------------------------------------------------

StatusViewForm.propTypes = {
  currentMachinestatus: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function StatusViewForm({ currentMachinestatus = null }) {
  // const [editFlag, setEditFlag] = useState(false);
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const { machinestatus, isLoading } = useSelector((state) => state.machinestatus);
  const { id } = useParams();
  const dispatch = useDispatch();

  const defaultValues = useMemo(
    () => ({
      name: machinestatus?.name || '',
      order: machinestatus?.order || '',
      description: machinestatus?.description || '',
      displayOrderNo: machinestatus?.displayOrderNo || '',
      slug: machinestatus?.slug || '',
      isActive: machinestatus?.isActive,
      isDefault: machinestatus?.isDefault,
      createdByFullName: machinestatus?.createdBy?.name || '',
      createdAt: machinestatus?.createdAt || '',
      createdIP: machinestatus?.createdIP || '',
      updatedByFullName: machinestatus?.updatedBy?.name || '',
      updatedAt: machinestatus?.updatedAt || '',
      updatedIP: machinestatus?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachinestatus, machinestatus]
  );

  const onDelete = () => {
    try {
      dispatch(deleteMachinestatus(id));
      navigate(PATH_MACHINE.machines.settings.status.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Status delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const toggleEdit = () => {
    navigate(PATH_MACHINE.machines.settings.status.statusedit(id));
  };

  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} isDefault={defaultValues.isDefault} handleEdit={toggleEdit} onDelete={onDelete} backLink={() => navigate(PATH_MACHINE.machines.settings.status.list)} />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
        <ViewFormField isLoading={isLoading}
          sm={12}
          heading="Display Order No."
          numberParam={defaultValues?.displayOrderNo}
        />
        <ViewFormField isLoading={isLoading} sm={12} heading="Slug" numberParam={defaultValues?.slug} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Order Number" numberParam={defaultValues?.order} />
        <Grid container>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
