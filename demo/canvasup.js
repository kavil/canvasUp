function canvasUp(select, cwidth, cheight, out) {
	//获取手机屏幕宽高
	var c_w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var c_h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	var can_obj = document.querySelector(select+" .canvas");
	var img_obj = document.querySelector(select+" .canvas_img");
	var div_obj = document.querySelector(select+" .canvas_div");

	var posX = 0,
		posY = 0; //相对坐标
	var scale = 0; //记录在缩放动作执行前的 缩放值
	var start_X1 = 0,
		start_Y1 = 0,
		start_X2 = 0,
		start_Y2 = 0;
	var start_sqrt = 0; //开始缩放比例
	var sqrt = 1;
	var left_x = 0,
		left_y = 0; //计算 偏移量 设置画布中的X，Y轴 (加偏移量)
	//load();
	(function load() {
		//设置canvas 宽度（全屏显示），高度,上下居中显示
		can_obj.width = cwidth || 250;
		can_obj.height = cheight || 200;
		can_obj.style.top = (c_h - can_obj.height - 2) / 2 + "px";
		can_obj.style.left = (c_w - can_obj.width - 2) / 2 + "px";

		//设置图片自适应大小及图片的居中显示
		autoResizeImage(c_w, c_h, img_obj);
		img_obj.style.top = (c_h - img_obj.height - 2) / 2 + "px";
		img_obj.style.left = (c_w - img_obj.width) / 2 + "px";

		div_obj.addEventListener('touchstart', touch, false);
		div_obj.addEventListener('touchmove', touch, false);

		var ctx_img = can_obj.getContext("2d");
		var ctx_X = (can_obj.width - img_obj.width) / 2,
			ctx_Y = (can_obj.height - img_obj.height) / 2;
		ctx_img.drawImage(img_obj, ctx_X, ctx_Y, img_obj.width, img_obj.height); //初始化 canvas 加入图片

		function touch(event) {
			var event = event || window.event;
			event.preventDefault(); //阻止浏览器或body 其他冒泡事件
			var mv_x1 = event.touches[0].clientX,
				mv_y1 = event.touches[0].clientY; //手指坐标
			var img_left = img_obj.left,
				img_top = img_obj.top; //图片坐标
			if (event.touches.length == 1) { //单指操作
				if (event.type == "touchstart") { //开始移动
					posX = mv_x1 - img_obj.offsetLeft; //获取img相对坐标
					posY = mv_y1 - img_obj.offsetTop;
				} else if (event.type == "touchmove") { //移动中
					var _x = mv_x1 - posX; //移动坐标
					var _y = mv_y1 - posY;
					img_obj.style.left = _x + "px";
					img_obj.style.top = _y + "px";
					ctx_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
					ctx_img.drawImage(img_obj, _x - parseFloat(can_obj.style.left) + left_x / 2 - 1, _y - parseFloat(can_obj.style.top) + left_y / 2 - 1, img_obj.width * sqrt, img_obj.height * sqrt); //画布内图片移动
				};
			} else if (event.touches.length == 2) { //双指操作
				if (event.type == "touchstart") {
					scale = img_obj.style.Transform == undefined ? 1 : parseFloat(img_obj.style.Transform.replace(/[^0-9^\.]/g, "")); //获取在手指按下瞬间的放大缩小值（scale），作用，在移动时，记录上次移动的放大缩小值
					start_X1 = event.touches[0].clientX; //记录开始的坐标值,作用：在下次放大缩小后，去掉上次放大或缩小的值
					start_Y1 = event.touches[0].clientY;
					start_X2 = event.touches[1].clientX;
					start_Y2 = event.touches[1].clientY;
					start_sqrt = Math.sqrt((start_X2 - start_X1) * (start_X2 - start_X1) + (start_Y2 - start_Y1) * (start_Y2 - start_Y1)) / 200; //获取在缩放时 当前缩放的值

				} else if (event.type == "touchmove") {
					var mv_x2 = event.touches[1].clientX,
						mv_y2 = event.touches[1].clientY;
					var move_sqrt = Math.sqrt((mv_x2 - mv_x1) * (mv_x2 - mv_x1) + (mv_y2 - mv_y1) * (mv_y2 - mv_y1)) / 200; //动态获取上一次缩放值(随时变更)，在下次缩放时减去上一次的值，作用：防止累加之前的缩放
					sqrt = move_sqrt - start_sqrt + scale; //求出缩放值

					img_obj.style.webkitTransform = "scale(" + sqrt + ")"; //设置放大缩小
					img_obj.style.Transform = "scale(" + sqrt + ")";
					ctx_img.clearRect(0, 0, can_obj.width, can_obj.height); //清除画布
					var dImg_left = parseFloat(img_obj.style.left.replace("px", "")),
						dImg_top = parseFloat(img_obj.style.top.replace("px", ""));
					var w = img_obj.width,
						h = img_obj.height,
						sw = w * sqrt,
						sh = h * sqrt;
					left_x = w - sw; //计算 偏移量 设置画布中的X，Y轴 (加偏移量) 注：canvas 原点放大（canvas中图片左上角坐标），css3 scale 中点放大
					left_y = h - sh;
					ctx_img.drawImage(img_obj, dImg_left - parseFloat(can_obj.style.left.replace("px", "")) + left_x / 2, dImg_top - parseFloat(can_obj.style.top.replace("px", "")) + left_y / 2, sw, sh); //画布内图片重置
				}
			}
		}
	})();
	//window.addEventListener('load', load, false);
	//图片自适应
	function autoResizeImage(maxWidth, maxHeight, objImg) {
		var img = new Image();
		img.src = objImg.src;
		var hRatio;
		var wRatio;
		var ratio = 1;
		var w = objImg.width;
		var h = objImg.height;
		wRatio = maxWidth / w;
		hRatio = maxHeight / h;
		if (w < maxWidth && h < maxHeight) {
			return;
		}
		if (maxWidth == 0 && maxHeight == 0) {
			ratio = 1;
		} else if (maxWidth == 0) {
			if (hRatio < 1) {
				ratio = hRatio;
			}
		} else if (maxHeight == 0) {
			if (wRatio < 1) {
				ratio = wRatio;
			}
		} else if (wRatio < 1 || hRatio < 1) {
			ratio = (wRatio <= hRatio ? wRatio : hRatio);
		} else {
			ratio = (wRatio <= hRatio ? wRatio : hRatio) - Math.floor(wRatio <= hRatio ? wRatio : hRatio);
		}
		if (ratio < 1) {
			if (ratio < 0.5 && w < maxWidth && h < maxHeight) {
				ratio = 1 - ratio;
			}
			w = w * ratio;
			h = h * ratio;
		}
		objImg.height = h;
		objImg.width = w;
	}


	//裁图
	var save_img = function() {
		var base64 = can_obj.toDataURL('image/png', 1 || 0.8);
		return base64;
	}
	out(save_img);//callback
}