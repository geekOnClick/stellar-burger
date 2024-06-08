import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useDispatch, useSelector } from '../../services/store';
import {
  loadIngridient,
  selectIngredients,
  selectItem,
  setSelectItem
} from '../../store/slices/rootSlice';
import { useParams } from 'react-router-dom';

type TIngredientDetails = {
  background?: null | {
    pathname: string;
    search: string;
    hash: string;
    state: null | string;
    key: string;
  };
};

export const IngredientDetails: FC<TIngredientDetails> = ({ background }) => {
  const ingredientData = useSelector(selectItem);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (background === null) {
      dispatch(loadIngridient(params?.id || ''));
    }
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
