import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Container, Button, InputAdornment } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { setAllFlagFalse, getHistoricalConfigurationRecords, addHistoricalConfigurationRecord } from '../../../redux/slices/products/historicalConfiguration';
// schema
import { AddInniSchema } from '../../schemas/document';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// import { useSettingsContext } from '../../../components/settings';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// // asset
// import { countries } from '../../../assets/data';
// util
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/default-constants';
import FormHeading from '../../components/DocumentForms/FormHeading';
import CopyIcon from '../../components/Icons/CopyIcon';

// import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function HistoricalConfigurationsAddForm() {

  const { machine } = useSelector((state) => state.machine);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      iniJson: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddInniSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { iniJson } = watch();

  const toggleCancel = () => {
    dispatch(setAllFlagFalse())
  };

  const onSubmit = async (data) => {
    try {
      const cleanedData = {
        configuration: JSON.parse(data.iniJson),
      };
      cleanedData.inputGUID = machine?._id;
      cleanedData.inputSerialNo = machine?.serialNo;
      await dispatch(addHistoricalConfigurationRecord(cleanedData));
      reset();
      enqueueSnackbar('INI create successfully!');
      dispatch(setAllFlagFalse())
      dispatch(getHistoricalConfigurationRecords(machine?._id))
    } catch (error) {
      // enqueueSnackbar('Saving failed!');
      enqueueSnackbar(error, { variant: `error` });
      console.error(error);
    }
  };

  function iniToJSON(iniData) {
    const lines = iniData.split('\n');
    let currentSection = null;
    const result = {};

    lines.forEach(line => {
        line = line.trim();
        // Skip comments and empty lines
        if (line.startsWith(';') || line === '') {
            return;
        }
        // Check for section header
        const sectionMatch = line.match(/^\[([^\]]+)\]$/);
        if (sectionMatch) {
            currentSection = sectionMatch[1];
            result[currentSection] = {};
            return;
        }
        // Check for key-value pairs
        const keyValueMatch = line.match(/^([^=]+)=(.+)$/);
        if (keyValueMatch && currentSection !== null) {
            const key = keyValueMatch[1].trim();
            const value = keyValueMatch[2].trim();
            result[currentSection][key] = value;
        }
    });

    const formattedJSON = JSON.stringify(result, null, 2);
    return formattedJSON;
}

const readFile = (selectedFile) => 
  new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(e) {
          const content = e.target.result;
          resolve(content);
      };
      reader.onerror = function(error) {
          console.log(error);
      };
      reader.readAsText(selectedFile);
    });


  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const parts = selectedFile.name.split(".");
    const fileExtension = parts[parts.length - 1];

    const fileData = await readFile(selectedFile)
    
    if(fileExtension === 'ini' ){
      const parsedData = iniToJSON(fileData)
        setValue('iniJson', parsedData)
    }else{
        setValue('iniJson',fileData)
    }
  };


  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>

                <Grid display="flex" justifyContent="space-between" >
                  <FormHeading heading="New INI"/>
                  <Button variant="contained" component="label" > Upload File  
                    <input type="file" accept='.json, .ini' hidden onChange={handleFileChange} /> 
                  </Button>
                </Grid>
                <Grid 
                // sx={{ position: "relative" }}
                >
                  <RHFTextField name="iniJson" label="Configuration" minRows={7} maxRows={22} multiline 
                  sx={{ 
              alignItems: 'center',
              whiteSpace: 'pre-line',
              wordBreak: 'break-word' }}
                    // InputProps={{
                    //   endAdornment: <InputAdornment position="end" sx={{
                    //     position: "absolute",
                    //     top: 12,
                    //     right: 6,
                    //     // margin: "8px",
                    //   }}><CopyIcon value={iniJson}/></InputAdornment>,
                    // }}
                  />
                </Grid>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
