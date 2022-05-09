# Brass
Brass is a web-development library which is built on the DOM to provide an easier workflow for developers; Brass is a mix of a sandbox and React.

# Using Brass
Using brass is very simple. Although, there is currently only one (maintained) way of using Brass for web development:
```html
<script src="https://fireyauto.github.io/brass/src.js"></script>
```

# Getting Started
When you have the HTML script element that links to Brass, here is some boilerplate code that will create a document brass element.
```js
const Document = new BrassDocumentElement(document);
```

Since brass is like a semi-sandbox, to access original properties inside the HTML element you are referencing, there is a property called `_DomReference` inside every Brass element which is a link to the HTML element. The HTML element also has an attribute which is hooked to the Brass element to prevent mulitple copies of the same element.

## Default Properties

```
BrassElement.Parent //A getter function which returns a brass element linked to the parentNode of the real HTML element. Can also be set
BrassElement.ClassName //The tagName of the real HTML element.
BrassElement.Children //An array containing all the child nodes in the real HTML element.
BrassElement.FirstChild //A brass element linked to the firstChild of the real HTML element.
BrassElement.LastChild //A brass element linked to the lastChild of the real HTML element.
BrassElement.NextSibling //A brass element linked to the nextSibling of the real HTML element.
BrassElement.InnerHTML //Linked to the real HTML element's innerHTML
BrassElement.InnerText //Linked to the real HTML element's innerText
BrassElement.Id //Linked the real HTML element's id
BrassElement.Classes //Linked to the real HTML element's className
BrassElement.ClassList //Linked to the real HTML element's classList
```

## Optional Properties
Each property listed below will be added to the BrassElement automatically if it finds it inside the given reference HTML element.
```
BrassElement.HRef //Linked to the real HTML element's href
BrassElement.Source //Linked to the real HTML element's src
BrassElement.Value //Linked to the real HTML element's value
BrassElement.Width //Linked to the real HTML element's width
BrassElement.Height //Linked to the real HTML element's height
BrassElement.Type //Linked to the real HTML element's type
BrassElement.Placeholder //Linked to the real HTML element's placeholder
BrassElement.Alt //Linked to the real HTML element's alt
BrassElement.Target //Linked to the real HTML element's target
```

## Methods
Each method listed below is a default method included in the `BrassElement` class.
```
BrassElement.ClearChildren() //Clears all the children in the real HTML element
BrassElement.AddChild(Element) //The same as htmlElement.appendChild, but requires a BrassElement as Element
BrassElement.RemoveChild(Element) //The same as htmlElement.removeChild, but requires a BrassElement as Element
BrassElement.Query(Match) //The same as htmlElement.querySelector, but returns a BrassElement
BrassElement.QueryAll(Match) //Returns an array of all descendants of the BrassElement that match the given Match. (htmlElement.querySelectorAll)
BrassElement.AddEvent(Type,Callback) //The same as htmlElement.addEventListener
BrassElement.RemoveEvent(Type,Callback) //The same as htmlElement.removeEventListener
BrassElement.GetAttribute(Name) //The same as htmlElement.getAttribute
BrassElement.SetAttribute(Name,Value) //The same as htmlElement.setAttribute
BrassElement.RemoveAttribute(Name) //The same as htmlElement.removeAttribute
```
***
## Document Brass Element
Everything listed below is a part of the `BrassDocumentElement` class
### Properties
```
BrassElement.Body //The body element of the document
BrassElement.Head //The head element of the document
```
### Methods
```
BrassElement.CreateElement(Tag,Properties) //Creates a new element with the given tag, and sets it's properties to ones present in the Properties object. Returns the newly created element.
BrassElement.ElementById(Id) //Returns a BrassElement with the given id.
```
***
## Using Brass's Creatable Classes
Brass has a creatable-element feature, which allows you to easily make your own classes for reusability.
Here is an example of a brass createable-element:
```
class BaseInput extends BrassCreatableElement { //This is a BaseInput class, which extends the BrassCreateableElement class
	constructor(Parent,Type,Properties={}){
    	super("input");
        for(let Name in Properties)this[Name]=Properties[Name];
        this.Type = Type;
        this.Parent = Parent;
    }
}

class TextInput extends BaseInput {
	constructor(Parent,Properties){
    	super(Parent,"text",Properties);
    }
}

class ButtonInput extends BaseInput {
	constructor(Parent,Properties){
    	super(Parent,"button",Properties);
    }
}

const Document = new BrassDocumentElement(document);
const Input = new TextInput(Document.Body,{
	Value:"Hello, world!",
    Placeholder:"Alert Message",
});

const Btn = new ButtonInput(Document.Body,{
	Value:"Alert",
});

Btn.AddEvent("mousedown",()=>{
	alert(Input.Value);
});
```
When you make an extending class off the BrassCreateableElement class, the super function requires at least one argument: `Tag`. The `Tag` argument will be used to create a new element with the given tag when you make a new class. You can add just about anything you want to your custom Brass class. If you want to make it so every HTML element that comes into contact with brass will extend your custom class, call this function:
```
BRASS_NewClass("Tag Name Here",Your_Creatable_Class);
```
Example:
```
BRASS_NewClass("input",BaseInput); //Every HTML element with a tag of "input" will use the BaseInput class
```
