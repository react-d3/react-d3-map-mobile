"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react';

import {
  default as Refresh
} from './refresh'

export default class ZoomTabControl extends Component {
  constructor (props) {
    super(props);
  }

  static defaultProps = {
    left: 0,
    top: 0
  }

  render() {
    const {
      refreshClick,
      top,
      left
    } = this.props;

    var zoomControlStyle = {
      left: left - 80,
      top: top - 100,
      position: 'absolute',
      backgroundClip: 'padding-box',
      boxShadow: 'none',
      marginLeft: '10px',
      marginTop: '10px',
      cursor: 'pointer'
    }
    return (
      <div className="react-d3-map-core__zoom-control" style= {zoomControlStyle}>
        <Refresh
          refreshClick= {refreshClick}
        />
      </div>
    )
  }
}
