import * as React from 'react';
import {
  parseTypes,
  getDragPositionRelativeToTarget,
  onDragStart,
  onDropped,
} from '../../utils/dragHelpers';

// import '../css/drag.css' //drag-node
import { BlockProps } from './BlockProps';

export interface DraggableColBlockState {
  wantToPlaceNext: 'left' | 'right' | 'firstChild' | 'lastChild' | null;
}

export class DraggableColBlock extends React.Component<
  BlockProps,
  DraggableColBlockState
> {
  selfRef: HTMLElement | null = null;
  state = {
    wantToPlaceNext: null,
  };

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  canDrop = (types: Array<string>) => {
    const {
      value: { byId },
      node,
    } = this.props;
    const parentNode = node.parentId ? byId[node.parentId] : null;
    const { draggedNodeType } = parseTypes(types);
    return (
      // if our parent is a row, allow to place a sibling(col) before/after us
      (draggedNodeType === 'col' && parentNode && parentNode.type === 'row') ||
      // if we have children, we don't know if they can handle drops
      (!this.props.children &&
        (draggedNodeType === 'row' ||
          draggedNodeType === 'markdown' ||
          draggedNodeType === 'image' ||
          draggedNodeType === 'layer' ||
          draggedNodeType === 'custom'))
    );
  };

  shouldPlaceBefore = (e: React.DragEvent<HTMLDivElement>, axis: 'y' | 'x') => {
    // geometry: figure out whether the dragged element should go after us or before us
    const relativeDraggedPosition = getDragPositionRelativeToTarget(
      e,
      this.getBoundingRect()
    );
    const placeBefore =
      relativeDraggedPosition &&
      (axis === 'y'
        ? relativeDraggedPosition.top / relativeDraggedPosition.height < 0.45
        : relativeDraggedPosition.left / relativeDraggedPosition.width < 0.45);
    return placeBefore;
  };

  onDrop = (e: React.DragEvent<HTMLDivElement>, isPlaceHolder = false) => {
    if (!this.canDrop(e.dataTransfer.types as Array<string>)) {
      return;
    }

    e.stopPropagation();

    if (!isPlaceHolder && this.state.wantToPlaceNext !== null) {
      this.setState({ wantToPlaceNext: null });
    }

    const { draggedNodeId, draggedNodeType } = parseTypes(e.dataTransfer
      .types as Array<string>);

    if (draggedNodeId) {
      if (draggedNodeType === 'col') {
        // geometry: figure out whether the dragged element should go after us or before us in parent container
        const placeBefore = this.shouldPlaceBefore(e, 'x');
        const anchorOpts = placeBefore
          ? { beforeItemId: this.props.node.id }
          : { afterItemId: this.props.node.id };

        this.props.onChange(
          onDropped(
            e.dataTransfer.types as Array<string>,
            this.props.node.parentId || '', // col over col -> place in parent container
            { ...anchorOpts, isPlaceHolder },
            this.props.value
          )
        );
      } else {
        const placeBefore = this.shouldPlaceBefore(e, 'y');
        const { childrenIds } = this.props.node;
        const numChildren = childrenIds.length;
        const anchorOpts = numChildren
          ? placeBefore
            ? { beforeItemId: childrenIds[0] }
            : { afterItemId: childrenIds[numChildren - 1] }
          : null;

        this.props.onChange(
          onDropped(
            e.dataTransfer.types as Array<string>,
            this.props.node.id, // row or other over col -> place in this col
            {
              isPlaceHolder,
              ...anchorOpts,
            }, // place in front of first child
            this.props.value
          )
        );
      }
    }
  };

  onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (this.canDrop(e.dataTransfer.types as Array<string>)) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      return;
    }

    const { draggedNodeType } = parseTypes(e.dataTransfer.types as Array<
      string
    >);

    if (draggedNodeType === 'col') {
      const placeBefore = this.shouldPlaceBefore(e, 'x');
      if (placeBefore && this.state.wantToPlaceNext !== 'left') {
        this.setState({
          wantToPlaceNext: 'left',
        });
      } else if (!placeBefore && this.state.wantToPlaceNext !== 'right') {
        this.setState({
          wantToPlaceNext: 'right',
        });
      }
    } else {
      const placeBefore = this.shouldPlaceBefore(e, 'y');
      this.setState({
        wantToPlaceNext: placeBefore ? 'firstChild' : 'lastChild',
      });
    }
  };

  onDragLeave = (_e: React.DragEvent<HTMLDivElement>) => {
    if (this.state.wantToPlaceNext !== null) {
      this.setState({
        wantToPlaceNext: null,
      });
    }
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

  render() {
    const { children: reactChildren } = this.props;

    const {
      node,
      value: { byId },
    } = this.props;
    const { wantToPlaceNext } = this.state;

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
              backgroundColor: 'white',
            }}
          />
        )}
        <div
          ref={el => (this.selfRef = el)}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          draggable
          onDragStart={e =>
            onDragStart(e, this.props.node, this.getBoundingRect)
          }
          style={{
            width: '100%',
            height: '100%',
            borderRadius: 3,
            backgroundColor: this.props.node.isPlaceHolder
              ? 'grey'
              : this.props.node.backgroundColor || '#ffffffa8',
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
                const row = byId[childId];
                const res = (
                  <div
                    className="drag-node"
                    key={'node_' + childId}
                    style={{
                      position: 'absolute',
                      width: row.width,
                      height: row.height,
                      top: runningHeight,
                      left: 0,
                    }}
                  >
                    {this.renderChild(childId)}
                  </div>
                );
                runningHeight += row.height;
                return res;
              })}
          {wantToPlaceNext === 'lastChild' && (
            <div
              style={{
                top: runningHeight,
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
  }
}
