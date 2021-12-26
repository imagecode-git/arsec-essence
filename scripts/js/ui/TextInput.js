function TextInput(ow, o, xpos, ypos, width, str, t, fs, c, uid)
{
	fs = typeof fs !== 'undefined' ? fs : TextLabel.SIZE_MEDIUM;
	fs = parseInt(fs);

	/**---private properties---**/
	var ct = new Container(ow, o, xpos, ypos, width, fs*1.5);
	var state = Gadget.STATE_DEFAULT;
	
	/**---extends Container---**/
	ct.extend(
	{
		/**---protected properties---**/
		selectable: true,
		type: t || TextInput.TYPE_DEFAULT,
		padding: 2,
		lock: ct._osd.addHotspot(0, 0, ct.w+ct.padding*2, ct.h), //completely prevents all mouse events in disabled state
		size: fs,
		value: typeof str !== 'undefined' ? str : "",
		
		/**---public methods---**/
		getLocalHtml: function()
		{
			var t = "text";
			if(ct.type == TextInput.TYPE_PASSWORD) t = "password";
			
			return '<input type="' + t + '" value="' + str + '" style="width: ' + ct.w + 'px; height: ' + ct.h + 'px; margin-left: 0px; margin-top: 0px; background: ' + Osd.COLOR_TEXTINPUT + '; border: none; color: ' + Osd.COLOR_TEXT + '; line-height: ' + (ct.h-ct.padding) + 'px; padding-left: 4px; overflow: auto; font-family: ' + System.DEF_FONT + '; font-size: ' + fs + 'px;"></input>';
		},
		
		getInputField: function()
		{
			return $("#" + ct.id + " input");
		},
		
		getHalfHeight: function()
		{
			return ct.h/2-ct.padding/2;
		},
		
		setWidth: function(val)
		{
			ct.getContainer().css("width", val);
			ct.getInputField().css("width", val);
		},
		
		setState: function(val)
		{
			state = val;
			switch(state)
			{
				case(Gadget.STATE_DEFAULT):
					ct.getInputField().css(
					{
						"background": Osd.COLOR_TEXTINPUT,
						"color": Osd.COLOR_TEXT
					});
					break;
					
				case(Gadget.STATE_FOCUSED):
					ct.getInputField().css(
					{
						"background": Osd.COLOR_SELECTED,
						"color": Osd.COLOR_INVERTED
					});
					break;
					
				case(Gadget.STATE_DISABLED):
					ct.getInputField().css(
					{
						"background": Osd.COLOR_HILITE,
						"color": Osd.COLOR_DISABLED
					});
					break;
			}
		},
		
		setValue: function(val)
		{
			ct.value = val;
			ct.getInputField().val(ct.value);
		},
		
		getValue: function()
		{
			return ct.value;
		}
	});
	
	/**---override methods---**/
	ct.override(
	{
		focus: function()
		{
			if(!ct.disabled) ct.setState(Gadget.STATE_FOCUSED);
		},
		
		unfocus: function()
		{
			if(!ct.disabled) ct.setState(Gadget.STATE_DEFAULT);
		},
	
		enable: function()
		{
			if(ct.focused) ct.setState(Gadget.STATE_FOCUSED);
			else ct.setState(Gadget.STATE_DEFAULT);
			
			ct.lock.hide();
		},
		
		disable: function()
		{
			ct.setState(Gadget.STATE_DISABLED);
			ct.lock.show();
		}
	});
	
	c = typeof c !== 'undefined' ? c : Osd.CMD_INVALID;
	ct.setCommand(c);
	
	ct.root.append(ct.getLocalHtml());
	ct.setActor(ct.getInputField());
	
	ct.getInputField().bind("change keydown keyup", function()
	{
		ct.value = ct.getInputField().val();
	});
	
	if(ct.selectable) ct.getInputField().addClass("selectable"); //selection colors are defined in styles.css
	ct.lock.hide();
	
	return ct;
}

/**---static variables---**/
TextInput.LINE_HEIGHT = 32;

TextInput.TYPE_DEFAULT	= 0x00;
TextInput.TYPE_PASSWORD	= 0x01;