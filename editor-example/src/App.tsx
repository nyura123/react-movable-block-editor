import React from 'react';
import { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { makeStyles } from '@material-ui/styles';

import {
  BlockEditor,
  Preview,
  BlockEditorControl,
  BlockEditorValue,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';
import { MyEditorToolBar } from './EditorToolBar';

// optional: customize BreadCrumbs classes
const useStyles = makeStyles({
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
});

const App: React.FC = () => {
  const classes = useStyles();

  const [editorState, setEditorState] = useState<BlockEditorValue>({
    copiedNode: null,
    focusedNodeId: 'row1',
    byId: {
      container1: {
        id: 'container1',
        type: 'col',
        name: 'container1',
        parentId: null, // root
        width: 500,
        height: 300,
        childrenIds: ['row1'],
      },
      row1: {
        id: 'row1',
        type: 'row',
        name: 'row1',
        parentId: 'container1',
        width: 500,
        height: 150,
        childrenIds: [],
      },
    },
    rootNodeId: 'container1',
  });

  return (
    <div>
      <BlockEditorControl
        value={editorState}
        onChange={setEditorState}
        UiComponent={MyEditorToolBar}
        controlUiProps={{
          breadCrumbsProps: {
            navClassName: classes.breadcrumbNav,
            itemClassName: classes.breadcrumbItem,
          },
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <BlockEditor value={editorState} onChange={setEditorState} />
        <div style={{ marginLeft: 30, borderWidth: 1, borderStyle: 'dashed' }}>
          <Preview
            byId={editorState.byId}
            node={editorState.byId[editorState.rootNodeId]}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
