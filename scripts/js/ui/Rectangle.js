function Rectangle(uid, xpos, ypos, width, height, col, opacity, brd, brdColor, brdRadius)
{
	var clazz = new Class(
	{
		/**---protected properties---**/
		id: uid || "shape_sid_" + System.shapes,
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		w: width,
		h: height,
		color: col,
		
		//optional parameters, take default values if not defined
		alpha: typeof opacity !== 'undefined' ? opacity : 1.0, //this parameter may come with zero value, so we apply special check for it
		border: brd || 0,
		borderColor: brdColor || "#fff",
		borderRadius: brdRadius || 0,
		
		/**---public methods---**/
		getObject: function()
		{
			return $("#" + clazz.id);
		},
		
		hide: function()
		{
			clazz.getObject().hide();
		},
		
		show: function()
		{
			clazz.getObject().css("display", "none");
			clazz.getObject().show();
		},
		
		fadeIn: function()
		{
			clazz.getObject().css("display", "none");
			clazz.getObject().fadeIn(350);
		},
		
		fadeOut: function()
		{
			clazz.getObject().fadeOut(500, clazz.hide);
		},
		
		updatePos: function()
		{
			clazz.x = parseInt(clazz.getObject().css("margin-left"));
			clazz.y = parseInt(clazz.getObject().css("margin-top"));
		},
		
		//returns virtual position
		getPos: function()
		{
			return [clazz.x, clazz.y];
		},
		
		//always use this instead of direct movement with css!
		setPos: function(_x, _y)
		{
			clazz.x = _x;
			clazz.y = _y;
			clazz.getObject().css(
			{
				"margin-left": _x + "px",
				"margin-top": _y + "px"
			});
		},
		
		setDepth: function(val)
		{
			clazz.z = val;
			clazz.getObject().css("z-index", clazz.z);
		},
		
		setColor: function(val)
		{
			clazz.color = val;
			clazz.getObject().css("background", clazz.color);
		},
		
		setBorderColor: function(val)
		{
			clazz.borderColor = val;
			clazz.getObject().css("border-color", clazz.borderColor);
		},
		
		setAlpha: function(val)
		{
			clazz.alpha = val;
			clazz.getObject().css("opacity", clazz.alpha);
		},
		
		getWidth: function()
		{
			return clazz.w;
		},
		
		setWidth: function(val)
		{
			clazz.w = val;
			clazz.getObject().css("width", clazz.w);
		},
		
		getHeight: function()
		{
			return clazz.h;
		},
		
		setHeight: function(val)
		{
			clazz.h = val;
			clazz.getObject().css("height", clazz.h);
		},
		
		clip: function(val)
		{
			if(val) val = "hidden";
			else val = "visible";
			
			clazz.getObject().css("overflow", val);
		},
		
		relative: function()
		{
			clazz.getObject().css("position", "relative");
		},
		
		absolute: function()
		{
			clazz.getObject().css("position", "absolute");
		},
		
		//fixing jagged edges when using transform
		smooth: function()
		{
			clazz.getObject().css("outline", "1px solid transparent");
		},
		
		getHtml: function()
		{
			return '<div id="' + clazz.id + '" style="width: ' + clazz.w + 'px; height: ' + clazz.h + 'px; margin-left: ' + clazz.x + 'px; margin-top: ' + clazz.y + 'px; background: ' + clazz.color + '; opacity: ' + clazz.alpha + '; border: ' + clazz.border + 'px solid ' + clazz.borderColor + '; border-radius: ' + clazz.borderRadius + 'px; z-index: ' + clazz.z + '; position: absolute; -moz-user-select: none; -webkit-user-select: none; user-select: none;"></div>'
		},
		
		fadeIn: function(t)
		{
			clazz.getObject().fadeIn(t);
		},
		
		fadeOut: function(t)
		{
			clazz.getObject().fadeOut(t);
		},
		
		finalize: function()
		{
			clazz.getObject().remove();
		}
	});
	
	if(!uid) System.shapes++;
	
	clazz.root = clazz.getObject();
	
	return clazz;
}