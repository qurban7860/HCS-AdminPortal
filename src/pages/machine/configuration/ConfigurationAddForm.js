import { useMemo } from 'react';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Card, Grid, Stack, Button, Container } from '@mui/material';
// slice
import { yupResolver } from '@hookform/resolvers/yup';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { addConfiguration } from '../../../redux/slices/products/configuration';
// routes
import { PATH_MACHINE } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, {  RHFSwitch } from '../../../components/hook-form';
// util
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import CodeMirror from '../../../components/CodeMirror/JsonEditor';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function HistoricalConfigurationsAddForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const configurationAddSchema = Yup.object().shape({
    // collectionType: Yup.string().min(2).max(50).label('Configuration Type'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      // collectionType: '',
      configJSON: '',
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(configurationAddSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { configJSON } = watch();

  const toggleCancel = () => {
    navigate(PATH_MACHINE.machines.settings.configuration.list)
  };

  const onSubmit = async (data) => {
    const cleanedData = {}
    try{
      cleanedData.configJSON = JSON.parse(data.configJSON)
      cleanedData.collectionType = data.collectionType
      cleanedData.isActive = data.isActive
      try {
          await dispatch(addConfiguration(cleanedData));
          reset();
          enqueueSnackbar('Configuration Saved successfully!');
          navigate(PATH_MACHINE.machines.settings.configuration.list)
        } catch (error) {
          // enqueueSnackbar('Saving failed!');
          enqueueSnackbar(error, { variant: `error` });
          console.error(error);
        }
    }catch(err){
      enqueueSnackbar('JSON validation Failed!',{ variant: `error` });
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
      reader.onload = (e) =>{
          const content = e.target.result;
          resolve(content);
      };
      reader.onerror = (error) => {console.log(error)};
      reader.readAsText(selectedFile);
    });


  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    const parts = selectedFile.name.split(".");
    const fileExtension = parts[parts.length - 1];

    const fileData = await readFile(selectedFile)
    
    if(fileExtension === 'ini' ){
      const parsedData = iniToJSON(fileData)
        setValue('configJSON', parsedData)
    }else{
        setValue('configJSON',fileData)
    }
  };

const HandleChangeIniJson = async (e) => {
  setValue('configJSON', e)
}
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name="New Service Setting"
          url={PATH_MACHINE.machines.settings}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{display:'flex', justifyContent:'space-between' }}>
                  <Grid item xs={12} lg={12} sx={{display:'flex', justifyContent:'flex-end'}}>
                    <Button variant="contained" component="label"  startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />} sx={{m:0.5}} >Select File
                        <input type="file" accept='.json, .ini' hidden onChange={handleFileChange} /> 
                    </Button>
                  </Grid>
                  <CodeMirror value={configJSON} HandleChangeIniJson={HandleChangeIniJson}/>                
                </Grid>
                <RHFSwitch name="isActive" label="Active" />
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
