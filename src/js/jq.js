(function( $ ) {
  $(function() {
    //do stuff with $ here


    if(typeof gbJs == 'undefined') {
      gbJs = {};
    }

    var KEY_ENTER = '13';
    var KEY_ARROW_LEFT = '37';
    var KEY_ARROW_UP = '38';
    var KEY_ARROW_RIGHT = '39';
    var KEY_ARROW_DOWN = '40';

    gbJs.registeredHotkeys = {};
    gbJs.debugMode = true;
    //gbJs.debugMode = false;

    // Run init
    init();

    // Public methods

    // Run only once
    function init() {
      _initLoginPage();
      _initMainMenu();
      _initUserGoal();
      _initToggleDockbar();
      _registerViewPartialReloadListener();

      refreshUI();




      //$('body').userGoal();
    }

    // Run when data is loaded
    // i.e. when event 'viewReloaded' topic us broadcast on radio
    function refreshUI() {
      //_focusOnLoad();
      _initBoxCollapsible();
      _initChipCollapsible();
      _initHotkeys();
      _initInputMask();
      _initPrescriptionCheckbox();
      _initSelectReplace();
      _initSelectInputContent();
      _initTriggerOnEnter();
    }

    // Private methods

    function _escapeIdForJsf(id) {
      return id.replace(/:/g,"\\:").replace(/\./g,"\\.");
    }

    function _focusOnLoad() {

      var focusCandidates = $('[data-focus="true"]');

      if(focusCandidates.size() > 0) {
        focusElement = $(focusCandidates[0]);

        if(focusElement.is('form')) {
          focusElement.find(':input:not(:hidden)').get(0).focus();
        } else {
          focusElement.focus();
        }

      }
    }

    function _focusNode(parentNode) {

      var focusCandidates = $(parentNode).find('[autofocus="true"]');

      if(focusCandidates.size() > 0) {
        focusElement = $(focusCandidates[0]);
        focusElement.focus();
      }
    }


    function _focusNodeOld(parentNode) {

      var focusCandidates = $(parentNode).find('[data-focus="true"]');

      if(focusCandidates.size() > 0) {
        focusElement = $(focusCandidates[0]);

        if(focusElement.is('form')) {
          focusElement.find(':input:not(:hidden)').get(0).focus();
        } else {
          focusElement.focus();
        }

      }
    }

    function _initBoxCollapsible() {

      // Reset
      $('.js-box-collapsible').removeClass('box-collapsible');
      $('.js-box-collapsible .box-title').off('click', _onBoxCollapsibleClick);

      // Bind click
      $('.js-box-collapsible .box-title').on('click', _onBoxCollapsibleClick);

      // Add class
      $('.js-box-collapsible').addClass('box-collapsible');

    }

    function _onBoxCollapsibleClick(e) {
      $(this).closest('.js-box-collapsible').toggleClass('box-collapsed');
      $(this).closest('.js-box-collapsible').toggleClass('box-expanded');
    }

    function _initChipCollapsible() {

      // Reset
      $('.js-chip-collapsible').removeClass('chip-collapsible');
      $('.js-chip-collapsible .chip-hd').off('click', _onChipCollapsibleClick);

      // Bind click
      $('.js-chip-collapsible .chip-hd').on('click', _onChipCollapsibleClick);

      // Add class
      $('.js-chip-collapsible').addClass('chip-collapsible');

    }

    function _onChipCollapsibleClick(e) {
      $(this).closest('.js-chip-collapsible').toggleClass('chip-collapsed');
      $(this).closest('.js-chip-collapsible').toggleClass('chip-expanded');
    }

    function _initHotkeys() {

      var allowHotkeys = $('body').hasClass('js-allow-hotkeys');

      // Only continue if hotkeys are allowed
      if(!allowHotkeys) {
        return;
      }

      // Register UI-nodes
      var hotkeyNodes = $('[data-hotkey]');

      // If keys are already registered, unbind them
      var keys = Object.keys(gbJs.registeredHotkeys).join(', ');
      if(keys != '') {
        hotkeys.unbind(keys);
        gbJs.registeredHotkeys = {};
      }

      $.each(hotkeyNodes, function(index, hotkeyNode) {
        var dataHotkey = $(hotkeyNode).data('hotkey');
        var dataHotkeyMethod = $(hotkeyNode).data('hotkeymethod');
        var titleAttr = $(hotkeyNode).data('hotkeytitle');

        if(!(dataHotkey in gbJs.registeredHotkeys)) {

          hotkeys(dataHotkey, function(event, handler){
            if(dataHotkeyMethod == 'click') {
              $(hotkeyNode).trigger('click');
            } else if(dataHotkeyMethod == 'navigate') {
                window.location = $(hotkeyNode).attr('href');
            }
          });

          gbJs.registeredHotkeys[dataHotkey] = {};
        } else if (gbJs.debugMode) {
          console.log('hotkey "' + dataHotkey + '" is already registered');
        }

      });

    }

    function _initInputMask() {

      // Start by unmasking all
      $('.js-input-mask').unmask();

      // Personnumber
      var personNumberFields = $('.js-input-mask.js-input-mask-personnumber');
      personNumberFields.attr('maxlength', 13);
      personNumberFields.keyup(function(event) {
        var field = $(event.currentTarget);
        var value = field.val();
        var length = value.length;

        if(length == 7) {
          var mainNumber = value.slice(0, -1);
          var lastNumber = value.slice(-1);

          if(lastNumber != '-') {
            var valueNew = mainNumber + "-" + lastNumber;
            field.val(valueNew);
          }
        }

        else if(length == 12) {
          var trimmedValue = value.replace(/-/g, '');

          var mainNumber = trimmedValue.slice(0, 8);
          var lastNumber = trimmedValue.slice(8, trimmedValue.length);

          if(lastNumber != '-') {
            var valueNew = mainNumber + "-" + lastNumber;
            field.val(valueNew);
          }
        }

      });

      // Date
      $('.js-input-mask.js-input-mask-date').mask('0000-00-00');

    }

    function _initLoginPage() {
      var isLoginPage = $('body').hasClass('js-is-login-page');
      var isSignedOut = $('body').hasClass('signed-out');

      var emailFieldId = '_58_login';
      var emailFieldIdSelector = '#' + emailFieldId;

      if(isLoginPage && isSignedOut) {
        var emailField = $(emailFieldIdSelector);
        if(emailField.size() > 0 && Liferay.Util) {
            Liferay.Util.focusFormField(emailFieldIdSelector);
        }
      }
    }

    function _initMainMenu() {

      $('.gb-menu-wrapper').hover(function(){
        $(this).toggleClass('gb-menu-open');
      });

      // Use of menu debug is only for development purpose
      // var menuDebug = true;
      //
      // if(menuDebug) {
      //   $('.gb-menu-wrapper').addClass('gb-menu-open');
      // } else {
      //
      //   $('.gb-menu-wrapper').hover(function(){
      //     $(this).toggleClass('gb-menu-open');
      //   });
      //
      // }

    }

    function _initTriggerOnEnter() {

      var triggerOnEnterNodes = $('[data-triggeronenter]');

      triggerOnEnterNodes.off('keydown');

      triggerOnEnterNodes.keydown(function(event) {
        if(event.which == KEY_ENTER) {
          event.preventDefault();

          var currentTarget = $(event.currentTarget);

          // If radio - select option before submit
          if(currentTarget.is(':radio')) {
            currentTarget.click();
          }

          var triggerId = $(this).data('triggeronenter');
          triggerId = _escapeIdForJsf(triggerId);
          var triggerNode = $('#' + triggerId);

          if(triggerNode.length) {
            triggerNode.click();
          } else {
            // Do nothing
          }

          return false;
        }
      });



    }

    function _initUserGoal() {

      var userProgressWrap = $('.js-user-progress');
      var userId = Liferay.ThemeDisplay.getUserId();
      // Temp
      //userId = 20159;
      var progressUrlBase = '/glasogonbidrag-user-progress-web/user-progress';
      var progressUrl = progressUrlBase + '/' + userId;
      //Temp
      //progressUrl = progressUrl + '/on/2016-05-02';


      $('.js-user-progress').userProgress({
        pollerMillis: 100000,
        progressUrl: progressUrl
      });
    }

    function _initToggleDockbar() {

      $('.toggle-dockbar').on('click', function(e) {
        var body = $('body');

        if(body.hasClass('dockbar-visible')) {
          body.removeClass('dockbar-visible');
          Liferay.Store('toggle_dockbar', 'hidden');
        } else {
          body.addClass('dockbar-visible');
          Liferay.Store('toggle_dockbar', 'visible');
        }

        return false;
      });

    }

    function _initPrescriptionCheckbox() {

      var prescriptionCheckboxes = $('.js-prescription-checkbox');


      prescriptionCheckboxes.off('keydown');

      prescriptionCheckboxes.keydown(function(event) {

        var currentTarget = $(event.currentTarget);
        var currentCheckbox = $(currentTarget[0]);


        if(event.which == KEY_ARROW_UP) {
          var prevCheckbox = currentTarget.closest('.prescription-section').prev('.prescription-section').find('.js-prescription-checkbox');
          prevCheckbox.focus();
        }

        else if(event.which == KEY_ARROW_DOWN) {
          var nextCheckbox = currentTarget.closest('.prescription-section').next('.prescription-section').find('.js-prescription-checkbox');
          nextCheckbox.focus();
        }

        else if(event.which == KEY_ARROW_RIGHT) {
          if(currentCheckbox.is(':checked')) {
            var firstDetailsField = currentTarget.closest('.prescription-section-main').next('.prescription-section-fields').find('.prescription-section-fieldset:first').find('.prescription-section-field:first').find('input');
            firstDetailsField.focus();
          }

        }

        else if(event.which == KEY_ENTER) {
          currentTarget.click();
        }


      });


    }

    function _initSelectInputContent() {
      var inputs = $('.js-select-on-render');
      if(inputs.length > 0) {
        $(inputs[0]).select();
      }
    }

    function _initSelectReplace() {
      // Start by destroying all potentially already created chosen
      // Commented out. Not sure if this is really needed
      //$('.js-select-replace').chosen({'destroy'});
      $('.js-select-replace').chosen({});
    }

    function _onViewPartialReload() {
      refreshUI();
      _focusNode($('#content'));
    }

    function _registerViewPartialReloadListener() {
        radio('viewPartialReload').subscribe(_onViewPartialReload);
    }


  });
})(jQueryTheme);

// Admin bar toggle
;( function( $, window, document, undefined ) {
  'use strict';

  var elListToggleControls = $('.toggle-controls');
	if (elListToggleControls.length === 1) {
		$(elListToggleControls[0]).removeClass('visible-xs');
	}

  var elBody = $('body');
  var elAddPanel = $('.lfr-add-panel');
  var elProductMenu = $('.lfr-product-menu-panel');
  var elToggleButton = $('.js-toggle-admin-mode');

  // No product menu exists
  if(!elProductMenu) {
    return;
  }

  if(elBody.hasClass('custom-admin-controls-closed')) {
    elBody.removeClass('open');
    elBody.addClass('closed');

    elProductMenu.removeClass('open');
    elProductMenu.addClass('closed');
  }

  elToggleButton.addClass('show');

  elToggleButton.on('click', toggleControlMenu);

  function toggleControlMenu(e) {
    var elBody = $('body');

    if(elBody.hasClass('custom-admin-controls-closed')) {
      Liferay.Store('custom_admin_controls', 'custom-admin-controls-open');
      elBody.removeClass('custom-admin-controls-closed');
      elBody.addClass('custom-admin-controls-open');
    } else if(elBody.hasClass('custom-admin-controls-open')) {
      Liferay.Store('custom_admin_controls', 'custom-admin-controls-closed');
      elBody.removeClass('custom-admin-controls-open');
      elBody.addClass('custom-admin-controls-closed');
    }

  }



})( jQueryTheme, window, document );
