import React from 'react';
import { useState } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';

import {
  BlockEditor,
  Preview,
  BlockEditorControl,
  BlockEditorValue,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';

// Optional
import { CustomEditorToolBar } from './CustomEditorToolBar';
import { myRenderEditBlock, myRenderPreviewBlock } from './CustomBlocks';

// optional: customize BreadCrumbs classes
const useStyles = makeStyles((theme: any) => ({
  paper: {
    backgroundColor: 'white',
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '60%',
    padding: 20,
  },
  breadcrumbNav: {
    display: 'flex',
    listStyleType: 'none',
    backgroundColor: '#f5f5f5',
    padding: 10,
    flexDirection: 'row',
  },
  breadcrumbItem: {
    cursor: 'pointer',
    '&::before': { content: '"  /  "' },
    marginRight: 5,
  },
}));

const App: React.FC = () => {
  const classes = useStyles();

  const [editorState, setEditorState] = useState<BlockEditorValue>({
    copiedNode: null,
    focusedNodeId: null,
    undoRedoVersion: 1,
    undoStack: [],
    redoStack: [],
    byId: {
      container1: {
        id: 'container1',
        type: 'col',
        name: 'container1',
        parentId: undefined, // root
        width: 500,
        height: 300,
        childrenIds: ['layer1'],
      },
      layer1: {
        id: 'layer1',
        type: 'layer',
        name: 'layer1',
        parentId: 'container1',
        width: 510,
        height: 310,
        childrenIds: ['content', 'image1', 'row1'],
      },
      input1: {
        id: 'input1',
        type: 'custom',
        customType: 'input',
        name: 'input1',
        value: 'First Name',
        parentId: 'row1',
        width: 100,
        height: 40,
        childrenIds: [],
      },
      input2: {
        id: 'input2',
        type: 'custom',
        customType: 'input',
        name: 'input2',
        parentId: 'row1',
        value: 'Last Name',
        width: 100,
        height: 40,
        childrenIds: [],
      },
      image1: {
        id: 'image1',
        type: 'image',
        name: 'image1',
        parentId: 'layer1',
        width: 200,
        height: 200,
        top: 0,
        left: 280,
        value: 'http://lorempixel.com/200/200/',
        childrenIds: [],
      },
      content: {
        id: 'content',
        type: 'markdown',
        name: 'content',
        parentId: 'layer1',
        width: 240,
        height: 230,
        top: 0,
        left: 16,
        value: `### Content 
> QUOTE
> 
> GOES
> 
> HERE`,
        childrenIds: [],
      },
      row1: {
        id: 'row1',
        type: 'row',
        name: 'row1',
        parentId: 'layer1',
        width: 210,
        height: 60,
        top: 230,
        left: 270,
        childrenIds: ['input1', 'input2'],
      },
    },
    rootNodeId: 'container1',
  });

  const [showLoadJsonModal, setShowLoadJsonModal] = useState<boolean>(false);
  const [showViewJsonModal, setShowViewJsonModal] = useState<boolean>(false);
  const [inputJson, setInputJson] = useState<string>('');

  const loadFromJson = () => {
    try {
      setEditorState(JSON.parse(inputJson));
      setShowLoadJsonModal(false);
    } catch (e) {
      console.error('Error loading from json', e);
      alert('Error loading from json: ' + e);
    }
  };

  const rootNode = editorState.byId[editorState.rootNodeId];

  if (!rootNode) {
    return <div>Error: no root node (id={editorState.rootNodeId})</div>;
  }

  return (
    <div>
      <Button onClick={() => setShowLoadJsonModal(true)}>Load from json</Button>
      <Button onClick={() => setShowViewJsonModal(true)}>View json</Button>
      <BlockEditorControl
        value={editorState}
        onChange={v => (console.log('VAL', v) as any) || setEditorState(v)}
        UiComponent={CustomEditorToolBar}
        controlUiProps={{
          breadCrumbsProps: {
            navClassName: classes.breadcrumbNav,
            itemClassName: classes.breadcrumbItem,
          },
        }}
      />

      <Grid container spacing={3}>
        <Grid item md={6}>
          <div style={{ marginLeft: 10 }}>
            <BlockEditor
              renderEditBlock={myRenderEditBlock}
              value={editorState}
              onChange={setEditorState}
            />
          </div>
        </Grid>
        <Grid item md={6}>
          <div
            style={{ marginRight: 10, borderWidth: 1, borderStyle: 'dashed' }}
          >
            <Preview
              byId={editorState.byId}
              renderPreviewBlock={myRenderPreviewBlock}
              node={rootNode}
            />
          </div>
        </Grid>
      </Grid>
      <Modal
        aria-labelledby="view-json"
        aria-describedby="view-json"
        open={showViewJsonModal}
        onClose={() => setShowViewJsonModal(false)}
      >
        <div className={classes.paper}>
          <Button onClick={() => setShowViewJsonModal(false)}>Done</Button>
          <div>json:</div>
          <div>{JSON.stringify(editorState)}</div>
        </div>
      </Modal>
      <Modal
        aria-labelledby="load-from-json"
        aria-describedby="load-from-json"
        open={showLoadJsonModal}
        onClose={loadFromJson}
      >
        <div className={classes.paper}>
          <Button onClick={loadFromJson}>Load</Button>
          <Button onClick={() => setShowLoadJsonModal(false)}>Cancel</Button>
          <div>json:</div>
          <br />
          <textarea
            style={{ height: 200, width: '100%' }}
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
          >
            {JSON.stringify(editorState, null, 2)}
          </textarea>
        </div>
      </Modal>
    </div>
  );
};

export default App;
