import { BlockProps } from '../blocks/BlockProps';
import { ReactElement } from 'react';
import { ById, BlockNode } from '../../data';

export interface BlockEditorValue {
  byId: ById;
  undoRedoVersion: number;
  rootNodeId: string;
  focusedNodeId: string | null;
  copiedNode: BlockNode | null;
  undoStack: Array<ById>;
  redoStack: Array<ById>;
}

export interface BlockEditorProps {
  value: BlockEditorValue;
  onChange: (value: BlockEditorValue) => any;
  renderEditBlock: (props: BlockProps) => ReactElement;
}
