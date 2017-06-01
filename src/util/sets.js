import {curry, filter, includes} from 'lodash';

const setDifference = curry((u, a) => filter(u, x => !includes(a, x)));

export {setDifference};