<%@ include file="/common/taglibs.jsp"%>
<%@ page language="java" pageEncoding="UTF-8"%>

<head>
<title><fmt:message key="display.title" /></title>
<meta name="menu" content="AdminMenu" />
<link href="<c:url value="/styles/PhotoDisplay.css"/>" rel="stylesheet">
<script type="text/javascript"
	src="<c:url value='/scripts/imgLiquid/imgLiquid.js'/>"></script>
</head>

<script type="text/javascript" src="<c:url value='/scripts/imgLiquid/imgLiquid.js'/>"></script>
<script type="text/javascript">
        $(document).ready(function () {
            $(".imgLiquidFill").imgLiquid({fill: true});
        })
</script>
<%-- <div>
	<img src="<c:url value="/services/api/photos/${photoId}"/>"
		alt="" id="main-photo_photo" style="max-height: 689px;"/>
</div> --%>

<div class="interim-important_notice_wrapper">
    <div class="interim-important_notice">将您的Google+帐户与Panoramio<a class="interim-important_notice_link" href="#" id="gplus_connector">相关联</a>。<a class="interim-important_notice_link" href="/help/gplus-faq">了解详情</a>。
    </div>
</div>
<div class="container">
    <div class="photo-col">
        <div id="main-photo-wrapper" class="imgLiquidFill imgLiquid">
            <a id="main-photo" href="<c:url value="photo/${photoId}"/>">
                <img src="<c:url value="/services/api/photos/${photoId}"/>" alt="around Angkor Wat" id="main-photo_photo"
                     style="max-height: 541px;">
            </a>
        </div>
        <div>
            <div class="photo_page-stats_container">
                <div id="counter_snippet" class="photo_page_counter_snippet">
                    <span class="photo-page-stats" id="total-views-sum">
                    <a href="/photo/64742548/stats">
                        1841 views
                    </a>
                    </span>
                    <span class="photo-page-stats" id="favorites-sum">
                    <a href="/photo/64742548/stats">
                        1 favorite
                    </a>
                    </span>
                    <span class="photo-page-stats" id="likes-sum">
                    <a href="/photo/64742548/stats">
                        7 likes
                    </a>
                    </span>
                </div>
                <a class="icon_sprite icon_flag photo_page-stats" href="/offensive/photo?id=64742548"
                   title="举报内容不当或带有攻击性的照片"></a>

                <div id="photo-page-prev-next-container">
                    <a href="/photo/64742707"><img src="/img/prev-uphoto.png" width="21" height="21" alt=""></a>
                    <a href="/photo/64644016"><img src="/img/next-uphoto.png" width="21" height="21" alt=""></a>
                </div>
            </div>
            <div id="photo-title-box">
                <div id="photo-title-icon"></div>
                <h1 id="photo-title">
                    admire the culture of ancient Angkor...
                </h1>
            </div>
        </div>
        <div>
            <div style="float: right;">
            </div>
            <!--<g:plusone size="medium" annotation="none"></g:plusone>-->
            <div class="photo-share-icons">
                <a class="icon_sprite icon_twitter" target="_blank" title="在Twitter分享"
                   href="http://twitter.com/?status=admire%20the%20culture%20of%20ancient%20Angkor...%20-%20http%3A//panoramio.com/photo/64742548"
                   onclick="_gaq.push(['_trackSocial', 'twitter', 'tweet', '/twitter/photo_id=64742548']);"></a>
            </div>
        </div>
        <div>
            <div class="photo-page-earth-status">
                Selected for Google Maps and Google Earth
            </div>
        </div>
        <div class="photo_description" id="photo-description">
            <div class="edit_icon"></div>
            <div class="photo_description_formatted gray" id="photo-description-formatted">
            </div>
            <div class="show_more_bar" id="show-more-bar">
                <span>Show more</span></div>
            <div class="show_less_bar" id="show-less-bar">
                <span>Show less</span></div>
            <textarea class="photo_description_editor" id="photo-description-editor"></textarea>
            <a class="group_button save_description_button" id="save-description-button">保存</a>
            <a class="cancel_description_button" id="cancel-description-button">取消</a>
            <a href="/help_format/" class="help_format" id="help_format_description" rel="help" target="_blank">
                想用黑体，斜体或链接？
            </a>
        </div>
        <div id="comments_wrapper">
            <h2 id="users_comments">
                Comments (8)
            </h2>

            <div class="paginator-wrapper">
            </div>
            <div class="comment" id="49440741">
                <img class="comment-avatar" width="48"
                     src="http://static.panoramio.com/avatars/user/5636966.jpg?v=000000" alt="">

                <div class="comment-inner">
                    <div class="comment-author">
                        <a href="/user/5636966">ELIDA</a> 于 2012-01-11
                    </div>
                    <div id="c49440741" class="photo-comment-text">
                        <p>Impactante perspectiva,de un lugar de riqueza histórica. <strong>LIKE</strong>. Saludos desde
                            Argentina. Elida.</p>
                    </div>
                    <div class="translated-text" id="tr49440741"></div>
                    <div class="translate-comment"><a class="translate-comment-link" id="t49440741" href="#">翻译</a>
                    </div>
                </div>
            </div>
        </div>

        <form action="/do/send_comment/" method="post" id="comment">
            <input type="hidden" id="xsrf_token" name="xsrf_token" value="j00ml4JzPzIGSffn2Mb5eToxMzg4MTI1NjQ2NDcwNDY4">
            <h3>发送评论 <span>(以 暗梅幽闻花身份)</span></h3>
            <textarea cols="50" rows="8" id="tcomment" name="comment"></textarea>
            <br>
            <input type="hidden" name="owner_id" value="4522308">
            <input type="hidden" name="photo_id" value="64742548">
            <input type="submit" name="submit" id="submit_comment" value="发送评论">
            <a href="/help_format/" id="help_format" rel="help" target="_blank">
                想用黑体，斜体或链接？
            </a>
        </form>
    </div>
    <div class="info-col">
        <div class="interim-info-card photo-page-card"></div>
        <div class="interim-info-card photo-page-card">
            <div id="map_info_breadcrumbs">
                <a href="/map/">World</a> •
                <a href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=12&amp;k=2">柬埔寨</a> • <a
                    href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=9&amp;k=2">暹粒省</a>
            </div>
            <div id="map_info_name">
                <a href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=12&amp;k=2">Siem Reap</a>
            </div>
            <div id="minimap1"></div>
            <div id="nearby_photos"><a href="/photo/54671273"><img class="nearby-img"
                                                                   src="http://mw2.google.com/mw-panoramio/photos/square/54671273.jpg"
                                                                   height="44" width="44" alt=""></a><a
                    href="/photo/145928"><img class="nearby-img"
                                              src="http://mw2.google.com/mw-panoramio/photos/square/145928.jpg"
                                              height="44" width="44" alt=""></a><a href="/photo/64643919"><img
                    class="selected-nearby-img" src="http://mw2.google.com/mw-panoramio/photos/square/64643919.jpg"
                    height="44" width="44" alt=""></a>

                <div class="next-photo"></div>
                <div class="next-photo"></div>
            </div>
            <div id="nearby">
                <p id="place">
                    Photo taken in Siem Reap, 柬埔寨
                </p>

                <div id="location" class="photo_mapped">
                    <div class="geo"><a title="查看这片区域" href="/map/#lt=13.406531&amp;ln=103.872785&amp;z=4&amp;k=2"><abbr
                            class="latitude" title="13.4065313889">13° 24' 23.51" N</abbr>&nbsp;
                        <abbr class="longitude" title="103.872784722">103° 52' 22.03" E</abbr></a></div>
                    <p id="misplaced">
                        <a id="map_photo" href="/map_photo/?id=64643919">
                            放错地点了吗？建议新的位置
                        </a>
                    </p>
                </div>
            </div>
        </div>
        <div class="interim-info-card photo-page-card">
            <h2>标签</h2>
            <ul id="interim-tags">

                <li id="tag_element_0">
                    <a href="/user/4522308/tags/Cambodia">
                        Cambodia
                    </a>
                </li>

                <li id="show_all_tags" style="display: none;">
                    <a href="#">
                        显示所有标签 (1)
                    </a>
                </li>
            </ul>
        </div>
        <div class="interim-info-card photo-page-card">
            <h2>Photo details</h2>
            <ul id="details">
                <li>
                    于 于 2012-01-10 上传
                </li>
                <li class="license c">
                    © 保留所有权利
                    <br>作者 Ngo Minh Truc
                </li>
                <li id="tech-details">
                    <ul>
                        <li>相机型号：SONY DSC-HX5V</li>
                        <li>拍摄日期：2011/11/26 09:17:56</li>
                        <li>曝光时间：0.033s (1/30)</li>
                        <li>焦距：4.25mm</li>
                        <li>光圈： f/3.500</li>
                        <li>ISO：ISO250</li>
                        <li>曝光补偿： 0.00 EV</li>
                        <li>无闪光灯</li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>