function TextBox(ow, o, xpos, ypos, width, height, aln, str, sel, col, uid)
{
	/**---private properties---**/
	var tl = new TextLabel(ow, o, xpos, ypos, str, sel, col, uid);
	
	tl.extend(
	{
		/**---protected properties---**/
		w: width,
		h: height,
		align: aln || TextBox.ALIGN_LEFT,
		scrollValue: 0.0,
		
		/**---public methods---**/
		setWidth: function(val)
		{
			tl.w = val;
			tl.getObject().css("width", tl.w);
		},
		
		setHeight: function(val)
		{
			tl.h = val;
			tl.getObject().css("height", tl.h);
		},
		
		setAlign: function(val)
		{
			tl.align = val;
			tl.getObject().css("text-align", tl.align);
		},
		
		//scrolls to len% of entire textbox height
		scrollTo: function(len)
		{
			var val = "-=";
			var maxscroll = tl.getSubObject().height()-tl.h;
			var dlt = 0.0;
			
			if(tl.scrollValue != len)
			{
				dlt = len-tl.scrollValue;
				tl.scrollValue += dlt;
				val += dlt*maxscroll;

				tl.getSubObject().animate(
				{
					marginTop: val
				}, TextBox.SCROLL_SPEED);
			}
		}
	});
	
	tl.setWidth(tl.w);
	tl.setHeight(tl.h);
	tl.setAlign(tl.align);
	
	tl.getObject().css("overflow", "hidden");
	
	return tl;
}

/**---static variables---**/
TextBox.ALIGN_LEFT		= "left";
TextBox.ALIGN_RIGHT		= "right";
TextBox.ALIGN_CENTER	= "center";
TextBox.ALIGN_JUSTIFY	= "justify";

TextBox.SCROLL_SPEED = 500;