export type BlockNodeType = 'row' | 'col' | 'markdown' | 'image' | 'layer';

export interface BlockNode {
  id: string;
  type: BlockNodeType;
  name: string;
  value?: any;
  backgroundColor?: string | null;
  color?: string | null;
  parentId?: string;
  childrenIds: Array<string>;
  isPlaceHolder?: boolean;
  width: number;
  height: number;
  top?: number;
  left?: number;
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  borderStyle?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
}

export type ById = any;

export function updateNode(byId: ById, newNode: BlockNode) {
  return { ...byId, [newNode.id]: newNode };
}

export function removeNode(byId: ById, nodeId: string) {
  const node = byId[nodeId];
  if (!node) return byId;
  if (node && node.parentId) {
    const parent: BlockNode = byId[node.parentId];
    if (parent) {
      const childIdx = parent.childrenIds.findIndex(id => id === node.id);
      if (childIdx >= 0) {
        const childrenIds = parent.childrenIds.filter(id => id !== node.id);
        byId = updateNode(byId, { ...parent, childrenIds });
      }
    }
  }
  return { ...byId, [nodeId]: undefined };
}

export function hasDescendent(
  byId: ById,
  nodeId: string,
  descendentId: string
): boolean {
  const node = byId[nodeId];
  if (!node) return false;
  if (node.childrenIds.indexOf(descendentId) >= 0) {
    return true;
  }
  for (const childId of node.childrenIds) {
    const descendentOfChild = hasDescendent(byId, childId, descendentId);
    if (descendentOfChild) return false;
  }
  return false;
}

export function placeNodeInParent(
  byId: ById,
  node: BlockNode,
  newParentId: string,
  opts?: { beforeItemId?: string; afterItemId?: string }
) {
  if (!node) {
    return byId;
  }

  // Prevent placing a parent under a current child (or descendent) to avoid cycles
  if (hasDescendent(byId, node.id, newParentId)) {
    console.warn(
      'node ',
      node.id,
      ' has ',
      newParentId,
      ' as child, so cannot make it into',
      node.id,
      "'s parent"
    );
    return byId;
  }

  // Disallow placing within itself
  if (node.id === newParentId) {
    console.warn('Cannot place into self: ', { id: node.id, newParentId });
    return byId;
  }

  // if parent changed, remove node from old parent
  if (node && node.parentId && node.parentId !== newParentId) {
    const parent: BlockNode = byId[node.parentId];
    if (parent) {
      const childrenIds = parent.childrenIds.filter(id => id !== node.id);
      byId = updateNode(byId, { ...parent, childrenIds });
    }
  }

  const newParent: BlockNode = byId[newParentId];
  if (newParent) {
    const childrenIds = reinsertIntoList(newParent.childrenIds, node.id, opts);
    byId = updateNode(byId, { ...newParent, childrenIds });
  }

  return updateNode(byId, { ...node, parentId: newParentId });
}

export function reinsertIntoList(
  ids: Array<string>,
  itemId: string,
  opts: { beforeItemId?: string; afterItemId?: string } = {}
) {
  // Disallow placing before/after itself
  if (itemId === opts.beforeItemId || itemId === opts.afterItemId) {
    console.warn('Cannot place relative to self: ', { itemId, ...opts });
    return ids;
  }

  // remove the item if it's in the list
  ids = ids.filter(id => id !== itemId);

  const { beforeItemId, afterItemId } = opts;
  let refItemIdx = -1;
  if (beforeItemId) {
    refItemIdx = ids.findIndex(id => id === beforeItemId);
  } else if (afterItemId) {
    refItemIdx = ids.findIndex(id => id === afterItemId) + 1;
  }

  if (refItemIdx >= 0) {
    const newItems = [...ids];
    newItems.splice(refItemIdx, 0, itemId);
    return newItems;
  }

  return [itemId, ...ids];
}
