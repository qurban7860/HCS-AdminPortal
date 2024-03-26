import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Card, Grid, Stack, Button } from '@mui/material';
// slice
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { setAllFlagFalse, getHistoricalConfigurationRecords, addHistoricalConfigurationRecord } from '../../../redux/slices/products/historicalConfiguration';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFDatePicker, RHFSwitch } from '../../../components/hook-form';
// constants
import CodeMirror from '../../../components/CodeMirror/JsonEditor';
import Iconify from '../../../components/iconify/Iconify';
import { ICONS } from '../../../constants/icons/default-icons';

// import { Snacks, FORMLABELS as formLABELS } from '../../../constants/document-constants';

// ----------------------------------------------------------------------

export default function HistoricalConfigurationsAddForm() {

  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const defaultValues = useMemo(
    () => ({
      backupDate: null,
      iniJson: '',
      isManufacture: false,
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

  const { iniJson } = watch();

  const toggleCancel = () => {
    dispatch(setAllFlagFalse())
  };

  const onSubmit = async (data) => {
    try{
      data.configuration= JSON.parse(data.iniJson)
        try {
          data.inputGUID = machine?._id;
          data.inputSerialNo = machine?.serialNo;
          await dispatch(addHistoricalConfigurationRecord(data));
          reset();
          enqueueSnackbar('INI created successfully!');
          dispatch(setAllFlagFalse())
          dispatch(getHistoricalConfigurationRecords(machine?._id))
        } catch (error) {
          // enqueueSnackbar('Saving failed!');
          enqueueSnackbar(error, { variant: `error` });
          console.error(error);
        }
    }catch(err){
      enqueueSnackbar('JSON validation Failed!',{ variant: `error` });
    }
  };

  const isIniFormat = (data) => {
    const lines = data.split('\n');
    return lines.every(line => {
      const trimmedLine = line.trim();
      if (trimmedLine === '' || trimmedLine.startsWith(';') || trimmedLine.startsWith('#')) {
        return true; 
      }
      if (!trimmedLine.includes('=')) {
        if (!(/^\[.*\]$/.test(trimmedLine))) {
          return false;
        }
      }
      return true;
    });
  };
  
  function iniToJSON(iniData) {
    const lines = iniData.split('\n');
    let currentSection = null;
    const result = {};

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith(';') || line === '') {
            return;
        }
        const sectionMatch = line.match(/^\[([^\]]+)\]$/);
        if (sectionMatch) {
            currentSection = sectionMatch[1];
            result[currentSection] = {};
            return;
        }
        const keyValueMatch = line.match(/^([^=]+)=(.+)$/);
        if (keyValueMatch && currentSection !== null) {
            const key = keyValueMatch[1].trim();
            let value = keyValueMatch[2].trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/\\"/g, '"');
            }
            result[currentSection][key] = value;
        }
    });
    const formattedJSON = JSON.stringify(result, null, 2);
    return formattedJSON;
}

const readFile = (selectedFile) => 
  new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e)=> {
          const content = e.target.result;
          resolve(content);
      };
      reader.onerror = (error)=> {
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

const HandleChangeIniJson = async (e) => {
  if(isIniFormat(e)){
    const parsedData = iniToJSON(e)
    setValue('iniJson', parsedData)
  }else{
    setValue('iniJson', e)
  }
}

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Grid display={{ sm:'block', md: 'flex'}} justifyContent="space-between" >
                  <Grid item sm={12} md={6} >
                    <RHFDatePicker inputFormat='dd/MM/yyyy' name="backupDate" label="Backup Date" size="small" />
                  </Grid>
                  <Grid container display="flex" justifyContent="flex-end"  >
                    <Button variant="contained" component="label" startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />} > Upload File  
                      <input type="file" accept='.json, .ini' hidden onChange={handleFileChange} /> 
                    </Button>
                  </Grid>
                </Grid>
                <Grid >
                  <CodeMirror value={iniJson} HandleChangeIniJson={HandleChangeIniJson}/>
                  <RHFSwitch name="isManufacture" label="Manufacture" />                
                </Grid>

                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
