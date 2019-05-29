import React, { useState } from 'react';

import {
  BlockBreadCrumbs,
  BlockEditorControlUIProps,
  addCol,
  addRow,
  addLayer,
  move,
  BlockEditorValue,
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
import TransparentPng from './transparent.png';

import { SketchPicker } from 'react-color';

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
          title="Click a cell, then add layer to create a sticky part"
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

export function addGrid(
  value: BlockEditorValue,
  parentId: string | null,
  opts:
    | { numRows: number; numCols: number; width: number; height: number }
    | undefined = undefined
) {
  const colors = [
    '#D0021B',
    '#F5A623',
    '#4A90E2',
    '#F8E71C',
    '#50E3C2',
    '#417505',
    '#8B572A',
    '#B8E986',
  ];
  let colorIdx = 0;

  if (!parentId) {
    alert('Please select node to add table to');
    return value;
  }

  let numRowsStr = opts
    ? opts.numRows + ''
    : window.prompt('Enter number or rows (max 10)', '3');
  if (numRowsStr === null) return value;
  let numColsStr = opts
    ? opts.numCols + ''
    : window.prompt('Enter number or columns (max 10)', '3');
  if (numColsStr === null) return value;
  let widthStr = opts
    ? opts.width + ''
    : window.prompt('Enter table width (max 400)', '500');
  if (widthStr === null) return value;
  let heightStr = opts
    ? opts.height + ''
    : window.prompt('Enter table height (max 400)', '500');
  if (heightStr === null) return value;

  const width = Math.min(parseInt(widthStr, 10), 500);
  const height = Math.min(parseInt(heightStr, 10), 500);

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
      width,
      parentId: tableId,
    });
    if (!row) break;
    value = newValue;
    for (let j = 0; j < numCols; ++j) {
      const { value: newValue2, createdBlock: content } = addCol(value, {
        parentId: row.id,
        backgroundColor: colors[colorIdx++ % colors.length],
        height: Math.max(1, row.height - 20),
        width: Math.max(1, row.width / numCols),
        value: { type: 'myGridCell', text: `i=${i},j=${j}` },
      });
      if (!content) break;
      value = newValue2;

      // Slot for our content to accept sticky content...
      const { value: newValue3, createdBlock: layer } = addLayer(value, {
        parentId: content.id,
        width: 50,
        height: 50,
      });
      if (!layer) break;
      value = newValue3;
    }
  }
  return value;
}
