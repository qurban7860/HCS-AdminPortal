import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container ,Card, Grid, Stack, Button, FormHelperText, Checkbox, Typography, Box, useTheme, Chip, Divider, Alert } from '@mui/material';
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
import MachineTabContainer from '../util/MachineTabContainer';
import { machineLogTypeFormats } from '../../../constants/machineLogTypeFormats';
import IconTooltip from '../../../components/Icons/IconTooltip';


// ----------------------------------------------------------------------
const numericalProperties = ["coilLength", "coilWidth", "coilThickness", "coilLength", "flangeHeight", "webWidth", "componentLength", "waste", ]

export default function MachineLogsAddForm() {

  const { machine } = useSelector((state) => state.machine);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [ error, setError ] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [selectedCheckbox, setSelectedCheckbox] = useState(null);
  const [inchesMeasurementExists, setInchesMeasurementExists] = useState(false);

  const theme = useTheme();

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
      logType: machineLogTypeFormats.find(option => option.type === 'ERP') || null,
      logVersion: null,
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
    setInchesMeasurementExists(false);
    if (logType?.versions?.length > 0) {
      setValue('logVersion', logType.versions[0]);
    } else {
      setValue('logVersion', null);
    }

  },[ logType, setValue ]);

  useEffect(() => {
    setValue('logTextValue', "" )
    setInchesMeasurementExists(false);
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
      // Convert inches data to mm
      let logData = csvData;
      if (csvData.some((item) => item?.measurementUnit === "in")) {
        logData = convertAllInchesBitsToMM(csvData);
      }

      if (logData.some((item) => item?.timestamp && !item?.date)) {
        logData = logData.map((item) => {
          if (item?.timestamp && !item?.date) {
            return { ...item, date: item.timestamp };
          }
          return item;
        });
      }
  
      setError(null);
      const action = {};
      if (selectedCheckbox === 0) {
        action.skipExistingRecords = true;
      } else if (selectedCheckbox) {
        action.updateExistingRecords = true;
      }
  
      const response = await dispatch(addMachineLogRecord(machineId, machine?.customer?._id, logData, action, logVersion ,logType?.type));
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
    if (typeof data !== 'string' || data.trim() === '') return null;
  
    try {
      const parsedData = JSON.parse(data);
      if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'object')) {
        enqueueSnackbar("Data already in JSON Format");
        return null;
      }
    } catch {
      // Not valid JSON, continue to CSV check
    }
  
    const lines = data.trim().split('\n');
    const isCSV = lines.length > 1 && lines.every(line => {
      const columns = line.split(',');
      return columns.length > 1 && columns.length === lines[0].split(',').length;
    });
  
    if (!isCSV) {
      enqueueSnackbar("Data is not in CSV format", { variant: 'error' });
      return null;
    }
  
    txtToJson(data).then(result => {
      if (result.length > 0) {
        setValue('logTextValue', JSON.stringify(result, null, 2));
        if (result.some((item) => item?.measurementUnit === "in")) setInchesMeasurementExists(true)
      }
    });
  
    return null;
  };
  
  const convertAllInchesBitsToMM = (csvData) => {
    const convertedData = csvData.map((row) => {
      const dataInInches = {}
      if (row?.measurementUnit === "in") {
        Object.entries(row).forEach(([key, value]) => {
          if (numericalProperties.includes(key)) {
            dataInInches[`${key}InInches`] = value;
            row[key] = (value * 25.4).toFixed(3).toString();
          }
        });
        row = { ...row, ...dataInInches, measurementUnit: "mm" };
      }
      return row;
    });
    return convertedData;
  };

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
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignSelf: 'flex-start', alignItems: 'center', mb: 1 }}
                >
                  <IconTooltip
                    title="Back"
                    onClick={() => navigate(PATH_MACHINE.machines.logs.root(machineId))}
                    color={theme.palette.primary.main}
                    icon="mdi:arrow-left"
                  />
                  <Divider orientation="vertical" flexItem />
                  <Box sx={{ borderBottom: 2, borderColor: 'primary.main', pb: 1 }}>
                    <Typography variant="h5" color="text.primary">
                      Add New Logs
                    </Typography>
                  </Box>
                </Stack>
                <Stack spacing={0.5} direction="row" sx={{ alignItems: 'center' }}>
                  <Iconify icon="mdi:information-outline" color={theme.palette.text.secondary} />
                  <Typography variant="caption" color='text.secondary'>
                    You need to select Log Type before you can import any Log Files
                  </Typography>
                </Stack>
                <Grid>
                  <Grid container spacing={2} sx={{ alignItems: 'flex-end', mb: 1 }}>
                    <Grid item md={4}>
                      <RHFAutocomplete
                        label="Log Type"
                        placeholder="Select Log Type"
                        name="logType"
                        options={machineLogTypeFormats}
                        size="small"
                        getOptionLabel={(option) => option.type}
                        isOptionEqualToValue={(option, value) => option?.type === value?.type}
                        nonEditable
                        // helperText="You need to select Log Type before you can import any log Files"
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
                          label="Version"
                          placeholder="Select Version"
                          name="logVersion"
                          options={logType?.versions}
                          getOptionLabel={(option) => option}
                          value={logVersion}
                          size="small"
                          nonEditable
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
                  {logType && logVersion && (
                    <Grid item xs={10}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip
                          label={<Typography variant="overline">Log Format</Typography>}
                          icon={<Iconify icon="tabler:logs" color={theme.palette.primary.main} />}
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {logType?.formats?.[logVersion]?.map((format) => format).join(', ')}
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                  <CodeMirror
                    value={logTextValue}
                    HandleChangeIniJson={HandleChangeIniJson}
                    editable={!!logType && !!logVersion}
                    formatButton
                    formatButtonOnClick={formatTxtToJson}
                  />
                  {inchesMeasurementExists && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Alert severity="info" variant="filled">
                        Logs contain measurements in inches. These will be converted to millimeters.
                      </Alert>
                    </Grid>
                  )}
                  <Grid sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle2">
                      Action to perform on existing records?{' '}
                    </Typography>
                    {checkboxes.map((checkbox, index) => (
                      <Typography variant="subtitle2" sx={{ ml: 2 }} key={checkbox.value}>
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
                {error && <FormHelperText error>{error}</FormHelperText>}
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
