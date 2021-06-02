var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';

/* eslint-disable */
var style = antmove_1_module;

function rootStyle(data) {
  return style([{
    '-webkit-transition-duration': data.currentDuration + 'ms',
    'transition-duration': data.currentDuration + 'ms'
  }, data.display ? null : 'display: none', data.customStyle]);
}

antmove_export = {
  rootStyle: rootStyle
};
export default antmove_export;