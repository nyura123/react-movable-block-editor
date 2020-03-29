import React, { useRef } from 'react';
import {
  getDragPositionRelativeToTarget2,
  onDropped2,
} from '../../utils/dragHelpers';

// import { useDrag } from 'react-dnd';

import { BlockProps } from './BlockProps';
import {
  DragSourceMonitor,
  useDrag,
  useDrop,
  DropTargetMonitor,
} from 'react-dnd';

type WantToPlaceNext = 'left' | 'right' | 'firstChild' | 'lastChild' | null;

const ColBlock: React.FC<
  BlockProps & { wantToPlaceNext: WantToPlaceNext }
> = props => {
  const { wantToPlaceNext } = props;

  const renderChild = (nodeId: string) => {
    const {
      getNode,
      changeBlocks,
      undoRedoVersion,
      focusedNodeId,
      renderEditBlock,
    } = props;
    const node = getNode(nodeId);
    if (!node) return null;
    return renderEditBlock({
      node,
      undoRedoVersion,
      renderEditBlock,
      focusedNodeId,
      changeBlocks,
      getNode,
    });
  };

  const { children: reactChildren } = props;

  const { node, getNode } = props;

  const { childrenIds } = node;

  const firstChildPlaceholderHeight = 3;
  let runningHeight =
    wantToPlaceNext === 'firstChild' ? firstChildPlaceholderHeight : 0;

  return (
    <div
      key={'col_' + node.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: '100%',
      }}
    >
      {wantToPlaceNext === 'left' && (
        <div
          style={{
            height: '100%',
            width: 3,
            backgroundColor: 'green',
          }}
        />
      )}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          backgroundColor: props.node.isPlaceHolder
            ? 'grey'
            : props.node.backgroundColor || '#ffffffa8',
          borderStyle: 'solid',
          borderWidth: 1,
        }}
      >
        {wantToPlaceNext === 'firstChild' && (
          <div
            style={{
              height: 10,
              width: '100%',
              backgroundColor: 'blue',
            }}
          />
        )}
        {React.Children.count(reactChildren)
          ? reactChildren
          : childrenIds.map(childId => {
              const row = getNode(childId);
              if (!row) return null;
              const res = (
                <div
                  className="drag-node"
                  key={'node_' + childId}
                  style={{
                    position: 'absolute',
                    width: row.width,
                    height: row.height,
                    top: 0,
                    left: 0,
                    transform: `translate(0,${runningHeight}px)`,
                  }}
                >
                  {renderChild(childId)}
                </div>
              );
              runningHeight += row.height;
              return res;
            })}
        {wantToPlaceNext === 'lastChild' && (
          <div
            style={{
              top: 0,
              left: 0,
              transform: `translate(0,${runningHeight}px)`,
              position: 'absolute',
              height: 10,
              width: '100%',
              backgroundColor: 'orange',
            }}
          />
        )}
      </div>
      {wantToPlaceNext === 'right' && (
        <div
          style={{
            height: '100%',
            width: 3,
            backgroundColor: 'white',
          }}
        />
      )}
    </div>
  );
};

export const DraggableColBlock: React.FC<BlockProps> = props => {
  const selfRef = useRef<HTMLDivElement | null>(null);

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
      if (!isOver || !item) return null;
      console.log('DROP', props.node.id, (item as any).id);
      if (item.type === 'col') {
        // geometry: figure out whether the dragged element should go after us or before us in parent container
        const placeBefore = shouldPlaceBefore('x');
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
        const placeBefore = shouldPlaceBefore('y');
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
      return { type: 'col', id: props.node.id };
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
        ? relativeDraggedPosition.top / relativeDraggedPosition.height < 0.45
        : relativeDraggedPosition.left / relativeDraggedPosition.width < 0.45);
    return placeBefore;
  };

  const calcWantToPlaceNext = (dragSourceItemType: string): WantToPlaceNext => {
    if (!dragSourceItemType || !isOver) return null;
    if (dragSourceItemType === 'col') {
      const placeBefore = shouldPlaceBefore('x');
      return placeBefore ? 'left' : 'right';
    }
    const placeBefore = shouldPlaceBefore('y');
    return placeBefore ? 'firstChild' : 'lastChild';
  };

  const wantToPlaceNext = calcWantToPlaceNext(dragSourceItemType);

  // useEffect(() => {
  //   preview(getEmptyImage(), { captureDraggingState: true })
  // }, [])

  console.log('drag state', {
    id: props.node.id,
    draggedId: dragSourceItemId,
    isDragging,
    isOver,
    wantToPlaceNext,
    clientOffset,
    initialClientOffset,
    initialSourceClientOffset,
  });

  return (
    <div ref={selfRef} style={{ width: '100%', height: '100%' }}>
      <div ref={drop} style={{ width: '100%', height: '100%' }}>
        <div ref={drag} style={{ width: '100%', height: '100%' }}>
          <ColBlock
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
