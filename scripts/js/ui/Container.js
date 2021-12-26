//this object hold child gadgets inside itself, attaching them to its local matrix
function Container(ow, o, xpos, ypos, width, height, dragobj, opacity, depth, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		debugMode: false, //makes container object visible
		id: uid || "gadget_gid_" + System.gadgets,
		x: xpos,
		y: ypos,
		z: depth || System.DEF_DEPTH,
		w: width,
		h: height,
		alpha: typeof opacity !== 'undefined' ? opacity : 1.0, //this parameter may come with zero value, so we apply special check for it
		_osd: null,
		draggable: dragobj || null,
		
		/**---public methods---**/
		getHtml: function()
		{
			return '<div id="' + g.id + '" style="margin-left: ' + g.x + 'px; margin-top: ' + g.y + 'px; width: ' + g.w + 'px; height: ' + g.h + 'px; opacity: ' + g.alpha + '; position: absolute;"><div style="width: ' + g.w + 'px; height: ' + g.h + 'px; overflow: hidden; position: absolute;"></div></div>';
		},
		
		getObject: function()
		{
			return $("#" + g.id);
		},
		
		getContainer: function()
		{
			return g.getObject().children(":first");
		},
		
		getRoot: function()
		{
			return g.root;
		},
		
		updatePos: function()
		{
			g.x = parseInt(g.getObject().css("margin-left"));
			g.y = parseInt(g.getObject().css("margin-top"));
		},
		
		getPos: function()
		{
			return [g.x, g.y];
		},
		
		setPos: function(_x, _y)
		{
			g.x = _x;
			g.y = _y;
			
			g.getObject().css(
			{
				"margin-left": g.x + "px",
				"margin-top": g.y + "px"
			});
		},
		
		globalPos: function()
		{
			var pos = g.getObject().offset();
			return([pos.left, pos.top]);
		},
		
		setDepth: function(val)
		{
			g.z = val;
			g.getObject().css("z-index", g.z);
		},
		
		setAlpha: function(val)
		{
			g.alpha = val;
			g.getObject().css("opacity", g.alpha);
		},
		
		updateDimensions: function()
		{
			g.w = parseInt(g.getContainer().css("width"));
			g.h = parseInt(g.getContainer().css("height"));
		},
		
		setWidth: function(val)
		{
			g.w = val;
			g.getObject().css("width", g.w);
			g.getContainer().css("width", g.w);
		},
		
		setHeight: function(val)
		{
			g.h = val;
			g.getObject().css("height", g.h);
			g.getContainer().css("height", g.h);
		},
		
		setBackground: function(val)
		{
			g.getObject().css("background", val);
		},
		
		show: function()
		{
			g.getObject().css("display", "block");
		},
		
		hide: function()
		{
			g.getObject().css("display", "none");
		},
		
		fadeIn: function()
		{
			g.hide();
			g.getObject().fadeIn();
		},
		
		fadeOut: function(kill)
		{
			g.getObject().fadeOut(
			{
				complete: function()
				{
					if(kill) g.finalize(); //destroy object after fadeout if kill is true
				}
			});
		},
		
		clip: function(val)
		{
			if(val) val = "hidden";
			else val = "visible";
			
			g.getObject().css("overflow", val);
		},
		
		relative: function(both)
		{
			if(both) g.getContainer().css("position", "relative");
			g.getObject().css("position", "relative");
		},
		
		absolute: function()
		{
			g.getObject().css("position", "absolute");
		},
		
		setDraggable: function(input)
		{
			/**example usage:
			*	var hs = g._osd.addHotspot(0, 0, g.w, g.h);
			*	g.setDraggable(hs); //attaching hotspot as a drag source, will move entire container if dragged
			**/
			if(!g.draggable)
			{
				g.draggable = input; //must be instance of gadget
				g.draggable.dragndrop = true;
				//g.draggable.setDepth(g.z+System.CSI_DEPTH);
				
				g.draggable.override(
				{
					drag: function()
					{
						var obj = g.getObject();
						var pos = g.draggable.dragPos;
						
						g.setPos(g.dragPivot[0]+pos[0], g.dragPivot[1]+pos[1]);
					},
					
					dragBegin: function()
					{
						g.dragPivot = g.getPos();
					}
				});
			}
		},
		
		setScrollable: function(val)
		{
			g.enableScroll = val;
			if(g.enableScroll) g.setActor(g.getObject());
		},
		
		finalize: function()
		{
			g.getObject().find("*").off(); //kill listeners for all child elements
			g.getObject().remove(); //annihilate everything, including the container itself
			delete g;
		}
	});
	
	g.owner.root.append(g.getHtml());
	g.root = g.getContainer();
	
	g._osd = new Osd(g);

	if(g.debugMode)
	{
		g.getObject().css(
		{
			"background": Osd.COLOR_CONTAINER,
			"opacity": 0.5
		});
	}

	return g;
}