var eCREATOR_COMBINATOR  = 1;
var eCREATOR_TYPE        = 2;
var eCREATOR_ID          = 3;
var eCREATOR_CLASS       = 4;
var eCREATOR_PSEUDOCLASS = 5;
var eCREATOR_ATTRIBUTE   = 6;
var eCREATOR_TEXT        = 7;

/**************************************************/
function Creator()
{
  this.mList = [];
}

Creator.prototype = {
  mList: [],

  get length() {
    return this.mList.length;
  },

  get list() {
    return this.mList;
  },

  concat: function() {
    return Array.prototype.concat.apply(this.mList, arguments);
  },

  entries: function() {
    return this.mList.entries();
  },

  forEach: function() {
    return Array.prototype.forEach.apply(this.mList, arguments);
  },

  map: function() {
    return Array.prototype.map.apply(this.mList, arguments);
  },
 
  pop: function() {
    return this.mList.pop();
  },

  push: function() {
    return Array.prototype.push.apply(this.mList, arguments);
  },

  shift: function() {
    return this.mList.shift();
  },

  toString: function() {
    return this.mList
               .map(function(e) { return e.toString(); })
               .join("");
  }
};

/**************************************************/
function Combinator(aSymbol)
{
  this.mSymbol = aSymbol;
}

Combinator.prototype = {
  mSymbol: "",

  get type() {
    return eCREATOR_COMBINATOR;
  },

  get value() {
    return this.mSymbol;
  },

  toString: function() {
    return this.value.trim() ? " " + this.value + " " : " ";
  }
};

/**************************************************/
function TypeCreator(aTagName)
{
  this.mTagName = aTagName;
  this.mOtherCreators = [];
}

TypeCreator.prototype = {
  mTagName: "",
  mOtherCreators: [],

  get type() {
    return eCREATOR_TYPE;
  },

  get value() {
    return this.mTagName;
  },

  get creators() {
    return this.mOtherCreators;
  },

  addCreator: function() {
    return Array.prototype.push.apply(this.mOtherCreators, arguments);
  },

  toString: function() {
    return this.value
           + this.creators
               .map(function(e) { return e.toString(); })
               .join("");
  }
};

/**************************************************/
function IdCreator(aId)
{
  this.mId = aId;
}

IdCreator.prototype = {
  mId: "",

  get type() {
    return eCREATOR_ID;
  },

  get value() {
    return this.mId;
  },

  toString: function() {
    return "#" + this.value;
  }
};

/**************************************************/
function ClassCreator(aName)
{
  this.mClass = aName;
}

ClassCreator.prototype = {
  mClass: "",

  get type() {
    return eCREATOR_CLASS;
  },

  get value() {
    return this.mClass;
  },

  toString: function() {
    return "." + this.value;
  }
};

/**************************************************/
function PseudoClassCreator(aName)
{
  this.mPseudoClass = aName;
}

PseudoClassCreator.prototype = {
  mPseudoClass: "",

  get type() {
    return eCREATOR_PSEUDOCLASS;
  },

  get value() {
    return this.mPseudoClass;
  },

  toString: function() {
    return ":" + this.value;
  }
};

/**************************************************/
function AttributeCreator(aName, aOperator, aValue)
{
  this.mName     = aName;
  this.mOperator = aOperator;
  this.mValue    = aValue;
}

AttributeCreator.prototype = {
  mName: "",
  mOperator: "",
  mValue: "",

  get type() {
    return eCREATOR_ATTRIBUTE;
  },

  get name() {
    return this.mName;
  },

  get operator() {
    return this.mOperator;
  },

  get value() {
    return this.mValue;
  },

  toString: function() {
    return "[" + this.name
           + (this.mOperator ? this.mOperator + '"' + this.mValue + '"': "")
           + "]";
  }
};

/**************************************************/
function TextCreator(aPosition, aText)
{
  this.mPosition = aPosition;
  this.mText = aText;
}

TextCreator.prototype = {
  mPosition: "",
  mText: "",

  get type() {
    return eCREATOR_TEXT;
  },

  get position() {
    return this.mPosition;
  },

  get value() {
    return this.mText;
  },

  toString: function() {
    return "[[" + this.position + '"' + this.value + '"]]';
  }
};

/**************************************************/

function CreatorsParser(aString)
{
  this.mToken = null;
  this.mLookAhead = null;
  this.mScanner = new CSSScanner(aString);
}

CreatorsParser.prototype = {

  kUNEXPECTED_CREATOR_END: "Unexpected end of Creator.",
  kMALFORMED_ID_CREATOR: "Malformed Id creator.",
  kMALFORMED_CLASS_CREATOR: "Malformed Class creator.",
  kMALFORMED_PSEUDO_CLASS_CREATOR: "Malformed PseudoClass creator.",
  kMALFORMED_ATTRIBUTE_CREATOR: "Malformed Attribute creator.",
  kEXPECTED_SIMPLE_CREATOR: "Expected Type, Id, Class, Pseudoclass or Attribute creator.",
  kEXPECTED_COMBINATOR: "Expected Combinator instead of ",
  kSYNTAX_ERROR: "Syntax Error.",

  currentToken: function() {
    return this.mToken;
  },

  getHexValue: function() {
    this.mToken = this.mScanner.nextHexValue();
    return this.mToken;
  },

  getToken: function(aSkipWS, aSkipComment) {
    if (this.mLookAhead) {
      this.mToken = this.mLookAhead;
      this.mLookAhead = null;
      return this.mToken;
    }

    this.mToken = this.mScanner.nextToken();
    while (this.mToken &&
           ((aSkipWS && this.mToken.isWhiteSpace()) ||
            (aSkipComment && this.mToken.isComment())))
      this.mToken = this.mScanner.nextToken();

    return this.mToken;
  },

  lookAhead: function(aSkipWS, aSkipComment) {
    var preservedToken = this.mToken;
    this.mScanner.preserveState();
    var token = this.getToken(aSkipWS, aSkipComment);
    this.mScanner.restoreState();
    this.mToken = preservedToken;

    return token;
  },

  ungetToken: function() {
    this.mLookAhead = this.mToken;
  },

  fireError: function (aCallerName, aError)
  {
    throw aCallerName + ": " + aError;
  },
  
  parse: function(aCallerName) {
    var token = this.getToken(true, true);
    if (!token.isNotNull()) {
      this.fireError(aCallerName, this.kUNEXPECTED_CREATOR_END)
    }

    var creator = new Creator();

    // do we start with a combinator?
    if(token.isSymbol(">") || token.isSymbol("+")) {
      var combinator = new Combinator(token.value);
      creator.push(combinator);

      token = this.getToken(true, true);
      if (!token.isNotNull()) {
        // we need something after the combinator
        this.fireError(aCallerName, this.kUNEXPECTED_CREATOR_END)
      }
    }

    while (token.isNotNull()) {
      var typeCreator = null;

      if (token.isSymbol("*")) {
        typeCreator = new TypeCreator("*");
        creator.push(typeCreator);
        token = this.getToken(false, true);
      }
      else if (token.isIdent()) {
        typeCreator = new TypeCreator(token.value);
        creator.push(typeCreator);
        token = this.getToken(false, true);
      }

      while (token.isSymbol("#")
             || token.isSymbol(".")
             || token.isSymbol(":")
             || token.isSymbol("[")) {
        if (!typeCreator) {
          typeCreator = new TypeCreator("*");
          creator.push(typeCreator);
        }

        if (token.isSymbol("#")) {
          token = this.getToken(false, true);
          if (token.isIdent()) {
            var idCreator = new IdCreator(token.value);
            typeCreator.addCreator(idCreator);
            token = this.getToken(false, true);
          }
          else
            this.fireError(aCallerName, this.kMALFORMED_ID_CREATOR)
        }
        else if (token.isSymbol(".")) {
          token = this.getToken(false, true);
          if (token.isIdent()) {
            var classCreator = new ClassCreator(token.value);
            typeCreator.addCreator(classCreator);
            token = this.getToken(false, true);
          }
          else
            this.fireError(aCallerName, this.kMALFORMED_CLASS_CREATOR)
        }
        else if (token.isSymbol(":")) {
          token = this.getToken(false, true);
          if (token.isIdent()) {
            var pseudoClassCreator = new PseudoClassCreator(token.value);
            typeCreator.addCreator(pseudoClassCreator);
            token = this.getToken(false, true);
          }
          else if (token.isFunction()) {
            var name = token.value.substr(0, token.value.length - 1);
            switch (name) {
              case "not": 
            }
          }
          else
            this.fireError(aCallerName, this.kMALFORMED_PSEUDO_CLASS_CREATOR)
        }
        else if (token.isSymbol("[")) {
          token = this.getToken(true, true);
          if (token.isIdent()) {
            var name = token.value;
            token = this.getToken(true, true);

            if (token.isSymbol("]")) {
              var attributeCreator = new AttributeCreator(name, null, null);
              typeCreator.addCreator(attributeCreator);
              token = this.getToken(false, true);
            }
            else if (token.isSymbol("=")
                     || token.isIncludes()
                     || token.isDashMatch()
                     || token.isBeginsMatch()
                     || token.isEndsMatch()
                     || token.isContainsMatch()) {
              var operator = token.value;
              token = this.getToken(true, true);

              if (token.isIdent() || token.isString()) {
                var value = token.value;
                token = this.getToken(true, true);

                if (token.isSymbol("]")) {
                  attributeCreator = new AttributeCreator(name, operator, value);
                  typeCreator.addCreator(attributeCreator);
                  token = this.getToken(false, true);
                }
                else
                  this.fireError(aCallerName, this.kMISSING_CLOSING_BRACKET)
              }
              else
                this.fireError(aCallerName, this.kMALFORMED_ATTRIBUTE_CREATOR)
            }
            else
              this.fireError(aCallerName, this.kMALFORMED_ATTRIBUTE_CREATOR)
          }

          else if (token.isSymbol("[")) {
            token = this.getToken(true, true);
            var position = "";
            if (token.isSymbol("^") || token.isSymbol("$")) {
              position = token.value;
              token = this.getToken(true, true);
            }

            if (token.isString()) {
              var textCreator = new TextCreator(position, token.value);
              typeCreator.addCreator(textCreator);
              token = this.getToken(true, true);
              if (!token.isSymbol("]"))
                this.fireError(aCallerName, this.MALFORMED_TEXT_CREATOR)
              token = this.getToken(false, true);
              if (!token.isSymbol("]"))
                this.fireError(aCallerName, this.MALFORMED_TEXT_CREATOR)
              token = this.getToken(false, true);
            }
            else
              this.fireError(aCallerName, this.MALFORMED_TEXT_CREATOR)
          }

          else
            this.fireError(aCallerName, this.kMALFORMED_ATTRIBUTE_CREATOR)
        }
      } // while (token.isSymbol("#")

      if (!typeCreator)
        this.fireError(aCallerName, this.kEXPECTED_SIMPLE_CREATOR)

      // do we have a combinator now?
      if (token.isWhiteSpace())
        token = this.getToken(true, true);

      if (token.isSymbol(">") || token.isSymbol("+")) {
        combinator = new Combinator(token.value);
        creator.push(combinator);
  
        token = this.getToken(true, true);
      }
      else if (!token.isNotNull())
        return creator;
      else
        this.fireError(aCallerName, this.kEXPECTED_COMBINATOR + " " + token.value)
      
    } // while (!token.isNotNull()) {

    return creator;
  }
};
