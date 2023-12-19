/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
// import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material';

export default function SiteCarousel() {
  const items = [
    { imageUrl: 'https://www.howickltd.com/asset/245/w800-h600-q80.jpeg' },
    { imageUrl: 'https://www.howickltd.com/asset/241/w800-h600-q80.jpeg' },
    { imageUrl: 'https://www.howickltd.com/asset/119/w800-h600-q80.jpeg' },
    { imageUrl: 'https://www.howickltd.com/asset/1527.jpeg' },
    { imageUrl: 'https://www.howickltd.com/asset/1808.jpeg' },
  ];
  return (
    <Carousel
      swipe="true"
      animation="slide"
      indicators={false}
      navButtonsProps={{
        style: {
          backgroundColor: 'cornflowerblue',
        },
      }}
      duration={1000}
      easing="ease-in-out"
      disableButtonsControls="true"
      sx={{
        height: '230px',
      }}
    >
      {items.map((item, i) => (
        <Paper key={i}>
          <img src={item.imageUrl} width="100%" alt="carousel" />
        </Paper>
      ))}
    </Carousel>
  );
}
