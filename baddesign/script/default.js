function checkHash(hash) {
	var result = false;
	$('div > nav  a').each(function(index) {
		if ($(this).attr('href') == hash)
			result = true;
	});

	return result;
}

function gotoTop(){
	var top = $('div > nav a:first').offset().top;
	$('html,body').animate({scrollTop: (top)}, 'normal');
}


function swap() {
	
	if (window.location.hash && checkHash(window.location.hash)) {

		var cls = 'active';

		$('div > section').find('article').each(function(index) {//opera no article

			if ($(this).hasClass(cls))
				$(this).removeClass(cls);

			if ('#' + ($(this).attr('id')) == window.location.hash + 'b')
				$(this).addClass(cls);
		});
		
		$('nav').find('a').each(function(index) {//opera no nav

			if ($(this).hasClass(cls))
				$(this).removeClass(cls);

			if ($(this).attr("href") == window.location.hash)
				$(this).addClass(cls);
		});
		
		gotoTop();	
	}
}

/*
function fixID(){
	$('div > section').find('article').each(function(index){
		if(this.id > 13)
			$(this).removeClass('active');
		this.id = this.id + 'b';
	});
}*/


$(document).ready(function() {
	
	// fixID();
	
	$(window).bind('hashchange', function(event) {
		swap();
	});
	
	$('nav a').bind('click',function(event){
		if(window.location.hash ==  $(this).attr('href'))
			gotoTop();
	});
	
	swap();
});
