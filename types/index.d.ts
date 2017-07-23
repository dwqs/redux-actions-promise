import * as Redux from 'redux';
export interface FSA {
    type: any;
    payload?: any;
    error?: boolean;
    meta?: any;
}
declare const ReduxActionsPromise: Redux.Middleware;
export default ReduxActionsPromise;
