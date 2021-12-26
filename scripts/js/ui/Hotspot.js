function Hotspot(ow, o, command, xpos, ypos, width, height)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		debugMode: false, //makes area visible
		area: null,
		cmd: typeof command !== 'undefined' ? command : Osd.CMD_INVALID, //this parameter may come with zero value, so we apply special check for it
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		w: width,
		h: height,
		alpha: 0.0,
		
		/**---public methods---**/
		hide: function()
		{
			g.disabled = true;
			g.area.hide();
		},
		
		show: function()
		{
			g.disabled = false;
			g.area.show();
		},
		
		getAlpha: function()
		{
			if(g.debugMode) return 0.5;
			else return 0.0;
		},
		
		setAlpha: function(val)
		{
			g.alpha = val;
			g.area.setAlpha(g.alpha);
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		},
		
		setPos: function(_x, _y)
		{
			g.x = _x;
			g.y = _y;
			g.area.setPos(g.x, g.y);
		},
		
		setDepth: function(val)
		{
			g.z = val;
			g.area.setDepth(val);
		},
		
		setWidth: function(val)
		{
			g.w = val;
			g.area.setWidth(g.w);
		},
		
		setHeight: function(val)
		{
			g.h = val;
			g.area.setHeight(g.h);
		},
		
		attach: function(obj)
		{
			g.con = obj;
		},
		
		finalize: function()
		{
			g.area.finalize();
		}
	});
	
	g.area = new Rectangle("hotspot_gid_" + System.gadgets, g.x, g.y, g.w, g.h, Osd.COLOR_HOTSPOT, g.getAlpha());
	g.owner.root.append(g.area.getHtml());
	
	g.setCommand(g.cmd);
	g.setActor(g.area.getObject());
	
	g.setDepth(g.z);
	
	return g;
}