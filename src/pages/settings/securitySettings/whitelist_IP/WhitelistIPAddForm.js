import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Container, Box, Typography } from '@mui/material';
import { isActive } from '@tiptap/core';
import { PATH_SETTING } from '../../../../routes/paths';
import { useSnackbar } from '../../../../components/snackbar';

import FormProvider, { RHFTextField, RHFAutocomplete, RHFSwitch } from '../../../../components/hook-form';

import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import Iconify from '../../../../components/iconify';

import { getWhitelistIPs, getWhitelistIP, addWhitelistIPs, patchWhitelistIP, resetCurrentWhitelistIP } from '../../../../redux/slices/securityConfig/whitelistIP';

import { getActiveCustomers, resetActiveCustomers } from '../../../../redux/slices/customer/customer';
import { getActiveSecurityUsers, resetSecurityUsers } from '../../../../redux/slices/securityUser/securityUser';

export default function WhitelistIPForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const { currentWhitelistIP, whitelistIPs } = useSelector((state) => state.whitelistIP);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSecurityUsers } = useSelector((state) => state.user);

  useEffect(() => {
    if (!whitelistIPs.length) dispatch(getWhitelistIPs());
    dispatch(getActiveCustomers());
    dispatch(getActiveSecurityUsers());
    return () => {
    dispatch(resetActiveCustomers());
    dispatch(resetSecurityUsers());
    }
  }, [dispatch, whitelistIPs.length]);

  useEffect(() => {
    if (isEdit && id) {
      dispatch(getWhitelistIP(id));
    }
  }, [dispatch, id, isEdit]);

  useEffect(
    () => () => {
      dispatch(resetCurrentWhitelistIP());
    },
    [dispatch]
  );

  const currentIP = currentWhitelistIP;

  const defaultValues = useMemo(
    () => ({
      ipAddress: currentIP?.ipAddress || '',
      customer: currentIP?.customer || null,
      user: currentIP?.user || null,
      description: currentIP?.description || '',
      application: currentIP?.application || '',
      isActive: currentIP?.isActive || true,
    }),
    [currentIP]
  );

  const WhitelistIPSchema = Yup.object().shape({
    ipAddress: Yup.string().required('IP is required to whitelist!'),
    customer: Yup.object().nullable().required('Customer is required'),
    user: Yup.object().nullable().required('User is required'),
    description: Yup.string(),
    application: Yup.string().oneOf(['AdminPortal', 'CustomerPortal', 'APIAccess'], 'Invalid Application').required('Application is required'),
    isActive: Yup.boolean(),
  });

  const methods = useForm({
    resolver: yupResolver(WhitelistIPSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    if (isEdit && currentIP) {
      reset(defaultValues);
    }
  }, [isEdit, currentIP, defaultValues, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        ipAddress: data.ipAddress,
        customer: data.customer._id,
        user: data.user._id,
        description: data.description,
        application: data.application,
        isActive: data.isActive,
      };

      if (isEdit) {
        await dispatch(patchWhitelistIP(id, payload));
        await dispatch(getWhitelistIPs());
        enqueueSnackbar('Whitelist IP updated successfully!');
        navigate(PATH_SETTING.restrictions.whitelistIP.view(id));
      } else {
        await dispatch(
          addWhitelistIPs({
            ...payload,
            source: 'manual',
            createdAt: new Date().toISOString(),
          })
        );
        enqueueSnackbar('Whitelist IP added successfully!');
        navigate(PATH_SETTING.restrictions.whitelistIP.list);
      }

      reset();
    } catch (error) {
      enqueueSnackbar('Saving IP failed!', { variant: 'error' });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.restrictions.whitelistIP.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={isEdit ? currentIP?.ipAddress : 'Add Whitelist IP'} />
      </StyledCardContainer>

      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card sx={{ p: 3 }}>
              <Box rowGap={2} columnGap={2} display="grid" sx={{ mb: 3 }} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}>
                <RHFTextField
                  name="ipAddress"
                  label="IP Address*"
                  size="small"
                  inputProps={{
                    pattern:
                      '^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\/(3[0-2]|[12]?[0-9])$|^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
                  }}
                />

                <RHFAutocomplete
                  name="customer"
                  label="Customer*"
                  options={activeCustomers || []}
                  size="small"
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>
                      {option?.name}
                    </li>
                  )}
                  fullWidth
                />

                <RHFAutocomplete
                  name="user"
                  label="User*"
                  options={activeSecurityUsers || []}
                  size="small"
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => option?.name || ''}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>
                      {option?.name}
                    </li>
                  )}
                  fullWidth
                />

                <RHFAutocomplete
                  name="application"
                  label="Application*"
                  options={['AdminPortal', 'CustomerPortal', 'APIAccess']}
                  size="small"
                  fullWidth
                  getOptionLabel={(option) => option || ''}
                  isOptionEqualToValue={(option, value) => option === value}
                  renderOption={(props, option) => (
                    <li {...props} key={option}>
                      {option}
                    </li>
                  )}
                />

                <Box sx={{ gridColumn: { sm: 'span 2' } }}>
                  <RHFTextField name="description" label="Description" size="small" fullWidth multiline rows={3} />
                </Box>
              </Box>

              <RHFSwitch name="isActive" label="Active" />

              <Box display="flex" alignItems="center" sx={{ mb: 3 }}>
                <Iconify icon="eva:info-outline" sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  All IPs in whitelists are allowed third party API access from Customer Portal
                </Typography>
              </Box>

              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
