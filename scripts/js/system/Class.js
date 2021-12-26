//root object, describes general behaviour for all child classes
function Class(spec)
{
	//completely copy properties from another class
	spec.clone = function(obj)
	{
		if(null == obj || "object" != typeof obj) return obj;
		
		var copy = obj.constructor();
		for(var attr in obj)
		{
			if(obj.hasOwnProperty(attr)) copy[attr] = spec.extend(obj[attr]);
		}
		
		return copy;
	};
	
	//overrides method from superclass and extends with given properties
	spec.override = function(obj, rw)
	{
		Object.keys(obj).forEach(function(item)
		{
			var ___super = spec.clone(spec[item]);
			var ___override = obj[item];
		
			spec[item] = function()
			{
				if(!rw) ___super(); //'rw' prevents executing the original method, emulating full override
				___override();
			}
		});
	};
	
	//extend properties of _this_ class
	spec.extend = function(obj)
	{
		Object.keys(obj).forEach(function(item)
		{
			spec[item] = obj[item];
		});
	};

	//this operation ensures inheritance
	function F() {};
	F.prototype = spec;
	
	return new F();
}