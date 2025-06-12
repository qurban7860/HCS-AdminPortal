import React, { useEffect, useLayoutEffect, useState, useMemo, memo, useCallback } from 'react'
import PropTypes from 'prop-types';
import b64toBlob from 'b64-to-blob';
import { Box, Button, Dialog, DialogTitle, Divider, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import FormProvider from '../../../components/hook-form/FormProvider';
import { RHFAutocomplete, RHFDatePicker, RHFUpload, RHFRadioGroup } from '../../../components/hook-form';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { MachineServiceReportPart1Schema } from '../../schemas/machine';
import { PATH_MACHINE } from '../../../routes/paths';
import { handleError } from '../../../utils/errorHandler';
import { getActiveSPContacts, resetActiveSPContacts } from '../../../redux/slices/customer/contact';
import { addMachineServiceReport, setFormActiveStep, updateMachineServiceReport, addMachineServiceReportFiles, deleteReportFile, downloadReportFile } from '../../../redux/slices/products/machineServiceReport';
import { getActiveServiceReportTemplatesForRecords, resetServiceReportTemplate } from '../../../redux/slices/products/serviceReportTemplate';
import ServiceRecodStepButtons from '../../../components/DocumentForms/ServiceRecodStepButtons';
import SkeletonLine from '../../../components/skeleton/SkeletonLine';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import RHFNoteFields from './RHFNoteFields';

MachineServiceReportsFirstStep.propTypes = {
  handleComplete: PropTypes.func,
  handleDraftRequest: PropTypes.func,
  handleDiscard: PropTypes.func,
};

function MachineServiceReportsFirstStep({ handleComplete, handleDraftRequest, handleDiscard }) {

  const regEx = /^[^2]*/;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { machineId, id } = useParams();
  const { reportTypes, activeServiceReportTemplatesForRecords } = useSelector((state) => state.serviceReportTemplate);
  const { machineServiceReport, isLoading, isLoadingFiles } = useSelector((state) => state.machineServiceReport);
  const { machine } = useSelector((state) => state.machine);
  const [isDraft, setIsDraft] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const saveAsDraft = async () => setIsDraft(true);
  const saveAsSubmit = async () => setIsSubmit(true);

  const machineDecoilers = (machine?.machineConnections || [])?.map((decoiler) => ({
    _id: decoiler?.connectedMachine?._id ?? null,
    name: decoiler?.connectedMachine?.name ?? null,
    serialNo: decoiler?.connectedMachine?.serialNo ?? null
  }));

  useLayoutEffect(() => {
    dispatch(getActiveServiceReportTemplatesForRecords(machineId));
    dispatch(getActiveSPContacts());
    return () => {
      dispatch(resetActiveSPContacts());
      dispatch(resetServiceReportTemplate())
    }
  }, [dispatch, machineId]);

  const defaultValues = useMemo(
    () => {
      const initialValues = {
        serviceDate: machineServiceReport?.serviceDate || new Date(),
        docReportType: reportTypes.find(rt => rt?.name?.toLowerCase() === machineServiceReport?.serviceReportTemplate?.reportType?.toLowerCase()) || null,
        serviceReportTemplate: machineServiceReport?.serviceReportTemplate || null,
        reportSubmition: machineServiceReport?.reportSubmition || false,
        files: machineServiceReport?.reportDocs?.map(file => ({
          key: file?._id,
          _id: file?._id,
          name: `${file?.name}.${file?.extension}`,
          type: file?.fileType,
          fileType: file?.fileType,
          preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
          src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
          path: `${file?.name}.${file?.extension}`,
          downloadFilename: `${file?.name}.${file?.extension}`,
          machineId: machineServiceReport?.machineId,
          primaryServiceReportId: id,
        })) || [],
      }
      return initialValues;
    }, [machineServiceReport, reportTypes, id]);

  const methods = useForm({
    resolver: yupResolver(MachineServiceReportPart1Schema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const {
    reset,
    watch,
    setValue,
    getValues,
    trigger,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const { docReportType, reportSubmition, files } = watch();

  useEffect(() => {
    if (id && machineServiceReport) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [machineServiceReport]);

  const dispatchFiles = async (serviceReportId, data) => {
    if (Array.isArray(data?.files) && data?.files?.length > 0) {
      const filteredFiles = data?.files?.filter((ff) => !ff?._id)
      if (Array.isArray(filteredFiles) && filteredFiles?.length > 0) {
        await dispatch(addMachineServiceReportFiles(machineId, serviceReportId, { files: filteredFiles, isReportDoc: data?.isReportDoc }))
      }
    }
  }

  const onSubmit = async (data) => {
    try {
      data.isReportDoc = true
      if (!id) {
        data.isReportDocsOnly = true;
        data.decoilers = machineDecoilers;
        const serviceReport = await dispatch(addMachineServiceReport(machineId, data));
        await dispatchFiles(serviceReport?._id, data);
        if (reportSubmition) {
          await navigate(PATH_MACHINE.machines.serviceReports.edit(machineId, serviceReport?._id))
        } else {
          await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, serviceReport?._id))
        }
      } else {
        await dispatchFiles(id, data);
        await dispatch(updateMachineServiceReport(machineId, id, data));
        if (reportSubmition) {
          await navigate(PATH_MACHINE.machines.serviceReports.edit(machineId, id))
        } else {
          await navigate(PATH_MACHINE.machines.serviceReports.view(machineId, id))
        }
      }

      if (isDraft) {
        await handleDraftRequest(isDraft);
      } else if (!isSubmit) {
        await dispatch(setFormActiveStep(1));
        await handleComplete(0);
      }
      await reset();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(handleError(err) || 'Service report save failed!', { variant: `error` });
    }
  };


  const handleRemoveFile = async (inputFile) => {
    let images = getValues(`files`);
    if (inputFile?._id) {
      await dispatch(deleteReportFile(machineId, id, inputFile?._id));
      images = await images?.filter((file) => (file?._id !== inputFile?._id))
    } else {
      images = await images?.filter((file) => (file !== inputFile))
    }
    setValue(`files`, images, { shouldValidate: true })
  };

  const handleLoadImage = async (imageId) => {
    try {
      const response = await dispatch(downloadReportFile(machineId, id, imageId));
      if (regEx.test(response.status)) {
        const existingFiles = getValues('files');
        const imageIndex = existingFiles.findIndex(image => image?._id === imageId);
        if (imageIndex !== -1) {
          const image = existingFiles[imageIndex];
          existingFiles[imageIndex] = {
            ...image,
            src: `data:${image?.fileType};base64,${response.data}`,
            preview: `data:${image?.fileType};base64,${response.data}`,
            isLoaded: true,
          };
          setValue('files', existingFiles, { shouldValidate: true });
        }
      }
    } catch (error) {
      console.error('Error loading full file:', error);
    }
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (file, fileName) => {
    try {
      setPDFName(fileName);
      setPDFViewerDialog(true);
      setPDF(null);
      if (!file?.isLoaded) {
        const response = await dispatch(downloadReportFile(machineId, id, file._id));
        if (regEx.test(response.status)) {
          const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
          const url = URL.createObjectURL(blob);
          setPDF(url);
        } else {
          enqueueSnackbar(response.statusText, { variant: 'error' });
        }
      } else {
        setPDF(file?.src);
      }
    } catch (error) {
      setPDFViewerDialog(false);
      enqueueSnackbar(handleError(error) || 'Open file failed!', { variant: 'error' });
    }
  };

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      const docFiles = files || [];
      const newFiles = acceptedFiles.map((file, index) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true
        })
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {isLoading ?
          <Stack px={2} spacing={2}>
            {
              Array.from({ length: 8 }).map((_, index) => (
                <SkeletonLine key={index} />
              ))
            }
          </Stack>
          :
          <>
            <Stack px={2} spacing={2}>
              <Box
                rowGap={2}
                columnGap={2}
                display="grid"
                sx={{ width: '100%' }}
                gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
              >

                <RHFDatePicker inputFormat='dd/MM/yyyy' name="serviceDate" label="Service Date" />

                <RHFAutocomplete
                  name="docReportType"
                  label="Report Type*"
                  disabled={id && true}
                  options={reportTypes}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option.name ? option.name : ''}`}</li>
                  )}
                // onChange={(event, newValue) =>{
                //   if(newValue){
                //       setValue('docReportType',newValue)
                //       if( serviceReportTemplate?.reportType?.toUpperCase() !== newValue?.name?.toUpperCase() ){
                //         setValue('serviceReportTemplate',null)
                //       }
                //     } else {
                //       setValue('serviceReportTemplate',null )
                //       setValue('docReportType', null )
                //     }
                //     trigger('serviceReportTemplate')
                //     trigger('docReportType')
                //   }
                // }
                />

                <RHFAutocomplete
                  name="serviceReportTemplate"
                  label="Service Report Template*"
                  disabled={id && true}
                  options={activeServiceReportTemplatesForRecords?.filter(src => !docReportType || src?.reportType?.toLowerCase() === docReportType?.name?.toLowerCase())}
                  getOptionLabel={(option) => `${option?.reportTitle || ''} ${option?.reportTitle ? '-' : ''} ${option.reportType || ''} ${option?.docVersionNo ? '- v' : ''}${option?.docVersionNo || ''}`}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.reportTitle || ''} ${option?.reportTitle ? '-' : ''} ${option.reportType || ''} ${option?.docVersionNo ? '- v' : ''}${option?.docVersionNo || ''}`}</li>
                  )}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValue('serviceReportTemplate', newValue)
                      if (!docReportType || newValue?.reportType?.toUpperCase() !== docReportType?.name?.toUpperCase()) {
                        setValue('docReportType', reportTypes?.find((rt) => rt?.name?.toUpperCase() === newValue?.reportType?.toUpperCase()))
                      }
                      setValue('textBeforeCheckItems', newValue?.textBeforeCheckItems)
                      setValue('textAfterCheckItems', newValue?.textAfterCheckItems)
                    } else {
                      setValue('serviceReportTemplate', null)
                      setValue('textBeforeCheckItems', undefined)
                      setValue('textAfterCheckItems', undefined)
                    }
                    trigger('docReportType')
                    trigger('serviceReportTemplate')
                  }
                  }
                />
              </Box>

              <RHFNoteFields
                name="technicianNotes"
                label="Technician Notes"
                isTechnician
                saveHide
                historicalData={machineServiceReport?.technicianNotes}
                setParentValue={setValue}
              />

              <FormLabel content='Reporting Documents' />
              <RHFUpload multiple thumbnail name="files" imagesOnly
                onDrop={handleDropMultiFile}
                dropZone={false}
                onRemove={handleRemoveFile}
                onLoadImage={handleLoadImage}
                onLoadPDF={handleOpenFile}

              />

              <RHFRadioGroup
                name="reportSubmition"
                row
                options={[
                  { value: false, label: 'Off-line' },
                  { value: true, label: 'Online' }
                ]}
                sx={{ my: -1 }}
                onChange={() => {
                  setValue('reportSubmition', !reportSubmition)
                }}
              />
            </Stack>
            <ServiceRecodStepButtons
              handleSubmit={!reportSubmition ? saveAsSubmit : undefined}
              isSubmitted={isSubmit || isLoadingFiles}
              handleDraft={reportSubmition ? saveAsDraft : undefined}
              isDraft={isDraft}
              isSubmitting={isSubmitting || isLoadingFiles}
            />
          </>
        }
      </FormProvider>
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={() => setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{ pb: 1, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            PDF View
            <Button variant='outlined' onClick={() => setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
          {pdf ? (
            <iframe title={PDFName} src={pdf} style={{ paddingBottom: 10 }} width='100%' height='842px' />
          ) : (
            <SkeletonPDF />
          )}
        </Dialog>
      )}
    </>
  )
}

export default memo(MachineServiceReportsFirstStep);