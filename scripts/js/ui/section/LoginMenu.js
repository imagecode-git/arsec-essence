//TODO: onscreen keyboard, power/restart buttons, language switcher
function LoginMenu(ow, o)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	g._osd = new Osd(g);
	g._osd.setHandler(ow);
	
	g.extend(
	{
		/**---protected properties---**/
		bck: g._osd.addImage(0, 0, System.SCREEN_X, System.SCREEN_Y, "nesa_bck.jpg"),
		vignette: g._osd.addVignette(700),
		dialog: new LoginDialog(ow, o, g)
	});
}