import { BlockEditorValue } from '../BlockEditorProps';
import { BlockNode, placeNodeInParent } from '../../../data';

export interface AddBlockResult {
  error?: string;
  value: BlockEditorValue;
}

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
    parentNodeId = parentNode ? parentNode.parentId : null;
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

  const count = Object.keys(byId).length;

  const name = 'row' + (count + 1);
  const row: BlockNode = {
    type: 'row',
    height: 100,
    width: parentNode && parentNode.width ? parentNode.width : 500,
    ...props,
    id: name,
    name,
    childrenIds: [],
  };

  // add child
  byId = placeNodeInParent(byId, row, parentNode.id);
  parentNode = byId[parentNodeId];

  // update new child and all siblings' heights
  const updates: any = {};
  if (parentNode.type === 'col') {
    if (parentNode && parentNode.childrenIds.length >= 1) {
      const childHeight = parentNode.height / parentNode.childrenIds.length;
      for (const childId of parentNode.childrenIds) {
        updates[childId] = { ...byId[childId], height: childHeight };
      }
    }
  }

  return {
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
    parentNodeId = parentNode ? parentNode.parentId : null;
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

  const count = Object.keys(byId).length;

  const name = 'col' + (count + 1);
  const col: BlockNode = {
    type: 'col',
    width: 100,
    height: parentNode.height ? parentNode.height : 100,
    ...props,
    id: name,
    name,
    childrenIds: [],
  };

  // add child
  byId = placeNodeInParent(byId, col, parentNodeId);
  parentNode = byId[parentNodeId];

  // update new child and all siblings' widths
  const updates: any = {};
  if (parentNode.type === 'row') {
    if (parentNode && parentNode.childrenIds.length >= 1) {
      const childWidth = parentNode.width / parentNode.childrenIds.length;
      for (const childId of parentNode.childrenIds) {
        updates[childId] = { ...byId[childId], width: childWidth };
      }
    }
  }

  return {
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

  const count = Object.keys(byId).length;

  const name = 'markdown' + (count + 3);
  const markdown: BlockNode = {
    type: 'markdown',
    width: Math.max(1, parentNode.width - 20),
    height: Math.max(1, parentNode.height - 20),
    ...props,
    id: name,
    name,
    childrenIds: [],
  };

  return {
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
          'http://lorempixel.com/200/200/'
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

  const count = Object.keys(byId).length;

  const name = 'image' + (count + 3);
  const image: BlockNode = {
    type: 'image',
    value: url,
    width: Math.max(1, parentNode.width - 20),
    height: Math.max(1, parentNode.height - 20),
    ...props,
    id: name,
    name,
    childrenIds: [],
  };

  return {
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

  const count = Object.keys(byId).length;

  const name = 'layer' + (count + 3);
  const image: BlockNode = {
    type: 'layer',
    width: Math.max(1, parentNode.width - 20),
    height: Math.max(1, parentNode.height - 20),
    ...props,
    id: name,
    name,
    childrenIds: [],
  };

  return {
    value: {
      ...value,
      byId: placeNodeInParent(byId, image, parentNodeId),
      focusedNodeId: image.id,
    },
  };
}
