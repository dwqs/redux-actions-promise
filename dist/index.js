(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ReduxActionsPromise = factory());
}(this, (function () { 'use strict';

const __assign = Object.assign || function (target) {
    for (var source, i = 1; i < arguments.length; i++) {
        source = arguments[i];
        for (var prop in source) {
            if (Object.prototype.hasOwnProperty.call(source, prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
};

function isPromise(val) {
    return val && typeof val.then === 'function';
}
function reduxActionsPromise(_a) {
    var dispatch = _a.dispatch,
        getState = _a.getState;
    return function (next) {
        return function (action) {
            if (typeof action.payload === 'function') {
                var res = action.payload(dispatch, getState);
                if (isPromise(res)) {
                    res.then(function (result) {
                        dispatch(__assign({}, action, { payload: result }));
                    }, function (error) {
                        dispatch(__assign({}, action, { payload: error, error: true }));
                    });
                } else {
                    dispatch(__assign({}, action, { payload: res }));
                }
            } else {
                next(action);
            }
        };
    };
}
var ReduxActionsPromise = reduxActionsPromise;

return ReduxActionsPromise;

})));
