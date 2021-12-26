//rotate XY point around pivot
Math.rotate = function(input, pivot, rad)
{
	if(!pivot) pivot = [0, 0];
	input[0] -= pivot[0];
	input[1] -= pivot[1];
	
	var x = input[0]*Math.cos(-rad) - input[1]*Math.sin(-rad);
	var y = input[0]*Math.sin(-rad) + input[1]*Math.cos(-rad);
	
	return [pivot[0] + x, pivot[1] + y];
}