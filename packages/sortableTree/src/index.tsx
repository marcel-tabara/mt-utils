import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Sortly, {
  ContextProvider,
  useDrag,
  useDrop,
  ID,
  ItemData,
  add,
  remove,
  insert,
} from './SortableTree';

import { Flipper } from 'react-flip-toolkit';
import { Box, Button } from '@material-ui/core';
import update from 'immutability-helper';
import { ItemRenderer } from './ItemRenderer';

type Item = {
  name: string;
  isNew?: boolean;
};
const ITEMS: ItemData<Item>[] = [
  { id: 1, name: 'Priscilla Cormier', depth: 0 },
  { id: 2, name: 'Miss Erich Bartoletti', depth: 0 },
  // { id: 3, name: 'Alison Friesen', depth: 1 },
  // { id: 4, name: 'Bernita Mayert', depth: 2 },
  // { id: 5, name: 'Garfield Berge', depth: 0 },
];

const MySortableTree = () => {
  const [items, setItems] = React.useState(ITEMS);
  const handleChange = (newItems: ItemData<Item>[]) => {
    setItems(newItems);
  };
  const handleChangeName = (id: ID, name: string) => {
    const index = items.findIndex((item) => item.id === id);
    setItems(
      update(items, {
        [index]: { name: { $set: name } },
      }),
    );
  };
  const handleDelete = (id: ID) => {
    const index = items.findIndex((item) => item.id === id);
    setItems(remove(items, index));
  };
  const handleClickAdd = () => {
    setItems(
      add(items, {
        id: Date.now(),
        name: 'asa',
        isNew: true,
      }),
    );
  };
  const handleReturn = (id: ID) => {
    const index = items.findIndex((item) => item.id === id);
    setItems(
      insert(
        items,
        {
          id: Date.now(),
          name: 'ada',
          isNew: true,
        },
        index,
      ),
    );
  };

  return (
    <Box width={{ md: 600 }}>
      <Flipper flipKey={items.map(({ id }) => id).join('.')}>
        <Sortly items={items} onChange={handleChange}>
          {(props) => (
            <ItemRenderer
              {...props}
              onChangeName={handleChangeName}
              onDelete={handleDelete}
              onReturn={handleReturn}
            />
          )}
        </Sortly>
      </Flipper>
      <Box mt={4}>
        <Button variant="outlined" onClick={handleClickAdd}>
          Add New Item
        </Button>
      </Box>
    </Box>
  );
};

const SortableTree = () => (
  <DndProvider backend={HTML5Backend}>
    <ContextProvider>
      <MySortableTree />
    </ContextProvider>
  </DndProvider>
);

export { SortableTree };
