function Rating(ow, o, xpos, ypos, sz, len, command, preset)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, 0, sz);

	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		buttons: [],
		length: len,
		size: sz,
		set: preset || RatingItem.PRESET_DEFAULT,
		rate: undefined,
		tempRate: undefined,
		hsRect: null,
		activated: false,
	
		/**---public methods---**/
		getRate: function()
		{
			return c.rate+1;
		},
		
		//on focus
		storeRate: function(val)
		{
			c.tempRate = val;
			c.updateImages(c.tempRate);
		},
		
		//on unfocus
		restoreRate: function()
		{
			c.updateImages(c.rate);
			c.tempRate = undefined;
		},
		
		//on press ONLY
		updateRate: function()
		{
			c.rate = c.tempRate;
			c.tempRate = undefined;
			
			c.updateImages(c.rate);
		},
		
		updateImages: function(r)
		{
			for(var i=0; i<c.length; i++)
			{
				var val = false;
				if(i <= r) val = true;
				
				c.buttons[i].check(val);
			}
		}
	});
	
	var px = 0;
	for(var i=0; i<c.length; i++)
	{
		c.buttons.push(new RatingItem(c, px, 0, c.size, c.set, i));
		px += c.size*1.25;
	}
	
	c.hsRect = c._osd.addHotspotRectangle(0, 0, px, c.size);
	c.hsRect.setLinkage(function(foc)
	{
		if(foc)
		{
			c.activated = true;
		}
		else
		{
			if(c.activated)
			{
				c.restoreRate();
				c.activated = false;
			}
		}
	});
	
	c.setWidth(px);
	c.setCommand(command);

	return c;
}