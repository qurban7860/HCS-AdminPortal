import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// @mui
import { Card, Grid, Typography, TableBody, Table, TableContainer } from '@mui/material';

import {
  getServiceRecordConfig,
  setServiceRecordConfigEditFormVisibility,
  approveServiceRecordConfig,
  changeConfigStatus,
  deleteServiceRecordConfig,
} from '../../../redux/slices/products/serviceRecordConfig';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
// Iconify
// import Iconify from '../../../components/iconify/Iconify';
//  components
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow';
import { Snacks } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

ServiceRecordConfigViewForm.propTypes = {
  currentServiceRecordConfig: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ServiceRecordConfigViewForm({ currentServiceRecordConfig = null }) {
  const toggleEdit = () => {
    dispatch(setServiceRecordConfigEditFormVisibility(true));
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.edit(id));
  };
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { serviceRecordConfig, editFormVisibility } = useSelector((state) => state.serviceRecordConfig);
  const { id } = useParams();
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceRecordConfig(id));
    }
  }, [dispatch, id, editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
      recordType: serviceRecordConfig?.recordType || '',
      status: serviceRecordConfig?.status || '',
      docVersionNo: serviceRecordConfig?.docVersionNo || '',
      machineCategory: serviceRecordConfig?.machineCategory?.name || '',
      machineModel: serviceRecordConfig?.machineModel?.name || '',
      docTitle: serviceRecordConfig?.docTitle || '',
      textBeforeCheckItems: serviceRecordConfig?.textBeforeCheckItems || '',
      checkItemLists: serviceRecordConfig?.checkItemLists ,
      textAfterCheckItems: serviceRecordConfig?.textAfterCheckItems || '',
      isOperatorSignatureRequired: serviceRecordConfig?.isOperatorSignatureRequired,
      enableNote: serviceRecordConfig?.enableNote,
      enableMaintenanceRecommendations: serviceRecordConfig?.enableMaintenanceRecommendations,
      enableSuggestedSpares: serviceRecordConfig?.enableSuggestedSpares,
      header: serviceRecordConfig?.header || {},
      footer: serviceRecordConfig?.footer || {},
      isActive: serviceRecordConfig?.isActive|| false,
      createdByFullName: serviceRecordConfig?.createdBy?.name || '',
      createdAt: serviceRecordConfig?.createdAt || '',
      createdIP: serviceRecordConfig?.createdIP || '',
      updatedByFullName: serviceRecordConfig?.updatedBy?.name || '',
      updatedAt: serviceRecordConfig?.updatedAt || '',
      updatedIP: serviceRecordConfig?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentServiceRecordConfig, serviceRecordConfig]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteServiceRecordConfig(id));
      enqueueSnackbar('ServiceRecordConfig Deleted Successfullty!');
      navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('ServiceRecordConfig delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleVerification = async () => {
    try {
      await dispatch(approveServiceRecordConfig(serviceRecordConfig._id, true));
      await dispatch(getServiceRecordConfig(serviceRecordConfig._id));
      enqueueSnackbar(Snacks.configuration_Verification_Success);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };
  
  const approveConfigHandler = async () => {
    try {
      await dispatch(changeConfigStatus(serviceRecordConfig._id, 'APPROVED'));
      await dispatch(getServiceRecordConfig(serviceRecordConfig._id));
      enqueueSnackbar(Snacks.configuration_Verification_Success);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };

  const returnToDraft = async () => {
    try {
      await dispatch(changeConfigStatus(serviceRecordConfig._id, 'DRAFT'));
      await dispatch(getServiceRecordConfig(serviceRecordConfig._id));
      enqueueSnackbar(Snacks.configuration_Verification_Success);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(Snacks.configuration_Verification_Failed, { variant: 'error' });
    }
  };

  
  const returnToSubmitted = async () => {
    try {
      await dispatch(changeConfigStatus(serviceRecordConfig._id, 'SUBMITTED'));
      await dispatch(getServiceRecordConfig(serviceRecordConfig._id));
      enqueueSnackbar(Snacks.configuration_Verification_Success);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(Snacks.configuration_Verification_Failed, { variant: 'error' });
    }
  };
console.log("first tested: ",!serviceRecordConfig?.verifications?.some((verifiedUser)=> verifiedUser?.verifiedBy?._id !== userId ) && serviceRecordConfig?.verifications?.length < serviceRecordConfig?.noOfVerificationsRequired )
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        approvedUsers={serviceRecordConfig?.verifications } 
        // isVerifiedTitle="Approved By"
        approveConfiglength={`${serviceRecordConfig?.verifications?.length || 0}/${serviceRecordConfig?.noOfVerificationsRequired}`}
        // approveConfigStatusHandler={defaultValues?.status.toLowerCase() === 'submitted' && serviceRecordConfig?.verifications?.length >= serviceRecordConfig?.noOfVerificationsRequired && approveConfigHandler}
        // approveConfig={ serviceRecordConfig?.verifications?.length >= serviceRecordConfig?.noOfVerificationsRequired}
        isSubmitted={!serviceRecordConfig?.verifications?.length > 0 && defaultValues?.status.toLowerCase() === 'submitted' && defaultValues?.status.toLowerCase() !== 'approved' && returnToDraft } 
        returnToSubmitted={defaultValues?.status.toLowerCase() === 'draft' && defaultValues?.status.toLowerCase() !== 'approved' && returnToSubmitted } 
        approveConfig={ serviceRecordConfig?.verifications?.length >= serviceRecordConfig?.noOfVerificationsRequired} 
        approveHandler={defaultValues?.status.toLowerCase() === 'submitted' && !serviceRecordConfig?.verifications?.some((verifiedUser)=> verifiedUser?.verifiedBy?._id !== userId ) && serviceRecordConfig?.verifications?.length < serviceRecordConfig?.noOfVerificationsRequired && handleVerification}
        handleVerificationTitle="Approve"
        copyConfiguration={defaultValues?.status.toLowerCase() === 'approved' && (() => navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.copy(serviceRecordConfig._id)))}
        // ( serviceRecordConfig?.verifications.length > 0 && serviceRecordConfig?.verifications.find((verifiedUser)=> verifiedUser?.verifiedBy?._id !== userId )) || serviceRecordConfig?.verifications?.length <= serviceRecordConfig?.noOfVerificationsRequired &&
        handleEdit={defaultValues?.status.toLowerCase() !== 'approved' && defaultValues?.status.toLowerCase() !== 'submitted' && toggleEdit } 
        onDelete={onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list)} 
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField sm={6} heading="Document Title" param={defaultValues?.docTitle} />
        <ViewFormField sm={6} heading="Document Type" param={defaultValues?.recordType} />
        <ViewFormField sm={6} heading="Status" param={defaultValues?.status} />
        <ViewFormField sm={6} heading="Version No." param={defaultValues?.docVersionNo} />
      </Grid>
      <Grid container>
        <ViewFormField sm={6} heading="Machine Category" param={defaultValues?.machineCategory} />
        <ViewFormField sm={6} heading="Machine Model" param={defaultValues?.machineModel} />
      </Grid>
      <Grid container>  
        <ViewFormField sm={12} heading="Text Before Check Items" param={defaultValues?.textBeforeCheckItems} />
      </Grid>
        <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
          Check Items
        </Typography>
        {/* <Grid item md={12}>  */}
        {defaultValues?.checkItemLists?.length > 0 ? (defaultValues?.checkItemLists.map((row, index) =>
          ( typeof row?.checkItems?.length === 'number' && row?.checkItems?.length > 0 ? 
            <TableContainer >
                <Table>
                    <TableBody>
                        <CollapsibleCheckedItemRow key={uuidv4()} value={row} index={index} />
                    </TableBody>
                </Table>
            </TableContainer>
            :
            <ViewFormField />
          ))
        ) : <ViewFormField />
        }
        {/* </Grid> */}
      <ViewFormField sm={12} heading="Text After Check Items" param={defaultValues?.textAfterCheckItems} />
        <Grid container>
      <ViewFormSwitch sm={6} isActiveHeading='Enable Note' isActive={defaultValues?.enableNote} />
      <ViewFormSwitch sm={6} isActiveHeading='Enable Maintenance Recommendations	' isActive={defaultValues?.enableMaintenanceRecommendations} />
      <ViewFormSwitch sm={6} isActiveHeading='Is Operator Signature Required' isActive={defaultValues?.isOperatorSignatureRequired} />
      <ViewFormSwitch sm={6} isActiveHeading='Enable Suggested Spares' isActive={defaultValues?.enableSuggestedSpares} />
        </Grid>
      
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Header
      </Typography>
      <Grid container>
        <ViewFormField sm={4} heading="Header Left Text" param={defaultValues?.header?.leftText} />
        <ViewFormField sm={4} heading="Header Center Text" param={defaultValues?.header?.centerText} />
        <ViewFormField sm={4} heading="Header Right Text" param={defaultValues?.header?.rightText} />
      </Grid>
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Footer
      </Typography>
      <Grid container>
        <ViewFormField sm={4} heading="Footer Left Text" param={defaultValues?.footer?.leftText} />
        <ViewFormField sm={4} heading="Footer Center Text" param={defaultValues?.footer?.centerText} />
        <ViewFormField sm={4} heading="Footer Right Text" param={defaultValues?.footer?.rightText} />
      </Grid>
        <ViewFormAudit defaultValues={defaultValues} />
    </Card>
  );
}
