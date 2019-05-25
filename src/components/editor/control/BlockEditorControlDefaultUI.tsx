import * as React from 'react';

import { SketchPicker } from 'react-color';
import { BlockBreadCrumbs, BlockBreadCrumbsProps } from './BlockBreadCrumbs';
import { BlockEditorValue } from '../BlockEditorProps';
import { BlockNode } from '../../../data';

export type MenuType = 'color' | 'backgroundColor';

export interface BlockEditorControlUIProps {
  // the only prop really required to change value in onChange
  value: BlockEditorValue;
  onChange: (value: BlockEditorValue) => any;

  buttonClassName?: string;
  breadCrumbsProps?: Partial<BlockBreadCrumbsProps>;

  // helpers: convenience methods for changing BlockEditorValue
  addRow: () => any;
  addCol: () => any;
  addImage: () => any;
  addLayer: () => any;
  addMarkDown: () => any;
  copyFocused: () => any;
  paste: () => any;
  focusNode: (nodeId: string, focus: boolean) => any;
  removeFocused: () => any;
  updateBlock: (nodeId: string, propsToUpdate: Partial<BlockNode>) => any;
  moveInDirection: (
    nodeId: string,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => any;
}

export interface BlockEditorControlDefaultUIState {
  selectedMenu: MenuType | null;
}

export class BlockEditorControlDefaultUI extends React.Component<
  BlockEditorControlUIProps,
  BlockEditorControlDefaultUIState
> {
  state = {
    selectedMenu: null,
  };

  static defaultProps = {
    buttonClassName: 'btn btn default',
  };

  toggleMenu(menu: MenuType) {
    this.setState({
      selectedMenu: this.state.selectedMenu === menu ? null : menu,
    });
  }

  renderColorMenuItem = (which: 'color' | 'backgroundColor', label: string) => {
    const {
      value: { byId, focusedNodeId },
    } = this.props;
    const { selectedMenu } = this.state;
    if (!focusedNodeId) return;
    const selectedNode = focusedNodeId ? byId[focusedNodeId] : null;
    return (
      <React.Fragment>
        <div
          style={{
            borderStyle: 'solid',
            borderWidth: 1,
            backgroundColor: selectedNode[which] || 'transparent',
          }}
          onClick={_e => this.toggleMenu(which)}
        >
          {label}
        </div>
        {selectedMenu === which && (
          <div style={{ position: 'absolute', zIndex: 100 }}>
            <SketchPicker
              color={selectedNode[which] || undefined}
              onChange={({ hex }) => {
                this.props.updateBlock(focusedNodeId, { [which]: hex });
                this.toggleMenu(which);
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      buttonClassName: btnCls,
      breadCrumbsProps,
      value: { byId, rootNodeId, focusedNodeId },
    } = this.props;

    const focusedNode = focusedNodeId
      ? byId[focusedNodeId]
      : rootNodeId || null;

    const { focusNode } = this.props;

    return (
      <div>
        <div>
          <button className={btnCls} onClick={() => this.props.addRow()}>
            Add Row
          </button>
          <button className={btnCls} onClick={() => this.props.addCol()}>
            Add Col
          </button>
          <button className={btnCls} onClick={this.props.removeFocused}>
            Remove Selected
          </button>
          <button className={btnCls} onClick={() => this.props.addMarkDown()}>
            Add Markdown
          </button>
          <button className={btnCls} onClick={() => this.props.addImage()}>
            Add Image
          </button>
          <button className={btnCls} onClick={() => this.props.addLayer()}>
            Add Layer
          </button>
        </div>
        <div>
          <button className={btnCls} onClick={() => this.props.copyFocused()}>
            Copy
          </button>
          <button className={btnCls} onClick={() => this.props.paste()}>
            Paste
          </button>
        </div>

        {focusedNode && (
          <div>
            {this.renderColorMenuItem('color', 'Text')}
            {this.renderColorMenuItem('backgroundColor', 'Background')}
            <BlockBreadCrumbs
              onSelect={nodeId => focusNode(nodeId, true)}
              byId={byId}
              node={focusedNode}
              {...breadCrumbsProps}
            />
            <button
              className={btnCls}
              onClick={() => this.props.moveInDirection(focusedNode.id, 'up')}
            >
              Move Up
            </button>
            <button
              className={btnCls}
              onClick={() => this.props.moveInDirection(focusedNode.id, 'down')}
            >
              Move Down
            </button>
            <button
              className={btnCls}
              onClick={() => this.props.moveInDirection(focusedNode.id, 'left')}
            >
              Move Left
            </button>
            <button
              className={btnCls}
              onClick={() =>
                this.props.moveInDirection(focusedNode.id, 'right')
              }
            >
              Move Right
            </button>
          </div>
        )}
      </div>
    );
  }
}
