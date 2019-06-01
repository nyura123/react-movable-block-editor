import {
  ById,
  BlockNode,
  updateNode,
  removeNode,
  placeNodeInParent,
} from '../../data';
import { BlockEditorValue } from './BlockEditorProps';
const { cloneDeep } = require('lodash');

export function deepCopy(byId: ById, node: BlockNode): BlockNode {
  if (!node) return node;
  return {
    ...node,
    value: cloneDeep(node.value),
    childrenIds: [...node.childrenIds],
    children: node.childrenIds.map(id => deepCopy(byId, byId[id])),
  };
}

export function paste(value: BlockEditorValue): BlockEditorValue {
  const { byId } = value;
  let { copiedNode } = value ? value : { copiedNode: null };
  if (!copiedNode) return value;

  // support pasting same node multiple times - ensure childrenIds in each copy point to different arrays
  copiedNode = cloneDeep(copiedNode) as BlockNode;

  const { byId: newById } = pasteChild(byId, copiedNode);
  // add copied node to parent
  if (copiedNode.parentId) {
    const parentNode = byId[copiedNode.parentId];
    if (parentNode) {
      return {
        ...value,
        byId: placeNodeInParent(newById, copiedNode, copiedNode.parentId, {
          afterItemId:
            parentNode.childrenIds[parentNode.childrenIds.length - 1],
        }),
      };
    }
  }
  return value;
}

export function pasteChild(
  byId: ById,
  copiedNode: BlockNode
): { byId: ById; newId: string } {
  copiedNode.id = newBlockId(byId, copiedNode.type);
  const children = copiedNode.children;
  copiedNode.children = undefined;
  byId = { ...byId, [copiedNode.id]: copiedNode };
  if (children) {
    let idx = 0;
    for (const child of children) {
      child.parentId = copiedNode.id;
      const { byId: newById, newId: newChildId } = pasteChild(byId, child);
      copiedNode.childrenIds[idx] = newChildId;
      byId = newById;
      ++idx;
    }
  }
  return { byId, newId: copiedNode.id };
}

export function newBlockId(byId: ById, prefix = 'node') {
  //TODO better way to create uid
  let nextId = Object.keys(byId).length;
  while (!!byId[nextId]) nextId++;
  return prefix + '_' + nextId;
}

export function create(
  value: BlockEditorValue,
  props: Partial<BlockNode>
): BlockEditorValue {
  let { byId } = value;
  let nodeId = newBlockId(byId);
  const node = { ...byId[nodeId], ...props };
  return { ...value, byId: updateNode(byId, node) };
}

export function update(
  value: BlockEditorValue,
  nodeId: string,
  propsToUpdate: Partial<BlockNode>
): BlockEditorValue {
  let { byId } = value;
  const node = { ...byId[nodeId], ...propsToUpdate };
  return { ...value, byId: updateNode(byId, node) };
}

export function destroy(
  value: BlockEditorValue,
  nodeId: string
): BlockEditorValue {
  const { byId, rootNodeId, focusedNodeId } = value;
  if (rootNodeId === nodeId) {
    alert('Cannot destroy root node');
    return { ...value, byId, focusedNodeId };
  }
  return {
    ...value,
    byId: removeNode(byId, nodeId),
    focusedNodeId: focusedNodeId === nodeId ? null : focusedNodeId,
  };
}

export function move(
  value: BlockEditorValue,
  nodeId: string,
  targetParentId: string,
  opts: {
    beforeItemId?: string;
    afterItemId?: string;
    isPlaceHolder?: boolean;
    absolutePos?: { left: number; top: number };
  } = {}
): BlockEditorValue {
  if (!targetParentId) return value;

  const { byId } = value;
  const node = byId[nodeId];
  return {
    ...value,
    byId: placeNodeInParent(
      byId,
      {
        ...node,
        isPlaceHolder: opts.isPlaceHolder,
        ...(opts.absolutePos
          ? { top: opts.absolutePos.top, left: opts.absolutePos.left }
          : {}),
      },
      targetParentId,
      opts
    ),
  };
}

export function moveInDirection(
  value: BlockEditorValue,
  nodeId: string,
  moveOpts: {
    direction?: 'left' | 'right' | 'down' | 'up';
    distance?: number; // for absolute position moving (layer)
    stepPx?: number;
  } = {}
): BlockEditorValue {
  const { byId } = value;
  const node = byId[nodeId];
  if (!node) return value;
  const targetParentId = node.parentId;
  if (!targetParentId) return value; // sanity check
  const parentNode = byId[targetParentId];
  if (!parentNode) return value; // sanity check

  const grandParentNode = byId[parentNode.parentId];
  // if (!parentNode) return value; // sanity check

  const curPositionInParent = parentNode.childrenIds.indexOf(nodeId);
  if (curPositionInParent < 0) return value; // sanity check

  let opts: {
    beforeItemId?: string;
    afterItemId?: string;
    isPlaceHolder?: boolean;
    absolutePos?: { left: number; top: number };
  } = {};

  if (parentNode.type === 'row') {
    if (moveOpts.direction === 'left') {
      if (curPositionInParent === 0) return value;
      opts = { beforeItemId: parentNode.childrenIds[curPositionInParent - 1] };
    } else if (moveOpts.direction === 'right') {
      if (curPositionInParent >= parentNode.childrenIds.length - 1)
        return value;
      opts = { afterItemId: parentNode.childrenIds[curPositionInParent + 1] };
    } else {
      if (grandParentNode && grandParentNode.type === 'col') {
        const parentPositionInGrandparent = grandParentNode.childrenIds.indexOf(
          parentNode.id
        );
        if (parentPositionInGrandparent > 0 && moveOpts.direction === 'up') {
          // move to uncle (grandparent's other child)
          return move(
            value,
            nodeId,
            grandParentNode.childrenIds[parentPositionInGrandparent - 1]
          );
        } else if (
          parentPositionInGrandparent <
            grandParentNode.childrenIds.length - 1 &&
          moveOpts.direction === 'down'
        ) {
          return move(
            value,
            nodeId,
            grandParentNode.childrenIds[parentPositionInGrandparent + 1]
          );
        } else {
          return value;
        }
      } else {
        return value;
      }
    }
  } else if (parentNode.type === 'col') {
    if (moveOpts.direction === 'up') {
      if (curPositionInParent === 0) return value;
      opts = { beforeItemId: parentNode.childrenIds[curPositionInParent - 1] };
    } else if (moveOpts.direction === 'down') {
      if (curPositionInParent >= parentNode.childrenIds.length - 1)
        return value;
      opts = { afterItemId: parentNode.childrenIds[curPositionInParent + 1] };
    } else {
      if (grandParentNode && grandParentNode.type === 'row') {
        const parentPositionInGrandparent = grandParentNode.childrenIds.indexOf(
          parentNode.id
        );
        if (parentPositionInGrandparent > 0 && moveOpts.direction === 'left') {
          return move(
            value,
            nodeId,
            grandParentNode.childrenIds[parentPositionInGrandparent - 1]
          );
        } else if (
          parentPositionInGrandparent <
            grandParentNode.childrenIds.length - 1 &&
          moveOpts.direction === 'right'
        ) {
          // move to uncle (grandparent's other child)
          return move(
            value,
            nodeId,
            grandParentNode.childrenIds[parentPositionInGrandparent + 1]
          );
        } else {
          return value;
        }
      } else {
        return value;
      }
    }
  } else if (parentNode.type === 'layer') {
    // move by stepPx if inside layer
    const topDelta =
      (moveOpts.direction === 'up'
        ? -1
        : moveOpts.direction === 'down'
        ? 1
        : 0) * (moveOpts.stepPx || 1);
    const leftDelta =
      (moveOpts.direction === 'left'
        ? -1
        : moveOpts.direction === 'right'
        ? 1
        : 0) * (moveOpts.stepPx || 1);
    opts = {
      absolutePos: {
        top: (node.top || 0) + topDelta,
        left: (node.left || 0) + leftDelta,
      },
    };
  }

  return {
    ...value,
    byId: placeNodeInParent(
      byId,
      {
        ...node,
        isPlaceHolder: opts.isPlaceHolder,
        ...(opts.absolutePos
          ? { top: opts.absolutePos.top, left: opts.absolutePos.left }
          : {}),
      },
      targetParentId,
      opts
    ),
  };
}

export function focusNode(
  value: BlockEditorValue,
  node: BlockNode,
  focus = true
): BlockEditorValue {
  if (!node) return value;
  const { focusedNodeId } = value;
  return {
    ...value,
    focusedNodeId: focus
      ? node.id
      : focusedNodeId === node.id
      ? null
      : focusedNodeId,
  };
}
