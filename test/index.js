import test from 'ava';
import { createAction } from 'redux-actions';
import configureStore from 'redux-mock-store';

import ReduxActionsPromise from '../dist/index';

const doDispatch = () => {};
const doGetState = () => {};
const middleware = {
    dispatch: doDispatch,
    getState: doGetState,
};

const initialState = {};

const mockStore = configureStore([ReduxActionsPromise]);
const store = mockStore(initialState)
const nextHandler = ReduxActionsPromise(middleware);

const syncAddTodo = createAction('SYNC_ADD_TODO');
const asyncAddTodo = createAction('ASYNC_ADD_TODO', (todo)=> async (dispatch, getState) => {
    let v = await Promise.resolve('async: ' + todo);
    return v;
}); 
const asyncAddTodoError = createAction('ASYNC_ADD_TODO_ERROR', (todo)=> async (dispatch, getState) => {
    let v = await Promise.reject('async error: ' + todo);
    return v;
}); 

test.serial('should return a function', (t) => {
    t.plan(2);
    t.is(typeof nextHandler, 'function');
    t.is(nextHandler.length, 1);
});

test.serial('sync add todo', (t) => {
    t.plan(1);
    store.dispatch(syncAddTodo('one'));
    const actions = store.getActions();
    t.deepEqual(actions, [{ type: 'SYNC_ADD_TODO', payload: 'one' }]);
});

function asyncAction(action){
    let res = action.payload(store.dispatch, store.getState);
    return res.then((result) => {
        store.dispatch({
            type: action.type,
            payload: result
        })
    }, (err) => {
        store.dispatch({
            type: action.type,
            payload: err,
            error: true
        })
    })
}

test.serial('async add todo', async (t) => {
    t.plan(1);
    store.clearActions();
    await asyncAction(asyncAddTodo('two'));
    const actions = store.getActions();
    t.deepEqual(actions, [{ type: 'ASYNC_ADD_TODO', payload: 'async: two' }]);
});

test.serial('async add todo error', async (t) => {
    t.plan(1);
    store.clearActions();
    await asyncAction(asyncAddTodoError('three'));
    const actions = store.getActions();
    t.deepEqual(actions, [{ type: 'ASYNC_ADD_TODO_ERROR', payload: 'async error: three', error: true}]);
});