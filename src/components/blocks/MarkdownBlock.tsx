import * as React from 'react';
import { BlockNode } from '../../data';
import { onDragStart } from '../../utils/dragHelpers';

export interface MarkdownBlockProps {
  node: BlockNode;
  update: (nodeId: string, props: Partial<BlockNode>) => any;
}

export class MarkdownBlock extends React.Component<MarkdownBlockProps> {
  selfRef: HTMLElement | null = null;

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  render() {
    const { node, update } = this.props;
    const { value } = node;

    return (
      <div
        ref={el => (this.selfRef = el)}
        // draggable
        // onDragStart={e => onDragStart(e, this.props.node, this.getBoundingRect)}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#ffc0cb75',
          padding: 5,
          borderRadius: 3,
        }}
      >
        <textarea
          className="form-control"
          name="value"
          placeholder="Type here..."
          value={value}
          style={{ width: '95%', height: '95%', outline: 'none' }}
          onChange={e => update(node.id, { value: e.target.value })}
        />
      </div>
    );
  }
}
