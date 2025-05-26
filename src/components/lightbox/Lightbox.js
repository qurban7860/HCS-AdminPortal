/* eslint-disable import/no-unresolved */
import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactLightbox, { ImageSlide } from 'yet-another-react-lightbox';
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

const ICON_SIZE = 30;

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
  ...other
}) {
  const totalItems = slides ? slides.length : 0;
  const [transitionTime, setTransitionTime] = useState(0.5);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotateDeg, setRotateDeg] = useState(0);
  const [navigation, setNavigation] = useState(false);

  const handleZoomIn = () => {
    setTransitionTime(0.5);
    if (zoomLevel < 5) {
      setZoomLevel(zoomLevel + 1); // Increase the zoom level by 0.1 (adjust as needed)
    }
  };

  const handleZoomOut = () => {
    setTransitionTime(0.5);
    if (zoomLevel > 1) {
      setZoomLevel(zoomLevel - 1); // Decrease the zoom level by 0.1 (adjust as needed)
    }
  };

  const handleRotation = () => {
    setTransitionTime(0.5);
    setRotateDeg(rotateDeg + 90) // Decrease the zoom level by 0.1 (adjust as needed)
  };

  return (
    <>
      <StyledLightbox />

      <ReactLightbox
        slides={slides}
        animation={{ swipe: 240, zoom: 0.5 }}
        carousel={{ finite: true }}
        // controller={{ closeOnBackdropClick: navigation }}
        plugins={getPlugins({
          disabledZoom,
          disabledVideo,
          disabledCaptions,
          disabledSlideshow,
          disabledThumbnails,
          disabledFullscreen,
          disabledDownload
        })}

        video={{
          controls: true,
          playsInline: true,
          autoPlay: true,
          loop: true,
          muted: true,
          preload: 'auto',
        }}

        on={{
          view: async ({ index }) => {
            setTransitionTime(0);
            setZoomLevel(1);
            setRotateDeg(0);
            await setNavigation(false);

            if (onGetCurrentIndex) {
              await onGetCurrentIndex(index);
              await setNavigation(true);
            }

          },
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
          iconLoading: () => <Iconify width={ICON_SIZE} color='#fff' icon="line-md:downloading-loop" />,
          iconClose: () => <Iconify width={ICON_SIZE} icon="solar:close-square-linear" />,
          iconDownload: () => <Iconify width={ICON_SIZE} icon="solar:download-square-linear" />,
          iconZoomIn: () => <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-in-outline" />,
          iconZoomOut: () => <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-out-outline" />,
          iconSlideshowPlay: () => <Iconify width={ICON_SIZE} icon="solar:play-line-duotone" />,
          iconSlideshowPause: () => <Iconify width={ICON_SIZE} icon="solar:pause-line-duotone" />,
          iconPrev: () => <Iconify width={ICON_SIZE + 20} icon="solar:round-arrow-left-bold" />,
          iconNext: () => <Iconify width={ICON_SIZE + 20} icon="solar:round-arrow-right-bold" />,
          iconExitFullscreen: () => <Iconify width={ICON_SIZE} icon="solar:quit-full-screen-square-linear" />,
          iconEnterFullscreen: () => <Iconify width={ICON_SIZE} icon="solar:full-screen-square-linear" />,
          buttonPrev: !navigation || totalItems === 1 ? () =>
            <button disabled type="button" className="yarl__button yarl__navigation_prev" >
              <Iconify width={ICON_SIZE + 20} icon="solar:round-arrow-left-bold" />
            </button> : undefined,
          buttonNext: !navigation || totalItems === 1 ? () =>
            <button disabled type="button" className="yarl__button yarl__navigation_next" >
              <Iconify width={ICON_SIZE + 20} icon="solar:round-arrow-right-bold" />
            </button> : undefined,
          buttonZoom: () =>
            <>
              <button type="button" className="yarl__button" onClick={handleZoomIn}>
                <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-in-outline" />
              </button>
              <button type="button" className="yarl__button" onClick={handleZoomOut}>
                <Iconify width={ICON_SIZE} icon="solar:magnifer-zoom-out-outline" />
              </button>

              <button type="button" className="yarl__button" onClick={handleRotation}>
                <Iconify width={ICON_SIZE} icon="solar:smartphone-rotate-2-broken" />
              </button>
            </>
          ,
          slide: ({ slide }) => <LightboxSlide slide={slide} transitionTime={transitionTime} zoomLevel={zoomLevel} rotateDeg={rotateDeg} />,
          thumbnail: ({ slide }) => <img src={slide?.src} alt="Thumbnail" />,
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
        alignSelf: 'center',
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

LightboxSlide.propTypes = {
  slide: PropTypes.object,
  transitionTime: PropTypes.number,
  zoomLevel: PropTypes.number,
  rotateDeg: PropTypes.number
};

export function LightboxSlide({ slide, transitionTime, zoomLevel, rotateDeg }) {

  return slide?.isLoaded ? (

    <ImageSlide
      style={{
        maxHeight: '100%',
        marginTop: 100,
        transitionDuration: `${transitionTime}s`,
        transform: `scale(${zoomLevel}) rotate(${rotateDeg}deg)`
      }}
      slide={slide}
    />
  ) : (
    <Iconify width={100} color='#fff' icon="line-md:downloading-loop" />
  );
}
