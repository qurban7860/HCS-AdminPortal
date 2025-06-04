import PropTypes from 'prop-types';
import '../../utils/highlight';

import ReactQuill from 'react-quill';
import { Box, Typography, useTheme, alpha } from '@mui/material';

import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';

// ----------------------------------------------------------------

Editor.propTypes = {
  id: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  simple: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helperText: PropTypes.object,
  label: PropTypes.string,
  isEditor: PropTypes.bool, 
  readOnly: PropTypes.bool,
  hideToolbar: PropTypes.bool,
  isFocused: PropTypes.bool,
  setIsFocused: PropTypes.func,
};

export default function Editor({
  id = 'minimal-quill',
  error,
  value,
  onChange,
  simple = false,
  helperText,
  sx,
  label,
  isEditor = false, 
  readOnly = false,
  hideToolbar = false,
  isFocused = false,
  setIsFocused = () => {},
  ...other
}) { 
  const theme = useTheme();

  const modules = {
    toolbar: hideToolbar ? false : { container: `#${id}` },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  const handleFocus = () => {
    if (isEditor) setIsFocused(true);
  };

  if (isEditor && !isFocused) {
    return (
      <StyledEditor
        sx={{
          ...(error && {
            border: `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
          border: 'none',
          '& .ql-container': {
            border: 'none',
            ...theme.typography.body1,
            fontFamily: theme.typography.fontFamily,
          },
          '& .ql-editor': {
            minHeight: 'auto',
            paddingLeft: 1,
            cursor: 'pointer',
            '&.ql-blank::before': {
              fontStyle: 'normal',
              color: theme.palette.text.disabled,
            },
          },
          '& .ql-toolbar': {
            display: 'none',
          },
          backgroundColor: alpha(theme.palette.grey[500], 0.08), 
        }}
        onClick={handleFocus} 
      >
        <ReactQuill
          value={value}
          readOnly 
          modules={{ toolbar: false }} 
          formats={formats}
          {...other}
        />
        {helperText && helperText}
      </StyledEditor>
    );
  }

  return (
    <>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {label && (
          <Typography variant="subtitle2" sx={{ ml: 1, mb: -2, mt: -1 }}>
            {label}
          </Typography>
        )}
      </Box>
      <StyledEditor
        sx={{
          ...(error && {
            border: `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
        readOnly={readOnly}
        hideToolbar={hideToolbar}
      >
        {!hideToolbar && <EditorToolbar id={id} isSimple={simple} />}

        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          onFocus={handleFocus} 
          // placeholder="Write something here..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}