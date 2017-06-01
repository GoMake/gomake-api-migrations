const reducer = (cur, next) => cur.then(next).catch(err => { throw new Error(err) });
const startingValue = Promise.resolve();

const sequentialApply = promises => promises.reduce(reducer, startingValue)
	.catch(err => { throw new Error(err) });

export default sequentialApply;