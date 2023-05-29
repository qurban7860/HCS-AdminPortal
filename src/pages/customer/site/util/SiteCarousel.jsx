/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import PropTypes from 'prop-types';
import Carousel from 'react-material-ui-carousel';
import { makeStyles } from '@mui/styles';
import { Paper, Button } from '@mui/material';

const useStyles = makeStyles((theme) => ({
  root: {
    // width: '100%',
    height: '200px',
    objectFit: 'cover',
    carousel: {
      position: 'relative',

      buttonWrapper: {
        position: 'absolute',
        backgroundColor: 'transparent',
        top: 'calc(50% - 70px)',
        '&:hover': {
          '& $button': {
            backgroundColor: 'black',
            opacity: '0.4',
          },
        },
      },

      fullHeightHoverWrapper: {
        height: '100%',
        top: '0',
      },
      buttonVisible: {
        opacity: '.2',
      },
      buttonHidden: {
        opacity: '0',
      },
      button: {
        position: 'absolute',
        top: 'calc(50% - 20px) !important',
        color: 'white',
        transition: '200ms',
        cursor: 'pointer',
        '&:hover': {
          opacity: '0.6 !important',
        },
      },
      // Applies to the "next" button wrapper
      next: {
        right: 0,
      },
      // Applies to the "prev" button wrapper
      prev: {
        left: 0,
      },
    },
  },
}));

export default function SiteCarousel() {
  const classes = useStyles();
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
      className={classes.carousel}
      sx={{
        height: '230px',
      }}
    >
      {items.map((item, i) => (
        <Paper key={i}>
          <img src={item.imageUrl} alt="carousel" />
        </Paper>
      ))}
    </Carousel>
  );
}
