//usage:
/*
	osd.addSVG(800, 450, 50, SVG.ICONS, SVG.ICON_NESA, Osd.COLOR_SELECTED, 1, null);
*/

function SVG(ow, o, xpos, ypos, sz, source, gl, col, opacity, uid)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		id: uid || "glyph_sid_" + System.shapes,
		x: xpos,
		y: ypos,
		z: System.DEF_DEPTH,
		size: sz,
		color: col,
		alpha: typeof opacity !== 'undefined' ? opacity : 1.0, //this parameter may come with zero value, so we apply special check for it
		src: source,
		glyph: gl,
		
		/**---public methods---**/
		getHtml: function()
		{
			return '<div id="' + g.id + '" style=" margin-left: ' + g.x + 'px; margin-top: ' + g.y + 'px; width: ' + g.size + 'px; height: ' + g.size + 'px; opacity: ' + g.alpha + '; position: absolute; cursor: default; -moz-user-select: none; -webkit-user-select: none; user-select: none;"><span style="width: ' + g.size + 'px; height: ' + g.size + 'px; font-family: ' + g.src + '; font-size: ' + g.size + 'px; color: ' + g.color + '; -webkit-text-stroke: 0.6px;">' + g.glyph + '</span></div>';
		},
		
		getObject: function()
		{
			return $("#" + g.id);
		}
	});
	
	g.owner.root.append(g.getHtml());
	if(!uid) System.shapes++;
	
	//preventing unwanted native browser drag
	g.getObject().on("dragstart", function()
	{
		return false;
	});
	
	g.root = g.getObject();
	
	return g;
}

/**---static variables---**/
SVG.ICONS = "icons";

SVG.ICON_NESA = "\ue800";