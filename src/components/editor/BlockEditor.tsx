import * as React from 'react';
import { createElement as _createElement } from 'react';

import { BlockNode } from '../../data';
import { DraggableColBlock } from '../blocks/DraggableColBlock';
import { defaultRenderEditBlock } from '../blocks/ResizableBlock';
import { BlockEditorProps, BlockEditorValue } from './BlockEditorProps';

export interface BlockEditorState {
  value: BlockEditorValue;
}

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
    if (this.props.onChange && this.state.value !== prevState.value) {
      const { value } = this.state;
      this.props.onChange(value);
    } else if (
      this.props.value &&
      prevProps.value !== this.props.value &&
      this.props.value !== this.state.value
    ) {
      this.setState({ value: this.props.value });
    }
  }

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
          renderEditBlock={renderEditBlock}
          value={this.state.value}
          onChange={value => this.setState({ value })}
        />
      </div>
    );
  }
}
