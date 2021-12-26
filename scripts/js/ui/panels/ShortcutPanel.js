function ShortcutPanel(ow, o, cbk)
{
	/**---private properties---**/
	var p = new Panel(ow, o, Panel.LENGHTS[Panel.BOTTOM-1], Panel.BOTTOM, cbk, MainMenu.CMD_LOCK_SC);
	
	var buttWH = parseInt(p.h*0.7);
	var xpos = 50;
	var ypos = parseInt((p.h-buttWH)/2);
	var dlt = 75;
	
	//temp buttons
	p._osd.addImageButton(50, ypos, buttWH, buttWH, ["HddNormal.png", "HddActive.png", "HddPreLight.png"]);								xpos += dlt;
	p._osd.addImageButton(125, ypos, buttWH, buttWH, ["InformationNormal.png", "InformationActive.png", "InformationPreLight.png"]);	xpos += dlt;
	p._osd.addImageButton(200, ypos, buttWH, buttWH, ["RecordNormal.png", "RecordActive.png", "RecordPreLight.png"]);					xpos += dlt;
	
	xpos = 850;
	p._osd.addImageButton(850, ypos, buttWH, buttWH, ["HddNormal.png", "HddActive.png", "HddPreLight.png"]);							xpos += dlt;
	p._osd.addImageButton(925, ypos, buttWH, buttWH, ["InformationNormal.png", "InformationActive.png", "InformationPreLight.png"]);	xpos += dlt;
	p._osd.addImageButton(1000, ypos, buttWH, buttWH, ["RecordNormal.png", "RecordActive.png", "RecordPreLight.png"]);					xpos += dlt;
	
	xpos = 1650;
	p._osd.addImageButton(1650, ypos, buttWH, buttWH, ["HddNormal.png", "HddActive.png", "HddPreLight.png"]);							xpos += dlt;
	p._osd.addImageButton(1725, ypos, buttWH, buttWH, ["InformationNormal.png", "InformationActive.png", "InformationPreLight.png"]);	xpos += dlt;
	p._osd.addImageButton(1800, ypos, buttWH, buttWH, ["RecordNormal.png", "RecordActive.png", "RecordPreLight.png"]);					xpos += dlt;
	
	return p;
}