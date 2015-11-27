"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

export default class ZoomControl extends Component {
  constructor (props) {
    super(props);
  }
  
  render() {
    const {
      refreshClick
    } = this.props;

    var refreshStyle = {
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      borderRadius: '25px',
      fontSize: '35px',
      backgroundColor: '#fff',
      marginBottom: '15px',
      border: '2px solid rgba(0,0,0,0.2)',
      textAlign: 'center',
      fontWeight: 'bolder',
      textDecoration: 'none',
      color: 'black',
      display: 'block'
    }

    return (
      <a className="react-d3-map-core__zoom-control__refresh" style={refreshStyle} onClick={refreshClick}>&#x21bb;</a>
    )
  }
}
