<#------ Define services -------------------------------------------------->

<#assign layoutLocalService = serviceLocator.findService("com.liferay.portal.kernel.service.LayoutLocalService") />
<#assign layoutSetLocalService = serviceLocator.findService("com.liferay.portal.kernel.service.LayoutSetLocalService") />
<#assign userGroupRoleLocalService = serviceLocator.findService("com.liferay.portal.kernel.service.UserGroupRoleLocalService") />

<#assign expandoValueLocalService = serviceLocator.findService("com.liferay.expando.kernel.service.ExpandoValueLocalService") />
<#assign journalArticleLocalService = serviceLocator.findService("com.liferay.journal.service.JournalArticleLocalService") />

<#------ Define variables -------------------------------------------------->

<#assign portal_url_modified = "" />
<#assign modified_logo_tooltip = "" />

<#assign nav_css_class = "" />

<#------ Expando values -------------------------------------------------->

<#------ Theme Settings -------------------------------------------------->

<#assign allow_hotkeys = false />

<#assign theme_setting_allow_hotkeys = theme_display.getThemeSetting("allow-hotkeys")! />

<#if theme_setting_allow_hotkeys = "on">
	<#assign allow_hotkeys = true />
</#if>

<#assign is_login_page = false />

<#assign theme_setting_is_login_page = theme_display.getThemeSetting("is-login-page")! />

<#if theme_setting_is_login_page = "on">
	<#assign is_login_page = true />
</#if>

<#------ Admin controls -------------------------------------------------->
<#assign custom_show_admin_controls = sessionClicks.get(request, "custom_admin_controls", "custom-admin-controls-closed") />

<#assign css_class = css_class + " " + custom_show_admin_controls />

<#------ Hotkeys -------------------------------------------------->

<#if allow_hotkeys>
	<#assign css_class = css_class + " js-allow-hotkeys" />
</#if>

<#------ URL:s -------------------------------------------------->

<#assign applicationURL = "/group" + page_group.getFriendlyURL() />
<#assign goToApplicationLabel = "Till applikationen" />

<#------ Login page -------------------------------------------------->

<#if is_login_page>
	<#assign css_class = css_class + " js-is-login-page" />
</#if>

<#------ Dockbar -------------------------------------------------->

<#assign show_dockbar = false />

<#if is_signed_in>

	<#if permissionChecker.isOmniadmin()>
		<#assign show_dockbar = true />
	<#else>
		<!-- Editor role name is "Editor" and role is site-scoped -->
		<#assign editor_role_name = "Editor" />

		<#assign is_site_editor = userGroupRoleLocalService.hasUserGroupRole(user_id, group_id, editor_role_name) />

		<#if is_site_editor>
			<#assign show_dockbar = true />
		</#if>

	</#if>

	<#-- Above does not work on Test. Set always show dockbar when signed in. Should be fixed/debugged. -->
	<#assign show_dockbar = true />

</#if>

<#--
-->
<#assign toggle_dockbar = sessionClicks.get(request, "toggle_dockbar", "hidden") />

<#if toggle_dockbar == "visible">
	<#assign css_class = css_class + " dockbar-visible" />
</#if>

<#------ Theme Javascript -------------------------------------------------->

<#assign theme_js_head_scripts = ["/radio/radio.min.js", "/pojs.js", "/chart.js/Chart.bundle.js"] />
<#assign theme_js_jquery_base = "/jquery/jquery.min.js" />
<#assign theme_js_bottom_scripts = ["/handlebars/handlebars.js", "/jquery/jquery.mask/jquery.mask.js", "/jquery/chosen.jquery/chosen.jquery.min.js", "/hotkeys/hotkeys.js", "/jquery/custom/jquery.gb.userprogress.js", "/jq.js"] />

<#------ Macros -------------------------------------------------->

<#-- Include an Asset Publisher in theme. attribute: group_id is long, page_plid is long, setting_name is String, portlet_instance_suffix is String -->
<#macro includeAP group_id page_plid archived_setting_name portlet_instance_suffix>
	<#local instanceId = portlet_instance_suffix>
	<#if instanceId?length < 12>
		<#local instanceId = instanceId + "cygateab1234" />
	</#if>
	<#local instanceId = instanceId?substring(0, 12) />
	<#local portletInstanceId = "101_INSTANCE_" + instanceId />

	<#local settingsXml = getArchivedPortletPreferencesXml(group_id, archived_setting_name, "101")! />

	<#if settingsXml?has_content>
		<#-- Update portlet preferences for portlet instance on the given plid -->
		<#assign void = portletPreferencesLocalService.updatePreferences(0, 3, page_plid, portletInstanceId, settingsXml) />

		${freeMarkerPortletPreferences.reset()}
		${freeMarkerPortletPreferences.setValue("portletSetupShowBorders","false")}
		${theme.runtime(portletInstanceId, "", freeMarkerPortletPreferences)}
		${freeMarkerPortletPreferences.reset()}

	</#if>
</#macro>

<#-- Include Web Content Display portlet in theme. attribute: group_id is long, article_id is String-->

<#macro includeWCD group_id article_id>
	<#if article_id != "">

		<#local portlet_instance_suffix = "vgrintra" />
		<#local instance_id = "wcd" + article_id + portlet_instance_suffix />
		<#local instance_id = instance_id?substring(0, 12) />
		<#local portlet_id = "56_INSTANCE_" + instance_id />

		${freeMarkerPortletPreferences.reset()}

		${freeMarkerPortletPreferences.setValue("portletSetupShowBorders","false")}
		${freeMarkerPortletPreferences.setValue("groupId", group_id?c)}
		${freeMarkerPortletPreferences.setValue("articleId", article_id)}

		${theme.runtime(portlet_id, "", freeMarkerPortletPreferences)}
		${freeMarkerPortletPreferences.reset()}
	<#else>
		&nbsp;
	</#if>
</#macro>
