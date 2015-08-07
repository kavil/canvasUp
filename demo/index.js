(function(K){

	$('input#up-img').change(function(event) {
		if ($('#upul li').length>6) {
			K.alert('最多上传6张');
			$('input#up-img').val('');
			return;
		};
		$('body').css('overflow', 'hidden');
		var file=this.files[0];
		var reader = new FileReader();
		reader.onload = function() {
			// 通过 reader.result 来访问生成的 DataURL
			var url = reader.result;
			$('body').append('<div class="canvasup" id="upimg"><img src="'+url+'" class="canvas_img"><div class="canvas_bg"></div><canvas class="canvas"></canvas><div class="canvas_div"></div><div class="canvas_btn"><a href="#" class="canvas_cancel">取消</a><a href="#" class="canvas_ok">完成</a></div></div>')			
			document.querySelector('#upimg .canvas_img').onload = function(){			
				var mycan = canvasUp("#upimg",240,240,function (out) {//调用裁图js 选择器、宽、高、callback
					$('#upimg').unbind();
					$('#upimg').on('click', '.canvas_ok', function(event) {
						event.preventDefault();
						var outimg = out();
						$('#upul').append('<li><img src="'+outimg+'" alt=""><a href="###" class="del"></a></li>');
						$('body').css('overflow', 'auto');
						$('.canvasup').remove();
						$('input#up-img').val('');
					});
				});
			};
		};
		reader.readAsDataURL(file);
	});
	$('body').on('click', '.canvas_cancel', function(event) {
		event.preventDefault();
		$('input[type=file]').val('');
		$('.canvasup').remove();
	});
})(window.K)
