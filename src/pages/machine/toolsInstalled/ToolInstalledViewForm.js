import { useLayoutEffect, useMemo } from 'react';
// @mui
import { Container, Grid,  Table, TableBody, TableCell, TableHead, TableRow,  Paper, TableContainer,tableCellClasses , styled, Card } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// 
import { fDateTime } from '../../../utils/formatTime';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
// components
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import {
  getToolInstalled,
  deleteToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
// constants
import ViewFormSwitch from '../../../components/ViewForms/ViewFormSwitch';
import MachineTabContainer from '../util/MachineTabContainer';

export default function ToolInstalledViewForm() {
  const { toolInstalled, isLoading } = useSelector((state) => state.toolInstalled);
  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams()
  const navigate = useNavigate()

  useLayoutEffect(()=>{
    if( machineId && id ){
      dispatch(getToolInstalled( machineId, id ))
    }
  },[ dispatch, machineId, id ])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const onDelete = async () => {
    try {
      if( machineId && id){
        await dispatch(deleteToolInstalled(machineId, id, toolInstalled?.toolType));
      }
      enqueueSnackbar('Tool Installed Archived successfully!');
      await navigate(PATH_MACHINE.machines.toolsInstalled.root(machineId));
    } catch (err) {
      enqueueSnackbar(err.message, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = () => navigate(PATH_MACHINE.machines.toolsInstalled.edit(machineId, id));

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
    [ toolInstalled ]
  );

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='toolsinstalled' />
    <Grid item md={12} mt={2}>
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons 
        isActive={defaultValues.isActive} 
        backLink={()=> navigate(PATH_MACHINE.machines.toolsInstalled.root(machineId)) } 
        handleEdit={handleEdit} 
        onDelete={onDelete} 
        disableEditButton={machine?.status?.slug==="transferred"}
        disableDeleteButton={machine?.status?.slug==="transferred"}
        />
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={6} heading="Tool" param={defaultValues?.toolName}/>
        <ViewFormField isLoading={isLoading} sm={6} heading="Offset" param={defaultValues?.offset}/>
        <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Apply Waste' isActive={defaultValues.isApplyWaste} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Waste Trigger Distance" param={defaultValues?.wasteTriggerDistance}/>
        <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Apply Crimp' isActive={defaultValues.isApplyCrimp} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Crimp Trigger Distance" param={defaultValues?.crimpTriggerDistance}/>
        <ViewFormField isLoading={isLoading} sm={6} heading="Operations" param={defaultValues?.operations}/>
        <Grid item sm={12} sx={{display:'flex'}}>
          <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Back to Back Punch' isActive={defaultValues.isBackToBackPunch} />
          <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Manual Select' isActive={defaultValues.isManualSelect} />
          <ViewFormSwitch isLoading={isLoading} sm={6} isActiveHeading='Assign' isActive={defaultValues.isAssign} />
        </Grid>
        <ViewFormField isLoading={isLoading} sm={12} heading="Tool Type" param={defaultValues?.toolType} />
        {toolInstalled?.toolType === 'SINGLE TOOL'  && (
          <>
            <ViewFormField isLoading={isLoading} sm={6} heading="Engage Solenoid Location" param={toolInstalled?.singleToolConfig?.engageSolenoidLocation} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Return Solenoid Location" param={toolInstalled?.singleToolConfig?.returnSolenoidLocation} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Engage On Condition" param={toolInstalled?.singleToolConfig?.engageOnCondition} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Engage Off Condition" param={toolInstalled?.singleToolConfig?.engageOffCondition} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Time Out" param={fDateTime(toolInstalled?.singleToolConfig?.timeOut)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Engaging Duration" param={toolInstalled?.singleToolConfig?.engagingDuration} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Returning Duration" param={toolInstalled?.singleToolConfig?.returningDuration} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Two Way Check Delay Time" param={toolInstalled?.singleToolConfig?.twoWayCheckDelayTime} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Home Proximity Sensor Location" param={toolInstalled?.singleToolConfig?.homeProximitySensorLocation} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Engaged Proximity Sensor Location" param={toolInstalled?.singleToolConfig?.engagedProximitySensorLocation} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Pressure Target" param={toolInstalled?.singleToolConfig?.pressureTarget} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Distance Sensor Location" param={toolInstalled?.singleToolConfig?.distanceSensorLocation} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Distance Sensor Target" param={toolInstalled?.singleToolConfig?.distanceSensorTarget} />
            <ViewFormSwitch isLoading={isLoading} sm={4} isActiveHeading='Has Two Way Check' isActive={toolInstalled?.singleToolConfig?.isHasTwoWayCheck} />
            <ViewFormSwitch isLoading={isLoading} sm={4} isActiveHeading='Engaging Has Enable' isActive={toolInstalled?.singleToolConfig?.isEngagingHasEnable} />
            <ViewFormSwitch isLoading={isLoading} sm={4} isActiveHeading='Returning Has Enable' isActive={toolInstalled?.singleToolConfig?.isReturningHasEnable} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Moving Punch Condition" param={toolInstalled?.singleToolConfig?.movingPunchCondition} />
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
    </Container>
  );
}
