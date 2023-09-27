import { useMemo } from 'react';
// @mui
import {  Grid,  Table, TableBody, TableCell, TableHead, TableRow,  Paper, TableContainer,tableCellClasses , styled, Card, Tooltip } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// import { fDate } from 'src/utils/formatTime';
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  setToolInstalledEditFormVisibility,
  getToolInstalled,
  deleteToolInstalled,
  setToolInstalledViewFormVisibility,
} from '../../../redux/slices/products/toolInstalled';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
// constants
import { Snacks } from '../../../constants/machine-constants';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';

export default function ToolInstalledViewForm() {
  const { toolInstalled } = useSelector((state) => state.toolInstalled);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      dispatch(deleteToolInstalled(machine._id, toolInstalled._id));
      enqueueSnackbar(Snacks.licenseDeleted);
      dispatch(setToolInstalledViewFormVisibility(false));
    } catch (err) {
      enqueueSnackbar(Snacks.failedDeleteToolInstalled, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    dispatch(getToolInstalled(machine._id, toolInstalled._id));
    dispatch(setToolInstalledViewFormVisibility(false));
    dispatch(setToolInstalledEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      toolName: toolInstalled?.tool?.name || '',  
      offset: toolInstalled?.offset || '',
      wasteTriggerDistance: toolInstalled?.wasteTriggerDistance || '',
      crimpTriggerDistance: toolInstalled?.crimpTriggerDistance || '',
      isApplyWaste: toolInstalled?.isApplyWaste || false,
      isApplyCrimp: toolInstalled?.isApplyCrimp || false,
      isBackToBackPunch: toolInstalled?.isBackToBackPunch || false,
      isManualSelect: toolInstalled?.isManualSelect || false,  
      isAssign: toolInstalled?.isAssign || false,
      operations: toolInstalled?.operations || '',
      toolType: toolInstalled?.toolType || '',
      isActive: toolInstalled?.isActive,
      createdAt: toolInstalled?.createdAt || '',
      createdByFullName: toolInstalled?.createdBy?.name || '',
      createdIP: toolInstalled?.createdIP || '',
      updatedAt: toolInstalled?.updatedAt || '',
      updatedByFullName: toolInstalled?.updatedBy?.name || '',
      updatedIP: toolInstalled?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toolInstalled, machine]
  );

  return (
    // needs cleanup
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons backLink={()=> dispatch(setToolInstalledViewFormVisibility(false))} handleEdit={handleEdit} onDelete={onDelete} />
      <Grid display="inline-flex">
        <Tooltip>
          <ViewFormField isActive={defaultValues.isActive} />
        </Tooltip>
      </Grid>
      <Grid container>
        <ViewFormField sm={6} heading="Tool" param={defaultValues?.toolName}/>
        <ViewFormField sm={6} heading="Offset" param={defaultValues?.offset}/>
        <ViewFormSwitch sm={6} isActiveHeading='Apply Waste' isActive={defaultValues.isApplyWaste} />
        <ViewFormField sm={6} heading="Waste Trigger Distance" param={defaultValues?.wasteTriggerDistance}/>
        <ViewFormSwitch sm={6} isActiveHeading='Apply Crimp' isActive={defaultValues.isApplyCrimp} />
        <ViewFormField sm={6} heading="Crimp Trigger Distance" param={defaultValues?.crimpTriggerDistance}/>
        <ViewFormField sm={6} heading="Operations" param={defaultValues?.operations}/>
        <Grid item sm={12} sx={{display:'flex'}}>
          <ViewFormSwitch sm={6} isActiveHeading='Back to Back Punch' isActive={defaultValues.isBackToBackPunch} />
          <ViewFormSwitch sm={6} isActiveHeading='Manual Select' isActive={defaultValues.isManualSelect} />
          <ViewFormSwitch sm={6} isActiveHeading='Assign' isActive={defaultValues.isAssign} />
        </Grid>
        <ViewFormField sm={12} heading="Tool Type" param={defaultValues?.toolType} />
        {toolInstalled?.toolType === 'SINGLE TOOL'  && (
          <>
            <ViewFormField sm={6} heading="Engage Solenoid Location" param={toolInstalled?.singleToolConfig?.engageSolenoidLocation} />
            <ViewFormField sm={6} heading="Return Solenoid Location" param={toolInstalled?.singleToolConfig?.returnSolenoidLocation} />
            <ViewFormField sm={6} heading="Engage On Condition" param={toolInstalled?.singleToolConfig?.engageOnCondition} />
            <ViewFormField sm={6} heading="Engage Off Condition" param={toolInstalled?.singleToolConfig?.engageOffCondition} />
            <ViewFormField sm={12} heading="Time Out" param={fDateTime(toolInstalled?.singleToolConfig?.timeOut)} />
            <ViewFormField sm={6} heading="Engaging Duration" param={toolInstalled?.singleToolConfig?.engagingDuration} />
            <ViewFormField sm={6} heading="Returning Duration" param={toolInstalled?.singleToolConfig?.returningDuration} />
            <ViewFormField sm={12} heading="Two Way Check Delay Time" param={toolInstalled?.singleToolConfig?.twoWayCheckDelayTime} />
            <ViewFormField sm={6} heading="Home Proximity Sensor Location" param={toolInstalled?.singleToolConfig?.homeProximitySensorLocation} />
            <ViewFormField sm={6} heading="Engaged Proximity Sensor Location" param={toolInstalled?.singleToolConfig?.engagedProximitySensorLocation} />
            <ViewFormField sm={12} heading="Pressure Target" param={toolInstalled?.singleToolConfig?.pressureTarget} />
            <ViewFormField sm={6} heading="Distance Sensor Location" param={toolInstalled?.singleToolConfig?.distanceSensorLocation} />
            <ViewFormField sm={6} heading="Distance Sensor Target" param={toolInstalled?.singleToolConfig?.distanceSensorTarget} />
            <ViewFormSwitch sm={4} isActiveHeading='Has Two Way Check' isActive={toolInstalled?.singleToolConfig?.isHasTwoWayCheck} />
            <ViewFormSwitch sm={4} isActiveHeading='Engaging Has Enable' isActive={toolInstalled?.singleToolConfig?.isEngagingHasEnable} />
            <ViewFormSwitch sm={4} isActiveHeading='Returning Has Enable' isActive={toolInstalled?.singleToolConfig?.isReturningHasEnable} />
            <ViewFormField sm={6} heading="Moving Punch Condition" param={toolInstalled?.singleToolConfig?.movingPunchCondition} />
          </>
        )}

        {toolInstalled?.toolType === 'COMPOSIT TOOL'  && ( 
          <TableContainer component={Paper} sx={{ my:3 }}>
              <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left" >Engage Instruction</StyledTableCell>
                    <StyledTableCell align="left" >Disengage Instruction</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {toolInstalled?.compositeToolConfig.length > 0 && toolInstalled?.compositeToolConfig?.map((row) => (
                    <TableRow hover key={row?._id}>
                      <TableCell align="left">{row?.engageInstruction?.tool?.name}</TableCell>
                      <TableCell align="left">{row?.disengageInstruction?.tool?.name}</TableCell>
                    </TableRow>
                  )) }
                </TableBody>
              </Table>
            </TableContainer>
        )}
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Card>
    </Grid>
  );
}
