import PropTypes from 'prop-types';
import { zebraStripes } from '@uiw/codemirror-extensions-zebra-stripes';
import { langs } from '@uiw/codemirror-extensions-langs';
import { search } from '@codemirror/search';
import { Grid, Typography } from '@mui/material';
import CodeMirrorMerge from 'react-codemirror-merge';
import './style.css';

const Original = CodeMirrorMerge.Original;
const Modified = CodeMirrorMerge.Modified;

JsonEditorMerge.propTypes = {
  value: PropTypes.object,
  modifiedValue: PropTypes.object,
  HandleChangeIniJson: PropTypes.func,
  readOnly: PropTypes.bool,
};

function JsonEditorMerge({value, modifiedValue, HandleChangeIniJson, readOnly }) {
  return  (<Grid>
            <Grid item md={12} sm={6} >
              <Typography variant='h6' >{ value?.backupid || '' }</Typography>
              <Typography variant='h6' >{ modifiedValue?.backupid || '' }</Typography>
            </Grid>
            <Typography variant='subtitle2' display="flex" alignItems="center">Note: <Typography variant='caption' sx={{ml:1}}> Ctrl + F / Cmd + F to find text in Code Editer</Typography></Typography>
              <div>
                <CodeMirrorMerge orientation="a-b" gutter highlightChanges  height="600px" // collapseUnchanged={{ margin: 3, minSize: 4 }}
                >
                  <Original 
                    readOnly
                    value={ JSON.stringify( value?.configuration, null, 2 ) }  
                    extensions={[ zebraStripes({ step: 2 }), langs.json(), search({top: true, searchPanelOpen: true }) ]} 
                  />
                  <Modified
                    readOnly
                    value={ JSON.stringify( modifiedValue?.configuration, null, 2 ) }
                    extensions={[ zebraStripes({ step: 2 }), langs.json(), search({top: true, searchPanelOpen: true }) ]} 
                  />
                </CodeMirrorMerge>
              </div>
          </Grid>)
} 

export default JsonEditorMerge;