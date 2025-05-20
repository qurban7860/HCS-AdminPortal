import PropTypes from 'prop-types';
import '../../utils/highlight';
import ReactQuill from 'react-quill';
import { Box, Typography } from '@mui/material';
//
import { StyledEditor } from './styles';
import EditorToolbar, { formats } from './EditorToolbar';

// ----------------------------------------------------------------------

Editor.propTypes = {
  id: PropTypes.string,
  sx: PropTypes.object,
  error: PropTypes.bool,
  simple: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  helperText: PropTypes.object,
  label: PropTypes.string,
  readOnly: PropTypes.bool,      
  hideToolbar: PropTypes.bool,
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
  readOnly = false,
  hideToolbar = false,
  ...other
}) {
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
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
          }),
          ...sx,
        }}
      >
         {!hideToolbar && <EditorToolbar id={id} isSimple={simple} />}

        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          // placeholder="Write something here..."
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}
