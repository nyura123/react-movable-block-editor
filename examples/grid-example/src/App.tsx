import React, { useRef } from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/styles';

import {
  BlockEditor,
  onDragStart,
  focusNode,
  update,
  BlockEditorControl,
  defaultRenderEditBlock,
  BlockEditorValue,
  BlockProps,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';

import { CustomEditorToolBar, addGrid } from './CustomEditorToolBar';
import { ResizableBox } from 'react-resizable';

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
    rootNodeId: 'container1',
    undoStack: [],
    redoStack: [],
    byId: {
      container1: {
        id: 'container1',
        type: 'layer',
        name: 'container1',
        parentId: null, // root
        width: 500,
        height: 300,
        childrenIds: [],
      },
    },
  });

  useEffect(() => {
    setEditorState(
      addGrid(editorState, 'container1', {
        width: 500,
        height: 500,
        numCols: 3,
        numRows: 3,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <BlockEditorControl
        value={editorState}
        onChange={v => setEditorState(v)}
        UiComponent={CustomEditorToolBar}
        controlUiProps={{
          breadCrumbsProps: {
            navClassName: classes.breadcrumbNav,
            itemClassName: classes.breadcrumbItem,
          },
        }}
      />

      <div style={{ marginLeft: 10 }}>
        <BlockEditor
          renderEditBlock={myRenderEditBlock}
          value={editorState}
          onChange={setEditorState}
        />
      </div>
    </div>
  );
};

function renderMyGridCell(props: BlockProps) {
  return <MyContentCell {...props} />;
}

// Custom draggable cell block
const MyContentCell = (props: BlockProps) => {
  const selfRef = useRef(null);

  const getBoundingRect = () => {
    return selfRef &&
      selfRef.current &&
      (selfRef.current as any).getBoundingClientRect
      ? (selfRef.current as any).getBoundingClientRect()
      : null;
  };

  const childId = props.node.childrenIds && props.node.childrenIds[0];
  const childNode = childId ? props.value.byId[childId] : null;
  let childLayer = childNode && childNode.type === 'layer' ? childNode : null;

  return (
    <ResizableBox
      className="box"
      width={props.node.width}
      height={props.node.height}
      onResizeStart={event => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onResize={(_event, { size }) => {
        const { width, height } = size;
        props.onChange(update(props.value, props.node.id, { width, height }));
      }}
    >
      <div
        ref={selfRef}
        draggable
        onDragStart={e => onDragStart(e, props.node, getBoundingRect)}
        onClick={e => {
          e.stopPropagation();
          props.onChange(focusNode(props.value, props.node, true));
        }}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: props.node.backgroundColor || undefined,
          width: props.node.width,
          height: props.node.height,
          ...(props.value.focusedNodeId === props.node.id
            ? {
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: 'orange',
              }
            : {}),
        }}
      >
        {childLayer && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: childLayer.width,
              height: childLayer.height,
              backgroundColor: 'black',
            }}
          >
            {childLayer &&
              props.renderEditBlock({ ...props, node: childLayer })}
          </div>
        )}
        {props.node.value ? props.node.value.text : 'no text'}{' '}
      </div>
    </ResizableBox>
  );
};

function myRenderEditBlock(props: BlockProps) {
  const shouldRenderMyGridCell =
    props.node.value && props.node.value['type'] === 'myGridCell';

  const renderEditBlock = shouldRenderMyGridCell
    ? renderMyGridCell
    : defaultRenderEditBlock;

  return renderEditBlock(props);
}

export default App;
