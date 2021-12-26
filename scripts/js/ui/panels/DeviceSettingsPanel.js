function DeviceSettingsPanel(ow, o, cbk)
{
	/**---private properties---**/
	var p = new Panel(ow, o, Panel.LENGHTS[Panel.RIGHT-1], Panel.RIGHT, cbk, MainMenu.CMD_LOCK_DEVST);

	p.extend(
	{
		/**---protected properties---**/
		acc: new Accordion(p.holder, o, 20, 10, p.w-145),
		picAdjust: null,
		info: null,
		settings: null,
		other: null,
		
		/**---public methods---**/
		osdCommand: function(cmd)
		{
		}
	});
	
	p.holder.clip(true);
	
	//recieving osdCommand from accordion here
	p.holder.extend(
	{
		osdCommand: function(cmd)
		{
		}
	});
	
	var itemNames = ["Picture Adjust", "Info", "Settings", "Other"];
	for(var i=0; i<itemNames.length; i++)
	{
		p.acc.addItem(itemNames[i], p.w-50);
	
		p.acc.items[i].content.relative(true);
		p.acc.items[i].content.setHeight("auto");
	}
	
	return p;
}