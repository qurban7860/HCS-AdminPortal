import { useEffect, useState } from 'react';
import { Typography, Link, Grid } from '@mui/material';

import { PATH_SETTING } from '../../routes/paths';
import { CONFIG } from '../../config-global';

const VersionBadge = () => {
  const isLiveEnv = CONFIG.ENV.toLowerCase() === 'live';
  const version = CONFIG.Version;
  const [envColor, setEnvColor] = useState('#897A69');

  useEffect(() => {
    if (
      CONFIG.ENV.toLocaleLowerCase() === 'dev' ||
      CONFIG.ENV.toLocaleLowerCase === 'development'
    ) {
      setEnvColor('green');
    } else if (CONFIG.ENV.toLocaleLowerCase() === 'test') {
      setEnvColor('#4082ed');
    }
  }, []);

  return (
    <Grid sx={{ mx: 'auto', display: 'flex', alignItems: 'baseline' }}>
      <Link
        sx={{
          mx: 'auto',
          display: 'flex',
          alignItems: 'baseline',
          textDecoration: 'none',
        }}
        href={PATH_SETTING.releases.list}
      >
        {!isLiveEnv ? (
          <Typography
            sx={{
              background: envColor,
              borderRadius: '50px',
              fontSize: '10px',
              padding: '2px 5px',
              color: '#FFF',
            }}
          >
            {`${CONFIG.ENV.toUpperCase()} ${version}`}
          </Typography>
        ) : (
          <Typography sx={{ color: '#897A69', fontSize: '10px' }}>{version}</Typography>
        )}
      </Link>
    </Grid>
  );
};

export default VersionBadge;