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
    focusedNodeId: 'layer1',
    byId: {
      container1: {
        id: 'container1',
        type: 'col',
        name: 'container1',
        parentId: null, // root
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
        childrenIds: ['title', 'subheading', 'content', 'image1', 'row1'],
      },
      title: {
        id: 'title',
        type: 'markdown',
        name: 'title',
        parentId: 'layer1',
        color: '#4A90E2',
        backgroundColor: '#E9E9E9',
        width: 450,
        height: 30,
        top: -10,
        left: 10,
        value: '## Title',
        childrenIds: [],
      },
      subheading: {
        id: 'subheading',
        type: 'markdown',
        name: 'subheading',
        parentId: 'layer1',
        width: 450,
        height: 40,
        top: 30,
        left: 10,
        value: '#### Subheading',
        childrenIds: [],
      },
      image1: {
        id: 'image1',
        type: 'image',
        name: 'image1',
        parentId: 'layer1',
        width: 200,
        height: 200,
        top: 90,
        left: 10,
        value: 'http://lorempixel.com/200/200/',
        childrenIds: [],
      },
      content: {
        id: 'content',
        type: 'markdown',
        name: 'content',
        parentId: 'layer1',
        width: 240,
        height: 40,
        top: 90,
        left: 220,
        value: '### Content',
        childrenIds: [],
      },
      row1: {
        id: 'row1',
        type: 'row',
        name: 'row1',
        parentId: 'layer1',
        width: 240,
        height: 40,
        top: 230,
        left: 220,
        childrenIds: [],
      },
    },
    rootNodeId: 'container1',
  });

  return (
    <div>
      <BlockEditorControl
        value={editorState}
        onChange={v => (console.log('VAL', v) as any) || setEditorState(v)}
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
