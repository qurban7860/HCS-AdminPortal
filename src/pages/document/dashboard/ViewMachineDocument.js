import { Helmet } from 'react-helmet-async';
import { useState,useMemo , useEffect, useLayoutEffect } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Card ,Tooltip,Typography, Box, Dialog, Link} from '@mui/material';
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
import { getMachineDocument , resetMachineDocument} from '../../../redux/slices/document/machineDocument';
import { getCustomer, resetCustomer } from '../../../redux/slices/customer/customer';
import { getMachine, resetMachine } from '../../../redux/slices/products/machine';



// ----------------------------------------------------------------------

export default function Document() {
  const dispatch = useDispatch();
  // const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams()
  const regEx = /^[^2]*/;
  const { enqueueSnackbar } = useSnackbar();

  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
console.log("customer machine", customer, machine)
  console.log("machineDocument : ",machineDocument)
  const [ preview, setPreview] = useState(false)
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
//     console.log("getMachine")
//     if(machineDocument?.machine){
//       dispatch(getMachine(machineDocument.machine._id))
//     }
//   },[machineDocument,dispatch])

//   useEffect(() =>{
//     console.log("getCustomer")
// if(machineDocument?.customer){
//   dispatch(getCustomer(machineDocument.customer._id))
// }
//   },[machineDocument,dispatch])

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleViewCustomer = (Id) => {
    navigate(PATH_DASHBOARD.customer.view(Id));
  };  
  const handleViewMachine = (Id) => {
    navigate(PATH_MACHINE.machine.view(Id));
  };
  const handleOpenMachine = () => setOpenMachine(true);
  const handleCloseMachine = () => setOpenMachine(false);
  const defaultValues = useMemo(
    () => (
      {
        displayName :             machineDocument?.displayName || "",
        documentName:             machineDocument?.documentName?.name || "",
        docCategory:              machineDocument?.docCategory?.name || "",
        docType:                  machineDocument?.docType?.name || "",
        customer:                 machineDocument?.customer?.name || "",
        machine:                  machineDocument?.machine?.name || "",
        customerAccess:           machineDocument?.customerAccess,
        isActiveVersion:          machineDocument?.isActiveVersion,
        documentVersion:          machineDocument?.documentVersions?.length > 0 ? machineDocument?.documentVersions[0]?.versionNo : "",
        description:              machineDocument?.description,
        isActive:                 machineDocument?.isActive,
        createdAt:                machineDocument?.createdAt || "",
        createdByFullName:        machineDocument?.createdBy?.name || "",
        createdIP:                machineDocument?.createdIP || "",
        updatedAt:                machineDocument?.updatedAt || "",
        updatedByFullName:        machineDocument?.updatedBy?.name || "",
        updatedIP:                machineDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machineDocument]
  );

  const handleOpenPreview = () => {setPreview(true)};

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
            <ViewFormField sm={6} heading="Machine" objectParam={
                                    defaultValues.machine ? (
                                      <Link onClick={handleOpenMachine} href="#" underline="none">
                                        {defaultValues.machine}
                                      </Link>
                                    ) : (
                                      ''
                                    )
                                  } />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            <Grid container sx={{ mt: '1rem' ,mb: '-1rem'}}>
                <ViewFormAudit defaultValues={defaultValues}/>
            </Grid>
            {machineDocument && machineDocument?.documentVersions?.map((files)=>(
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
                <Card sx={{m:1, width:"130px", height:"155px", mt:2}}>
                  <Link href="#" underline="none"
                  component="button"
                  title={file?.name}
                  // sx={{display:"flex",flexDirection:"column",justifyContent:"center" ,alignItems:"center"}}
                  // onClick={() => handleDownload(file._id,file.name ,file.extension)}
                  >
                    <Box
                      onAbort={handleOpenPreview}
                      component="img"
                      width="80px" height="80px" 
                      sx={{ mx:3, mt:2, objectFit:"cover" }}
                      alt={file.DisplayName}
                      src={`data:image/png;base64, ${file?.thumbnail}`}
                      />
                      <Typography sx={{mt:0.7, }}>{file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}</Typography>
                  </Link> 
                </Card> :
                <Card sx={{m:1, width:"130px", height:"155px", mt:2}}>
                  <Link href="#" underline="none"
                    component="button"
                    title={file?.name}
                    // onClick={() => handleDownload(file._id,file.name ,file.extension )}
                  >
                    <Iconify sx={{ mx:3, mt:2 }} width="80px" height="113px" icon={document.icon[file.extension]} color={document.color[file.extension]}  />
                    <Typography sx={{mt:0.5}}>{file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}</Typography>
                  </Link>
                </Card>}
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
      <Dialog
        maxWidth="md"
        open={openMachine}
        onClose={handleCloseMachine}
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
            Machine{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseMachine()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify sx={{color:"white"}} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No"                   param={machine?.serialNo} />
          <ViewFormField sm={6} heading="Name"                        param={machine?.name} />
          <ViewFormField sm={6} heading="Previous Machine Serial No"  param={machine?.parentSerialNo}/>
          <ViewFormField sm={6} heading="Previous Machine"            param={machine?.parentMachine?.name} />
          <ViewFormField sm={6} heading="Supplier"                    param={machine?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model"               param={machine?.machineModel?.name} />
          {/* <ViewFormField sm={6} heading="Status"                      param={machine?.status?.name} /> */}
          {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={machine?.workOrderRef} /> */}
          {/* <ViewFormField sm={12} heading="Customer"                   param={machine?.customer?.name }/> */}
          <ViewFormField sm={6} heading="Installation Site"           param={machine?.instalationSite?.name}/>
          <ViewFormField sm={6} heading="Billing Site"                param={machine?.billingSite?.name}/>
          <ViewFormField sm={12} heading="Nearby Milestone"           param={machine?.siteMilestone} />
          {/* <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
            {machine?.description && <Typography variant="body1" component="p" >
                {descriptionExpanded ? machine?.description : `${machine?.description.slice(0, 90)}...`}{machine?.description?.length > 90 && (
                <Button onClick={handleDescriptionExpandedToggle} color="primary">
                  {descriptionExpanded ? 'See Less' : 'See More'}
                </Button>)}
            </Typography>}
          </Grid> */}

        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <Grid item container sx={{ py: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
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
            param={machine?.accountManager?.firstName}
            secondParam={machine?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={machine?.projectManager?.firstName}
            secondParam={machine?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={machine?.supportManager?.firstName}
            secondParam={machine?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewMachine(machine._id)}
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
              Go to Machine
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>
    </Container>
  );
}
