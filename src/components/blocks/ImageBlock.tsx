import * as React from 'react';
import { BlockProps } from './BlockProps';
import { useDrag, DragSourceMonitor } from 'react-dnd';

class ImageBlockComp extends React.Component<
  BlockProps & { isDragging: boolean }
> {
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
          opacity: this.props.isDragging ? 0.5 : 1,
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

export const ImageBlock: React.FC<BlockProps> = props => {
  const [{ isDragging }, drag] = useDrag({
    item: { type: 'image', id: props.node.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div ref={drag} style={{ width: '100%', height: '100%' }}>
      <ImageBlockComp {...props} {...{ isDragging }} />
    </div>
  );
};
