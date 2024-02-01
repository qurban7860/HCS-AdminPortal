import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, Grid, Stack, Button } from '@mui/material';
// slice
import {
  updateConfiguration,
  getConfiguration,
} from '../../../../redux/slices/products/configuration';
// routes
import { PATH_MACHINE } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../../components/hook-form';
import { Cover } from '../../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import CodeMirror from '../../../../components/CodeMirror/JsonEditor';
import Iconify from '../../../../components/iconify';
import { ICONS } from '../../../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function ConfigurationEditForm() {

  const { configuration } = useSelector((state) => state.configuration);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();

  const EditCategorySchema = Yup.object().shape({
    collectionType: Yup.string().min(2).max(50).label('Configuration Type'),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      collectionType: configuration?.collectionType || '',
      configJSON: JSON.stringify(configuration?.configJSON,null,2) || '',
      isActive: configuration?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [configuration]
  );

  const methods = useForm({
    resolver: yupResolver(EditCategorySchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useLayoutEffect(() => {
    dispatch(getConfiguration(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (configuration) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration]);

  const toggleCancel = () => { navigate(PATH_MACHINE.machines.settings.configuration.view(id)) };

  const onSubmit = async (data) => {
    const cleanedData = {}
    try{
      cleanedData.configJSON = JSON.parse(data.configJSON)
      cleanedData.collectionType = data.collectionType
      cleanedData.isActive = data.isActive
      try {
          await dispatch(updateConfiguration(cleanedData, id));
          reset();
          enqueueSnackbar('Configuration Update successfully!');
          navigate(PATH_MACHINE.machines.settings.configuration.view(id));
        } catch (error) {
          // enqueueSnackbar('Saving failed!');
          enqueueSnackbar(error, { variant: `error` });
          console.error(error);
        }
    }catch(err){
      enqueueSnackbar('JSON validation Failed!',{ variant: `error` });
    }
  };

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

  return (
    <>
      <StyledCardContainer> 
        <Cover
          name="Edit Service Setting"
          icon="material-symbols:category-outline"
          url={PATH_MACHINE.machines.settings.categories.list}
        />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Grid container rowSpacing={1} columnSpacing={1} sx={{display:'flex', justifyContent:'space-between' }}>
                    <Grid item xs={12} lg={6}>
                      <RHFTextField name="collectionType" label="Collection Type" size="small" />
                    </Grid>
                    <Grid item xs={12} lg={2} sx={{display:'flex', justifyContent:'flex-end'}}>
                      <Button variant="contained" component="label"  startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />} sx={{m:0.5}} >  Upload
                          <input type="file" accept='.json, .ini' hidden onChange={handleFileChange} /> 
                      </Button>
                  </Grid>
                  <CodeMirror value={defaultValues?.configJSON} HandleChangeIniJson={HandleChangeIniJson}/>                
                </Grid>
                <RHFSwitch name="isActive" label="Active"/>
                <AddFormButtons machineSettingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </>
  );
}
