function CheckBox(ow, o, xpos, ypos, c, lbl, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	var state = Gadget.STATE_DEFAULT;
	
	var spacing = 18; //distance between checkbox and label
	var hld_border = 2; //holder thickness
	
	g.extend(
	{
		/**---protected properties---**/
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		labelText: lbl,
		id: uid || "gadget_uid_" + System.gadgets,
		holder: null,
		core: null,
		hotspot: null,
		checked: true,
		_osd: null,
		label: null,
		root: null,
		
		/**---public methods---**/
		update: function(st)
		{
			state = st;
			if(!g.disabled)
			{
				switch(state)
				{
					case(Gadget.STATE_DEFAULT):
						g.holder.setColor(Osd.COLOR_WINDOW);
						g.core.setColor(Osd.COLOR_SELECTED);
						
						if(g.label) g.label.setColor(Osd.COLOR_TEXT);
						break;
						
					case(Gadget.STATE_FOCUSED):
						g.holder.setColor(Osd.COLOR_HILITE);
						g.core.setColor(Osd.COLOR_SELECTED);
						
						if(g.label) g.label.setColor(Osd.COLOR_SELECTED);
						
						if(g.checked)
						{
							if(g.core.alpha < 1.0) g.core.setAlpha(1.0);
						}
						else
						{
							if(g.core.alpha > 0.0) g.core.setAlpha(0.0);
						}
						break;
						
					case(Gadget.STATE_PRESSED):
						g.core.setColor(Osd.COLOR_HILITE);
						g.core.setColor(Osd.COLOR_DEFAULT);
						
						if(g.label) g.label.setColor(Osd.COLOR_SELECTED);
						break;
				}
			}
			else
			{
				if(g.checked)
				{
					if(g.core.alpha < 1.0) g.core.setAlpha(1.0);
				}
				else
				{
					if(g.core.alpha > 0.0) g.core.setAlpha(0.0);
				}
			}
		},
		
		check: function(val)
		{
			g.checked = val;
			
			g.update(Gadget.STATE_FOCUSED);
			g.update(Gadget.STATE_DEFAULT);
		},
		
		disable: function()
		{
			g.disabled = true;
			
			g.holder.setBorderColor(Osd.COLOR_DISABLED);
			g.core.setColor(Osd.COLOR_DISABLED);
			
			if(g.label) g.label.setColor(Osd.COLOR_DISABLED);
		},
		
		enable: function()
		{
			g.disabled = false;
		
			g.holder.setBorderColor(Osd.COLOR_DEFAULT);
			g.core.setColor(Osd.COLOR_SELECTED);
			
			if(g.label) g.label.setColor(Osd.COLOR_TEXT);
		},
		
		setPos: function(_x, _y)
		{
			g.x = _x;
			g.y = _y;
			
			g.holder.setPos(g.x, g.y);
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		},
		
		setDepth: function(val)
		{
			g.z = val;
			g.holder.setDepth(g.z);
		},
		
		show: function()
		{
			g.holder.show();
		},
		
		hide: function()
		{
			g.holder.hide();
		}
	});

	/**---override methods---**/
	g.override(
	{
		focus: function()
		{
			g.update(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			g.update(Gadget.STATE_DEFAULT);
		}
	});
	
	g.override(
	{
		press: function()
		{
			if(!g.disabled)
			{
				g.update(Gadget.STATE_PRESSED);
				g.hold();
			}
		},
	
		release: function()
		{
			if(!g.disabled)
			{
				if(g.focused)
				{
					g.checked = !g.checked;
					g.sendMessage(); //checkbox will execute command only when released (i.e. unchecked)
				}
				g.update(Gadget.STATE_FOCUSED);
			}
		}
	}, true);
	
	if(!uid) System.gadgets++;
	
	g.holder = new Rectangle(null, g.x, g.y, 10, 10, Osd.COLOR_WINDOW, 1.0, hld_border, Osd.COLOR_DEFAULT, 50);
	g.owner.root.append(g.holder.getHtml());

	g.root = g.holder.getObject();
	
	g.core = new Rectangle(null, 2, 2, 6, 6, Osd.COLOR_SELECTED, 1.0, 0, Osd.COLOR_DEFAULT, 50);
	g.root.append(g.core.getHtml());
	
	if(g.labelText)
	{
		g._osd = new Osd(g);
		g.label = g._osd.addLabel(0, 0, g.labelText);
		g.label.setPos(spacing, (g.root.height()-g.label.getObject().height())/2-1);
	}
	
	var hw = g.root.width()+hld_border*2;
	var hh = g.root.height()+hld_border*2;
	
	if(g.label)
	{
		hw = g.label.getObject().width()+spacing+hld_border;
		hh = g.label.getObject().height()-hld_border*3;
	}
	
	g.hotspot = new Hotspot(g.owner, g.osd, g.getCommand(), g.x+g.label.x, g.y-g.holder.h/4, g.label.getWidth()+spacing+hld_border, g.label.getHeight());
	g.setCommand(c);
	g.hotspot.attach(g);
	
	return g;
}