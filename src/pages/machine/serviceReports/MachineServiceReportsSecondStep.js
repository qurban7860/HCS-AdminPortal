import React, { useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { RHFTextField } from '../../../components/hook-form';
import CheckedItemInputRow from './CheckedItemInputRow';
import FormProvider from '../../../components/hook-form/FormProvider';
import { getMachineServiceReportCheckItems, resetCheckItemValues, setFormActiveStep, updateMachineServiceReport } from '../../../redux/slices/products/machineServiceReport';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import { MachineServiceReportPart2TBCISchema, MachineServiceReportPart2TACISchema } from '../../schemas/machine';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import HistoryNotes from './HistoryNotes';

MachineServiceReportsSecondStep.propTypes = {
  handleDraftRequest: PropTypes.func,
  handleDiscard: PropTypes.func,
  handleBack: PropTypes.func
};

function MachineServiceReportsSecondStep({ handleDraftRequest, handleDiscard, handleBack}) {
  
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams();
  
  const { machineServiceReport, machineServiceReportCheckItems, isLoadingCheckItems } = useSelector((state) => state.machineServiceReport);
  
  const [ isDraft, setIsDraft ] = useState(false);
  const saveAsDraft = async () => setIsDraft(true);

  useEffect(() =>{
    if( machineId && id ){
      dispatch(getMachineServiceReportCheckItems( machineId, id ));
    }
    // return ()=> dispatch(resetCheckItemValues())
  },[ dispatch, machineId, id ])

  const defaultValues = useMemo(
      () => {
        const initialValues = {
        serviceDate:                  machineServiceReport?.serviceDate || new Date(),
        versionNo:                    machineServiceReport?.versionNo || 1,
        textBeforeCheckItems:         '',
        textAfterCheckItems:          '',
      }
      return initialValues;
    },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [ machineServiceReport ]
    );

    const formMethodsBefore = useForm({
      resolver: yupResolver(MachineServiceReportPart2TBCISchema),
      defaultValues,
    });
    const { handleSubmit: handleSubmitBefore, watch: watchBefore, reset: resetBefore, formState: { isDirty: isDirtyBefore, isSubmitting: isSubmittingBefore, isSubmitted:isSubmittedBefore } } = formMethodsBefore;
    const { textBeforeCheckItems } = watchBefore();
    
    const formMethodsAfter = useForm({
      resolver: yupResolver(MachineServiceReportPart2TACISchema),
      defaultValues,
    });
    const { handleSubmit: handleSubmitAfter, watch: watchAfter, reset: resetAfter, formState: { isDirty: isDirtyAfter, isSubmitting: isSubmittingAfter, isSubmitted:isSubmittedAfter } } = formMethodsAfter;
    const { textAfterCheckItems } = watchAfter();
    
    const methods = useForm({ defaultValues });
    const { handleSubmit, formState: { isSubmitting } } = methods;
    
    // useEffect(() => {
    //   if (machineServiceReport) {
    //     // resetBefore(defaultValues);
    //     // resetAfter(defaultValues);   
    //     reset(defaultValues); 
    //   }
    // }, [resetBefore, resetAfter, reset, machineServiceReport, defaultValues]);
    

    const [showMessage, setShowMessage] = useState(false);
    const submitBefore = async (data) => {
      const params = {
        textBeforeCheckItems: data.textBeforeCheckItems || '',
        isReportDocsOnly: false,
      };
      try {
        await dispatch(updateMachineServiceReport(machineId, id, params));
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 10000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

    const submitAfter = async (data) => {
      const params = {
        textAfterCheckItems: data?.textAfterCheckItems || '',
        isReportDocsOnly: false,
      };

      try {
        await dispatch(updateMachineServiceReport(machineId, id, params));
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
        }, 10000);
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

    const onSubmit = async (data) => {
      try {
      const params = {
        textBeforeCheckItems: data?.textBeforeCheckItems || '',
        textAfterCheckItems: data?.textAfterCheckItems || '',
        isReportDocsOnly: true
      };

        if (isDraft) {
          await dispatch(updateMachineServiceReport(machineId, id, params));
          await handleDraftRequest(isDraft);
        } else {
          await dispatch(setFormActiveStep(2));
        }
      } catch (err) {
        console.error(err);
        enqueueSnackbar('Saving failed!', { variant: `error` });
      }
    };

  return (
      <Stack spacing={2}>
            <FormProvider key='beforeForm' methods={formMethodsBefore} onSubmit={handleSubmitBefore(submitBefore)}>
            <Stack px={2} spacing={2}>
              <RHFTextField name="textBeforeCheckItems" label="Text Before Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row' justifyContent='flex-end' gap={2}>
                  {isSubmittedBefore && showMessage && <Typography variant='body2' color='green' sx={{mt:0.5}}>Saved Successfully!</Typography>}
                  <LoadingButton disabled={ !isDirtyBefore } type='submit' loading={isSubmittingBefore} size='small' variant='contained'>Save</LoadingButton>
                  <HistoryNotes historicalData={ machineServiceReport?.textBeforeCheckItems } start />
                </Grid>
              </Stack>
            </FormProvider>
            {isLoadingCheckItems? 
              <Stack px={2} spacing={2}>
                <Skeleton />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation="wave" />
                <Skeleton animation={false} />
              </Stack>
              :
              <>
                {machineServiceReportCheckItems?.checkItemLists?.map((row, index) => (
                  <React.Fragment key={`check-item-list-${row._id}`}>
                    <Stack sx={{ px: 1 }}>
                      <FormLabel content={`${index + 1}). ${row?.ListTitle || ''} (Items: ${row?.checkItems?.length})`} />
                    </Stack>
                    {row?.checkItems?.map((childRow, childIndex) => (
                      <CheckedItemInputRow
                        index={index}
                        rowData={childRow}
                        childIndex={childIndex}
                        checkItemListId={row?._id}
                        key={`row-${row._id}-${index}-${childIndex}`}
                      />
                    ))}
                  </React.Fragment>
                ))}
              </>
            }

            <FormProvider methods={formMethodsAfter}  key='afterForm'>
              <Stack px={2} spacing={2}>
                <RHFTextField name="textAfterCheckItems" label="Text After Check Items" minRows={3} multiline />
                <Grid container display='flex' direction='row' justifyContent='flex-end' gap={2}>
                  {isSubmittedAfter && showMessage && <Typography variant='body2' color='green' sx={{mt:0.5}}>Saved Successfully!</Typography>}
                  <LoadingButton disabled={ !isDirtyAfter } onClick={handleSubmitAfter(submitAfter)} loading={isSubmittingAfter} size='small' variant='contained'>Save</LoadingButton>
                  <HistoryNotes historicalData={ machineServiceReport?.textAfterCheckItems } start />
                </Grid>
              </Stack>
            </FormProvider>
            <FormProvider methods={methods}  key='submit' onSubmit={handleSubmit(onSubmit)} >
              <ServiceRecodStepButtons handleDraft={saveAsDraft} isDraft={isDraft} isSubmitting={isSubmitting} />
            </FormProvider>
      </Stack>
)}

export default MachineServiceReportsSecondStep