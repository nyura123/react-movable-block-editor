import * as React from 'react';
import { createElement as _createElement } from 'react';

import { BlockNode } from '../../data';
import { DraggableColBlock } from '../blocks/DraggableColBlock';
import { defaultRenderEditBlock } from '../blocks/ResizableBlock';
import { BlockEditorProps, BlockEditorValue } from './BlockEditorProps';

import { cloneDeep } from 'lodash';
import { NodeOp } from '../blocks/BlockProps';

import { DndProvider } from 'react-dnd';
import Html5Backend from 'react-dnd-html5-backend';
import TouchBackend from 'react-dnd-touch-backend';

export interface BlockEditorState {
  value: BlockEditorValue;
}

const maxUndoStack = 10;

export class BlockEditor extends React.Component<
  BlockEditorProps,
  BlockEditorState
> {
  haveHtml5DndAPI = haveDraggableHtml5API();

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
      value: { byId, rootNodeId, undoRedoVersion },
    } = this.state as BlockEditorState;
    const rootNode = byId[rootNodeId] as BlockNode;

    const Backend = this.haveHtml5DndAPI ? Html5Backend : TouchBackend;

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
        <DndProvider backend={Backend}>
          <DraggableColBlock
            key={'col_' + rootNode.id}
            undoRedoVersion={undoRedoVersion}
            node={rootNode}
            getNode={this.getNode}
            changeBlocks={this.onSendOp}
            focusedNodeId={this.state.value.focusedNodeId}
            renderEditBlock={renderEditBlock}
          />
        </DndProvider>
      </div>
    );
  }
}

// https://stackoverflow.com/questions/2856262/detecting-html5-drag-and-drop-support-in-javascript
function haveDraggableHtml5API() {
  const iOS =
    !!navigator.userAgent.match('iPhone OS') ||
    !!navigator.userAgent.match('iPad');
  if (iOS) return false;

  const div = window.document.createElement('div');
  return 'draggable' in div || ('ondragstart' in div && 'ondrop' in div);
}
