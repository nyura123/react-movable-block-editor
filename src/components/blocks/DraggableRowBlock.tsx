import * as React from 'react';
import {
  parseTypes,
  getDragPositionRelativeToTarget,
  onDragStart,
  onDropped,
} from '../../utils/dragHelpers';

// import '../css/drag.css' //drag-node
import { BlockProps } from './BlockProps';

export interface DraggableRowBlockState {
  wantToPlaceNext: 'top' | 'bottom' | 'firstChild' | 'lastChild' | null;
}

export class DraggableRowBlock extends React.Component<
  BlockProps,
  DraggableRowBlockState
> {
  state = {
    wantToPlaceNext: null,
  };

  selfRef: HTMLElement | null = null;

  getBoundingRect = () => {
    return this.selfRef && this.selfRef.getBoundingClientRect
      ? this.selfRef.getBoundingClientRect()
      : null;
  };

  canDrop = (types: Array<string>) => {
    const { draggedNodeType } = parseTypes(types);
    const {
      value: { byId },
      node,
    } = this.props;
    const parentNode = node.parentId ? byId[node.parentId] : null;
    return (
      // if our parent is a col, allow to place a sibling (row) before/after us
      (draggedNodeType === 'row' && parentNode && parentNode.type === 'col') ||
      // if we have children, we don't know if they can handle drops
      (!this.props.children &&
        (draggedNodeType === 'col' ||
          draggedNodeType === 'markdown' ||
          draggedNodeType === 'image' ||
          draggedNodeType === 'layer' ||
          draggedNodeType === 'custom'))
    );
  };

  shouldPlaceBefore = (e: React.DragEvent<HTMLDivElement>, axis: 'y' | 'x') => {
    // geometry: figure out whether the dragged element should go after us or before us in parent container
    const relativeDraggedPosition = getDragPositionRelativeToTarget(
      e,
      this.getBoundingRect()
    );
    const placeBefore =
      relativeDraggedPosition &&
      (axis === 'y'
        ? relativeDraggedPosition.top / relativeDraggedPosition.height < 0.3
        : relativeDraggedPosition.left / relativeDraggedPosition.width < 0.3);

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
      const placeBefore = this.shouldPlaceBefore(e, 'y');

      if (draggedNodeType === 'row') {
        const anchorOpts = placeBefore
          ? { beforeItemId: this.props.node.id }
          : { afterItemId: this.props.node.id };

        this.props.onChange(
          onDropped(
            e.dataTransfer.types as Array<string>,
            this.props.node.parentId || '', // row over row -> place in parent container
            { ...anchorOpts, isPlaceHolder },
            this.props.value
          )
        );
      } else {
        const placeBefore = this.shouldPlaceBefore(e, 'x');
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
            this.props.node.id, // col or other over row -> place in this row
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
    const { draggedNodeType } = parseTypes(e.dataTransfer.types as Array<
      string
    >);

    if (this.canDrop(e.dataTransfer.types as Array<string>)) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      return;
    }

    if (draggedNodeType === 'row') {
      const placeBefore = this.shouldPlaceBefore(e, 'y');
      if (placeBefore && this.state.wantToPlaceNext !== 'top') {
        this.setState({
          wantToPlaceNext: 'top',
        });
      } else if (!placeBefore && this.state.wantToPlaceNext !== 'bottom') {
        this.setState({
          wantToPlaceNext: 'bottom',
        });
      }
    } else {
      const placeBefore = this.shouldPlaceBefore(e, 'x');
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
    // this.onDrop(e, false);
  };

  render() {
    const { children: reactChildren } = this.props;
    const { node, value, onChange, renderEditBlock } = this.props;
    const { wantToPlaceNext } = this.state;

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
          ref={el => (this.selfRef = el)}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          draggable
          onDragStart={e =>
            onDragStart(e, this.props.node, this.getBoundingRect)
          }
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
                const node = value.byId[id];
                const res = (
                  <div
                    className="drag-node"
                    key={'node_' + node.id}
                    style={{
                      position: 'absolute',
                      width: node.width,
                      height: node.height,
                      top: 0,
                      left: runningWidth,
                    }}
                  >
                    {renderEditBlock({
                      node,
                      renderEditBlock,
                      value,
                      onChange,
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
                left: runningWidth,
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
