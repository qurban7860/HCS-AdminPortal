import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid, Switch, Typography, FormControlLabel } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getDepartment,
  deleteDepartment,
} from '../../../../redux/slices/department/department';
import { useSnackbar } from '../../../../components/snackbar';
// paths
import { PATH_SETTING } from '../../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
// import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
// import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// ----------------------------------------------------------------------

export default function DepartmentViewForm() {

  const { id } = useParams();
  const toggleEdit = () => {
    navigate(PATH_SETTING.departments.edit(id));
  };

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { department, isLoading } = useSelector((state) => state.department);

  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getDepartment(id));
    }
  }, [dispatch, id ]);

  const defaultValues = useMemo(
    () => ({
      departmentName: department?.departmentName || '',
      departmentType: department?.departmentType || 'NA',
      isActive: department?.isActive,
      isDefault: department?.isDefault,
      forCustomer: department?.forCustomer || false,
      createdByFullName: department?.createdBy?.name || '',
      createdAt: department?.createdAt || '',
      createdIP: department?.createdIP || '',
      updatedByFullName: department?.updatedBy?.name || '',
      updatedAt: department?.updatedAt || '',
      updatedIP: department?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [department]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteDepartment(id));
      enqueueSnackbar('Department Archived Successfullty!');
      navigate(PATH_SETTING.departments.list);
    } catch (err) {
      enqueueSnackbar('Department Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        // isDefault={defaultValues.isDefault} 
        // forCustomer={defaultValues.forCustomer}
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_SETTING.departments.list)}
        settingPage
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Department Name" param={defaultValues?.departmentName} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Department Type" param={defaultValues?.departmentType} />
        <Grid display="flex" >
          <FormControlLabel control={<Switch disabled checked={defaultValues?.isDefault} />} label={<Typography variant='body2'sx={{fontWeight:'bold'}}>Default</Typography>} />
          <FormControlLabel control={<Switch disabled checked={defaultValues?.forCustomer} />} label={<Typography variant='body2'sx={{fontWeight:'bold'}}> Customers</Typography>} />
        </Grid>
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
