import PropTypes from 'prop-types';
import { useMemo, useState, useLayoutEffect,memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import { Box, Card, Grid, Typography, Table, TableBody, TableCell, TableHead, TableRow,  Paper, TableContainer,tableCellClasses , styled } from '@mui/material';
import {
  RHFSwitch,
} from '../../../components/hook-form';
import {
  TableNoData,
  TableSkeleton
} from '../../../components/table';
// redux
import {
  setToolInstalledFormVisibility,
  setToolInstalledEditFormVisibility,
  updateToolInstalled,
  deleteToolInstalled,
  getToolsInstalled,
  getToolInstalled,
} from '../../../redux/slices/products/toolInstalled';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate, fDateTime } from '../../../utils/formatTime';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormSwitch from '../../components/ViewForms/ViewFormSwitch';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { useSnackbar } from '../../../components/snackbar';

// ----------------------------------------------------------------------
ToolsInstalledViewForm.propTypes = {
  currentTool: PropTypes.object,
};
function ToolsInstalledViewForm({ currentTool = null }) {
  const {
    initial,
    error,
    responseMessage,
    toolInstalledEditFormVisibility,
    toolsInstalled,
    toolInstalled,
    formVisibility,
  } = useSelector((state) => state.toolInstalled);
  console.log('currentTool : ',currentTool)
  const { machine } = useSelector((state) => state.machine);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.contrastText,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  useLayoutEffect(() => {
    if (machine.transferredMachine) {
      setDisableDeleteButton(true);
      setDisableEditButton(true);
    } else {
      setDisableDeleteButton(false);
      setDisableEditButton(false);
    }
  }, [machine]);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteToolInstalled(machine._id, currentTool));
      enqueueSnackbar('Tool installed deleted Successfully!');
      dispatch(getToolsInstalled(machine._id));
    } catch (err) {
      // if(err.Message){
      //   enqueueSnackbar(err.Message,{ variant: `error` })
      // }else if(err.message){
      //   enqueueSnackbar(err.message,{ variant: `error` })
      // }else{
      //   enqueueSnackbar("Something went wrong!",{ variant: `error` })
      // }
      enqueueSnackbar('Tool installed delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    await dispatch(getToolInstalled(machine._id, currentTool._id));
    dispatch(setToolInstalledEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => ({
      toolName: currentTool?.tool?.name || '',  
      offset: currentTool?.offset || '',
      wasteTriggerDistance: currentTool?.wasteTriggerDistance || '',
      crimpTriggerDistance: currentTool?.crimpTriggerDistance || '',
      isApplyWaste: currentTool?.isApplyWaste || false,
      isApplyCrimp: currentTool?.isApplyCrimp || false,
      isBackToBackPunch: currentTool?.isBackToBackPunch || false,
      isManualSelect: currentTool?.isManualSelect || false,  
      isAssign: currentTool?.isAssign || false,
      operations: currentTool?.operations || '',
      toolType: currentTool?.toolType || '',
      isActive: currentTool?.isActive,
      createdAt: currentTool?.createdAt || '',
      createdByFullName: currentTool?.createdBy?.name || '',
      createdIP: currentTool?.createdIP || '',
      updatedAt: currentTool?.updatedAt || '',
      updatedByFullName: currentTool?.updatedBy?.name || '',
      updatedIP: currentTool?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentTool, machine]
  );

  return (
    <Grid  sx={{ pr: '2rem' }}>
        <ViewFormEditDeleteButtons
          // disableDeleteButton={disableDeleteButton}
          // disableEditButton={disableEditButton}
          handleEdit={handleEdit}
          onDelete={onDelete}
        />
      <Grid container item sm={12}>
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
        <ViewFormField
          sm={6}
          heading="Tool"
          param={defaultValues?.toolName}
        />

        <ViewFormField
          sm={6}
          heading="Offset"
          param={defaultValues?.offset}
        />

        <ViewFormSwitch sm={6} isActiveHeading='Apply Waste' isActive={defaultValues.isApplyWaste} />

        <ViewFormField
          sm={6}
          heading="Waste Trigger Distance"
          param={defaultValues?.wasteTriggerDistance}
        />

        <ViewFormSwitch sm={6} isActiveHeading='Apply Crimp' isActive={defaultValues.isApplyCrimp} />
        
        <ViewFormField
          sm={6}
          heading="Crimp Trigger Distance"
          param={defaultValues?.crimpTriggerDistance}
        />
        
        <ViewFormField
          sm={6}
          heading="Operations"
          param={defaultValues?.operations}
        />

        <Grid item sm={12} sx={{display:'flex'}}>
          <ViewFormSwitch sm={6} isActiveHeading='Back to Back Punch' isActive={defaultValues.isBackToBackPunch} />
          <ViewFormSwitch sm={6} isActiveHeading='Manual Select' isActive={defaultValues.isManualSelect} />
          <ViewFormSwitch sm={6} isActiveHeading='Assign' isActive={defaultValues.isAssign} />
        </Grid>
          <ViewFormField sm={12} heading="Tool Type" param={defaultValues?.toolType} />
          
        {currentTool?.toolType === 'SINGLE TOOL'  && (
          <>
            <ViewFormField sm={6} heading="Engage Solenoid Location" param={currentTool?.singleToolConfig?.engageSolenoidLocation} />
            <ViewFormField sm={6} heading="Return Solenoid Location" param={currentTool?.singleToolConfig?.returnSolenoidLocation} />
            <ViewFormField sm={6} heading="Engage On Condition" param={currentTool?.singleToolConfig?.engageOnCondition} />
            <ViewFormField sm={6} heading="Engage Off Condition" param={currentTool?.singleToolConfig?.engageOffCondition} />
            <ViewFormField sm={12} heading="Time Out" param={fDateTime(currentTool?.singleToolConfig?.timeOut)} />
            <ViewFormField sm={6} heading="Engaging Duration" param={currentTool?.singleToolConfig?.engagingDuration} />
            <ViewFormField sm={6} heading="Returning Duration" param={currentTool?.singleToolConfig?.returningDuration} />
            <ViewFormField sm={12} heading="Two Way Check Delay Time" param={currentTool?.singleToolConfig?.twoWayCheckDelayTime} />
            <ViewFormField sm={6} heading="Home Proximity Sensor Location" param={currentTool?.singleToolConfig?.homeProximitySensorLocation} />
            <ViewFormField sm={6} heading="Engaged Proximity Sensor Location" param={currentTool?.singleToolConfig?.engagedProximitySensorLocation} />
            <ViewFormField sm={12} heading="Pressure Target" param={currentTool?.singleToolConfig?.pressureTarget} />
            <ViewFormField sm={6} heading="Distance Sensor Location" param={currentTool?.singleToolConfig?.distanceSensorLocation} />
            <ViewFormField sm={6} heading="Distance Sensor Target" param={currentTool?.singleToolConfig?.distanceSensorTarget} />
            <ViewFormSwitch sm={4} isActiveHeading='Has Two Way Check' isActive={currentTool?.singleToolConfig?.isHasTwoWayCheck} />
            <ViewFormSwitch sm={4} isActiveHeading='Engaging Has Enable' isActive={currentTool?.singleToolConfig?.isEngagingHasEnable} />
            <ViewFormSwitch sm={4} isActiveHeading='Returning Has Enable' isActive={currentTool?.singleToolConfig?.isReturningHasEnable} />
            <ViewFormField sm={6} heading="Moving Punch Condition" param={currentTool?.singleToolConfig?.movingPunchCondition} />
          </>
        )}

        {currentTool?.toolType === 'COMPOSIT TOOL'  && ( 
          <>
          <TableContainer component={Paper} sx={{ my:3 }}>
              <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left" >Engage Instruction</StyledTableCell>
                    <StyledTableCell align="left" >Disengage Instruction</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody >
                  {currentTool?.compositeToolConfig.length > 0 && currentTool?.compositeToolConfig?.map((row) => (
                    <TableRow hover key={row?._id}>
                      <TableCell align="left">{row?.engageInstruction?.tool?.name}</TableCell>
                      <TableCell align="left">{row?.disengageInstruction?.tool?.name}</TableCell>
                    </TableRow>
                  )) }
                </TableBody>
              </Table>
                {/* {currentTool?.compositeToolConfig?.length < 1 && <Grid item md={12} ><TableNoData isNotFound={currentTool?.compositeToolConfig.length < 1 } /></Grid>} */}
            </TableContainer>
          </>
        )}


        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>
    </Grid>
  );
}
export default memo(ToolsInstalledViewForm)