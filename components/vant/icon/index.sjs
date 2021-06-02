var antmove_export = {};
import antmove_1_module from '../wxs/style.sjs';
import antmove_2_module from '../wxs/add-unit.sjs';

/* eslint-disable */
var style = antmove_1_module;
var addUnit = antmove_2_module;

function isImage(name) {
  return name.indexOf('/') !== -1;
}

function rootClass(data) {
  var classes = ['custom-class'];

  if (data.classPrefix != null) {
    classes.push(data.classPrefix);
  }

  if (isImage(data.name)) {
    classes.push('van-icon--image');
  } else if (data.classPrefix != null) {
    classes.push(data.classPrefix + '-' + data.name);
  }

  return classes.join(' ');
}

function rootStyle(data) {
  return style([{
    color: data.color,
    'font-size': addUnit(data.size)
  }, data.customStyle]);
}

antmove_export = {
  isImage: isImage,
  rootClass: rootClass,
  rootStyle: rootStyle
};
export default antmove_export;