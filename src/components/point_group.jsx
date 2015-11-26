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

    if(data.type === 'FeatureCollection') {
      var pointData = [];

      // loop through features
      data.features.forEach(function(d) {
        pointData.push(d);
      })
    }else if(data.type === 'Feature') {
      var pointData;

      pointData = data;
    }

    if(pointData) {
      if(Array.isArray(pointData)) {
        points = pointData.map((d, i) => {
          return (
            <Point
              id= {'react-d3-map__point' + i}
              key= {'react-d3-map__point' + i}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              pointClass= {pointClass}
            />
          )
        })
      }else {
        points = (<Point
          id= {'react-d3-map__point'}
          data= {pointData}
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
