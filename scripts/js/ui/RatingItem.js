function RatingItem(r, xpos, ypos, sz, s, i)
{
	/**---private properties---**/
	var g = new Gadget(r.owner, r.osd);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		rating: r,
		x: xpos,
		y: ypos,
		size: sz,
		set: s,
		idx: i,
		checked: false,
		button: null,
		_osd: null,
		
		/**---public methods---**/
		check: function(val)
		{
			g.checked = val;
			
			var num = val ? 1 : 0;
			g.button.updateImages(g.set[num], g.size, g.size);
		},
		
		osdCommand: function(idx)
		{
			r.updateRate();
			r.press(); //sending command to osd
		}
	});
	
	g.root = r.getObject();
	g._osd = new Osd(g);
	
	g.button = g._osd.addImageButton(g.x, g.y, g.size, g.size, g.set[0], g.idx);
	g.button.override(
	{
		focus: function()
		{
			r.storeRate(g.getCommand());
		}
	});
	
	g.setCommand(g.idx);
	
	return g;
}

/**---static variables---**/
RatingItem.PRESET_DEFAULT = [["rating_unchecked_normal.png", "rating_unchecked_hover.png", "rating_unchecked_press.png"], ["rating_checked_normal.png", "rating_checked_hover.png", "rating_checked_press.png"]];