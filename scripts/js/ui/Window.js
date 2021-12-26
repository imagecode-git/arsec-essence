//TODO: limit window movement to screen max W/H
function Window(ow, o, xpos, ypos, width, height, moveable, opacity, depth, uid)
{
	/**---private properties---**/
	var body = new Container(ow, o, xpos, ypos, width, height, null, opacity, depth, uid);
	
	/**---extends Container---**/
	body.extend(
	{
		/**---protected properties---**/
		dragHolder: null,
		holder: new Rectangle(null, 0, 0, body.w, body.h, Osd.COLOR_WINDOW, System.DEF_ALPHA),
		
		/**---public methods---**/
		center: function()
		{
			body.setPos(System.SCREEN_X/2 - body.w/2, System.SCREEN_Y/2 - body.h/2);
		},
		
		fadeOut: function()
		{
			body.getObject().fadeOut();
		}
	});
	
	body.root.append(body.holder.getHtml());
	body.getObject().css("opacity", System.DEF_ALPHA);
	
	if(moveable)
	{
		body.dragHolder = body._osd.addHotspot(0, 0, body.w, body.h);
		body.setDraggable(body.dragHolder);
	}
	
	return body;
}