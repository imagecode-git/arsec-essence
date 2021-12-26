function AccordionItem(acc, ttl, cxpos, cypos, cwidth, cmd)
{
	/**---private properties---**/
	var c = new Container(acc, acc.osd, 0, 0, acc.w, AccordionItem.DEF_HEIGHT);
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		cx: cxpos,
		cy: cypos,
		cw: cwidth,
		ch: 0,
		holder: new Rectangle(null, 0, 0, c.w, c.h, Osd.COLOR_TRANSPARENT, System.DEF_ALPHA),
		button: null,
		textBtn: null,
		accordion: acc,
		title: ttl,
		expanded: false,
		content: null,
		command: cmd,
		
		/**---public methods---**/
		hilight: function(foc)
		{
			if(foc)
			{
				c.button.focus();
				c.textBtn.focus();
			}
			else
			{
				c.button.unfocus();
				c.textBtn.unfocus();
			}
		},
		
		expand: function(state)
		{

		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(AccordionItem.CMD_EXPAND):
					c.expanded = !c.expanded;
					
					var deg = 0;
					if(c.expanded) deg = 90;
					
					c.button.getObject().rotate({animateTo:deg, easing: $.easing.easeInOutExpo, duration: 350, center: [c.button.w/2 + "px", c.button.h/2 + "px"]});
					
					var ref = c.accordion.reflector;
					
					//could be replaced with stop().slideDown() and stop().slideUp(), but this will ruin auto-height at every stop(), so we handle animation manually
					if(c.expanded)
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
							complete: function() //this actually fixes the stop() bug
							{
								c.content.getObject().css("height", "auto");
								if(ref) ref.update();
							},
							
							step: function()
							{
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
								if(ref) ref.update();
							},
							
							step: function()
							{
							}
						});
					}
					break;
					
				case(AccordionItem.CMD_SELECT):
					c.accordion.osdCommand(c.command); //sending osdCommand to accordion
					break;
			}
		}
	});
	
	c.root.append(c.holder.getHtml());
	
	c.textBtn = c._osd.addTextButton(0, 0, c.title, AccordionItem.CMD_SELECT, TextLabel.SIZE_LARGE);
	
	var padding = (c.h-c.textBtn.size)/2; //padding for text
	var dlt = (AccordionItem.DEF_HEIGHT-AccordionItem.DEF_ICON_WH)/2; //used to calculate padding for image button

	c.textBtn.setPos(AccordionItem.DEF_ICON_WH+dlt, padding-3);
	c.button = c._osd.addImageButton(0, dlt, AccordionItem.DEF_ICON_WH, AccordionItem.DEF_ICON_WH, ["triangleNormal.png", "triangleHover.png", "trianglePress.png"], AccordionItem.CMD_EXPAND);
	c.button.smooth();
	
	c.relative();
	
	//each item has its own restricted container area by default
	c.content = new Container(c.accordion, c.accordion.osd, c.cx, c.cy, c.cw, c.ch);
	c.content.relative(true); //'true' means we apply relative pos both to container and to object
	c.content.setHeight("auto");
	c.content.getObject().css("display", "none");
	
	return c;
}

/**---static variables---**/
AccordionItem.DEF_HEIGHT = 32;
AccordionItem.DEF_ICON_WH = 10;

AccordionItem.CMD_EXPAND = 200;
AccordionItem.CMD_SELECT = 201;