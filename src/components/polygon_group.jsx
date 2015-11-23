"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Polygon
} from 'react-d3-map-core';

export default class PolygonGroup extends Component {
  render() {
    const {
      data,
      geoPath,
      onClick,
      polygonClass
    } = this.props;

    var polygons;

    if(data && data !== []) {
      if(Array.isArray(data)) {
        polygons = data.map((d, i) => {
          return (
            <Polygon
              id= {d.properties.react_d3_map_mobile__id}
              key= {d.properties.react_d3_map_mobile__id}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              polygonClass= {polygonClass}
            />
          )
        })
      }else {
        polygons = (<Polygon
          id= {data.properties.react_d3_map_mobile__id}
          data= {data}
          geoPath= {geoPath}
          onClick= {onClick}
          polygonClass= {polygonClass}
        />)
      }
    }

    return (
      <g>
        {polygons}
      </g>
    )
  }
}
