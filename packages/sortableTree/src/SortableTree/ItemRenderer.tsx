import {
  ID,
  ItemRendererProps,
  useDrag,
  useDrop,
  useIsClosestDragging,
} from 'react-sortly';
import React, { memo } from 'react';
import {
  Theme,
  IconButton,
  Box,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import ReorderIcon from '@material-ui/icons/Reorder';
import CloseIcon from '@material-ui/icons/Close';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';
import { Flipped } from 'react-flip-toolkit';

const useStyles = makeStyles<Theme, { muted: boolean; depth: number }>(
  (theme: Theme) => ({
    root: (props) => ({
      position: 'relative',
      marginBottom: theme.spacing(0.5),
      zIndex: props.muted ? 1 : 0,
    }),
    body: (props) => ({
      display: 'flex',
      background: '#fff',
      cursor: 'move',
      marginLeft: theme.spacing(props.depth * 2),
      boxShadow: props.muted ? '0px 0px 8px #666' : '0px 0px 2px #666',
      border: props.muted ? '1px dashed #1976d2' : '1px solid transparent',
    }),
  }),
);

type ItemItemRendererProps = ItemRendererProps<{
  title: string;
  isNew?: boolean;
}> & {
  onChangeName: (id: ID, title: string) => void;
  onDelete: (id: ID) => void;
  onReturn: (id: ID) => void;
};

const ItemRenderer = memo((props: ItemItemRendererProps) => {
  const {
    id,
    depth,
    data: { title, isNew },
    onChangeName,
    onDelete,
    onReturn,
  } = props;
  const [{ isDragging }, drag, preview] = useDrag({
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop();

  const classes = useStyles({
    muted: useIsClosestDragging() || isDragging,
    depth,
  });

  const handleClickDelete = () => {
    onDelete(id);
  };
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (e.key === 'Enter') {
      onReturn(id);
    }
  };

  //const [handleChangeName] = useDebouncedCallback(onChangeName, 500);
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    onChangeName(id, e.target.value);
  };

  return (
    <Flipped flipId={id}>
      <div ref={(ref) => drop(preview(ref))} className={classes.root}>
        <div className={classes.body}>
          <IconButton ref={drag}>
            <ReorderIcon />
          </IconButton>
          <Box display="flex" flex={1} px={1}>
            <InputBase
              fullWidth
              defaultValue={title}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              autoFocus={isNew}
            />
          </Box>
          <IconButton onClick={handleClickDelete}>
            <AspectRatioIcon />
          </IconButton>
          <IconButton onClick={handleClickDelete}>
            <CloseIcon />
          </IconButton>
        </div>
        <div className={classes.body}>
          sdasfasfsagfddfgdfgdfgdfgdfgdfgdfgfdgdfgfdgfdgfd
        </div>
      </div>
    </Flipped>
  );
});

export { ItemRenderer };
