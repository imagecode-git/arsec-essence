function Accordion(ow, o, xpos, ypos, width)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, width, 0);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		holder: new Rectangle(null, 0, 0, c.w, c.h, Osd.COLOR_WINDOW, System.DEF_ALPHA),
		reflector: null,
		items: [],
		
		/**---public methods---**/
		addItem: function(title, cmd)
		{
			c.items.push(new AccordionItem(c, title, c.xpos, c.ypos, c.w, cmd));
		},
		
		capacity: function()
		{
			return c.items.length;
		},
		
		setReflector: function(obj)
		{
			c.reflector = obj;
		},
		
		osdCommand: function(cmd)
		{
			c.owner.osdCommand(cmd); //translates command from accordion items to owner (make sure it must support osdCommand!)
		}
	});
	
	c.root.append(c.holder.getHtml());
	
	c.holder.clip(true);
	c.holder.setHeight("auto");
	
	c.setHeight("auto");
	c._osd.setHandler(c.owner);

	return c;
}