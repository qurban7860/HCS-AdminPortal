import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Paper,
  Slide,
  Container,
  Card,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useSelector } from 'react-redux';

import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import MachineTabContainer from '../util/MachineTabContainer';
import { FORMLABELS } from '../../../constants/document-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';

const MachineLifecycle = () => {
  const { machine } = useSelector((state) => state.machine);

  const defaultValues = useMemo(
    () => ({
      machineModel: machine?.machineModel?.name || '',
      serialNo: machine?.serialNo || '',
      manufactureDate: machine?.manufactureDate || '',
      supportExpireDate: machine?.supportExpireDate || '',
      shippingDate: machine?.shippingDate || '',
      installationDate: machine?.installationDate || '',
      transferredDate: machine?.transferredDate || '',
      status: machine?.status?.name || '',
      createdBy: machine?.createdBy?.name || '',
      updatedBy: machine?.updatedBy?.name || '',
      createdAt: machine?.createdAt || '',
      updatedAt: machine?.updatedAt || '',
      createdByFullName: machine?.createdBy?.name || '',
      createdIP: machine?.createdIP || '',
      updatedByFullName: machine?.updatedBy?.name || '',
      updatedIP: machine?.updatedIP || '',
    }),
    [machine]
  );

  const machineActions = useMemo(() => {
    const actions = [];

    if (machine?.createdAt) {
      actions.push({ date: fDate(machine?.createdAt), action: 'Purchase Date' });
    }
    if (machine?.manufactureDate) {
      actions.push({ date: fDate(machine?.manufactureDate), action: 'Manufacturing Date' });
    }
    if (machine?.shippingDate) {
      actions.push({ date: fDate(machine?.shippingDate), action: 'Shipping Date' });
    }
    if (machine?.installationDate) {
      actions.push({ date: fDate(machine?.installationDate), action: 'Installation Date' });
    }
    if (machine?.transferredDate) {
      actions.push({ date: fDate(machine?.transferredDate), action: 'Transferred Date' });
    }
    if (machine?.supportExpireDate) {
      actions.push({ date: fDate(machine?.supportExpireDate), action: 'Support Expiry Date' });
    }

    return actions;
  }, [machine]);

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="machineLifecycle" />

      <Card sx={{ p: 3 }}>
        <Box>
          {/* Title */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
              flexWrap: 'wrap',
            }}
          >
            <FormLabel content={FORMLABELS.MACHINE_LIFECYCLE} />

          </Box>
          

          {/* Timeline */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6,mr: 45 }}>
              
          <Box
              sx={{
                position: 'absolute',
                top: 20,
                bottom: 20,
                width: 4,
                bgcolor: 'primary.main',
                ml: -35.5,
                zIndex: 0,
              }}
            />

           
            {machineActions.map((item, index) => (
              <Slide direction="up" in key={index} style={{ transitionDelay: `${index * 100}ms` }}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 3, position: 'relative', zIndex: 1 }}>
                  
               
                  <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {item.date}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <EventIcon sx={{ fontSize: 24 }} />
                    </Avatar>
                  </Box>

                  {/* Right: Label */}
                  <Box sx={{ flex: 2, pl: 2 }}>
                    <Paper
                      elevation={4}
                      sx={{
                        p: 2,
                        backgroundColor: '#fff',
                        borderRadius: 2,
                        boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Typography variant="h6" fontWeight={600}>
                        {item.action}
                      </Typography>
                    </Paper>
                  </Box>

                </Box>
              </Slide>
            ))}
          </Box>

          <Divider sx={{ mb: 1, mt: -2}} />
        </Box>

        <ViewFormAudit defaultValues={defaultValues} />
      </Card>
    </Container>
  );
};

export default MachineLifecycle;
