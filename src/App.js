import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import { Container, Segment, Grid, Image, Menu } from 'semantic-ui-react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import styled, { createGlobalStyle } from 'styled-components';
import PokeList, { MyPokeList } from './components/PokeList';
import PokeDetail from './components/PokeDetail';
import { setActiveMainTab } from './actions/mainActions';
import { getActiveMainTab } from './reducers/mainReducers';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #ffffff;
    color: #212121;
    transition: all 0.5s ease;
    transition-property: color,background-color,border,font-size;
    text-align: center;
  }
`;

const MainContainer = styled(Container)`
&&& {
  padding-top: 1em;
  width: 100% !important;
  max-width: 600px !important;
  text-align:center;
  margin:auto !important;
}
`;

const StyledMenu = styled(Menu)`
&&&& {
  width:auto;
  margin-left:auto;
  margin-right:auto;
}
&&&& .item:not(.active):hover{
  background: rgba(0,0,0,.03);
}
`;

const FooterSegment = styled(Segment)`
&&& {
  bottom: 0;
  left: 50%;
  width: 100%;
  margin:auto auto 0 -50%;

  @media (max-width: 600px) {
    position: absolute;
  }
}
`;

const DefaultComp = () => {

  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Image fluid centered verticalAlign='middle' src='https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png' />
      </Grid.Column>
    </Grid>
  )
}

class App extends Component {

  constructor(props) {
    super(props);
    this.handleTabClick = this.handleTabClick.bind(this);
  }

  handleTabClick = (e, { name }) => {
    this.props.dispatch(setActiveMainTab(name));
    console.log('ActiveMainTab: ',name);
  }

  render () {
    const { activeMainTab } = this.props;

    return (
      <Router>
        <React.Fragment>
          <GlobalStyle />
          <MainContainer className='App'>
            <Segment attached vertical>
              <Switch>
                <Route path='/list/:page?' component={PokeList} />
                <Route path='/mylist/:page?' component={MyPokeList} />
                <Route path='/detail/:id/:uid?' component={PokeDetail} />
                <Route exact path='/' component={DefaultComp} />
                <Route component={DefaultComp} />
              </Switch>
            </Segment>
              <StyledMenu tabular compact attached="bottom">
                <Menu.Item 
                  as={ Link }
                  to='/list'
                  name='list'
                  active={activeMainTab === 'list'}
                  onClick={this.handleTabClick}
                  link
                >
                  Pokemon List
                </Menu.Item>

                <Menu.Item 
                  as={ Link }
                  to='/mylist'
                  name='mylist'
                  active={activeMainTab === 'mylist'}
                  onClick={this.handleTabClick}
                  link
                >
                  My Pokemon List
                </Menu.Item>
              </StyledMenu>
          </MainContainer>
        </React.Fragment>
      </Router>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    activeMainTab: getActiveMainTab(state),
  }
}

export default connect(mapStateToProps)(App);
