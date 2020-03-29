import * as React from 'react';
import { onDragStart } from '../../utils/dragHelpers';
import { BlockProps } from './BlockProps';

export class ImageBlock extends React.Component<BlockProps> {
  selfRef: HTMLElement | null = null;

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  render() {
    const { node } = this.props;

    return (
      <div
        ref={el => (this.selfRef = el)}
        // draggable
        // onDragStart={e => onDragStart(e, this.props.node, this.getBoundingRect)}
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'violet',
          padding: 5,
          borderRadius: 3,
        }}
      >
        <img style={{ width: '100%', height: '100%' }} src={node.value} />
      </div>
    );
  }
}
