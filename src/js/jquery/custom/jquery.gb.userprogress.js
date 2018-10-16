// Plugin based on jQuery Boilerplate https://jqueryboilerplate.com/
// Plugin requires Handlebar.js to be loaded http://handlebarsjs.com/
;( function( $, window, document, undefined ) {

	'use strict';

		// Create the defaults once
		var pluginName = 'userProgress',
			defaults = {
				pollerMillis: 10000,
        progressUrl: '',
				text: {
					todaysGoal: 'Dagens mål'
				}
			};

		// The actual plugin constructor
		function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
      this.userProgress = 0;
      this.userGoal = 0;
      this.userPercentage = 0;
      this.progressSimpleElement = null;
      this.progressDetailsElement = null;
      this.loadMask = null;
			this._defaults = defaults;
			this._name = pluginName;

			this.templateSimple = '';
			this.templateDetails = '';

			this.init();
		}

		// Avoid Plugin.prototype conflicts
		$.extend(Plugin.prototype, {

      init: function() {
        var instance = this;

				instance.initTemplates();
        instance.initUI();
        instance.getProgress();
			},

      getProgress: function() {

        var instance = this;

        $(instance.loadMask).show();

        $.getJSON(instance.settings.progressUrl)
          .done(function(data) {
            var dataUserProgress = parseInt(data.progress);
            var dataUserGoal = parseInt(data.goal);

            var userProgress = dataUserProgress/100;
            var userGoal = dataUserGoal/100;

            var userPercentage = Math.round(userProgress/userGoal*100);

            instance.userProgress = userProgress;
            instance.userGoal = userGoal;
            instance.userPercentage = userPercentage;

            $(instance.progressSimpleElement).html(
							instance.templateSimple({
								userPercentage: instance.userPercentage
							})
						);

						$(instance.progressDetailsElement).html(
							instance.templateDetails({
								labelTodaysGoal: instance.settings.text.todaysGoal,
								userPercentage: instance.userPercentage,
								userProgress: instance.userProgress.toLocaleString('sv'),
								userGoal: instance.userGoal.toLocaleString('sv')
							})
						);

            if(userPercentage >= 100) {
              $(instance.element).addClass('complete');
            } else {
              $(instance.element).removeClass('complete');
            }

            $(instance.loadMask).hide();

						instance.setPollerTimeout();

          })
          .fail(function(data) {
            console.log('Fail');
						instance.setPollerTimeout();
          });

      },

			initTemplates: function() {
				var instance = this;

				var templateSimple = '{{userPercentage}} %';

				// var templateDetails = '<div class="">{{labelTodaysGoal}}</div>';
				// templateDetails += '<div class="progress-bar"><div class="progress-bar-inner" style="width: {{userPercentage}}%"></div></div>';
				// templateDetails += '<div class="progress-info">{{userProgress}} av {{userGoal}} ({{userPercentage}}%)</div>';
				var templateDetails = '<div class="">{{labelTodaysGoal}}: <span class="progress-info">{{userProgress}} av {{userGoal}} ({{userPercentage}}%)</span></div>';
				templateDetails += '<div class="progress-bar"><div class="progress-bar-inner" style="width: {{userPercentage}}%"></div></div>';
				//templateDetails += '<div class="progress-info">{{userProgress}} av {{userGoal}} ({{userPercentage}}%)</div>';


				instance.templateSimple = Handlebars.compile(templateSimple);
				instance.templateDetails = Handlebars.compile(templateDetails);
			},

      initUI: function() {
        var instance = this;

        var html = '<div class="user-progress-simple"></div>';
        html += '<div class="user-progress-details"></div>';
        html += '<div class="user-progress-loading-mask" style="display: none"></div>';

        $(instance.element).html(html);

        var progressSimpleElements = $(instance.element).find('.user-progress-simple');
        var progressSimpleElement = $(progressSimpleElements[0]);

        var progressDetailsElements = $(instance.element).find('.user-progress-details');
        var progressDetailsElement = $(progressDetailsElements[0]);

        var loadMaskElements = $(instance.element).find('.user-progress-loading-mask');
        var loadMask = $(loadMaskElements[0]);

        instance.progressSimpleElement = progressSimpleElement;
        instance.progressDetailsElement = progressDetailsElement;
        instance.loadMask = loadMask;
      },

			setPollerTimeout: function() {
				var instance = this;

				setTimeout(function(){
					instance.getProgress();
				}, instance.settings.pollerMillis);
			},

			someFunction: function() {
        var instance = this;
        console.log('userProgress someFunction');
			}

		});

		// A really lightweight plugin wrapper around the constructor,
		// preventing against multiple instantiations
		$.fn[ pluginName ] = function( options ) {
			return this.each( function() {
				if ( !$.data( this, 'plugin_' + pluginName ) ) {
					$.data( this, 'plugin_' +
						pluginName, new Plugin( this, options ) );
				}
			} );
		};

} )( jQuery, window, document );
