import { rootReducer } from './rootReducer';
import { burgerReducer } from '../store/slices/burgerSlice';

describe('rootReducer', () => {
  it('Корректная инициализация rootReducer', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });

    expect(initialState).toEqual({
      burger: burgerReducer(undefined, { type: '@@INIT' })
    });
  });

  it('Корректный вызов рандомного action', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(initialState).toEqual({
      burger: burgerReducer(undefined, { type: 'UNKNOWN_ACTION' })
    });
  });
});
