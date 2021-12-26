function Tree(ow, o, xpos, ypos, width)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, width, 0);

	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		reflector: null,
		items: [],
		
		/**---public methods---**/
		addItem: function(title, type)
		{
			var item = new TreeItem(c, title, type);
			item.tree = c;
			c.items.push(item);
			
			return item;
		},
		
		getSelection: function() //recursive selection scanner
		{
			var selection = [];
			
			for(var i=0; i<c.items.length; i++)
			{
				var sel = c.items[i].getSelection();
				
				if(sel && sel.length)
				{
					for(var j=0; j<sel.length; j++) selection.push(sel[j]);
				}
			}
			
			return selection;
		},
		
		setReflector: function(obj)
		{
			c.reflector = obj;
		}
	});
	
	c.relative(true);
	c.setHeight("auto");
	
	c.setBackground(Osd.COLOR_HILITE);
	c.setAlpha(System.DEF_ALPHA);
	
	return c;
}