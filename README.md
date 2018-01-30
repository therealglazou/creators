# Create and modify elements from Selectors
This is just an experiment, I want to see how far I can push Selectors on such a path. **Work in progress**

## document.createDocumentFragmentFromSelector(selector)
Takes a string containing a complex selector as argument. Returns a `DocumentFragment`.
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
Takes an Element and a string containing a compound selector as argument. Returns an Element.
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
  
