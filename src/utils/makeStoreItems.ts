import { TIngredient } from '@utils-types';

export const makeStoreItems = (ingredients: TIngredient[]) => {
  let [buns, mains, sauces]: [TIngredient[], TIngredient[], TIngredient[]] = [
    [],
    [],
    []
  ];
  ingredients.forEach((el) => {
    if (el.type === 'bun') {
      buns.push(el);
    } else if (el.type === 'main') {
      mains.push(el);
    } else {
      sauces.push(el);
    }
  });

  return [buns, mains, sauces];
};
