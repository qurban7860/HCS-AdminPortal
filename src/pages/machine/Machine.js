import { useNavigate } from 'react-router-dom';
import { Container, Grid, List } from '@mui/material';
// hooks
import { useTheme } from '@mui/material/styles';
// redux
import { useDispatch } from '../../redux/store';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// components
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { Cover } from '../components/Defaults/Cover';
import ListItem from '../components/ListTableTools/ListItem';
import ListItemsHeader from '../components/ListTableTools/ListItemsHeader';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function Machine() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  // Functions to navigate to different pages
  const linkCategory = () => {
    navigate(PATH_MACHINE.machines.settings.categories.list);
  };
  const linkModel = () => {
    navigate(PATH_MACHINE.machines.settings.machineModel.list);
  };
  const linkStatus = () => {
    navigate(PATH_MACHINE.machines.settings.machineStatus.list);
  };
  const linkSupplier = () => {
    navigate(PATH_MACHINE.machines.settings.supplier.list);
  };
  const linkTechParam = () => {
    navigate(PATH_MACHINE.machines.settings.machineParameters.list);
  };
  const linktpCategory = () => {
    navigate(PATH_MACHINE.machines.settings.machineTechnicalParameterCategories.list);
  };
  const linkTool = () => {
    navigate(PATH_MACHINE.machines.settings.tool.list);
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
                  icon={ICONS.SETTING_CATEGORIES.icon}
                  content={ICONS.SETTING_CATEGORIES.heading}
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
            </StyledSettingsCardContainer>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
