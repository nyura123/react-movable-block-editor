import * as React from 'react';
import {
  onDropped2,
  getDragPositionRelativeToTarget2,
} from '../../utils/dragHelpers';

// import '../css/drag.css' //drag-node
import { BlockProps } from './BlockProps';
import {
  useDrag,
  DragSourceMonitor,
  useDrop,
  DropTargetMonitor,
} from 'react-dnd';

type WantToPlaceNext = 'top' | 'bottom' | 'firstChild' | 'lastChild' | null;

class RowBlock extends React.Component<
  BlockProps & { wantToPlaceNext: WantToPlaceNext }
> {
  render() {
    const { children: reactChildren } = this.props;
    const {
      wantToPlaceNext,
      node,
      getNode,
      undoRedoVersion,
      changeBlocks,
      renderEditBlock,
      focusedNodeId,
    } = this.props;

    const firstChildPlaceholderWidth = 3;
    let runningWidth =
      wantToPlaceNext === 'firstChild' ? firstChildPlaceholderWidth : 0;

    return (
      <div key={'row_' + node.id}>
        {wantToPlaceNext === 'top' && (
          <div
            style={{
              height: 3,
              width: '100%',
              backgroundColor: 'black',
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            height: node.height,
            width: node.width,
            // padding: 20,
            borderStyle: 'dashed',
            borderWidth: 0,
            borderBottomWidth: 1,
            backgroundColor: node.isPlaceHolder
              ? 'darkgrey'
              : node.backgroundColor || '#b5bbb9b0',
          }}
        >
          {/* {row.id} */}
          {wantToPlaceNext === 'firstChild' && (
            <div
              style={{
                height: '100%',
                width: firstChildPlaceholderWidth,
                backgroundColor: 'blue',
              }}
            />
          )}
          {React.Children.count(reactChildren)
            ? reactChildren
            : node.childrenIds.map(id => {
                const node = getNode(id);
                if (!node) return null;
                const res = (
                  <div
                    className="drag-node"
                    key={'node_' + node.id}
                    style={{
                      position: 'absolute',
                      width: node.width,
                      height: node.height,
                      top: 0,
                      left: 0,
                      transform: `translate(${runningWidth}px,0)`,
                    }}
                  >
                    {renderEditBlock({
                      node,
                      getNode,
                      undoRedoVersion,
                      focusedNodeId,
                      renderEditBlock,
                      changeBlocks,
                    })}
                  </div>
                );
                runningWidth += node.width as number;
                return res;
              })}
          {wantToPlaceNext === 'lastChild' && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translate(${runningWidth}px,0)`,
                height: '100%',
                width: firstChildPlaceholderWidth,
                backgroundColor: 'orange',
              }}
            />
          )}
        </div>
        {wantToPlaceNext === 'bottom' && (
          <div
            style={{
              height: 3,
              width: '100%',
              backgroundColor: 'green',
            }}
          />
        )}
      </div>
    );
  }
}

export const DraggableRowBlock: React.FC<BlockProps> = props => {
  const selfRef = React.useRef<HTMLDivElement | null>(null);

  const [{}, drag] = useDrag({
    item: { type: 'row', id: props.node.id },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ clientOffset, dragSourceItemType, isOver }, drop] = useDrop({
    accept: ['col', 'row', 'layer', 'custom', 'image', 'markdown'],
    canDrop: item => {
      const { getNode, node } = props;
      const parentNode = node.parentId ? getNode(node.parentId) : null;
      const draggedNodeType = item.type;

      return (
        // if our parent is a col, allow to place a sibling (row) before/after us
        (draggedNodeType === 'row' &&
          parentNode &&
          parentNode.type === 'col') ||
        // if we have children, we don't know if they can handle drops
        (!props.children &&
          (draggedNodeType === 'col' ||
            draggedNodeType === 'markdown' ||
            draggedNodeType === 'image' ||
            draggedNodeType === 'layer' ||
            draggedNodeType === 'custom'))
      );
    },
    drop: (item, monitor) => {
      const isOver = monitor.isOver({ shallow: true });
      // ?TODO check if already dropped in nested target... instead of shallow isOver check?
      if (!isOver || !item) return null;
      if (item.type === 'row') {
        // geometry: figure out whether the dragged element should go after us or before us in parent container
        const placeBefore = shouldPlaceBefore('y');
        const anchorOpts = placeBefore
          ? { beforeItemId: props.node.id }
          : { afterItemId: props.node.id };

        props.changeBlocks(
          onDropped2(
            (item as any).id,
            props.node.parentId || '', // col over col -> place in parent container
            { ...anchorOpts }
          )
        );
      } else {
        const placeBefore = shouldPlaceBefore('x');
        const { childrenIds } = props.node;
        const numChildren = childrenIds.length;
        const anchorOpts = numChildren
          ? placeBefore
            ? { beforeItemId: childrenIds[0] }
            : { afterItemId: childrenIds[numChildren - 1] }
          : null;

        props.changeBlocks(
          onDropped2(
            (item as any).id,
            props.node.id, // row or other over col -> place in this col
            {
              ...anchorOpts,
            } // place in front of first child
          )
        );
      }
      return { type: 'row', id: props.node.id };
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

  const shouldPlaceBefore = (axis: 'y' | 'x') => {
    if (!clientOffset || !isOver) {
      return false;
    }
    // geometry: figure out whether the dragged element should go after us or before us
    const relativeDraggedPosition = getDragPositionRelativeToTarget2(
      { clientX: clientOffset.x, clientY: clientOffset.y },
      getBoundingRect()
    );
    const placeBefore =
      relativeDraggedPosition &&
      (axis === 'y'
        ? relativeDraggedPosition.top / relativeDraggedPosition.height < 0.3
        : relativeDraggedPosition.left / relativeDraggedPosition.width < 0.3);
    return placeBefore;
  };

  const calcWantToPlaceNext = (dragSourceItemType: string): WantToPlaceNext => {
    if (!dragSourceItemType || !isOver) return null;
    if (dragSourceItemType === 'row') {
      const placeBefore = shouldPlaceBefore('y');
      return placeBefore ? 'top' : 'bottom';
    }
    const placeBefore = shouldPlaceBefore('x');
    return placeBefore ? 'firstChild' : 'lastChild';
  };

  const wantToPlaceNext = calcWantToPlaceNext(dragSourceItemType);

  return (
    <div ref={selfRef} style={{ width: '100%', height: '100%' }}>
      <div ref={drop} style={{ width: '100%', height: '100%' }}>
        <div ref={drag} style={{ width: '100%', height: '100%' }}>
          <RowBlock
            {...props}
            {...{
              wantToPlaceNext,
            }}
          />
        </div>
      </div>
    </div>
  );
};
