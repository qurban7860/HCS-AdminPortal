import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Grid, Breadcrumbs } from '@mui/material';
import { styled } from '@mui/material/styles';

function BreadcrumbsProducer({
  underline,
  path,
  path2,
  path3,
  path4,
  name,
  name2,
  name3,
  name4,
  step,
  step2,
  step3,
  step4,
  ...props
}) {
  const LinkBase = styled(Link)(({ theme }) => ({
    ...theme.typography.subtitle2,
    color: theme.palette.text.primary,
    // link underline style
    textDecoration: 'none',
  }));
  const steps = [];
  if (step) {
    steps.push({ path, name });
  } else {
    return null;
  }
  if (step2) {
    steps.push({ path2, name2 });
  }
  if (step3) {
    steps.push({ path3, name3 });
  }
  if (step4) {
    steps.push({ path4, name4 });
  }

  return (
    <Grid container spacing={1}>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {steps.map((s, i) => {
          step = step || step2 || step3 || step4;
          return (
            <>
              {step && (
                <LinkBase
                  key={i}
                  href={s.path}
                  sx={{
                    ...(step === steps.length && {
                      color: 'text.primary',
                      '&:hover': { textDecoration: 'none' },
                    }),
                  }}
                >
                  {s.name}
                </LinkBase>
              )}
              {step2 && (
                <LinkBase
                  href={s.path2}
                  sx={{
                    ...(step === steps.length && {
                      color: 'text.primary',
                      '&:hover': { textDecoration: 'none' },
                    }),
                  }}
                >
                  {s.name2}
                </LinkBase>
              )}
              {step3 && (
                <LinkBase
                  href={s.path3}
                  sx={{
                    ...(step === steps.length && {
                      color: 'text.primary',
                      '&:hover': { textDecoration: 'none' },
                    }),
                  }}
                >
                  {s.name3}
                </LinkBase>
              )}
              {step3 && (
                <LinkBase
                  href={s.path4}
                  sx={{
                    ...(step === steps.length && {
                      color: 'text.primary',
                      '&:hover': { textDecoration: 'none' },
                    }),
                  }}
                >
                  {s.name4}
                </LinkBase>
              )}
            </>
          );
        })}
      </Breadcrumbs>
    </Grid>
  );
}

BreadcrumbsProducer.propTypes = {
  // prop type for links

  underline: PropTypes.string,
  path: PropTypes.node,
  path2: PropTypes.node,
  path3: PropTypes.node,
  path4: PropTypes.node,
  name: PropTypes.node.isRequired,
  name2: PropTypes.node.isRequired,
  name3: PropTypes.node.isRequired,
  name4: PropTypes.node.isRequired,
  step: PropTypes.node,
  step2: PropTypes.node,
  step3: PropTypes.node,
  step4: PropTypes.node,
};

BreadcrumbsProducer.defaultProps = {
  underline: 'none',
};

export default BreadcrumbsProducer;
