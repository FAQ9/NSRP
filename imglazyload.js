;(function( $, win ){

	'use strict';

	var throttle = function( fn, delay ){

		if( !delay ){

			return fn;

		}

		var timer;

		return function(){

			clearTimeout( timer );

			timer = setTimeout(function(){

				fn();

			}, delay );

		}

	};

	$.fn.imgLazyLoad = function( options ){

		var elements = this,
			settings = $.extend({

				container: win,
				effect: 'fadeIn',
				speed: 600,
				delay: 400,
				callback: function(){}

			}, options ),

			container = $( settings.container ),

			loading = function(){

				//当所有的图片都加载完，移除滚动事件
				if( !elements.length ){

					return container.off( 'scroll.lazyLoad' );

				}

				var containerHeight = container.outerHeight(),
					containerTop = container.scrollTop();

				if( settings.container !== win ){

					containerTop = container.offset().top;

				}

				elements.each(function(){

					var $this = $( this ),
						top = $this.offset().top;
					
					if( containerTop + containerHeight > top &&
						top + $this.outerHeight() > containerTop ){

						//删除jQuery选择好的元素集合中已经被加载的图片元素
						elements = elements.not( $this );
						
						var loadingSrc = $this.attr( 'data-src' );
						
						$( new Image() ).prop( 'src', loadingSrc ).load(function(){

							//替换图片路径并执行特效
							$this.hide()
								.attr( 'src', loadingSrc )
								[ settings.effect ]( settings.speed, function(){

									settings.callback.call( this );

								})
								.removeAttr( 'data-src' );

						});

					}

				});
			};

		if( !container.length ){

			throw settings.container + ' is not defined';

		}

		//开始便加载已经出现在可视区的图片
		loading();

		//滚动监听，显示图片
		container.on( 'scroll.imgLazyLoad', throttle( loading, settings.delay ) );

		return this;
	};
	
})( jQuery, window );
			$('.container img').imgLazyLoad({
				// jquery selector or JS object
				container: window,
				// jQuery animations: fadeIn, show, slideDown
				effect: 'fadeIn',
				// animation speed
				speed: 600,
				// animation delay
				delay: 400,
				// callback function
				callback: function(){}
			});
