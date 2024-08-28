import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Card, Grid, Switch, Typography, FormControlLabel } from '@mui/material';
// redux
import { deleteDepartment } from '../../../../redux/slices/department/department';
import { useSnackbar } from '../../../../components/snackbar';
// paths
import { PATH_SETTING } from '../../../../routes/paths';
//  components
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';

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

  const defaultValues = useMemo(
    () => ({
      departmentName: department?.departmentName || '',
      departmentType: department?.departmentType || '',
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
        isDefault={defaultValues.isDefault} 
        forCustomer={defaultValues.forCustomer}
        handleEdit={toggleEdit} 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_SETTING.departments.list)}
        settingPage
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={12} heading="Department Name" param={defaultValues?.departmentName} />
        <ViewFormField isLoading={isLoading} sm={12} heading="Department Type" param={defaultValues?.departmentType} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
