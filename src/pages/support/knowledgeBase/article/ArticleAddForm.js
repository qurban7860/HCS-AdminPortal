import * as Yup from 'yup';
import { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { enc, MD5, lib } from 'crypto-js';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Container, Box } from '@mui/material';
// routes
import { PATH_SUPPORT } from '../../../../routes/paths';
// slice
import { addArticle, deleteFile } from '../../../../redux/slices/support/knowledgeBase/article';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFSwitch, RHFEditor, RHFAutocomplete, RHFUpload } from '../../../../components/hook-form';
import AddFormButtons from '../../../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../../../components/Defaults/Cover';
// constants
import { FORMLABELS } from '../../../../constants/default-constants';
// styles
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { handleError } from '../../../../utils/errorHandler';
import { getActiveArticleCategories, resetActiveArticleCategories } from '../../../../redux/slices/support/supportSettings/articleCategory';
import FormLabel from '../../../../components/DocumentForms/FormLabel';
import validateFileType from '../../../documents/util/validateFileType';
import { allowedExtensions } from '../../../../constants/document-constants';

// ----------------------------------------------------------------------

export const AddArticleSchema = Yup.object().shape({
  title: Yup.string().min(2, 'Title must be at least 2 characters long').max(200, 'Title must be at most 200 characters long').required('Title is required!'),
  description: Yup.string().max(50000),
  files: Yup.mixed().label('Files')
    .test(
      'fileType', allowedExtensions,
      function (value) {
       return validateFileType({ _this: this, files: value, doc: true, image: true, video: true, others: true });
    }
  ).nullable(),
  category: Yup.object().required().label('Category').nullable(),
  customerAccess: Yup.boolean(),
  isActive: Yup.boolean(),
});

export default function ArticleAddForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { activeArticleCategories } = useSelector((state) => state.articleCategory);

  useEffect(() => {
    dispatch(getActiveArticleCategories());
    return () => {
      dispatch(resetActiveArticleCategories());
    };
  }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      title: '',
      description: '',
      files: [],
      category: null,
      status: 'DRAFT',
      customerAccess: false,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddArticleSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const { files } = watch();

  const hashFilesMD5 = async (_files) => {
    const hashPromises = _files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const wordArray = MD5(lib.WordArray.create(arrayBuffer));
        const hashHex = wordArray.toString(enc.Hex);
        resolve(hashHex);
      };
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file?.name || ''}`));
      };
      reader.readAsArrayBuffer(file);
    }));
    try {
      const hashes = await Promise.all(hashPromises);
      return hashes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDropMultiFile = useCallback(async (acceptedFiles) => {
    console.log("acceptedFiles:::", acceptedFiles)
    const hashes = await hashFilesMD5(acceptedFiles);
    const newFiles = (Array.isArray(files) && files?.length > 0) ? [...files] : [];
    acceptedFiles.forEach((file, index) => {
      const eTag = hashes[index];
      if (!newFiles?.some((el) => el?.eTag === eTag)) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true,
          eTag,
        });
        newFiles.push(newFile);
      }
    });
    setValue('files', newFiles, { shouldValidate: true });
  }, [setValue, files]);

  const handleFileRemove = useCallback(async (inputFile) => {
    try {
      setValue('files', files?.filter((el) => (inputFile?._id ? el?._id !== inputFile?._id : el !== inputFile)), { shouldValidate: true })
      if (inputFile?._id) {
        dispatch(deleteFile(inputFile?.articleCategory, inputFile?._id))
      }
    } catch (e) {
      console.error(e)
    }
  }, [setValue, files, dispatch]);

  useEffect(() => {
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    try {

      const response = await dispatch(addArticle(data));
      reset();
      enqueueSnackbar('Article added successfully!', { variant: `success` });
      navigate(PATH_SUPPORT.knowledgeBase.article.view(response?._id));
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.root);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name='New Article' />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFAutocomplete
                  name="category"
                  label="Category"
                  options={activeArticleCategories || []}
                  getOptionLabel={(option) => `${option.name || ''}`}
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name || ''} </li>)}
                />
                <RHFTextField name="title" label="Title" inputProps={{ maxLength: 200 }} />
                <RHFEditor name="description" label="Description" />
                <FormLabel content={FORMLABELS.COVER.ARTICLE_ATTACHMENTS} />
                <Box sx={{ mt: 0 }}>
                  <RHFUpload
                    dropZone={false}
                    multiple
                    thumbnail
                    name="files"
                    onDrop={handleDropMultiFile}
                    onRemove={handleFileRemove}
                    onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                  />
                </Box>
                <Grid display="flex" alignItems="center" mt={1}>
                  <RHFSwitch name='isActive' label='Active' />
                  <RHFSwitch name='customerAccess' label='Customer Access' />
                </Grid>
              </Stack>
              <AddFormButtons settingPage isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container >
  );
}
