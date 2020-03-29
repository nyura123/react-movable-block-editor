import * as React from 'react';
import {
  onDropped2,
  getDragPositionRelativeToTarget2,
} from '../../utils/dragHelpers';
import { BlockProps } from './BlockProps';
import {
  useDrag,
  DragSourceMonitor,
  useDrop,
  DropTargetMonitor,
} from 'react-dnd';

class LayerBlock extends React.Component<BlockProps> {
  renderChild(nodeId: string) {
    const {
      changeBlocks,
      getNode,
      undoRedoVersion,
      focusedNodeId,
      renderEditBlock,
    } = this.props;
    const node = getNode(nodeId);
    if (!node) return null;
    return renderEditBlock({
      node,
      renderEditBlock,
      undoRedoVersion,
      changeBlocks,
      getNode,
      focusedNodeId,
    });
  }

  render() {
    const { node, getNode } = this.props;
    const { childrenIds } = node;

    return (
      <div
        style={{
          position: 'relative',
          width: node.width,
          height: node.height,
          backgroundColor: node.backgroundColor || '#f5f5f5a3',
          // padding: 5,
          borderRadius: 3,
        }}
      >
        {childrenIds.map(childId => {
          const node = getNode(childId);
          if (!node) return null;
          const res = (
            <div
              // className="drag-node"
              key={'node_' + childId}
              style={{
                position: 'absolute',
                width: node.width,
                height: node.height,
                top: 0,
                left: 0,
                transform: `translate(${node.left}px,${node.top}px)`,
              }}
            >
              {this.renderChild(childId)}
            </div>
          );
          return res;
        })}
      </div>
    );
  }
}

export const AbsoluteLayerBlock: React.FC<BlockProps> = props => {
  const selfRef = React.useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    item: { type: 'col', id: props.node.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [
    {
      clientOffset,
      dragSourceItemId,
      dragSourceItemType,
      isOver,
      initialClientOffset,
      initialSourceClientOffset,
    },
    drop,
  ] = useDrop({
    accept: ['col', 'row', 'layer', 'custom', 'image'],
    canDrop: item => {
      const { getNode, node } = props;
      const parentNode = node.parentId ? getNode(node.parentId) : null;
      const draggedNodeType = item.type;
      return (
        // if our parent is a row, allow to place a sibling(col) before/after us
        (draggedNodeType === 'col' &&
          parentNode &&
          parentNode.type === 'row') ||
        // if we have children, we don't know if they can handle drops
        (!props.children &&
          (draggedNodeType === 'row' ||
            draggedNodeType === 'markdown' ||
            draggedNodeType === 'image' ||
            draggedNodeType === 'layer' ||
            draggedNodeType === 'custom'))
      );
    },
    drop: (item, monitor) => {
      const isOver = monitor.isOver({ shallow: true });
      // ?TODO check if already dropped in nested target... instead of shallow isOver check?
      if (!isOver || !item || !clientOffset) return null;
      console.log('DROP', props.node.id, (item as any).id);

      // geometry: figure out whether the dragged element should go after us or before us
      const relativeDraggedPosition = getDragPositionRelativeToTarget2(
        { clientX: clientOffset.x, clientY: clientOffset.y },
        getBoundingRect()
      );

      const lastChildId = props.node.childrenIds.length
        ? props.node.childrenIds[props.node.childrenIds.length - 1]
        : undefined;

      props.changeBlocks(
        onDropped2(
          (item as any).id,
          props.node.id,
          relativeDraggedPosition
            ? {
                afterItemId: lastChildId, // for overlay stacking, display last on top
                absolutePos: {
                  top: relativeDraggedPosition.top - 0, // TODOdraggedInfo.startTop,
                  left: relativeDraggedPosition.left - 0, // TODO,
                },
              }
            : undefined
        )
      );
      return { type: 'layer', id: props.node.id };
    },
    collect: (monitor: DropTargetMonitor) => {
      const dragSourceItem = monitor.getItem();
      return {
        isOver: monitor.isOver({ shallow: true }),
        initialClientOffset: monitor.getInitialClientOffset(),
        clientOffset: monitor.getClientOffset(),
        dragSourceItemType: dragSourceItem ? dragSourceItem.type : '',
        dragSourceItemId: dragSourceItem ? dragSourceItem.id : '',
        initialSourceClientOffset: monitor.getInitialSourceClientOffset(),
      };
    },
  });

  const getBoundingRect = () => {
    return selfRef.current && selfRef.current.getBoundingClientRect
      ? selfRef.current.getBoundingClientRect()
      : null;
  };

  console.log('drag state', {
    id: props.node.id,
    draggedId: dragSourceItemId,
    isDragging,
    isOver,
    clientOffset,
    initialClientOffset,
    initialSourceClientOffset,
  });

  return (
    <div ref={selfRef} style={{ width: '100%', height: '100%' }}>
      <div ref={drop} style={{ width: '100%', height: '100%' }}>
        <div ref={drag} style={{ width: '100%', height: '100%' }}>
          <LayerBlock {...props} />
        </div>
      </div>
    </div>
  );
};
