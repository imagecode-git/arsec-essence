function TabButton(t, xpos, ypos, str, cmd, sz, index)
{
	/**---private properties---**/
	var c = new Container(t, t._osd, xpos, ypos, 0, 0);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		label: null,
		hotspot: null,
		state: Gadget.STATE_DEFAULT,
		selected: (index == t.defSelection) ? true : false,
		idx: index,
		
		/**---public methods---**/
		getLabelText: function()
		{
			return c.label.text;
		},
		
		select: function(val)
		{
			c.selected = val;
			c.setState(c.state); //self-update
		},
		
		setState: function(st)
		{
			var col;
			c.state = st;
			
			switch(c.state)
			{
				case(Gadget.STATE_DEFAULT):
					if(!c.selected) col = Osd.COLOR_TEXT;
					else col = Osd.COLOR_SELECTED;
					break;
					
				case(Gadget.STATE_FOCUSED):
					if(!c.hld) col = Osd.COLOR_SELECTED;
					break;
					
				case(Gadget.STATE_PRESSED):
					col = Osd.COLOR_DEFAULT;
					break;
			}
			
			c.label.setColor(col);
		}
	});
	
	c.label = c._osd.addLabel(0, 0, str, false, Osd.COLOR_TEXT, sz);
	
	c.setWidth(c.label.getWidth());
	c.setHeight(c.label.getHeight());
	
	c.hotspot = c._osd.addHotspot(0, 0, c.w, c.h);
	c.hotspot.attach(c);
	
	c.setState(c.state);
	
	c.extend(
	{
		focus: function()
		{
			c.setState(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			c.setState(Gadget.STATE_DEFAULT);
		},
		
		press: function()
		{
			c.setState(Gadget.STATE_PRESSED);
			t.select(c.idx);
		},
		
		release: function()
		{
			if(c.focused) c.setState(Gadget.STATE_DEFAULT);
			else c.setState(Gadget.STATE_FOCUSED);
		}
	});
	
	return c;
}