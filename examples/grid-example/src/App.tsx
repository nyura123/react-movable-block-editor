import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';

import { makeStyles } from '@material-ui/styles';

import {
  BlockEditor,
  focusNode,
  update,
  BlockEditorControl,
  defaultRenderEditBlock,
  DraggableColBlock,
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
    undoRedoVersion: 1,
    rootNodeId: 'container1',
    undoStack: [],
    redoStack: [],
    byId: {
      container1: {
        id: 'container1',
        type: 'layer',
        name: 'container1',
        parentId: undefined, // root
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
  const childId = props.node.childrenIds && props.node.childrenIds[0];
  const childNode = childId ? props.getNode(childId) : null;

  // "sticky" area that accepts absolutely-positioned children
  let childLayer = childNode && childNode.type === 'layer' ? childNode : null;

  return (
    <div
      onClick={e => {
        e.stopPropagation();
        props.changeBlocks(value => focusNode(value, props.node));
      }}
      style={
        props.node.id === props.focusedNodeId
          ? { borderStyle: 'dashed', borderWidth: 1, borderColor: 'orange' }
          : {}
      }
    >
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
          props.changeBlocks(value =>
            update(value, props.node.id, { width, height })
          );
        }}
      >
        <DraggableColBlock
          key={'col_' + props.node.id}
          node={props.node}
          undoRedoVersion={props.undoRedoVersion}
          renderEditBlock={props.renderEditBlock}
          changeBlocks={props.changeBlocks}
          getNode={props.getNode}
          focusedNodeId={props.focusedNodeId}
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
          {props.node.value ? props.node.value.text : 'no text'}
        </DraggableColBlock>
      </ResizableBox>
    </div>
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
