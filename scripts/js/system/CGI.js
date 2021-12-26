//this class requires webserver and CGI interpreter running to operate, always keep in mind
function CGI()
{
	var clazz = new Class(
	{
		//password must come encrypted!
		login: function(ip, port, user, password, autologin, saveusr, lng, onsuccess)
		{
			request("login.cgi",
			{
				cmd:			"login",
				server_ip:		ip,
				server_port:	port,
				server_user:	user,
				server_pass:	password,
				auto_login:		autologin,
				save:			saveusr,
				lang:			lng
			}, onsuccess)
		},
		
		//async request! we can't just return UID as a result of function, we have to call onsuccess instead
		getUID: function(onsuccess)
		{
			proxy_request("get_Info.cgi",
			{
				info: '["uid"]'
			}, function(data)
			{
				onsuccess(eval(data)[0].uid)
			});
		},
		
		//temp!
		proxy_request: function(pg, context, onsuccess)
		{
			proxy_request(pg, context, onsuccess);
		}
	});
	
	return clazz;
}

//request for local CGI's
function request(pg, context, onsuccess)
{
	var params =
	{      
		page: pg,
		vars: context,
		timeout: "10000"
	};

	$.ajax(
	{
		type: "POST",
		url: "/cgi-bin/viewer/" + pg,
		async: true,
		data: $.param(context),
		params: params,
		success: onsuccess,
		error: function(xhr, ajaxOptions, thrownError)
		{
			console.log("error" , xhr , ajaxOptions, window.location.href);
		},
		beforeSend: function(xhr, ajaxOptions, thrownError)
		{
		}
	});
}

//request for proxy CGI's
function proxy_request(pg, context, onsuccess)
{
	var params =
	{      
		page: pg,
		timeout: "10000"
	};
	
	$.ajax(
	{
		type: "POST",
		url: "/cgi-bin/viewer/proxy.cgi",
		async: true,
		data: $.param(params) + '&vars=[' + $.param(context) + ']',
		params: params,
		success: onsuccess,
		error: function(xhr, ajaxOptions, thrownError)
		{
			console.log("error" , xhr , ajaxOptions, window.location.href);
		},
		beforeSend: function(xhr, ajaxOptions, thrownError)
		{
		}
	});	
}