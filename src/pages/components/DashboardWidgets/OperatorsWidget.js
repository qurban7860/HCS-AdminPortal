import PropTypes from 'prop-types';
// import orderBy from 'lodash/orderBy';
import { useSelector } from 'react-redux';
// @mui
import { alpha } from '@mui/material/styles';
import { Box, Stack, Card, Divider, Typography, CardHeader } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
// import Logo from '../../../components/logo-avatar/LogoAvatar';
import LogoAvatar from '../../../components/logo-avatar/LogoAvatar';
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------

HowickOperators.propTypes = {
  list: PropTypes.array,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function HowickOperators({ title, subheader, list }) {
  const { spContacts } = useSelector((state) => state.contact);
  return (
    <Card>
      <CardHeader 
          title={title} 
          titleTypographyProps={{variant:'h4', color:'#fff'}} 
          subheader={subheader} 
          subheaderTypographyProps={{color:'#fff', fontSize:16}} 
          sx={{background:'#2065D1', p:2}} 
      />
      <Divider />
      <Stack sx={{p:2}}>
        {spContacts.map((operator, index) => (
          <OperatorItem key={operator._id || index} operator={operator} index={index} />
        ))}
      </Stack>
    </Card>
  );
}

// ----------------------------------------------------------------------

OperatorItem.propTypes = {
  operator: PropTypes.shape({
    _id: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    produced: PropTypes.number,
  }),
  index: PropTypes.number,
};

function OperatorItem({ operator, index }) {
  const fullName = `${operator?.firstName || ''} ${operator?.lastName || ''}`;

  return (
    <Stack key={operator._id} direction="row" alignItems="center" spacing={1} sx={{padding:'10px 0px', borderTop:'1px solid #e9e9e9' }}>
      <CustomAvatar name={fullName} />

      <Box sx={{ flexGrow: 1}}>
        <Typography variant="subtitle2">{fullName}</Typography>
        <Typography variant="caption" sx={{display: 'flex', alignItems: 'center', color: 'text.secondary'}}>
          <Iconify icon="mdi:account-arrow-up" width={16} color="green" />
            {operator.produced}
        </Typography>
      </Box>

      <LogoAvatar
        sx={{
          p: 1,
          width: 40,
          height: 40,
          borderRadius: '50%',
          color: 'primary.main',
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          ...(index === 1 && {
            color: 'info.main',
            bgcolor: (theme) => alpha(theme.palette.info.main, 0.08),
          }),
          ...(index === 2 && {
            color: 'error.main',
            bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
          }),
        }}
      />
    </Stack>
  );
}
