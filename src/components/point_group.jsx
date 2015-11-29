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
    projection: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.func.isRequired
  }

  render() {
    const {
      data,
      onClick,
      onMouseOut,
      onMouseOver,
      pointClass,
      overlayContent
    } = this.props;

    const {
      geoPath,
      projection,
      showOverlay
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

    if(overlayContent) {
      // if have overlay content, click to show overlay
      var onPointClick = (dom, d, i) => {
        showOverlay(dom, d, overlayContent, i);
        if(onClick) onClick(dom, d, i);
      }
    }else {
      var onPointClick = onClick;
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
            geoPath= {geoPath}
            x= {x}
            y= {y}
            onClick= {onPointClick}
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
