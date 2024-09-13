import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container ,Card, Grid, Stack, Button, FormHelperText, Checkbox, Typography, Box } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { addMachineLogRecord } from '../../../redux/slices/products/machineErpLogs';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFAutocomplete } from '../../../components/hook-form';
// constants
import CodeMirror from '../../../components/CodeMirror/JsonEditor';
import Iconify from '../../../components/iconify/Iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import { HeaderArr, unitHeaders } from './Index';
import MachineTabContainer from '../util/MachineTabContainer';
import { isValidDate } from '../../../utils/formatTime';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';


// ----------------------------------------------------------------------

export default function MachineLogsAddForm() {

  const { machine } = useSelector((state) => state.machine);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [ error, setError ] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  const handleCheckboxChange = (index) => {
    setSelectedCheckbox(index === selectedCheckbox ? null : index);
  };

  const checkboxes = [
    { label: 'Skip', value: 'skip' },
    { label: 'Update', value: 'update' },
  ];

  const defaultValues = useMemo(
    () => ({
      logTextValue: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    // resolver: yupResolver(AddInniSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { logTextValue, logType, logVersion } = watch();

  useEffect(() => {
    setValue('logTextValue', "" )
    if (logType?.versions?.length > 0) {
      setValue('logVersion', logType.versions[0]);
    } else {
      setValue('logVersion', null);
    }

  },[ logType, setValue ]);

  useEffect(() => {
    setValue('logTextValue', "" )
  },[ logVersion, setValue ]);

  useEffect(() => {
    if(error) setError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ logTextValue ]);

  const validateJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const onSubmit = async (data) => {
    if (!validateJson(data.logTextValue)) {
      setError("Invalid JSON. Please format the data before submitting.");
      return;
    }
  
    try {
      const csvData = JSON.parse(data.logTextValue);
      if (Array.isArray(csvData) && csvData.length > 5000) {
        setError("JSON size should not be greater than 5000 objects.");
        return;
      }
  
      setError(null);
      const action = {};
      if (selectedCheckbox === 0) {
        action.skipExistingRecords = true;
      } else if (selectedCheckbox) {
        action.updateExistingRecords = true;
      }
  
      const response = await dispatch(addMachineLogRecord(machineId, machine?.customer?._id, csvData, action, logVersion ,logType?.type));
      if (response.success) {
        enqueueSnackbar("Logs uploaded successfully!");
        navigate(PATH_MACHINE.machines.logs.root(machineId));
        reset();
      } else throw new Error(response.message);
    } catch (err) {
      enqueueSnackbar(err.message || 'JSON validation failed!', { variant: 'error' });
    }
  };
  

  const formatTxtToJson = (data = logTextValue) => {
    if (typeof data === 'string' && data.trim() !== '') {
      txtToJson(data).then(result => {
        if(result.length > 0) {
        const stringifyJSON = JSON.stringify(result, null, 2)
          setValue('logTextValue', stringifyJSON )
        }
      })
    }
  }

  const txtToJson = async (data) => {
    const csvData = [];
    try {
      if (typeof data === 'string' && data.trim() !== '') {
        const rows = data.trim().split('\n');
        rows?.map((row) => {
          const columns = row.trim().split(',');
          if (Array.isArray(columns) && columns.length > 2) {
            const Obj = {};
            logType.formats[logVersion]?.map((header, index) => {
              Obj[[header]] = columns[index];
              return header;
            });
            csvData.push(Obj);
          } else {
            throw new Error('Invalid Data Format');
          }
          return null;
        });
      }
    } catch (e) {
      enqueueSnackbar(e || 'Found error While Converting text to json!', { variant: `error` });
    }
    return csvData;
  };  

  // TEXT FILE READER
const readFile = (selectedFile) => 
  new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target.result;
          resolve(content);
      };
      reader.onerror = (err) => {
          console.log(err);
        enqueueSnackbar( "Found error while Reading File!",{ variant: `error` } )
      };
      reader.readAsText(selectedFile);
    });
    // STRINGIFY JSON FORMATED FILE

  // FILE HANDLER FUNCTION
  const handleFileChange = async (event) => {
    setValue('logTextValue', '');
    const files = Array.from(event.target.files);
    
    if (files.length === 0) {
      return;
    }

    try {
      const fileContents = await Promise.all(files.map(file => readFile(file)));
  
      const allResults = await fileContents.reduce(async (accPromise, content) => {
        const acc = await accPromise;
        const result = await txtToJson(content);
        return [...acc, ...result];
      }, Promise.resolve([]));
  
      if (allResults.length > 0) {
        const stringifyJSON = JSON.stringify(allResults, null, 2);
        setValue('logTextValue', stringifyJSON);
      } else {
        enqueueSnackbar("No Data Found to Import!", { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar("Found error while processing files!", { variant: "error" });
    }
  
    setFileInputKey(prevKey => prevKey + 1);
  };
  

const HandleChangeIniJson = async (e) => { setValue('logTextValue', e) }

const toggleCancel = () => navigate(PATH_MACHINE.machines.logs.root(machineId));

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="logs" />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Grid>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Iconify icon="mdi:information" sx={{ mr: 1, color: 'info.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      You need to select Log Type before you can import any log Files
                    </Typography>
                  </Box>
                  <Grid container spacing={2} sx={{ alignItems: 'flex-end', mb: 1 }}>
                    <Grid item md={4}>
                      <RHFAutocomplete
                        label="Select Log Type"
                        name="logType"
                        options={machineLogTypeFormats}
                        size="small"
                        getOptionLabel={(option) => option.type}
                        isOptionEqualToValue={(option, value) => option?.type === value?.type}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.type}>
                            {option.type || ''}
                          </li>
                        )}
                        getOptionDisabled={(option) => option?.disabled}
                      />
                    </Grid>
                    <Grid item md={2}>
                      {logType && (
                        <RHFAutocomplete
                          label="Select Version"
                          name="logVersion"
                          options={logType?.versions}
                          getOptionLabel={(option) => option}
                          value={logVersion}
                          size="small"
                          // defaultValue={watch('logType')?.versions?.[0] || null}
                          // isOptionEqualToValue={(option, value) => option?.type === value?.type}
                          // renderOption={(props, option) => (
                          //   <li {...props} key={option?.type}>
                          //     {option.type || ''}
                          //   </li>
                          // )}
                        />
                      )}
                    </Grid>
                    <Grid item md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="contained"
                        component="label"
                        disabled={!logType || !logVersion}
                        startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />}
                      >
                        {' '}
                        Import Files
                        <input
                          key={fileInputKey}
                          type="file"
                          accept=".txt"
                          multiple
                          hidden
                          onChange={handleFileChange}
                        />
                      </Button>
                    </Grid>
                  </Grid>
                  <CodeMirror
                    value={logTextValue}
                    HandleChangeIniJson={HandleChangeIniJson}
                    editable={!!logType && !!logVersion}
                    formatButton
                    formatButtonOnClick={formatTxtToJson}
                  />
                  <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                      Action to perform on existing records?{' '}
                    </Typography>
                    {checkboxes.map((checkbox, index) => (
                      <Typography variant="subtitle2" sx={{ ml: 2 }}>
                        {checkbox.label}
                        <Checkbox
                          key={index}
                          checked={index === selectedCheckbox}
                          onChange={() => handleCheckboxChange(index)}
                          label={checkbox.label}
                        />
                      </Typography>
                    ))}
                  </Grid>
                </Grid>
                {error && (
                  <FormHelperText error>
                    {error}
                  </FormHelperText>
                )}
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
