// props that show whether we're being dragged or something is being dragged over us
export interface DragDropProps {
  //drag props
  isDragging: boolean;

  //drop props
  isOver: boolean;
  dragSourceItemType: string;
  dragSourceItemId: string;
  initialClientOffset: { x: number; y: number } | null;
  clientOffset: { x: number; y: number } | null;
  initialSourceClientOffset: { x: number; y: number } | null;
}
