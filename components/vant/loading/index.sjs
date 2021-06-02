var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function spinnerStyle(data) {
  return style({
    color: data.color,
    width: addUnit(data.size),
    height: addUnit(data.size)
  });
}

function textStyle(data) {
  return style({
    'font-size': addUnit(data.textSize)
  });
}

antmove_export = {
  spinnerStyle: spinnerStyle,
  textStyle: textStyle
};
export default antmove_export;