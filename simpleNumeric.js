/*
	* simpleNumeric.js 1.0
	* Copyright (c) 2013 Barýþ Velioðlu, http://barisvelioglu.net
	* simpleNumeric.js is open sourced under the MIT license.
	*/

	jQuery.fn.numeric = function (options) {

		options = jQuery.extend({ fraction: 0, symbol: '', thousandSeperator: '.', decimalSeperator: ',' }, options);

		//Thanks to Vishal Monpara
		function doGetCaretPosition(ctrl) {
			var CaretPos = 0;
			// IE Support
			if (document.selection) {

				ctrl.focus();
				var Sel = document.selection.createRange();

				Sel.moveStart('character', -ctrl.value.length);

				CaretPos = Sel.text.length;
			}
			// Firefox support
			else if (ctrl.selectionStart || ctrl.selectionStart == '0')
				CaretPos = ctrl.selectionStart;

			return (CaretPos);
		}

		//Thanks to Vishal Monpara
		function setCaretPosition(ctrl, pos) {
			if (ctrl.setSelectionRange) {
				ctrl.focus();
				ctrl.setSelectionRange(pos, pos);
			} else if (ctrl.createTextRange) {
				var range = ctrl.createTextRange();
				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		}

		//Thanks to Joss Crowcroft // I modified his code
		//http://www.josscrowcroft.com/2011/code/format-unformat-money-currency-javascript/
		function formatMoney(number) {

			number = convertToFloat(number);

			if (number === 0)
				return "";

			var places = !isNaN(places = Math.abs(options.fraction)) ? places : 2;
			var symbol = options.symbol !== undefined ? options.symbol : "";
			var thousand = options.thousandSeperator || ".";
			var decimal = options.decimalSeperator || ",";
			var negative = number < 0 ? "-" : "";
			var i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "";
			var j = (j = i.length) > 3 ? j % 3 : 0;

			if (symbol === "TL") {
				return negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "") + " " + symbol
			}

			return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
		}
		
		function convertToFloat(value){
			var replacePattern = new RegExp("[\." + options.symbol + "]", "g");

			return value = parseFloat(value.replace(replacePattern, "").replace(",", "."));
		}
		
		function getCutPoint(){
			if(options.symbol == "TL"){
				return parseInt(options.fraction) + 3;
			}
			
			return parseInt(options.fraction);
		}

		function isAcceptableKey(e) {
			var keyValue = String.fromCharCode(getKey(e));

			var acceptableKeys = "0123456789";

			if (acceptableKeys.indexOf(keyValue) !== -1)
				return true;

			if (e.keyCode === null || e.keyCode === 8 || e.keyCode === 0 || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 13 || e.keyCode === 27)
				return true;

			return false;
		}

		function isByPassKey(e) {
			return e.keyCode === null || e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40;
		}

		function getKey(e) {
			if (window.event)
				return window.event.keyCode;

			if (e)
				return e.which;

			return null;
		}

		return this.each(function () {

			$(this).keypress(function (e) {

				if (!isAcceptableKey(e))
					return false;

			}).keyup(function (e) {

				if (isByPassKey(e))
					return false;

				var $that = $(this);

				var oldValue = $that.val();
				var oldValueLength = oldValue.length;

				var currentCaretPosition = doGetCaretPosition($that[0]);

				if (options.fraction > 0 && convertToFloat(oldValue) > 0 && e.keyCode === 8 && oldValue.indexOf(',') === -1) {
					$that.val(oldValue.substring(0, oldValueLength - getCutPoint()) + "," + oldValue.substring(oldValueLength - getCutPoint()));
				}
				else {
					$that.val(formatMoney(oldValue));
				}

				var newValue = $that.val();
				var newValueLength = newValue.length;

				if (oldValueLength + 1 == newValueLength) {
					setCaretPosition($that[0], currentCaretPosition + 1);
				} else if (oldValueLength - 1 == newValueLength) {
					setCaretPosition($that[0], currentCaretPosition - 1);
				} else {
					setCaretPosition($that[0], currentCaretPosition);
				}
			});

		});

	};