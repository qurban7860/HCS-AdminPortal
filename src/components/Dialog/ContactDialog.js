// import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { setContactDialog } from '../../redux/slices/customer/contact';
import FormLabel from '../DocumentForms/FormLabel';
import DialogLink from './DialogLink';
import ViewFormField from '../ViewForms/ViewFormField';
import ViewPhoneComponent from '../ViewForms/ViewPhoneComponent';

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
        <DialogContent dividers sx={{px:3}}>
          <Grid container>

          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="First Name"
            param={contact?.firstName && contact?.firstName}
          />
          <ViewFormField isLoading={isLoading}
            sm={6}
            heading="Last Name"
            param={contact?.lastName && contact?.lastName}
          />
          <ViewFormField isLoading={isLoading}  sm={6} heading="Title" param={contact?.title && contact?.title} />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes && contact?.contactTypes.toString()}
          />
          <ViewPhoneComponent isLoading={isLoading}  sm={12} heading="Phone" value={contact?.phoneNumbers && contact?.phoneNumbers} />
          <FormLabel content="Address Information" />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Street"
            param={contact?.address?.street && contact?.address?.street}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb && contact?.address?.suburb}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="City"
            param={contact?.address?.city && contact?.address?.city}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Region"
            param={contact?.address?.region && contact?.address?.region}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode && contact?.address?.postcode}
          />
          <ViewFormField isLoading={isLoading} 
            sm={6}
            heading="Country"
            param={contact?.address?.country && contact?.address?.country}
          />
          <ViewFormField isLoading={isLoading}  />
        </Grid>
        </DialogContent>
        <DialogLink onClose={handleConttactDialog}/>
      </Dialog>
  );
}

export default ContactDialog;
