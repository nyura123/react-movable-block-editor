import React, { useRef } from 'react';
import './App.css';

import {
  focusNode,
  defaultRenderEditBlock,
  defaultRenderPreviewBlock,
  update,
  BlockProps,
  onDragStart,
  PreviewProps,
  BlockEditorValue,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';

// Optional: code below is for custom blocks

function renderCustomEditBlock(props: BlockProps) {
  switch (props.node.customType) {
    case 'input':
      return (
        <MyEditInputBlock
          undoRedoVersion={props.undoRedoVersion}
          node={props.node}
          renderEditBlock={props.renderEditBlock}
          changeBlocks={props.changeBlocks}
          getNode={props.getNode}
          focusedNodeId={props.focusedNodeId}
        />
      );
    default:
      return <div>Unknown custom type {props.node.customType}</div>;
  }
}

function renderCustomPreviewBlock(props: PreviewProps) {
  switch (props.node.customType) {
    case 'input':
      return (
        <MyPreviewInputBlock
          key={props.node.id}
          node={props.node}
          renderPreviewBlock={props.renderPreviewBlock}
          byId={props.byId}
        />
      );
    default:
      return <div>Unknown custom type {props.node.customType}</div>;
  }
}

export function myRenderEditBlock({
  node,
  renderEditBlock,
  getNode,
  undoRedoVersion,
  changeBlocks,
  focusedNodeId,
}: BlockProps) {
  switch (node.type as any) {
    case 'custom':
      return renderCustomEditBlock({
        node,
        undoRedoVersion,
        renderEditBlock,
        getNode,
        changeBlocks,
        focusedNodeId,
      });
    default:
      return defaultRenderEditBlock({
        node,
        undoRedoVersion,
        renderEditBlock,
        getNode,
        changeBlocks,
        focusedNodeId,
      });
  }
}

export function myRenderPreviewBlock({
  node,
  byId,
  renderPreviewBlock,
}: PreviewProps) {
  switch (node.type as any) {
    case 'custom':
      return renderCustomPreviewBlock({
        node,
        renderPreviewBlock,
        byId,
      });
    default:
      return defaultRenderPreviewBlock({
        byId,
        renderPreviewBlock,
        node,
      });
  }
}

// Custom draggable input block
const MyEditInputBlock = (props: BlockProps) => {
  const selfRef = useRef(null);

  const getBoundingRect = () => {
    return selfRef &&
      selfRef.current &&
      (selfRef.current as any).getBoundingClientRect
      ? (selfRef.current as any).getBoundingClientRect()
      : null;
  };

  return (
    <div
      ref={selfRef}
      draggable
      onDragStart={e => onDragStart(e, props.node, getBoundingRect)}
      onClick={e => {
        e.stopPropagation();
        props.changeBlocks((value: BlockEditorValue) =>
          focusNode(value, props.node, true)
        );
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'lightpink',
        width: props.node.width,
        height: props.node.height,
        ...(props.focusedNodeId === props.node.id
          ? {
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: 'orange',
            }
          : {}),
      }}
    >
      <input
        onChange={e => {
          // what you type in the input editor is what the placeholder will be
          props.changeBlocks(value =>
            update(value, props.node.id, { value: e.target.value })
          );
        }}
        placeholder="edit placeholder"
        value={props.node.value || ''}
      />
    </div>
  );
};

const MyPreviewInputBlock = (props: PreviewProps) => {
  return (
    <input
      style={{ width: props.node.width, height: props.node.height }}
      placeholder={props.node.value}
    />
  );
};
