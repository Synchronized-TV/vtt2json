"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  function hasRefOrSpread(attrs) {
    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];
      if (t.isJSXSpreadAttribute(attr)) return true;
      if (isJSXAttributeOfName(attr, "ref")) return true;
    }
    return false;
  }

  function isJSXAttributeOfName(attr, name) {
    return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: name });
  }

  function getAttributeValue(attr) {
    var value = attr.value;
    if (!value) return t.identifier("true");
    if (t.isJSXExpressionContainer(value)) value = value.expression;
    return value;
  }

  return {
    visitor: {
      JSXElement: function JSXElement(path, file) {
        var node = path.node;

        // filter

        var open = node.openingElement;
        if (hasRefOrSpread(open.attributes)) return;

        // init
        var finalObj = t.objectExpression([]);
        var props = t.objectExpression([]);
        var key = null;
        var type = open.name;

        type = t.stringLiteral(type.name);

        function pushProp(objProps, key, value) {
          objProps.push(t.objectProperty(key, value));
        }

        // props
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = open.attributes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var attr = _step.value;

            if (isJSXAttributeOfName(attr, "key")) {
              key = getAttributeValue(attr);
            } else {
              var name = attr.name.name;
              var propertyKey = t.isValidIdentifier(name) ? t.identifier(name) : t.stringLiteral(name);
              pushProp(props.properties, propertyKey, getAttributeValue(attr));
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        if (key || node.children.length) {
          var children = t.react.buildChildren(node);
          pushProp(props.properties, t.identifier('children'), t.arrayExpression(children));
        }

        pushProp(finalObj.properties, t.identifier('type'), type);

        if (props.properties.length) {
          pushProp(finalObj.properties, t.identifier('props'), props);
        }

        var el = finalObj;
        path.replaceWith(el);
      }
    }
  };
};