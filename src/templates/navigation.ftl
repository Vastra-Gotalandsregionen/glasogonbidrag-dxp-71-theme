<div id="gb-menu" class="gb-menu-main">
    <nav class="gb-menu-wrapper">

      <div class="gb-scroller">

        <ul class="gb-menu">

          <#list nav_items as nav_item>
      			<#assign nav_item_attr_has_popup = "" />
      			<#assign nav_item_attr_selected = "" />
      			<#assign nav_item_css_class = "" />

      			<#if nav_item.isSelected()>
      				<#assign nav_item_attr_has_popup = "aria-haspopup='true'" />
      				<#assign nav_item_attr_selected = "aria-selected='true'" />
      				<#assign nav_item_css_class = "selected" />
      			</#if>

            <#assign nav_item_css_class = nav_item_css_class + " gb-icon" />

            <#assign iconClass = "" />
            <#assign iconClassExp  = expandoValueLocalService.getValue(company_id, "com.liferay.portal.kernel.model.Layout", "CUSTOM_FIELDS", "icon-class", nav_item.getLayout().getPlid())! />
            <#if iconClassExp?has_content>
              <#assign nav_item_css_class = nav_item_css_class + " gb-icon-" + iconClassExp.getData() />
            </#if>

      			<#assign nav_item_attr_data_hotkey = "" />
      			<#assign nav_item_attr_data_hotkeymethod = "" />
      			<#assign nav_item_attr_data_hotkeytitle = "" />

            <#assign hotkeyExp  = expandoValueLocalService.getValue(company_id, "com.liferay.portal.kernel.model.Layout", "CUSTOM_FIELDS", "hotkey", nav_item.getLayout().getPlid())! />
            <#assign hotkeyMethodExp  = expandoValueLocalService.getValue(company_id, "com.liferay.portal.kernel.model.Layout", "CUSTOM_FIELDS", "hotkey-method", nav_item.getLayout().getPlid())! />

            <#if hotkeyExp?has_content && hotkeyMethodExp?has_content>
              <#assign nav_item_attr_data_hotkey = "data-hotkey='" + hotkeyExp.getData() + "'" />
              <#assign nav_item_attr_data_hotkeymethod = "data-hotkeymethod='" + hotkeyMethodExp.getData() + "'" />
              <#assign nav_item_attr_data_hotkeytitle = "data-hotkeytitle='" + nav_item.getName() + "'" />
            </#if>

      			<li ${nav_item_attr_selected} class="${nav_item_css_class}" id="layout_${nav_item.getLayoutId()}" role="presentation">
      				<a aria-labelledby="layout_${nav_item.getLayoutId()}" ${nav_item_attr_has_popup} href="${nav_item.getURL()}" ${nav_item.getTarget()} role="menuitem" ${nav_item_attr_data_hotkey} ${nav_item_attr_data_hotkeymethod} ${nav_item_attr_data_hotkeytitle}>
      					<span>${nav_item.getName()}</span>
      				</a>
      			</li>
      		</#list>

          <#if is_signed_in && layout.isPublicLayout() >
            <li class="gb-icon">
              <a class="" href="${applicationURL}">
                <span>
                    ${goToApplicationLabel}
                </span>
              </a>
            </li>
          </#if>

          <#if show_dockbar>
      			<li class="gb-icon gb-icon-dockbar gb-open-only">
      				<a class="toggle-dockbar js-toggle-admin-mode" href="javascript:;">Toggle Dockbar</a>
      			</li>
      		</#if>

      		<#if is_signed_in>
      			<li class="gb-icon gb-icon-sign-out gb-open-only">
      				<a href="${sign_out_url}" id="sign-out" rel="nofollow">${sign_out_text}</a>
      			</li>
            <li class="user-info gb-open-only">
              <span>
                  Inloggad som: <span class="username">${user_name}</span>
              </span>
            </li>
      		<#else>
      			<li class="gb-icon gb-icon-sign-in gb-open-only">
      				<a href="${sign_in_url}" data-redirect="${is_login_redirect_required?string}" id="sign-in" rel="nofollow">${sign_in_text}</a>
      			</li>
      		</#if>

        </ul>

        <div class="logo">
          <img src="${images_folder}/theme/logo/vgr-glasogonbidrag.png" alt="${site_name}" />
        </div>

      </div>

    </nav>
</div>
