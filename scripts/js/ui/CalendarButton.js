function CalendarButton(ow, o, xpos, ypos, index)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, CalendarButton.WIDTH, CalendarButton.HEIGHT);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		fontSize: TextLabel.SIZE_LARGE,
		label: null,
		labelText: index,
		calendar: ow,
		type: CalendarButton.TYPE_PRESENT,
		hotspot: null,
		selected: false,
		state: Gadget.STATE_DEFAULT,
		idx: index,
		
		/**---public methods---**/
		setDay: function(val)
		{
			c.labelText = val;
			c.label.setText(c.labelText);
			
			c.label.setPos((c.w-c.label.getWidth())/2, (c.h-c.label.getHeight())/2); //auto-align to center pos
		},
		
		getDay: function()
		{
			return parseInt(c.labelText);
		},
		
		setType: function(val)
		{
			c.type = val;
			c.setState(c.state);
		},
		
		setState: function(st)
		{
			c.state = st;
			
			switch(c.state)
			{
				case(Gadget.STATE_DEFAULT):
					if(!c.selected)
					{
						switch(c.type)
						{
							case(CalendarButton.TYPE_PAST):
								c.label.setColor(Osd.COLOR_DISABLED);
								break;
								
							case(CalendarButton.TYPE_PRESENT):
								c.label.setColor(Osd.COLOR_TEXT);
								break;
								
							case(CalendarButton.TYPE_FUTURE):
								c.label.setColor(Osd.COLOR_DISABLED);
								break;
						}
						c.setBackground(Osd.COLOR_TRANSPARENT);
					}
					else
					{
						c.setBackground(Osd.COLOR_SELECTED);
						c.label.setColor(Osd.COLOR_INVERTED);
					}
					break;
					
				case(Gadget.STATE_FOCUSED):
					c.setBackground(Osd.COLOR_HILITE);
					if(c.type != CalendarButton.TYPE_PRESENT) c.label.setColor(Osd.COLOR_SELECTED);
					break;
					
				case(Gadget.STATE_PRESSED):
					break;
			}
		},
		
		select: function(val)
		{
			c.selected = val;
			c.setState(Gadget.STATE_DEFAULT);
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(CalendarButton.CMD_SELECT):
					break;
			}
		}
	});
	
	c.override(
	{
		focus: function()
		{
			if(!c.selected) c.setState(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			if(!c.selected) c.setState(Gadget.STATE_DEFAULT);
		}
	});
	
	c.label = c._osd.addLabel(0, 0, null, false, Osd.COLOR_TEXT, c.fontSize);
	
	c.hotspot = c._osd.addHotspot(0, 0, c.w, c.h);
	c.hotspot.attach(c);
	
	c.setCommand(Calendar.CMD_DATE_PICK + c.idx);
	
	return c;
}

/**---static variables---**/
CalendarButton.CMD_SELECT	= 400;

CalendarButton.WIDTH	= 45;
CalendarButton.HEIGHT	= 33;

CalendarButton.TYPE_PAST	= 0;
CalendarButton.TYPE_PRESENT	= 1;
CalendarButton.TYPE_FUTURE	= 2;