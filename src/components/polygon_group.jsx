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

  static contextTypes = {
    geoPath: React.PropTypes.func.isRequired,
    projection: React.PropTypes.func.isRequired,
    showOverlay: React.PropTypes.func.isRequired
  }

  render() {
    const {
      data,
      onClick,
      onMouseOver,
      onMouseOut,
      polygonClass,
      overlayContent
    } = this.props;

    const {
      geoPath,
      showOverlay
    } = this.context;

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

    if(overlayContent) {
      // if have overlay content, click to show overlay
      var onPolygonClick = (dom, d, i) => {
        showOverlay(dom, d, overlayContent, i);
        if(onClick) onClick(dom, d, i);
      }
    }else {
      var onPolygonClick = onClick;
    }

    if(polygonData) {
      // if not array, make it as array
      if(!Array.isArray(polygonData))
        polygonData = [polygonData];

      polygons = polygonData.map((d, i) => {
        return (
          <Polygon
            id= {'react-d3-map__polygon' + i}
            key= {'react-d3-map__polygon' + i}
            data= {d}
            geoPath= {geoPath}
            onClick= {onPolygonClick}
            onMouseOver= {onMouseOver}
            onMouseOut= {onMouseOut}
            polygonClass= {polygonClass}
          />
        )
      })
    }

    return (
      <g>
        {polygons}
      </g>
    )
  }
}
