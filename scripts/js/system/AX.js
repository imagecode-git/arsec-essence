//manipulator for ActiveX plugins
function AX()
{
	var clazz = new Class(
	{
		//TODO: adjustable input data for this method
		getLog: function(callback)
		{
			var obj = System.plugins[0];
			
			obj.addCallback(callback);
			obj.getObject()[0].DataRequest('{"type":"log_detailed"}', '{"uid":"' + System.uid + '","filters":[{"category":"Event","name":["Motion","Video loss","DI","HDD","Network"]},{"category":"Operation","name":["View","Setup","Playback","Log","Export","Export Log"]},{"category":"System","name":["Boot","Reboot","Shutdown","USB"]}],"count":["0","150"],"order":["time","asc"] ,"time":[{"start":"1382578225","end":"1592632225"}]}');
		}
	});
	
	return clazz;
}