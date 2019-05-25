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
      draggedNodeType === 'markdown' ||
      draggedNodeType === 'image' ||
      draggedNodeType === 'layer'
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

      this.props.onChange(
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
            : undefined,
          this.props.value
        )
      );
    }
  };

  onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  renderChild(nodeId: string) {
    const { value, onChange, renderEditBlock } = this.props;
    const node = value.byId[nodeId];
    return renderEditBlock({
      node,
      renderEditBlock,
      value,
      onChange,
    });
  }

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.canDrop(e.dataTransfer.types as Array<string>)) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  render() {
    const {
      node,
      value: { byId },
    } = this.props;
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
          backgroundColor: node.backgroundColor || 'darkgrey',
          padding: 5,
          borderRadius: 3,
        }}
      >
        {childrenIds.map(childId => {
          const node = byId[childId];
          const res = (
            <div
              // className="drag-node"
              key={'node_' + childId}
              style={{
                position: 'absolute',
                width: node.width,
                height: node.height,
                top: node.top,
                left: node.left,
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
