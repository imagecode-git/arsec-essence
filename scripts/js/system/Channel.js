//TODO: maximize, minimize, screenshot/record buttons, mute button
function Channel(ow, o, mgr, xpos, ypos, width, height, cid)
{
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		manager: mgr,
		id: cid,
		x: xpos,
		y: ypos,
		w: width,
		h: height,
		cam: null,
		viewport: null,
		placeholder: null,
		
		/**---public methods---**/
		build: function()
		{
			g.placeholder = g.osd.addImage(xpos, ypos, width, height, "nosignal.jpg");
			g.placeholder.fadeIn();
		}
	});
	
	return g;
}