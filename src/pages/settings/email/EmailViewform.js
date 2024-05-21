import React, { useState, useEffect } from 'react'; 
import { Card, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { Cover } from '../../../components/Defaults/Cover';
import { CONFIG } from '../../../config-global';
import axios from '../../../utils/axios';
import { PATH_SETTING } from '../../../routes/paths';
import { StyledCardContainer } from '../../../theme/styles/default-styles';

export default function Emailviewform() {

  const [email, setEmail] = useState([]);
  const {id} = useParams()
  const navigate = useNavigate();

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
      <StyledCardContainer>
        <Cover name="Email subject" icon="ph:users-light" generalSettings />
      </StyledCardContainer>
      <Card sx={{ p: 3 }}>
     
        <Grid container>
          <ViewFormEditDeleteButtons backLink={()=> navigate(PATH_SETTING.email.list)} />
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
