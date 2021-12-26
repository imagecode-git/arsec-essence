//has no reaction on click yet (this event should come from system)
function HotspotRectangle(ow, o, xpos, ypos, width, height)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		debugMode: false, //makes area visible
		x: xpos,
		y: ypos,
		w: width,
		h: height,
		id: null,
		
		/**---public methods---**/
		notify: function()
		{
			var mx = System.mouseX;
			var my = System.mouseY;
			var ofs = g.globalPos();
			
			if(ofs)
			{
				if(mx >= ofs[0] && mx <= ofs[0]+g.w && my >= ofs[1] && my <= ofs[1]+g.h) g.focus();
				else g.unfocus();
			}
			else g.finalize();
		},
		
		//pivot turns this static rectangle to a movable object
		getPivot: function()
		{
			return $("#" + g.id);
		},
		
		//pivot html, represents a transparent 0x0 area, absolutely invisible to user
		getHtml: function()
		{
			var style = "margin-left: " + g.x + "px; margin-top: " + g.y + "px; position: absolute; opacity: " + System.DEF_ALPHA + ";";
			if(g.debugMode) style += " width: " + g.w + "px; height: " + g.h + "px; background: " + Osd.COLOR_HOTSPOTRECT + ";";
			else style += " width: 0px; height: 0px; background: transparent;"
			
			return '<div id="' + g.id + '" style="' + style + '"></div>';
		},
		
		globalPos: function()
		{
			var ofs = g.getPivot().offset();
			
			if(ofs) return [ofs.left, ofs.top];
			else
			{
				g.finalize();
				return null;
			}
		},
		
		finalize: function()
		{
			System.remRect(g);
		}
	});
	
	/**---override methods---**/
	g.override(
	{
		focus: function()
		{
			if(!g.focused)
			{
				g.focused = true;
				if(g.link) g.link(g.focused);
			}
		},
		
		unfocus: function()
		{
			if(g.focused)
			{
				g.focused = false;
				if(g.link) g.link(g.focused);
			}
		}
	}, true);
	
	g.id = "hotspot_rect_gid_" + System.addRect(g);
	
	g.owner.root.append(g.getHtml());
	
	return g;
}