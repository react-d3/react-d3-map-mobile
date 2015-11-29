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

  static contextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired
  }

  render() {
    const {
      data,
      onClick,
      onMouseOut,
      onMouseOver,
      pointClass
    } = this.props;

    const {
      geoPath
    } = this.context;

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
      // if not array, make it as array
      if(!Array.isArray(pointData))
        pointData = [pointData];

      points = pointData.map((d, i) => {
        var x = +projection(d.geometry.coordinates)[0];
        var y = +projection(d.geometry.coordinates)[1];
        var id = x + '-' + y;
        return (
          <Point
            id= {id}
            key= {i}
            data= {d}
            x= {x}
            y= {y}
            onClick= {onClick}
            onMouseOver= {onMouseOver}
            onMouseOut= {onMouseOut}
            pointClass= {pointClass}
          />
        )
      })
    }

    return (
      <g>
        {points}
      </g>
    )
  }
}
