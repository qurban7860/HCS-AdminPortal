import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Grid, Dialog } from '@mui/material';
import { setContactDialog } from '../../../redux/slices/customer/contact';
import DialogLabel from './DialogLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import FormLabel from '../DocumentForms/FormLabel';

function ContactDialog() {
    const dispatch = useDispatch();
    const { contact, contactDialog } = useSelector((state) => state.contact);
    const handleConttactDialog = ()=>{ dispatch(setContactDialog(false)) }
  return (
    <Dialog
        maxWidth="lg"
        open={contactDialog}
        onClose={handleConttactDialog}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Contact" onClick={handleConttactDialog} />
        <Grid container sx={{ px: 2, py: 2 }}>
          <ViewFormField
            sm={6}
            heading="First Name"
            param={contact?.firstName && contact?.firstName}
          />
          <ViewFormField
            sm={6}
            heading="Last Name"
            param={contact?.lastName && contact?.lastName}
          />
          <ViewFormField sm={6} heading="Title" param={contact?.title && contact?.title} />
          <ViewFormField
            sm={6}
            heading="Contact Types"
            param={contact?.contactTypes && contact?.contactTypes.toString()}
          />
          <ViewFormField sm={6} heading="Phone" param={contact?.phone && contact?.phone} />
          <ViewFormField sm={6} heading="Email" param={contact?.email && contact?.email} />
          <FormLabel content="Address Information" />
          <ViewFormField
            sm={6}
            heading="Street"
            param={contact?.address?.street && contact?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={contact?.address?.suburb && contact?.address?.suburb}
          />
          <ViewFormField
            sm={6}
            heading="City"
            param={contact?.address?.city && contact?.address?.city}
          />
          <ViewFormField
            sm={6}
            heading="Region"
            param={contact?.address?.region && contact?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={contact?.address?.postcode && contact?.address?.postcode}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={contact?.address?.country && contact?.address?.country}
          />
          <ViewFormField />
        </Grid>
      </Dialog>
  );
}

export default ContactDialog;
