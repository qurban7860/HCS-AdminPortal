import PropTypes from 'prop-types';
import { useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

// @mui
import { Card, Grid, Typography, TableBody, Table, TableContainer } from '@mui/material';

import {
  getServiceReportTemplate,
  approveServiceReportTemplate,
  changeServiceReportStatus,
  deleteServiceReportTemplate,
} from '../../../redux/slices/products/serviceReportTemplate';
import { useSnackbar } from '../../../components/snackbar';
// paths
import { PATH_MACHINE } from '../../../routes/paths';
//  components
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormAprovedSubmit from '../../../components/ViewForms/ViewFormAprovedSubmit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../../components/ViewForms/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow';
import { Snacks } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

ServiceReportTemplateViewForm.propTypes = {
  currentServiceReportTemplate: PropTypes.object,
};

// ----------------------------------------------------------------------

export default function ServiceReportTemplateViewForm({ currentServiceReportTemplate = null }) {
  const toggleEdit = () => {
    navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.edit(id));
  };
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const { serviceReportTemplate, editFormVisibility, isLoading } = useSelector((state) => state.serviceReportTemplate);
  const { id } = useParams();
  
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    if (id != null) {
      dispatch(getServiceReportTemplate(id));
    }
  }, [dispatch, id, editFormVisibility]);
  const defaultValues = useMemo(
    () => ({
      reportType: serviceReportTemplate?.reportType || '',
      status: serviceReportTemplate?.status || '',
      docVersionNo: serviceReportTemplate?.docVersionNo || '',
      machineCategory: serviceReportTemplate?.machineCategory?.name || '',
      machineModel: serviceReportTemplate?.machineModel?.name || '',
      reportTitle: serviceReportTemplate?.reportTitle || '',
      textBeforeCheckItems: serviceReportTemplate?.textBeforeCheckItems || '',
      checkItemLists: serviceReportTemplate?.checkItemLists ,
      textAfterCheckItems: serviceReportTemplate?.textAfterCheckItems || '',
      isOperatorSignatureRequired: serviceReportTemplate?.isOperatorSignatureRequired,
      enableNote: serviceReportTemplate?.enableNote,
      enableMaintenanceRecommendations: serviceReportTemplate?.enableMaintenanceRecommendations,
      enableSuggestedSpares: serviceReportTemplate?.enableSuggestedSpares,
      header: serviceReportTemplate?.header || {},
      footer: serviceReportTemplate?.footer || {},
      isActive: serviceReportTemplate?.isActive|| false,
      createdByFullName: serviceReportTemplate?.createdBy?.name || '',
      createdAt: serviceReportTemplate?.createdAt || '',
      createdIP: serviceReportTemplate?.createdIP || '',
      updatedByFullName: serviceReportTemplate?.updatedBy?.name || '',
      updatedAt: serviceReportTemplate?.updatedAt || '',
      updatedIP: serviceReportTemplate?.updatedIP || '',
      submittedInfo: serviceReportTemplate?.submittedInfo || {},
      approvedInfo: serviceReportTemplate?.approvals || [],

    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentServiceReportTemplate, serviceReportTemplate]
  );

  const onDelete = async () => {
    try {
      await dispatch(deleteServiceReportTemplate(id));
      enqueueSnackbar('Service report template Archived Successfullty!');
      navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root);
    } catch (err) {
      enqueueSnackbar('Service report template Archive failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleVerification = async () => {
    try {
      await dispatch(approveServiceReportTemplate(serviceReportTemplate._id, true));
      await dispatch(getServiceReportTemplate(serviceReportTemplate._id));
      enqueueSnackbar(Snacks.configuration_approve_Success);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };


  const returnToDraft = async () => {
    try {
      await dispatch(changeServiceReportStatus(serviceReportTemplate._id, 'DRAFT'));
      await dispatch(getServiceReportTemplate(serviceReportTemplate._id));
      enqueueSnackbar('Document is submitted for draft!');
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };
  
  const returnToSubmitted = async () => {
    try {
      await dispatch(changeServiceReportStatus(serviceReportTemplate._id, 'SUBMITTED'));
      await dispatch(getServiceReportTemplate(serviceReportTemplate._id));
      enqueueSnackbar('Document is submitted for approval!');
    } catch (error) {
      console.log(error);
      enqueueSnackbar(error, { variant: 'error' });
    }
  };
  
  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        approvers={ serviceReportTemplate?.approvals }
        approveConfiglength={`${serviceReportTemplate?.approvals?.length || 0}/${serviceReportTemplate?.noOfApprovalsRequired || 1 }`}
        isSubmitted={defaultValues.isActive && !serviceReportTemplate?.approvals?.length > 0 && defaultValues?.status.toLowerCase() === 'submitted' && defaultValues?.status.toLowerCase() !== 'approved' && returnToDraft } 
        returnToSubmitted={defaultValues.isActive && defaultValues?.status.toLowerCase() === 'draft' && defaultValues?.status.toLowerCase() !== 'approved' && returnToSubmitted } 
        approveConfig={ serviceReportTemplate?.approvals?.length >= serviceReportTemplate?.noOfApprovalsRequired} 
        approveHandler={defaultValues.isActive && defaultValues?.status.toLowerCase() === 'submitted' && 
        serviceReportTemplate?.approvals?.length < serviceReportTemplate?.noOfApprovalsRequired && handleVerification}
        handleVerificationTitle="Approve"
        copyConfiguration={defaultValues.isActive && defaultValues?.status.toLowerCase() === 'approved' && (() => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.copy(serviceReportTemplate._id)))}
        handleEdit={defaultValues.isActive && defaultValues?.status.toLowerCase() !== 'approved' && defaultValues?.status.toLowerCase() !== 'submitted' && toggleEdit } 
        onDelete={defaultValues.isActive && onDelete} 
        backLink={() => navigate(PATH_MACHINE.machines.machineSettings.serviceReportsTemplate.root)} 
        machineSettingPage
      />
      <Grid container sx={{mt:2}}>
        <ViewFormField isLoading={isLoading} sm={6} heading="Document Title" param={defaultValues?.reportTitle} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Document Type" param={defaultValues?.reportType} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Status" param={defaultValues?.status} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Version No." param={defaultValues?.docVersionNo} />
      </Grid>
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={6} heading="Machine Category" param={defaultValues?.machineCategory} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Machine Model" param={defaultValues?.machineModel} />
      </Grid>
      <Grid container>  
        <ViewFormField isLoading={isLoading} sm={12} heading="Text Before Check Items" param={defaultValues?.textBeforeCheckItems} />
      </Grid>
        <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
          Check Items
        </Typography>
        {/* <Grid item md={12}>  */}
        {!isLoading && defaultValues?.checkItemLists?.length > 0 ? (defaultValues?.checkItemLists.map((row, index) =>
          ( typeof row?.checkItems?.length === 'number' && row?.checkItems?.length > 0 ? 
            <TableContainer >
                <Table>
                    <TableBody>
                        <CollapsibleCheckedItemRow key={uuidv4()} value={row} index={index} />
                    </TableBody>
                </Table>
            </TableContainer>
            :
            <ViewFormField isLoading={isLoading} />
          ))
        ) : <ViewFormField isLoading={isLoading} />
        }
        {/* </Grid> */}
      <ViewFormField isLoading={isLoading} sm={12} heading="Text After Check Items" param={defaultValues?.textAfterCheckItems} />
        <Grid container>
      <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Enable Note' isActive={defaultValues?.enableNote} />
      <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Enable Maintenance Recommendations	' isActive={defaultValues?.enableMaintenanceRecommendations} />
      <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Is Operator Signature Required' isActive={defaultValues?.isOperatorSignatureRequired} />
      <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Enable Suggested Spares' isActive={defaultValues?.enableSuggestedSpares} />
        </Grid>
      
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Header
      </Typography>
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={4} heading="Header Left Text" param={defaultValues?.header?.leftText} />
        <ViewFormField isLoading={isLoading} sm={4} heading="Header Center Text" param={defaultValues?.header?.centerText} />
        <ViewFormField isLoading={isLoading} sm={4} heading="Header Right Text" param={defaultValues?.header?.rightText} />
      </Grid>
      <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary', m:1.7 }}>
        Footer
      </Typography>
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={4} heading="Footer Left Text" param={defaultValues?.footer?.leftText} />
        <ViewFormField isLoading={isLoading} sm={4} heading="Footer Center Text" param={defaultValues?.footer?.centerText} />
        <ViewFormField isLoading={isLoading} sm={4} heading="Footer Right Text" param={defaultValues?.footer?.rightText} />
      </Grid>
        <ViewFormAprovedSubmit submittedInfo={defaultValues?.submittedInfo} approvedInfo={defaultValues.approvedInfo} />
        <ViewFormAudit defaultValues={defaultValues} />
    </Card>
  );
}
