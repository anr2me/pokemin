import React, { Component } from 'react';

const withPokeList = props => Comp => {
    class withPokeList extends Component {

        render() {
            return (<Comp {...this.props} {...props} />);
        }
    }
    return withPokeList;
};

export default withPokeList;