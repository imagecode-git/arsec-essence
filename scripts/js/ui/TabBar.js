function TabBar(ow, o, xpos, ypos, texts, command, sz, p, def)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, 500, 25);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		tabs: [],
		size: sz,
		padding: p,
		selected: 0,
		defSelection: def || 0, //defines which tab is being selected by default
		
		/**---public methods---**/
		select: function(idx)
		{
			for(var i=0; i<c.tabs.length; i++) c.tabs[i].select(false);
			c.tabs[idx].select(true);
			
			c.selected = idx;
			c.osdCommand(c.getCommand()+idx);
		},
		
		osdCommand: function(cmd)
		{
		}
	});
	
	var px = 0;
	var py = 0;
	
	for(var i=0; i<texts.length; i++)
	{
		c.tabs.push(new TabButton(c, px, py, texts[i], command+i, c.size, i));
		px += c.tabs[i].w+c.padding;
	}
	
	c.setWidth(px-c.padding);
	c.setHeight(c.size*1.25);
	
	c.setCommand(command);
	
	return c;
}