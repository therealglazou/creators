# Create and modify elements from Selectors
This is just an experiment, I want to see how far I can push Selectors on such a path. Use it if you like it, send pull requests if you want to extend/fix it. Provided as is under MPL2. **Work in progress**

See [Selectors Level 4](https://drafts.csswg.org/selectors-4/) for more information on Selectors.

Nota bene: no regexp inside. Scanner and parser rulez.

## Usage
Just include `creators-min.js` into your html document.

## document.createDocumentFragmentFromSelector(selector)
Takes a string containing a [complex selector](https://drafts.csswg.org/selectors-4/#structure) as argument. Returns a [`DocumentFragment`](https://dom.spec.whatwg.org/#interface-documentfragment).
Selectors allowed:

  * type element selector (creates an element of the given type)
  * id selector (adds the given ID)
  * class selector (adds the given class to the classList of the element)
  * attribute presence selector (adds the given attribute to the element with value being its name)
  * attribute value selector (adds the given attribute to the element with the given value)
  * [att^=val] attribute selector (prepends the given value to the given attribute's value on the element)
  * [att$=val] attribute selector (appends the given value to the given attribute's value on the element)
  * [["text"]] selector (sets the `textContent` of the element to the given text)
  * [[^"text"]] selector (prepends the given text to the `textContent` of the element)
  * [[$"text"]] selector (appends the given text to the `textContent` of the element)

Combinators allowed: > and + only.

## document.modifyElementFromSelector(element, selector)
Takes an Element and a string containing a [compound selector](https://drafts.csswg.org/selectors-4/#structure) as argument. Returns an Element.
Selectors allowed:

  * universal selector (no change to the type element of the element)
  * type element selector (replaces the element in a document's tree by a new element holding the attributes and inner contents of the original element)
  * id selector (changes the ID of the element to the given value)
  * class selector (adds the given class to the classList of the element)
  * [att^=val] attribute selector (prepends the given value to the given attribute's value on the element)
  * [att$=val] attribute selector (appends the given value to the given attribute's value on the element)
  * [["text"]] selector (sets the `textContent` of the element to the given text)
  * [[^"text"]] selector (prepends the given text to the `textContent` of the element)
  * [[$"text"]] selector (appends the given text to the `textContent` of the element)
  * :not(`<compound_selector`>) functional pseudo-class, can hold one or multiple simple selectors. Multiple negations are possible. Nested negations are not allowed. Selectors allowed inside a negation:
    * id selector (if the element has the given id, clear it)
    * class selector (if the element has the given class, remove it)
    * attribute presence selector (if the element has the given attribute, remove it)

Combinators allowed: none (yet).

Not yet implemented:
  * :empty pseudo-class (clears all children of the element)
  * :nth-child(n) (moves the element to nth element child position of its parent)
  * :nth-last-child (moves the element to nth last element child position of its parent)
  * :first-child (similar to :nth-child(1))
  * :last-child (similar to :nth-last-child(1))
  * :only-child (removes all other element children from the parent element)
  * :nth-of-type(n) (moves the element to the nth type position in its parent)
  * :nth-last-of-type(n) (moves the element to the nth last type position in its parent)
  * :first-of-type (similar to :nth-of-type(1))
  * :last-of-type (similar to :nth-last-of-type(1))
  * :only-of-type (removes all other elements of same type from its parent's children)

## Examples

Create a full-width 1x2 table of class `modern` and append it to the current document's body:

    var selector = "table[border='1'].modern[style='width: 100%'] > tbody > tr > td[['a']] + td[['b']]";
    var table = document.createDocumentFragmentFromSelector(selector);
    document.body.appendChild(table);

transform the `td` elements in that table into `th` preserving all attributes and contents

    table.querySelectorAll("td")
         .forEach(function(e) {
             document.modifyElementFromSelector(e, "th");
           });

Move the 5th row of a table to the 2nd row position (not yet implemented):

    document.modifyElementFromSelector(
      table.querySelector( "tr:nth-of-type(5)" ),
      ":nth-of-type(2)"
    );
