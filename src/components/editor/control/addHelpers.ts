import { BlockEditorValue } from '../BlockEditorProps';
import { newBlockId } from '../helpers';
import { BlockNode, placeNodeInParent } from '../../../data';

export interface AddBlockResult {
  error?: string;
  createdBlock?: BlockNode;
  value: BlockEditorValue;
}

const nestedElementPercentWidthHeight = 0.95;

export function addRow(
  value: BlockEditorValue,
  props?: Partial<BlockNode>
): AddBlockResult {
  let { byId, rootNodeId } = value;
  const { focusedNodeId } = value;
  let parentNodeId = (props ? props.parentId : focusedNodeId) || rootNodeId;
  let parentNode = byId[parentNodeId];

  const allowedParents = ['col', 'layer'];

  if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
    // try parent
    parentNodeId = parentNode ? parentNode.parentId || '' : '';
    parentNode = parentNodeId ? byId[parentNodeId] : parentNode;

    if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
      return {
        error:
          'Can only add a row inside ' +
          allowedParents.join(', ') +
          ', please select a column by clicking on it',
        value,
      };
    }
  }

  let newNodeId = newBlockId(byId, 'row');

  const row: BlockNode = {
    type: 'row',
    height: 100,
    width:
      parentNode && parentNode.width
        ? parentNode.width * nestedElementPercentWidthHeight
        : 500,
    paddingLeftPercentWidth: (1 - nestedElementPercentWidthHeight) / 2,
    paddingTopPercentHeight: (1 - nestedElementPercentWidthHeight) / 2,
    ...props,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };

  // add child
  byId = placeNodeInParent(byId, row, parentNode.id);
  parentNode = byId[parentNodeId];

  // update new child and all siblings' heights
  const updates: any = {};
  if (parentNode && parentNode.type === 'col') {
    if (parentNode && parentNode.childrenIds.length >= 1) {
      const childHeight = Math.max(
        20,
        (parentNode.height / parentNode.childrenIds.length) *
          nestedElementPercentWidthHeight
      );
      for (const childId of parentNode.childrenIds) {
        updates[childId] = { ...byId[childId], height: childHeight };
      }
    }
  }

  return {
    createdBlock: row,
    value: {
      ...value,
      byId: { ...byId, ...updates },
      focusedNodeId: focusedNodeId || row.id,
    },
  };
}

export function addCol(
  value: BlockEditorValue,
  props?: Partial<BlockNode>
): AddBlockResult {
  let { byId, rootNodeId } = value;
  const { focusedNodeId } = value;
  let parentNodeId = (props ? props.parentId : focusedNodeId) || rootNodeId;
  let parentNode = byId[parentNodeId];

  const allowedParents = ['row', 'layer'];

  if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
    // try parent
    parentNodeId = parentNode ? parentNode.parentId || '' : '';
    parentNode = parentNodeId ? byId[parentNodeId] : parentNode;

    if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
      return {
        error:
          'Can only add a column inside ' +
          allowedParents.join(', ') +
          ', please select a column by clicking on it',
        value,
      };
    }
  }

  let newNodeId = newBlockId(byId, 'col');

  const col: BlockNode = {
    type: 'col',
    width: 100,
    height: parentNode.height
      ? parentNode.height * nestedElementPercentWidthHeight
      : 100,
    paddingLeftPercentWidth: (1 - nestedElementPercentWidthHeight) / 2,
    paddingTopPercentHeight: (1 - nestedElementPercentWidthHeight) / 2,
    ...props,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };

  // add child
  byId = placeNodeInParent(byId, col, parentNodeId);
  parentNode = byId[parentNodeId];

  // update new child and all siblings' widths
  const updates: any = {};
  if (parentNode && parentNode.type === 'row') {
    if (parentNode && parentNode.childrenIds.length >= 1) {
      const childWidth = Math.max(
        20,
        (parentNode.width / parentNode.childrenIds.length) *
          nestedElementPercentWidthHeight
      );
      for (const childId of parentNode.childrenIds) {
        updates[childId] = { ...byId[childId], width: childWidth };
      }
    }
  }

  return {
    createdBlock: col,
    value: {
      ...value,
      byId: { ...byId, ...updates },
      focusedNodeId: focusedNodeId || col.id,
    },
  };
}

export function addMarkDown(
  value: BlockEditorValue,
  props?: Partial<BlockNode>
): AddBlockResult {
  let { byId, rootNodeId } = value;
  const { focusedNodeId } = value;
  let parentNodeId = (props ? props.parentId : focusedNodeId) || rootNodeId;
  let parentNode = byId[parentNodeId];

  const allowedParents = ['row', 'col', 'layer'];

  if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
    return {
      error: 'Can only add markdown text inside ' + allowedParents.join(', '),
      value,
    };
  }

  let newNodeId = newBlockId(byId, 'markdown');

  const markdown: BlockNode = {
    type: 'markdown',
    width: Math.max(1, parentNode.width - 20),
    height: Math.max(1, parentNode.height - 20),
    ...props,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };

  return {
    createdBlock: markdown,
    value: {
      ...value,
      byId: placeNodeInParent(byId, markdown, parentNodeId),
      focusedNodeId: markdown.id,
    },
  };
}

export function addImage(
  value: BlockEditorValue,
  props?: Partial<BlockNode>
): AddBlockResult {
  const url =
    props && props.value
      ? props.value
      : window.prompt(
          'Please enter image url',
          'https://lorempixel.com/200/200/'
        );
  if (url === null) return { error: 'no image selected', value };

  let { byId, rootNodeId } = value;
  const { focusedNodeId } = value;
  let parentNodeId = (props ? props.parentId : focusedNodeId) || rootNodeId;
  let parentNode = byId[parentNodeId];

  const allowedParents = ['row', 'col', 'layer'];

  if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
    return {
      error: 'Can only add an image inside ' + allowedParents.join(', '),
      value,
    };
  }

  let newNodeId = newBlockId(byId, 'image');

  const image: BlockNode = {
    type: 'image',
    value: url,
    width: 200,
    height: 200,
    // width: Math.max(1, parentNode.width - 20),
    // height: Math.max(1, parentNode.height - 20),
    ...props,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };

  return {
    createdBlock: image,
    value: {
      ...value,
      byId: placeNodeInParent(byId, image, parentNodeId),
      focusedNodeId: image.id,
    },
  };
}

export function addLayer(
  value: BlockEditorValue,
  props?: Partial<BlockNode>
): AddBlockResult {
  let { byId, rootNodeId } = value;
  const { focusedNodeId } = value;
  let parentNodeId = (props ? props.parentId : focusedNodeId) || rootNodeId;
  let parentNode = byId[parentNodeId];

  const allowedParents = ['row', 'col', 'layer'];

  if (!parentNode || allowedParents.indexOf(parentNode.type) < 0) {
    return {
      error: 'Can only add a layer inside ' + allowedParents.join(', '),
      value,
    };
  }

  let newNodeId = newBlockId(byId, 'layer');

  const layer: BlockNode = {
    type: 'layer',
    width: Math.max(1, parentNode.width * nestedElementPercentWidthHeight),
    height: Math.max(1, parentNode.height * nestedElementPercentWidthHeight),
    paddingLeftPercentWidth: (1 - nestedElementPercentWidthHeight) / 2,
    paddingTopPercentHeight: (1 - nestedElementPercentWidthHeight) / 2,
    ...props,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };

  return {
    createdBlock: layer,
    value: {
      ...value,
      byId: placeNodeInParent(byId, layer, parentNodeId),
      focusedNodeId: layer.id,
    },
  };
}
