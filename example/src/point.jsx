"use strict";

var React = require('react');
var ReactDOM = require('react-dom');
var topojson = require('topojson');

var MercatorMobileMap = require('../../lib/index').MercatorMobileMap;
var PointGroup = require('../../lib/index').PointGroup;
var MarkerGroup = require('../../lib/index').MarkerGroup;

var css= require('./css/polygon.css');

// Example
(function() {
  var width = window.innerWidth > 736? 736 : window.innerWidth;
  var height = window.innerHeight > 736? 736 : window.innerHeight;
  var scale = 1200 * 5;
  var controllerScale = (1 << 8);
  var center = [-5, 55.4];
  var uk = require('json!../data/uk.json');
  var data = topojson.feature(uk, uk.objects.places);
  var content = function(d) { return d.properties.name; }

  ReactDOM.render(
    <MercatorMobileMap
      width= {width}
      height= {height}
      scale= {scale}
      controllerScale= {controllerScale}
      center= {center}
    >
      <MarkerGroup
        data= {data}
        overlayContent= {content}
        markerClass= {'react-d3-map-mobile__mercator_controller__marker_group'}
      />
    </MercatorMobileMap>
  , document.getElementById('blank-point')
  )

})()
