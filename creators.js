/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is mozilla.org code.
 *
 * The Initial Developer of the Original Code is
 * Netscape Communications Corporation.
 * Portions created by the Initial Developer are Copyright (C) 1998
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   emk <VYV03354@nifty.ne.jp>
 *   Daniel Glazman <glazman@netscape.com>
 *   L. David Baron <dbaron@dbaron.org>
 *   Boris Zbarsky <bzbarsky@mit.edu>
 *   Mats Palmgren <mats.palmgren@bredband.net>
 *   Christian Biesinger <cbiesinger@web.de>
 *   Jeff Walden <jwalden+code@mit.edu>
 *   Jonathon Jongsma <jonathon.jongsma@collabora.co.uk>, Collabora Ltd.
 *   Siraj Razick <siraj.razick@collabora.co.uk>, Collabora Ltd.
 *   Daniel Glazman <daniel.glazman@disruptive-innovations.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either of the GNU General Public License Version 2 or later (the "GPL"),
 * or the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

var CSS_ESCAPE  = '\\';

var IS_HEX_DIGIT  = 1;
var START_IDENT   = 2;
var IS_IDENT      = 4;
var IS_WHITESPACE = 8;

var W   = IS_WHITESPACE;
var I   = IS_IDENT;
var S   =          START_IDENT;
var SI  = IS_IDENT|START_IDENT;
var XI  = IS_IDENT            |IS_HEX_DIGIT;
var XSI = IS_IDENT|START_IDENT|IS_HEX_DIGIT;

function jscsspToken(aType, aValue, aUnit)
{
  this.type = aType;
  this.value = aValue;
  this.unit = aUnit;
}

jscsspToken.NULL_TYPE = 0;

jscsspToken.WHITESPACE_TYPE = 1;
jscsspToken.STRING_TYPE = 2;
jscsspToken.COMMENT_TYPE = 3;
jscsspToken.NUMBER_TYPE = 4;
jscsspToken.IDENT_TYPE = 5;
jscsspToken.FUNCTION_TYPE = 6;
jscsspToken.ATRULE_TYPE = 7;
jscsspToken.INCLUDES_TYPE = 8;
jscsspToken.DASHMATCH_TYPE = 9;
jscsspToken.BEGINSMATCH_TYPE = 10;
jscsspToken.ENDSMATCH_TYPE = 11;
jscsspToken.CONTAINSMATCH_TYPE = 12;
jscsspToken.SYMBOL_TYPE = 13;
jscsspToken.DIMENSION_TYPE = 14;
jscsspToken.PERCENTAGE_TYPE = 15;
jscsspToken.HEX_TYPE = 16;
jscsspToken.INCOMPLETE_STRING_TYPE = 17;

jscsspToken.prototype = {

  isNotNull: function ()
  {
    return this.type;
  },

  _isOfType: function (aType, aValue)
  {
    return (this.type == aType && (!aValue || this.value.toLowerCase() == aValue));
  },

  isWhiteSpace: function(w)
  {
    return this._isOfType(jscsspToken.WHITESPACE_TYPE, w);
  },

  isString: function()
  {
    return this._isOfType(jscsspToken.STRING_TYPE);
  },

  isComment: function()
  {
    return this._isOfType(jscsspToken.COMMENT_TYPE);
  },

  isNumber: function(n)
  {
    return this._isOfType(jscsspToken.NUMBER_TYPE, n);
  },

  isSymbol: function(c)
  {
    return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
  },

  isIdent: function(i)
  {
    return this._isOfType(jscsspToken.IDENT_TYPE, i);
  },

  isFunction: function(f)
  {
    return this._isOfType(jscsspToken.FUNCTION_TYPE, f);
  },

  isAtRule: function(a)
  {
    return this._isOfType(jscsspToken.ATRULE_TYPE, a);
  },

  isIncludes: function()
  {
    return this._isOfType(jscsspToken.INCLUDES_TYPE);
  },

  isDashmatch: function()
  {
    return this._isOfType(jscsspToken.DASHMATCH_TYPE);
  },

  isBeginsmatch: function()
  {
    return this._isOfType(jscsspToken.BEGINSMATCH_TYPE);
  },

  isEndsmatch: function()
  {
    return this._isOfType(jscsspToken.ENDSMATCH_TYPE);
  },

  isContainsmatch: function()
  {
    return this._isOfType(jscsspToken.CONTAINSMATCH_TYPE);
  },

  isSymbol: function(c)
  {
    return this._isOfType(jscsspToken.SYMBOL_TYPE, c);
  },

  isDimension: function()
  {
    return this._isOfType(jscsspToken.DIMENSION_TYPE);
  },

  isPercentage: function()
  {
    return this._isOfType(jscsspToken.PERCENTAGE_TYPE);
  },

  isHex: function()
  {
    return this._isOfType(jscsspToken.HEX_TYPE);
  },

  isDimensionOfUnit: function(aUnit)
  {
    return (this.isDimension() && this.unit == aUnit);
  },

  isLength: function()
  {
    return (this.isPercentage() ||
            this.isDimensionOfUnit("em") ||
            this.isDimensionOfUnit("ex") ||
            this.isDimensionOfUnit("ch") ||

            this.isDimensionOfUnit("px") ||

            this.isDimensionOfUnit("vh") ||
            this.isDimensionOfUnit("vw") ||
            this.isDimensionOfUnit("vmin") ||
            this.isDimensionOfUnit("vmax") ||

            this.isDimensionOfUnit("rem") ||

            this.isDimensionOfUnit("cm") ||
            this.isDimensionOfUnit("mm") ||
            this.isDimensionOfUnit("in") ||
            this.isDimensionOfUnit("pc") ||
            this.isDimensionOfUnit("pt"));
  },

  isAngle: function()
  {
    return (this.isDimensionOfUnit("deg") ||
            this.isDimensionOfUnit("rad") ||
            this.isDimensionOfUnit("grad"));
  }
}

function CSSScanner(aString)
{
  this.init(aString);
}

CSSScanner.prototype = {

  kLexTable: [
  //                                     TAB LF      FF  CR
     0,  0,  0,  0,  0,  0,  0,  0,  0,  W,  W,  0,  W,  W,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  // SPC !   "   #   $   %   &   '   (   )   *   +   ,   -   .   /
     W,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  I,  0,  0,
  // 0   1   2   3   4   5   6   7   8   9   :   ;   <   =   >   ?
     XI, XI, XI, XI, XI, XI, XI, XI, XI, XI, 0,  0,  0,  0,  0,  0,
  // @   A   B   C   D   E   F   G   H   I   J   K   L   M   N   O
     0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // P   Q   R   S   T   U   V   W   X   Y   Z   [   \   ]   ^   _
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  S,  0,  0,  SI,
  // `   a   b   c   d   e   f   g   h   i   j   k   l   m   n   o
     0,  XSI,XSI,XSI,XSI,XSI,XSI,SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // p   q   r   s   t   u   v   w   x   y   z   {   |   }   ~
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, 0,  0,  0,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  //
     0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,
  //     ¡   ¢   £   ¤   ¥   ¦   §   ¨   ©   ª   «   ¬   ­   ®   ¯
     0,  SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // °   ±   ²   ³   ´   µ   ¶   ·   ¸   ¹   º   »   ¼   ½   ¾   ¿
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // À   Á   Â   Ã   Ä   Å   Æ   Ç   È   É   Ê   Ë   Ì   Í   Î   Ï
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // Ð   Ñ   Ò   Ó   Ô   Õ   Ö   ×   Ø   Ù   Ú   Û   Ü   Ý   Þ   ß
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // à   á   â   ã   ä   å   æ   ç   è   é   ê   ë   ì   í   î   ï
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI,
  // ð   ñ   ò   ó   ô   õ   ö   ÷   ø   ù   ú   û   ü   ý   þ   ÿ
     SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI, SI
  ],

  kHexValues: {
    "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8, "9": 9,
    "a": 10, "b": 11, "c": 12, "d": 13, "e": 14, "f": 15
  },

  mString : "",
  mPos : 0,
  mPreservedPos : [],

  init: function(aString) {
    this.mString = aString;
    this.mPos = 0;
    this.mPreservedPos = [];
  },

  getCurrentPos: function() {
    return this.mPos;
  },

  getAlreadyScanned: function()
  {
    return this.mString.substr(0, this.mPos);
  },

  preserveState: function() {
    this.mPreservedPos.push(this.mPos);
  },

  restoreState: function() {
    if (this.mPreservedPos.length) {
      this.mPos = this.mPreservedPos.pop();
    }
  },

  forgetState: function() {
    if (this.mPreservedPos.length) {
      this.mPreservedPos.pop();
    }
  },

  read: function() {
    if (this.mPos < this.mString.length)
      return this.mString.charAt(this.mPos++);
    return -1;
  },

  peek: function() {
    if (this.mPos < this.mString.length)
      return this.mString.charAt(this.mPos);
    return -1;
  },

  isHexDigit: function(c) {
    var code = c.charCodeAt(0);
    return (code < 256 && (this.kLexTable[code] & IS_HEX_DIGIT) != 0);
  },

  isIdentStart: function(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.kLexTable[code] & START_IDENT) != 0);
  },

  startsWithIdent: function(aFirstChar, aSecondChar) {
    if (aFirstChar == "-" && aSecondChar == "-" &&
       this.mPos+1 < this.mString.length &&
       this.isIdentStart(this.mString.charAt(this.mPos+1)))
      return true;

    return this.isIdentStart(aFirstChar) ||
           (aFirstChar == "-" && this.isIdentStart(aSecondChar));
  },

  isIdent: function(c) {
    var code = c.charCodeAt(0);
    return (code >= 256 || (this.kLexTable[code] & IS_IDENT) != 0);
  },

  pushback: function() {
    this.mPos--;
  },

  nextHexValue: function() {
    var c = this.read();
    if (c == -1 || !this.isHexDigit(c))
      return new jscsspToken(jscsspToken.NULL_TYPE, null);
    var s = c;
    c = this.read();
    while (c != -1 && this.isHexDigit(c)) {
      s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return new jscsspToken(jscsspToken.HEX_TYPE, s);
  },

  gatherEscape: function() {
    var c = this.peek();
    if (c == -1)
      return "";
    if (this.isHexDigit(c)) {
      var code = 0;
      for (var i = 0; i < 6; i++) {
        c = this.read();
        if (this.isHexDigit(c))
          code = code * 16 + this.kHexValues[c.toLowerCase()];
        else if (!this.isHexDigit(c) && !this.isWhiteSpace(c)) {
          this.pushback();
          break;
        }
        else
          break;
      }
      if (i == 6) {
        c = this.peek();
        if (this.isWhiteSpace(c))
          this.read();
      }
      return String.fromCharCode(code);
    }
    c = this.read();
    if (c != "\n")
      return c;
    return "";
  },

  gatherIdent: function(c) {
    var s = "";
    if (c == CSS_ESCAPE)
      s += this.gatherEscape();
    else
      s += c;
    c = this.read();
    while (c != -1
           && (this.isIdent(c) || c == CSS_ESCAPE)) {
      if (c == CSS_ESCAPE)
        s += this.gatherEscape();
      else
        s += c;
      c = this.read();
    }
    if (c != -1)
      this.pushback();
    return s;
  },

  parseIdent: function(c) {
    var value = this.gatherIdent(c);
    var nextChar = this.peek();
    if (nextChar == "(") {
      value += this.read();
      return new jscsspToken(jscsspToken.FUNCTION_TYPE, value);
    }
    return new jscsspToken(jscsspToken.IDENT_TYPE, value);
  },

  isDigit: function(c) {
    return (c >= '0') && (c <= '9');
  },

  parseComment: function(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      s += c;
      if (c == "*") {
        c = this.read();
        if (c == -1)
          break;
        if (c == "/") {
          s += c;
          break;
        }
        this.pushback();
      }
    }
    return new jscsspToken(jscsspToken.COMMENT_TYPE, s);
  },

  parseNumber: function(c) {
    var s = c;
    var foundDot = false;
    while ((c = this.read()) != -1) {
      if (c == ".") {
        if (foundDot)
          break;
        else {
          s += c;
          foundDot = true;
        }
      } else if (this.isDigit(c))
        s += c;
      else
        break;
    }

    if (c != -1 && this.startsWithIdent(c, this.peek())) { // DIMENSION
      var unit = this.gatherIdent(c);
      s += unit;
      return new jscsspToken(jscsspToken.DIMENSION_TYPE, s, unit);
    }
    else if (c == "%") {
      s += "%";
      return new jscsspToken(jscsspToken.PERCENTAGE_TYPE, s);
    }
    else if (c != -1)
      this.pushback();
    return new jscsspToken(jscsspToken.NUMBER_TYPE, s);
  },

  parseString: function(aStop) {
    var s = "";
    var previousChar = aStop;
    var c;
    while ((c = this.read()) != -1) {
      if (c == aStop && previousChar != CSS_ESCAPE) {
        break;
      }
      else if (c == CSS_ESCAPE) {
        c = this.peek();
        if (c == -1)
          break;
        else if (c == "\n" || c == "\r" || c == "\f") {
          d = c;
          c = this.read();
          // special for Opera that preserves \r\n...
          if (d == "\r") {
            c = this.peek();
            if (c == "\n")
              c = this.read();
          }
        }
        else {
          s += this.gatherEscape();
          c = this.peek();
        }
      }
      else if (c == "\n" || c == "\r" || c == "\f") {
        break;
      }
      else
        s += c;

      previousChar = c;
    }
    if (c != aStop)
      return new jscsspToken(jscsspToken.INCOMPLETE_STRING_TYPE, null);
    return new jscsspToken(jscsspToken.STRING_TYPE, s);
  },

  isWhiteSpace: function(c) {
    var code = c.charCodeAt(0);
    return code < 256 && (this.kLexTable[code] & IS_WHITESPACE) != 0;
  },

  eatWhiteSpace: function(c) {
    var s = c;
    while ((c = this.read()) != -1) {
      if (!this.isWhiteSpace(c))
        break;
      s += c;
    }
    if (c != -1)
      this.pushback();
    return s;
  },

  parseAtKeyword: function(c) {
    return new jscsspToken(jscsspToken.ATRULE_TYPE, this.gatherIdent(c));
  },

  nextToken: function() {
    var c = this.read();
    if (c == -1)
      return new jscsspToken(jscsspToken.NULL_TYPE, null);

    if (this.startsWithIdent(c, this.peek()))
      return this.parseIdent(c);

    if (c == '@') {
      var nextChar = this.read();
      if (nextChar != -1) {
        var followingChar = this.peek();
        this.pushback();
        if (this.startsWithIdent(nextChar, followingChar))
          return this.parseAtKeyword(c);
      }
    }

    if (c == "." || c == "+" || c == "-") {
      nextChar = this.peek();
      if (this.isDigit(nextChar))
        return this.parseNumber(c);
      else if (nextChar == "." && c != ".") {
        firstChar = this.read();
        var secondChar = this.peek();
        this.pushback();
        if (this.isDigit(secondChar))
          return this.parseNumber(c);
      }
    }
    if (this.isDigit(c)) {
      return this.parseNumber(c);
    }

    if (c == "'" || c == '"')
      return this.parseString(c);

    if (this.isWhiteSpace(c)) {
      var s = this.eatWhiteSpace(c);
      
      return new jscsspToken(jscsspToken.WHITESPACE_TYPE, s);
    }

    if (c == "|" || c == "~" || c == "^" || c == "$" || c == "*") {
      nextChar = this.read();
      if (nextChar == "=") {
        switch (c) {
          case "~" :
            return new jscsspToken(jscsspToken.INCLUDES_TYPE, "~=");
          case "|" :
            return new jscsspToken(jscsspToken.DASHMATCH_TYPE, "|=");
          case "^" :
            return new jscsspToken(jscsspToken.BEGINSMATCH_TYPE, "^=");
          case "$" :
            return new jscsspToken(jscsspToken.ENDSMATCH_TYPE, "$=");
          case "*" :
            return new jscsspToken(jscsspToken.CONTAINSMATCH_TYPE, "*=");
          default :
            break;
        }
      } else if (nextChar != -1)
        this.pushback();
    }

    if (c == "/" && this.peek() == "*")
      return this.parseComment(c);

    return new jscsspToken(jscsspToken.SYMBOL_TYPE, c);
  }
};
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
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
  this.mOtherCreators = null;
  this.mNegated = null;
}

TypeCreator.prototype = {
  mTagName: "",
  mOtherCreators: null,
  mNegated: null,

  get type() {
    return eCREATOR_TYPE;
  },

  get value() {
    return this.mTagName;
  },

  get creators() {
    return this.mOtherCreators;
  },

  set creators(val) {
    this.mOtherCreators = val;
  },

  addCreator: function() {
    if (!this.mOtherCreators)
      this.mOtherCreators = [];
    return Array.prototype.push.apply(this.mOtherCreators, arguments);
  },

  get negated() {
    return this.mNegated;
  },

  setNegations: function(val) {
    this.mNegated = val;
  },

  toString: function() {
    return this.value
           + (this.creators
             ?  this.creators
                  .map(function(e) { return e.toString(); })
                  .join("")
             : "")
           + (this.negated
             ? ":not(" + this.negated.toString() + ")"
             : "");
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
  kNESTED_NEGATION: "Cannot have :not() inside another :not().",
  kTYPE_IN_NEGATION: "Type creator not allowed inside :not().",

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
  
  parse: function(aCallerName, aIsNegation) {
    var token = this.getToken(true, true);
    if (!token.isNotNull()
        || (aIsNegation && token.isSymbol(")"))) {
      this.fireError(aCallerName, this.kUNEXPECTED_CREATOR_END)
    }

    var creator = new Creator();

    // do we start with a combinator?
    if(!aIsNegation &&
       (token.isSymbol(">") || token.isSymbol("+"))) {
      var combinator = new Combinator(token.value);
      creator.push(combinator);

      token = this.getToken(true, true);
      if (!token.isNotNull()
          || (aIsNegation && token.isSymbol(")"))) {
        // we need something after the combinator
        this.fireError(aCallerName, this.kUNEXPECTED_CREATOR_END)
      }
    }

    while (token.isNotNull()
           && (!aIsNegation || !token.isSymbol(")"))) {
      var typeCreator = null;

      if (token.isSymbol("*")) {
        typeCreator = new TypeCreator("*");
        creator.push(typeCreator);
        token = this.getToken(false, true);
      }
      else if (token.isIdent()) {
        if (aIsNegation)
          this.fireError(aCallerName, this.kTYPE_IN_NEGATION);
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
                {
                  if (aIsNegation)
                    this.fireError(aCallerName, this.kNESTED_NEGATION);
                  var negated = this.parse(aCallerName, true);
                  if (typeCreator.negated) {
                    typeCreator.negated.creators = typeCreator.negated.creators.concat(negated.list[0].creators);
                  }
                  else
                    typeCreator.setNegations(negated.list[0]);
                  token = this.getToken(false, true);
                }
                break;
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
      else if (!token.isNotNull()
               || (aIsNegation && token.isSymbol(")")))
        return creator;
      else
        this.fireError(aCallerName, this.kEXPECTED_COMBINATOR + " " + token.value)
      
    } // while (!token.isNotNull()) {

    return creator;
  }
};
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
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

