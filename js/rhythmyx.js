
////////////////////////////////////////////////////////////////////////////////
/*	ABOUT THIS PAGE LINK */
////////////////////////////////////////////////////////////////////////////////
var pageInfo = {
  init : function() {
    var footerLinks = $('.footer-global-auxillary > p:first');
    var infoPanel = $('#pageInfo');
    // Hide page info by default
    infoPanel.hide();
    infoPanel.prepend('<h4>About this page</h4>');
    infoPanel.append('<p><a href="#pageInfo" id="pageInfoClose">Close</a></p>');
    // Add About this page link
    footerLinks.append(' | <a id="pageInfoLink" href="#pageInfo">About this page</a>');
    // Bind the About this page link
    $('#pageInfoLink').bind('click', function(e){
      infoPanel.slideToggle('fast');
      $('html, body').animate({scrollTop: infoPanel.offset().top}, 1000);
      e.preventDefault();
    });
    $('#pageInfoClose').bind('click', function(e){
      infoPanel.slideToggle();
    });
  }
}

////////////////////////////////////////////////////////////////////////////////
/*	ACTIVATE MEDIA LINKS */
////////////////////////////////////////////////////////////////////////////////
var mediaLinks = {
  globals : {
    mp3Links : '',
    videoLinks : '',
    videoOverlayLinks : '',
    videoEmbedUrls : '',
    mp3Player : 'http://www.surrey.ac.uk/assets/swf/mp3player.swf',
    videoPlayer : 'http://www.surrey.ac.uk/files/swf/flash_video_player.swf'
  },

  init : function() {
    this.globals.mp3Links = $('.mp3Link');
    if(this.globals.mp3Links.length > 0){
      this.activateMp3Links();
    }
    
    this.globals.videoLinks = $('.videoLink');
    if(this.globals.videoLinks.length > 0){
      this.activateVideoLinks();
    }
    
    this.globals.videoOverlayLinks = $('.videoOverlayLink');
    if(this.globals.videoOverlayLinks.length > 0){
      this.activateVideoOverlayLinks();
    }
    
    this.globals.videoEmbedUrls = $('.uosSnVideoEmbedURL .player');
    if(this.globals.videoEmbedUrls.length > 0){
      this.activateVideoEmbedUrls()
    }
    
  },
  
  // Activate MP3 Links
  activateMp3Links : function() {
    var linkId,playerName,mp3Filename = '';
    this.globals.mp3Links.each(function(i){    
      mp3Filename = $(this).find('a').attr('href');
      linkId = 'mp3link' + i;
      playerName = 'mp3player' + i;
      $(this).attr('id', linkId);
      var so = new SWFObject(mediaLinks.globals.mp3Player, playerName, '300', '80', '8', '#ffffff');
      so.addVariable('mp3Filename', mp3Filename);
      so.write(linkId);
    });
    
  },

  // Activate video links
  activateVideoLinks : function() {
  
    var videoFile, stillFile, videoId, filmWidth, filmHeight, totalWidth, totalHeight, videoClass;
    var i=0;
    var playerWidth = 0, playerHeight = 20;
    this.globals.videoLinks.each(function(){
      // Set default width and height - will be overridden by settings for individual videos
      filmWidth = 640;
      filmHeight = 360;
      i+=1;
      videoFile = $(this).find('a').attr('href');      
      stillFile = $(this).find('.videoStill').attr('title');
      videoClass = $(this).attr('class').split(' ');
      for(var j=0; j<videoClass.length; j++){
        if(videoClass[j].indexOf('width') > -1){
          filmWidth = parseInt(videoClass[j].replace('width', ''));
          }
        if(videoClass[j].indexOf('height') > -1){
          filmHeight = parseInt(videoClass[j].replace('height', ''));
        }
      }
      totalWidth = filmWidth + playerWidth;
      totalHeight = filmHeight + playerHeight;
      videoId = 'video' + i;
      $(this).attr('id', videoId);
      var playerURL = mediaLinks.globals.videoPlayer;
      playerURL = playerURL.replace(/amp;/g, '');
      var so = new SWFObject(playerURL, 'thevideo', totalWidth, totalHeight, '6', '#ffffff');
      so.addVariable('MM_ComponentVersion', '1');
      so.addVariable('height', totalHeight);
      so.addVariable('width', totalWidth);
      so.addVariable('file', videoFile);
      so.addParam('allowfullscreen','true');
      if(stillFile){
        so.addVariable('image', stillFile);
      }
      so.addVariable('searchbar', 'false');
      so.addVariable('showstop', 'true');
      so.write(videoId);
    }); 
    
  },
  
  // Activate video overlay links
  activateVideoOverlayLinks : function(){
    $('body').append('<div id="videoOverlay"><div id="vo_title"></div><div id="vo"></div><div id="vo_close">Close</div></div>');
    $('a.videoOverlayLink').bind('click', function(e){
      var videoFile, stillFile, videoId, filmWidth, filmHeight, totalWidth, totalHeight, videoClass, videoTitle;
      var playerWidth = 0, playerHeight = 20;
      videoTitle = $(this).attr('title');
      e.preventDefault();
      filmWidth = 640;
      filmHeight = 360;
      //i+=1;
      videoFile = $(this).attr('href');      
      stillFile = $(this).find('.videoStill').attr('title');	  
      videoClass = $(this).attr('class').split(' ');
      for(var j=0; j<videoClass.length; j++){
        if(videoClass[j].indexOf('width') > -1){
          filmWidth = parseInt(videoClass[j].replace('width', ''));
        }
        if(videoClass[j].indexOf('height') > -1){
          filmHeight = parseInt(videoClass[j].replace('height', ''));
        }
      }
      totalWidth = filmWidth + playerWidth;
      totalHeight = filmHeight + playerHeight;
      var playerURL = mediaLinks.globals.videoPlayer;
      playerURL = playerURL.replace(/amp;/g, '');
      var so = new SWFObject(playerURL, 'thevideo', totalWidth, totalHeight, '6', '#ffffff');
      so.addVariable('MM_ComponentVersion', '1');
      so.addVariable('height', totalHeight);
      so.addVariable('width', totalWidth);
      so.addVariable('file', videoFile);
      so.addParam('allowfullscreen','true');
      if(stillFile){
        so.addVariable('image', stillFile);
      }
      so.addVariable('searchbar', 'false');
      so.addVariable('autostart', 'true');
      so.addVariable('showstop', 'true');
      so.write('vo');
      $('#vo_title').text(videoTitle);	  
      tb_show(videoTitle,'#TB_inline?height=' + (totalHeight + 60) + '&width=' + (totalWidth + 0) + '&inlineId=videoOverlay&modal=true',null);
      $('#vo_close').bind('click', function(e){
        tb_remove();
      });
	  });  
  },
  
  // Activate video embed URLs
  activateVideoEmbedUrls : function(){    
    this.globals.videoEmbedUrls.each(function(){				
      $(this).html('<iframe class="video-embed" src=http://www.youtube-nocookie.com/embed/'+$(this).parent().find('a').attr('href').replace('http://youtu.be/','')+' frameborder=0 allowfullscreen></iframe>');
    });	  
  //hide video link
  $('.uosSnVideoEmbedURL a').hide();
  }
  
  
}




$(document).ready(function(){
  ////////////////////////////////////////////////////////////////////////////////
  /* Set up About this page information link  */
  ////////////////////////////////////////////////////////////////////////////////
  pageInfo.init();
  
  ////////////////////////////////////////////////////////////////////////////////
  /* Activate MP3 and video links  */
  ////////////////////////////////////////////////////////////////////////////////
  mediaLinks.init();  
});