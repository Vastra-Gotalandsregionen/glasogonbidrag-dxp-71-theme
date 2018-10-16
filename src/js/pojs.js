// Plain javascript that runs before AUI is ready (to prevent content flashing)

window.onload= onWindowLoad;

function onWindowLoad() {
	// Body
	addCssClass(document.body, 'js');

	//bindToggleMyApplicationNav();
	bindNavTrigger();

}

function hasCssClass(elem, className) {
	if(elem) {
		return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
	}
}

function addCssClass(elem, className) {
	if(elem) {
	    if (!hasCssClass(elem, className)) {
	    	elem.className += ' ' + className;
	    }
    }
}

function addCssClassToListItems(list, className) {
	for(i=0; i < list.length; i++) {
		addCssClass(list[i], className);
	}
}

function removeCssClass(elem, className) {
	var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, ' ') + ' ';
	if (hasCssClass(elem, className)) {
		while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
			newClass = newClass.replace(' ' + className + ' ', ' ');
		}
		elem.className = newClass.replace(/^\s+|\s+$/g, '');
	}
}

function removeCssClassToListItems(list, className) {
	for(i=0; i < list.length; i++) {
		removeCssClass(list[i], className);
	}
}


function toggleCssClass(elem, className) {

		if(hasCssClass(elem, className)) {
			removeCssClass(elem, className);
		} else {
			addCssClass(elem, className);
		}

}

function toggleUiHidden(elementId, actionValue) {
	var elem = document.getElementById(elementId);

	if(elem) {
		// 0 is hide, 1 is show
		if(actionValue == 0) {
			addCssClass(elem, 'ui-helper-hidden');
		} else {
			removeCssClass(elem, 'ui-helper-hidden');
		}
	}
}

function toggleHide(elementId, actionValue) {
	var elem = document.getElementById(elementId);

	if(elem) {
		// 0 is hide, 1 is show
		if(actionValue == 0) {
			addCssClass(elem, 'hide');
		} else {
			removeCssClass(elem, 'hide');
		}
	}
}


function bindNavTrigger() {
	var navTrigger = document.getElementById('navTrigger');

	if(navTrigger) {
			navTrigger.onclick = function(e) {

				var navigation = document.getElementById('navigation');
				if(navigation) {
					toggleCssClass(navigation, 'exp');
				}

				return false;
			}
	}
}

function bindToggleMyApplicationNav() {

	var toggleMyAppNavLinks = document.getElementsByClassName('navigation-my-application-trigger');

		for (i = 0; i < toggleMyAppNavLinks.length; i++) {
			toggleMyAppNavLinks[i].onclick = function(e) {
				var navElement = this.parentElement.parentElement;
				toggleCssClass(navElement, 'show-sub-nav');
				return false;
			}
		}
}

function jsfAjaxEventHandler(xhr, portletNamespace) {

	var xhrStatus = xhr.status;
	var portletNode = document.getElementById('p_p_id' + portletNamespace);

	var ajaxMasks = document.getElementsByClassName('gb-ajax-mask');
	var ajaxMask = ajaxMasks[0];

	switch(xhrStatus) {
			case 'begin':
					addCssClass(ajaxMask, 'active');
					break;
			case 'complete':
					removeCssClass(ajaxMask, 'active');
					break;
			case 'success':
					radio('viewPartialReload').broadcast();
					break;
	}


}
