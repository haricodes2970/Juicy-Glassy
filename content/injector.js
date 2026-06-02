/**
 * Juicy Glassy — MAIN World Injector
 *
 * This script runs in YouTube's actual page context (MAIN world)
 * so it can access window.ytInitialData, which contains the full
 * pre-rendered homepage feed. It extracts video data, subscriptions,
 * and category chips, then posts them to the content script via
 * window.postMessage.
 */
;(function () {
  'use strict'

  var MSG_TYPE = 'JUICY_GLASSY_DATA'
  var MSG_TYPE_APPEND = 'JUICY_GLASSY_DATA_APPEND'

  /* ------------------------------------------------------------------ */
  /*  Helpers                                                            */
  /* ------------------------------------------------------------------ */

  function best(thumbnails) {
    if (!thumbnails || !thumbnails.length) return ''
    var sorted = thumbnails.slice().sort(function (a, b) {
      return (b.width || 0) - (a.width || 0)
    })
    return sorted[0].url || ''
  }

  function textFrom(obj) {
    if (!obj) return ''
    if (obj.simpleText) return obj.simpleText
    if (obj.runs) {
      return obj.runs
        .map(function (r) {
          return r.text
        })
        .join('')
    }
    return ''
  }

  /* ------------------------------------------------------------------ */
  /*  Video parser                                                       */
  /* ------------------------------------------------------------------ */

  function parseVideo(r) {
    if (!r || !r.videoId) return null

    var videoId = r.videoId
    var title = textFrom(r.title)
    if (!title) return null

    var thumbnail =
      best(r.thumbnail && r.thumbnail.thumbnails) ||
      'https://i.ytimg.com/vi/' + videoId + '/hqdefault.jpg'

    var channelName =
      textFrom(r.ownerText) || textFrom(r.shortBylineText) || 'YouTube'

    var chThumb =
      r.channelThumbnailSupportedRenderers &&
      r.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer &&
      r.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer
        .thumbnail &&
      r.channelThumbnailSupportedRenderers.channelThumbnailWithLinkRenderer
        .thumbnail.thumbnails
    var channelAvatar = best(
      chThumb || (r.channelThumbnail && r.channelThumbnail.thumbnails)
    )

    var viewCount =
      textFrom(r.shortViewCountText) || textFrom(r.viewCountText) || ''
    var publishedTime = textFrom(r.publishedTimeText) || ''

    // Duration
    var duration = textFrom(r.lengthText) || ''
    if (!duration && r.thumbnailOverlays) {
      for (var i = 0; i < r.thumbnailOverlays.length; i++) {
        var ov = r.thumbnailOverlays[i].thumbnailOverlayTimeStatusRenderer
        if (ov) {
          duration = textFrom(ov.text)
          break
        }
      }
    }

    // LIVE detection
    var isLive = false
    if (r.badges) {
      for (var b = 0; b < r.badges.length; b++) {
        var badge = r.badges[b].metadataBadgeRenderer
        if (
          badge &&
          (badge.style === 'BADGE_STYLE_TYPE_LIVE_NOW' ||
            badge.label === 'LIVE')
        ) {
          isLive = true
        }
      }
    }
    if (!isLive && r.thumbnailOverlays) {
      for (var j = 0; j < r.thumbnailOverlays.length; j++) {
        var tov = r.thumbnailOverlays[j].thumbnailOverlayTimeStatusRenderer
        if (tov && tov.style === 'LIVE') {
          isLive = true
        }
      }
    }

    // Verified
    var isVerified = false
    if (r.ownerBadges) {
      for (var v = 0; v < r.ownerBadges.length; v++) {
        var vb = r.ownerBadges[v].metadataBadgeRenderer
        if (
          vb &&
          (vb.style === 'BADGE_STYLE_TYPE_VERIFIED' ||
            vb.style === 'BADGE_STYLE_TYPE_VERIFIED_ARTIST')
        ) {
          isVerified = true
        }
      }
    }

    var channelUrl = ''
    try {
      channelUrl =
        r.ownerText.runs[0].navigationEndpoint.browseEndpoint
          .canonicalBaseUrl ||
        r.shortBylineText.runs[0].navigationEndpoint.browseEndpoint
          .canonicalBaseUrl ||
        ''
    } catch (_) {}

    return {
      videoId: videoId,
      title: title,
      thumbnail: thumbnail,
      channelName: channelName,
      channelAvatar: channelAvatar,
      channelUrl: channelUrl,
      viewCount: viewCount,
      publishedTime: publishedTime,
      duration: duration,
      isLive: isLive,
      isVerified: isVerified,
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Parse full homepage feed                                           */
  /* ------------------------------------------------------------------ */

  function parseVideos(data) {
    if (!data) return []
    var videos = []

    try {
      var tabs = data.contents && data.contents.twoColumnBrowseResultsRenderer
        && data.contents.twoColumnBrowseResultsRenderer.tabs
      if (!tabs || !tabs.length) return []

      var contents =
        tabs[0].tabRenderer &&
        tabs[0].tabRenderer.content &&
        tabs[0].tabRenderer.content.richGridRenderer &&
        tabs[0].tabRenderer.content.richGridRenderer.contents
      if (!contents) return []

      for (var i = 0; i < contents.length; i++) {
        var item = contents[i]

        // Standard video
        if (item.richItemRenderer) {
          var vr =
            item.richItemRenderer.content &&
            item.richItemRenderer.content.videoRenderer
          var vid = parseVideo(vr)
          if (vid) videos.push(vid)
        }

        // Section shelf
        if (item.richSectionRenderer) {
          var shelf =
            item.richSectionRenderer.content &&
            item.richSectionRenderer.content.richShelfRenderer &&
            item.richSectionRenderer.content.richShelfRenderer.contents
          if (shelf) {
            for (var s = 0; s < shelf.length; s++) {
              if (shelf[s].richItemRenderer) {
                var svr =
                  shelf[s].richItemRenderer.content &&
                  shelf[s].richItemRenderer.content.videoRenderer
                var svid = parseVideo(svr)
                if (svid) videos.push(svid)
              }
            }
          }
        }
      }
    } catch (e) {
      console.warn('[Juicy Glassy] parseVideos error:', e)
    }

    return videos
  }

  /* ------------------------------------------------------------------ */
  /*  Parse category chips                                               */
  /* ------------------------------------------------------------------ */

  function parseChips(data) {
    if (!data) return []

    try {
      var tabs = data.contents && data.contents.twoColumnBrowseResultsRenderer
        && data.contents.twoColumnBrowseResultsRenderer.tabs
      if (!tabs || !tabs.length) return []

      var header =
        tabs[0].tabRenderer &&
        tabs[0].tabRenderer.content &&
        tabs[0].tabRenderer.content.richGridRenderer &&
        tabs[0].tabRenderer.content.richGridRenderer.header

      var chipBar =
        (header &&
          header.feedFilterChipBarRenderer &&
          header.feedFilterChipBarRenderer.contents) ||
        (header &&
          header.richGridHeaderRenderer &&
          header.richGridHeaderRenderer.feedFilterChipBarRenderer &&
          header.richGridHeaderRenderer.feedFilterChipBarRenderer.contents)

      if (!chipBar) return []

      var chips = []
      for (var i = 0; i < chipBar.length; i++) {
        var chip = chipBar[i].chipCloudChipRenderer
        if (!chip) continue
        var text = textFrom(chip.text)
        if (text) {
          chips.push({ text: text, isSelected: !!chip.isSelected })
        }
      }
      return chips
    } catch (_) {
      return []
    }
  }

  /* ------------------------------------------------------------------ */
  /*  Parse subscriptions from guide                                     */
  /* ------------------------------------------------------------------ */

  function parseSubs(guideData) {
    if (!guideData) return []
    var subs = []

    try {
      var items = guideData.items || []

      for (var i = 0; i < items.length; i++) {
        var section =
          items[i].guideSectionRenderer && items[i].guideSectionRenderer.items
        if (!section) continue

        for (var j = 0; j < section.length; j++) {
          var r = section[j].guideEntryRenderer
          if (!r) continue

          var name = textFrom(r.formattedTitle)
          if (!name) continue

          var avatar = best(r.thumbnail && r.thumbnail.thumbnails)
          var url = ''
          try {
            url =
              r.navigationEndpoint.browseEndpoint.canonicalBaseUrl || ''
          } catch (_) {}

          // Only include real channel avatars
          if (
            avatar &&
            (avatar.indexOf('yt3.ggpht.com') !== -1 ||
              avatar.indexOf('googleusercontent.com') !== -1)
          ) {
            subs.push({ name: name, avatar: avatar, url: url })
          }
        }
      }
    } catch (e) {
      console.warn('[Juicy Glassy] parseSubs error:', e)
    }

    return subs
  }

  /* ------------------------------------------------------------------ */
  /*  Main extraction                                                    */
  /* ------------------------------------------------------------------ */

  function extractAndSend() {
    var ytData = window.ytInitialData
    if (!ytData) return false

    var guideData = window.ytInitialGuideData || null

    var videos = parseVideos(ytData)
    var chips = parseChips(ytData)
    var subscriptions = parseSubs(guideData)

    if (videos.length === 0) return false

    window.postMessage(
      {
        type: MSG_TYPE,
        payload: {
          videos: videos,
          featured: videos[0] || null,
          subscriptions: subscriptions,
          chips: chips,
        },
      },
      '*'
    )

    return true
  }

  /* Initial extract — retry a few times in case data isn't hydrated yet */
  if (!extractAndSend()) {
    setTimeout(extractAndSend, 300)
    setTimeout(extractAndSend, 1000)
    setTimeout(extractAndSend, 2500)
  }

  /* Re-extract on YouTube SPA navigation */
  document.addEventListener('yt-navigate-finish', function () {
    setTimeout(extractAndSend, 600)
  })

  /* ------------------------------------------------------------------ */
  /*  Intercept browse API for infinite-scroll data                      */
  /* ------------------------------------------------------------------ */

  var _fetch = window.fetch
  window.fetch = function () {
    var args = arguments
    var p = _fetch.apply(this, args)

    try {
      var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url)
      if (url && url.indexOf('/youtubei/v1/browse') !== -1) {
        p.then(function (resp) {
          var clone = resp.clone()
          clone.json().then(function (body) {
            var actions = body && body.onResponseReceivedActions
            if (!actions) return
            for (var a = 0; a < actions.length; a++) {
              var ci =
                actions[a].appendContinuationItemsAction &&
                actions[a].appendContinuationItemsAction.continuationItems
              if (!ci) continue
              var newVids = []
              for (var k = 0; k < ci.length; k++) {
                if (ci[k].richItemRenderer) {
                  var vr =
                    ci[k].richItemRenderer.content &&
                    ci[k].richItemRenderer.content.videoRenderer
                  var vid = parseVideo(vr)
                  if (vid) newVids.push(vid)
                }
              }
              if (newVids.length > 0) {
                window.postMessage(
                  { type: MSG_TYPE_APPEND, payload: { videos: newVids } },
                  '*'
                )
              }
            }
          }).catch(function () {})
        }).catch(function () {})
      }
    } catch (_) {}

    return p
  }
})()
