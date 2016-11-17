'use strict';

(function(){

	var skr = skrollr.init(),
		homeTemplate = '',
		aboutTemplate = '',
		contactTemplate = '',
		servicesTemplate = '',
		footerTemplate = '',
		$content = $('#content'),
		dir = '',

		setAppContentSpace = function(){
			var height = $('header.navbar').outerHeight();
			$('.appcontent').css('margin-top',height);
		},

		goToTop = function(){
			window.scrollTo(0,0);
			$('html').scroll(0,0);
			$('body').scroll(0,0);
		},

		handleStretching = function(){
			var i = 0,
				$element;

			if (window.innerWidth < 768){

				var $colsToHide = $('.stretch-on-small'),
					checkItem = function(index, item){
					    if (item.indexOf('col-xs-') > -1 && !$element.hasClass('stretched-on-small')) {

							$element.removeClass(item)
								.addClass('col-xs-12')
								.addClass('stretched-on-small')
								.data('prevCls',item);
					    }
					};

				for (i=0; i < $colsToHide.length; i++){

					$element = $($colsToHide[i]);
					var	classList = $element.attr('class').split(/\s+/);

					$.each(classList, checkItem);
				}
			} else{
				var $colsToRestore = $('.stretched-on-small');

				for (i=0; i < $colsToRestore.length; i++){
					$element = $($colsToRestore[i]);

					var	prevCls = $element.data('prevCls');

					$element.removeClass('col-xs-12')
						.addClass(prevCls)
						.removeClass('stretched-on-small');
				}

			}
		},

		updateContent = function(html){
			
			$content.html(html);
			$content.fadeIn(200);
			handleStretching();
		},

		renderTemplate = function(template, options){
			var html = _.template(template)(options);
			updateContent(html);

			var $footerHolder = $('.footer-holder');
			if ($footerHolder.length > 0){
				$footerHolder.html(_.template(footerTemplate)());
			}

			setAppContentSpace();
		},

		fixHeights = function(){
			var height = window.innerHeight,
				$welcome = $('#welcome'),
				$services = $('#services'),
				$contact = $('#contact');

			if (height < 550){
				$welcome.attr('data-30p','transform:translate(0,28%);');

				$services.attr('data-110p','transform:translate(0,18%);')
						 .attr('data-150p','transform:translate(0,18%);');

				$contact.attr('data-220p','transform:translate(0,16%);');
				
			}else{
				$welcome.attr('data-30p','transform:translate(0,74%);');

				$services.attr('data-110p','transform:translate(0,54%);')
						 .attr('data-150p','transform:translate(0,54%);');

				$contact.attr('data-220p','transform:translate(0,50%);');
			}

			skr.refresh();
		},

		renderHome = function(){
			renderTemplate(homeTemplate);

			skr = skrollr.init();
			fixHeights();

			skr.animateTo(0);
		},

		renderServices = function(){
			$content.hide();

			if (!servicesTemplate){
				$.ajax(dir+'views/services.html', {
					success: function(html){
						servicesTemplate = html;
						renderTemplate(servicesTemplate);
					}
				});
			}else{
				renderTemplate(servicesTemplate);
			}

			goToTop();
			skr.destroy();
		},

		renderAbout = function(){
			$content.hide();

			if (!aboutTemplate){
				$.ajax(dir+'views/about.html', {
					success: function(html){
						aboutTemplate = html;
						renderTemplate(aboutTemplate);
					}
				});
			}else{
				renderTemplate(aboutTemplate);
			}

			goToTop();
			skr.destroy();
		},

		loadMap = function(){
		    var map = new google.maps.Map(document.getElementById('map'),{
					zoom: 12
		        }),
				geo = new google.maps.Geocoder();

	        geo.geocode({address: '2617 Rowland Rd., Suite 114, Raleigh, NC 27615'}, function(results, status){
				if (status === google.maps.GeocoderStatus.OK) {
			        map.setCenter(results[0].geometry.location);
			        
			        new google.maps.Marker({
			            map: map,
			            position: results[0].geometry.location
			        });
				}
	        });
		},

		renderContact = function(){
			$content.hide();

			if (!contactTemplate){
				$.ajax(dir+'views/contact.html', {
					success: function(html){
						contactTemplate = html;
						renderTemplate(contactTemplate);

						loadMap();
					}
				});
			}else{
				renderTemplate(contactTemplate);

				loadMap();
			}

			goToTop();
			skr.destroy();

			
		};

	History.Adapter.bind(window,'statechange',function(){
	    var State = History.getState(),
			hash = State.hash;

	    if (hash.indexOf('about') > -1){
			renderAbout();
			return;
	    }

	    if (hash.indexOf('services') > -1){
			renderServices();
			return;
	    }

	    if (hash.indexOf('contact') > -1){
			renderContact();
			return;
	    }

	    if (hash.indexOf('home') > -1){
			renderHome();
			return;
	    }
	});

	History.pushState(null, null, 'home');

	$.ajax(dir+'views/home.html', {
		success: function(html){
			homeTemplate = html;
			renderTemplate(homeTemplate);
			fixHeights();
			skr.refresh();
		}
	});

	$.ajax(dir+'views/footer.html', {
		success: function(html){
			footerTemplate = html;
		}
	});

	$('body').on('click','#homeServicesLink', function(e){
		skr.animateTo(window.innerHeight*1.4);
		e.preventDefault();
	})
	.on('click','#homeContactLink', function(e){
		skr.animateTo(2000);
		e.preventDefault();
	})
	.on('click','#homeTopLink', function(e){
		skr.animateTo(0);
		e.preventDefault();
	})

	//Click HOME
	.on('click', '.home-link', function(e){
		History.pushState(null, null, 'home');

		renderHome();
		e.preventDefault();
	})

	//Click SERVICES
	.on('click', '.services-link', function(e){
		History.pushState(null, null, 'services');

		renderServices();
		e.preventDefault();
	})

	//Click ABOUT
	.on('click', '.about-link', function(e){
		History.pushState(null, null, 'about');

		renderAbout();
		e.preventDefault();
	})

	//Click CONTACT
	.on('click', '.contact-link', function(e){
		History.pushState(null, null, 'contact');

		renderContact();
		e.preventDefault();
	})

	.on('click','.nav.navbar-nav li', function(){
		var $nav = $('.ha-navbar-collapse');
		if ($nav.hasClass('in')){
			$nav.collapse('hide');
			_.delay(function(){
				setAppContentSpace();
			},350);
			
		}
	});

	window.onresize = function() {
		handleStretching();


		if (History.getState().hash === '' || History.getState().hash === '/home'){
			fixHeights();
		}

		setAppContentSpace();

	};

})();