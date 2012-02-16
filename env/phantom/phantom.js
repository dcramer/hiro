/*global hiro:false, console:false */

(function () {
	"use strict";

	if (!window.haunted)
		return;


	// Wraps a Hiro listener and sends its return value
	// to the console for PhantomJS to receive.

	function bind(name, callback) {
		callback = callback || function () { return {}; };

		hiro.bind(name, function () {
			console.log(JSON.stringify({
				eventName: name,
				data: callback.apply({}, arguments)
			}));
		});
	}


	// Hiro events

	bind('hiro.onStart');
	bind('hiro.onComplete');


	// Suite specific events

	bind('suite.onStart', function (suite) {
		return { name: suite.name };
	});

	bind('suite.onComplete', function (suite, success) {
		return { name: suite.name, success: success };
	});

	bind('suite.onTimeout', function (suite) {
		return { name: suite.name };
	});


	// Test specific events

	bind('test.onStart', function (test) {
		return { name: test.toString() };
	});

	bind('test.onComplete', function (test, success) {
		if (!success)
			return; // test.onFailure will handle this case

		return {
			name:    test.toString(),
			success: true,
			timeout: false
		};
	});

	bind('test.onFailure', function (test, report) {
		return {
			name:      test.toString(),
			success:   false,
			timeout:   false,
			assertion: report.assertion,
			expected:  report.expected,
			result:    report.result,
			source:    report.source
		};
	});

	bind('test.onTimeout', function (test) {
		return {
			name:    test.toString(),
			success: false,
			timeout: true
		};
	});
}());

/* vim: set ts=2 sw=2 noexpandtab: */
