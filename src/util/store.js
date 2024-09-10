import { createStore } from 'redux';
import { Provider } from 'react-redux';

// Initial state
const initialState = {
    user: null,
};

// Reducer
const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload.username,
            };
        default:
            return state;
    }
};

// Create store
const store = createStore(rootReducer);

export { store, Provider };