const Document = new BrassDocumentElement(document);

class BaseInput extends BrassCreatableElement {
	constructor(Type,Properties={}){
		super("input");
		this.Type=Type;
		for(let Name in Properties)this[Name]=Properties[Name];
	}
}

class TextInput extends BaseInput {
	constructor(Properties){
		super("text",Properties);
	}
}

class ButtonInput extends BaseInput {
	constructor(Properties){
		super("button",Properties);
	}
}

const Text = new TextInput({
	Parent:Document.Body,
	Placeholder:"Alert Message",
	Value:"Hello, world!",
});

(new ButtonInput({
	Parent:Document.Body,
	Value:"Alert",
})).AddEvent("mousedown",Event=>{
	alert(Text.Value);
});
