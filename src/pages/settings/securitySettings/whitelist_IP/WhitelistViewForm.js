import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Grid, Container } from '@mui/material';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';

import { PATH_SETTING } from '../../../../routes/paths';
import { useSnackbar } from '../../../../components/snackbar';
import { getWhitelistIPs, deleteWhitelistIP } from '../../../../redux/slices/securityConfig/whitelistIP';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import Editor from '../../../../components/editor';
import { fDateTime } from '../../../../utils/formatTime';
import { handleError } from '../../../../utils/errorHandler';

export default function WhitelistViewForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const { whitelistIPs, isLoading } = useSelector((state) => state.whitelistIP);

  useEffect(() => {
    if (!whitelistIPs.length) {
      dispatch(getWhitelistIPs());
    }
  }, [dispatch, whitelistIPs.length]);

  const ipData = useMemo(() => whitelistIPs.find((item) => item._id === id), [whitelistIPs, id]);

  const defaultValues = useMemo(
    () => ({
      whiteListIP: ipData?.whiteListIP || '',
      customer: ipData?.customer?.name || '',
      user: ipData?.user || '',
      description: ipData?.description || '',
      application: ipData?.application || '',
      createdByFullName: ipData?.createdBy?.name || '',
      createdAt: ipData?.createdAt || '',
      createdIP: ipData?.createdIP || '',
      updatedByFullName: ipData?.updatedBy?.name || '',
      updatedAt: ipData?.updatedAt || '',
      updatedIP: ipData?.updatedIP || '',
    }),
    [ipData]
  );

  const toggleEdit = () => {
    navigate(PATH_SETTING.restrictions.whitelistIP.edit(id));
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteWhitelistIP(id));
      enqueueSnackbar('Whitelist IP removed successfully!', { variant: 'success' });
      navigate(PATH_SETTING.restrictions.whitelistIP.list);
    } catch (err) {
      enqueueSnackbar(handleError(err) || 'Failed to remove IP!', { variant: 'error' });
    }
  };

  const goBack = () => {
    navigate(PATH_SETTING.restrictions.whitelistIP.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ipData?.whiteListIP} />
      </StyledCardContainer>
      <Grid>
        <Card sx={{ p: 2 }}>
          <ViewFormEditDeleteButtons handleEdit={toggleEdit} onArchive={onDelete} backLink={goBack} />

          <Grid container spacing={2} sx={{ mt: 2 }}>
            <ViewFormField isLoading={isLoading} sm={3} heading="Whitelist IP" param={defaultValues.whiteListIP} />
            <ViewFormField isLoading={isLoading} sm={3} heading="Customer" param={defaultValues.customer} />
            <ViewFormField isLoading={isLoading} sm={3} heading="User" param={defaultValues.user} />
            <ViewFormField isLoading={isLoading} sm={3} heading="Application" param={defaultValues.application} />

            <ViewFormField
              isLoading={isLoading}
              sm={12}
              heading="Description"
              node={<Editor readOnly hideToolbar sx={{ border: 'none', '& .ql-editor': { padding: '0px' } }} value={defaultValues.description} />}
            />

            <Grid container>
              <ViewFormAudit
                defaultValues={{
                  createdByFullName: defaultValues.createdByFullName,
                  createdAt: fDateTime(defaultValues.createdAt),
                  createdIP: defaultValues.createdIP,
                  updatedByFullName: defaultValues.updatedByFullName,
                  updatedAt: fDateTime(defaultValues.updatedAt),
                  updatedIP: defaultValues.updatedIP,
                }}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Container>
  );
}
