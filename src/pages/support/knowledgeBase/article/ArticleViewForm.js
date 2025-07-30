import { useLayoutEffect, useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

// @mui
import { Card, Container, Grid, Dialog, DialogTitle, Button, Divider, Box } from '@mui/material';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
// redux
import {
  archiveArticle,
  deleteArticle,
  getArticle,
  restoreArticle,
  resetArticle,
  updateArticleStatus,
  getFile, deleteFile,
} from '../../../../redux/slices/support/knowledgeBase/article';
// paths
import { PATH_SUPPORT } from '../../../../routes/paths';
// components
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../../components/ViewForms/ViewFormEditDeleteButtons';
import DialogArticleAddFile from '../../../../components/Dialog/ArticleAddFileDialog';
import ViewFormSelect from '../../../../components/ViewForms/ViewFormSelect';
import { handleError } from '../../../../utils/errorHandler';
import { StyledCardContainer } from '../../../../theme/styles/default-styles';
import { Cover } from '../../../../components/Defaults/Cover';
import LoadingScreen from '../../../../components/loading-screen';
import { articleStatusOptions } from '../../../../utils/constants';
import Editor from '../../../../components/editor';
import { ThumbnailDocButton } from '../../../../components/Thumbnails';
import { DocumentGalleryItem } from '../../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../../components/lightbox/Lightbox';
import SkeletonPDF from '../../../../components/skeleton/SkeletonPDF';
import FormLabel from '../../../../components/DocumentForms/FormLabel';

// ----------------------------------------------------------------------

export default function ArticleViewForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const regEx = /^[^2]*/;
  const { enqueueSnackbar } = useSnackbar();
  const [selectedImage, setSelectedImage] = useState(-1);
  const [fileDialog, setFileDialog] = useState(false);
  const [slides, setSlides] = useState([]);

  const { article, isLoading } = useSelector((state) => state.article);
  const prefix = JSON.parse(localStorage.getItem('configurations'))?.find((config) => config?.name?.toLowerCase() === 'article_prefix')?.value?.trim() || '';

  useLayoutEffect(() => {
    dispatch(getArticle(id));
    return () => {
      dispatch(resetArticle());
    }
  }, [id, dispatch]);

  useEffect(() => {
    const newSlides = article?.files?.map(file => {
      const base64Thumbnail = `data:image/png;base64,${file.thumbnail}`;

      if (file?.fileType?.startsWith('image')) {
        return {
          type: 'image',
          thumbnail: base64Thumbnail,
          src: base64Thumbnail,
          downloadFilename: `${file?.name}.${file?.extension}`,
          name: file?.name,
          extension: file?.extension,
          fileType: file?.fileType,
          isLoaded: false,
          _id: file?._id,
          width: '100%',
          height: '100%',
        };
      }

      if (file?.fileType?.startsWith('video')) {
        return {
          type: 'video',
          sources: [{
            src: file?.src,
            type: file?.fileType,
            playsInline: true,
            autoPlay: true,
            loop: true,
            muted: true,
            preload: 'auto',
          }],
          downloadFilename: `${file?.name}.${file?.extension}`,
          name: file?.name,
          extension: file?.extension,
          fileType: file?.fileType,
          isLoaded: false,
          _id: file?._id,
          width: '100%',
          height: '100%',
        };
      }

      return null;
    }).filter(Boolean);

    setSlides(newSlides || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [article?.files]);

  const onDelete = async () => {
    try {
      await dispatch(deleteArticle(article?._id));
      if (article?.isArchived) {
        navigate(PATH_SUPPORT.archivedArticles.root);
      } else {
        navigate(PATH_SUPPORT.knowledgeBase.article.root);
      }
      enqueueSnackbar('Article deleted successfully!', { variant: `success` });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onArchive = async () => {
    try {
      await dispatch(archiveArticle(article?._id));
      navigate(PATH_SUPPORT.archivedArticles.root);
      enqueueSnackbar('Article archived successfully!', { variant: `success` });
    } catch (error) {
      console.error(error);
      enqueueSnackbar(handleError(error), { variant: `error` });
    }
  };

  const onRestore = async () => {
    try {
      await dispatch(restoreArticle(article?._id));
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
      enqueueSnackbar('Article restored successfully!', { variant: `success` });
    } catch (error) {
      enqueueSnackbar('Article restored failed!', { variant: `error` });
      console.error(error);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_SUPPORT.knowledgeBase.article.edit(article._id));
  };

  const defaultValues = useMemo(
    () => ({
      articleNo: `${prefix || ''}${article?.articleNo || ''}`,
      title: article?.title,
      description: article?.description || '',
      files: article?.files || [],
      category: article?.category,
      status: article?.status,
      customerAccess: article?.customerAccess,
      isActive: article?.isActive,
      isArchived: article?.isArchived,
      createdAt: article?.createdAt || '',
      createdByFullName: article?.createdBy?.name || '',
      createdIP: article?.createdIP || '',
      updatedAt: article?.updatedAt || '',
      updatedByFullName: article?.updatedBy?.name || '',
      updatedIP: article?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [article]
  );

  const handlebackLink = () => {
    if (defaultValues.isArchived) {
      navigate(PATH_SUPPORT.archivedArticles.root);
    } else {
      navigate(PATH_SUPPORT.knowledgeBase.article.root);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await dispatch(updateArticleStatus(article._id, { status: e.target.value }));
      enqueueSnackbar('Article status updated successfully!', { variant: `success` });
    } catch (error) {
      enqueueSnackbar(handleError(error), { variant: `error` });
      console.error(error);
    }

  };

  //  ---------------------------------- Files Helper ------------------------------------------

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];
    if (!image?.isLoaded && (image?.fileType?.startsWith('image'))) {
      try {
        const response = await dispatch(getFile(id, image?._id));
        if (regEx.test(response.status)) {
          const base64 = response.data;
          const updatedSlides = [...slides];
          updatedSlides[index] = {
            ...image,
            src: `data:${image?.fileType};base64,${base64}`,
            isLoaded: true
          };
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
        enqueueSnackbar('File loading failed!', { variant: 'error' });
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await dispatch(deleteFile(article?._id, fileId));
      enqueueSnackbar('File archived successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File archive failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = (fileId, fileName, fileExtension) => {
    const file = slides.find((item) => item._id === fileId);

    if (!file) {
      enqueueSnackbar("File not found.", { variant: "error" });
      return;
    }

    const isVideo = file?.fileType?.startsWith("video");
    if (isVideo) {
      try {
        const signedUrl = file?.sources[0]?.src;
        window.open(signedUrl, "_blank");
        enqueueSnackbar("Video download started");
      } catch (error) {
        enqueueSnackbar("Video download failed!", { variant: "error" });
      }
    } else {
      dispatch(getFile(article?._id, fileId))
        .then((res) => {
          if (regEx.test(res.status)) {
            download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
            enqueueSnackbar("Download failed");
          }
        })
        .catch((err) => {
          enqueueSnackbar(handleError(err), { variant: `error` });
        });
    }
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileId, fileName, fileExtension) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getFile(article?._id, fileId));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    }
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={article?.title} isArchived={defaultValues.isArchived} />
      </StyledCardContainer>
      <Card sx={{ p: 2 }}>
        <Grid>
          <ViewFormEditDeleteButtons
            customerAccess={defaultValues?.customerAccess}
            isActive={defaultValues.isActive}
            {...(!defaultValues?.isArchived && { handleEdit })}
            {...(defaultValues?.isArchived ? { onDelete } : { onArchive })}
            {...(defaultValues?.isArchived && { onRestore })}
            backLink={handlebackLink}
            settingPage
          />
          <Grid container sx={{ mt: 2 }}>
            <ViewFormField isLoading={isLoading} sm={4} heading="Category" param={defaultValues.category?.name || ''} />
            <ViewFormField isLoading={isLoading} sm={4} heading="Article No" param={defaultValues.articleNo || ''} />
            <ViewFormField isLoading={isLoading} sm={4} heading="Status"
              node={<ViewFormSelect sx={{ width: '150px' }} options={articleStatusOptions} value={defaultValues.status} onChange={handleStatusChange} disabled={defaultValues.isArchived}/>}
            />
            <ViewFormField isLoading={isLoading} sm={12} heading="Title" param={defaultValues.title || ''} />
            <ViewFormField isLoading={isLoading} sm={12}
              heading="Description"
              node={<Editor readOnly hideToolbar sx={{ border: 'none', '& .ql-editor': { padding: '0px' } }} value={defaultValues.description} />}
            />
            <Grid container sx={{ mt: 2 }}>
              <FormLabel content='Documents' />
            </Grid>
            <Box
              sx={{ mt: 2, width: '100%' }}
              gap={1}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
                lg: 'repeat(6, 1fr)',
                xl: 'repeat(8, 1fr)',
              }}
            >

              {slides?.map((file, _index) => (
                <DocumentGalleryItem
                  isLoading={isLoading}
                  key={file?._id}
                  image={file}
                  onOpenLightbox={() => handleOpenLightbox(_index)}
                  onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                  onDeleteFile={() => handleDeleteFile(file?._id)}
                  toolbar
                  size={150}
                />
              ))}

              {Array.isArray(article?.files) && article?.files?.filter(f => !f?.fileType.startsWith('image'))?.filter(f => !f?.fileType.startsWith('video'))?.map((file, _index) =>
                <DocumentGalleryItem
                  key={file?._id}
                  image={{
                    thumbnail: `data:image/png;base64, ${file.thumbnail}`,
                    src: `data:image/png;base64, ${file.thumbnail}`,
                    downloadFilename: `${file?.name}.${file?.extension}`,
                    name: file?.name,
                    fileType: file?.fileType,
                    extension: file?.extension,
                    isLoaded: false,
                    id: file?._id,
                    width: '100%',
                    height: '100%',
                  }}
                  isLoading={isLoading}
                  onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                  onDeleteFile={() => handleDeleteFile(file?._id)}
                  onOpenFile={() => handleOpenFile(file?._id, file?.name, file?.extension)}
                  toolbar
                  isArchived={defaultValues.isArchived}
                />
              )}
              <ThumbnailDocButton onClick={() => setFileDialog(true)} disabled={defaultValues.isArchived}/>
            </Box>

            <Lightbox
              index={selectedImage}
              slides={slides}
              open={selectedImage >= 0}
              close={handleCloseLightbox}
              onGetCurrentIndex={(index) => handleOpenLightbox(index)}
              disabledSlideshow
              disabledDownload
            />
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Grid>
      </Card>
      {fileDialog && <DialogArticleAddFile open={fileDialog} handleClose={() => setFileDialog(false)} />}
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
    </Container>
  );
}
