import React, { useState } from 'react';

import {
  BlockBreadCrumbs,
  BlockEditorControlUIProps,
  newBlockId,
  placeNodeInParent,
  addCol,
  addRow,
  move,
  BlockEditorValue,
  BlockNode,
} from 'react-movable-block-editor';

import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowLeftIcon from '@material-ui/icons/ArrowBack';
import FlipToFront from '@material-ui/icons/FlipToFront';
import ArrowRightIcon from '@material-ui/icons/ArrowForward';
import ArrowUpIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownIcon from '@material-ui/icons/ArrowDownward';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';

import TransparentPng from './transparent.png';

import { SketchPicker } from 'react-color';

type BlockProp =
  | 'width'
  | 'height'
  | 'top'
  | 'left'
  | 'borderWidth'
  | 'borderBottomWidth'
  | 'borderStyle';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  fab: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 60,
  },
  input: {
    display: 'none',
  },
}));

export type MenuType = 'color' | 'backgroundColor';

export interface BlockEditorControlDefaultUIState {
  selectedMenu: MenuType | null;
}

// Create our own menu bar
export const CustomEditorToolBar: React.SFC<BlockEditorControlUIProps> = (
  props: BlockEditorControlUIProps
) => {
  const {
    breadCrumbsProps,
    value: { byId, focusedNodeId },
  } = props;

  const selectedNode = focusedNodeId ? byId[focusedNodeId] : null;

  const [selectedMenu, setSelectedMenu] = useState<MenuType | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    selectedNode ? selectedNode.color : undefined
  );
  const classes = useStyles();

  if (!focusedNodeId) return null;

  const toggleMenu = (menu: MenuType) => {
    setSelectedMenu(selectedMenu === menu ? null : menu);
  };

  const renderColorMenuItem = (which: 'color' | 'backgroundColor') => {
    return (
      <React.Fragment>
        <ColorButton
          onClick={() => toggleMenu(which)}
          color={selectedNode[which]}
        />
        {selectedMenu === which && (
          <div
            style={{
              position: 'absolute',
              zIndex: 100,
              backgroundColor: 'white',
            }}
          >
            <Button
              size="small"
              color="secondary"
              onClick={() => {
                props.updateBlock(focusedNodeId, { [which]: undefined });
                toggleMenu(which);
              }}
            >
              Clear
            </Button>
            <Button
              size="small"
              color="primary"
              onClick={() => {
                toggleMenu(which);
                props.updateBlock(focusedNodeId, { [which]: selectedColor });
              }}
            >
              Done
            </Button>
            <SketchPicker
              color={selectedColor}
              onChangeComplete={({ hex }) => {
                setSelectedColor(hex);
              }}
            />
          </div>
        )}
      </React.Fragment>
    );
  };

  const focusedNode = focusedNodeId ? byId[focusedNodeId] : null;

  const { focusNode } = props;

  const btnCls = classes.button;

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
    { prop: 'borderTopWidth', label: 'bTopW', numeric: true },
    { prop: 'borderBottomWidth', label: 'bBottomW', numeric: true },
    { prop: 'borderLeftWidth', label: 'bLeftW', numeric: true },
    { prop: 'borderRightWidth', label: 'bRightW', numeric: true },
    { prop: 'borderStyle', numeric: false },
  ] as Array<{ prop: BlockProp; label?: string; numeric: boolean }>;

  return (
    <div>
      <div>
        <Tooltip
          title="Add Row (position children horizontally)"
          aria-label="Add"
        >
          <Button
            aria-label="add row"
            className={btnCls}
            onClick={() => props.addRow()}
          >
            + Row
          </Button>
        </Tooltip>
        <Tooltip
          title="Add Col (position children vertically)"
          aria-label="Add"
        >
          <Button
            aria-label="add column"
            className={btnCls}
            onClick={() => props.addCol()}
          >
            + Col
          </Button>
        </Tooltip>

        <Tooltip
          title="Add Layer (position children absolutely)"
          aria-label="Add"
        >
          <Button
            aria-label="add layer"
            className={btnCls}
            onClick={() => props.addLayer()}
          >
            + Layer
          </Button>
        </Tooltip>
        <Tooltip title="Add Text (markdown)" aria-label="Add">
          <Button
            aria-label="add markdown"
            className={btnCls}
            onClick={() => props.addMarkDown()}
          >
            + Text
          </Button>
        </Tooltip>
        <Button
          aria-label="add image"
          className={btnCls}
          onClick={() => props.addImage()}
        >
          + Image
        </Button>
        <Button
          aria-label="add image"
          className={btnCls}
          onClick={() => {
            props.onChange(addTable(props.value, props.value.focusedNodeId));
          }}
        >
          + Table
        </Button>
        <Button
          aria-label="add image"
          className={btnCls}
          onClick={() => {
            props.onChange(addInput(props.value, props.value.focusedNodeId));
          }}
        >
          + Input
        </Button>
        <Button aria-label="undo" className={btnCls} onClick={props.undo}>
          Undo
        </Button>
        <Button aria-label="redo" className={btnCls} onClick={props.redo}>
          Redo
        </Button>
      </div>

      {focusedNode && (
        <div style={{ paddingLeft: 15 }}>
          {renderColorMenuItem('color')}
          {renderColorMenuItem('backgroundColor')}
          <Button
            className={btnCls}
            onClick={() => props.moveInDirection(focusedNode.id, 'left')}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            className={btnCls}
            onClick={() => props.moveInDirection(focusedNode.id, 'right')}
          >
            <ArrowRightIcon />
          </Button>
          <Button
            className={btnCls}
            onClick={() => props.moveInDirection(focusedNode.id, 'up')}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            className={btnCls}
            onClick={() => props.moveInDirection(focusedNode.id, 'down')}
          >
            <ArrowDownIcon />
          </Button>

          <Tooltip title="Flip to front" aria-label="Add">
            <Button
              className={btnCls}
              onClick={() =>
                props.onChange(
                  flipToFront(props.value, props.value.focusedNodeId)
                )
              }
            >
              <FlipToFront />
            </Button>
          </Tooltip>

          <Button
            aria-label="copy"
            className={btnCls}
            onClick={() => props.copyFocused()}
          >
            Copy
          </Button>
          <Button
            aria-label="paste"
            className={btnCls}
            onClick={() => props.paste()}
          >
            Paste
          </Button>

          <Button
            aria-label="delete"
            className={classes.fab}
            onClick={props.removeFocused}
          >
            <DeleteIcon />
          </Button>
          <Tooltip
            title="Click breadcrumb to change focused block"
            aria-label="Add"
          >
            <Button>
              <BlockBreadCrumbs
                onSelect={nodeId => focusNode(nodeId, true)}
                byId={byId}
                node={focusedNode}
                {...breadCrumbsProps}
              />
            </Button>
          </Tooltip>
          <div style={{ paddingBottom: 5 }}>
            {blockProps.map(blockProp => (
              <TextField
                key={'prop_' + blockProp.prop}
                label={blockProp.label || blockProp.prop}
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
                type={blockProp.numeric ? 'number' : undefined}
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ColorButton = (props: { color: string; onClick: () => any }) => (
  <div
    onClick={props.onClick}
    style={{
      display: 'inline-block',
      marginTop: 10,
      marginRight: 10,
      borderWidth: 1,
      borderRadius: 3,
      borderStyle: 'solid',
      width: 20,
      height: 20,
      backgroundColor: props.color || undefined,
    }}
  >
    {props.color === undefined && (
      <img
        alt="transparent-color"
        style={{ width: 20, height: 20 }}
        src={TransparentPng}
      />
    )}
  </div>
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

function addInput(value: BlockEditorValue, parentId: string | null) {
  const { byId } = value;
  const parentNode = parentId ? byId[parentId] : null;
  if (!parentId || !parentNode) {
    alert('Please select node to add input to');
    return value;
  }
  let newNodeId = newBlockId(byId, 'input');

  const input: BlockNode = {
    type: 'custom',
    customType: 'input',
    height: 40,
    width: 100,
    id: newNodeId,
    name: newNodeId,
    childrenIds: [],
  };
  return {
    ...value,
    byId: placeNodeInParent(byId, input, parentId),
    focusedNodeId: value.focusedNodeId || input.id,
  };
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
    });
    if (!row) break;
    value = newValue;
    for (let j = 0; j < numCols; ++j) {
      const { value: newValue, createdBlock: col } = addCol(value, {
        parentId: row.id,
        height: row.height,
        width: row.width / numCols,
      });
      if (!col) break;
      value = newValue;
    }
  }
  return value;
}
