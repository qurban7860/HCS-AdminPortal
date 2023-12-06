// import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { setContactDialog } from '../../../redux/slices/customer/contact';
import FormLabel from '../DocumentForms/FormLabel';
import DialogLink from './DialogLink';
import ViewFormFieldWithSkelton from '../ViewForms/ViewFormFieldWithSkelton';

function ContactDialog() {
    const dispatch = useDispatch();
    const { contact, contactDialog, isLoading} = useSelector((state) => state.contact);
    const handleConttactDialog = ()=>{ dispatch(setContactDialog(false)) }
  return (
    <Dialog
        maxWidth="md"
        open={contactDialog}
        onClose={handleConttactDialog}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Contact</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        {/* <DialogLabel content="Contact" onClick={handleConttactDialog} /> */}
        <DialogContent dividers sx={{pl:1, pr:1}}>
          <Grid container>

          <ViewFormFieldWithSkelton isLoading={isLoading}
            sm={6}
            heading="First Name"
            param={contact?.firstName && contact?.firstName}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading}
            sm={6}
            heading="Last Name"
            param={contact?.lastName && contact?.lastName}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading}  sm={6} heading="Title" param={contact?.title && contact?.title} />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes && contact?.contactTypes.toString()}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading}  sm={6} heading="Phone" param={contact?.phone && contact?.phone} />
          <ViewFormFieldWithSkelton isLoading={isLoading}  sm={6} heading="Email" param={contact?.email && contact?.email} />
          <FormLabel content="Address Information" />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Street"
            param={contact?.address?.street && contact?.address?.street}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb && contact?.address?.suburb}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="City"
            param={contact?.address?.city && contact?.address?.city}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Region"
            param={contact?.address?.region && contact?.address?.region}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode && contact?.address?.postcode}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading} 
            sm={6}
            heading="Country"
            param={contact?.address?.country && contact?.address?.country}
          />
          <ViewFormFieldWithSkelton isLoading={isLoading}  />
        </Grid>
        </DialogContent>
        <DialogLink onClose={handleConttactDialog}/>
      </Dialog>
  );
}

export default ContactDialog;
