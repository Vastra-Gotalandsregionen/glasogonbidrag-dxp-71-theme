<!DOCTYPE html>

<#include init />

<html class="${root_css_class}" dir="<@liferay.language key="lang.dir" />" lang="${w3c_language_id}">

<head>
	<title>${the_title} - ${company_name}</title>

	<meta content="initial-scale=1.0, width=device-width" name="viewport" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />

	<#include "${full_templates_path}/theme_js_head.ftl" />

	<@liferay_util["include"] page=top_head_include />
</head>

<body class="${css_class}">

<@liferay_ui["quick-access"] contentId="#main-content" />

<@liferay_util["include"] page=body_top_include />

<#if is_signed_in>
	<#include "${full_templates_path}/navigation.ftl" />
</#if>

<div class="wrapper-outer push">
	<div class="gb-ajax-mask"></div>

	<@liferay.control_menu />

	<div class="container-fluid" id="wrapper">

		<header id="banner" role="banner"></header>

		<section id="content">
			<#if selectable>
				<@liferay_util["include"] page=content_include />
			<#else>
				${portletDisplay.recycle()}

				${portletDisplay.setTitle(the_title)}

				<@liferay_theme["wrap-portlet"] page="portlet.ftl">
					<@liferay_util["include"] page=content_include />
				</@>
			</#if>
		</section>

		<#include "${full_templates_path}/footer.ftl" />

	</div>
</div>

<@liferay_util["include"] page=body_bottom_include />

<#include "${full_templates_path}/theme_js_bottom.ftl" />

<@liferay_util["include"] page=bottom_include />

<!-- inject:js -->
<!-- endinject -->

</body>

</html>
