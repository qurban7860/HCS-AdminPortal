import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Switch, Card, Grid, Stack, Typography, Button ,Tooltip} from '@mui/material';
// redux
import { getRole,deleteRole } from '../../../redux/slices/securityUser/role';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------

export default function RoleViewForm() {
  const { role } = useSelector((state) => state.role);
// console.log("role : ",role)
  const navigate = useNavigate();

  const dispatch = useDispatch(); 
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = async () => {
    try{
      await dispatch(deleteRole(role?._id));
      navigate(PATH_DASHBOARD.role.list);
      enqueueSnackbar('Role delete Successfully!');

    }catch(error){
      if(error.Message){
        enqueueSnackbar(error.Message,{ variant: `error` })
      }else if(error.message){
        enqueueSnackbar(error.message,{ variant: `error` })
      }else{
        enqueueSnackbar("Something went wrong!",{ variant: `error` })
      }
      console.log("Error:", error);
    }
  };

  const  handleEdit = async () => {
    navigate(PATH_DASHBOARD.role.edit(role._id))
  };

  const defaultValues = useMemo(
    () => (
      {
        isActive:                 role?.isActive,
        disableDelete:                role?.disableDelete || false,
        customerAccess:           role?.customerAccess,
        name:                     role?.name,
        roleType:                 role?.roleType || "",
        description:              role?.description || "",
        createdAt:                role?.createdAt || "",
        createdByFullName:        role?.createdBy?.name || "",
        createdIP:                role?.createdIP || "",
        updatedAt:                role?.updatedAt || "",
        updatedByFullName:        role?.updatedBy?.name || "",
        updatedIP:                role?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [role]
  );

  return (
    <Card sx={{p:2}}>
      <Grid >
        <ViewFormEditDeleteButtons
          disableDeleteButton={defaultValues.disableDelete} 
          handleEdit={handleEdit}  
          onDelete={onDelete}
        />
            <Tooltip>
              <ViewFormField  isActive={defaultValues.isActive}  />
            </Tooltip>
        <Grid container>
            <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
            <ViewFormField sm={12} heading="Role Type" param={defaultValues.roleType} />
            <ViewFormField sm={12} heading="Description" param={defaultValues.description} />

            {/* <ViewFormSWitch heading="isActive" disabled isActive={defaultValues.isActive}/> */}
            <ViewFormAudit  defaultValues={defaultValues}/>
        </Grid>
      </Grid>
    </Card>
  );
}
