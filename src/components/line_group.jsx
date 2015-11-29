"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Mesh
} from 'react-d3-map-core';

export default class MeshGroup extends Component {

  static contextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.func.isRequired,
    closeOverlay: React.PropTypes.func.isRequired
  }

  render() {
    const {
      data,
      onClick,
      onMouseOver,
      onMouseOut,
      meshClass,
      overlayContent
    } = this.props;

    const {
      geoPath,
      showOverlay,
      closeOverlay
    } = this.context;

    var meshs;

    if(data.type === 'FeatureCollection') {
      var lineData = [];

      // loop through features
      data.features.forEach(function(d) {
        lineData.push(d);
      })
    }else if(data.type === 'Feature') {
      var lineData;

      lineData = data;
    }

    if(overlayContent) {
      // if have overlay content, click to show overlay
      var onLineClick = (dom, d, i) => {
        showOverlay(dom, d, overlayContent, i);
        if(onClick) onClick(dom, d, i);
      }
    }else {
      var onLineClick = onClick;
    }

    if(lineData) {
      // if not array, make it as array
      if(!Array.isArray(lineData))
        lineData = [lineData];

      meshs = lineData.map((d, i) => {
        return (
          <Mesh
            id= {'react-d3-map__mesh' + i}
            key= {'react-d3-map__mesh' + i}
            data= {d}
            geoPath= {geoPath}
            onClick= {onLineClick}
            onMouseOver= {onMouseOver}
            onMouseOut= {onMouseOut}
            meshClass= {meshClass}
          />
        )
      })
    }


    return (
      <g>
        {meshs}
      </g>
    )
  }
}
