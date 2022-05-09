//{{ Internal Settings }}\\

const BRASS_SETTINGS = {
	AttributeName:"BRASS_BrassElementReference",
	BrassClasses:{},
};

//{{ Internal Functions }}\\

function BRASS_NewClass(Name,Class){
	BRASS_SETTINGS.BrassClasses[Name]=Class;	
}

function BRASS_GetBrassProxy(Element){
	return Element.getAttribute(BRASS_SETTINGS.AttributeName);
}

function BRASS_BrassClassByTagName(Tag){
	for(let Name in BRASS_SETTINGS.BrassClasses){
		if(Name==Tag.toLowerCase())return BRASS_SETTINGS.BrassClasses[Name];
	}
	return BrassElement;
}

function BRASS_GetBrassElement(Element){
	if(Element instanceof BrassElement)return Element;
	let BrassProxy = BRASS_GetBrassProxy(Element);
	if(BrassProxy)return BrassProxy;
	return new (BRASS_BrassClassByTagName(Element.tagName))(Element);
}

function BRASS_NodeListToBrass(List){
	let NewList = [];
	for(let i=0,k=List.length;i<k;i++){
		NewList.push(BRASS_GetBrassElement(List[i]));
	}
	return NewList;
}

class BRASS_Error extends Error {
	constructor(Text){
		super(Text).name=this.constructor.name;
	}
}

//{{ Default Element Class }}\\

class BrassElement {
	constructor(Reference,Properties={}){
		let Proxy = BRASS_GetBrassProxy(Reference);
		if(Proxy)return Proxy;
		this._DomReference = Reference;
		for(let Key in Properties){
			let Value = Properties[Key];
			Object.defineProperty(this,Key,Value);
		}
	}
	//ClassName Property
	get ClassName(){
		return this._DomReference.tagName;	
	}
	//Id Property
	get Id(){
		return this._DomReference.id;	
	}
	set Id(Value){
		return this._DomReference.id=Value;	
	}
	//Parent Property
	get Parent(){
		return BRASS_GetBrassElement(this._DomReference.parentNode);
	}
	set Parent(Value){
		if(Value===null||Value===undefined){
			this._DomReference.remove()
			return Value;	
		}
		if(!(Value instanceof BrassElement))throw BRASS_Error(`Cannot set Parent of BrassElement ${this.ClassName} to ${Value} because it's not a BrassElement`);
		let Parent = this._DomReference.parentNode;
		if(Parent)Parent.removeChild(this._DomReference);
		Value._DomReference.appendChild(this._DomReference);
		return Value;
	}
	//Children Property
	get Children(){
		return BRASS_NodeListToBrass(this._DomReference.childNodes);
	}
	get FirstChild(){
		let Child = this._DomReference.firstChild;
		if(!Child)return null;
		return BRASS_GetBrassElement(Child);	
	}
	get LastChild(){
		let Child = this._DomReference.lastChild;
		if(!Child)return null;
		return BRASS_GetBrassElement(Child);	
	}
	//Sibling Property
	get NextSibling(){
		let Next = this._DomReference.nextSibling;
		if(!Next)return null;
		return BRASS_GetBrassElement(Next);
	}
	//Child Functions
	ClearChildren(){
		while(this._DomReference.firstChild)this._DomReference.firstChild.remove();
	}
	AddChild(Element){
		if(!(Element instanceof BrassElement))throw BRASS_Error(`Cannot add child to BrassElement ${this.ClassName} because ${Element} is not a BrassElement`);
		this._DomReference.appendChild(Element._DomReference);
	}
	RemoveChild(Element){
		if(!(Element instanceof BrassElement))throw BRASS_Error(`Cannot add child to BrassElement ${this.ClassName} because ${Element} is not a BrassElement`);
		this._DomReference.removeChild(Element._DomReference);
	}
	//Query Functions
	Query(Match){
		let Element = this._DomReference.querySelector(Match);
		if(!Element)return null;
		return BRASS_GetBrassElement(Element);
	}
	QueryAll(Match){
		return BRASS_NodeListToBrass(this._DomReference.querySelectorAll(Match));		
	}
	//Event Listener Methods
	AddEvent(Type,Callback,...Extra){
		this._DomReference.addEventListener(Type,Callback,...Extra);
		return Callback;
	}
	RemoveEvent(...Arguments){
		this._DomReference.removeEventListener(...Arguments);	
	}
	//Attribute Functions
	GetAttribute(Name){
		return this._DomReference.getAttribute(Name);	
	}
	SetAttribute(Name,Value){
		this._DomReference.setAttribute(Name,Value);
		return Value;	
	}
	RemoveAttribute(Name){
		this._DomReference.removeAttribute(Name);	
	}
	//Property Setting
	get InnerHTML(){
		return this._DomReference.innerHTML;	
	}
	set InnerHTML(Value){
		return this._DomReference.innerHTML=Value;
	}
	get InnerText(){
		return this._DomReference.innerText;	
	}
	set InnerText(Value){
		return this._DomReference.innerText=Value;
	}
}

//{{ Document Element Class }}\\

class BrassDocumentElement extends BrassElement {
	constructor(Element,Properties){
		let Result = super(Element.documentElement,Properties);
		this._Dom=Element;
		if(Result!=this)return Result;
	}
	//Body Property
	get Body(){
		return BRASS_GetBrassElement(this._DomReference.body);	
	}
	//Head Property
	get Head(){
		return BRASS_GetBrassElement(this._DomReference.head);	
	}
	//Create Functions
	CreateElement(Tag){
		let NewElement = this._Dom.createElement(Tag);
		let Proxy = new BrassElement(NewElement);
		return Proxy;
	}
	ElementById(Id){
		let Raw = this._Dom.getElementById(Id);
		if(!Raw)return Raw;
		return BRASS_GetBrassElement(Raw);
	}
}

//{{ Input Element Class }}\\

class BrassInputElement extends BrassElement {
	constructor(...A){
		super(...A);
	}
	//Value Property
	get Value(){
		return this._DomReference.value;	
	}
	set Value(Value){
		return this._DomReference.value=Value;	
	}
	//Type Property
	get Type(){
		return this._DomReference.type;	
	}
	set Type(Value){
		return this._DomReference.type=Value;	
	}
}

//{{ Text-Area Element Class}}\\

class BrassTextAreaElement extends BrassElement {
	constructor(...A){
		super(...A);
	}
	//Value Property
	get Value(){
		return this._DomReference.value;	
	}
	set Value(Value){
		return this._DomReference.value=Value;	
	}
}

//{{ Adding Classes }}\\

BRASS_NewClass("html",BrassDocumentElement);
BRASS_NewClass("input",BrassInputElement);
BRASS_NewClass("textarea",BrassTextAreaElement);
