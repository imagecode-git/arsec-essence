function Slider(ow, o, xpos, ypos, width, height, minval, maxval, c, defval, lbl, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	g.extend(
	{
		/**---protected properties---**/
		id: uid || "gadget_uid_" + System.gadgets,
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		w: width,
		h: 3,
		min: minval,
		max: maxval,
		def: defval || 0.0,
		value: defval || 0.0,
		holder: null,
		knob: null,
		hotspot: null,
		label: lbl || null, //external TextLabel object, will recieve slider value if defined
		_osd: null,
		
		/**---public methods---**/
		getValue: function()
		{
			return g.value;
		},
		
		setValue: function(val)
		{
			g.knob.setPos(val*g.getStep(), g.knob.getPos()[1]);
			g.dragPivot = g.knob.getPos();
			g.value = val;
			
			if(g.label) g.label.setText(g.value);
		},
		
		getStep: function()
		{
			return (g.w-g.knob.w)/(g.max-g.min);
		},
		
		lock: function()
		{
		},
		
		unlock: function()
		{
		}
	});
	
	g.holder = new Rectangle(null, g.x, g.y, g.w, g.h, Osd.COLOR_GRIDLINE, 1.0, null, null, 12);
	g.owner.root.append(g.holder.getHtml());
	g.root = g.holder.getObject();
	
	g._osd = new Osd(g);
	g.hotspot = g._osd.addHotspot(0, 0, g.w, 0);
	
	g.knob = g._osd.addImageButton(0, 0, 12, 12, ["sliderKnobNormal.png", "sliderKnobFocused.png", "sliderKnobFocused.png"], Osd.CMD_INVALID);
	g.knob.setPos(0, -(Math.floor(g.knob.getHeight()/2))+1);
	g.knob.dragndrop = true;
	
	g.knob.override(
	{
		drag: function()
		{
			var pos = [g.dragPivot[0]+g.knob.dragPos[0], g.knob.getPos()[1]];
			var lim = [0, g.w-g.knob.w];
			
			if(pos[0] < lim[0]) pos[0] = lim[0];
			if(pos[0] > lim[1]) pos[0] = lim[1];
			
			g.knob.setPos(pos[0], pos[1]);
			
			var len = g.w-g.knob.w;
			var curStep = (len-pos[0])/g.getStep();

			g.value = g.max-Math.round(curStep);
			g.sendMessage();
			
			if(g.label) g.label.setText(g.getValue());
		},
		
		dragEnd: function()
		{
			g.dragPivot = g.knob.getPos(); //last drag pos
			g.knob.unhold();
			
			if(!g.focused) g.knob.unfocus();
		},
		
		focus: function()
		{
			g.focus(); //knob may loose focus separately from the gadget itself, so we focus them both simultaneously
		}
	});
	
	//prevents sending osd commands by clicking hotspot
	g.override(
	{
		press: function()
		{
			if(!g.disabled)
			{
				g.hold();
				if(g.drg) g.sendMessage();
				
				var dlt = System.mouseX-g.knob.getObject().offset().left;
				g.knob.dragBegin();
				g.knob.dragPivot = [System.mouseX-dlt+Math.round(g.knob.w/2), System.mouseY];
				g.knob.drag();
				g.knob.press();
			}
		},
		
		hover: function()
		{
			if(g.knob.drg)
			{
				//press+focus for smoother knob movement after re-focusing
				g.knob.press();
				g.knob.focus();
				
				g.knob.drag();
			}
		}
	}, true);
	
	g.setCommand(c); //this command is being executed at each slider value change
	g.hotspot.setHeight(g.knob.getHeight());
	g.hotspot.setPos(0, -(Math.floor(g.knob.getHeight()/2))+1);
	g.hotspot.attach(g);
	
	g.setValue(g.value);
	
	return g;
}