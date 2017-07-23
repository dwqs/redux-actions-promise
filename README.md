[![build pass](https://api.travis-ci.org/dwqs/redux-actions-promise.svg?branch=master)](https://travis-ci.org/dwqs/redux-actions-promise) ![npm-version](https://img.shields.io/npm/v/redux-actions-promise.svg) ![license](https://img.shields.io/npm/l/redux-actions-promise.svg) ![bower-license](https://img.shields.io/bower/l/redux-actions-promise.svg)

# redux-actions-promise

FSA-compliant promise middleware for Redux, supports referencing dispatcher/state in action.

## Installation
Install the pkg with npm:

```
npm install redux-actions-promise --save
```

or yarn

```
yarn add redux-actions-promise
```

or bower

```
bower install redux-actions-promise
```

## Usage

```
// store.js
// create store
import ReduxActionsPromise from 'redux-actions-promise';
import { createStore, applyMiddleware } from 'redux';

// Note: this API requires redux@>=3.1.0
export default createStore(rootReducer, applyMiddleware(ReduxActionsPromise));

// actions.js
import {createAction} from 'redux-actions';

// async action
export let addToDo = createAction(CONSTANT.ADD_TODO, (val) => async (dispatch, getState) => {
    console.log('prev state', getState())
    let v = await Promise.resolve('todo: ' + val);
    return v;
});

// sync action
export let deleteToDo = createAction(CONSTANT.DELETE_TODO);
```

## FAQ
1. why not use [redux-thunk](https://github.com/gaearon/redux-thunk) ?

* I would like to use `createAction` for [FSA](https://github.com/acdlite/flux-standard-action).
* I don't want to handle promise error in action by myself.

In `redux-thunk`:

```
addToDo = (val) => async (dispatch, getState) => {
    let v = await Promise.reject('error');
    // can't output in console
    console.log('addToDo');
    dispatch({
        type: "ADD_TODO",
        payload: {
            val: v
        }
    })
};
```

If promise is rejected, the programme will be abort. So if you don't want this happen, you should handle it by yourself:

```
addToDo = (val) => async (dispatch, getState) => {
    try{
        let v = await Promise.reject('error');
        // can't output in console
        console.log('addToDo');
        dispatch({
            type: "ADD_TODO",
            payload: {
                val: v
            }
        })
    } catch(e) {
        dispatch({
            type: "ADD_TODO_ERROR",
            payload: e,
            error: true
        })
    }
};
```

Use [async-await-error-handling](https://github.com/dwqs/async-await-error-handling) maybe simple the code:

```
import awaitTo from 'async-await-error-handling';

//...

addToDo = (val) => async (dispatch, getState) => {
    const [err, data] = await awaitTo(Promise.reject('error'));
    if(err){
        dispatch({
            type: "ADD_TODO_ERROR",
            payload: e,
            error: true
        });
        return;
    }
    dispatch({
        type: "ADD_TODO",
        payload: {
            val: data
        }
    });
};
```

2. why not use [redux-promise](https://github.com/acdlite/redux-promise) ?

Because it doesn't support referencing dispatcher or state in action. See [#20](https://github.com/acdlite/redux-promise/issues/20).

## LICENSE
MIT