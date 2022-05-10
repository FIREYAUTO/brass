//{{ Internal Settings }}\\

const BRASS_SETTINGS = {
	AttributeName:"BRASS_BrassElementReference",
	BrassClasses:{},
	DefaultAttributeNames:{
		"id":"Id",
		"name":"Name",
		"className":"Classes",
	},
	AttributeNames:{
		"href":"HRef",
		"src":"Source",
		"value":"Value",
		"width":"Width",
		"height":"Height",
		"type":"Type",
		"placeholder":"Placeholder",
		"alt":"Alt",
		"target":"Target",
		"min":"Min",
		"max":"Max",
	},
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

class BRASS_ClassList {
	constructor(List){
		this._ClassList=List;	
	}
	get length(){
		return this._ClassList.length;	
	}
	get Value(){
		return this._ClassList.value;
	}
	Item(x){
		return this._ClassList.item(x);	
	}
	Contains(...a){
		return this._ClassList.contains(...a);	
	}
	Add(...a){
		return this._ClassList.add(...a);	
	}
	Remove(...a){
		return this._ClassList.remove(...a);	
	}
	Replace(...a){
		return this._ClassList.replace(...a);	
	}
	Supports(...a){
		return this._ClassList.supports(...a);	
	}
	Toggle(...a){
		return this._ClassList.toggle(...a);	
	}
	Entries(...a){
		return this._ClassList.entries(...a);	
	}
	Each(...a){
		return this._ClassList.forEach(...a);	
	}
	Keys(...a){
		return this._ClassList.keys(...a);	
	}
	Values(...a){
		return this._ClassList.values(...a);	
	}
	toString(){
		return this._ClassList.toString();	
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
		let This=this;
		for(let Name in BRASS_SETTINGS.DefaultAttributeNames){
			Object.defineProperty(this,BRASS_SETTINGS.DefaultAttributeNames[Name],{
				get:function(){
					return This._DomReference[Name];	
				},
				set:function(Value){
					return This._DomReference[Name]=Value;
				},
			});
		}
		for(let Name in Reference){
			if(BRASS_SETTINGS.AttributeNames.hasOwnProperty(Name)){
				Object.defineProperty(this,BRASS_SETTINGS.AttributeNames[Name],{
					get:function(){
						return This._DomReference[Name];	
					},
					set:function(Value){
						return This._DomReference[Name]=Value;
					},
				});
			}
		}
		this.Style = new window.Proxy({},{
			get:function(self,Name){
				return This._DomReference.style[`${Name.substr(0,1).toLowerCase()}${Name.substring(1,Name.length)}`];
			},
			set:function(self,Name,Value){
				return This._DomReference.style[`${Name.substr(0,1).toLowerCase()}${Name.substring(1,Name.length)}`]=Value;
			}
		});
	}
	//ClassName Property
	get ClassName(){
		return this._DomReference.tagName;	
	}
	get ClassList(){
		return new BRASS_ClassList(this._DomReference.classList);	
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
		return BRASS_GetBrassElement(this._Dom.body);	
	}
	//Head Property
	get Head(){
		return BRASS_GetBrassElement(this._Dom.head);	
	}
	//Create Functions
	CreateElement(Tag,Properties={}){
		let NewElement = this._Dom.createElement(Tag);
		let Proxy = new BrassElement(NewElement);
		for(let Name in Properties)Proxy[Name]=Properties[Name];
		return Proxy;
	}
	ElementById(Id){
		let Raw = this._Dom.getElementById(Id);
		if(!Raw)return Raw;
		return BRASS_GetBrassElement(Raw);
	}
}

//{{ Default Creatable Class }}\\

class BrassCreatableElement extends BrassElement {
	constructor(Tag,Properties){
		let Element = document.createElement(Tag);
		super(Element,Properties);
	}
}

//{{ Adding Classes }}\\

BRASS_NewClass("html",BrassDocumentElement);
