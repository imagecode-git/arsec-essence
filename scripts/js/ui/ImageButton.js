function ImageButton(ow, o, xpos, ypos, width, height, source, c, uid)
{
	/**---private properties---**/
	var img = new Image(ow, o, xpos, ypos, width, height, source[0], 1.0, false, uid); //set true to see pointer on focus
	var state = Gadget.STATE_DEFAULT;
	
	/**---extends Image---**/
	img.extend(
	{
		/**---protected properties---**/
		sources: source,
		
		/**---public methods---**/
		getSource: function()
		{
			switch(state)
			{
				case(Gadget.STATE_DEFAULT):
					return img.sources[0];
					break;
					
				case(Gadget.STATE_FOCUSED):
					return img.sources[1];
					break;
					
				case(Gadget.STATE_PRESSED):
					return img.sources[2];
					break;
			}
		},
		
		updateImages: function(src, w, h)
		{
			img.sources = src;
			img.setWidth(w);
			img.setHeight(h);
			
			img.setState(state);
		},
		
		setState: function(val)
		{
			state = val;
			img.update(img.getSource());
		}
	});
	
	/**---override methods---**/
	img.override(
	{
		press: function()
		{
			if(!img.disabled)
			{
				var st = Gadget.STATE_PRESSED;
				
				if(img.enableDoubleClick) //special patch for doubleclick event
				{
					if(!img.focused)
					{
						st = Gadget.STATE_DEFAULT;
						img.release();
					}
					else st = Gadget.STATE_FOCUSED;
				}
				
				img.setState(st);
			}
		},
		
		release: function()
		{
			if(!img.disabled) img.setState(Gadget.STATE_FOCUSED);
		},
		
		focus: function()
		{
			if(!img.hld) img.setState(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			img.setState(Gadget.STATE_DEFAULT);
			img.hld = false;
		},
	});
	
	img.setCommand(c);
	img.setActor(img.getObject());
	
	return img;
}