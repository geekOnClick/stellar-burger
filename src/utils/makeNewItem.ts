import { v4 as uuidv4 } from 'uuid';
import { TIngredient } from '@utils-types';

export const makeNewItem = (
  type: string,
  ingredients: TIngredient[],
  ingredient: TIngredient,
  index: number
) => {
  const updatedIngredient = Object.assign({}, ingredient);
  updatedIngredient._id = uuidv4();
  const arr: TIngredient[] = Array.from(ingredients);
  arr.splice(index, 1);

  if (type === 'down') {
    arr.splice(index + 1, 0, updatedIngredient);

    return arr;
  } else if (type === 'up') {
    arr.splice(index - 1, 0, updatedIngredient);

    return arr;
  }

  return arr;
};
