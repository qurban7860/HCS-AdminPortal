import React, { useState, useEffect } from 'react'; 
import { Card, Grid } from '@mui/material';
import { useParams } from 'react-router-dom';
import ViewFormField from '../components/ViewForms/ViewFormField';
import { Cover } from '../components/Defaults/Cover';
import { CONFIG } from '../../config-global';
import axios from '../../utils/axios';

export default function Emailviewform() {


  const [email, setEmail] = useState([]);
  const {id} = useParams()




  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await axios.get(`${CONFIG.SERVER_URL}emails/${id}`);
        response.data.customerName = response.data.customer.name;
        response.data.toEmail = response.data.toEmails[0];
        response.data.toUsers = response.data.toUsers[0];
    
        setEmail(response.data);
    
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Grid sx={{ p: 3, mt: -3 }}>
      <Card sx={{ mb: 3, height: 160, position: 'relative' }}>
        <Cover name="Email subject" icon="ph:users-light"  />
      </Card>
      <Card sx={{ p: 3 }}>
     
        <Grid container>
          <ViewFormField sm={6} heading="name" param={email?.customerName} />
          <ViewFormField sm={6} heading="subject" param={email?.subject} />
          <ViewFormField sm={12} heading="body" param={email?.body} />
          <ViewFormField sm={6} heading="toUsers" param={email?.toUsers} />
          <ViewFormField
            sm={6}
            heading="fromEmail"
            param={email?.fromEmail}
          />
          <ViewFormField
            sm={6}
            heading="toEmails"
            param={email?.toEmail}
          />
          <ViewFormField
            sm={6}
            heading="createdAt"
            param={email?.createdAt}
          />
        </Grid>
      </Card>
    </Grid>
  )
}
