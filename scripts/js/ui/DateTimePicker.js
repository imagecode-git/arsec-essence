function DateTimePicker(ow, o, xpos, ypos, width, height)
{
	var c = new Container(ow, o, xpos, ypos, width, height);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		
		/**---public methods---**/
	});
	
	c.setBackground(Osd.COLOR_SCROLLER_BCK); //debug!
	new Calendar(c, c._osd);
	
	return c;
}