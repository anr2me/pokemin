import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Table, Menu, Icon, Button, Confirm, Dimmer, Loader, Responsive, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import withPokeList from '../hocs/withPokeList';
import  doFetchList from './../services/httpService';
import { remItem, setActiveMainTab } from './../actions/mainActions';
import { getNeedListFetch, getFetchListPending, getFetchListError, 
      getItemList, getMyItemList, getListOffset, getListLimit, getItemCount, getMyItemCount } from './../reducers/mainReducers';

const StyledTable = styled(Table)`
&&&& tr:hover{
  cursor: pointer; 
}
`;


class PokeList extends Component {

  state = { confirmOpen: false, page: 1 }

  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
		console.log('ListThisPropsDidMount: ',this.props);
    const { listOffset, listLimit, isMyList } = this.props;
    const { page } = this.props.match.params;
    let pagenum = Math.max(parseInt(page? page: '1'), 1);
    this.setState({ page: pagenum });
    // Initial fetching
    if (!isMyList) {
		  this.props.dispatch(doFetchList((pagenum>0)? (pagenum-1)*listLimit: listOffset, listLimit));
      this.props.dispatch(setActiveMainTab('list'));
    } else {
      this.props.dispatch(setActiveMainTab('mylist'));
    }
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('ListThisWillReceiveProps: ',this.props, '\nParams:', this.props.match.params);
    const { listOffset, listLimit, isMyList } = this.props;
    const { page } = nextProps.match.params;
    let pagenum = Math.max(parseInt(page? page: '1'), 1);
    this.setState({ page: pagenum });
    if (page !== this.props.match.params.page) {
      if (!isMyList)
        this.props.dispatch(doFetchList((pagenum>0)? (pagenum-1)*listLimit: listOffset, listLimit));
    }
  }
	
	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log('ListThisPropsDidUpdate: ',this.props, ' PrevProps: ',prevProps);
    const { needListFetch, listOffset, listLimit, isMyList } = this.props;
    const { page } = this.props.match.params;
    let pagenum = Math.max(parseInt(page? page: '1'), 1);
		if (needListFetch === true && prevProps.needListFetch === false) {
      if (!isMyList)
			  this.props.dispatch(doFetchList((pagenum>0)? (pagenum-1)*listLimit: listOffset, listLimit));
		}
  }
  
  handlePageClick = (page) => (e) => {
    console.log('Page: ',page);
    this.props.history.push({
      pathname: (this.props.isMyList? '/mylist/':'/list/')+Math.max(page,1),
    });
  }

  handleRowClick = (item) => (e) => {
    console.log('Item: ',item);
    this.props.history.push({
      pathname: `/detail/${item.id}`+ (item.uid? `/${item.uid}`:''),
    });
  }

  handleRemoveClick = (item) => (e) => {
    e.stopPropagation();
    this.showConfirm(item);
    console.log("Release!", item);
  }

  showConfirm = (confirmData) => {
    this.setState({ confirmData, confirmOpen: true });
  }
  handleCancel = () => this.setState({ confirmOpen: false });
  handleConfirm = () => {
    const { confirmData } = this.state;
    this.props.dispatch(remItem(confirmData.uid));
    this.setState({ confirmOpen: false });
  }

  render () {
    const { isMyList, itemList, listLimit, itemCount, fetchListPending } = this.props;
    const { confirmData, confirmOpen, page } = this.state;
    console.log('props:', this.props, '\nstate:', this.state);

    return (
      <React.Fragment>
        <StyledTable unstackable celled selectable color='red'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell collapsing>No</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              { isMyList && <Table.HeaderCell >Nickname</Table.HeaderCell> }
              { !isMyList && <Table.HeaderCell collapsing textAlign='right'>Owned</Table.HeaderCell> }
              { isMyList && <Table.HeaderCell collapsing>Release</Table.HeaderCell> }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {itemList.filter((item, idx) => (isMyList? idx: item.id-1) >= Math.max(parseInt(page? page: 1)-1,0)*listLimit && (isMyList? idx: item.id-1) < Math.max(parseInt(page? page: 1),0)*listLimit)
            .map((item, idx) => 
              <Table.Row key={isMyList? item.uid: item.id} onClick={this.handleRowClick(item)} >
                <Table.Cell>{Math.max(parseInt(page? page: 1)-1,0)*listLimit+idx+1}</Table.Cell>
                <Table.Cell>
                  {isMyList && <Responsive as='span' {...Responsive.onlyComputer}>
                    <Image size='mini' centered verticalAlign='middle' src={item.sprites.front_default} />
                  </Responsive>}
                  {item.name}
                </Table.Cell>
                { isMyList && <Table.Cell >{item.nickname}</Table.Cell> }
                { !isMyList && <Table.Cell textAlign='right'>{item.owned}</Table.Cell> }
                { isMyList && <Table.Cell textAlign='center'><Button negative icon='remove' size='mini' onClick={this.handleRemoveClick(item)} /></Table.Cell> }
              </Table.Row>
            )}
          </Table.Body>

          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell colSpan={isMyList? 4: 3}>
                <Menu floated='right' pagination>
                  <Menu.Item as='a' icon disabled={page <= 1} onClick={this.handlePageClick(page-1)}>
                    <Icon name='chevron left' />
                  </Menu.Item>
                  {
                    [...Array(5).keys()].map(x => {
                    let minpg = Math.max(page-2,1);
                    let maxpg = Math.ceil(itemCount/listLimit);
                    x += minpg; 
                    return <Menu.Item as='a' key={x} active={x === page} disabled={x > maxpg} onClick={this.handlePageClick(x)}>{x}</Menu.Item>
                    })
                  }
                  <Menu.Item as='a' icon disabled={page >= Math.ceil(itemCount/listLimit)} onClick={this.handlePageClick(page+1)}>
                    <Icon name='chevron right' />
                  </Menu.Item>
                </Menu>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </StyledTable>

        <Confirm
          open={confirmOpen}
          header='Release'
          content={`Are you sure you wanted to release ${confirmData && confirmData.nickname} ?`}
          cancelButton="No"
          confirmButton="Yes"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
          size='tiny'
        />

        <Dimmer active={fetchListPending} inverted>
          <Loader>Loading</Loader>
        </Dimmer>
      </React.Fragment>
    );
  };
}

const mapStateToProps = (state, ownProps) => {
  return {
    itemList: ownProps.isMyList? getMyItemList(state): getItemList(state),
    itemCount: ownProps.isMyList? getMyItemCount(state): getItemCount(state),
    listOffset: getListOffset(state),
    listLimit: getListLimit(state),
    fetchListError: getFetchListError(state),
    fetchListPending: getFetchListPending(state),
    needListFetch: getNeedListFetch(state),
  }
}

export const MyPokeList = compose(
  withRouter,
  withPokeList({ isMyList:true }),
  connect(mapStateToProps),
)(PokeList);

export default compose(
  withRouter,
  connect(mapStateToProps),
)(PokeList);