import { BlockProps } from '../blocks/BlockProps';
import { ReactElement } from 'react';
import { ById, BlockNode } from '../../data';

export interface BlockEditorValue {
  byId: ById;
  rootNodeId: string;
  focusedNodeId: string | null;
  copiedNode: BlockNode | null;
}

export interface BlockEditorProps {
  value: BlockEditorValue;
  onChange: (value: BlockEditorValue) => any;
  renderEditBlock: (props: BlockProps) => ReactElement;
}
