import React, { useState, useRef } from 'react';
import {
  parseTypes,
  getDragPositionRelativeToTarget,
  onDragStart,
  onDropped,
} from '../../utils/dragHelpers';

// import { useDrag } from 'react-dnd';

import { BlockProps } from './BlockProps';

type WantToPlaceNext = 'left' | 'right' | 'firstChild' | 'lastChild' | null;

export interface DraggableColBlockState {
  wantToPlaceNext: 'left' | 'right' | 'firstChild' | 'lastChild' | null;
}

export const DraggableColBlock: React.FC<BlockProps> = props => {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const [wantToPlaceNext, setWantToPlaceNext] = useState<WantToPlaceNext>(null);

  const getBoundingRect = () => {
    return selfRef.current && selfRef.current.getBoundingClientRect
      ? selfRef.current.getBoundingClientRect()
      : null;
  };

  const canDrop = (types: Array<string>) => {
    const { getNode, node } = props;
    const parentNode = node.parentId ? getNode(node.parentId) : null;
    const { draggedNodeType } = parseTypes(types);
    return (
      // if our parent is a row, allow to place a sibling(col) before/after us
      (draggedNodeType === 'col' && parentNode && parentNode.type === 'row') ||
      // if we have children, we don't know if they can handle drops
      (!props.children &&
        (draggedNodeType === 'row' ||
          draggedNodeType === 'markdown' ||
          draggedNodeType === 'image' ||
          draggedNodeType === 'layer' ||
          draggedNodeType === 'custom'))
    );
  };

  const shouldPlaceBefore = (
    e: React.DragEvent<HTMLDivElement>,
    axis: 'y' | 'x'
  ) => {
    // geometry: figure out whether the dragged element should go after us or before us
    const relativeDraggedPosition = getDragPositionRelativeToTarget(
      e,
      getBoundingRect()
    );
    const placeBefore =
      relativeDraggedPosition &&
      (axis === 'y'
        ? relativeDraggedPosition.top / relativeDraggedPosition.height < 0.45
        : relativeDraggedPosition.left / relativeDraggedPosition.width < 0.45);
    return placeBefore;
  };

  const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    isPlaceHolder = false
  ) => {
    if (!canDrop(e.dataTransfer.types as Array<string>)) {
      return;
    }

    e.stopPropagation();

    if (!isPlaceHolder && wantToPlaceNext !== null) {
      setWantToPlaceNext(null);
    }

    const { draggedNodeId, draggedNodeType } = parseTypes(e.dataTransfer
      .types as Array<string>);

    if (draggedNodeId) {
      if (draggedNodeType === 'col') {
        // geometry: figure out whether the dragged element should go after us or before us in parent container
        const placeBefore = shouldPlaceBefore(e, 'x');
        const anchorOpts = placeBefore
          ? { beforeItemId: props.node.id }
          : { afterItemId: props.node.id };

        props.changeBlocks(
          onDropped(
            e.dataTransfer.types as Array<string>,
            props.node.parentId || '', // col over col -> place in parent container
            { ...anchorOpts, isPlaceHolder }
          )
        );
      } else {
        const placeBefore = shouldPlaceBefore(e, 'y');
        const { childrenIds } = props.node;
        const numChildren = childrenIds.length;
        const anchorOpts = numChildren
          ? placeBefore
            ? { beforeItemId: childrenIds[0] }
            : { afterItemId: childrenIds[numChildren - 1] }
          : null;

        props.changeBlocks(
          onDropped(
            e.dataTransfer.types as Array<string>,
            props.node.id, // row or other over col -> place in this col
            {
              isPlaceHolder,
              ...anchorOpts,
            } // place in front of first child
          )
        );
      }
    }
  };

  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (canDrop(e.dataTransfer.types as Array<string>)) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      return;
    }

    const { draggedNodeType } = parseTypes(e.dataTransfer.types as Array<
      string
    >);

    if (draggedNodeType === 'col') {
      const placeBefore = shouldPlaceBefore(e, 'x');
      if (placeBefore && wantToPlaceNext !== 'left') {
        setWantToPlaceNext('left');
      } else if (!placeBefore && wantToPlaceNext !== 'right') {
        setWantToPlaceNext('right');
      }
    } else {
      const placeBefore = shouldPlaceBefore(e, 'y');
      setWantToPlaceNext(placeBefore ? 'firstChild' : 'lastChild');
    }
  };

  const onDragLeave = (_e: React.DragEvent<HTMLDivElement>) => {
    if (wantToPlaceNext !== null) {
      setWantToPlaceNext(null);
    }
  };

  const renderChild = (nodeId: string) => {
    const {
      getNode,
      changeBlocks,
      undoRedoVersion,
      focusedNodeId,
      renderEditBlock,
    } = props;
    const node = getNode(nodeId);
    if (!node) return null;
    return renderEditBlock({
      node,
      undoRedoVersion,
      renderEditBlock,
      focusedNodeId,
      changeBlocks,
      getNode,
    });
  };

  const { children: reactChildren } = props;

  const { node, getNode } = props;

  const { childrenIds } = node;

  const firstChildPlaceholderHeight = 3;
  let runningHeight =
    wantToPlaceNext === 'firstChild' ? firstChildPlaceholderHeight : 0;

  return (
    <div
      key={'col_' + node.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
      }}
    >
      {wantToPlaceNext === 'left' && (
        <div
          style={{
            height: '100%',
            width: 3,
            backgroundColor: 'white',
          }}
        />
      )}
      <div
        ref={selfRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        draggable
        onDragStart={e => onDragStart(e, props.node, getBoundingRect)}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          backgroundColor: props.node.isPlaceHolder
            ? 'grey'
            : props.node.backgroundColor || '#ffffffa8',
          borderStyle: 'solid',
          borderWidth: 1,
        }}
      >
        {wantToPlaceNext === 'firstChild' && (
          <div
            style={{
              height: 10,
              width: '100%',
              backgroundColor: 'blue',
            }}
          />
        )}
        {React.Children.count(reactChildren)
          ? reactChildren
          : childrenIds.map(childId => {
              const row = getNode(childId);
              if (!row) return null;
              const res = (
                <div
                  className="drag-node"
                  key={'node_' + childId}
                  style={{
                    position: 'absolute',
                    width: row.width,
                    height: row.height,
                    top: 0,
                    left: 0,
                    transform: `translate(0,${runningHeight}px)`,
                  }}
                >
                  {renderChild(childId)}
                </div>
              );
              runningHeight += row.height;
              return res;
            })}
        {wantToPlaceNext === 'lastChild' && (
          <div
            style={{
              top: 0,
              left: 0,
              transform: `translate(0,${runningHeight}px)`,
              position: 'absolute',
              height: 10,
              width: '100%',
              backgroundColor: 'orange',
            }}
          />
        )}
      </div>
      {wantToPlaceNext === 'right' && (
        <div
          style={{
            height: '100%',
            width: 3,
            backgroundColor: 'white',
          }}
        />
      )}
    </div>
  );
};
