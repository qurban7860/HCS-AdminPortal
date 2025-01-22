import React, { useState } from 'react'; 
import PropTypes from 'prop-types';
import { Card, Grid } from '@mui/material';
import ViewFormField from '../../../components/ViewForms/ViewFormField';

Emailviewform.propTypes = {
  emailData: PropTypes.object,
};

export default function Emailviewform({ emailData }) {
  const [showFullBody, setShowFullBody] = useState(false);

  return (
    <Grid>
      <Card sx={{ p: 3 }}>
        <Grid container>
          <ViewFormField 
            sm={6} 
            heading="Customer Name" 
            param={emailData && emailData.customerName ? emailData.customerName : 'N/A'} 
          />
          <ViewFormField 
            sm={6} 
            heading="Subject" 
            param={emailData && emailData.subject ? emailData.subject : 'N/A'} 
          />
          <ViewFormField 
            sm={12} 
            heading="Body"
            style={{ width: '700px' }} 
            param={
              !emailData?.body ? (
                'N/A'
              ) : (
                <div>
                  <iframe 
                    srcDoc={emailData.body}
                    style={{ 
                      width: '700px', 
                      height: showFullBody ? '500px' : '100px',
                      border: 'none',
                      overflow: 'hidden',
                      transition: 'height 0.3s ease'
                    }}
                    title="email-body"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFullBody(prev => !prev)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2065D1',
                      cursor: 'pointer',
                      padding: '8px 0',
                      width: '100%',
                      textAlign: 'center'
                    }}
                  >
                    {showFullBody ? 'Show Less' : 'Show More'}
                  </button>
                </div>
              )
            } 
          />
          <ViewFormField 
            sm={6} 
            heading="To Users" 
            param={emailData && emailData.toUsers ? emailData.toUsers : 'N/A'} 
          />
          <ViewFormField
            sm={6}
            heading="From Email"
            param={emailData && emailData.fromEmail ? emailData.fromEmail : 'N/A'}
          />
          <ViewFormField
            sm={6}
            heading="To Emails"
            param={emailData && emailData.toEmail ? emailData.toEmail : 'N/A'}
          />
          <ViewFormField
            sm={6}
            heading="Created At"
            param={emailData && emailData.createdAt ? emailData.createdAt : 'N/A'}
          />
        </Grid>
      </Card>
    </Grid>
  );
}
