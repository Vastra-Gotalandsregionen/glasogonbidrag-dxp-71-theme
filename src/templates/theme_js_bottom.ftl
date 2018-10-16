<#--
-->
<script src="${javascript_folder}/${theme_js_jquery_base}"></script>


<#-- This is needed or PrimeFaces jQuery will conflict with theme jQuery -->
<script type="text/javascript">
	var jQueryTheme = jQuery.noConflict();
</script>

<#list theme_js_bottom_scripts as script>
  <script src="${javascript_folder}/${script}"></script>
</#list>
