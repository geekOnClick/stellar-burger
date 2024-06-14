import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getFeedsApi,
  getIngredientsApi,
  getOrderByNumberApi,
  getOrdersApi,
  getUserApi,
  logoutApi,
  orderBurgerApi,
  TFeedsResponse,
  updateUserApi
} from '@api';
import { TIngredient, TOrder, TUser } from '@utils-types';
import store, { RootState } from '../../services/store';
import { makeStoreItems } from '../../utils/makeStoreItems';

export type TIngredientsStore = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
};

type BurgersState = {
  feedData: TFeedsResponse;
  orders: TOrder[];
  ingredients: TIngredientsStore;
  orderRequest: boolean;
  orderModalData: TOrder | null;
  constructorItems: any;
  selectedItem: null | TIngredient;
  selectedOrder: TOrder;
  isAuthChecked: boolean;
  user: TUser | null;
  isIngredientsLoading: boolean;
  isLoading: boolean;
};

export const initialState: BurgersState = {
  feedData: {
    success: true,
    orders: [],
    total: 0,
    totalToday: 0
  },
  orders: [],
  ingredients: {
    buns: [],
    mains: [],
    sauces: []
  },
  orderRequest: false,
  orderModalData: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  selectedItem: null,
  selectedOrder: {
    createdAt: '',
    ingredients: [],
    _id: '',
    status: '',
    name: '',
    updatedAt: 'string',
    number: 0
  },
  isAuthChecked: true,
  user: null,
  isIngredientsLoading: false,
  isLoading: false
};

export const loadFeedData = createAsyncThunk<TFeedsResponse>(
  'root/feed',
  async () => await getFeedsApi()
);
export const loadOrders = createAsyncThunk<TOrder[]>(
  'root/orders',
  async () => await getOrdersApi()
);
export const loadIngridients = createAsyncThunk(
  'root/ingredients',
  async () => await getIngredientsApi()
);
export const loadIngridient = createAsyncThunk(
  'root/ingredient',
  async (data: string) => {
    const items = await getIngredientsApi();
    return { items, data };
  }
);
export const makeOrder = createAsyncThunk(
  'root/orders/make',
  async (data: string[]) => await orderBurgerApi(data)
);
export const loadOrder = createAsyncThunk(
  'root/orders/order',
  async (number: number) => await getOrderByNumberApi(number)
);
export const logout = createAsyncThunk(
  'root/logout',
  async () => await logoutApi()
);
export const loadUser = createAsyncThunk(
  'root/user',
  async () => await getUserApi()
);
export const updateUser = createAsyncThunk(
  'root/update-user',
  async (data: TUser) => await updateUserApi(data)
);

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    setConstructorItem(state, action) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else if (action.payload.type === 'reloadIngridients') {
        state.constructorItems.ingredients = action.payload.data.ingredients;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          order: state.constructorItems.ingredients.length + 1
        });
      }
    },

    setOrderRequest(state, action) {
      state.orderRequest = action.payload;
    },
    setOrderModalData(state, action) {
      state.orderModalData = action.payload;
    },
    setSelectItem(state, action) {
      state.selectedItem = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setSelectedOrder(state, action) {
      if (action.payload === 'close') {
        state.selectedOrder = initialState.selectedOrder;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFeedData.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loadFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
        state.isLoading = false;
      })
      .addCase(loadFeedData.rejected, (state, action) => {
        console.log('error', action);
        state.isLoading = false;
        state.feedData = initialState.feedData;
      });
    builder
      .addCase(loadOrders.pending, (state, action) => {
        state.orders = [];
        state.isLoading = true;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.isLoading = false;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        console.log('error', action);
        state.isLoading = false;
        state.orders = [];
      });
    builder
      .addCase(loadOrder.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
        state.isLoading = false;
      })
      .addCase(loadOrder.rejected, (state, action) => {
        console.log('error', action);
        state.isLoading = false;
        state.selectedOrder = initialState.selectedOrder;
      });
    builder
      .addCase(loadIngridients.pending, (state, action) => {
        state.isIngredientsLoading = true;
      })
      .addCase(loadIngridients.fulfilled, (state, action) => {
        const ingredients = action.payload;
        let [buns, mains, sauces] = makeStoreItems(ingredients);
        state.ingredients.buns = buns;
        state.ingredients.sauces = sauces;
        state.ingredients.mains = mains;
        state.isIngredientsLoading = false;
      })
      .addCase(loadIngridients.rejected, (state, action) => {
        console.log('error', action);
        state.isIngredientsLoading = false;
      });
    builder
      .addCase(loadIngridient.fulfilled, (state, action) => {
        const ingredients = action.payload.items;
        let [buns, mains, sauces] = makeStoreItems(ingredients);
        const ingredient = [...buns, ...sauces, ...mains].find(
          (el) => el._id === action.payload.data
        );
        if (ingredient) {
          state.selectedItem = ingredient;
        }
      })
      .addCase(loadIngridient.rejected, (state, action) => {
        console.log('error', action);
      });

    builder
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
        state.constructorItems = initialState.constructorItems;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        console.log('error', action);
      });
    builder
      .addCase(logout.pending, (state, action) => {
        state.isAuthChecked = false;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthChecked = true;
      });
    builder
      .addCase(loadUser.pending, (state, action) => {
        state.isAuthChecked = false;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(loadUser.rejected, (state, action) => {
        state.isAuthChecked = true;
      });
    builder
      .addCase(updateUser.pending, (state, action) => {
        state.isAuthChecked = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.log('error', action);
        state.isAuthChecked = true;
      });
  }
});

export const selectFeedData = (state: RootState) => state.burger.feedData;
export const selectOrders = (state: RootState) => state.burger.orders;
export const selectIngredients = (state: RootState) => state.burger.ingredients;
export const selectOrderRequest = (state: RootState) =>
  state.burger.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.burger.orderModalData;
export const selectConstructorItems = (state: RootState) =>
  state.burger.constructorItems;
export const selectItem = (state: RootState) => state.burger.selectedItem;
export const selectOrder = (state: RootState) => state.burger.selectedOrder;
export const userDataSelector = (state: RootState) => state.burger.user;
export const isAuthCheckedSelector = (state: RootState) =>
  state.burger.isAuthChecked;
export const selectIsIngredientsLoading = (state: RootState) =>
  state.burger.isIngredientsLoading;
export const selectIsLoading = (state: RootState) => state.burger.isLoading;

export const {
  setConstructorItem,
  setOrderRequest,
  setOrderModalData,
  setSelectItem,
  setUser,
  setSelectedOrder
} = burgerSlice.actions;

export const burgerActions = burgerSlice.actions;
export const burgerReducer = burgerSlice.reducer;
