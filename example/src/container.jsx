"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var topojson = require('topojson');

var MercatorMobileMap = require('../../lib/index').MercatorMobileMap;
var PolygonGroup = require('../../lib/index').PolygonGroup;

var css= require('./css/polygon.css');

// Example
(function() {
  var width = window.innerWidth > 736? 736 : window.innerWidth;
  var height = window.innerHeight > 736? 736 : window.innerHeight;
  var scale = (1 << 18);
  var controllerScale = (1 << 14);
  var center = [-73.95, 40.7];
  var data = {geometry: {coordinates: [[[-74.0479, 40.8820], [-73.9067, 40.8820], [-73.9067, 40.6829], [-74.0479, 40.6829], [-74.0479, 40.8820]]], type: "Polygon"}, id: 999999, properties:{"text": "hi, this is a polygon!"}, type: "Feature"};
  var content = function(d) { return d.properties.text; }

  ReactDOM.render(
    <MercatorMobileMap
      width= {width}
      height= {height}
      scale= {scale}
      controllerScale= {controllerScale}
      center= {center}
    >
      <PolygonGroup
        data= {data}
        content= {content}
        polygonClass= {'react-d3-map-mobile__mercator_controller__polygon_group'}
      />
    </MercatorMobileMap>
  , document.getElementById('blank-container')
  )

})()
