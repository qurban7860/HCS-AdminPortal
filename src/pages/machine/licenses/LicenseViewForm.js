import { useLayoutEffect, useMemo } from 'react';
// @mui
import { Container, Card, Grid } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
//
import { fDate } from '../../../utils/formatTime';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  getLicense,
  deleteLicense,
} from '../../../redux/slices/products/license';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';
import MachineTabContainer from '../util/MachineTabContainer';

export default function LicenseViewForm() {
  const { license, isLoading} = useSelector((state) => state.license);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();

  const { machineId, id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  useLayoutEffect(()=>{
    if(machineId && id){
      dispatch(getLicense(machineId, id))
    }
  },[ dispatch, machineId, id ])

  const onDelete = async () => {
    try {
      await dispatch(deleteLicense(machineId, id));
      await enqueueSnackbar(Snacks.licenseDeleted);
      await navigate(PATH_MACHINE.machines.licenses.root( machineId ))
      ;
    } catch (err) {
      enqueueSnackbar(err, { variant: `error` });
      console.log(err);
    }
  };

  const handleEdit = () => navigate(PATH_MACHINE.machines.licenses.edit(machineId, id));

  const defaultValues = useMemo(
    () => ({
      licenseKey: license?.licenseKey || '',
      licenseDetail: {
        version : license?.licenseDetail?.version || '',
        deviceName : license?.licenseDetail?.deviceName || '',
        deviceGUID : license?.licenseDetail?.deviceGUID || '',
        type : license?.licenseDetail?.type || '',
        extensionTime : license?.licenseDetail?.extensionTime || '',
        requestTime : license?.licenseDetail?.requestTime || '',
        production : license?.licenseDetail?.production || '',
        waste : license?.licenseDetail?.waste || '',
      },
      isActive: license?.isActive || false,
      createdByFullName: license?.createdBy?.name || '',
      createdAt: license?.createdAt || '',
      createdIP: license?.createdIP || '',
      updatedByFullName: license?.updatedBy?.name || '',
      updatedAt: license?.updatedAt || '',
      updatedIP: license?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [license, ]
  );
  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='license' />
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive}  handleEdit={handleEdit} onDelete={onDelete} 
      backLink={() => navigate(PATH_MACHINE.machines.licenses.root(machineId, id)) } 
      disableEditButton={machine?.status?.slug==='transferred'}
      disableDeleteButton={machine?.status?.slug==='transferred'}
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Device GUID" param={defaultValues.licenseDetail.deviceGUID} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Device Name" param={defaultValues.licenseDetail.deviceName} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Type" param={defaultValues.licenseDetail.type} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Version" param={defaultValues.licenseDetail.version} />
        <ViewFormField isLoading={isLoading} heading="License Key" param={defaultValues.licenseKey} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Production" param={defaultValues.licenseDetail.production} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Waste" param={defaultValues.licenseDetail.waste} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Extension Time" param={fDate(defaultValues.licenseDetail.extensionTime)} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Request Time" param={fDate(defaultValues.licenseDetail.requestTime)} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
    </Container>
  );
}
