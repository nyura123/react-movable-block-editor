import { BlockNode } from '../../data';
import { BlockEditorValue } from '../editor/BlockEditorProps';
import { ReactElement } from 'react';

export type GetNode = (id: string) => BlockNode | undefined;

// create, update, destroy, move
export type NodeOp = (value: BlockEditorValue) => BlockEditorValue;

export interface BlockProps {
  undoRedoVersion: number;
  getNode: GetNode;
  node: BlockNode;
  focusedNodeId: string | null;
  changeBlocks: (op: NodeOp) => any;
  renderEditBlock: (props: BlockProps) => ReactElement;
}
