import * as Redux from 'redux';

function isPromise(val: any): boolean {
     return val && typeof val.then === 'function';
}

export default function ReduxActionsPromise<T>({ dispatch, getState }: Redux.MiddlewareAPI<T>) {
    return <S>(next: Redux.Dispatch<S>) => (action: any) => {
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