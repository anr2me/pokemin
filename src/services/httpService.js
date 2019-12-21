import { doFetchListPending, doFetchListSuccess, doFetchListError, setNeedListFetch,
		doFetchDetailPending, doFetchDetailSuccess, doFetchDetailError, setNeedDetailFetch } from './../actions/mainActions';

export default function doFetchList(offset, limit){
		return dispatch => {
			console.log('Fetching!!');
			dispatch(doFetchListPending());
			fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)
			.then(res => res.json())
			.then(res => {
				dispatch(doFetchListSuccess(res, offset));
				return res;
			})
			.catch(error => {
				dispatch(doFetchListError(error));
			})
		}
}

export function doFetchDetail(id, uid){
	return dispatch => {
		console.log('Fetching!!');
		dispatch(doFetchDetailPending());
		fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
		.then(res => res.json())
		.then(res => {
			dispatch(doFetchDetailSuccess(res, uid));
			return res;
		})
		.catch(error => {
			dispatch(doFetchDetailError(error));
		})
	}
}

export function triggerListFetch(needListFetch) { return dispatch => { console.log('triggerListFetch!!'); dispatch(setNeedListFetch(needListFetch)) } };
export function triggerDetailFetch(needDetailFetch) { return dispatch => { console.log('triggerDetailFetch!!'); dispatch(setNeedDetailFetch(needDetailFetch)) } };


