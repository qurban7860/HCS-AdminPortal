/* eslint-disable import/no-unresolved */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactLightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Download from 'yet-another-react-lightbox/plugins/download';
import { useLightboxState } from 'yet-another-react-lightbox/core';
// @mui
import { Typography } from '@mui/material';
//
import Iconify from '../iconify';
//
import StyledLightbox from './styles';

// ----------------------------------------------------------------------

const ICON_SIZE = 24;

Lightbox.propTypes = {
  slides: PropTypes.array,
  disabledZoom: PropTypes.bool,
  disabledVideo: PropTypes.bool,
  disabledTotal: PropTypes.bool,
  disabledCaptions: PropTypes.bool,
  disabledSlideshow: PropTypes.bool,
  disabledThumbnails: PropTypes.bool,
  disabledFullscreen: PropTypes.bool,
  disabledDownload: PropTypes.bool,
  onGetCurrentIndex: PropTypes.func,
  imageLoading: PropTypes.bool,
};

export default function Lightbox({
  slides,
  disabledZoom,
  disabledVideo,
  disabledTotal,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
  disabledDownload,
  onGetCurrentIndex,
  imageLoading,
  ...other
}) {
  const totalItems = slides ? slides.length : 0;

  return (
    <>
      <StyledLightbox />

      <ReactLightbox
        slides={slides}
        captions='slides'
        animation={{ swipe: 240 }}
        carousel={{ finite: totalItems < 5 }}
        controller={{ closeOnBackdropClick: true }}
        zoom={{
          maxZoomPixelRatio:5
        }}
        plugins={getPlugins({
          disabledZoom,
          disabledVideo,
          disabledCaptions,
          disabledSlideshow,
          disabledThumbnails,
          disabledFullscreen,
          disabledDownload
        })}
        on={{
          view: ({index}) => {
            if (onGetCurrentIndex) {
              onGetCurrentIndex(index);
            }
          },
          load: ({ index, zoomIn, zoomOut, zoom, maxZoom }) => {
            // Update maxZoom when the image is loaded
            maxZoom(5);
          },
          // zoom: (currentZoom, maxZoom) => {
          //   // Set initial zoom level (1) and max zoom level (5)
          //   currentZoom(1);
          //   maxZoom(5);
          // },
        }}
        toolbar={{
          buttons: [
            <DisplayTotal
              key={0}
              totalItems={totalItems}
              disabledTotal={disabledTotal}
              disabledCaptions={disabledCaptions}
            />,
            'close',
          ],
        }}
        render={{
          
          iconLoading:  () => <Iconify width={50} color='#fff' icon="line-md:downloading-loop" />,
          iconClose: () => <Iconify width={ICON_SIZE} icon="solar:close-square-linear" />,
          iconDownload: () => <Iconify width={ICON_SIZE} icon="solar:download-square-linear" />,
          iconZoomIn: () => <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-in-outline" />,
          iconZoomOut: () => <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-out-outline" />,
          iconSlideshowPlay: () => <Iconify width={ICON_SIZE} icon="solar:play-line-duotone" />,
          iconSlideshowPause: () => <Iconify width={ICON_SIZE} icon="solar:pause-line-duotone" />,
          iconPrev: () => <Iconify width={ICON_SIZE + 8} icon="solar:alt-arrow-left-bold-duotone" />,
          iconNext: () => <Iconify width={ICON_SIZE + 8} icon="solar:alt-arrow-right-bold-duotone" />,
          iconExitFullscreen: () => <Iconify width={ICON_SIZE} icon="solar:quit-full-screen-square-linear" />,
          iconEnterFullscreen: () => <Iconify width={ICON_SIZE} icon="solar:full-screen-square-linear" />,
          // buttonZoom: (buttonZoom) => {
          //   // buttonZoom.maxZoom=10;
          //   const { zoomIn, zoomOut, zoom, maxZoom } = buttonZoom; 
          //   console.log('zoom Button', buttonZoom)
          //   return (
          //     <>
          //       <button type="button" className="yarl__button" onClick={() => zoomIn(zoom * maxZoom)}>
          //         <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-in-outline" />
          //       </button>
          //       <button type="button" className="yarl__button" onClick={() => zoomOut(zoom / maxZoom)}>
          //         <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-out-outline" />
          //       </button>
          //     </>
          //   );
          // },
          slide:(_this)=>{
            const {slide, offset, rect, zoom, maxZoom} = _this;
            let _slide = <Iconify width={100} color='#fff' icon="line-md:downloading-loop" />;
            if (slide?.isLoaded) {
              _slide = <img src={slide?.src} alt="tatatta" style={{maxHeight: '100%'}}/>;
            }
            return _slide;
          }
        }}
        {...other}
      />
    </>
  );
}

// ----------------------------------------------------------------------

export function getPlugins({
  disabledZoom,
  disabledVideo,
  disabledCaptions,
  disabledSlideshow,
  disabledThumbnails,
  disabledFullscreen,
  disabledDownload,
}) {
  let plugins = [Thumbnails, Captions, Fullscreen, Slideshow, Zoom, Video, Download];

  if (disabledThumbnails) {
    plugins = plugins.filter((plugin) => plugin !== Thumbnails);
  }
  if (disabledCaptions) {
    plugins = plugins.filter((plugin) => plugin !== Captions);
  }
  if (disabledFullscreen) {
    plugins = plugins.filter((plugin) => plugin !== Fullscreen);
  }
  if (disabledSlideshow) {
    plugins = plugins.filter((plugin) => plugin !== Slideshow);
  }
  if (disabledZoom) {
    plugins = plugins.filter((plugin) => plugin !== Zoom);
  }
  if (disabledVideo) {
    plugins = plugins.filter((plugin) => plugin !== Video);
  }
  if (disabledDownload) {
    plugins = plugins.filter((plugin) => plugin !== Download);
  }

  return plugins;
}

// ----------------------------------------------------------------------

DisplayTotal.propTypes = {
  disabledCaptions: PropTypes.bool,
  disabledTotal: PropTypes.bool,
  totalItems: PropTypes.number,
};

export function DisplayTotal({ totalItems, disabledTotal, disabledCaptions }) {
  const { state } = useLightboxState();
  const { currentIndex } = state;

  if (disabledTotal) {
    return null;
  }

  return (
    <Typography
      className="yarl__button"
      sx={{
        position: 'fixed',
        typography: 'body2',
        alignSelf:'center',
        ...(!disabledCaptions && {
          px: 'unset',
          minWidth: 64,
          position: 'unset',
          textAlign: 'center',
        }),
      }}
    >
      <strong> {currentIndex + 1} </strong> / {totalItems}
    </Typography>
  );
}
