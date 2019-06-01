import * as React from 'react';
import {
  parseTypes,
  getDragPositionRelativeToTarget,
  onDragStart,
  onDropped,
  DraggedInfo,
} from '../../utils/dragHelpers';
import { BlockProps } from './BlockProps';

export class AbsoluteLayerBlock extends React.Component<BlockProps> {
  selfRef: HTMLElement | null = null;

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  canDrop = (types: Array<string>) => {
    const { draggedNodeType } = parseTypes(types);
    return (
      draggedNodeType === 'row' ||
      draggedNodeType === 'col' ||
      draggedNodeType === 'markdown' ||
      draggedNodeType === 'image' ||
      draggedNodeType === 'layer' ||
      draggedNodeType === 'custom'
    );
  };

  onDrop = (e: React.DragEvent<HTMLDivElement>, _isPlaceHolder = false) => {
    if (!this.canDrop(e.dataTransfer.types as Array<string>)) {
      return;
    }

    e.stopPropagation();

    const { draggedNodeId } = parseTypes(e.dataTransfer.types as Array<string>);
    if (draggedNodeId) {
      // geometry: figure out whether the dragged element should go after us or before us
      const relativeDraggedPosition = getDragPositionRelativeToTarget(
        e,
        this.getBoundingRect()
      );

      const lastChildId = this.props.node.childrenIds.length
        ? this.props.node.childrenIds[this.props.node.childrenIds.length - 1]
        : undefined;

      const draggedInfo = JSON.parse(
        e.dataTransfer.getData('text/plain')
      ) as DraggedInfo;

      this.props.changeBlocks(
        onDropped(
          e.dataTransfer.types as Array<string>,
          this.props.node.id,
          relativeDraggedPosition
            ? {
                afterItemId: lastChildId, // for overlay stacking, display last on top
                absolutePos: {
                  top: relativeDraggedPosition.top - draggedInfo.startTop,
                  left: relativeDraggedPosition.left - draggedInfo.startLeft,
                },
              }
            : undefined
        )
      );
    }
  };

  onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

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

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.canDrop(e.dataTransfer.types as Array<string>)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  render() {
    const { node, getNode } = this.props;
    const { childrenIds } = node;

    return (
      <div
        ref={el => (this.selfRef = el)}
        onDragOver={this.onDragOver}
        onDrop={this.onDrop}
        draggable
        onDragStart={e => onDragStart(e, this.props.node, this.getBoundingRect)}
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
