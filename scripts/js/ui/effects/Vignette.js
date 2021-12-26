function Vignette(ow, f, xpos, ypos, width, height)
{
	/**---private properties---**/
	var x = xpos || 0;
	var y = ypos || 0;
	var w = typeof xpos !== 'undefined' ? width : System.SCREEN_X;
	var h = typeof ypos !== 'undefined' ? height : System.SCREEN_Y;
	
	var rect = new Rectangle(null, x, y, w, h, "radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0.8) 100%) no-repeat center center fixed;");
	
	rect.extend(
	{
		/**---protected properties---**/
		owner: ow,
		fade: f || 0, //fade-in time in milliseconds
		
		/**---public methods---**/
		finalize: function()
		{
			rect.fadeOut(f, function()
			{
				rect.finalize();
			});
		}
	});
	
	rect.owner.root.append(rect.getHtml());
	
	if(f > 0)
	{
		rect.hide();
		rect.fadeIn(f);
	}
	
	return rect;
}