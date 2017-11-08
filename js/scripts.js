/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, subMenus, i, len;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			button.innerHTML = 'Menu';
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			button.innerHTML = 'Close';
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );
	subMenus = menu.getElementsByTagName( 'ul' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( event ) {
				var menuItem = this.parentNode, i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					event.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i] ) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );

	/**
	 * Hides comment list and adds button to reveal
	 */
	var commentList = document.getElementById('comment-list');

	if ( commentList ) {
		// Add hidden class to comment list
		commentList.classList.toggle('comments-hidden');

		// Create toggle button
		var commentToggle = document.createElement('button');
		commentToggle.className = 'comment-toggle';
		var toggleText = 'Show Comments';
		commentToggle.innerHTML = toggleText;

		// Insert button immediately before comment list
		commentList.insertBefore(commentToggle, commentList.firstChild);

		// Use button to toggle class 'hidden' on parent element
		commentToggle.onclick = function() {
			commentList.classList.toggle('comments-hidden');
			if(this.innerHTML == toggleText) {
				commentToggle.innerHTML = "Hide Comments";
			}
			else {
				commentToggle.innerHTML = toggleText;
			};
		};
	}

	function whichTransitionEvent() {
		var t,
		el = document.createElement("fakeelement");

		var transitions = {
			"transition": "transitionend",
			"OTransition": "oTransitionEnd",
			"MozTransition": "transitionend",
			"WebkitTransition": "webkitTransitionEnd"
		}

		for (t in transitions){
			if (el.style[t] !== undefined){
				return transitions[t];
			}
		}
	}

	var searchToggle = document.getElementsByClassName('search-toggle'),
		searchOverlay = document.getElementsByClassName('search-overlay'),
		searchForm = document.getElementsByClassName('search-form'),
		searchField = document.getElementsByClassName('search-field'),
		transitionEvent = whichTransitionEvent();

	if ( searchToggle ) {
		// Use button to toggle class 'toggled' on search overlay element
		searchToggle[0].onclick = function() {
			searchOverlay[0].classList.toggle('toggled');
			searchField[0].value = '';
			searchOverlay[0].addEventListener(transitionEvent, focusFunction);
		};

		function focusFunction(event) {
			searchOverlay[0].removeEventListener(transitionEvent, focusFunction);
			searchField[0].focus();
		}

		searchOverlay[0].onclick = function() {
			searchOverlay[0].classList.toggle('toggled');
		}

		searchForm[0].onclick = function(event) {
			event.stopPropagation();
		}

		document.onkeydown = function(event) {
			event = event || window.event;
			var isEscape = false;

			if ("key" in event) {
				isEscape = (event.key == "Escape" || event.key == "Esc");
			} else {
				isEscape = (event.keyCode == 27);
			}

			if (isEscape) {
				searchOverlay[0].classList.remove('toggled');
			}
		};
	}
} )();
