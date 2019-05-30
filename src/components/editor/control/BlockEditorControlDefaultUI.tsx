import React from 'react';

import { SketchPicker } from 'react-color';
import { BlockEditorValue } from '../BlockEditorProps';
import { BlockBreadCrumbsProps, BlockBreadCrumbs } from './BlockBreadCrumbs';
import { BlockNode } from '../../../data';
import { move } from '../helpers';
import { addCol, addRow } from './addHelpers';

type BlockProp =
  | 'width'
  | 'height'
  | 'top'
  | 'left'
  | 'borderWidth'
  | 'borderBottomWidth'
  | 'borderStyle';

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
  undo: () => any;
  redo: () => any;
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
  selectedColor: string | null;
}

export class BlockEditorControlDefaultUI extends React.Component<
  BlockEditorControlUIProps,
  BlockEditorControlDefaultUIState
> {
  state = { selectedMenu: null, selectedColor: null };

  toggleMenu = (menu: MenuType) => {
    this.setState({
      selectedMenu: this.state.selectedMenu === menu ? null : menu,
    });

    if (menu === 'color' || menu === 'backgroundColor') {
      const {
        value: { byId, focusedNodeId },
      } = this.props;
      const selectedNode = focusedNodeId ? byId[focusedNodeId] : null;
      this.setState({
        selectedColor: selectedNode ? selectedNode.color : undefined,
      });
    }
  };

  renderColorMenuItem = (which: 'color' | 'backgroundColor') => {
    const {
      value: { byId, focusedNodeId },
    } = this.props;

    if (!focusedNodeId) return;
    const selectedNode = focusedNodeId ? byId[focusedNodeId] : null;
    return (
      <React.Fragment>
        <ColorButton
          onClick={() => this.toggleMenu(which)}
          color={selectedNode[which]}
        />
        {this.state.selectedMenu === which && (
          <div
            style={{
              position: 'absolute',
              zIndex: 100,
              backgroundColor: 'white',
            }}
          >
            <button
              className={this.props.buttonClassName}
              onClick={() => {
                this.props.updateBlock(focusedNodeId, { [which]: undefined });
                this.toggleMenu(which);
              }}
            >
              Clear
            </button>
            <button
              className={this.props.buttonClassName}
              onClick={() => {
                this.toggleMenu(which);
                this.props.updateBlock(focusedNodeId, {
                  [which]: this.state.selectedColor,
                });
              }}
            >
              Done
            </button>
            <SketchPicker
              color={this.state.selectedColor || undefined}
              onChangeComplete={({ hex }) => {
                this.setState({ selectedColor: hex });
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  render() {
    const {
      buttonClassName,
      breadCrumbsProps,
      value: { byId, focusedNodeId },
    } = this.props;

    const props = this.props;

    const focusedNode = focusedNodeId ? byId[focusedNodeId] : null;

    const { focusNode } = props;

    const handleBlockChange = (
      nodeId: string,
      prop: BlockProp,
      numeric: boolean
    ) => (event: { target: { value: string } }) => {
      props.updateBlock(nodeId, {
        [prop]: numeric
          ? event.target.value
            ? parseInt(event.target.value, 10)
            : undefined
          : event.target.value,
      });
    };

    const blockProps = [
      { prop: 'width', numeric: true },
      { prop: 'height', numeric: true },
      { prop: 'top', numeric: true },
      { prop: 'left', numeric: true },
      { prop: 'borderWidth', numeric: true },
      { prop: 'borderTopWidth', numeric: true },
      { prop: 'borderBottomWidth', numeric: true },
      { prop: 'borderLeftWidth', numeric: true },
      { prop: 'borderRightWidth', numeric: true },
      { prop: 'borderStyle', numeric: false },
    ] as Array<{ prop: BlockProp; numeric: boolean }>;

    const btnCls = buttonClassName;

    return (
      <div>
        <div>
          <button
            aria-label="add row"
            className={btnCls}
            onClick={() => props.addRow()}
          >
            + Row
          </button>
          <button
            aria-label="add column"
            className={btnCls}
            onClick={() => props.addCol()}
          >
            + Col
          </button>

          <button
            aria-label="add layer"
            className={btnCls}
            onClick={() => props.addLayer()}
          >
            + Layer
          </button>
          <button
            aria-label="add markdown"
            className={btnCls}
            onClick={() => props.addMarkDown()}
          >
            + Text
          </button>
          <button
            aria-label="add image"
            className={btnCls}
            onClick={() => props.addImage()}
          >
            + Image
          </button>
          <button
            aria-label="add image"
            className={btnCls}
            onClick={() => {
              props.onChange(addTable(props.value, props.value.focusedNodeId));
            }}
          >
            + Table
          </button>
          <button aria-label="undo" className={btnCls} onClick={props.undo}>
            Undo
          </button>
          <button aria-label="redo" className={btnCls} onClick={props.redo}>
            Redo
          </button>
        </div>

        {focusedNode && (
          <div style={{ paddingLeft: 15 }}>
            {this.renderColorMenuItem('color')}
            {this.renderColorMenuItem('backgroundColor')}
            <button
              className={btnCls}
              onClick={() => props.moveInDirection(focusedNode.id, 'left')}
            >
              ⬅️
            </button>
            <button
              className={btnCls}
              onClick={() => props.moveInDirection(focusedNode.id, 'right')}
            >
              ➡️
            </button>
            <button
              className={btnCls}
              onClick={() => props.moveInDirection(focusedNode.id, 'up')}
            >
              ⬆
            </button>
            <button
              className={btnCls}
              onClick={() => props.moveInDirection(focusedNode.id, 'down')}
            >
              ⬇
            </button>

            <button
              className={btnCls}
              onClick={() =>
                props.onChange(
                  flipToFront(props.value, props.value.focusedNodeId)
                )
              }
            >
              FlipToFront
            </button>
            <button
              aria-label="copy"
              className={btnCls}
              onClick={() => props.copyFocused()}
            >
              Copy
            </button>
            <button
              aria-label="paste"
              className={btnCls}
              onClick={() => props.paste()}
            >
              Paste
            </button>

            <button aria-label="delete" onClick={props.removeFocused}>
              🗑
            </button>
            <div>
              <BlockBreadCrumbs
                onSelect={nodeId => focusNode(nodeId, true)}
                byId={byId}
                node={focusedNode}
                {...breadCrumbsProps}
              />
            </div>
            <div style={{ paddingBottom: 20 }}>
              {blockProps.map(blockProp => (
                <div
                  key={blockProp.prop}
                  style={{ display: 'inline-block', marginRight: 10 }}
                  className="form-group"
                >
                  <label
                    style={{ marginRight: 5 }}
                    htmlFor={blockProp.prop}
                    className="form-label"
                  >
                    {blockProp.prop}
                  </label>
                  <input
                    name={blockProp.prop}
                    className="form-control"
                    key={'prop_' + blockProp.prop}
                    value={
                      focusedNode[blockProp.prop] === undefined
                        ? ''
                        : focusedNode[blockProp.prop]
                    }
                    onChange={handleBlockChange(
                      focusedNode.id,
                      blockProp.prop,
                      blockProp.numeric
                    )}
                    type={blockProp.numeric ? 'numeric' : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const ColorButton = (props: { color: string; onClick: () => any }) => (
  <button
    style={{
      borderWidth: 1,
      fontSize: 11,
      borderStyle: 'solid',
      justifyContent: 'flex-start',
    }}
    onClick={props.onClick}
  >
    <div style={{ display: 'flex' }}>
      <div
        style={{
          borderWidth: 1,
          borderRadius: 3,
          borderStyle: 'solid',
          width: 20,
          height: 20,
          backgroundColor: props.color || undefined,
        }}
      />
      &nbsp;{!props.color ? 'none' : ''}
    </div>
  </button>
);

function flipToFront(value: BlockEditorValue, nodeId: string | null) {
  if (!nodeId) return value;
  const { byId } = value;
  const node = byId[nodeId];
  if (!node) return value;
  const parentId = node.parentId;
  const parentNode = byId[parentId];
  if (!parentNode) return value;
  return move(value, nodeId, parentId, {
    afterItemId: parentNode.childrenIds[parentNode.childrenIds.length - 1],
  });
}

function addTable(value: BlockEditorValue, parentId: string | null) {
  if (!parentId) {
    alert('Please select node to add table to');
    return value;
  }
  let numRowsStr = window.prompt('Enter number or rows (max 10)', '5');
  if (numRowsStr === null) return value;
  let numColsStr = window.prompt('Enter number or columns (max 10)', '5');
  if (numColsStr === null) return value;
  let widthStr = window.prompt('Enter table width (max 400)', '300');
  if (widthStr === null) return value;
  let heightStr = window.prompt('Enter table height (max 400)', '300');
  if (heightStr === null) return value;

  const width = Math.min(parseInt(widthStr, 10), 400);
  const height = Math.min(parseInt(heightStr, 10), 400);

  const { value: newValue, createdBlock: table } = addCol(value, {
    width,
    height,
    parentId,
  });
  if (!table) return value;
  value = newValue;
  const tableId = table.id;

  const numRows = Math.max(1, Math.min(parseInt(numRowsStr, 10), 10));
  const numCols = Math.max(1, Math.min(parseInt(numColsStr, 10), 10));

  for (let i = 0; i < numRows; ++i) {
    const { value: newValue, createdBlock: row } = addRow(value, {
      height: height / numRows,
      parentId: tableId,
      // borderWidth: 0,
      // borderBottomWidth: i === 0 ? 1 : 0,
    });
    if (!row) break;
    value = newValue;
    for (let j = 0; j < numCols; ++j) {
      const { value: newValue, createdBlock: col } = addCol(value, {
        parentId: row.id,
        height: row.height,
        width: row.width / numCols,
        // borderWidth: 0,
        // borderRightWidth: j === numCols - 1 ? 0 : 1,
        // display: 'flex',
        // flexDirection: 'column',
        // justifyContent: 'center',
      });
      if (!col) break;
      value = newValue;
    }
  }
  return value;
}
