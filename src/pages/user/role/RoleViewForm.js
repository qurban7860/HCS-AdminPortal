import { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Card, Grid } from '@mui/material';
// redux
import { deleteRole } from '../../../redux/slices/securityUser/role';
// paths
import { PATH_PAGE, PATH_SETTING } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function RoleViewForm() {
  const { role, isLoading } = useSelector((state) => state.role);
  const { assignedUsers } = useSelector((state) => state.user);
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((rolee) => rolee.roleType === 'SuperAdmin');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if(!isSuperAdmin){
      navigate(PATH_PAGE.page403)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, isSuperAdmin]);

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
      isDefault: role?.isDefault,
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
  console.log("defaultValues.disableDelete : ",defaultValues.disableDelete)

  return (
    <Card sx={{ p: 2 }}>
      <Grid>
        <ViewFormEditDeleteButtons
          backLink={() => navigate(PATH_SETTING.role.list)}
          isDefault={defaultValues.isDefault}
          isActive={defaultValues.isActive}
          isDeleteDisabled={!defaultValues.disableDelete}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
        <Grid container sx={{mt:2}}>
          <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues.name} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Role Type" param={defaultValues.roleType} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues.description} />
          <ViewFormField isLoading={isLoading} sm={12} heading="Assigned Users" arrayParam={assignedUsers} />
          <ViewFormField isLoading={isLoading} sm={12}  />
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>
      </Grid>
    </Card>
  );
}
