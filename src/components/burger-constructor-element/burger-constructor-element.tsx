import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useSelector } from 'react-redux';
import {
  selectConstructorItems,
  setConstructorItem
} from '../../store/slices/rootSlice';
import { useDispatch } from '../../services/store';
import { TIngredient } from '@utils-types';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const data = useSelector(selectConstructorItems);
    const ingredients = data.ingredients;

    const makeNewItem = (type: string) => {
      const arr: TIngredient[] = Array.from(ingredients);
      const res = arr.filter((el) => el.order !== ingredient.order);
      if (type === 'down') {
        res.splice(index + 1, 0, ingredient);

        return res;
      } else if (type === 'up') {
        res.splice(index - 1, 0, ingredient);
        return res;
      }
      return res;
    };

    const handleMoveDown = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: { ...data, ingredients: makeNewItem('down') }
        })
      );
    };

    const handleMoveUp = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: { ...data, ingredients: makeNewItem('up') }
        })
      );
    };

    const handleClose = () => {
      dispatch(
        setConstructorItem({
          type: 'reloadIngridients',
          data: { ...data, ingredients: makeNewItem('delete') }
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
