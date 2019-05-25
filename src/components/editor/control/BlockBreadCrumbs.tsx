import * as React from 'react';
import { ById, BlockNode } from '../../../data';

export interface BlockBreadCrumbsProps {
  onSelect: (nodeId: string) => any;
  byId: ById;
  navClassName?: string;
  itemClassName?: string;
  node: BlockNode;
}

export const BlockBreadCrumbs = (props: BlockBreadCrumbsProps) => {
  const {
    byId,
    node,
    onSelect,
    navClassName = 'breadcrumb',
    itemClassName = 'breadcrumb-item btn btn-link active',
  } = props;

  if (!node) return null;

  const crumbs = [];
  let id = node.id;
  while (id) {
    const node = byId[id];
    if (!node) break;
    crumbs.unshift({ label: `${node.type}-${node.id}`, id: node.id });
    id = node.parentId;
  }
  return (
    <nav aria-label="breadcrumb">
      <ol className={navClassName}>
        {crumbs.map(crumb => (
          <li
            onClick={() => onSelect(crumb.id)}
            key={'crumb_' + crumb.id}
            className={itemClassName}
            aria-current="page"
          >
            {crumb.label}
          </li>
        ))}
      </ol>
    </nav>
  );
};
