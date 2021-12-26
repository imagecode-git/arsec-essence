function TreeItem(p, ttl, typ, child, lvl, t)
{
	/**---private properties---**/
	var c = new Container(p, p.osd, 0, 0, p.w, TreeItem.DEF_HEIGHT);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		tree: t,
		parent: p,
		children: [],
		level: lvl || 0,
		single: true, //defines if element is a group or it is not
		type: typ || TreeItem.TYPE_UNKNOWN,
		btn_level: c._osd.addImageButton(0, 0, TreeItem.DEF_ICON_WH, TreeItem.DEF_ICON_WH, ["tree_single_normal.png", "tree_single_hover.png", "tree_single_hover.png"], TreeItem.CMD_EXPAND),
		icon_element: c._osd.addImage(0, 0, TreeItem.DEF_ICON_WH, TreeItem.DEF_ICON_WH, null),
		btn_select: c._osd.addTextButton(0, 0, ttl, TreeItem.CMD_SELECT, TextLabel.SIZE_MODERATE),
		title: ttl,
		expanded: false,
		selected: false,
		content: null,
		
		/**---public methods---**/
		addChild: function(ttl, ct)
		{
			var obj = new TreeItem(c.content, ttl, ct, true, c.level+1, c.tree);
			c.children.push(obj);
			
			c.single = false;
			c.btn_level.updateImages(["tree_group_normal.png", "tree_group_hover.png", "tree_group_press.png"], TreeItem.DEF_ICON_WH, TreeItem.DEF_ICON_WH);
			c.btn_level.disabled = false;
			
			return obj;
		},
		
		getIcon: function()
		{
			switch(c.type)
			{
				case(TreeItem.TYPE_SERVER):
					return "server.png";
					break;
					
				case(TreeItem.TYPE_NVR):
					return "nvr.png";
					break;
					
				case(TreeItem.TYPE_DISPLAY):
					return "display.png";
					break;
					
				case(TreeItem.TYPE_GRID):
					return "grid.png";
					
				case(TreeItem.TYPE_CAMERA):
					return "camera.png";
					
				case(TreeItem.TYPE_WEBPAGE):
					return "webpage.png";
					
				case(TreeItem.TYPE_UNKNOWN):
					return "unknown.png";
					break;
			}
		},
		
		setTip: function(str, imp)
		{
			var col = Osd.COLOR_TEXT;

			if(imp != undefined)
			{
				switch(imp) //importancy levels
				{
					case(TreeItem.TIP_LOW):
						col = Osd.COLOR_WARNING_LOW;
						break;
						
					case(TreeItem.TIP_MEDIUM):
						col = Osd.COLOR_WARNING_MID;
						break;
						
					case(TreeItem.TIP_HIGH):
						col = Osd.COLOR_WARNING_HIGH;
						break;
				}
			}
			
			c.btn_select.insertTip(str, col);
		},
		
		expandAll: function(val)
		{
			if(val == undefined) val = true;
			c.expand(val, true);
			
			for(var i=0; i<c.children.length; i++)
			{
				var obj = c.children[i];
				if(!obj.expanded) obj.expand(val);
			}
		},
		
		select: function(val)
		{
			c.selected = val;
			
			var color = Osd.COLOR_TRANSPARENT;
			if(val) color = Osd.COLOR_DISABLED;
			
			c.setBackground(color);
		},
		
		//cascade option prevents multiple update calls for child items
		expand: function(val, cascade)
		{
			c.expanded = val;
			
			var ref = c.tree.reflector;
		
			if(!c.single) //only groups can be expanded
			{
				var deg = 0;
				if(val) deg = 90;
				
				c.btn_level.getObject().rotate({animateTo:deg, easing: $.easing.easeInOutExpo, duration: 350, center: [c.btn_level.w/2 + "px", c.btn_level.h/2 + "px"]});
				
				//same long workaround for the stop() bug, as it was implemented in AccordionItem
				if(val)
				{
					c.content.getObject().stop().animate(
					{
						"height": "show",
						"marginTop": "show",
						"marginBottom": "show",
						"paddingTop": "show",
						"paddingBottom": "show"
					},
					{
						complete: function() //actually fixes the bug
						{
							c.content.getObject().css("height", "auto");
							if(ref && !cascade) ref.update();
						}
					});
				}
				else
				{
					c.content.getObject().stop().animate(
					{
						"height": "hide",
						"marginTop": "hide",
						"marginBottom": "hide",
						"paddingTop": "hide",
						"paddingBottom": "hide"
					},
					{
						complete: function()
						{
							c.content.getObject().css("height", "auto");
							if(ref && !cascade) ref.update();
						}
					});
				}
			}
		},
		
		getSelection: function()
		{
			var selection = [];
			
			if(!c.single)
			{
				for(var i=0; i<c.children.length; i++)
				{
					var sel = c.children[i].getSelection();
					
					if(sel && sel.length)
					{
						for(var j=0; j<sel.length; j++) selection.push(sel[j]);
					}
				}
			}
			else
			{
				if(c.selected) selection.push(c);
			}
			
			return selection;
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(TreeItem.CMD_EXPAND):
					c.expand(!c.expanded);
					
					break;
					
				case(TreeItem.CMD_SELECT):
					if(c.single)
					{
						if(!c.selected)
						{
							var accept = true;
							var sel = c.tree.getSelection();
							
							if(sel && sel.length)
							{
								for(var i=0; i<sel.length; i++)
								{
									if(c.type != sel[i].type)
									{
										accept = false;
										break;
									}
								}
							}
							
							if(!accept)
							{
								for(var j=0; j<sel.length; j++) sel[j].select(false);
							}
							
							c.select(true);
						}
						else c.select(false);
					}
					break;
			}
		}
	});
	
	c.btn_level.override(
	{
		doubleclick: function()
		{
			var val = !c.expanded;
			
			c.expand(val);
			for(var i=0; i<c.children.length; i++) c.children[i].expandAll(val); //then recursive expand for all child elements
		}
	}, true);
	
	
	var padding = (TreeItem.DEF_HEIGHT-TreeItem.DEF_ICON_WH)/2;
	var xpos = TreeItem.TAB;
	var ypos = padding;
	
	if(child) xpos+= TreeItem.TAB*c.level;
	
	c.btn_level.enableDoubleClick = true;
	c.btn_level.setPos(xpos, ypos);
	c.btn_level.smooth();
	xpos += padding/2+TreeItem.DEF_ICON_WH;
	
	c.icon_element.setPos(xpos, ypos);
	xpos += padding;
	
	//padding calculation must be fixed!
	padding = (c.h-c.btn_select.size)/2;
	xpos += TreeItem.TAB/2+padding;
	ypos = padding-2;
	c.btn_select.setPos(xpos, ypos);
	
	c.btn_level.disabled = true;
	c.icon_element.update(c.getIcon());
	
	c.relative();
	
	//each item has its own restricted container area by default
	c.content = new Container(c.parent, c.parent.osd, 0, 0, c.parent.w, 0);
	c.content.relative(true); //'true' means we apply relative pos both to container and to object
	c.content.getObject().css("display", "none");
	c.content.setHeight("auto");
	
	return c;
}

/**---static variables---**/
TreeItem.TIP_LOW		= 1;
TreeItem.TIP_MID		= 2;
TreeItem.TIP_HIGH		= 3;

TreeItem.TYPE_UNKNOWN	= 0;
TreeItem.TYPE_SERVER	= 1;
TreeItem.TYPE_NVR		= 2;
TreeItem.TYPE_DISPLAY	= 3;
TreeItem.TYPE_GRID		= 4;
TreeItem.TYPE_CAMERA	= 5;
TreeItem.TYPE_WEBPAGE	= 6;

TreeItem.DEF_HEIGHT		= 28;
TreeItem.DEF_ICON_WH	= 16;
TreeItem.TAB			= 16;

TreeItem.CMD_EXPAND		= 200;
TreeItem.CMD_SELECT		= 201;