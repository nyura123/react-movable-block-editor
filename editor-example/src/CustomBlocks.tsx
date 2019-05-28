import React, { useRef } from 'react';
import './App.css';

import {
  focusNode,
  defaultRenderEditBlock,
  defaultRenderPreviewBlock,
  update,
  onDragStart,
  PreviewProps,
} from 'react-movable-block-editor';
import 'react-movable-block-editor/css/drag.css';
import 'react-resizable/css/styles.css';
import { CustomEditorToolBar } from './CustomEditorToolBar';
import { BlockProps } from '../../dist/components/blocks/BlockProps';

// Optional: code below is for custom blocks

function renderCustomEditBlock(props: BlockProps) {
  switch (props.node.customType) {
    case 'input':
      return (
        <MyEditInputBlock
          node={props.node}
          renderEditBlock={props.renderEditBlock}
          value={props.value}
          onChange={props.onChange}
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
  value,
  onChange,
}: BlockProps) {
  switch (node.type as any) {
    case 'custom':
      return renderCustomEditBlock({ node, renderEditBlock, value, onChange });
    default:
      return defaultRenderEditBlock({ node, renderEditBlock, value, onChange });
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
        props.onChange(focusNode(props.value, props.node, true));
      }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'lightpink',
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
      <input
        onChange={e => {
          // what you type in the input editor is what the placeholder will be
          props.onChange(
            update(props.value, props.node.id, { value: e.target.value })
          );
        }}
        placeholder="edit placeholder"
        value={props.node.value || ''}
      />
    </div>
  );
};

const MyPreviewInputBlock = (props: PreviewProps) => {
  return <input placeholder={props.node.value} />;
};
