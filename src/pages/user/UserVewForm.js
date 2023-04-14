import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Container, Typography, Modal , Fade, Box , Link ,Dialog,  DialogTitle, Stack} from '@mui/material';
// routes
import { PATH_MACHINE , PATH_DASHBOARD } from '../../routes/paths';
// slices
import { getUser,getUsers, deleteUser, setEditFormVisibility } from '../../redux/slices/user';

import Iconify from '../../components/iconify';
import ViewFormSubtitle from '../components/ViewFormSubtitle';
import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import {Cover} from '../components/Cover';
// ----------------------------------------------------------------------
export default function MachineViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  console.log("user : " , user)

  const handleEdit = () => {
    dispatch(setEditFormVisibility(true));
  }
  const handleViewCustomer = (id) => {
    navigate(PATH_DASHBOARD.user.list);
  };
  const onDelete = async () => {
    await dispatch(deleteUser(user._id));
    dispatch(getUsers());
    navigate(PATH_DASHBOARD.user.list)
  }


  const defaultValues = useMemo(
    () => ({
      customer:                 user?.customer.name || "",
      contact:                  user?.contact?.firstName || "",
      name:                     user?.name || "",
      phone:                    user?.phone || "",
      email:                    user?.email || "",
      login:                    user?.login || "",
      roles:                    user?.roles ,
      isActive:                 user?.isActive,
      createdByFullName:        user?.createdBy?.name ,
      createdAt:                user?.createdAt ,
      createdIP:                user?.createdIP ,
      updatedByFullName:        user?.updatedBy?.name ,
      updatedAt:                user?.updatedAt ,
      updatedIP:                user?.updatedIP ,
    }
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user] );

  return (
    <Container>
        <Card sx={{mb: 3,height: 160,position: 'relative',  }}>
          <Cover name={defaultValues.name} icon="ph:users-light"/>
        </Card>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete} />
          <Grid container>
            <ViewFormField sm={6} heading="Customer" param={defaultValues.customer} />
            <ViewFormField sm={6} heading="Contact" param={defaultValues.contact} />
            <ViewFormField sm={6} heading="Full Name" param={defaultValues.name} />
            <ViewFormField sm={6} heading="Phone" param={defaultValues.phone} />
            <ViewFormField sm={12} heading="email" param={defaultValues.email} />
            <ViewFormField sm={6} heading="Login" param={defaultValues.login} />
            <ViewFormField sm={6} heading="Roles" param={defaultValues.roles?.map((obj) => obj.name).join(', ')} />
          </Grid>
            <Switch sx={{mt:1}} checked = { defaultValues.isActive } disabled  />
          <Grid container>
            <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Card>
    </Container>
  );
};
