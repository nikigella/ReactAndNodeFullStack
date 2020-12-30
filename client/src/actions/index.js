import axios from 'axios';
import { FETCH_USER } from './types';

// We are going to refactor this action creator 
// to use the async/await syntax because the get 
// request to the current user api returns a promise


// Since we are returning a function within this action
// creator, then redux thunk will automatically pass
// in the dispatch function 

// Only once we get the response then we are ready
// to dispatch the action

//Both the ways below are the exact same and work fine

//1st Way
// export const fetchUser = () => {
//     return function(dispatch) {
//         axios
//             .get('/api/current_user')
//             .then(res => dispatch({ type: FETCH_USER, payload: res }));
//     }
// }

//2nd Way
export const fetchUser = () => async (dispatch) => {
    const res = await axios.get('/api/current_user');

    dispatch({ type: FETCH_USER, payload: res.data });
};

//3rd Way
// export const fetchUser = () => async (dispatch) => {
//     dispatch({ type: FETCH_USER, payload:  await axios.get('/api/current_user')});
// };

export const handleToken = (token) => async (dispatch) => {
    // POST Request - we want to send some info along with the request to the back end
    const res = await axios.post('/api/stripe', token);

    dispatch({ type: FETCH_USER, payload: res.data });
};