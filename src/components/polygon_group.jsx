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

    if(data.type === 'FeatureCollection') {
      var polygonData = [];

      // loop through features
      data.features.forEach(function(d) {
        polygonData.push(d);
      })
    }else if(data.type === 'Feature') {
      var polygonData;

      polygonData = data;
    }

    if(polygonData) {
      if(Array.isArray(polygonData)) {
        polygons = polygonData.map((d, i) => {
          return (
            <Polygon
              id= {'react-d3-map__polygon' + i}
              key= {'react-d3-map__polygon' + i}
              data= {d}
              geoPath= {geoPath}
              onClick= {onClick}
              polygonClass= {polygonClass}
            />
          )
        })
      }else {
        polygons = (<Polygon
          id= {'react-d3-map__polygon'}
          data= {polygonData}
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
