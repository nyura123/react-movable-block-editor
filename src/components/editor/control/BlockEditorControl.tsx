import * as React from 'react';

import { BlockNode } from '../../../data';
import {
  BlockEditorValue,
  move,
  create,
  update,
  destroy,
  focusNode,
  moveInDirection,
} from '../BlockEditorProps';
import { addCol, addMarkDown, addImage, addLayer, addRow } from './helpers';
import {
  BlockEditorControlUIProps,
  BlockEditorControlDefaultUI,
} from './BlockEditorControlDefaultUI';

export interface BlockEditorControlProps {
  value: BlockEditorValue;
  onChange: (value: BlockEditorValue) => any;
  controlUiProps?: Partial<BlockEditorControlUIProps>;
  UiComponent:
    | React.SFC<BlockEditorControlUIProps>
    | React.ComponentClass<BlockEditorControlUIProps>;
}

export class BlockEditorControl extends React.Component<
  BlockEditorControlProps
> {
  static defaultProps = {
    UiComponent: BlockEditorControlDefaultUI,
  };

  addRow = (props?: Partial<BlockNode>) => {
    const { error, value } = addRow(this.props.value, props);
    if (error) {
      alert(error);
      return;
    }
    this.props.onChange(value);
  };

  addCol = (props?: Partial<BlockNode>) => {
    const { error, value } = addCol(this.props.value, props);
    if (error) {
      alert(error);
      return;
    }
    this.props.onChange(value);
  };

  addMarkDown = (props?: Partial<BlockNode>) => {
    const { error, value } = addMarkDown(this.props.value, props);
    if (error) {
      alert(error);
      return;
    }
    this.props.onChange(value);
  };

  addImage = (props?: Partial<BlockNode>) => {
    const { error, value } = addImage(this.props.value, props);
    if (error) {
      alert(error);
      return;
    }
    this.props.onChange(value);
  };

  addLayer = (props?: Partial<BlockNode>) => {
    const { error, value } = addLayer(this.props.value, props);
    if (error) {
      alert(error);
      return;
    }
    this.props.onChange(value);
  };

  removeFocused = () => {
    let { focusedNodeId } = this.props.value;
    if (focusedNodeId) {
      this.destroy(focusedNodeId);
    }
  };

  focusNode = (node: BlockNode, focus = true) => {
    const { value } = this.props;
    (this.props.onChange as any)(focusNode(value, node, focus));
  };

  create = (props: Partial<BlockNode>) => {
    this.props.onChange(create(this.props.value, props));
  };

  updateBlock = (nodeId: string, propsToUpdate: Partial<BlockNode>) => {
    this.props.onChange(update(this.props.value, nodeId, propsToUpdate));
  };

  destroy = (nodeId: string) => {
    this.props.onChange(destroy(this.props.value, nodeId));
  };

  move = (
    nodeId: string,
    targetParentId: string,
    opts: {
      beforeItemId?: string;
      afterItemId?: string;
      isPlaceHolder?: boolean;
      absolutePos?: { left: number; top: number };
    } = {}
  ) => {
    this.props.onChange(move(this.props.value, nodeId, targetParentId, opts));
  };

  moveInDirection = (
    nodeId: string,
    direction: 'left' | 'right' | 'up' | 'down'
  ) => {
    this.props.onChange(
      moveInDirection(this.props.value, nodeId, { direction })
    );
  };

  copyFocused = () => {
    const {
      value: { byId, focusedNodeId },
    } = this.props;
    if (focusedNodeId) {
      const focusedNode = byId[focusedNodeId];
      this.props.onChange({
        ...this.props.value,
        copiedNode: { ...focusedNode },
      });
    }
  };

  // TODO: deep pasting, for now just parent block
  paste = () => {
    const {
      value: { copiedNode },
    } = this.props;
    if (copiedNode && copiedNode.parentId) {
      switch (copiedNode.type) {
        case 'row':
          this.addRow(copiedNode);
          break;
        case 'col':
          this.addCol(copiedNode);
          break;
        case 'image':
          this.addImage(copiedNode);
          break;
        case 'markdown':
          this.addMarkDown(copiedNode);
          break;
        case 'layer':
          this.addLayer(copiedNode);
          break;
      }
    }
  };

  render() {
    const { UiComponent, onChange, value, controlUiProps } = this.props;

    return (
      <UiComponent
        value={value}
        onChange={onChange}
        addRow={this.addRow}
        addCol={this.addCol}
        addImage={this.addImage}
        addLayer={this.addLayer}
        addMarkDown={this.addMarkDown}
        moveInDirection={this.moveInDirection}
        copyFocused={this.copyFocused}
        paste={this.paste}
        focusNode={(nodeId: string, focus: boolean) =>
          this.focusNode(value.byId[nodeId], focus)
        }
        removeFocused={this.removeFocused}
        updateBlock={this.updateBlock}
        {...controlUiProps}
      />
    );
  }
}
