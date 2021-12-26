//toDo: canvas to control every pixel of image
function Image(ow, o, xpos, ypos, width, height, source, opacity, c, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		id: uid || "image_iid_" + System.images,
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		w: width,
		h: height,
		alpha: typeof opacity !== 'undefined' ? opacity : 1.0, //this parameter may come with zero value, so we apply special check for it
		src: Image.IMG_PATH + source,
		clickable: c || false,
		
		/**---public methods---**/
		getHtml: function()
		{
			var style = 'margin-left: ' + g.x + 'px; margin-top: ' + g.y + 'px; width: ' + g.w + 'px; height: ' + g.h + 'px; opacity: ' + g.alpha + '; position: absolute; -moz-user-select: none; -webkit-user-select: none; user-select: none;';
			if(g.clickable) style += ' cursor: pointer;';
			else style += ' cursor: default;';
			
			return '<div id="' + g.id + '" style="' + style + '"><img src="' + g.src + '" width=' + g.w + ' height=' + g.h + ' style="position: inherit;"></img></div>';
		},
		
		getObject: function()
		{
			return $("#" + g.id);
		},
		
		getImage: function()
		{
			return $("#" + g.id + " img");
		},
		
		getSource: function()
		{
			return g.src;
		},
		
		getWidth: function()
		{
			return g.w;
		},
		
		setWidth: function(val)
		{
			g.getObject().css("width", val);
			g.getImage().attr("width", val);
		},
		
		getHeight: function()
		{
			return g.h;
		},
		
		setHeight: function(val)
		{
			g.getObject().css("height", val);
			g.getImage().attr("height", val);
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		},
		
		setPos: function(_x, _y)
		{
			g.x = _x;
			g.y = _y;
			
			g.getObject().css(
			{
				"margin-left": g.x + "px",
				"margin-top": g.y + "px"
			});
		},
		
		setDepth: function(val)
		{
			g.z = val;
			g.getObject().css("z-index", g.z);
		},
		
		setAlpha: function(val)
		{
			g.alpha = val;
			g.getObject().css("opacity", val);
		},
		
		show: function()
		{
			g.getObject().show();
		},
		
		hide: function()
		{
			g.getObject().hide();
		},
		
		fadeIn: function(val)
		{
			g.getObject().css("display", "none");
			g.getObject().fadeIn(900);
		},
		
		fadeOut: function()
		{
			g.getObject().fadeOut(350, g.hide);
		},
		
		update: function(_src, _w, _h)
		{
			g.src = Image.IMG_PATH + _src;
			g.getImage().attr("src", g.src);
			g.setWidth(_w);
			g.setHeight(_h);
		},
		
		relative: function(val)
		{
			if(val) val = "relative";
			else val = "absolute";
			
			g.getObject("position", val);
		},
		
		//fixing jagged edges when using transform
		smooth: function()
		{
			g.getObject().css("outline", "1px solid transparent");
		},
		
		finalize: function()
		{
			g.getObject().find("*").off(); //kill listeners
			g.getObject().remove(); //annihilate everything
		}
	});
	
	g.owner.root.append(g.getHtml());
	if(!uid) System.images++; //image is a gadget, but we need to distinguish these objects internally anyway
	
	//preventing unwanted native browser drag
	g.getObject().on("dragstart", function()
	{
		return false;
	});
	
	g.root = g.getObject();
	
	return g;
}

Image.IMG_PATH = "images/";