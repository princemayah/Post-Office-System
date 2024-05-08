import { createStore } from 'redux';

// Initial state of your application
const initialState = {
  token: null,
};

// Your reducer that handles actions related to authentication
function authReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };
    // Add more cases for other actions
    default:
      return state;
  }
}

// Create the store with the reducer
const store = createStore(authReducer);

export default store;
