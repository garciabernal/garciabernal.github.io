(function () {
	"use strict";

	var storageKey = "theme-preference";
	var root = document.documentElement;
	var currentTheme = null;

	function getStoredTheme() {
		try {
			var stored = window.localStorage.getItem(storageKey);
			if (stored === "light" || stored === "dark") {
				return stored;
			}
		} catch (error) {
			// Ignore storage failures and fall back to system preference.
		}

		return null;
	}

	function getSystemTheme() {
		return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	function getInitialTheme() {
		return getStoredTheme() || getSystemTheme();
	}

	function syncThemeToggle() {
		var toggle = document.getElementById("theme-toggle");

		if (!toggle) {
			return;
		}

		var icon = toggle.querySelector(".icon");
		var isDark = currentTheme === "dark";
		var label = isDark ? "Switch to light mode" : "Switch to dark mode";

		toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
		toggle.setAttribute("aria-label", label);
		toggle.setAttribute("title", label);

		if (icon) {
			icon.className = isDark ? "icon solid fa-sun" : "icon solid fa-moon";
		}
	}

	function applyTheme(theme, persist) {
		var nextTheme = theme === "dark" ? "dark" : "light";

		currentTheme = nextTheme;
		root.setAttribute("data-theme", nextTheme);
		root.style.colorScheme = nextTheme;

		if (persist) {
			try {
				window.localStorage.setItem(storageKey, nextTheme);
			} catch (error) {
				// Ignore storage failures and keep the live theme only.
			}
		}

		syncThemeToggle();
	}

	function toggleTheme() {
		applyTheme(currentTheme === "dark" ? "light" : "dark", true);
	}

	function handleClick(event) {
		var target = event.target;
		var toggle = target && target.closest ? target.closest("#theme-toggle") : null;

		if (!toggle) {
			return;
		}

		event.preventDefault();
		toggleTheme();
	}

	applyTheme(getInitialTheme(), false);

	document.addEventListener("click", handleClick, true);
	document.addEventListener("DOMContentLoaded", function () {
		syncThemeToggle();
	});

	if (window.matchMedia) {
		var media = window.matchMedia("(prefers-color-scheme: dark)");
		var handleSystemChange = function () {
			if (!getStoredTheme()) {
				applyTheme(getSystemTheme(), false);
			}
		};

		if (media.addEventListener) {
			media.addEventListener("change", handleSystemChange);
		} else if (media.addListener) {
			media.addListener(handleSystemChange);
		}
	}

	window.syncThemeToggle = syncThemeToggle;
	window.applyThemePreference = applyTheme;
})();