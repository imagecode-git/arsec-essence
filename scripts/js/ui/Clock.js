function Clock(ow, o, xpos, ypos)
{
	/**---private properties---**/
	var scale = 1.0; //completely rescalable
	var c = new Container(ow, o, 1092, 420, 198*scale, 238*scale); //WH must come as external input, same for XY
	
	/**---extends Container---**/
	c.extend(
	{
		/**---protected properties---**/
		holder: null,
		fontSize: TextLabel.SIZE_LARGE*scale,
		padding: (TextLabel.SIZE_LARGE*scale)*1.5,
		switchBtn: [],
		centerPin: null,
		roundPins: [],
		hourPin: null,
		hourPinHotspot: null,
		minutePin: null,
		minutePinHotspot: null,
		hourPinThickness: 6*scale,
		minutePinThickness: 2*scale,
		pinGlobalPos: null,
		
		/**---public methods---**/
		build: function()
		{
			c.holder = new Rectangle(null, c.padding/2, (c.w-2*c.padding)/2-c.padding/2, c.w-c.padding, c.w-c.padding, Osd.COLOR_WINDOW, 1.0, null, null, 999);
			c.getObject().append(c.holder.getHtml());
			
			var data = ["AM", "PM"];
			var px = c.w/2;
			var py = c.h-c.w-c.fontSize*1.875;
			var lw = 0;
			
			for(var i=0; i<data.length; i++)
			{
				c.switchBtn.push(c._osd.addTextButton(px, py, data[i], Clock.CMD_SWITCH+i, c.fontSize));
				px += c.switchBtn[i].getWidth()+c.padding/2;
				
				lw += c.switchBtn[i].getWidth();
				if(i<data.length-1) lw += c.padding/2;
			}
			
			for(var i=0; i<c.switchBtn.length; i++)
			{
				var pos = c.switchBtn[i].getPos();
				c.switchBtn[i].setPos(pos[0]-lw/2, pos[1]);
			}
			
			var pinSize = parseInt(c.holder.getWidth()*0.075);
			var center = [parseInt((c.holder.getWidth()-pinSize)/2), parseInt((c.holder.getHeight()-pinSize)/2)];
			
			c.centerPin = new Rectangle(null, center[0], center[1], pinSize, pinSize, Osd.COLOR_TEXT, 1.0, null, null, 999);
			c.holder.getObject().append(c.centerPin.getHtml());
			
			for(var i=0; i<8; i++)
			{
				var pos = Math.rotate([center[0], -(pinSize/2)], [center[0], center[1]], Math.PI*(0.25*(i+1))); //rotating the pin on each quarter
				var pin = new Rectangle(null, pos[0], pos[1], pinSize, pinSize, Osd.COLOR_TEXT, 1.0, null, null, 999);

				c.holder.getObject().append(pin.getHtml());
				c.roundPins.push(pin);
			}
			
			c.hourPin = new Rectangle(null, 0, 0, c.hourPinThickness, c.holder.getHeight()*0.3, Osd.COLOR_TEXT);
			c.holder.getObject().append(c.hourPin.getHtml());
			c.hourPin.setPos(center[0]+c.hourPinThickness/2, center[1]-c.hourPin.getHeight()+pinSize/2);
			c.hourPin.smooth();
		
			c.minutePin = new Rectangle(null, 0, 0, c.minutePinThickness, c.holder.getHeight()*0.425, Osd.COLOR_TEXT);
			c.holder.getObject().append(c.minutePin.getHtml());
			c.minutePin.setPos(center[0]+c.minutePinThickness*2.5, center[1]-c.minutePin.getHeight()+pinSize/2);
			c.minutePin.smooth();
			
			pos = c.minutePin.getPos();
			c.minutePinHotspot = new Hotspot(c.holder, c._osd, null, pos[0]-c.minutePin.getWidth()*1.5, pos[1], c.minutePin.getWidth()*4, c.minutePin.getHeight());
			c.holder.getObject().append(c.minutePinHotspot.area.getHtml());
			
			var pos = c.hourPin.getPos();
			c.hourPinHotspot = new Hotspot(c.holder, c._osd, null, pos[0]-c.hourPin.getWidth()*0.5, pos[1], c.hourPin.getWidth()*2, c.hourPin.getHeight());
			c.holder.getObject().append(c.hourPinHotspot.area.getHtml());
		},
		
		matrixToAngle: function(input)
		{
			var val = input.css("transform");
			
			val = val.split('(')[1];
			val = val.split(')')[0];
			val = val.split(',');
			
			var result, angle;
			if(val && val.length)
			{
				result = Math.atan2(val[0], val[1])*(180/Math.PI); //extracting rotation angle from transformation matrix
				angle = (result < 0) ? result +=360 : result; //fixing negative angles
			}
			else angle = 0;
			
			return Math.abs(angle-360);
		},
		
		getHours: function()
		{
			var angle = c.matrixToAngle(c.hourPin.getObject());
			return Math.floor(parseInt((angle*2)/60));
		},
		
		getMinutes: function()
		{
		},
		
		getSeconds: function()
		{
		},
		
		osdCommand: function(cmd)
		{
			switch(cmd)
			{
				case(Clock.CMD_SWITCH_AM):
					break;
					
				case(Clock.CMD_SWITCH_PM):
					break;
			}
		}
	});
	
	//c.setBackground("#f00");
	c.build();
	
	//use this to auto-adjust pins when user defines the time in manual mode
	/*
	c.holder.getObject().click(function()
	{
		c.hourPin.getObject().rotate({animateTo:parseInt(Math.random()*360), easing: $.easing.easeInOutExpo, duration: 1500, center: [c.hourPin.w/2 + "px", c.hourPin.h + "px"]});
		c.minutePin.getObject().rotate({animateTo:parseInt(Math.random()*360), easing: $.easing.easeInOutExpo, duration: 1500, center: [c.minutePin.w/2 + "px", c.minutePin.h + "px"]});
	});*/
	
	//refactor this code!!
	c.hourPinHotspot.dragndrop = true;
	c.hourPinHotspot.setActor(c.hourPinHotspot.area.getObject());
	c.hourPinHotspot.override(
	{
		dragBegin: function()
		{
			c.pinGlobalPos = [c.hourPin.getObject().offset().left, c.hourPin.getObject().offset().top];
		},
		
		drag: function()
		{
			var x = -(System.mouseX-parseInt(c.pinGlobalPos[0]));
			var y = -(System.mouseY-parseInt(c.pinGlobalPos[1]))+c.hourPin.getHeight();
			var ang = Math.atan2(y, x)*(180/Math.PI)-90; //atan2 is ok, XY are correct, but the angle is wrong
			System.debug(parseInt(ang));
			
			c.hourPin.getObject().css("transform-origin", c.hourPinThickness/2 + "px " + c.hourPin.getHeight() + "px");
			c.hourPin.getObject().css("transform", "rotate(" + ang + "deg)");
			
			c.hourPinHotspot.area.getObject().css("transform-origin", c.hourPinThickness + "px " + c.hourPin.getHeight() + "px");
			c.hourPinHotspot.area.getObject().css("transform", "rotate(" + ang + "deg)");
			
			//System.debug(c.getHours());
		},
		
		dragEnd: function()
		{
			c.hourPinHotspot.unhold();
		}
	});
	
	c.minutePinHotspot.dragndrop = true;
	c.minutePinHotspot.setActor(c.minutePinHotspot.area.getObject());
	c.minutePinHotspot.override(
	{
		dragBegin: function()
		{
			c.pinGlobalPos = [c.minutePin.getObject().offset().left, c.minutePin.getObject().offset().top];
		},
		
		drag: function()
		{
			var ang = Math.atan2(System.mouseY-parseInt(c.pinGlobalPos[1]), System.mouseX-parseInt(c.pinGlobalPos[0]))*(180/Math.PI)+90;
			
			c.minutePin.getObject().css("transform-origin", c.minutePinThickness/2 + "px " + c.minutePin.getHeight() + "px");
			c.minutePin.getObject().css("transform", "rotate(" + ang + "deg)");
			
			c.minutePinHotspot.area.getObject().css("transform-origin", c.minutePinThickness*2 + "px " + c.minutePin.getHeight() + "px");
			c.minutePinHotspot.area.getObject().css("transform", "rotate(" + ang + "deg)");
		},
		
		dragEnd: function()
		{
			c.minutePinHotspot.unhold();
		}
	});
	
	return c;
}

/**---static variables---**/
Clock.CMD_SWITCH_AM = 200;
Clock.CMD_SWITCH_PM = 201;