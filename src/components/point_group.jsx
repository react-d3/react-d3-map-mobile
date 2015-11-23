"use strict"

import {
  default as React,
  Component,
  PropTypes
} from 'react'

import {
  Point
} from 'react-d3-map-core';

export default class PointGroup extends Component {

  render() {
    const {
      data,
      geoPath,
      onClick,
      pointClass
    } = this.props;

    var points;

    if(data && data !== []) {
      if(Array.isArray(data)) {
        points = data.map((d, i) => {
          return (
            <Point
              id= {d.properties.react_d3_map_mobile__id}
              key= {i}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              pointClass= {pointClass}
            />
          )
        })
      }else {
        points = (<Point
          id= {data.properties.react_d3_map_mobile__id}
          data= {data}
          geoPath= {geoPath}
          onClick= {onClick}
          pointClass= {pointClass}
        />)
      }
    }

    return (
      <g>
        {points}
      </g>
    )
  }
}
