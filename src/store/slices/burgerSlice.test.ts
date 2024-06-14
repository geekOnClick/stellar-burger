import { TIngredient, TOrder, TUser } from '@utils-types';
import {
  burgerActions,
  burgerReducer,
  initialState,
  loadFeedData,
  loadIngridients,
  loadOrder,
  loadOrders,
  loadUser,
  logout,
  updateUser
} from './burgerSlice';
import { makeNewItem } from '../../utils/makeNewItem';
import { makeStoreItems } from '../../utils/makeStoreItems';
import { TLoginData, TRegisterData } from '@api';

describe('burgerConstructor', () => {
  const bun: TIngredient = {
    _id: '1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  };

  const ingredient_1: TIngredient = {
    _id: '2',
    name: 'Ingredient 1',
    type: 'mains',
    proteins: 2,
    fat: 1,
    carbohydrates: 5,
    calories: 50,
    price: 10,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  };

  const emptyStoreIngredients = {
    buns: [],
    mains: [],
    sauces: []
  };

  it('Добавление элемента bun', () => {
    const action = burgerActions.setConstructorItem(bun);
    const newState = burgerReducer(initialState, action);

    expect(newState.constructorItems.bun).toEqual(expect.objectContaining(bun));
  });

  it('Добавление элемента ingredients', () => {
    let newState = burgerReducer(
      initialState,
      burgerActions.setConstructorItem(ingredient_1)
    );

    expect(newState.constructorItems.ingredients).toHaveLength(1);
    expect(newState.constructorItems.ingredients[0]).toEqual(
      expect.objectContaining(ingredient_1)
    );
  });

  it('Удаление элемента ingredients', () => {
    const stateWithIngredients = {
      ...initialState,
      ingredients: emptyStoreIngredients
    };
    const action = burgerActions.setConstructorItem({
      type: 'reloadIngridients',
      data: {
        ingredient_1,
        ingredients: makeNewItem('delete', [ingredient_1], ingredient_1, 0)
      }
    });
    const newState = burgerReducer(stateWithIngredients, action);

    expect(newState.ingredients).toEqual(
      expect.objectContaining(emptyStoreIngredients)
    );
  });
});

describe('ingredients', () => {
  const emptyStoreIngredients = {
    buns: [],
    mains: [],
    sauces: []
  };
  it('Переводит статус isIngredientsLoading в true во время загрузки ', () => {
    const actualState = burgerReducer(
      initialState,
      loadIngridients.pending('')
    );

    expect(actualState).toEqual({
      ...initialState,
      ingredients: emptyStoreIngredients,
      isIngredientsLoading: true
    });
  });

  it('Обновляет список ингридиентов после успешной загрузки', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Ingredient 1',
        type: 'main',
        proteins: 2,
        fat: 1,
        carbohydrates: 5,
        calories: 50,
        price: 10,
        image: 'image',
        image_large: 'image_large',
        image_mobile: 'image_mobile'
      }
    ];

    const actualState = burgerReducer(
      {
        ...initialState,
        isIngredientsLoading: true
      },
      loadIngridients.fulfilled(ingredients, '')
    );

    let [buns, mains, sauces] = makeStoreItems(ingredients);

    expect(actualState).toEqual({
      ...initialState,
      ingredients: { buns, mains, sauces },
      isIngredientsLoading: false
    });
  });

  it('Сбрасывает состояние ингридиентов до изначального в случае провала загрузки', () => {
    const error = 'Failed to fetch ingredients';
    const actualState = burgerReducer(
      initialState,
      loadIngridients.rejected(new Error(error), '')
    );

    expect(actualState).toEqual({
      ...initialState,
      ingredients: emptyStoreIngredients,
      isIngredientsLoading: false
    });
  });
});

describe('feed', () => {
  it('Переводит статус isLoading в true во время загрузки ', () => {
    const actualState = burgerReducer(initialState, loadFeedData.pending(''));

    expect(actualState.isLoading).toBe(true);
  });

  it('Обновляет ключ feedData в хранилище в случае успешной загрузки', () => {
    const feedData = {
      success: true,
      orders: [
        {
          _id: '1',
          ingredients: ['1', '2'],
          status: 'done',
          name: 'Order 1',
          createdAt: '123',
          updatedAt: '123',
          number: 1
        }
      ],
      total: 100,
      totalToday: 10
    };

    const actualState = burgerReducer(
      {
        ...initialState,
        isLoading: false
      },
      loadFeedData.fulfilled(feedData, '')
    );

    expect(actualState.feedData).toEqual({
      orders: feedData.orders,
      total: feedData.total,
      totalToday: feedData.totalToday,
      success: true
    });
  });

  it('Сбрасывает состояние feedData до изначального в случае провала загрузки', () => {
    const error = 'Failed to fetch feeds';
    const actualState = burgerReducer(
      initialState,
      loadFeedData.rejected(new Error(error), '')
    );

    expect(actualState.feedData).toEqual(initialState.feedData);
  });
});

describe('orders', () => {
  it('Переводит статус isLoading в true во время загрузки ', () => {
    const actualState = burgerReducer(initialState, loadOrders.pending(''));

    expect(actualState.isLoading).toBe(true);
  });

  it('Обновляет ключ orders в хранилище в случае успешной загрузки', () => {
    const orders: TOrder[] = [
      {
        _id: '1',
        ingredients: ['1', '2'],
        status: 'done',
        name: 'Order 1',
        createdAt: '123',
        updatedAt: '123',
        number: 1
      }
    ];

    const actualState = burgerReducer(
      {
        ...initialState,
        orders: []
      },
      loadOrders.fulfilled(orders, '')
    );

    expect(actualState).toEqual({
      ...actualState,
      orders: orders
    });
  });

  it('Сбрасывает состояние orders до изначального в случае провала загрузки', () => {
    const error = 'Failed to fetch orders';
    const actualState = burgerReducer(
      initialState,
      loadOrders.rejected(new Error(error), '')
    );

    expect(actualState).toEqual({
      ...actualState,
      orders: []
    });
  });
});

describe('order', () => {
  const emptyOrder = {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  };

  const orders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Order 1',
      createdAt: '123',
      updatedAt: '123',
      number: 1
    }
  ];

  it('Переводит статус isLoading в true во время загрузки ', () => {
    const actualState = burgerReducer(initialState, loadOrder.pending('', 1));

    expect(actualState.isLoading).toBe(true);
  });

  it('Обновляет ключ selectedOrder в хранилище в случае успешной загрузки', () => {
    const actualState = burgerReducer(
      {
        ...initialState,
        selectedOrder: emptyOrder
      },
      loadOrder.fulfilled({ orders, success: true }, '', 1)
    );

    expect(actualState).toEqual({
      ...actualState,
      selectedOrder: orders[0]
    });
  });

  it('Сбрасывает состояние selectedOrder до изначального в случае провала загрузки', () => {
    const error = 'Failed to order burger';
    const actualState = burgerReducer(
      {
        ...initialState
      },
      loadOrder.rejected(new Error(error), '', 1)
    );

    expect(actualState).toEqual({
      ...actualState,
      selectedOrder: emptyOrder
    });
  });
});

describe('user', () => {
  const user: TUser = {
    email: 'testuser@example.com',
    name: 'Test User'
  };

  const updatedUser: TRegisterData = {
    email: 'updated@example.com',
    name: 'Updated User',
    password: 'password333'
  };

  it('Изменяет статус isAuthChecked во время загрузки пользователя', () => {
    const actualState = burgerReducer(initialState, loadUser.pending(''));

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: false,
      user: null
    });
  });

  it('Обновляет ключ user в хранилище в случае успешной загрузки', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      loadUser.fulfilled({ success: true, user }, '')
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user
    });
  });

  it('Сбрасывает состояние user до изначального в случае провала загрузки', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      loadUser.rejected(new Error('Failed to fetch user'), '')
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user: null
    });
  });

  it('Изменяет статус isAuthChecked во время разлогина пользователя', () => {
    const actualState = burgerReducer(initialState, logout.pending(''));

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: false,
      user: null
    });
  });

  it('Обновляет ключ user в хранилище в случае успешного разлогина', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      logout.fulfilled(undefined, '')
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user: null
    });
  });

  it('Сбрасывает состояние user до изначального в случае провала разлогина', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      logout.rejected(new Error('Failed to fetch user'), '')
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user: null
    });
  });

  it('Изменяет статус isAuthChecked во время загрузки пользователя', () => {
    const actualState = burgerReducer(
      initialState,
      updateUser.pending('', updatedUser)
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: false,
      user: null
    });
  });

  it('Обновляет ключ user в хранилище в случае успешного обновления пользователя', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      updateUser.fulfilled({ success: true, user: updatedUser }, '', user)
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user: updatedUser
    });
  });

  it('Сбрасывает состояние user до изначального в случае провала обновления', () => {
    const actualState = burgerReducer(
      {
        ...initialState
      },
      updateUser.rejected(new Error('Failed to fetch user'), '', updatedUser)
    );

    expect(actualState).toEqual({
      ...actualState,
      isAuthChecked: true,
      user: null
    });
  });
});
