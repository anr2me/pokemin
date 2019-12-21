const mainActions = {
	ADD_ITEM: 'ADD_ITEM',
  REM_ITEM: 'REM_ITEM',
  UPDATE_ITEM: 'UPDATE_ITEM',
  
  SET_NEED_LIST_FETCH: 'SET_NEED_LIST_FETCH',
  FETCH_LIST_PENDING: 'FETCH_LIST_PENDING',
  FETCH_LIST_SUCCESS: 'FETCH_LIST_SUCCESS',
  FETCH_LIST_ERROR: 'FETCH_LIST_ERROR',

  SET_NEED_DETAIL_FETCH: 'SET_NEED_DETAIL_FETCH',
  FETCH_DETAIL_PENDING: 'FETCH_DETAIL_PENDING',
  FETCH_DETAIL_SUCCESS: 'FETCH_DETAIL_SUCCESS',
  FETCH_DETAIL_ERROR: 'FETCH_DETAIL_ERROR',

  SET_ACTIVE_MAINTAB: 'SET_ACTIVE_MAINTAB',
}

export const addItem = (data) => ({ type: mainActions.ADD_ITEM, data });
export const remItem = (uid) => ({ type: mainActions.REM_ITEM, uid });
export const updateItem = (data) => ({ type: mainActions.UPDATE_ITEM, data });

export const setNeedListFetch = (needListFetch) => ({ type: mainActions.SET_NEED_LIST_FETCH, needListFetch });
export const doFetchListPending = () => ({ type: mainActions.FETCH_LIST_PENDING });
export const doFetchListSuccess = (data, offset) => ({ type: mainActions.FETCH_LIST_SUCCESS, data, offset });
export const doFetchListError = (error) => ({ type: mainActions.FETCH_LIST_ERROR, error });

export const setNeedDetailFetch = (needDetailFetch) => ({ type: mainActions.SET_NEED_DETAIL_FETCH, needDetailFetch });
export const doFetchDetailPending = () => ({ type: mainActions.FETCH_DETAIL_PENDING });
export const doFetchDetailSuccess = (data, uid) => ({ type: mainActions.FETCH_DETAIL_SUCCESS, data, uid });
export const doFetchDetailError = (error) => ({ type: mainActions.FETCH_DETAIL_ERROR, error });

export const setActiveMainTab = (data) => ({ type: mainActions.SET_ACTIVE_MAINTAB, data });

export default mainActions;
