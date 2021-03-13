var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function isObj(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function optionText(option, valueKey) {
  return isObj(option) && option[valueKey] != null ? option[valueKey] : option;
}

function rootStyle(data) {
  return style({
    height: addUnit(data.itemHeight * data.visibleItemCount)
  });
}

function wrapperStyle(data) {
  var offset = addUnit(data.offset + data.itemHeight * (data.visibleItemCount - 1) / 2);
  return style({
    transition: 'transform ' + data.duration + 'ms',
    'line-height': addUnit(data.itemHeight),
    transform: 'translate3d(0, ' + offset + ', 0)'
  });
}

antmove_export = {
  optionText: optionText,
  rootStyle: rootStyle,
  wrapperStyle: wrapperStyle
};
export default antmove_export;