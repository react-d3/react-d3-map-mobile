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

  render() {
    const {
      data,
      geoPath,
      onClick,
      meshClass
    } = this.props;

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

    if(lineData) {
      if(Array.isArray(lineData)) {
        meshs = lineData.map((d, i) => {
          return (
            <Mesh
              id= {'react-d3-map__mesh' + i}
              key= {'react-d3-map__mesh' + i}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              meshClass= {meshClass}
            />
          )
        })
      }else {
        meshs = (<Mesh
          id= {'react-d3-map__mesh'}
          data= {lineData}
          geoPath= {geoPath}
          onClick= {onClick}
          meshClass= {meshClass}
        />)
      }
    }

    return (
      <g>
        {meshs}
      </g>
    )
  }
}
