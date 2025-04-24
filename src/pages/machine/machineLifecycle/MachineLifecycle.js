import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Paper,
  Stack,
  Slide,
  Container,
  Card,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useSelector } from 'react-redux';

import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { fDate } from '../../../utils/formatTime';
import MachineTabContainer from '../util/MachineTabContainer';
import TableCard from '../../../components/ListTableTools/TableCard';
import { FORMLABELS } from '../../../constants/document-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';

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
      actions.push({ date: fDate(machine?.createdAt), action: 'Purchase Date'});
    }
    if (machine?.manufactureDate) {
      actions.push({ date: fDate(machine?.manufactureDate) ,action: 'Manufacturing Date' });
    }
    if (machine?.shippingDate) {
      actions.push({ date: fDate(machine?.shippingDate),action: 'Shipping Date' });
    }
    if (machine?.installationDate) {
      actions.push({ date: fDate(machine?.installationDate), action: 'Installation Date' });
    }
    if (machine?.transferredDate){
        actions.push({ date: fDate(machine?.transferredDate),action:'Transferred Date'});
      }
    if (machine?.supportExpireDate) {
      actions.push({ date: fDate(machine?.supportExpireDate), action: 'Support Expiry Date' });
    }
    

    return actions;
  }, [machine]);

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="machineLifecycle" />

      <Card sx={{ p: 3}}>
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

          {/* Timeline Section */}
          <Box sx={{ position: 'relative', pl: 6, borderLeft: '3px solid #1976d2', mb: 6 }}>
            {machineActions.map((item, index) => (
              <Slide
                direction="up"
                in
                style={{ transitionDelay: `${index * 100}ms` }}
                key={index}
              >
                <Box sx={{ mb: 6, position: 'relative' }}>
                  <Avatar
                    sx={{
                      position: 'absolute',
                      left: '-30px',
                      top: 8,
                      width: 40,
                      height: 40,
                      bgcolor: 'primary.main',
                    }}
                  >
                    <EventIcon sx={{ fontSize: 24 }} />
                  </Avatar>

                  <Paper
                    elevation={4}
                    sx={{
                      p: 3,
                      backgroundColor: '#fff',
                      borderRadius: 2,
                      boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" color="text.secondary">
                        {item.date}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {item.action}
                      </Typography>
                    </Stack>
                  </Paper>
                </Box>
              </Slide>
            ))}
          </Box>

          <Divider sx={{ mb: 4 }} />
        </Box>

        <ViewFormAudit defaultValues={defaultValues} />
      </Card>
    </Container>
  );
};

export default MachineLifecycle;
