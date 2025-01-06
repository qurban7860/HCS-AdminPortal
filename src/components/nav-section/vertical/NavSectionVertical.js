import PropTypes from 'prop-types';
// @mui
import { List, Stack } from '@mui/material';
// locales
import { useLocales } from '../../../locales';
//
import { StyledSubheader } from './styles';
import NavList from './NavList';
import NavItem from './NavItem';
import Iconify from '../../iconify';
import { PATH_CRM, PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

NavSectionVertical.propTypes = {
  sx: PropTypes.object,
  data: PropTypes.object,
};

export default function NavSectionVertical({ data, sx, ...other }) {
  const { translate } = useLocales();

  return (
    <Stack sx={sx} {...other}>
          {data && data.length > 0 && data.map((group) => (
            <List key={group.subheader} disablePadding sx={{ px: 2 }}>
              {group.subheader && (
                <StyledSubheader disableSticky>{`${translate(group.subheader)}`}</StyledSubheader>
              )}
              {group.items.map((list) => (
                <NavList
                  key={list.title + list.path}
                  data={list}
                  depth={1}
                  hasChild={!!list.children}
                  sx={{}}
                />
              ))}
            </List>
          ))}
    </Stack>
  );
}