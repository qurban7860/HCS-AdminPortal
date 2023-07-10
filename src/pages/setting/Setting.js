import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Grid, List } from '@mui/material';
// routes
import { PATH_SETTING } from '../../routes/paths';
// components
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { StyledSettingsCardContainer } from '../../theme/styles/machine-styles';
import ListItemsHeader from '../components/ListTableTools/ListItemsHeader';
import ListItem from '../components/ListTableTools/ListItem';
// constants
import { FORMLABELS } from '../../constants/default-constants';
import { ICONS } from '../../constants/icons/default-icons';

// ----------------------------------------------------------------------

export default function Setting() {
  const navigate = useNavigate();

  // Functions to navigate to different pages
  const linkDocumentName = () => {
    navigate(PATH_SETTING.documentType.list);
  };
  const linkFileCategory = () => {
    navigate(PATH_SETTING.documentCategory.list);
  };
  const linkRole = () => {
    navigate(PATH_SETTING.role.list);
  };
  const linkSignInLogs = () => {
    navigate(PATH_SETTING.signInLogs.list);
  };

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={FORMLABELS.COVER.SETTINGS} />
      </StyledCardContainer>
      <Grid container gap={3}>
        {/* Grid for displaying Settings related information */}

        <Grid item xs={12} md={6} lg={4}>
          <StyledSettingsCardContainer>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={<ListItemsHeader header={FORMLABELS.DOCUMENT_SETTINGS} />}
            >
              <ListItem
                onClick={linkDocumentName}
                icon={ICONS.DOCUMENT_TYPE.icon}
                content={ICONS.DOCUMENT_TYPE.heading}
              />
              <ListItem
                onClick={linkFileCategory}
                icon={ICONS.DOCUMENT_CATEGORY.icon}
                content={ICONS.DOCUMENT_CATEGORY.heading}
              />
            </List>
          </StyledSettingsCardContainer>
          <StyledSettingsCardContainer>
            <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={<ListItemsHeader header={FORMLABELS.SECURITY_SETTINGS} />}
            >
              <ListItem
                onClick={linkRole}
                icon={ICONS.SECURITY_ROLES.icon}
                content={ICONS.SECURITY_ROLES.heading}
              />
              <ListItem
                onClick={linkSignInLogs}
                icon={ICONS.SIGNIN_LOGS.icon}
                content={ICONS.SIGNIN_LOGS.heading}
              />
            </List>
          </StyledSettingsCardContainer>
        </Grid>
      </Grid>
    </Container>
  );
}
