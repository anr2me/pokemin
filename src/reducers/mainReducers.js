import uuid from 'uuid';
import localDB from './../Utils';
import mainActions from './../actions/mainActions';

let myItemList = localDB.getItem('pokeminMyList') || [];

const initialState = {
	itemList: [],
	myItemList: myItemList,
	currentItem: {},

	itemCount: 0,
	myItemCount: myItemList.length,
	listOffset: 0,
	listLimit: 20,

	needListFetch: false,
	fetchListPending: false,
	fetchListError: '',

	needDetailFetch: false,
	fetchDetailPending: false,
	fetchDetailError: '',

	activeMainTab:'',
}

const mainReducers = (state = initialState, action) => {
	console.log("Action: ",action);
	switch (action.type) { 
		case mainActions.ADD_ITEM: {
			let myItemList = state.myItemList.concat({ ...action.data, uid:uuid.v4() });
			localDB.addUpdateItem('pokeminMyList', myItemList);
			return {...state, myItemList, myItemCount: state.myItemCount+1 };
		}
		case mainActions.REM_ITEM: {
			let myItemList = state.myItemList.filter(obj => obj.uid !== action.uid);
			localDB.addUpdateItem('pokeminMyList', myItemList);
			return {...state, myItemList };
		}
		case mainActions.UPDATE_ITEM: {
			let myItemList = state.myItemList.map((obj) => {
				if (obj.uid === action.data.uid) {
					return { ...obj, nickname: action.data.nickname }
				}
				return obj;
			});
			localDB.addUpdateItem('pokeminMyList', myItemList);
			return {...state, myItemList };
		}

		case mainActions.SET_NEED_LIST_FETCH:
			return {...state, needListFetch:action.needListFetch};
		case mainActions.FETCH_LIST_PENDING:
			return {...state, fetchListPending:true, needListFetch:false};
		case mainActions.FETCH_LIST_SUCCESS:
			return {...state, fetchListPending:false, needListFetch:false, itemCount:action.data.count, listOffset: action.offset,
				itemList: action.data.results.map((obj)=>{
					let newObj = Object.assign({}, obj);
					newObj.id = parseInt(/\/pokemon.*\/([^/?]+)[/?].*$/gim.exec(newObj.url)[1]);
					newObj.owned = state.myItemList.filter(item => item.id === newObj.id).length;
					return newObj;
				})};
		case mainActions.FETCH_LIST_ERROR:
			return {...state, fetchListPending:false, needListFetch:false, fetchListError:action.error};

		case mainActions.SET_NEED_DETAIL_FETCH:
			return {...state, needDetailFetch:action.needDetailFetch};
		case mainActions.FETCH_DETAIL_PENDING:
			return {...state, fetchDetailPending:true, needDetailFetch:false};
		case mainActions.FETCH_DETAIL_SUCCESS: {
			let newObj = Object.assign({}, action.data);
			if (action.uid) {
				let obj = state.myItemList.find(item => item.uid === action.uid);
				newObj = {...newObj, ...obj};
			}
			newObj.owned = state.myItemList.filter(item => item.id === newObj.id).length;
			return {...state, fetchDetailPending:false, needDetailFetch:false, currentItem: newObj};
		}
		case mainActions.FETCH_DETAIL_ERROR:
			return {...state, fetchDetailPending:false, needDetailFetch:false, fetchDetailError:action.error};

		case mainActions.SET_ACTIVE_MAINTAB:
				return {...state, activeMainTab: action.data};

		default:      
			return state;  
	}
}

export default mainReducers;

export const getItemList = state => state.mainReducers.itemList;
export const getMyItemList = state => state.mainReducers.myItemList;
export const getItemCount = state => state.mainReducers.itemCount;
export const getMyItemCount = state => state.mainReducers.myItemCount;
export const getCurrentItem = state => state.mainReducers.currentItem;

export const getListOffset = state => state.mainReducers.listOffset;
export const getListLimit = state => state.mainReducers.listLimit;

export const getNeedListFetch = state => state.mainReducers.needListFetch;
export const getFetchListPending = state => state.mainReducers.fetchListPending;
export const getFetchListError = state => state.mainReducers.fetchListError;

export const getNeedDetailFetch = state => state.mainReducers.needDetailFetch;
export const getFetchDetailPending = state => state.mainReducers.fetchDetailPending;
export const getFetchDetailError = state => state.mainReducers.fetchDetailError;

export const getActiveMainTab = state => state.mainReducers.activeMainTab;
