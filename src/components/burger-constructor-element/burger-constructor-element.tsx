import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useSelector } from 'react-redux';
import {
  selectConstructorItems,
  setConstructorItem
} from '../../store/slices/burgerSlice';
import { useDispatch } from '../../services/store';
import { makeNewItem } from '../../utils/makeNewItem';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const data = useSelector(selectConstructorItems);
    const ingredients = data.ingredients;

    const handleMoveDown = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: {
            ...data,
            ingredients: makeNewItem('down', ingredients, ingredient, index)
          }
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: {
            ...data,
            ingredients: makeNewItem('up', ingredients, ingredient, index)
          }
        })
      );
    };

    const handleClose = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: {
            ...data,
            ingredients: makeNewItem('delete', ingredients, ingredient, index)
          }
        })
      );
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
