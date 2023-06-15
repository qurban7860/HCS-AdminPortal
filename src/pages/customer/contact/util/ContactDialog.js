import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Dialog, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import ContactViewForm from '../ContactViewForm';
import ContactEditForm from '../ContactEditForm';

const ContactDialog = ({ openContact, currentContactData, handleCloseContact }) => {
  const { contactEditFormVisibility, formVisibility } = useSelector((state) => state.contact);
  const [contactData, setContactData] = React.useState(currentContactData);
  const dispatch = useDispatch();

  const handleEditForm = () => {
    dispatch(formVisibility(false));
  };

  const shouldShowContactEdit = contactEditFormVisibility && !formVisibility;
  return (
    <Dialog
      open={openContact}
      onClose={handleCloseContact}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Grid container lg={12} justifyContent="center">
        <Grid item lg={12}>
          <Card sx={{ width: 'auto', height: 'auto', m: 2 }}>
            <CardActionArea>
              {/* <CardMedia
                component="img"
                sx={{
                  height: '200px',
                  width: '100%',
                  display: 'block',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                  zIndex: '-1',
                  objectFit: 'cover',
                }}
                image="https://www.howickltd.com/asset/172/w800-h600-q80.jpeg"
                alt="customer's site photo was here"
              /> */}
            </CardActionArea>
          </Card>
        </Grid>
        <Grid container lg={12}>
          {!formVisibility && <ContactViewForm currentContact={currentContactData} />}
          {shouldShowContactEdit && <ContactEditForm />}
        </Grid>
      </Grid>
    </Dialog>
  );
};

ContactDialog.propTypes = {
  openContact: PropTypes.bool,
  currentContactData: PropTypes.object,
  handleCloseContact: PropTypes.func,
};

export default ContactDialog;
