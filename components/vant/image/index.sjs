var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function rootStyle(data) {
  return style([{
    width: addUnit(data.width),
    height: addUnit(data.height),
    'border-radius': addUnit(data.radius)
  }, data.radius ? 'overflow: hidden' : null]);
}

var FIT_MODE_MAP = {
  none: 'center',
  fill: 'scaleToFill',
  cover: 'aspectFill',
  contain: 'aspectFit',
  widthFix: 'widthFix',
  heightFix: 'heightFix'
};

function mode(fit) {
  return FIT_MODE_MAP[fit];
}

antmove_export = {
  rootStyle: rootStyle,
  mode: mode
};
export default antmove_export;