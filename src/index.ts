import * as Redux from 'redux';

export interface FSA {
    type: any,
    payload?: any,
    error?: boolean,
    meta?: any
}

function isPromise(val: any): boolean {
     return val && typeof val.then === 'function';
}

function reduxActionsPromise<T>({ dispatch, getState }: Redux.MiddlewareAPI<T>): any {
    return <S>(next: Redux.Dispatch<S>) => (action: FSA) => {
        if (typeof action.payload === 'function') {
            const res = action.payload(dispatch, getState);
            if (isPromise(res)) {
                res.then((result: any) => {
                    dispatch({
                        ...action, 
                        payload: result,
                    });
                }, (error: Error) => {
                    dispatch({
                        ...action, 
                        payload: error,
                        error: true,
                    });
                });
            } else {
                dispatch({
                    ...action, 
                    payload: res,
                });
            }
        } else {
            next(action);
        }
    }
}

const ReduxActionsPromise: Redux.Middleware = reduxActionsPromise; 
export default ReduxActionsPromise;