/* ================================================================
   HAPPY BIRTHDAY — interaction script
   One button on screen at a time. Click it, it disappears, the
   effect plays, and the next button appears 5 seconds later.
   ================================================================ */
(function () {
	'use strict';

	var STEP_DELAY = 5000; // ms to wait after a click before the next button appears

	function whenReady(fn) {
		if (document.readyState === 'complete' || document.readyState === 'interactive') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	whenReady(function () {
		var loader = document.getElementById('loader');
		var stage = document.getElementById('stage');
		var song = document.getElementById('song');
		var toast = document.getElementById('toast');

		var order = ['turn_on', 'play', 'bannar_coming', 'balloons_flying', 'cake_fadein', 'light_candle', 'wish_message', 'story'];

		var buttons = {};
		order.forEach(function (id) { buttons[id] = document.getElementById(id); });

		/* ---------- helpers ---------- */
		function reveal(id) {
			var btn = buttons[id];
			if (!btn) return;
			btn.classList.add('visible');
		}

		function hide(btn) {
			btn.classList.remove('visible');
			btn.disabled = true;
		}

		function goToNext(currentId) {
			var idx = order.indexOf(currentId);
			var nextId = order[idx + 1];
			if (!nextId) return;
			window.setTimeout(function () {
				reveal(nextId);
			}, STEP_DELAY);
		}

		function showToast(text, ms) {
			if (!toast) return;
			toast.textContent = text;
			toast.classList.add('visible');
			window.setTimeout(function () {
				toast.classList.remove('visible');
			}, ms || 2200);
		}

		function heartBurst(count) {
			for (var i = 0; i < count; i++) {
				(function () {
					var el = document.createElement('div');
					el.textContent = Math.random() > 0.5 ? '❤' : '✨';
					el.style.position = 'fixed';
					el.style.left = (20 + Math.random() * 60) + 'vw';
					el.style.bottom = '10vh';
					el.style.fontSize = (14 + Math.random() * 18) + 'px';
					el.style.zIndex = '80';
					el.style.pointerEvents = 'none';
					el.style.color = Math.random() > 0.5 ? '#f3bf5b' : '#e2617f';
					document.body.appendChild(el);

					var rise = 220 + Math.random() * 220;
					var drift = (Math.random() - 0.5) * 160;
					var duration = 1800 + Math.random() * 1200;

					if (el.animate) {
						el.animate(
							[
								{ transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
								{ transform: 'translate(' + drift + 'px,-' + rise + 'px) rotate(' + (drift > 0 ? 25 : -25) + 'deg)', opacity: 0 }
							],
							{ duration: duration, easing: 'cubic-bezier(.22,.61,.36,1)' }
						).onfinish = function () { el.remove(); };
					} else {
						window.setTimeout(function () { el.remove(); }, duration);
					}
				})();
			}
		}

		/* ---------- boot ---------- */
		function boot() {
			window.setTimeout(function () {
				if (loader) loader.classList.add('hidden');
				if (stage) stage.classList.add('ready');
				reveal('turn_on');
			}, 650);
		}
		if (document.readyState === 'complete') {
			boot();
		} else {
			window.addEventListener('load', boot);
		}

		/* ---------- Step 1: lights ---------- */
		if (buttons.turn_on) {
			buttons.turn_on.addEventListener('click', function () {
				hide(buttons.turn_on);
				var bulbs = document.querySelectorAll('.bulb');
				bulbs.forEach(function (bulb, i) {
					window.setTimeout(function () {
						bulb.classList.add('lit');
					}, i * 180);
				});
				// bring the photo in with a swipe once every bulb has lit up
				window.setTimeout(function () {
					var album = document.getElementById('album');
					if (album) album.classList.add('in');
				}, bulbs.length * 180 + 200);
				goToNext('turn_on');
			});
		}

		/* ---------- Step 2: song ---------- */
		if (buttons.play) {
			buttons.play.addEventListener('click', function () {
				hide(buttons.play);
				var attempt = song.play();
				if (attempt && attempt.catch) {
					attempt.catch(function () {
						showToast('Tap to allow audio — your browser is being shy 🎵');
					});
				}
				goToNext('play');
			});
		}

		/* ---------- Step 3: banner ---------- */
		if (buttons.bannar_coming) {
			buttons.bannar_coming.addEventListener('click', function () {
				hide(buttons.bannar_coming);
				document.getElementById('banner').classList.add('come');
				goToNext('bannar_coming');
			});
		}

		/* ---------- Step 4: balloons ---------- */
		if (buttons.balloons_flying) {
			buttons.balloons_flying.addEventListener('click', function () {
				hide(buttons.balloons_flying);
				var field = document.getElementById('balloonField');
				field.classList.add('flying');
				field.style.transition = 'opacity 1.4s ease';
				window.setTimeout(function () {
					field.style.opacity = '0.4';
				}, 4200);
				goToNext('balloons_flying');
			});
		}

		/* ---------- Step 5: cake ---------- */
		if (buttons.cake_fadein) {
			buttons.cake_fadein.addEventListener('click', function () {
				hide(buttons.cake_fadein);
				var cake = document.getElementById('cake');
				cake.classList.add('in');
				cake.scrollIntoView({ behavior: 'smooth', block: 'center' });
				goToNext('cake_fadein');
			});
		}

		/* ---------- Step 6: candles ---------- */
		if (buttons.light_candle) {
			buttons.light_candle.addEventListener('click', function () {
				hide(buttons.light_candle);
				var cake = document.getElementById('cake');
				cake.classList.add('lit');
				var candles = document.querySelectorAll('#candles .candle');
				candles.forEach(function (candle, i) {
					window.setTimeout(function () {
						candle.classList.add('lit');
					}, i * 220);
				});
				window.setTimeout(function () {
					document.getElementById('cakeMessage').classList.add('show');
				}, candles.length * 220 + 200);
				goToNext('light_candle');
			});
		}

		/* ---------- Step 7: the wish ---------- */
		if (buttons.wish_message) {
			buttons.wish_message.addEventListener('click', function () {
				hide(buttons.wish_message);
				showToast('Happy Birthday! 🎉');
				heartBurst(14);
				goToNext('wish_message');
			});
		}

		/* ---------- Step 8: the letter ---------- */
		if (buttons.story) {
			buttons.story.addEventListener('click', function () {
				hide(buttons.story);
				var letter = document.getElementById('letter');
				letter.classList.add('show');
				letter.scrollIntoView({ behavior: 'smooth', block: 'center' });

				var lines = letter.querySelectorAll('p');
				var idx = 0;

				function showLine() {
					lines.forEach(function (p) { p.classList.remove('current'); });
					lines[idx].classList.add('current');

					var isLast = idx === lines.length - 1;
					if (isLast) {
						heartBurst(20);
						return;
					}
					var text = lines[idx].textContent || '';
					var dwell = Math.max(2200, Math.min(4500, text.length * 95));
					window.setTimeout(function () {
						idx++;
						showLine();
					}, dwell);
				}

				showLine();
				// no goToNext here — this is the last step
			});
		}
	});
})();