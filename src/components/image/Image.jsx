import { useInView } from 'framer-motion';
import { useRef, useState, useCallback, startTransition } from 'react';
import PropTypes from 'prop-types';
import { imageClasses } from './classes';
import { ImageImg, ImageRoot, ImageOverlay, ImagePlaceholder } from './styles';

// ----------------------------------------------------------------------

const DEFAULT_DELAY = 0;
const DEFAULT_EFFECT = {
  style: 'blur',
  duration: 300,
  disabled: false,
};

Image.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.func,
  ]),
  src: PropTypes.string.isRequired,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  ratio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onLoad: PropTypes.func,
  effect: PropTypes.shape({
    style: PropTypes.string,
    duration: PropTypes.number,
    disabled: PropTypes.bool,
  }),
  alt: PropTypes.string,
  slotProps: PropTypes.shape({
    overlay: PropTypes.object,
    placeholder: PropTypes.object,
    img: PropTypes.object,
  }),
  className: PropTypes.string,
  viewportOptions: PropTypes.object,
  disablePlaceholder: PropTypes.bool,
  visibleByDefault: PropTypes.bool,
  delayTime: PropTypes.number,
};


export default function Image({
  sx,
  src,
  ref,
  ratio,
  onLoad,
  effect,
  alt = '',
  slotProps,
  className,
  viewportOptions,
  disablePlaceholder,
  visibleByDefault = false,
  delayTime = DEFAULT_DELAY,
  ...other
}) {
  const localRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const isInView = useInView(localRef, {
    once: true,
    ...viewportOptions,
  });

  const handleImageLoad = useCallback(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setIsLoaded(true);
        onLoad?.();
      });
    }, delayTime);

    return () => clearTimeout(timer);
  }, [delayTime, onLoad]);

  const finalEffect = {
    ...DEFAULT_EFFECT,
    ...effect,
  };

  const shouldRenderImage = visibleByDefault || isInView;
  const showPlaceholder = !visibleByDefault && !isLoaded && !disablePlaceholder;

  const renderComponents = {
    overlay: () =>
      slotProps?.overlay && (
        <ImageOverlay className={imageClasses.overlay} {...slotProps.overlay} />
      ),
    placeholder: () =>
      showPlaceholder && (
        <ImagePlaceholder className={imageClasses.placeholder} {...slotProps?.placeholder} />
      ),
    image: () => (
      <ImageImg
        src={src}
        alt={alt}
        onLoad={handleImageLoad}
        className={imageClasses.img}
        {...slotProps?.img}
      />
    ),
  };

  return (
    <ImageRoot
      ref={(node) => {
        if (typeof localRef === 'function') {
          localRef(node);
        } else if (localRef) {
          localRef.current = node;
        }

        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      effect={visibleByDefault || finalEffect.disabled ? undefined : finalEffect}
      className={[
        imageClasses.root,
        className,
        !visibleByDefault && isLoaded ? imageClasses.state.loaded : null,
      ].filter(Boolean).join(' ')}
      sx={[
        {
          '--aspect-ratio': ratio,
          ...(!!ratio && { width: 1 }),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {renderComponents.overlay()}
      {renderComponents.placeholder()}
      {shouldRenderImage && renderComponents.image()}
    </ImageRoot>
  );
}
