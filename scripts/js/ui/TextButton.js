function TextButton(ow, o, xpos, ypos, str, c, sz, uid)
{
	/**---private properties---**/
	var state = Gadget.STATE_DEFAULT;
	var tl = new TextLabel(ow, o, xpos, ypos, str, false, Osd.COLOR_TEXT, sz, uid);
	
	/**---extends TextLabel---**/
	tl.extend(
	{
		/**---protected properties---**/
		defColor: tl.color,
		
		/**---public methods---**/
		setState: function(st)
		{
			state = st;
			
			if(!tl.disabled)
			{
				switch(state)
				{
					case(Gadget.STATE_DEFAULT):
						tl.setColor(tl.defColor);
						break;
						
					case(Gadget.STATE_FOCUSED):
						tl.setColor(Osd.COLOR_SELECTED);
						break;
						
					case(Gadget.STATE_PRESSED):
						tl.setColor(Osd.COLOR_DEFAULT);
						break;
				}
			}
			else
			{
				if(state == Gadget.STATE_DISABLED) tl.setColor(Osd.COLOR_DISABLED);
			}
		},
		
		setDefColor: function(val)
		{
			tl.defColor = val;
			if(state == Gadget.STATE_DEFAULT) tl.setState(state);
		},
		
		labelMode: function(val)
		{
			tl.setState(Gadget.STATE_DEFAULT);
			tl.disabled = val;
		}
	});
	
	/**---override methods---**/
	tl.override(
	{
		press: function()
		{
			tl.setState(Gadget.STATE_PRESSED);
		},
		
		release: function()
		{
			tl.setState(Gadget.STATE_FOCUSED);
		},
	
		focus: function()
		{
			if(!tl.hld) tl.setState(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			tl.setState(Gadget.STATE_DEFAULT);
			tl.hld = false;
		},
		
		disable: function()
		{
			tl.disabled = true;
			tl.setState(Gadget.STATE_DISABLED);
		},
		
		enable: function()
		{
			tl.disabled = false;
			tl.setState(Gadget.STATE_DEFAULT);
		}
	});
	
	tl.setCommand(c);
	tl.setActor(tl.getObject());
	
	return tl;
}