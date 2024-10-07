import PropTypes from 'prop-types';
import { langs } from '@uiw/codemirror-extensions-langs';
import { search } from '@codemirror/search';
import { Grid, Typography, Box } from '@mui/material';
import CodeMirrorMerge from 'react-codemirror-merge';
import './style.css';
import ViewFormAuditBlock from '../ViewForms/ViewFormAuditBlock';

const { Original } = CodeMirrorMerge;
const { Modified } = CodeMirrorMerge;

JsonEditorMerge.propTypes = {
  isLoadingOriginal: PropTypes.bool,
  isLoadingModified: PropTypes.bool,
  value: PropTypes.object,
  modifiedValue: PropTypes.object,
  HandleChangeIniJson: PropTypes.func,
  readOnly: PropTypes.bool,
};

function JsonEditorMerge({ isLoadingOriginal, value, isLoadingModified, modifiedValue, HandleChangeIniJson, readOnly }) {

  return  (<Grid sx={{p:1 }}>
            <Typography variant='subtitle2' display="flex" alignItems="center">Note: <Typography variant='caption' sx={{ml:1}}> Ctrl + F / Cmd + F to find text in Code Editer</Typography></Typography>
              <div>
                <CodeMirrorMerge  >
                    <Original
                      readOnly
                      value={JSON.stringify( isLoadingOriginal && !value?.configuration ? 'Loading...' : value?.configuration, null, 2)}
                      extensions={[langs.json(), search({ top: true, searchPanelOpen: true })]}
                    />
                    <Modified
                      readOnly
                      value={JSON.stringify( isLoadingModified && !modifiedValue?.configuration ? 'Loading...' : modifiedValue?.configuration , null, 2)}
                      extensions={[langs.json(), search({ top: true, searchPanelOpen: true })]}
                    />
                </CodeMirrorMerge>
              </div>
            <Box
              columnGap={2} display="grid"
              gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
            >
              {value && <ViewFormAuditBlock  defaultValues={value} />}
              {modifiedValue && <ViewFormAuditBlock  defaultValues={modifiedValue} />}
            </Box>
          </Grid>)
} 

export default JsonEditorMerge;