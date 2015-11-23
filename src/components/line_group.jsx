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

    if(data && data !== []) {
      if(Array.isArray(data)) {
        meshs = data.map((d, i) => {
          return (
            <Mesh
              id= {d.properties.react_d3_map_mobile__id}
              key= {i}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              meshClass= {meshClass}
            />
          )
        })
      }else {
        meshs = (<Mesh
          id= {data.properties.react_d3_map_mobile__id}
          data= {data}
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
