(function(w) { //immediately executing
	
	//parses the element string (within the key) and returns an element.
    var parseElementString = function (name) {
        var el, id, tag, classes;

		//tag
        tag = name.match(/^(\w+)(?:#|.|$)/);
        tag = tag ? tag[1] : 'div';

		//init el
		el = document.createElement(tag);
		
		//id
        id = name.match(/#[\w][\w-]*/);
		if (id) {
            id = id[0].replace(/#/, '');
			el.setAttribute('id', id);
        }

		//classes
        classes = name.match(/\.[\w][\w-]*/g);
        if (classes) {
            classes = classes.join(' ').replace(/\./g, '');
			el.className = classes;
        }
        return el;
    };

	w = w ? w : this; // attach either to external context or a specified context (argument of this immediately executing function)
    w.json2html = function (elObj) {
        var i,
			key,
			val,
            el,
            elString,
            child,
            obj,
            commonTags,
			isATag,
			args = arguments;
			
		if(elObj && typeof elObj === 'object' && 'outerHTML' in elObj) {
			return elObj;
		}

		//grab the key of this object
		for(i in elObj) {
			key = i;
			break;
		}
		
		//create initial element
		el = parseElementString(key);
		
		//grab the val of this object
		val = elObj[key];
		
		if(val && typeof val === 'object' &&'outerHTML' in val) { //cursory check for element-ness.
			el.appendChild(val);
			return el;
		}

		//if this is an array, definitely interpret members of that array as children. Apply json2html to each child, then append.
        if (typeof val === 'object' && 'length' in val) {
            for (i in val) {
                var c = arguments.callee(val[i]);
                el.appendChild(c);
            }
            return el;
        }



		//for parsing name
        commonTags = [
			'a', 
			'b', 
			'body', 
			'br', 
			'div', 
			'em', 
			'font', 
			'head', 
			'h', 
			'p', 
			'span', 
			'button',
			'h1',
			'h2',
			'h3',
			'h4'
		];
		
		isATag = function(text) {
			//non-ie
			if(typeof commonTags.indexOf === 'function') {
				return commonTags.indexOf(text) > -1;
			}
			
			//ie
			for(var i in commonTags) {
				if(text === commonTags[i]) {
					return true;
				}
			}
			return false;
		};
		
		var plugins = [];
		var checkIfIsChildren = function(k,v) {
			if(k==='children' || k==='childNodes') {
				for(var i in v) {
					el.appendChild(args.callee(v[i]));
				}
				return true;
			}
		}
		plugins.push(checkIfIsChildren);
		
        //if the value of this element is a simple string, let's assume that to be the text
        if (typeof val === 'string') {
            el.appendChild(document.createTextNode(val));
        } else {
	
            //otherwise cycle through the elements
			joe:
            for (elString in val) {
				if(val.hasOwnProperty(elString)) {
					for(var i in plugins) {
						if(plugins[i](elString,val[elString])) {
							break joe;
						}
					}
	
					child = val[elString];
					
	                if (typeof child === 'string' // could serve as an attribute
						&& elString.indexOf('.') < 0 // doesnt look like a classname
						
						&& (	elString.indexOf('#') < 0 
								||elString.length === 1
							) // doesnt look like an id name
							
						&& !isATag(elString.toLowerCase()) //doesnt appear in the common tag list
						
					) { //treat as an attribute
	                    
	                    if (elString === 'html') { //"html" here serves as text; "text" might be a useful attribute
	                        el.appendChild(document.createTextNode(child));
	                    } else {
	                        el.setAttribute(elString, child);
	                    }
	                } 
	
					//we think it's a child element
					else {
	                    obj = {};
						obj[elString] = child;
	                    child = arguments.callee(obj);
						el.appendChild(child);
	                }
				}
            }
        }
        return el;
    };
})(this);
