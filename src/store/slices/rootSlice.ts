import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
import { RootState } from '../../services/store';

type BurgersState = {
  feedData: TFeedsResponse;
  orders: TOrder[];
  ingredients: {
    buns: TIngredient[];
    mains: TIngredient[];
    sauces: TIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  constructorItems: any;
  selectedItem: null | TIngredient;
  selectedOrder: TOrder;
  isAuthChecked: boolean;
  user: TUser | null;
  isIngredientsLoading: boolean;
};

const initialState: BurgersState = {
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
  isIngredientsLoading: false
};

export const loadFeedData = createAsyncThunk<TFeedsResponse>(
  'root/feed',
  async () => {
    try {
      return await getFeedsApi();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const loadOrders = createAsyncThunk<TOrder[]>(
  'root/orders',
  async () => {
    try {
      return await getOrdersApi();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const loadIngridients = createAsyncThunk(
  'root/ingredients',
  async () => {
    try {
      return await getIngredientsApi();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const makeOrder = createAsyncThunk(
  'root/orders/make',
  async (data: string[]) => {
    try {
      return await orderBurgerApi(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const loadOrder = createAsyncThunk(
  'root/orders/order',
  async (number: number) => {
    try {
      return await getOrderByNumberApi(number);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);
export const logout = createAsyncThunk('root/logout', async () => {
  try {
    return await logoutApi();
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const loadUser = createAsyncThunk('root/user', async () => {
  try {
    return await getUserApi();
  } catch (error) {
    console.log(error);
    throw error;
  }
});
export const updateUser = createAsyncThunk(
  'root/update-user',
  async (data: TUser) => {
    try {
      return await updateUserApi(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const rootSlice = createSlice({
  name: 'root',
  initialState,
  reducers: {
    setConstructorItem(state, action) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else if (action.payload.type === 'reloadIngridients') {
        state.constructorItems.ingredients = action.payload.data.ingredients;
      } else {
        state.constructorItems.ingredients.push(action.payload);
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
      .addCase(loadFeedData.fulfilled, (state, action) => {
        state.feedData = action.payload;
      })
      .addCase(loadFeedData.rejected, (state, action) => {
        console.log('error', action);
        state.feedData = initialState.feedData;
      });
    builder
      .addCase(loadOrders.pending, (state, action) => {
        state.orders = [];
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        console.log('error', action);
        state.orders = [];
      });
    builder
      .addCase(loadOrder.fulfilled, (state, action) => {
        state.selectedOrder = action.payload.orders[0];
      })
      .addCase(loadOrder.rejected, (state, action) => {
        console.log('error', action);
        state.selectedOrder = initialState.selectedOrder;
      });
    builder
      .addCase(loadIngridients.pending, (state, action) => {
        state.isIngredientsLoading = true;
      })
      .addCase(loadIngridients.fulfilled, (state, action) => {
        const ingredients = action.payload;
        let [buns, mains, sauces]: [
          TIngredient[],
          TIngredient[],
          TIngredient[]
        ] = [[], [], []];
        ingredients.map((el) => {
          if (el.type === 'bun') {
            buns.push(el);
          } else if (el.type === 'main') {
            mains.push(el);
          } else {
            sauces.push(el);
          }
        });
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
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        console.log('error', action);
      });
  }
});

export const selectFeedData = (state: RootState) => state.feedData;
export const selectOrders = (state: RootState) => state.orders;
export const selectIngredients = (state: RootState) => state.ingredients;
export const selectOrderRequest = (state: RootState) => state.orderRequest;
export const selectOrderModalData = (state: RootState) => state.orderModalData;
export const selectConstructorItems = (state: RootState) =>
  state.constructorItems;
export const selectItem = (state: RootState) => state.selectedItem;
export const selectOrder = (state: RootState) => state.selectedOrder;
export const userDataSelector = (state: RootState) => state.user;
export const isAuthCheckedSelector = (state: RootState) => state.isAuthChecked;
export const selectIsIngredientsLoading = (state: RootState) =>
  state.isIngredientsLoading;

export const {
  setConstructorItem,
  setOrderRequest,
  setOrderModalData,
  setSelectItem,
  setUser,
  setSelectedOrder
} = rootSlice.actions;

export default rootSlice.reducer;
