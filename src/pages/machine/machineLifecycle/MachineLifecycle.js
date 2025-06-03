import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Fade,
  Container,
  Card,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
import MachineTabContainer from '../util/MachineTabContainer';
import { FORMLABELS } from '../../../constants/document-constants';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import { fDate } from '../../../utils/formatTime';
import { getMachineLifeCycle, resetMachineLifeCycle } from '../../../redux/slices/products/machine';
import OpenInNewPage from '../../../components/Icons/OpenInNewPage';
import { TableNoData } from '../../../components/table';

const MachineLifecycle = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { machine, machineLifeCycle } = useSelector((state) => state.machine);

  useEffect(() => {
    if (machine?._id) {
      dispatch(getMachineLifeCycle(machine._id));
    }
    return () => { 
      dispatch(resetMachineLifeCycle());
    }
  }, [dispatch, machine?._id]);
  
  const handleViewServiceReport = (serviceReportId) => {
    if (machine?._id && serviceReportId) {
      navigate(PATH_MACHINE.machines.serviceReports.view(machine._id, serviceReportId));
    }
  };

  const openInNewPage = async ( mId, id) => { 
    window.open(PATH_MACHINE.machines.serviceReports.view( ( machineId || mId ) ,id ), '_blank');
  }

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
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start', 
              // mb: 6,
              width: '100%',
            }}
          >
            {/* Vertical Line */}
            { machineLifeCycle?.length > 0 && <Box
              sx={{
                position: 'absolute',
                top: 25,
                bottom: 40,
                left: 150, 
                width: { xs: 2, md: 4 },
                bgcolor: 'primary.main',
                zIndex: 0,
              }}
            />}

            {/* Timeline Items */}
            {Array.isArray(machineLifeCycle) && machineLifeCycle?.length === 0 ? (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <TableNoData isNotFound={!machineLifeCycle?.length} />
              </Box>
            ) : (
              Array.isArray(machineLifeCycle) && machineLifeCycle?.map((item, index) => (
                <Fade in timeout={500} key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      mb: 3,
                      position: 'relative',
                      zIndex: 1,
                      pl: 4,
                    }}
                  >
                    <Box sx={{ width: 100 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.secondary"
                      >
                        {item.date ? fDate(item.date) : 'N/A'}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        mr: 2,
                      }}
                    >
                      <Avatar sx={{ bgcolor: 'primary.main', width: 42, height: 40 }}>
                        <EventIcon sx={{ fontSize: 24 }} />
                      </Avatar>
                    </Box>

                    <Box sx={{ flex: 1 }}>
                      <Paper
                        elevation={4}
                        sx={{ p: 2, backgroundColor: '#fff', borderRadius: 2 }}
                      >
                        <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {item.type}
                          {item?.type === 'Service Report Date' && item?.serviceReportUID && item?.id && (
                            <Box sx={{ display: 'inline-flex', alignItems: 'center', ml: 1, cursor: 'pointer' }}>
                          <Typography variant="body2"
                            onClick={() => handleViewServiceReport(item.id)}
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              textDecorationStyle: 'dotted',
                              fontWeight: 'bold',
                              '&:hover': {
                                color: (themes) => alpha(themes.palette.info.main, 0.98),
                              },
                            }}>
                            {item.serviceReportUID}
                          </Typography>
                          <OpenInNewPage onClick={() => openInNewPage(machineId, item.id)}/>
                          </Box> )}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                </Fade>
              ))
            )}
          </Box>
        </Box>
      </Card>
    </Container>
  );
};

export default MachineLifecycle;
