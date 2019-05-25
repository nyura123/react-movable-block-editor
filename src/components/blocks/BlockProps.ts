import { BlockNode } from '../../data';
import { BlockEditorProps } from '../editor/BlockEditorProps';

export interface BlockProps extends BlockEditorProps {
  node: BlockNode;
}
