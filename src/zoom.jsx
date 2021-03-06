"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  default as Refresh
} from './refresh'

export default class ZoomControl extends Component {
  constructor (props) {
    super(props);
  }

  static defaultProps = {
    left: 0,
    top: 0
  }

  render() {
    const {
      zoomInClick,
      zoomOutClick,
      refreshClick,
      top,
      left
    } = this.props;

    var zoomControlStyle = {
      left: left - 80,
      top: top - 230,
      position: 'absolute',
      backgroundClip: 'padding-box',
      boxShadow: 'none',
      marginLeft: '10px',
      marginTop: '10px',
      cursor: 'pointer'
    }

    var zoomInStyle = {
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      borderRadius: '25px',
      fontSize: '44px',
      backgroundColor: '#fff',
      border: '2px solid rgba(0,0,0,0.2)',
      marginBottom: '15px',
      textAlign: 'center',
      fontWeight: 'bolder',
      textDecoration: 'none',
      color: 'black',
      display: 'block'
    }

    var zoomOutStyle = {
      width: '50px',
      height: '50px',
      lineHeight: '50px',
      borderRadius: '25px',
      fontSize: '50px',
      backgroundColor: '#fff',
      border: '2px solid rgba(0,0,0,0.2)',
      fontWeight: 'bolder',
      textAlign: 'center',
      textDecoration: 'none',
      color: 'black',
      display: 'block'
    }

    return (
      <div className="react-d3-map-core__zoom-control" style= {zoomControlStyle}>
        <Refresh
          refreshClick= {refreshClick}
        />
        <a className="react-d3-map-core__zoom-control__zoom-in" style={zoomInStyle} onClick={zoomInClick}>+</a>
        <a className="react-d3-map-core__zoom-control__zoom-out" style={zoomOutStyle} onClick={zoomOutClick}>-</a>
      </div>
    )
  }
}
