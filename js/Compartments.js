/** __Compartments__ - a static closure for mapping between RSA compartment names and user-friendly compartment names. It also entails short descriptions as shown in (for instance) the autosuggest search window.
 * 
 * @author Christian Lagerkvist [christian.lagerkvist@seb.se]
 */

/** @constant */
var Compartments = function() {
	var compartments = [{
		name: "[Account & Liquidity]",
		short: "Accounts",
		compartment: "Account & Liquidity System",
		description: "compartment"
	}, {
		name: "[Business Intelligence]",
		short: "BI",
		compartment: "Business Intelligence",
		description: "compartment"
	}, {
		name: "[Core]",
		short: "Core",
		compartment: "Core Systems",
		description: "compartment"
	}, {
		name: "[Financing & Loans]",
		short: "Loans",
		compartment: "Financing&Loans Systems",
		description: "compartment"
	}, {
		name: "[Front]",
		short: "Front",
		compartment: "Front System",
		description: "compartment"
	}, {
		name: "[Fund & Portfolio Management]",
		short: "F&Pm",
		compartment: "Fund & Portfolio Management",
		description: "compartment"
	}, {
		name: "[Unassigned]",
		short: "?",
		compartment: "Other SEB Systems",
		description: "compartment"
	}, {
		name: "[Payments]",
		short: "Payments",
		compartment: "Payment Systems",
		description: "compartment"
	}, {
		name: "[Processing Support]",
		short: "ProcSup",
		compartment: "Processing Support Systems",
		description: "compartment"
	}, {
		name: "[Securities]",
		short: "Securities",
		compartment: "Securities Systems",
		description: "compartment"
	}, {
		name: "[Trading]",
		short: "Trading",
		compartment: "Trading Systems",
		description: "compartment"
	}, {
		name: "[External]",
		short: "External",
		compartment: "ExternalSystems",
		description: "compartment"
	}, {
		name: "[Finance Systems]",
		short: "F&R",
		compartment: "[Finance Systems]",
		description: "compartment"
	}, {
		name: "[Finance & Risk]",
		short: "F&R",
		compartment: "Finance&Risk Systems",
		description: "compartment"
	}, {
		name: "[Finance & Risk]",
		short: "F&R",
		compartment: "Finance Systems",
		description: "compartment"
	}, {
		name: "[Finance & Risk]",
		short: "F&R",
		compartment: "Risk Systems",
		description: "compartment"
	}, {
		name: "[Finance & Risk]",
		short: "F&R",
		compartment: "Compliance Systems",
		description: "compartment"
	}, {
		name: "[SEB Kort]",
		short: "Kort",
		compartment: "Cards",
		description: "compartment"
	}, {
		name: "[Group Staff]",
		short: "Group Staff",
		compartment: "Group Staff Systems",
		description: "compartment"
	}, {
		name: "[TryggLiv]",
		short: "TL",
		compartment: "Life insurance",
		description: "compartment"
	}];
	return {
		all: compartments,
		/** Converts RSA name to short version */
		RSA2short: function(RSA) {
			var ret = undefined;
			compartments.forEach(function(c) {
				if (RSA == c.compartment) ret = c.short;
			});
			return ret;
		},
		/** Returns array of RSA compartment names */
		RSA: function() {
			var a = [];
			compartments.forEach(function(c) {
				a.push(c.compartment);
			});
			return a;
		},
		/** Convert popular name to RSA name */
		name2RSA: function(name) {
			var match = false;
			var i = 0;
			while (!match && i < compartments.length) {
				if (name == compartments[i].name) match = compartments[i].compartment;
				i++;
			}
			return match;
		},
		/** Converts RSA name to popular name */
		RSA2name: function(RSA) {
			var ret = undefined;
			compartments.forEach(function(c) {
				if (RSA == c.compartment) ret = c.name;
			});
			return ret;
		}

	};
}();
