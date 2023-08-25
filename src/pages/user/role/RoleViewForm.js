import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid, Tooltip } from '@mui/material';
// redux
import { deleteRole } from '../../../redux/slices/securityUser/role';
// paths
import { PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function RoleViewForm() {
  const { role } = useSelector((state) => state.role);
  const { assignedUsers } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try {
      await dispatch(deleteRole(role?._id));
      navigate(PATH_SETTING.role.list);
      enqueueSnackbar('Role delete Successfully!');
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: `error` });
      }
      enqueueSnackbar('Role delete failed!', { variant: `error` });
      console.log('Error:', error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SETTING.role.edit(role._id));
  };

  const defaultValues = useMemo(
    () => ({
      isActive: role?.isActive,
      disableDelete: role?.disableDelete || false,
      customerAccess: role?.customerAccess,
      name: role?.name,
      roleType: role?.roleType || '',
      description: role?.description || '',
      createdAt: role?.createdAt || '',
      createdByFullName: role?.createdBy?.name || '',
      createdIP: role?.createdIP || '',
      updatedAt: role?.updatedAt || '',
      updatedByFullName: role?.updatedBy?.name || '',
      updatedIP: role?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role]
  );

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          disableDeleteButton={defaultValues.disableDelete}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
        <Grid display="inline-flex">
          <Tooltip>
            <ViewFormField isActive={defaultValues.isActive} />
          </Tooltip>
          <Tooltip>
            <ViewFormField deleteDisabled={defaultValues.disableDelete} />
          </Tooltip>
        </Grid>
        <Grid container>
          <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormField sm={12} heading="Role Type" param={defaultValues.roleType} />
          <ViewFormField sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField sm={12} heading="Assigned Users" arrayParam={assignedUsers} />
          <ViewFormField sm={12}  />
          
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
