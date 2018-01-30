Document.prototype.createDocumentFragmentFromSelector = function(aSelector) {
  
  var displayName = "createDocumentFragmentFromSelector";

  var parser = new CreatorsParser(aSelector);
  var parsed = parser.parse(displayName, false);

  if (!parsed.length)
    throw displayName + ": Empty or unparsable selector.";
  if (parsed.list[0].type != eCREATOR_TYPE)
    throw displayName + ": Relative selectors are not allowed.";

  var docFragment = this.createDocumentFragment();
  var currentParent = docFragment;
  for (var i = 0;  i < parsed.length ; i++) {
    var creator = parsed.list[i];

    switch (creator.type) {
      case eCREATOR_TYPE:
        {
          if (creator.value == "*")
            throw displayName + ": Universal selector is not allowed.";
          if (creator.negated)
            throw displayName + ": :not() is not allowed.";

          var elt = this.createElement(creator.value);
          var otherCreatorsArray = creator.creators;
          if (otherCreatorsArray) {
            for (var j = 0; j < otherCreatorsArray.length; j++) {
              var otherCreator = otherCreatorsArray[j];
              switch (otherCreator.type) {
                case eCREATOR_ID:    elt.id = otherCreator.value; break;

                case eCREATOR_CLASS: elt.classList.add(otherCreator.value); break;

                case eCREATOR_PSEUDOCLASS:
                  throw displayName + ": Pseudo-classes are not allowed.";
                  break;

                case eCREATOR_ATTRIBUTE:
                {
                  if (otherCreator.operator) {
                    switch (otherCreator.operator) {
                      case "=":  elt.setAttribute(otherCreator.name, otherCreator.value); break;
                      case "^=": elt.setAttribute(otherCreator.name, otherCreator.value + elt.getAttribute(otherCreator.name)); break;
                      case "~=": elt.setAttribute(otherCreator.name, elt.getAttribute(otherCreator.name) + otherCreator.value); break;

                      default:
                        throw displayName + ": Unsupported operator in Attribute selector.";
                    }
                  }
                  else
                    elt.setAttribute(otherCreator.name, otherCreator.name);
                }
                break;

                case eCREATOR_TEXT:
                  switch (otherCreator.position) {
                    case "":  elt.textContent =  otherCreator.value; break;
                    case "^": elt.textContent =  otherCreator.value + elt.textContent; break;
                    case "$": elt.textContent += otherCreator.value; break;
                  }
                  break;

                default: throw displayName + ": syntax error.";
              }
            }
          }

          currentParent.appendChild(elt);
        }
        break;

      case eCREATOR_COMBINATOR:
        {
          if (creator.value == ">") {
            currentParent = currentParent.lastElementChild;
          }
        }
        break;

      default:
        throw displayName + ": syntax error.";
    }
  }

  return docFragment;
};


Document.prototype.modifyElementFromSelector = function(aElement, aSelector) {

  var displayName = "modifyElementFromSelector";

  if (!aElement || !(aElement instanceof Element))
    throw displayName + ": First argument is not an Element.";

  var parser = new CreatorsParser(aSelector);
  var parsed = parser.parse(displayName, false);

  if (!parsed.length)
    throw displayName + ": Empty or unparsable selector.";
  if (parsed.length > 1)
    throw displayName + ": Combinators are not allowed (yet).";
  if (parsed.list[0].type != eCREATOR_TYPE)
    throw displayName + ": Relative selectors are not allowed.";

  var elt = aElement;
  for (var i = 0;  i < parsed.length ; i++) {
    var creator = parsed.list[i];

    switch (creator.type) {
      case eCREATOR_TYPE:
        {
          if (creator.value != "*") {
            var isHtml = (elt instanceof HTMLElement);
            if (elt.nodeName.toLowerCase() != creator.value.toLowerCase()) {
              var newElt = this.createElement(creator.value);
              // move contents
              while (elt.firstChild)
                newElt.appendChild(elt.firstChild);
              // copy attributes
              for (var i = 0; i < elt.attributes.length; i++) {
                var attr = elt.attributes.item(i);
                newElt.setAttribute(attr.name, attr.value);
              }

              var parent = elt.parentNode;
              parent.insertBefore(newElt, elt);
              parent.removeChild(elt);
              elt = newElt;
            }
          }

          var otherCreatorsArray = creator.creators;
          if (otherCreatorsArray) {
            for (var j = 0; j < otherCreatorsArray.length; j++) {
              var otherCreator = otherCreatorsArray[j];
              switch (otherCreator.type) {
                case eCREATOR_ID:    elt.id = otherCreator.value; break;

                case eCREATOR_CLASS: elt.classList.add(otherCreator.value); break;

                case eCREATOR_PSEUDOCLASS:
                  throw displayName + ": Pseudo-classes are not allowed.";
                  break;

                case eCREATOR_ATTRIBUTE:
                {
                  if (otherCreator.operator) {
                    switch (otherCreator.operator) {
                      case "=":  elt.setAttribute(otherCreator.name, otherCreator.value); break;
                      case "^=": elt.setAttribute(otherCreator.name, otherCreator.value + elt.getAttribute(otherCreator.name)); break;
                      case "~=": elt.setAttribute(otherCreator.name, elt.getAttribute(otherCreator.name) + otherCreator.value); break;

                      default:
                        throw displayName + ": Unsupported operator in Attribute selector.";
                    }
                  }
                  else
                    elt.setAttribute(otherCreator.name, otherCreator.name);
                }
                break;

                case eCREATOR_TEXT:
                  switch (otherCreator.position) {
                    case "":  elt.textContent =  otherCreator.value; break;
                    case "^": elt.textContent =  otherCreator.value + elt.textContent; break;
                    case "$": elt.textContent += otherCreator.value; break;
                  }
                  break;

                default: throw displayName + ": syntax error.";
              }
            }
          }

          var negatedArray = creator.negated;
          if (creator.negated) {
            var negatedArray = creator.negated.creators;
            for (var j = 0; j < negatedArray.length; j++) {
              var negated = negatedArray[j];
              switch (negated.type) {
                case eCREATOR_ID:    if (elt.id == negated.value) elt.removeAttribute("id"); break;

                case eCREATOR_CLASS: elt.classList.remove(negated.value); break;

                case eCREATOR_PSEUDOCLASS:
                  throw displayName + ": Pseudo-classes are not allowed inside :not().";
                  break;

                case eCREATOR_ATTRIBUTE:
                {
                  if (otherCreator.operator) {
                    throw displayName + ": Unsupported operator in Attribute selector inside :not().";
                  }
                  else
                    elt.removeAttribute(negated.name);
                }
                break;

                case eCREATOR_TEXT:
                  throw displayName + ": Unsupported text creator inside :not().";
                  break;

                default: throw displayName + ": syntax error.";
              }
            }
          }
        }
        break;

      case eCREATOR_COMBINATOR:
        throw displayName + ": Combinators are not allowed (yet)";

      default:
        throw displayName + ": syntax error.";
    }
  }

  return elt;
};

