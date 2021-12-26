function LoadingDialog(ow, o)
{
	/**---private properties---**/
	var g = new Gadget(ow, o);
	
	g._osd = new Osd(g);
	g._osd.setHandler(ow);
	
	/**---extends Gadget---**/
	g.extend(
	{
		/**---protected properties---**/
		vignette: null,
		label: null,
		offset: 150, //offset from the screen edges
		imageDist: [20, 50], //min/max distance between images
		imageSize: 12, //size of each image
		images: [],
		animTime: 900,
		invAnim: true,
		
		/**---public methods---**/
		build: function()
		{
			g.vignette =  g._osd.addVignette(g.animTime/2);
			
			for(var i=0; i<4; i++)
			{
				var xpos = System.SCREEN_X-g.offset;
				var ypos = System.SCREEN_Y-g.offset;
				
				switch(i)
				{
					case 1:
						xpos += g.imageDist[0];
						break;
						
					case 2:
						ypos -= g.imageDist[0];
						break;
						
					case 3:
						xpos += g.imageDist[0];
						ypos -= g.imageDist[0];
						break;
				}
				
				var img = g._osd.addImage(xpos, ypos, g.imageSize, g.imageSize, "loading_item.png");
				img.setAlpha(0);
				g.images.push(img);
			}
			
			g.label = g._osd.addLabel(System.SCREEN_X-g.offset-g.imageDist[0], System.SCREEN_Y-g.offset+g.imageSize/4+g.imageDist[1], "Loading...", false, Osd.COLOR_DEFAULT, TextLabel.SIZE_XL);
			g.label.getObject().css("display", "none");
			g.label.getObject().fadeIn(g.animTime);
		},
		
		runAnim: function(inv)
		{
			for(var j=0; j<g.images.length; j++)
			{
				var sx, sy;
				var itr = 0;
				
				if((j+1)%2)
				{
					if(!inv) sx = "+";
					else sx = "-";
				}
				else
				{
					if(!inv) sx = "-";
					else sx = "+";
				}
			
				if(j>1)
				{
					if(!inv) sy = "+";
					else sy = "-";
				}
				else
				{
					if(!inv) sy = "-";
					else sy = "+";
				}
				
				g.images[j].getObject().animate(
				{
					"margin-left": sx + "=" + g.imageDist[0] + "px",
					"margin-top": sy + "=" + g.imageDist[0] + "px",
					"opacity": inv ? 1:0
				},
				{
					duration: g.animTime,
					easing: "easeInOutExpo",
					complete: function()
					{
						itr++;
						if(itr == g.images.length)
						{
							g.invAnim = !g.invAnim;
							g.runAnim(g.invAnim);
						}
					}
				});
			}
		},
		
		show: function()
		{
			g.build();
			g.runAnim(g.invAnim);
		},
		
		hide: function()
		{
			g.vignette.finalize();
			g.label.finalize();
			
			for(var i=0; i<g.images.length; i++) g.images[i].finalize();
		}
	});
	
	return g;
}