import * as React from 'react';
import { createElement as _createElement } from 'react';

import { BlockNode } from '../../data';
import { DraggableColBlock } from '../blocks/DraggableColBlock';
import { defaultRenderEditBlock } from '../blocks/ResizableBlock';
import { BlockEditorProps, BlockEditorValue } from './BlockEditorProps';

import { cloneDeep } from 'lodash';
import { NodeOp } from '../blocks/BlockProps';

export interface BlockEditorState {
  value: BlockEditorValue;
}

const maxUndoStack = 10;

export class BlockEditor extends React.Component<
  BlockEditorProps,
  BlockEditorState
> {
  state = {
    value: this.props.value,
  };

  static defaultProps = {
    renderEditBlock: defaultRenderEditBlock,
    onChange: (_v: BlockEditorValue) => {},
  };

  componentDidMount() {
    if (this.props.onChange) {
      // Notify parent of change
      const { value } = this.state;
      this.props.onChange(value);
    }
  }

  componentDidUpdate(prevProps: BlockEditorProps, prevState: BlockEditorState) {
    if (
      this.props.onChange &&
      this.state.value !== prevState.value &&
      this.state.value !== this.props.value
    ) {
      const { value } = this.state;
      this.props.onChange(value);
    } else if (
      this.props.value &&
      prevProps.value !== this.props.value &&
      this.props.value !== this.state.value
    ) {
      this.setState({ value: this.props.value });
    }

    // make the last byId reachable through undo
    if (
      this.state.value.byId !== prevState.value.byId &&
      this.state.value.undoStack === prevState.value.undoStack
    ) {
      this.setState({
        value: {
          ...this.state.value,
          undoStack: [
            cloneDeep(prevState.value.byId),
            ...this.state.value.undoStack,
          ].slice(0, maxUndoStack),
        },
      });
    }
  }

  getNode = (id: string) => {
    return this.state.value.byId[id];
  };

  onSendOp = (op: NodeOp) => {
    const value = op(this.state.value);
    this.setState({
      value,
    });
  };

  render() {
    const { renderEditBlock } = this.props;
    const {
      value: { byId, rootNodeId },
    } = this.state as BlockEditorState;
    const rootNode = byId[rootNodeId] as BlockNode;

    // console.log('LAYOUT:', JSON.stringify(byId), JSON.stringify(rootNode));

    return (
      <div
        style={{
          position: 'relative',
          width: rootNode.width,
          height: rootNode.height,
        }}
      >
        {/* root component is a Col */}
        <DraggableColBlock
          key={'col_' + rootNode.id}
          node={rootNode}
          getNode={this.getNode}
          sendOp={this.onSendOp}
          focusedNodeId={this.state.value.focusedNodeId}
          renderEditBlock={renderEditBlock}
        />
      </div>
    );
  }
}
