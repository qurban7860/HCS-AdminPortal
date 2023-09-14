import { useNavigate } from 'react-router-dom';
import { Container, Grid, List } from '@mui/material';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import ListItem from '../components/ListTableTools/ListItem';
import ListItemsHeader from '../components/ListTableTools/ListItemsHeader';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function Machine() {
  const navigate = useNavigate();

  // Functions to navigate to different pages
  const linkCategory = () => {
    navigate(PATH_MACHINE.machines.settings.categories.list);
  };
  const linkModel = () => {
    navigate(PATH_MACHINE.machines.settings.model.list);
  };
  const linkStatus = () => {
    navigate(PATH_MACHINE.machines.settings.status.list);
  };
  const linkSupplier = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.list);
  };
  const linkTechParam = () => {
    navigate(PATH_MACHINE.machines.settings.parameters.list);
  };
  const linktpCategory = () => {
    navigate(PATH_MACHINE.machines.settings.technicalParameterCategories.list);
  };
  const linkTool = () => {
    navigate(PATH_MACHINE.machines.settings.tool.list);
  };
  const machineServiceParams = () => {
    navigate(PATH_MACHINE.machines.settings.machineServiceParams.list);
  }
  const linkServiceRecordConfig = () => {
    navigate(PATH_MACHINE.machines.settings.serviceRecordConfigs.list);
  };

  const linkServiceCategory = () => {
    navigate(PATH_MACHINE.machines.settings.serviceCategories.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.SETTINGS} />
      </StyledCardContainer>
      <Grid container spacing={3}>
        {/* Grid for displaying machine related information */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={12} sx={{ ml: '22px' }}>
            <StyledSettingsCardContainer>
              <List
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.COMMON_SETTINGS} />}
              >
                <ListItem
                  onClick={linkCategory}
                  icon={ICONS.MACHINE_CATEGORIES.icon}
                  content={ICONS.MACHINE_CATEGORIES.heading}
                />
                <ListItem
                  onClick={linkModel}
                  icon={ICONS.MACHINE_MODELS.icon}
                  content={ICONS.MACHINE_MODELS.heading}
                />
                <ListItem
                  onClick={linkSupplier}
                  icon={ICONS.MACHINE_SUPPLIERS.icon}
                  content={ICONS.MACHINE_SUPPLIERS.heading}
                />
                <ListItem
                  onClick={linkStatus}
                  icon={ICONS.MACHINE_STATUS.icon}
                  content={ICONS.MACHINE_STATUS.heading}
                />
              </List>

              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.TECHNICAL_SETTINGS} />}
              >
                <ListItem
                  onClick={linktpCategory}
                  icon={ICONS.TECHPARAM_CATEGORIES.icon}
                  content={ICONS.TECHPARAM_CATEGORIES.heading}
                />
                <ListItem
                  onClick={linkTechParam}
                  icon={ICONS.PARAMETERS.icon}
                  content={ICONS.PARAMETERS.heading}
                />
              </List>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.TOOLS_INFO} />}
              >
                <ListItem
                  onClick={linkTool}
                  icon={ICONS.TOOLS.icon}
                  content={ICONS.TOOLS.heading}
                />
              </List>
              <List
                sx={{ fontSize: '0.7em' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={<ListItemsHeader header={FORMLABELS.SERVICE} />}
              >
                <ListItem
                  onClick={linkServiceCategory}
                  icon={ICONS.MACHINE_SERVICE_CATEGORY.icon}
                  content={ICONS.MACHINE_SERVICE_CATEGORY.heading}
                />
                <ListItem
                  onClick={machineServiceParams}
                  icon={ICONS.MACHINE_SERVICE_PARAMETERS.icon}
                  content={ICONS.MACHINE_SERVICE_PARAMETERS.heading}
                />
                <ListItem
                  onClick={linkServiceRecordConfig}
                  icon={ICONS.TOOLS.icon}
                  content={ICONS.MACHINE_SERVICE_RECORD_CONFIG.heading}
                />

                
              </List>
            </StyledSettingsCardContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
