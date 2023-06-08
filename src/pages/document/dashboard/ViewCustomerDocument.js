import { Helmet } from 'react-helmet-async';
import { useState,useMemo , useEffect, useLayoutEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import { styled, alpha , useTheme } from '@mui/material/styles';
import { CardContent, IconButton ,CardMedia, Container, Grid, Card ,Tooltip,Typography, Box, Dialog, Link, Stack} from '@mui/material';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category';
import ModelTrainingIcon from '@mui/icons-material/ModelTraining';
import InventoryIcon from '@mui/icons-material/Inventory';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import FlareIcon from '@mui/icons-material/Flare';
import ClassIcon from '@mui/icons-material/Class';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { PATH_DASHBOARD, PATH_MACHINE, PATH_DOCUMENT } from '../../../routes/paths';
import { Cover } from '../../components/Cover';
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import { getDocumentDownload } from '../../../redux/slices/document/downloadDocument';
import { getCustomerDocument , resetCustomerDocument} from '../../../redux/slices/document/customerDocument';
import { getCustomer, resetCustomer } from '../../../redux/slices/customer/customer';
import { getMachine, resetMachine } from '../../../redux/slices/products/machine';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';



// ----------------------------------------------------------------------

export default function Document() {
  const dispatch = useDispatch();
  // const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams()
  const regEx = /^[^2]*/;
  const { enqueueSnackbar } = useSnackbar();

  const { customerDocument } = useSelector((state) => state.customerDocument);
  const { customer } = useSelector((state) => state.customer);
  console.log("customerDocument : ",customerDocument)
  const [ openCustomer, setOpenCustomer] = useState(false)
  const [ openMachine, setOpenMachine] = useState(false)

//   useEffect(() =>{
//     dispatch(resetMachineDocument())
//     console.log("getMachineDocument")
//     dispatch(getMachineDocument(id))
//     dispatch(resetCustomer())
//     dispatch(resetMachine())
//   },[id,dispatch])

//   useEffect(() =>{
//     console.log("getCustomer")
// if(customerDocument?.customer){
//   dispatch(getCustomer(customerDocument.customer._id))
// }
//   },[customerDocument,dispatch])

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleViewCustomer = (Id) => {
    navigate(PATH_DASHBOARD.customer.view(Id));
  };  
  const defaultValues = useMemo(
    () => (
      {
        displayName :             customerDocument?.displayName || "",
        documentName:             customerDocument?.documentName?.name || "",
        docCategory:              customerDocument?.docCategory?.name || "",
        docType:                  customerDocument?.docType?.name || "",
        customer:                 customerDocument?.customer?.name || "",
        customerAccess:           customerDocument?.customerAccess,
        isActiveVersion:          customerDocument?.isActiveVersion,
        documentVersion:          customerDocument?.documentVersions?.length > 0 ? customerDocument?.documentVersions[0]?.versionNo : "",
        description:              customerDocument?.description,
        isActive:                 customerDocument?.isActive,
        createdAt:                customerDocument?.createdAt || "",
        createdByFullName:        customerDocument?.createdBy?.name || "",
        createdIP:                customerDocument?.createdIP || "",
        updatedAt:                customerDocument?.updatedAt || "",
        updatedByFullName:        customerDocument?.updatedBy?.name || "",
        updatedIP:                customerDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerDocument]
  );

const handleDownload = (fileId,fileName ,fileExtension) => {
   dispatch(getDocumentDownload(fileId)).then(res => {
    // console.log("res : ",res)
    if(regEx.test(res.status)){
      download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension});
      // downloadBase64File(res.data, `${fileName}.${fileExtension}`);
      enqueueSnackbar(res.statusText);
    }else{
      enqueueSnackbar(res.statusText,{ variant: `error` })
    }
  }).catch(err => {
    if(err.Message){
      enqueueSnackbar(err.Message,{ variant: `error` })
    }else if(err.message){
      enqueueSnackbar(err.message,{ variant: `error` })
    }else{
      enqueueSnackbar("Something went wrong!",{ variant: `error` })
    }
  });
};

const [ onPreview, setOnPreview] = useState(false)
const [ imageData, setImageData] = useState(false)
const [ imageName, setImageName] = useState("")
const [ imageExtension, setImageExtension] = useState("")

const handleOpenPreview = () => {setOnPreview(true)};
const handleClosePreview = () => {setOnPreview(false)};

const handleDownloadImage = (fileName,fileExtension)=>{
     download(atob(imageData), `${fileName}.${fileExtension}`, { type: fileExtension});
}

const handleDownloadAndPreview = (fileId,fileName,fileExtension) => {
  setImageName(fileName);
  setImageExtension(fileExtension);
  dispatch(getDocumentDownload(fileId)).then(res => {
   if(regEx.test(res.status)){
    setImageData(res.data)
    handleOpenPreview()
   }else{
     enqueueSnackbar(res.statusText,{ variant: `error` })
   }
 }).catch(err => {
   if(err.Message){
     enqueueSnackbar(err.Message,{ variant: `error` })
   }else if(err.message){
     enqueueSnackbar(err.message,{ variant: `error` })
   }else{
     enqueueSnackbar("Something went wrong!",{ variant: `error` })
   }
 });
};

  const document = {
    icon: {
      pdf: "bxs:file-pdf",
      doc: "mdi:file-word",
      docx: "mdi:file-word",
      xls: "mdi:file-excel",
      xlsx: "mdi:file-excel",
      ppt: "mdi:file-powerpoint",
      pptx: "mdi:file-powerpoint"
    },
    color: {
      pdf: "#f44336",
      doc: "#448aff",
      docx: "#448aff",
      xls: "#388e3c",
      xlsx: "#388e3c",
      ppt: "#e65100",
      pptx: "#e65100"
    }
  }

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}>
        <Cover name={defaultValues.displayName} icon="material-symbols:list-alt-outline" />
      </Card>
      <Grid container >
        <Card sx={{ p: 3 }}>
          {/* <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/> */}
          <Grid display="inline-flex">
              <Tooltip >
                <ViewFormField  isActive={defaultValues.isActive}  />
              </Tooltip>
              <Tooltip>
                <ViewFormField  customerAccess={defaultValues?.customerAccess} />
              </Tooltip>
          </Grid>
          <Grid container >
            <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
            <ViewFormField sm={6} heading="Active Version" numberParam={defaultValues?.documentVersion} />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            <ViewFormField sm={6} heading="Customer" objectParam={
                                    defaultValues.customer ? (
                                      <Link onClick={handleOpenCustomer} href="#" underline="none">
                                        {defaultValues.customer}
                                      </Link>
                                    ) : (
                                      ''
                                    )
                                  } 
            />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            <Grid container sx={{ mt: '1rem' ,mb: '-1rem'}}>
                <ViewFormAudit defaultValues={defaultValues}/>
            </Grid>
            {customerDocument && customerDocument?.documentVersions?.map((files)=>(
          <Grid container>
            <Grid container sx={{ pt: '2rem' }}>
              <Grid
                item
                xs={12}
                sm={12}
                sx={{
                  backgroundImage: (theme) =>
                    `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
                }}
              >
                <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'white' }}>
                  Version No. {files?.versionNo}
                </Typography>
              </Grid>
            </Grid>
              {files?.files?.map((file)=>(
              <Grid item  sx={{ display: 'flex-inline' }}>
              <Grid container justifyContent="flex-start" gap={1}>
                
                {file?.fileType.startsWith("image") ?
                <Card sx={{  height: '160px', width: '140px',m:1 }}>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ bgcolor:"lightgray",alignContent: 'center', width:"140px" }}
                    >
                    <CardContent
                      component={Stack}
                      display="block"
                      height="110px"
                      sx={{ position: 'relative', zIndex: '1' }}
                      >
                      <Link>
                        <IconButton
                          size="small"
                          onClick={
                            () => {
                              handleDownloadAndPreview(file._id,file.name,file.extension);
                            }
                          }
                          sx={{
                            top: 7,
                            left: 70,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="icon-park-outline:preview-open" width={18} />
                        </IconButton>
                      </Link>
                      <Dialog
                        maxWidth="md"
                        open={onPreview}
                        onClose={handleClosePreview}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                        >
                        <Grid
                          container
                          item
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            padding: '10px',
                          }}
                        >
                          <Typography variant="h4" sx={{ px: 2 }}>
                            {`${imageName}.${imageExtension}`}
                          </Typography>{' '}
                          <Link onClick={handleClosePreview} href="#" underline="none" sx={{ ml: 'auto' }}>
                            {' '}
                            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
                          </Link>
                        </Grid>
                        <Link>
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadImage(imageName ,imageExtension)}
                              sx={{
                                top: 70,
                                right: 15,
                                zIndex: 9,
                                height: "60",
                                position: 'absolute',
                                color: (theme) => alpha(theme.palette.common.white, 0.8),
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                },
                              }}
                            >
                              <Iconify icon="line-md:download-loop" width={18} />
                            </IconButton>
                          </Link>
                        <Box component="img" sx={{minWidth:"350px", minHeight:"350px"}} alt={file?.name}  src={`data:image/png;base64, ${imageData}`}/>
                      </Dialog>
                      <Link>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file._id,file.name ,file.extension)}
                          sx={{
                            top: 7,
                            left: 105,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="line-md:download-loop" width={18} />
                        </IconButton>
                      </Link>
                      <CustomAvatar
                        sx={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          marginTop: '55px',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginBottom: '0px',
                          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                          fontSize: '25px',
                          zIndex: '2',
                        }}
                        extension={file.extension}
                        alt={file.extension}
                      />
                      <CardMedia
                        component="img"
                        sx={{
                          height: '110px',
                          opacity: '0.6',
                          display: 'block',
                          zIndex: '-1',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        image={`data:image/png;base64, ${file?.thumbnail}`}
                        alt="customer's contact cover photo was here"
                      />
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ textAlign: 'center', width: '140px', mt:2 }}
                    ><Tooltip title={file.name} arrow >
                      <Typography variant="body1" >
                      {file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}
                      </Typography>
                    </Tooltip>
                  </Grid>
                </Card>
            :
            <Card sx={{  height: '160px', width: '140px',m:1 }}>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ bgcolor:"lightgray",alignContent: 'center', width:"140px" }}
                    >
                    <CardContent
                      component={Stack}
                      display="block"
                      height="110px"
                      sx={{ position: 'relative', zIndex: '1' }}
                      >
                      <Link>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file._id,file.name ,file.extension)}
                          sx={{
                            top: 7,
                            left: 105,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="line-md:download-loop" width={18} />
                        </IconButton>
                      </Link>
                      <CustomAvatar
                        sx={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          marginTop: '55px',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginBottom: '0px',
                          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                          fontSize: '25px',
                          zIndex: '2',
                        }}
                        // name={file.extension}
                        extension={file.extension}
                        alt={file.extension}
                      />
                      <Iconify sx={{ 
                          height: '90px',
                          opacity: '0.6',
                          display: 'block',
                          zIndex: '-1',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }} 
                        icon={document.icon[file.extension]} 
                        color={document.color[file.extension]} />
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ textAlign: 'center', width: '140px', mt:2 }}
                    ><Tooltip title={file.name} arrow >
                      <Typography variant="body1" >
                      {file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}
                      </Typography>
                    </Tooltip>
                  </Grid>
                </Card>
                }
                </Grid>
              </Grid>))}
              </Grid>
                ))}
            
            
          </Grid>
        </Card>
      </Grid>
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Customer{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseCustomer()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid item container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name} />
          <ViewFormField sm={6} heading="Trading Name" param={customer?.tradingName} />
          <ViewFormField sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormField sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <Grid item container sx={{ pt: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Address Information
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
          <ViewFormField sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
          <ViewFormField sm={6} heading="City" param={customer?.mainSite?.address?.city} />
          <ViewFormField sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
          <ViewFormField sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
          <ViewFormField sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
          <ViewFormField
            sm={6}
            heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact
                ? `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
                : ''
            }
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact
                ? `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
                : ''
            }
          />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <Grid item container sx={{ pt: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Howick Resources{' '}
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={customer?.accountManager?.firstName}
            secondParam={customer?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={customer?.projectManager?.firstName}
            secondParam={customer?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={customer?.supportManager?.firstName}
            secondParam={customer?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewCustomer(customer._id)}
            href="#"
            underline="none"
            sx={{
              ml: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
              pb: 3,
            }}
          >
            {' '}
            <Typography variant="body" sx={{ px: 2 }}>
              Go to customer
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>
    </Container>
  );
}
