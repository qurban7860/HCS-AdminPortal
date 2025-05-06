import React, { useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Divider,
  Avatar,
  Paper,
  Fade,
  Container,
  Card,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useSelector, useDispatch } from 'react-redux';

import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import MachineTabContainer from '../util/MachineTabContainer';
import { FORMLABELS } from '../../../constants/document-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';
import { getMachineLifeCycle } from '../../../redux/slices/products/machine';

const MachineLifecycle = () => {
  const dispatch = useDispatch();
  const { machine, machineLifeCycle } = useSelector((state) => state.machine);

  useEffect(() => {
    if (machine?._id) {
      dispatch(getMachineLifeCycle(machine._id));
    }
  }, [dispatch, machine?._id]);
  
  const defaultValues = useMemo(
    () => ({
      createdBy: machineLifeCycle?.createdBy?.name || '',
      updatedBy: machineLifeCycle?.updatedBy?.name || '',
      createdAt: machineLifeCycle?.createdAt || '',
      updatedAt: machineLifeCycle?.updatedAt || '',
      createdByFullName: machineLifeCycle?.createdBy?.name || '',
      updatedByFullName: machineLifeCycle?.updatedBy?.name || '',
    }),
    [machineLifeCycle]
  );
  
  const machineActions = useMemo(() => {
    const actions = [];
  
    if (Array.isArray(machineLifeCycle?.transferredHistory)) {
      machineLifeCycle.transferredHistory.forEach((history) => {
        if (history.manufactureDate) {
          actions.push({
            rawDate: history.manufactureDate,
            date: fDate(history.manufactureDate),
            action: `Manufactured for ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.installationDate) {
          actions.push({
            rawDate: history.installationDate,
            date: fDate(history.installationDate),
            action: `Installed at ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.purchaseDate) {
          actions.push({
            rawDate: history.purchaseDate,
            date: fDate(history.purchaseDate),
            action: `Purchased by ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.shippingDate) {
          actions.push({
            rawDate: history.shippingDate,
            date: fDate(history.shippingDate),
            action: `Shipped to ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.transferredDate) {
          actions.push({
            rawDate: history.transferredDate,
            date: fDate(history.transferredDate),
            action: `Transferred to ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.supportExpireDate) {
          actions.push({
            rawDate: history.supportExpireDate,
            date: fDate(history.supportExpireDate),
            action: `Support expired for ${history?.customer?.name || 'N/A'}`
          });
        }
  
        if (history.decommissionedDate) {
          actions.push({
            rawDate: history.decommissionedDate,
            date: fDate(history.decommissionedDate),
            action: `Decommissioned at ${history?.customer?.name || 'N/A'}`
          });
        }
      });
    }
  
    return actions
      .filter(action => action.rawDate)
      .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));
  }, [machineLifeCycle]);  

  return (
    <Container maxWidth={false}>
      <MachineTabContainer currentTabValue="machineLifecycle" />
      <Card sx={{ p: 3 }}>
        <Box>
          {/* Title */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
            <FormLabel content={FORMLABELS.MACHINE_LIFECYCLE} />
          </Box>

          {/* Timeline */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 6,
              width: { xs: '100%', md: '50%' },
              mr: { xs: 0, md: '30%' },
              ml: { xs: 0, md: 'auto' },
            }}
          >
            {/* Vertical Line */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                bottom: 20,
                left: '35%',
                transform: 'translateX(-30%)',
                width: { xs: 2, md: 4 },
                bgcolor: 'primary.main',
                zIndex: 0,
              }}
            />

            {/* Timeline Items */}
            {machineActions.length === 0 ? (
              <Typography variant="body2" color="text.secondary" mt={3}>
                No machine lifecycle data available.
              </Typography>
            ) : (
              machineActions.map((item, index) => (
                <Fade in timeout={500} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 3, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ flex: 1, textAlign: 'right', pr: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.date}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 40 }}>
                        <EventIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                    </Box>

                    <Box sx={{ flex: 2, pl: 2 }}>
                      <Paper elevation={4} sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600}>
                          {item.action}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              ))
            )}
          </Box>

          <Divider sx={{ mb: 1, mt: -2 }} />
        </Box>
        <ViewFormAudit defaultValues={defaultValues} />
      </Card>
    </Container>
  );
};

export default MachineLifecycle;
