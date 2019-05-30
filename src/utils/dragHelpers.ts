import * as React from 'react';
import { BlockNode, BlockNodeType } from '../data';
import { BlockEditorValue } from '../components/editor/BlockEditorProps';
import { move } from '../components/editor/helpers';

export interface DraggedInfo {
  startLeft: number;
  startTop: number;
}

export function parseTypes(
  types: Array<string>
): {
  draggedNodeId: string;
  draggedNodeType: BlockNodeType | null;
} {
  const draggedNodeIds = types.filter(t => t.indexOf('draggednodeid:') === 0);
  const draggedNodeTypes = types.filter(
    t => t.indexOf('draggednodetype:') === 0
  );

  if (draggedNodeIds.length !== 1 || draggedNodeTypes.length !== 1) {
    return { draggedNodeId: 'notanode', draggedNodeType: null };
  }

  const draggedNodeId = draggedNodeIds[0].slice('draggednodeid:'.length);
  const draggedNodeType = draggedNodeTypes[0].slice(
    'draggednodetype:'.length
  ) as BlockNodeType;

  return { draggedNodeId, draggedNodeType };
}

export function getDragPositionRelativeToTarget(
  e: React.DragEvent<HTMLDivElement>,
  targetRect: ClientRect | null
) {
  if (!targetRect) return null;

  return {
    left: e.clientX - targetRect.left,
    top: e.clientY - targetRect.top,
    width: targetRect.width,
    height: targetRect.height,
  };
}

export function onDragStart(
  e: React.DragEvent<HTMLDivElement>,
  draggedNode: BlockNode,
  getBoundingRect: () => any
) {
  e.stopPropagation();
  const relativePos = getDragPositionRelativeToTarget(e, getBoundingRect());
  if (relativePos) {
    e.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        startLeft: relativePos.left,
        startTop: relativePos.top,
      } as DraggedInfo)
    );
  }
  e.dataTransfer.setData(`draggednodeid:${draggedNode.id}`, '');
  e.dataTransfer.setData(`draggednodetype:${draggedNode.type}`, '');
}

export interface MoveOpts {
  beforeItemId?: string;
  afterItemId?: string;
  isPlaceHolder?: boolean;
  absolutePos?: { left: number; top: number };
}

export function onDropped(
  types: Array<string>,
  targetNodeId: string,
  opts: MoveOpts = {}
) {
  const { draggedNodeId } = parseTypes(types);
  return (value: BlockEditorValue) =>
    move(value, draggedNodeId, targetNodeId, opts);
}
