import { useMemo } from 'react';
// @mui
import { Card, Grid, Tooltip } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// import { fDate } from 'src/utils/formatTime';
import { fDate } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  setLicenseEditFormVisibility,
  getLicense,
  deleteLicense,
  setLicenseViewFormVisibility,
} from '../../../redux/slices/products/license';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';

export default function LicenseViewForm() {
  const {
    license
  } = useSelector((state) => state.license);

  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      dispatch(deleteLicense(machine._id, license._id));
      enqueueSnackbar(Snacks.licenseDeleted);
      dispatch(setLicenseViewFormVisibility(false));
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteLicense, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    dispatch(getLicense(machine._id, license._id));
    dispatch(setLicenseViewFormVisibility(false));
    dispatch(setLicenseEditFormVisibility(true));
  };

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
      isActive: license?.isActive || '',
      createdByFullName: license?.createdBy?.name || '',
      createdAt: license?.createdAt || '',
      createdIP: license?.createdIP || '',
      updatedByFullName: license?.updatedBy?.name || '',
      updatedAt: license?.updatedAt || '',
      updatedIP: license?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [license, machine]
  );
  return (
    // needs cleanup
    <>
    {/* <DocumentCover content={defaultValues?.displayName} backLink="true"  generalSettings /> */}
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit} onDelete={onDelete} />
      <Grid display="inline-flex">
        <Tooltip>
          <ViewFormField isActive={defaultValues.isActive} />
        </Tooltip>
      </Grid>
      <Grid container>
        <ViewFormField sm={6} heading="License Key" param={defaultValues.licenseKey} />
        <ViewFormField sm={6} heading="Version" param={defaultValues.licenseDetail.version} />
        <ViewFormField sm={6} heading="Device GUID" param={defaultValues.licenseDetail.deviceGUID} />
        <ViewFormField sm={6} heading="Device Name" param={defaultValues.licenseDetail.deviceName} />
        <ViewFormField sm={12} heading="Type" param={defaultValues.licenseDetail.type} />
        <ViewFormField sm={6} heading="Production" param={defaultValues.licenseDetail.production} />
        <ViewFormField sm={6} heading="Waste" param={defaultValues.licenseDetail.waste} />
        <ViewFormField sm={6} heading="Extension Time" param={fDate(defaultValues.licenseDetail.extensionTime)} />
        <ViewFormField sm={6} heading="Request Time" param={fDate(defaultValues.licenseDetail.requestTime)} />
        <ViewFormAudit defaultValues={defaultValues} /> 
      </Grid>
    </Card>
    </Grid>
    </>
  );
}
