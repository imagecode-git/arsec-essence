function LogFilter(ow, o, xpos, ypos, width, spc, cbk)
{
	/**---private properties---**/
	var c = new Container(ow, o, xpos, ypos, width, 0);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		spacing: spc,
		separator: null,
		headerSize: TextLabel.SIZE_LARGE,
		headerBtn: [],
		headerTxt: ["Date&Time", "Category", "Type", "Level", "Text Search"],
		sepThickness: 2,
		sepColor: Osd.COLOR_DISABLED,
		stackID: -1,
		callback: cbk,
		selected: LogFilter.FT_INVALID,
		expanded: false,
		enabled: false,
		uiHolder: null,
		iconsAdd: ["add_normal.png", "add_hover.png", "add_press.png"],
		iconsDel: ["del_normal.png", "del_hover.png", "del_press.png"],
		stdBtn: [],
		evtRating: null,
		
		/**---public methods---**/
		select: function(item)
		{
			if(c.selected < 0)
			{
				c.selected = item;
				
				c.headerBtn[item].updatePos();
				var dist = c.headerBtn[item].getPos()[0];
				
				for(var i=0; i<c.headerBtn.length; i++)
				{
					var btn = c.headerBtn[i];
					
					if(i != item) btn.fadeOut(true);
					else
					{
						var sel = c.headerBtn[item];
						
						sel.labelMode(true);
						sel.addText(":");
						sel.getObject().animate(
						{
							marginLeft: "-=" + dist + "px"
						},
						{
							complete: function()
							{
								c.buildInterface();
							}
						});
					}
				}
			}
		},
		
		buildInterface: function()
		{
			c.uiHolder = new Container(c, c._osd, c.headerBtn[c.selected].getWidth() + c.spacing, 0, 0, 100);
			c.buildBackbone();
			
			switch(c.selected)
			{
				case(LogFilter.FT_DATETIME):
					break;
					
				case(LogFilter.FT_CATEGORY): //category picker
					c.uiHolder._osd.addTabBar(0, c.center(c.headerSize), ["User", "System", "Alarm", "Misc"], null, c.headerSize, c.spacing);
					break;
					
				case(LogFilter.FT_TYPE):
					c.uiHolder._osd.addTabBar(0, c.center(c.headerSize), ["Global", "Notification", "Warning", "Other"], null, c.headerSize, c.spacing);
					break;
					
				case(LogFilter.FT_LEVEL):
					c.evtRating = c.uiHolder._osd.addRating(0, parseInt((c.getHeight()-c.headerSize)/2)+c.sepThickness/2, c.headerSize, 5);
					break;
					
				case(LogFilter.FT_TEXT):
					var len = c.uiHolder.w;
					
					for(var i=0; i<c.stdBtn.length; i++) len -= c.stdBtn[i].getWidth()+c.spacing;
					len -= c.spacing;
					c.uiHolder._osd.addTextInput(0, 0, len, "Type keyword...", TextInput.TYPE_DEFAULT, c.headerSize);
					break;
			}
			
			c.uiHolder._osd.setHandler(c);
			
			c.uiHolder.hide();
			c.callback(LogFilter.CBK_EDIT);
		},
			
		//builds basic interface, unified for all panels
		buildBackbone: function()
		{
			c.uiHolder.setWidth(c.w-c.headerBtn[c.selected].getWidth());
			
			var iconWH = 26;
			var px = c.uiHolder.w-iconWH*2;
			var src = [c.iconsDel, c.iconsAdd];
			var cmd = [LogFilter.CMD_DEL, LogFilter.CMD_ADD];
			
			for(var i=0; i<src.length; i++)
			{
				c.stdBtn.push(c.uiHolder._osd.addImageButton(px, c.center((iconWH+2*c.sepThickness)/2), iconWH, iconWH, src[i], cmd[i]));
				
				px -= iconWH;
				if(i < src.length-1) px -= c.spacing/2;
			}
			
			px += c.spacing/2;
			c.stdBtn.push(c.uiHolder._osd.addTextButton(px, 0, null, LogFilter.CMD_SWITCH, c.headerSize));
			c.osdCommand(LogFilter.CMD_SWITCH); //auto-enables the filter
			
			var b = c.stdBtn[c.stdBtn.length-1];
			b.setPos(b.getPos()[0]-b.getWidth(), c.center(c.headerSize));
		},
		
		showInterface: function()
		{
			c.uiHolder.fadeIn();
		},
		
		destroyInterface: function()
		{
			if(c.selected == LogFilter.FT_LEVEL) c.evtRating.finalize();
			c.fadeOut(true);
		},
		
		expand: function()
		{
			c.expanded = true;
		},
		
		collapse: function()
		{
			c.expanded = false;
		},
		
		getHeight: function()
		{
			var itemID = 0;
			if(c.selected >= 0) itemID = c.selected;
			
			if(!c.expanded) return c.spacing/2+c.headerSize;
		},
		
		//centering elements inside filter line according to their heights
		center: function(input)
		{
			return (input-c.spacing)/2+c.sepThickness
		},
		
		osdCommand: function(cmd)
		{
			if(cmd < LogFilter.CMD_ADD) c.select(cmd);
			else
			{
				switch(cmd)
				{
					case(LogFilter.CMD_SWITCH):
						c.enabled = !c.enabled;
						
						var col = Osd.COLOR_TEXT;
						var str = "Disabled"
						if(c.enabled)
						{
							col = Osd.COLOR_SELECTED;
							str = "Enabled";
						}
						
						//switch button, usually the last in array
						c.stdBtn[c.stdBtn.length-1].setDefColor(col);
						c.stdBtn[c.stdBtn.length-1].setText(str);
						break;
						
					case(LogFilter.CMD_ADD):
						c.callback(LogFilter.CBK_ADD, c.stackID);
						break;
						
					case(LogFilter.CMD_DEL):
						c.callback(LogFilter.CBK_DEL, c.stackID);
						break;
				}
			}
		}
	});
	
	var px = 0;
	for(var i=0; i<c.headerTxt.length; i++)
	{
		var b = c._osd.addTextButton(px, c.center(c.headerSize), c.headerTxt[i], i, c.headerSize);
		px += b.getWidth()+c.spacing;
		
		c.headerBtn.push(b);
	}
	
	//automatic horizontal centering for header buttons
	for(var i=0; i<c.headerBtn.length; i++)
	{
		var pos = c.headerBtn[i].getPos();
		c.headerBtn[i].setPos(pos[0]+Math.round((c.w-px+c.spacing)/2), pos[1]);
	}
	
	c.separator = new Rectangle(null, 0, c.headerSize+c.spacing, c.w, c.sepThickness, c.sepColor)
	c.getObject().append(c.separator.getHtml());
	
	c.setHeight(c.headerSize+c.spacing);
	
	return c;
}

/**---static variables---**/
LogFilter.FT_INVALID	= -1;
LogFilter.FT_DATETIME	= 0;
LogFilter.FT_CATEGORY	= 1;
LogFilter.FT_TYPE		= 2;
LogFilter.FT_LEVEL		= 3;
LogFilter.FT_TEXT		= 4;

LogFilter.CMD_ADD		= 200;
LogFilter.CMD_DEL		= 201;
LogFilter.CMD_SWITCH	= 202;

LogFilter.CBK_ADD		= 0;
LogFilter.CBK_DEL		= 1;
LogFilter.CBK_EDIT		= 2;
LogFilter.CBK_COLLAPSE	= 3;