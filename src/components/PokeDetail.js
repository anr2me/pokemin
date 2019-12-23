import React, { Component, createRef } from 'react';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Header, Rail, Sticky, Grid, Ref, Segment, Button, Image, Label, List, Card, Modal, Input, Dimmer, Loader, Container } from 'semantic-ui-react';
import styled from 'styled-components';
import { doFetchDetail } from './../services/httpService';
import { addItem, updateItem } from './../actions/mainActions';
import { getNeedDetailFetch, getFetchDetailPending, getFetchDetailError, getCurrentItem } from './../reducers/mainReducers';

const StyledRail = styled(Rail)`
&&&& {
  left: 0;
  right: auto;
  padding: 0 0 0 0;
  margin: auto; 
  width: 100%;
}
`;

const StyledSticky = styled(Sticky)`
&&&& {

  &.fixed-container {

    & .fixed {
      margin: auto;
      position: fixed;
      width: 100% !important;
      left: 0;
      background: #545454 linear-gradient(transparent,rgba(0,0,0,.05));
    }
  }
}
`;

const StickyContainer = styled(Container)`
&&&& {
  max-width: 600px !important;
  margin: auto !important;
  border: none;
  border-radius: 0;

  & .header {
    border: none;
    border-radius: 0;
  }
}
`;

const HeaderSegment = styled(Segment)`
&&& {
  position: absolute;
  top: 0;
  left: 50%;
  width: 100%;
  margin:auto auto 0 -50%;
}
`;

const StyledSegment = styled(Segment)`
&&& {
  padding-top:3em;
  text-transform: capitalize;
}
`;

const StyledList = styled(List)`
&&& {
  overflow-x: visible;
  overflow-y: auto;
  max-height: 15em;
  >.item {
    margin-left: 1.5em;
  }
}
`;

const StyledLabel = styled(Label)`
&&& {
  background-color: transparent;
  :first-letter {
    text-transform: capitalize;
  }
}
`;

const BackButton = ({ history }) => <Button inverted floated='left' icon='left chevron' onClick={() => history.goBack()} alt="Go back" />;
const RoutedBackButton = withRouter(BackButton);

class PokeDetail extends Component {
  contextRef = createRef();
  inputNameRef = createRef();

  state = { modalOpen: false }

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleCatchClick = this.handleCatchClick.bind(this);
    this.handleChangeClick = this.handleChangeClick.bind(this);
    this.handleOKClick = this.handleOKClick.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
  }

  componentDidMount() {
    console.log('DetailThisPropsDidMount: ',this.props, '\nParams:', this.props.match.params);
    const { doFetchDetail } = this.props;
		const { id, uid } = this.props.match.params;
		// Initial fetching
		doFetchDetail(id, uid);
  }
  
  componentWillReceiveProps(nextProps) {
    console.log('DetailThisWillReceiveProps: ',this.props, '\nParams:', this.props.match.params);
    const { id, uid } = nextProps.match.params;
    if (id !== this.props.match.params.id || uid !== this.props.match.params.uid) {
        doFetchDetail(id, uid);
    }
  }
	
	componentDidUpdate(prevProps, prevState, snapshot) {
    console.log('DetailThisPropsDidUpdate: ',this.props, ' PrevProps: ',prevProps, '\nParams:', this.props.match.params);
    const { doFetchDetail } = this.props;
    const { id, uid } = this.props.match.params;
		if (this.props.needListFetch === true && prevProps.needListFetch === false) {
			doFetchDetail(id, uid);
		}
	}

  closeModal = () => this.setState({ modalOpen: false });

  showModal = (modalData) => {
    this.setState({ modalData, modalOpen: true });
  }

  handleCatchClick = (e) => {
    const { currentItem } = this.props;
    const status = Math.floor(Math.random() * 2); //0..1

    this.setState({ nickname: currentItem.name });
    if (status > 0) {
      this.showModal({
        status,
        color: 'green',
        header: 'Success', 
        img: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png', 
        text: `Please give a nickname for ${currentItem.name}`,
        defaultName: currentItem.name,
      });
    } else {
      this.showModal({
        status,
        color: 'red',
        header: 'Failed', 
        img: currentItem.sprites.back_default, 
        text: `${currentItem.name} has fled`,
        defaultName: currentItem.name,
      });
    }
    console.log("Catch!");
  }

  handleChangeClick = (e) => {
    const { currentItem } = this.props;
    this.setState({ nickname: currentItem.nickname });
    this.showModal({
      status: 2,
      header: 'Update', 
      img: currentItem.sprites.front_default, 
      text: `Change ${currentItem.name} nickname to`,
      defaultName: currentItem.nickname,
    });
    console.log("Change!");
  }

  handleOKClick = (e) => {
    const { modalData } = this.state;
    const { addItem, updateItem } = this.props;
    switch (modalData.status) {
      case 1: {
        addItem({...this.props.currentItem, nickname: this.state.nickname});
        this.props.history.push({
          pathname: `/mylist`,
        });
        break;
      }
      case 2: {
        updateItem({...this.props.currentItem, nickname: this.state.nickname});
        this.props.history.push({
          pathname: `/mylist`,
        });
        break;
      }
      default: {
        this.props.history.goBack();
      }
    }
    this.closeModal();
    console.log("OK! ",this.inputNameRef, '\nState: ', this.state);
  }

  handleNameChange = (e, { name, value }) => {
    let errorNameInput = false;
    if (e.currentTarget.value === '') { 
        errorNameInput = true;
    }
    this.setState({ [name]: value, errorNameInput });
  }


  render () {
    const { currentItem, fetchDetailPending } = this.props;
    const { uid } = this.props.match.params;
    const { modalOpen, modalData } = this.state;
    console.log('props:', this.props, '\nstate:', this.state);

    return (
        <Ref innerRef={this.contextRef}>
          <React.Fragment>
            <StyledSegment vertical attached>
              <Card centered color='red'>
                <Card.Content>
                  <Image fluid centered verticalAlign='middle' src={currentItem.sprites && currentItem.sprites.front_default} />
                  <Card.Header>{currentItem.name}</Card.Header>
                  <Card.Meta>{(uid && currentItem.nickname)? currentItem.nickname: '\u00A0'}</Card.Meta>
                  <Card.Description>
                    <Segment.Group>
                      <Segment.Group horizontal>
                        <Segment textAlign='left' >
                          <Label color='red' ribbon>
                            Abilities
                          </Label>
                          <List bulleted verticalAlign='middle'>
                            {currentItem.abilities && currentItem.abilities.map(obj => <List.Item key={obj.ability.name}><List.Content>{obj.ability.name}</List.Content></List.Item>)}
                          </List>
                        </Segment>
                        <Segment textAlign='left' >
                          <Label color='red' ribbon='right'>
                            Types
                          </Label>
                          <List bulleted verticalAlign='middle'>
                            {currentItem.types && currentItem.types.map(obj => <List.Item key={obj.type.name}><List.Content>{obj.type.name}</List.Content></List.Item>)}
                          </List>
                        </Segment>
                      </Segment.Group>
                      <Segment textAlign='left' >
                        <Label color='orange' ribbon>
                          Moves
                        </Label>
                        <StyledList bulleted verticalAlign='middle'>
                          {currentItem.moves && currentItem.moves.map(obj => <List.Item key={obj.move.name}><List.Content>{obj.move.name}</List.Content></List.Item>)}
                        </StyledList>
                      </Segment>
                    </Segment.Group>
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                { uid && currentItem.owned? 
                  <Button basic icon positive onClick={this.handleChangeClick}>
                    Change Nickname
                  </Button>
                  :<Button basic icon positive onClick={this.handleCatchClick}>
                    <Image centered verticalAlign='middle' src='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' />
                    Catch
                  </Button>
                }
                </Card.Content>
              </Card>
            </StyledSegment>
            <HeaderSegment vertical inverted>
              <StyledRail position='left' attached>
                <StyledSticky context={this.contextRef}>
                  <StickyContainer>
                    <Header as="h2" textAlign='center' inverted block>
                      <RoutedBackButton />Pokemon Detail
                    </Header>
                  </StickyContainer>
                </StyledSticky>
              </StyledRail>
            </HeaderSegment>

            <Modal
              open={modalOpen}
              closeOnEscape={false}
              closeOnDimmerClick={false}
              onClose={this.closeModal}
              size='tiny'
            >
              <Modal.Header><Header color={modalData && modalData.color}>{modalData && modalData.header}</Header></Modal.Header>
              <Modal.Content>
                <Grid centered columns={4}>
                  <Grid.Column>
                  <Image fluid centered verticalAlign='middle' src={modalData && modalData.img} />
                  </Grid.Column>
                </Grid>
                
                <Label.Group size='large'>
                  <StyledLabel>{modalData && modalData.text}</StyledLabel>
                  { modalData && modalData.status>0 && 
                    <StyledLabel><Input name='nickname' ref={this.inputNameRef} placeholder='Nickname...' defaultValue={modalData && modalData.defaultName} onChange={this.handleNameChange} error={this.state.errorNameInput} /></StyledLabel> 
                  }
                </Label.Group>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handleOKClick} primary inverted>
                  OK
                </Button>
              </Modal.Actions>
            </Modal>

            <Dimmer active={fetchDetailPending} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
          </React.Fragment>
        </Ref>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    currentItem: getCurrentItem(state),
    fetchDetailError: getFetchDetailError(state),
    fetchDetailPending: getFetchDetailPending(state),
    needDetailFetch: getNeedDetailFetch(state),
  }
}

// Custom dispatch
const mapDispatchToProps = dispatch => bindActionCreators({
  doFetchDetail,
  addItem,
  updateItem,
}, dispatch);

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(PokeDetail);