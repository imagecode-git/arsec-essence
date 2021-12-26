function Osd(h)
{
	/**---private properties---**/
	var clazz = new Class(
	{
		/**---protected properties---**/
		handler: h,
		
		/**---public methods---**/
		handleEvent: function(e)
		{
			if(clazz.handler && e.cmd != Osd.CMD_INVALID && e.cmd != undefined) clazz.handler.osdCommand(e.cmd); //correspodning message back to handler with a given event ID
		},
		
		//special note: in child objects their OSD may still have old object as handler
		setHandler: function(hnd)
		{
			clazz.handler = hnd;
		},
		
		addLabel: function(x, y, str, sel, col, sz, id)
		{
			var tl = new TextLabel(clazz.handler, clazz, x, y, str, sel, col, sz, id);
			return tl;
		},
		
		addTextBox: function(x, y, width, height, align, str, sel, col, id)
		{
			var tb = new TextBox(clazz.handler, clazz, x, y, width, height, align, str, sel, col, id);
			return tb;
		},
		
		addImage: function(x, y, w, h, src, alpha, id)
		{
			var img = new Image(clazz.handler, clazz, x, y, w, h, src, alpha, false, id);
			return img;
		},
		
		addImageButton: function(x, y, w, h, src, cmd, id)
		{
			var ib = new ImageButton(clazz.handler, clazz, x, y, w, h, src, cmd, id);
			return ib;
		},
		
		addSVG: function(x, y, size, src, glyph, color, alpha, id)
		{
			var svg = new SVG(clazz.handler, clazz, x, y, size, src, glyph, color, alpha, id);
			return svg;
		},
		
		addTextButton: function(x, y, str, cmd, sz, id)
		{
			var tb = new TextButton(clazz.handler, clazz, x, y, str, cmd, sz, id);
			return tb;
		},
		
		addTextInput: function(x, y, w, str, type, size, cmd, id)
		{
			var ti = new TextInput(clazz.handler, clazz, x, y, w, str, type, size, cmd, id);
			return ti;
		},
		
		addHotspot: function(x, y, w, h, cmd)
		{
			var hs = new Hotspot(clazz.handler, clazz, cmd, x, y, w, h);
			return hs;
		},
		
		addHotspotRectangle: function(x, y, w, h)
		{
			var hsr = new HotspotRectangle(clazz.handler, clazz, x, y, w, h);
			return hsr;
		},
		
		addCheckBox: function(x, y, cmd, label, id)
		{
			var cb = new CheckBox(clazz.handler, clazz, x, y, cmd, label, id);
			return cb;
		},
		
		addSlider: function(x, y, w, min, max, cmd, def, label, id)
		{
			var sl = new Slider(clazz.handler, clazz, x, y, w, 3, min, max, cmd, def, label, id);
			return sl;
		},
		
		addScroller: function(x, y, length, depth, style)
		{
			var sc = new Scroller(clazz.handler, clazz, x, y, length, depth, style);
			return sc;
		},
		
		addTabBar: function(x, y, texts, commands, size, padding, defsel)
		{
			var tb = new TabBar(clazz.handler, clazz, x, y, texts, commands, size, padding, defsel);
			return tb;
		},
		
		addRating: function(x, y, size, length, cmd, preset)
		{
			var rt = new Rating(clazz.handler, clazz, x, y, size, length, cmd, preset);
			return rt;
		},
		
		addVignette: function(fade, x, y, w, h)
		{
			var vg = new Vignette(clazz.handler, fade, x, y, w, h);
			return vg;
		}
	});
	
	return clazz;
}

/**---static variables---**/
Osd.CMD_INVALID	= -1;

Osd.COLOR_TRANSPARENT	= "transparent";
Osd.COLOR_DEFAULT		= "#FFFFFF";
Osd.COLOR_DISABLED		= "#696969";
Osd.COLOR_HILITE		= "#575756";
Osd.COLOR_SELECTED		= "#FFF000";
Osd.COLOR_TEXT			= "#BFC0C0";
Osd.COLOR_INVERTED		= "#333333";
Osd.COLOR_HOTSPOT		= "#33FF33";
Osd.COLOR_HOTSPOTRECT	= "#FF33FF";
Osd.COLOR_CONTAINER		= "#FF3333";
Osd.COLOR_TEXTINPUT 	= "#575756";
Osd.COLOR_WINDOW		= "#3C3C3B";
Osd.COLOR_GRIDLINE		= "#696969";
Osd.COLOR_SCROLLER_BTN	= "#6E6E6D";
Osd.COLOR_SCROLLER_BCK	= "#20201E";
Osd.COLOR_INSET			= "#000000";

Osd.COLOR_WARNING_LOW	= "#FFEE00";
Osd.COLOR_WARNING_MID	= "#00FF00";
Osd.COLOR_WARNING_HIGH	= "#FF0000";