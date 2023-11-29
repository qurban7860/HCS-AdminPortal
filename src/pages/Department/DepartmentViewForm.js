import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// import { RHFSwitch } from '../../../components/hook-form';
// redux
import {
  getDepartment,
  deleteDepartment,
} from '../../redux/slices/Department/department';
import { useSnackbar } from '../../components/snackbar';
// paths
import { PATH_SETTING } from '../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormField from '../components/ViewForms/ViewFormField';
// import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
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

  const { department  } = useSelector((state) => state.department);

  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getDepartment(id));
    }
  }, [dispatch, id ]);

  const defaultValues = useMemo(
    () => ({
      departmentName: department?.departmentName || '',
      isActive: department?.isActive,
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
      enqueueSnackbar('Department Deleted Successfullty!');
      navigate(PATH_SETTING.departments.list);
    } catch (err) {
      enqueueSnackbar('Department delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} handleEdit={toggleEdit} onDelete={onDelete} backLink={() => navigate(PATH_SETTING.departments.list)}/>
      <Grid container sx={{mt:2}}>
        <ViewFormField sm={12} heading="Department Name" param={defaultValues?.departmentName} />
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
  );
}
