<%@ include file="/common/taglibs.jsp"%>
<%@ page language="java" pageEncoding="UTF-8"%>

<head>
<title><fmt:message key="display.title" /></title>
<meta name="menu" content="AdminMenu" />
<link href="<c:url value="/styles/PhotoDisplay.css"/>" rel="stylesheet">
</head>
<script type="text/javascript" src="<c:url value="/bower_components/jquery.rest/dist/jquery.rest.min.js"/>"></script>
<script type="text/javascript" src="<c:url value="/bower_components/sass-bootstrap/dist/js/bootstrap.min.js"/>"></script>

<!-- angularjs -->
    <script type="text/javascript" src="<c:url value="/bower_components/angular/angular.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/bower_components/angular-cookies/angular-cookies.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/bower_components/angular-resource/angular-resource.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/bower_components/angular-sanitize/angular-sanitize.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/bower_components/angular-route/angular-route.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/app.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/controllers/main.js"/>"></script>
    <script type="text/javascript" src="<c:url value="/scripts/services/main.js"/>"></script>
    
<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.2&key=53f7e239ddb8ea62ba552742a233ed1f"></script>
<script type="text/javascript" src="<c:url value='/scripts/panor/panoramio/cnmap.comm.js'/>"></script>
<script type="text/javascript" src="<c:url value='/scripts/panor/js/cnmap.gaode.js'/>"></script>

	<script type="text/javascript">
        window.ctx = "http://localhost:8080/panor-web";

        $(document).ready(function () {
            var lat, lng;
            $("abbr.latitude").each(function (i, element) {
                lat = Number($(this).attr("title"));
                $(this).text(cnmap.GPS.convert(lat) + " N");
            })

            $("abbr.longitude").each(function (i, element) {
                lng = Number($(this).attr("title"));
                $(this).text(cnmap.GPS.convert(lng) + " E");
            })

            $.cnmap.initMap("minimap1", {
                maptype: "SATELLITE"
            })
            $.cnmap.setCenter(lat, lng);
            $.cnmap.addMarkerInCenter();
        })
    </script>

<div class="interim-important_notice_wrapper hide">
	<div class="interim-important_notice">
		将您的Google+帐户与Panoramio<a class="interim-important_notice_link"
			href="#" id="gplus_connector">相关联</a>。<a
			class="interim-important_notice_link" href="/help/gplus-faq">了解详情</a>。
	</div>
</div>
<div class="container" ng-app="cnmapApp" ng-controller="PhotoCtrl">
	<div class="photo-col">
		<div id="main-photo-wrapper" data-id="<c:url value='${photo.id}'/>">
            <a id="main-photo" href="#">
                <img ng-src="{{ctx}}/{{photoId}}/1" alt="around Angkor Wat" id="main-photo_photo"
                     style="max-height: 541px;">
            </a>
        </div>
		<div>
			<div class="photo_page-stats_container">
				<div id="counter_snippet" class="photo_page_counter_snippet">
					<span class="photo-page-stats" id="total-views-sum"> <a
						href="/photo/64742548/stats"> 1841 views </a>
					</span> <span class="photo-page-stats" id="favorites-sum"> <a
						href="/photo/64742548/stats"> 1 favorite </a>
					</span> <span class="photo-page-stats" id="likes-sum"> <a
						href="/photo/64742548/stats"> 7 likes </a>
					</span>
				</div>
				<a class="icon_sprite icon_flag photo_page-stats"
					href="/offensive/photo?id=64742548" title="举报内容不当或带有攻击性的照片"></a>

				<div id="photo-page-prev-next-container">
					<a href="/photo/64742707"><img src="/img/prev-uphoto.png"
						width="21" height="21" alt=""></a> <a href="/photo/64644016"><img
						src="/img/next-uphoto.png" width="21" height="21" alt=""></a>
				</div>
			</div>
			<div id="photo-title-box">
				<div id="photo-title-icon"></div>
				<h1 id="photo-title">admire the culture of ancient Angkor...</h1>
			</div>
		</div>
		<div>
			<div style="float: right;"></div>
			<!--<g:plusone size="medium" annotation="none"></g:plusone>-->
			<div class="photo-share-icons">
				<a class="icon_sprite icon_twitter" target="_blank"
					title="在Twitter分享"
					href="http://twitter.com/?status=admire%20the%20culture%20of%20ancient%20Angkor...%20-%20http%3A//panoramio.com/photo/64742548"
					onclick="_gaq.push(['_trackSocial', 'twitter', 'tweet', '/twitter/photo_id=64742548']);"></a>
			</div>
		</div>
		<div>
			<div class="photo-page-earth-status">Selected for Google Maps
				and Google Earth</div>
		</div>
		<div class="photo_description hide" id="photo-description">
			<div class="edit_icon"></div>
			<div class="photo_description_formatted gray"
				id="photo-description-formatted"></div>
			<div class="show_more_bar" id="show-more-bar">
				<span>Show more</span>
			</div>
			<div class="show_less_bar" id="show-less-bar">
				<span>Show less</span>
			</div>
			<textarea class="photo_description_editor"
				id="photo-description-editor"></textarea>
			<a class="group_button save_description_button"
				id="save-description-button">保存</a> <a
				class="cancel_description_button" id="cancel-description-button">取消</a>
			<a href="/help_format/" class="help_format"
				id="help_format_description" rel="help" target="_blank">
				想用黑体，斜体或链接？ </a>
		</div>
		<div id="comments_wrapper">
            <h2 id="users_comments">
                Comments ({{comment.count}})
            </h2>

            <div class="paginator-wrapper">
            </div>

            <div class="comment" ng-repeat="comment in comments" id="{{comment.id}}">
                <img class="comment-avatar" width="48"
                     src="http://static.panoramio.com/avatars/user/5636966.jpg?v=000000" alt="">

                <div class="comment-inner">
                    <div class="comment-author">
                        <a href="#/event/user/{{comment.userId}}">{{comment.name}}</a> 于 {{comment.date}}
                    </div>
                    <div id="c49440741" class="photo-comment-text">
                        <p>{{comment.content}}</p>
                    </div>
                    <div class="translated-text" id="{{comment.id}}"></div>
                    <div class="translate-comment"><a class="translate-comment-link" id="t49440741" href="#">翻译</a>
                    </div>
                </div>
            </div>

            <div class="paginator-wrapper">
            </div>
        </div>

        <form action="" method="post" id="comment" ng-show="user.loggedIn" class="ng-hide">
            <h3>发送评论 <span>(以 暗梅幽闻花身份)</span></h3>
            <textarea cols="50" rows="3" id="tcomment" name="comment" ng-model="comment.content" class="form-control"></textarea>
            <br>
            <input type="hidden" id="user_id" value="${userSettings.user.id}">
            <input type="hidden" name="photoid" value="64742548">
            <input ng-click="save(comment.content)" id="submit_comment" class="button button-positive" value="发送评论">
            <!--            <a href="/help_format/" id="help_format" rel="help" target="_blank">
                            想用黑体，斜体或链接？
                        </a>-->
        </form>
	</div>
	<div class="info-col">
		<div class="interim-info-card photo-page-card">
        <div id="profile_pic_info">
            <a href="<c:url value='/user/${photo.owner.id}'/>">
            	<img src="<c:url value='/images/user_avatar.png'/>"
                    width="60" height="60" alt="Mehmet Gü?lü" id="profile_pic_avatar"></a>

            <div id="profile_info">
                <div id="profile_name">
                    <a href="/user/3908287?with_photo_id=41234541" rel="author">Mehmet Gü?lü</a>
                </div>
                <div id="profile_location">
                    Istanbul
                </div>
                <div id="profile-stats">
                    <a href="<c:url value='/user/${photo.owner.id}'/>">
              <span class="profile-stats-text">
                  320 photos</span></a>
                </div>
            </div>
        </div>
        <div class="photo_page-info_card_img_row" id="photo_page-owner_photos">
        </div>
        <div id="wapi_photo_list">
            <div class="panoramio-wapi-photolist-h panoramio-wapi-photolist" style="width: 295px; height: 48px;">
                <a class="panoramio-wapi-arrow panoramio-wapi-prev" href="#" style="display: none;">
                    <img src="http://www.panoramio.com/img/wapi/photo_list_widget/left_arrow.png" alt="??" width="39"
                         height="38" title="??" style="margin-top: 5px;">
                </a>
                <span class="panoramio-wapi-arrowbox panoramio-wapi-arrowbox-prev"
                      style="width: 39px; display: none;"></span>

                <div class="panoramio-wapi-overlay" style="width: 265px; height: 48px; display: none;"></div>
                <div class="panoramio-wapi-images" style="width: 265px; height: 48px;">
                    <div class="panoramio-wapi-images" style="width: 265px; height: 48px;">
                        <div class="panoramio-wapi-loaded-img-div" style="width: 44px; height: 48px;">
                            <div class="panoramio-wapi-wrapper-div"
                                 style="padding: 0px; border-width: 1px; margin: 4px 2px;">
                                <div class="panoramio-wapi-crop-div" style="width: 38px; height: 38px;">
                                    <a href="http://www.panoramio.com/photo/42477493">
                                        <img id="loadedImage7"
                                             src="http://mw2.google.com/mw-panoramio/photos/square/42477493.jpg"
                                             class="panoramio-wapi-img panoramio-wapi-loaded-img" alt="" title="t"
                                             style="width: 38px; height: 38px; left: 0px; top: 0px;"></a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <a class="panoramio-wapi-arrow panoramio-wapi-next" href="#" style="display: none;">
                    <img src="http://www.panoramio.com/img/wapi/photo_list_widget/right_arrow.png" alt="??" width="39"
                         height="38" title="??" style="margin-top: 5px;">
                </a>
                <span class="panoramio-wapi-arrowbox panoramio-wapi-arrowbox-next"
                      style="width: 39px; display: none;"></span>
            </div>
            <div class="panoramio-wapi-tos">
            </div>
        </div>
        <div class="photo_page-info_card_img_row_footer">

            <h3 id="wapi_photo_h">
                更多 <a href="/user/3908287?with_photo_id=41234541" rel="author">Mehmet Gü?lü</a> 的照片
            </h3>

        </div>
    </div>
		<div class="interim-info-card photo-page-card">
			<div id="map_info_breadcrumbs">
				<a href="/map/">World</a> • <a href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=12&amp;k=2">柬埔寨</a>
				• <a href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=9&amp;k=2">暹粒省</a>
			</div>
			<div id="map_info_name">
				<a href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=12&amp;k=2">Siem
					Reap</a>
			</div>
			<div id="minimap1"></div>
			<div id="nearby_photos">
				<a href="/photo/54671273"><img class="nearby-img"
					src="http://mw2.google.com/mw-panoramio/photos/square/54671273.jpg"
					height="44" width="44" alt=""></a><a href="/photo/145928"><img
					class="nearby-img"
					src="http://mw2.google.com/mw-panoramio/photos/square/145928.jpg"
					height="44" width="44" alt=""></a><a href="/photo/64643919"><img
					class="selected-nearby-img"
					src="http://mw2.google.com/mw-panoramio/photos/square/64643919.jpg"
					height="44" width="44" alt=""></a>
				<div class="next-photo"></div>
				<div class="next-photo"></div>
			</div>
			<div id="nearby">
				<p id="place">Photo taken in Siem Reap, 柬埔寨</p>

				<div id="location" class="photo_mapped">
					<div class="geo">
						<a title="查看这片区域" href=""> <abbr class="latitude"
							title="${photo.gpsPoint.lat}"></abbr>&nbsp; <abbr
							class="longitude" title="${photo.gpsPoint.lng}"></abbr></a>
					</div>
					<p id="misplaced">
						<a id="map_photo" href="/map_photo/?id=64643919">
							放错地点了吗？建议新的位置 </a>
					</p>
				</div>
			</div>
		</div>
		<div class="interim-info-card photo-page-card">
			<h2>标签</h2>
			<ul id="interim-tags">

				<li id="tag_element_0"><a href="/user/4522308/tags/Cambodia">
						Cambodia </a></li>

				<li id="show_all_tags" style="display: none;"><a href="#">
						显示所有标签 (1) </a></li>
			</ul>
		</div>
		<div class="interim-info-card photo-page-card">
			<h2>Photo details</h2>
			<ul id="details">
				<li>于 ${photo.createDate} 上传</li>
				<li class="license c">© 保留所有权利 <br>作者
					${photo.owner.username}
				</li>
				<li id="tech-details">
					<ul>
						<li>相机型号：${details.model}</li>
						<li>拍摄日期：${details.dateTimeOriginal}</li>
						<li>曝光时间：${details.exposureTime}</li>
						<li>焦距：${details.focalLength} mm</li>
						<li>光圈： f/${details.FNumber}</li>
						<li>ISO：${details.ISO}</li>
						<li>曝光补偿： 0.00 EV</li>
						<li>无闪光灯</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</div>

