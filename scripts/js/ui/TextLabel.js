//TODO: setFont()
function TextLabel(ow, o, xpos, ypos, str, sel, col, sz, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	g.extend(
	{
		/**---protected properties---**/
		id: uid || "text_tid_" + System.texts,
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		text: str || "",
		selectable: sel || false,
		color: col || Osd.COLOR_TEXT,
		size: sz || TextLabel.SIZE_MEDIUM,
		weight: "normal",
		
		/**---public methods---**/
		getHtml: function()
		{
			var style = 'margin-left: ' + g.x + 'px; margin-top: ' + g.y + 'px; color: ' + g.color + '; position: absolute; white-space:nowrap;';
			if(!g.selectable) style += ' cursor: default; -moz-user-select: none; -webkit-user-select: none; user-select: none;';
			
			return '<div id="' + g.id + '" style="' + style + '"><div style="font-size: ' + g.size + 'px; font-family: ' + System.DEF_FONT + ';">' + g.text + '</div></div>';
		},
		
		getObject: function()
		{
			return $("#" + g.id);
		},
		
		//container, used by textbox
		getSubObject: function()
		{
			return g.getObject().children(":first");
		},
		
		getWidth: function()
		{
			return g.getSubObject().width();
		},
		
		getHeight: function()
		{
			return g.getSubObject().height();
		},
		
		updatePos: function()
		{
			g.x = parseInt(g.getObject().css("margin-left"));
			g.y = parseInt(g.getObject().css("margin-top"));
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		},
		
		setPos: function(_x, _y)
		{
			g.getObject().css(
			{
				"margin-left": _x + "px",
				"margin-top": _y + "px"
			});
		},
		
		setDepth: function(val)
		{
			g.z = val;
			g.getObject().css("z-index", g.z);
		},
		
		setColor: function(val)
		{
			g.color = val;
			g.getObject().css("color", g.color);
		},
		
		setText: function(str)
		{
			g.getSubObject().text(str);
		},
		
		addText: function(str)
		{
			g.text += str;
			g.setText(g.text);
		},
		
		setSize: function(val)
		{
			g.size = val;
			g.getObject().css("font-size", g.size + "px");
		},
		
		setWeight: function(val)
		{
			g.weight = val;
			g.getObject().css("font-weight", g.weight);
		},
		
		bold: function()
		{
			g.setWeight("bold");
		},
		
		insertTip: function(str, clr)
		{
			var html = '<span style="color:' + clr + '"> (' + str + ')</span>';
			g.getSubObject().append(html);
		},
		
		getTip: function()
		{
			return $("#" + g.id + " div span");
		},
		
		updateTip: function(str, clr)
		{
			g.getTip().text(" (" + str + ")");
			if(clr != undefined) g.getTip().css("color", clr);
		},
		
		fadeIn: function()
		{
			g.getObject().css("display", "none");
			g.getObject().fadeIn();
		},
		
		fadeOut: function(kill)
		{
			g.getObject().fadeOut(
			{
				complete: function()
				{
					if(kill) g.finalize(); //destroy object after fadeout if kill is true
				}
			});
		},
		
		show: function()
		{
			g.getObject().show();
		},
		
		hide: function()
		{
			g.getObject().hide();
		},
		
		finalize: function()
		{
			g.getObject().remove();
		}
	});
	
	g.owner.root.append(g.getHtml());
	if(!uid) System.texts++; //text label is a gadget, but we need to distinguish these objects internally anyway
	
	g.root = g.getObject();
	
	return g;
}

/**---static variables---**/
TextLabel.SIZE_SMALL	= 14;
TextLabel.SIZE_MODERATE	= 16;
TextLabel.SIZE_MEDIUM	= 18;
TextLabel.SIZE_LARGE	= 19;
TextLabel.SIZE_XL		= 22;
TextLabel.SIZE_XXL		= 26;
TextLabel.SIZE_XXXL		= 32;