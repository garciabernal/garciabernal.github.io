(function () {
	"use strict";

	function getCurrentFileName() {
		var path = window.location.pathname || "";
		// Remove trailing slash
		if (path.length > 1 && path.charAt(path.length - 1) === "/") path = path.slice(0, -1);
		var file = path.split("/").pop();
		return file || "index.html";
	}

	function applyCurrentClass(navRoot) {
		var current = getCurrentFileName();
		var links = navRoot.querySelectorAll("a[href]");
		for (var i = 0; i < links.length; i++) {
			var href = links[i].getAttribute("href");
			if (!href) continue;

			// Match exact filename (ignore any query/hash)
			var normalized = href.split("?")[0].split("#")[0];
			if (normalized === current) {
				var li = links[i].closest("li");
				if (li) li.classList.add("current");
			}
		}
	}

	function loadMainJs() {
		var existing = document.querySelector('script[src="assets/js/main.js"]');
		if (existing) return;
		var script = document.createElement("script");
		script.src = "assets/js/main.js";
		script.defer = false;
		document.body.appendChild(script);
	}

	function ensureNavWrapper(nav) {
		if (!nav) return null;

		// Already wrapped.
		if (nav.closest && nav.closest("#nav-wrapper")) return nav;
		var parent = nav.parentNode;
		var nextSibling = nav.nextSibling;
		if (!parent) return nav;

		var wrapper = document.createElement("div");
		wrapper.id = "nav-wrapper";

		var container = document.createElement("div");
		container.className = "container";

		var row = document.createElement("div");
		row.className = "row";

		var col = document.createElement("div");
		col.className = "col-12";

		col.appendChild(nav);
		row.appendChild(col);
		container.appendChild(row);
		wrapper.appendChild(container);

		// Insert wrapper where the nav used to be.
		parent.insertBefore(wrapper, nextSibling);
		return nav;
	}

	function injectNav(html) {
		var nav = document.getElementById("nav");
		if (!nav) {
			loadMainJs();
			return;
		}
		nav.innerHTML = html;
		applyCurrentClass(nav);
		if (typeof window.syncThemeToggle === "function") {
			window.syncThemeToggle();
		}
		loadMainJs();
	}

	document.addEventListener("DOMContentLoaded", function () {
		var nav = document.getElementById("nav");
		if (!nav) {
			loadMainJs();
			return;
		}

		ensureNavWrapper(nav);

		fetch("partials/nav.html", { cache: "no-cache" })
			.then(function (r) {
				if (!r.ok) throw new Error("Failed to load nav: " + r.status);
				return r.text();
			})
			.then(injectNav)
			.catch(function () {
				// Fallback so the site still works even if fetch fails.
				injectNav(
					'<span class="nav-logo">' +
						'<img src="images/scpo_emblema.png" alt="University logo" />' +
					'</span>' +
					'<ul>' +
						'<li class="brand"><span>Gustavo <span class="versalitas">García Bernal</span></span></li>' +
						'<li class="divider">|</li>' +
						'<li><a href="index.html">Home</a></li>' +
						'<li><a href="research.html">Research</a></li>' +
						'<li><a href="julia.html">Julia</a></li>' +
						'<li><a href="cv.html">CV</a></li>' +
						'<li><a href="about.html">About</a></li>' +
						'<li class="nav-theme"><button id="theme-toggle" class="theme-toggle" type="button" aria-pressed="false" aria-label="Switch to dark mode" title="Switch to dark mode"><span class="icon solid fa-moon" aria-hidden="true"></span></button></li>' +
					'</ul>'
				);
			});
	});
})();
