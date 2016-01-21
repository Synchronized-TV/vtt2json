export default function ({ types: t }) {
  function hasRefOrSpread(attrs) {
    for (let i = 0; i < attrs.length; i++) {
      let attr = attrs[i];
      if (t.isJSXSpreadAttribute(attr)) return true;
      if (isJSXAttributeOfName(attr, "ref")) return true;
    }
    return false;
  }

  function isJSXAttributeOfName(attr, name) {
    return t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name, { name: name });
  }

  function getAttributeValue(attr) {
    let value = attr.value;
    if (!value) return t.identifier("true");
    if (t.isJSXExpressionContainer(value)) value = value.expression;
    return value;
  }

  return {
    visitor: {
      JSXElement(path, file) {
        let { node } = path;

        // filter
        let open = node.openingElement;
        if (hasRefOrSpread(open.attributes)) return;

        // init
        let finalObj    = t.objectExpression([]);
        let props       = t.objectExpression([]);
        let key         = null;
        let type        = open.name;

        type = t.stringLiteral(type.name);

        function pushProp(objProps, key, value) {
          objProps.push(t.objectProperty(key, value));
        }

        // props
        for (let attr of open.attributes) {
          if (isJSXAttributeOfName(attr, "key")) {
            key = getAttributeValue(attr);
          } else {
            let name = attr.name.name;
            let propertyKey = t.isValidIdentifier(name) ? t.identifier(name) : t.stringLiteral(name);
            pushProp(props.properties, propertyKey, getAttributeValue(attr));
          }
        }

        if (key || node.children.length) {
          let children = t.react.buildChildren(node);
          pushProp(props.properties, t.identifier('children'), t.arrayExpression(children));
        }

        pushProp(finalObj.properties, t.identifier('type'), type);

        if (props.properties.length) {
          pushProp(finalObj.properties, t.identifier('props'), props);
        }

        let el = finalObj;
        path.replaceWith(el);
      }
    }
  };
}
