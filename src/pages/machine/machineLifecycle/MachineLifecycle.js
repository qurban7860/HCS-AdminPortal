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
          actions.push({ sortDate: history.manufactureDate, action: `Manufacture for ${history?.customer?.name || 'N/A'}` });
        }
  
        if (history.installationDate) {
          actions.push({ sortDate: history.installationDate, action: `Installation at ${history?.customer?.name || 'N/A'}` });
        }
  
        if (history.purchaseDate) {
          actions.push({ sortDate: history.purchaseDate, action: `Purchase by ${history?.customer?.name || 'N/A'}` });
        }
  
        if (history.shippingDate) {
          actions.push({ sortDate: history.shippingDate, action: `Shipping to ${history?.customer?.name || 'N/A'}` });
        }
  
        if (history.transferredDate) {
          actions.push({ sortDate: history.transferredDate, action: `Machine Transfer` });
        }
  
        if (history.supportExpireDate) {
          actions.push({ sortDate: history.supportExpireDate, action: `Support expire for ${history?.customer?.name || 'N/A'}` });
        }
  
        if (history.decommissionedDate) {
          actions.push({ sortDate: history.decommissionedDate, action: `Decommissioned at ${history?.customer?.name || 'N/A'}` });
        }

      });
    }
    
    if (Array.isArray(machineLifeCycle?.portalKey)) {
      machineLifeCycle.portalKey.forEach((key) => {
        if (key.createdAt) {
          actions.push({ sortDate: key.createdAt, action: `Portal Connection by ${key?.createdBy?.name || 'N/A'}` });
        }
      });
    }

    if (Array.isArray(machineLifeCycle?.serviceReports)) {
      machineLifeCycle.serviceReports.forEach((report) => {
        if (report.serviceDate) {
          actions.push({ sortDate: report.serviceDate, action: `Service Report` });
        }
      });
    }
  
    return actions
    .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate));
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
                      <Typography variant="body2" fontWeight="bold" color="text.secondary">
                        {item.sortDate ? fDate(item.sortDate) : 'N/A'}
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
