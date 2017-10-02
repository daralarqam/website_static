/**
 * live method
 * @param types
 * @param data
 * @param fn
 * @returns {$.fn}
 */
/*jslint browser: true */
/*jslint unparam: true */
/*global jQuery, window, FileReader */

$.fn.live = function (types, data, fn) {
  jQuery(this.context).on(types, this.selector, data, fn);
  return this;
};

window.notifies = [];

/**
 * notify
 */
$.extend({
  notify: function (text, type) {
    $('.notifications').append(function () {
      window.notifies.push('.notification-' + (new Date().getTime()));
      return '<div class="notification-' + (new Date().getTime()) + ' notification bottom-right alert alert-' + type + ' alert-dismissible" role="alert">' +
            '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' + text +
           '</div>';
    });
  }
});

/**
 * clean notifies queue
 */
setInterval(function () {
  if (window.notifies.length) {
    $(window.notifies.shift()).remove();
  }
}, 2500);

/**
 * close notify
 */
$('.alert button.close').live('click', function () {
  $(this).parents('.alert').remove();
});

/**
 * show error message
 * @param message
 */
function add_error_message(message) {
  $('.alert.alert-danger').append('<p>' + message + '</p>');
}

/**
 * main structure
 */
$.extend({
  Script: function ($config) {
    $(document).ready(function () {
      var self = this;
      this.controller = window.controller;
      this.method = window.method;
      $.each($config, function (controller, item) {
        if (controller === self.controller) {
          $.each(item, function (index, method) {
            if (self.method === index) {
              method();
            }
          });
        }
      });
    });
  }
});

/**
 * Show errors
 */
function displayAdminErrors(errors) {
  var $html = "";
  $.each(errors, function (index, item) {
    $html += '<p>' + item + '</p>';
  });
  $.gritter.add({
    title: 'Error',
    text: $html,
    class_name: 'gritter-error'
  });
}

$(document).ready(function () {
  /**
   * Tooltip
   */
  $('.tooltip').tooltip();
  /**
   * Spinner
   */
  $(document).on('change', '.spinner input', function () {
    var val = $(this).val();
    $(this).val(!$.isNumeric(val) ? 0 : val);
  });
  $(document).on('click', '.spinner .btn:first-of-type', function () {
    var $this = $(this).closest('.spinner').find('input');
    $this.val(parseInt($this.val(), 10) + 1);
    $this.val(($this.data('max')) !== undefined && $this.val() > $this.data('max') ? $this.data('max') : $this.val());
  });
  $(document).on('click', '.spinner .btn:last-of-type', function () {
    var $this = $(this).closest('.spinner').find('input');
    $this.val(parseInt($this.val(), 10) - 1);
    $this.val(($this.data('min')) !== undefined && $this.val() < $this.data('min') ? $this.data('min') : $this.val());
  });
  /**
   * Mobile main menu
   */
  $(document).on('click', '.show-menu', function (e) {
    e.preventDefault();
    $(this).closest('.navbar-mobile').toggleClass('open');
  });
  $(document).on('click', '.mobile-menu-toggle', function (e) {
    e.preventDefault();
    $(this).siblings('.mobile-menu-submenu').toggleClass('open');
  });
  /**
   * Colorpiker
   */
  if ($.fn.colorpicker) {
    $('.colorpicker').colorpicker();
    $(document).on('shown.bs.modal', '.bootbox', function () {
      $('.colorpicker').colorpicker();
    });
  }
  if ($.fn.chosen) {
    $('.chosen-select').chosen();
  }
  /**
   * Datepicker
   */
  if ($.fn.datepicker) {
    $('.datepicker').datepicker({
      format: 'mm/dd/yyyy',
      todayHighlight: true
    });
  }
  /**
   * Modal popup
   */
  function centerModal() {
    $(this).css('display', 'block');
    // var $dialog = $(this).find(".modal-content");
    // var offset = ($(window).height() - $dialog.height()) / 2;
    // Center modal vertically in window
    //$dialog.css("margin-top", offset);
  }

  $('.modal').on('show.bs.modal', centerModal);
  $(window).on("resize", function () {
    $('.modal:visible').each(centerModal);
  });
});

/**
  * Custom Uploads
  */
$.extend({
  cUploads: function (obj) {
    var reset;
    var addToQueque;
    var uFiles = [];
    var upload_container = $('<div class="upload_container cuploads"></div>');
    var upload_list_container = $('<div class="upload_list_container"></div>');
    var upload_list = $('<div class="upload_list"></div>');
    var upload_button = $('<div class="upload_button btn btn-primary"><i class="fa fa-cloud-download"></i> Browse</div>');
    var upload_remove = $('<div class="upload_remove"><i class="fa fa-times"></i></div>');
    $(obj.selector).after(upload_list_container.css({display: 'none'})
      .append(upload_list));
    upload_list_container.prepend(upload_remove.css({display: 'none'}));
    $(obj.selector).wrap(upload_container);
    $(obj.selector).after(upload_button);

    $(obj.selector).change(function (event) {
      $.each(event.target.files, function (index, file) {
        upload_remove.css({display: 'block'});
        upload_list_container.css({display: 'block'});
        if ((file.size * 0.0000010) < (obj.config.max_size / 1000)) {
          var reader = new FileReader();
          reader.onload = function (event) {
            var object = {};
            object.filename = file.name;
            object.data = event.target.result;
            uFiles.push(object);
            addToQueque(object, event, file);
          };
          reader.onerror = function (event) {
            //error
          };
          reader.readAsDataURL(file);
        } else {
          upload_list.append(function () {
            return '<div class="alert alert-danger" role="alert">' +
              '<p><strong>' + file.name + '</strong>: ' +
              'File size must be less ' + (obj.config.max_size / 1000) + 'MB</p>' +
              '</div>';
          });
        }
      });
    });

    /**
     * Remove queue
     */
    $(document).on('click', '.' + upload_remove.attr('class'), function () {
      uFiles = [];
      upload_list.empty();
      upload_remove.css({display: 'none'});
      upload_list_container.css({display: 'none'});
      reset($(obj.selector));
    });

    reset = function (e) {
      e.wrap('<form>').parent('form').trigger('reset');
      e.unwrap();
    };

    addToQueque = function (item, event, file) {
      var preview = '';
      if (file.type.match(/image\/.*/i)) {
        preview = '<img class="media-object" src="' + event.target.result + '" alt="' + item.filename + '">';
      } else {
        var ext = item.filename.split('.').pop() === item.filename ? "?" : item.filename.split('.').pop();
        preview = '<span class="media-object unc-mime">' + ext + '</span>';
      }

      upload_list.append(function () {
        return '<div class="media">' +
          '<a class="media-left" href="#">' +
          preview +
          '</a>' +
          '<div class="media-body">' +
          '<h4 class="media-heading">File:</h4>' +
          item.filename +
          '</div>' +
          '</div>';
      });
    };
  }
});

/**
 * Avatar
 */
$.extend({
  cAvatar: function (obj) {

    $(obj.el).PictureCut({
      InputOfImageDirectory       : "User_avatar",
      PluginFolderOnServer        : "/js/crop/",
      ActionToSubmitUpload        : "/profile/edit",
      ActionToSubmitCrop          : "/profile/edit",
      DefaultImageButton          : obj.DefaultImageButton,
      FolderOnServer              : "/uploads/avatars/",
      EnableCrop                  : true,
      CropWindowStyle             : "Bootstrap",
      UploadedCallback            : function (e) {
        $(obj.el).append('<div class="actions"><a href="#" data-id="' + e.avatarID + '" class="delete red"><i class="fa fa-times"></i></a></div>');
      }
    }).append('<div class="actions"><a href="#" data-id="' + obj.avatar_id + '" class="delete red"><i class="fa fa-times"></i></a></div>');

    $(document).on('click', obj.el + ' .actions .delete', function (e) {
      var $this = $(this);
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: '/admin/attachment/remove/' + $this.data('id'),
        dataType: "json",
        data: {},
        success: function (data) {
          if (data.status) {
            $(obj.el).css({
              'background-image': 'url(/images/noavatar.png)'
            });
          }
        }
      });
      return false;
    });

    var reset = function (e) {
      e.wrap('<form>').parent('form').trigger('reset');
      e.unwrap();
    };
  }
});

/**
 * Custom Scroll
 */
$.extend({
  cScroll: function (obj) {
    var $el = $(obj.el);
    $el.css({
      height: (obj.height) !== undefined ? obj.height : $(document).height() / 3.5,
      overflow:  'auto'
    });

    $(window).resize(function () {
      $el.css({
        height: (obj.height) !== undefined ? obj.height : $(document).height() / 3.5,
      });
    });
  }
});
/**
 * Social ////
 */
$.extend({
  Social: function (app_id, objs) {
    $.each(objs, function (index, obj) {
      switch (obj.type) {
      case "twitter":
        var pathname = window.location;
        var tweeturl = 'http://twitter.com/share?url=' + encodeURI(pathname) + '&text=' + obj.text;
        $(obj.el).append('<a href="' + tweeturl + '" class="social-new-tab"><img src="/images/icon-twitter.jpg" alt=""><strong>Twitter</strong></a>');
        break;
      case "google":
        var pathname = window.location;
        var googleurl = 'https://plus.google.com/share?url=' + encodeURI(pathname);
        $(obj.el).append('<a href="' + googleurl + '"  class="social-new-tab"><img src="/images/icon-gplus.jpg" alt=""><strong>Google+</strong></a>');
        break;
      case "facebook":
        window.fbAsyncInit = function () {
          FB.init({
            appId      : app_id,
            xfbml      : true,
            version    : 'v2.1'
          });
        };
        (function (d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) { return; }
          js = d.createElement(s);
          js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
        $(obj.el).append('<a href="#" class="fb-share"><img src="/images/icon-facebook.jpg" alt=""><strong>Facebook</strong></a>');
        $(document).on('click', '.fb-share', function (e) {
          FB.ui({
            method: 'feed',
            name: obj.text,
            link: window.location.href,
            //picture: "https://stackexchange.com/users/flair/557969.png",
            caption: "Some description here"
          }, function (response) { });
        });
        break;
      }
    });

    $(document).on('click', '.social-new-tab', function (e) {
      e.preventDefault();
      var $this = $(this);
      window.open($this.attr('href'), "Share", "width=560,height=300,resizable=yes,scrollbars=yes,status=yes");
    });
  }
});
/**
 * Attendance
 */
$.extend({
  Attendance: function () {
    var $modal_body = $('#attendance-modal .modal-body');
    var module_id = null;

    $(document).on('click', '#attendance-form .submit', function (e) {
      e.preventDefault();
      var $this = $(this);
      $('#Attendance_status').val($this.data('status'));
      $('#attendance-form').submit();
    });
    $(document).on('submit', '#attendance-form', function (e) {
      e.preventDefault();
      var $this = $(this);
      $.ajax({
        type: "POST",
        url: '/attendance/handle',
        dataType: "json",
        data: $this.serialize(),
        success: function (data) {
          if (data.status) {
            switch (data.action) {
            case "show_form":
              $this.html(data.html);
              break;
            }
          } else {
            $('#attendance-modal').modal('hide');
          }
        }
      });
    });

    $(document).on('click', '.attendance-btn', function (e) {
      var $this = $(this);
      e.preventDefault();
      $.ajax({
        type: "POST",
        url: '/attendance/mark',
        dataType: "json",
        data: {
          form: $('#attendance-form').serialize(),
          status: $this.data('status')
        },
        success: function (data) {
          if (data.status) {
            if (!data.is_complete) {
              $modal_body.html(data.html);
            } else {
              $('#attendance-modal').modal('hide');
            }
          }
        }
      });
    });
    $('#attendance-modal').on('hidden.bs.modal', function () {
      $modal_body.html('<form id="attendance-form" role="form"><input name="module_id" type="hidden" value="' + module_id + '"><div><input type="text" name="date" value="" id="Attendance_date" class="form-control datepicker"></div><div><button type="button" class="attendance-btn btn btn-primary">Create</button></div></form>');
      if ($.fn.datepicker) {
        $('.datepicker').datepicker({
          format: 'mm/dd/yyyy',
          todayHighlight: true
        });
      }
    });
    $(document).on('click', '.mark-attend-btn', function (e) {
      e.preventDefault();
      module_id = $(this).data('module_id');
      $('#attendance-modal').modal('show');
    });
  }
});

